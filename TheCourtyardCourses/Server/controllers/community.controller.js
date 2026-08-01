import Community from "../models/community.js"; // ✅ .js extension add karo (ES Modules mate)

export const createCommunity = async (req, res) => {
  const { name, description, isPrivate, canEveryOneMessage, slug } = req.body;
  const creator = req.user.id;

  try {
    const community = await Community.create({
      name,
      description,
      isPrivate: isPrivate || false,
      canEveryOneMessage: canEveryOneMessage || false,
      slug,
      creator,
      members: [creator], // ✅ Creator ne first member banao
      memberCount: 1, // ✅ Initial count 1 rakho
    });

    // ✅ 2. Creation mate 201 (Created) status code vaparvo
    return res.status(201).json({
      message:
        "Community Created Successfully! Now you can update the thumbnail & other information.",
      community: {
        _id: community._id,
        name: community.name,
        slug: community.slug,
        memberCount: community.memberCount,
      },
    });
  } catch (e) {
    console.error("Create Community Error:", e.message); // ✅ Debugging mate error print karo

    // ✅ Duplicate slug error handle karo
    if (e.code === 11000) {
      return res
        .status(400)
        .json({ message: "Community with this slug already exists!" });
    }

    // ✅ Dot (.) use karo comma (,) nahi
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const fetchAllCommunity = async (req, res) => {
  try {
    // ✅ Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Only required fields (no sensitive data)
    const communities = await Community.find()
      .select("-__v")
      .populate("creator", "name username avatarImage") // ✅ Creator details
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // ✅ Newest first

    // ✅ Total count for pagination
    const totalCommunities = await Community.countDocuments();
    const totalPages = Math.ceil(totalCommunities / limit);

    return res.status(200).json({
      communities,
      pagination: {
        currentPage: page,
        totalPages,
        totalCommunities,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
      message: "All Communities Fetched Successfully!",
    });
  } catch (e) {
    console.error("Fetch Communities Error:", e.message); // ✅ Error log
    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

export const fetchCommunity = async (req, res) => {
  const { slug } = req.params; // ✅ Variable naam 'slug' rakho

  try {
    const community = await Community.findOne({ slug }) // ✅ Clean syntax
      .select("-__v")
      .populate("creator", "name username avatarImage")
      .populate("members", "name username avatarImage"); // ✅ Bonus: Members ni basic details pan lakho

    // ✅ 404 Check
    if (!community) {
      return res.status(404).json({ message: "Community not found!" });
    }

    return res.status(200).json({
      community,
      message: "Community fetched successfully!",
    });
  } catch (e) {
    console.error("Fetch Community Error:", e.message);
    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

export const updateCommunity = async (req, res) => {
  const {
    name,
    description,
    thumbnail,
    canEveryOneMessage,
    userMessagePermission,
    isPrivate,
  } = req.body;

  // ✅ 1. Sahi tarike slug extract karo
  const { slug } = req.params;
  const teacherId = req.user.id;

  try {
    // ✅ 2. Pehla community shodho (Authorization check karva mate)
    const community = await Community.findOne({ slug });

    if (!community) {
      return res.status(404).json({ message: "Community does not exist!" });
    }

    // ✅ 3. Authorization Check: Faktu creator j update kari shake
    if (community.creator.toString() !== teacherId) {
      return res.status(403).json({
        message: "You are not authorized to update this community!",
      });
    }

    // ✅ 4. updateData OBJECT hovu joie, Array nahi!
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (canEveryOneMessage !== undefined)
      updateData.canEveryOneMessage = canEveryOneMessage;
    if (userMessagePermission !== undefined)
      updateData.userMessagePermission = userMessagePermission;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    // ✅ 5. Update karo with { new: true }
    const updatedCommunity = await Community.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true } // ✅ Navu updated document return kare
    );

    return res.status(200).json({
      message: "Community updated successfully!",
      community: updatedCommunity,
    });
  } catch (e) {
    console.error("Update Community Error:", e.message);

    // ✅ Duplicate slug error handle karo (jo user naam badle ane te existing slug banay)
    if (e.code === 11000) {
      return res
        .status(400)
        .json({ message: "Community with this name already exists!" });
    }

    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

export const deleteCommunity = async (req, res) => {
  const { slug } = req.params;
  const teacherId = req.user.id;

  try {
    // ✅ 1 Query ma j slug ane creator match karo ane delete karo
    const deletedCommunity = await Community.findOneAndDelete({
      slug,
      creator: teacherId, // ✅ Authorization check database level par j thai gayo!
    });

    // ✅ Jo null aave, etle ya toh community exist j nathi karti, ya toh creator match nathi karyo
    if (!deletedCommunity) {
      return res.status(404).json({
        message: "Community not found or you are not authorized to delete it!",
      });
    }

    return res.status(200).json({
      message: "Community deleted successfully!",
    });
  } catch (e) {
    console.error("Delete Community Error:", e.message);
    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

export const joinCommunity = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;

  try {
    // ✅ 1. Pehla community shodho (Duplicate check karva mate)
    const community = await Community.findOne({ slug });

    if (!community) {
      return res.status(404).json({ message: "Community not found!" });
    }

    // ✅ 2. Check karo: User pahle thi j member toh nathi ne?
    if (community.members.includes(userId)) {
      return res.status(400).json({
        message: "You are already a member of this community!",
      });
    }

    // ✅ 3. $push thi member add karo ane $inc thi count vadharo
    const updatedCommunity = await Community.findOneAndUpdate(
      { slug },
      {
        $push: { members: userId }, // ✅ Array ma add karo
        $inc: { memberCount: 1 }, // ✅ Number ne 1 thi vadharo
      },
      { new: true } // ✅ Navu updated document return kare
    );

    return res.status(200).json({
      message: "You are now a member of this community!",
      community: updatedCommunity,
    });
  } catch (e) {
    console.error("Join Community Error:", e.message);
    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

export const leaveCommunity = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;

  try {
    // ✅ Filter ma j slug ane members (userId) check karo
    const updatedCommunity = await Community.findOneAndUpdate(
      {
        slug,
        members: userId, // ✅ Faktu j community ma user member chhe tya j update thashe
      },
      {
        $pull: { members: userId },
        $inc: { memberCount: -1 },
      },
      { new: true }
    );

    // ✅ Jo null aave, etle ya toh community exist j nathi, ya toh user member j nathi
    if (!updatedCommunity) {
      return res.status(404).json({
        message: "Community not found or you are not a member!",
      });
    }

    return res.status(200).json({
      message: "You have successfully left the community!",
      community: updatedCommunity,
    });
  } catch (e) {
    console.error("Leave Community Error:", e.message);
    return res
      .status(500)
      .json({ message: "Something went wrong!", error: e.message });
  }
};

export const fetchMembers = async (req, res) => {
  const { slug } = req.params;

  try {
    // ✅ 1. Community shodho ane members populate karo
    const community = await Community.findOne({ slug }).populate({
      path: "members", // ✅ Kaya field ne populate karvu chhe
      select: "name username avatarImage badges", // ✅ Kay fields lakva chhe (description user ma nathi hotu toh remove karyu)
    });

    // ✅ 2. Null check with 404 status
    if (!community) {
      return res.status(404).json({ message: "Community not found!" });
    }

    // ✅ 3. Response ma faktu members ni list moklo (Clean response)
    return res.status(200).json({
      members: community.members,
      totalMembers: community.memberCount,
      message: "All members fetched successfully!",
    });
  } catch (e) {
    console.error("Fetch Members Error:", e.message);
    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

export const updatePermissions = async (req, res) => {
  const { slug } = req.params;
  const { canEveryOneMessage, isPrivate } = req.body;
  const teacherId = req.user.id;

  try {
    // ✅ 1. Dynamic update object banavo (Undefined overwrite atkava mate)
    const updateData = {};
    if (canEveryOneMessage !== undefined)
      updateData.canEveryOneMessage = canEveryOneMessage;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    // ✅ 2. $set operator use karo
    const community = await Community.findOneAndUpdate(
      { slug, creator: teacherId }, // ✅ Smart authorization check!
      { $set: updateData }, // ✅ Sahi syntax
      { new: true } // ✅ Navu document return kare
    );

    if (!community) {
      return res.status(404).json({
        message: "Community not found OR You're not authorised!",
      });
    }

    return res.status(200).json({
      community,
      message: "Permissions updated successfully!",
    });
  } catch (e) {
    // ✅ 3. Sahi error message
    console.error("Update Permissions Error:", e.message);
    return res.status(500).json({
      message: "Something went wrong!",
      error: e.message,
    });
  }
};
