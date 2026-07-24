import express from 'express';
import {
  createPost,
  fetchPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from '../controllers/post.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const postRouter = express.Router();

postRouter.post('/communities/:communityId/posts', verifyToken, createPost);
postRouter.get('/communities/:communityId/posts', fetchPosts);
postRouter.put('/posts/:postId', verifyToken, updatePost);
postRouter.delete('/posts/:postId', verifyToken, deletePost);
postRouter.post('/posts/:postId/like', verifyToken, likePost);
postRouter.post('/posts/:postId/comment', verifyToken, addComment);

export default postRouter;
