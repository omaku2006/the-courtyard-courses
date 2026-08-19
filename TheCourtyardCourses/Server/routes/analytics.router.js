import express from 'express';
import {
  fetchStudentAnalytics,
  fetchTeacherAnalytics,
} from '../controllers/analytics.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/users/me/analytics', verifyToken, fetchStudentAnalytics);
analyticsRouter.get('/users/me/teacher-analytics', verifyToken, fetchTeacherAnalytics);

export default analyticsRouter;
