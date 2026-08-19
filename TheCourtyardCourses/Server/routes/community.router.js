import express from 'express';
import multer from 'multer';
import {
  createCommunity,
  fetchAllCommunity,
  fetchMyCommunities,
  fetchJoinedCommunities,
  fetchCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  updatePermissions,
  fetchMembers,
} from '../controllers/community.controller.js';
import { isTeacher, verifyToken, optionalVerifyToken } from '../middleware/auth.middleware.js';
import { uploadCommunityImages } from '../middleware/imageUpload.js';
import {
  checkValidInputForCreateCommunity,
  generateCommunitySlug,
} from '../middleware/community.middleware.js';

const communityRouter = express.Router();
const upload = multer({ dest: 'upload/' });

// CRUD
communityRouter.post(
  '/',
  verifyToken,
  isTeacher,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'headerImage', maxCount: 1 },
  ]),
  uploadCommunityImages,
  checkValidInputForCreateCommunity,
  generateCommunitySlug,
  createCommunity
);
communityRouter.get('/', fetchAllCommunity);
communityRouter.get('/my', verifyToken, isTeacher, fetchMyCommunities);
communityRouter.get('/joined', verifyToken, fetchJoinedCommunities);
communityRouter.get('/:slug', optionalVerifyToken, fetchCommunity);
communityRouter.put(
  '/:slug',
  verifyToken,
  isTeacher,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'headerImage', maxCount: 1 },
  ]),
  uploadCommunityImages,
  updateCommunity
);
communityRouter.delete('/:slug', verifyToken, isTeacher, deleteCommunity);

// Members
communityRouter.post('/:slug/join', verifyToken, joinCommunity);
communityRouter.post('/:slug/leave', verifyToken, leaveCommunity);
communityRouter.get('/:slug/members', fetchMembers);

// Permissions
communityRouter.put('/:slug/permissions', verifyToken, isTeacher, updatePermissions);

export default communityRouter;
