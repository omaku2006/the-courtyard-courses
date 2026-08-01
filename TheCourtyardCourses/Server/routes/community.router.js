import express from "express";
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
} from "../controllers/community.controller.js";
import { isTeacher, verifyToken } from "../middleware/auth.middleware.js";
import {
  checkValidInputForCreateCommunity,
  generateCommunitySlug,
} from "../middleware/community.middleware.js";

const communityRouter = express.Router();

// CRUD
communityRouter.post(
  "/",
  verifyToken,
  isTeacher,
  checkValidInputForCreateCommunity,
  generateCommunitySlug,
  createCommunity
);
communityRouter.get("/", fetchAllCommunity);
communityRouter.get("/:slug", fetchCommunity);
communityRouter.put("/:slug", verifyToken, isTeacher, updateCommunity);
communityRouter.delete("/:slug", verifyToken, isTeacher, deleteCommunity);

// Members
communityRouter.post("/:slug/join", verifyToken, joinCommunity);
communityRouter.post("/:slug/leave", verifyToken, leaveCommunity);
communityRouter.get("/:slug/members", fetchMembers);

// Permissions
communityRouter.put(
  "/:slug/permissions",
  verifyToken,
  isTeacher,
  updatePermissions
);

export default communityRouter;
