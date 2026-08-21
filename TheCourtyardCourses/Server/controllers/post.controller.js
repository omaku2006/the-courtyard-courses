import Post from '../models/post.js';
import Community from '../models/community.js';
import Course from '../models/course.js';
import { deleteFromCloudinary } from '../utils/uploadToCloudinary.js';

const cleanupCloudinary = async (items) => {
  for (const item of items ?? []) {
    if (item?.publicId) {
      try {
        await deleteFromCloudinary(item.publicId);
      } catch {
        // Don't fail the request if cleanup fails
      }
    }
  }
};

const normalizePost = (p) => {
  const obj = typeof p.toObject === 'function' ? p.toObject() : { ...p };
  return {
    ...obj,
    images: Array.isArray(obj.images) ? obj.images : [],
    files: Array.isArray(obj.files) ? obj.files : [],
    likes: Array.isArray(obj.likes) ? obj.likes : [],
    comments: Array.isArray(obj.comments) ? obj.comments : [],
  };
};

export const createPost = async (req, res) => {
  const { communityId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;
  const cloud = req.cloudinaryImages || {};
  const images = Array.isArray(cloud.images) ? cloud.images : [];
  const files = Array.isArray(cloud.files) ? cloud.files : [];

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found!' });
    }

    // ✅ Private gate: enrolled scholars j private gathering ma posts kaari shake
    if (community.isPrivate) {
      const isCreator = community.creator.toString() === userId;
      if (!isCreator) {
        const enrolled = await Course.exists({
          _id: { $in: community.courses ?? [] },
          students: { $in: [userId] },
        });
        if (!enrolled) {
          return res
            .status(403)
            .json({ message: 'This gathering is reserved for enrolled scholars. Pray, enroll in the attached course first.' });
        }
      }
    }

    // ✅ Membership check: faktu members j messages inscribe kari shake
    const isMember = community.members.some((m) => String(m) === String(userId));
    const isCreatorPost = community.creator.toString() === userId;
    if (!isCreatorPost && !isMember) {
      return res
        .status(403)
        .json({ message: 'Join this community before inscribing messages.' });
    }

    const post = await Post.create({
      community: communityId,
      author: userId,
      content,
      images,
      files,
    });

    const populated = await post.populate([
      { path: 'author', select: 'name username avatarImage role' },
    ]);

    return res.status(201).json({
      message: 'Post Created Successfully!',
      post: normalizePost(populated),
    });
  } catch (e) {
    console.error(`Post Creation Error: ${e.message}`);
    await cleanupCloudinary([...images, ...files]);

    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'Content is required to create a post!' });
    }

    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const fetchPosts = async (req, res) => {
  const { communityId } = req.params;

  try {
    // ✅ Private community gate: faktu members j posts fetch kari shake
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found!' });
    }

    // ✅ Private gate: enrolled scholars j private gathering nu content vaanchi shake
    if (community.isPrivate) {
      const userId = req.user?.id;
      const isCreator = userId && community.creator.toString() === userId;

      if (!isCreator) {
        const enrolled =
          userId &&
          (await Course.exists({
            _id: { $in: community.courses ?? [] },
            students: { $in: [userId] },
          }));

        if (!enrolled) {
          return res
            .status(403)
            .json({ message: 'This gathering is reserved for enrolled scholars. Pray, enroll in the attached course first.' });
        }
      }
    }

    const posts = await Post.find({ community: communityId })
      .populate('author', 'name username avatarImage role')
      .populate('comments.author', 'name username avatarImage')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      posts: posts.map(normalizePost),
      totalPosts: posts.length,
      message: 'Community Posts Fetched Successfully!',
    });
  } catch (e) {
    console.error(`Post Fetch Error: ${e.message}`);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { content, removeImages, removeFiles } = req.body;
  const cloud = req.cloudinaryImages || {};
  const newImages = Array.isArray(cloud.images) ? cloud.images : [];
  const newFiles = Array.isArray(cloud.files) ? cloud.files : [];

  try {
    const existingPost = await Post.findOne({ _id: postId, author: userId });
    if (!existingPost) {
      await cleanupCloudinary([...newImages, ...newFiles]);
      return res.status(404).json({
        message: "Post not found or You're not authorized to edit this post!",
      });
    }

    const removeImageIds = removeImages ? JSON.parse(removeImages) : [];
    if (removeImageIds.length > 0) {
      const existingImages = Array.isArray(existingPost.images) ? existingPost.images : [];
      const toRemove = existingImages.filter((img) => removeImageIds.includes(img.publicId));
      await cleanupCloudinary(toRemove);
    }

    const removeFileIds = removeFiles ? JSON.parse(removeFiles) : [];
    if (removeFileIds.length > 0) {
      const existingFiles = Array.isArray(existingPost.files) ? existingPost.files : [];
      const toRemove = existingFiles.filter((f) => removeFileIds.includes(f.publicId));
      await cleanupCloudinary(toRemove);
    }

    const keptImages = (Array.isArray(existingPost.images) ? existingPost.images : []).filter(
      (img) => !removeImageIds.includes(img.publicId)
    );
    const keptFiles = (Array.isArray(existingPost.files) ? existingPost.files : []).filter(
      (f) => !removeFileIds.includes(f.publicId)
    );

    const updateData = {};
    if (content !== undefined) updateData.content = content;
    updateData.images = [...keptImages, ...newImages];
    updateData.files = [...keptFiles, ...newFiles];

    const post = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { $set: updateData },
      { returnDocument: 'after' }
    )
      .populate('author', 'name username avatarImage role')
      .populate('comments.author', 'name username avatarImage');

    return res.status(200).json({
      post: normalizePost(post),
      message: 'Post Edited Successfully!',
    });
  } catch (e) {
    console.error(`Post Update Error: ${e.message}`);
    await cleanupCloudinary([...newImages, ...newFiles]);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findOneAndDelete({ _id: postId, author: userId });

    if (!post) {
      return res.status(404).json({
        message: "Post not found or You're not authorized to delete this post!",
      });
    }

    const allItems = [
      ...(Array.isArray(post.images) ? post.images : []),
      ...(Array.isArray(post.files) ? post.files : []),
    ];
    await cleanupCloudinary(allItems);

    return res.status(200).json({ message: 'Post Deleted Successfully!' });
  } catch (e) {
    console.error(`Post Delete Error: ${e.message}`);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    const isLiked = (Array.isArray(post.likes) ? post.likes : []).includes(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
      { returnDocument: 'after' }
    )
      .populate('author', 'name username avatarImage role')
      .populate('comments.author', 'name username avatarImage');

    return res.status(200).json({
      post: normalizePost(updatedPost),
      message: isLiked ? 'Post Unliked!' : 'Post Liked!',
      isLiked: !isLiked,
    });
  } catch (e) {
    console.error(`Post Like Error: ${e.message}`);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({
      message: 'Please write something in the comment!',
    });
  }

  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: { author: userId, content } } },
      { returnDocument: 'after' }
    )
      .populate('author', 'name username avatarImage role')
      .populate('comments.author', 'name username avatarImage');

    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    return res.status(200).json({
      post: normalizePost(post),
      message: 'Comment added successfully!',
    });
  } catch (e) {
    console.error(`Post Comment Error: ${e.message}`);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};
