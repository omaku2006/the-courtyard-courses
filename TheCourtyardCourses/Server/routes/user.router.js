import express from 'express';
import multer from 'multer';
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
import { uploadImage } from '../middleware/registrationImageUpload.js';

const userRouter = express.Router();

const upload = multer({ dest: 'upload/' });

// Auth
userRouter.post(
  '/auth/register',
  upload.fields([
    { name: 'avatarImage', maxCount: 1 },
    { name: 'headerImage', maxCount: 1 },
  ]),
  checkValidInputForRegistration,
  uploadImage,
  registerUser
);
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
