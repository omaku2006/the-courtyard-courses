import express from 'express';
import {
  fetchSchedule,
  createSchedule,
  deleteSchedule,
  fetchDailyActivity,
} from '../controllers/schedule.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const scheduleRouter = express.Router();

scheduleRouter.get('/users/me/schedule', verifyToken, fetchSchedule);
scheduleRouter.post('/users/me/schedule', verifyToken, createSchedule);
scheduleRouter.delete('/users/me/schedule/:scheduleId', verifyToken, deleteSchedule);
scheduleRouter.get('/users/me/daily-activity', verifyToken, fetchDailyActivity);

export default scheduleRouter;
