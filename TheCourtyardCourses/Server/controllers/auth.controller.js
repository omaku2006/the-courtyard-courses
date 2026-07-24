import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const registerUser = async (req, res) => {
  const {
    name,
    email,
    username,
    avatarImage,
    headerImage,
    password,
    role,
    occupation,
    experience,
    subjects,
    description,
  } = req.body;

  if (!['teacher', 'student'].includes(role)) {
    return res.status(400).json({
      message: 'Role must be either "teacher" or "student"',
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this username or email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const user = await User.create({
      name,
      email,
      username,
      avatarImage,
      headerImage,
      password: hashedPassword,
      role,
      occupation,
      experience,
      subjects,
      description,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (e) {
    console.error('Register Error:', e.message);

    if (e.code === 11000) {
      return res.status(400).json({
        message: 'Username or email already exists',
      });
    }

    return res.status(500).json({
      message: 'Error while registering user',
      error: e.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: username || '' }, { email: email || '' }],
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'Invalid username/email or password!',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials!',
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ user: userObj, token });
  } catch (e) {
    console.error('Login Error:', e.message);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export const updateUser = async (req, res) => {
  const { username } = req.params;

  if (req.user.username !== username) {
    return res.status(403).json({
      message: 'You can only update your own profile!',
    });
  }

  const { name, avatarImage, headerImage, occupation, experience, subjects, description } =
    req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (avatarImage !== undefined) updateData.avatarImage = avatarImage;
    if (headerImage !== undefined) updateData.headerImage = headerImage;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (experience !== undefined) updateData.experience = experience;
    if (subjects !== undefined) updateData.subjects = subjects;
    if (description !== undefined) updateData.description = description;

    const result = await User.updateOne({ username }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully!',
    });
  } catch (e) {
    console.error('Update Error:', e.message);
    return res.status(500).json({
      message: 'Unable to update profile!',
    });
  }
};

export const fetchProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate('courses').populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ user: userObj });
  } catch (e) {
    console.error('Fetch Profile Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('courses').populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ user: userObj });
  } catch (e) {
    console.error('Fetch My Profile Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'courses',
      populate: { path: 'creator', select: 'name username avatarImage' },
    });

    return res.status(200).json({ courses: user.courses });
  } catch (e) {
    console.error('Fetch My Courses Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const fetchMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: { path: 'creator', select: 'name username avatarImage' },
    });

    return res.status(200).json({ wishlist: user.wishlist });
  } catch (e) {
    console.error('Fetch My Wishlist Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

export const deleteUser = async (req, res) => {
  const { username } = req.params;

  if (req.user.username !== username) {
    return res.status(403).json({
      message: 'You can only delete your own account!',
    });
  }

  try {
    const user = await User.findOneAndDelete({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Account deleted successfully!',
    });
  } catch (e) {
    console.error('Delete Error:', e.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};
