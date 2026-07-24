import express from 'express';
import {
  createCommunity,
  fetchAllCommunity,
  fetchCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  updatePermissions,
  fetchMembers,
} from '../controllers/community.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const communityRouter = express.Router();

// CRUD
communityRouter.post('/', verifyToken, createCommunity);
communityRouter.get('/', fetchAllCommunity);
communityRouter.get('/:communityId', fetchCommunity);
communityRouter.put('/:communityId', verifyToken, updateCommunity);
communityRouter.delete('/:communityId', verifyToken, deleteCommunity);

// Members
communityRouter.post('/:communityId/join', verifyToken, joinCommunity);
communityRouter.post('/:communityId/leave', verifyToken, leaveCommunity);
communityRouter.get('/:communityId/members', fetchMembers);

// Permissions
communityRouter.put('/:communityId/permissions', verifyToken, updatePermissions);

export default communityRouter;
