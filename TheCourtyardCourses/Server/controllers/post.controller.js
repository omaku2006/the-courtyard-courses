import Post from "../models/post.js"; // ✅ .js extension add karyu

export const createPost = async (req, res) => {
  const { communityId } = req.params;
  const userId = req.user.id;
  const { content, images } = req.body;

  try {
    // ✅ 1. Dynamic data object banavo (Undefined overwrite atkava mate)
    const postData = {};
    if (content !== undefined) postData.content = content;
    if (images !== undefined) postData.images = images;

    // ✅ 2. Spread operator (...) thi postData ne merge karo
    const post = await Post.create({
      community: communityId,
      author: userId,
      ...postData,
    });

    // ✅ 3. Creation mate 201 status code
    return res.status(201).json({
      message: "Post Created Successfully!",
      post, // ✅ Frontend ne navu post pan mokli do
    });
  } catch (e) {
    // ✅ 4. console.error use karo
    console.error(`Post Creation Error: ${e.message}`);

    // ✅ Validation error handle karo (jo content na hoy toh)
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Content is required to create a post!" });
    }

    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const fetchPosts = async (req, res) => {
  const { communityId } = req.params;

  try {
    // ✅ 1. Variable naam 'posts' (plural) rakho kyarek array aave chhe
    // ✅ 2. .sort() add karyo (Nava posts upar aave)
    // ✅ 3. .populate() add karyo (Author ni details lakva mate)
    const posts = await Post.find({ community: communityId })
      .populate("author", "name username avatarImage") // Post no author
      .populate("comments.author", "name username avatarImage") // Comment no author
      .sort({ createdAt: -1 }); // ✅ Newest posts first

    // ✅ 4. Array ni length check karo (0 hoy toh posts nathi)
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found in this community!" });
    }

    return res.status(200).json({
      posts,
      totalPosts: posts.length, // ✅ Bonus: Total posts count
      message: "Community Posts Fetched Successfully!",
    });
  } catch (e) {
    console.error(`Post Fetch Error: ${e.message}`);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { content, images } = req.body;

  // ✅ Dynamic update object (Ekdum sari rite banavyu chhe!)
  let updateData = {};
  if (content !== undefined) updateData.content = content;
  if (images !== undefined) updateData.images = images;

  try {
    // ✅ 1. Sahi _id (single underscore)
    // ✅ 2. .populate() ne 'await' thi PEHLA chain karyu
    // ✅ 3. .sort() remove karyu (findOneAndUpdate mate need nathi)
    const post = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { $set: updateData },
      { new: true }
    )
      .populate("author", "name username avatarImage")
      .populate("comments.author", "name username avatarImage");

    // ✅ 4. 404 Not Found status code
    if (!post) {
      return res.status(404).json({
        message: "Post not found or You're not authorized to edit this post!",
      });
    }

    return res.status(200).json({
      post,
      message: "Post Edited Successfully!",
    });
  } catch (e) {
    // ✅ 5. Sahi error message
    console.error(`Post Update Error: ${e.message}`);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    // ✅ 1 Query ma j authorization ane deletion (Ekdum solid logic!)
    const post = await Post.findOneAndDelete({
      _id: postId,
      author: userId,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found or You're not authorized to delete this post!",
      });
    }

    return res.status(200).json({
      message: "Post Deleted Successfully!",
    });
  } catch (e) {
    // ✅ Copy-paste error fixed
    console.error(`Post Delete Error: ${e.message}`);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    // ✅ Check karo: User pahle thi like karyu chhe ke nahi?
    const isLiked = post.likes.includes(userId);

    let updatedPost;

    if (isLiked) {
      // ❌ Unlike karo ($pull thi remove karo)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );

      return res.status(200).json({
        post: updatedPost,
        message: "Post Unliked!",
        isLiked: false,
      });
    } else {
      // ✅ Like karo ($addToSet thi add karo)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );

      return res.status(200).json({
        post: updatedPost,
        message: "Post Liked!",
        isLiked: true,
      });
    }
  } catch (e) {
    console.error(`Post Like Error: ${e.message}`);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  // ✅ 1. Sahi tarike content extract karo
  const { content } = req.body;

  // ✅ 2. Empty string check pan add karo
  if (!content || content.trim() === "") {
    return res.status(400).json({
      message: "Please write something in the comment!",
    });
  }

  try {
    // ✅ 3. 'comments' array ma object push karo
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            author: userId,
            content,
          },
        },
      },
      { new: true }
    )
      .populate("author", "name username avatarImage") // Post no author
      .populate("comments.author", "name username avatarImage"); // Comment no author (Bonus!)

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    return res.status(200).json({
      post,
      message: "Comment added successfully!",
    });
  } catch (e) {
    console.error(`Post Comment Error: ${e.message}`);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
