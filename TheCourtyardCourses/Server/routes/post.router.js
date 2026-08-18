import express from 'express';
import multer from 'multer';
import {
  createPost,
  fetchPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from '../controllers/post.controller.js';
import { verifyToken, optionalVerifyToken } from '../middleware/auth.middleware.js';
import { uploadPostAssets } from '../middleware/imageUpload.js';

const postRouter = express.Router();
const upload = multer({ dest: 'upload/' });

const postUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'files', maxCount: 5 },
]);

// Community posts
postRouter.post(
  '/communities/:communityId/posts',
  verifyToken,
  postUpload,
  uploadPostAssets,
  createPost
);
postRouter.get('/communities/:communityId/posts', optionalVerifyToken, fetchPosts);

// Single post operations
postRouter.put(
  '/communities/:communityId/posts/:postId',
  verifyToken,
  postUpload,
  uploadPostAssets,
  updatePost
);
postRouter.delete('/communities/:communityId/posts/:postId', verifyToken, deletePost);
postRouter.post('/communities/:communityId/posts/:postId/like', verifyToken, likePost);
postRouter.post('/communities/:communityId/posts/:postId/comment', verifyToken, addComment);

export default postRouter;
