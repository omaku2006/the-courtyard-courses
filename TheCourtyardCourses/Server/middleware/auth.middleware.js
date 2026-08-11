import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const checkValidInputForRegistration = (req, res, next) => {
  const { name, email, username, password, role } = req.body;

  if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
  if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });
  if (!username?.trim()) return res.status(400).json({ message: 'Username is required' });
  if (!password) return res.status(400).json({ message: 'Password is required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const usernameRegex = /^[a-z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message: 'Username must be lowercase, no spaces, only letters, numbers, and underscores',
    });
  }

  if (role && !['teacher', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either "teacher" or "student"' });
  }

  next();
};

export const checkValidInputForLogin = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username?.trim() && !email?.trim()) {
    return res.status(400).json({ message: 'Username or Email is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  }

  next();
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied!' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      username: user.username,
    };

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid Token!' });
  }
};

export const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can perform this action!' });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can perform this action!' });
  }
  next();
};
