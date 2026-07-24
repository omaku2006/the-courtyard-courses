import express from 'express';
import {
  registerUser,
  loginUser,
  fetchProfile,
  fetchMyProfile,
  updateUser,
  deleteUser,
  fetchMyCourses,
  fetchMyWishlist,
} from '../controllers/auth.controller.js';
import {
  checkValidInputForRegistration,
  checkValidInputForLogin,
  verifyToken,
} from '../middleware/auth.middleware.js';

const userRouter = express.Router();

// Auth
userRouter.post('/auth/register', checkValidInputForRegistration, registerUser);
userRouter.post('/auth/login', checkValidInputForLogin, loginUser);

// Profile
userRouter.get('/users/me/profile', verifyToken, fetchMyProfile); // Private
userRouter.get('/users/:username', fetchProfile); // Public
userRouter.put('/users/:username', verifyToken, updateUser);
userRouter.delete('/users/:username', verifyToken, deleteUser);

// User Data
userRouter.get('/users/me/courses', verifyToken, fetchMyCourses);
userRouter.get('/users/me/wishlist', verifyToken, fetchMyWishlist);

export default userRouter;
