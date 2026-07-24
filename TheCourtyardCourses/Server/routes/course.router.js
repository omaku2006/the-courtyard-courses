import express from 'express';
import {
  createCourse,
  fetchCourses,
  fetchCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateRatingsCourse,
  fetchRatingsCourse,
  fetchCertificate,
  fetchMyCourses,
  fetchEnrolledCourses,
} from '../controllers/course.controller.js';

import { verifyToken, isTeacher, isStudent } from '../middleware/auth.middleware.js';
const courseRouter = express.Router();

// CRUD
courseRouter.post('/', verifyToken, isTeacher, createCourse);
courseRouter.get('/', fetchCourses);
courseRouter.get('/me/courses', verifyToken, isTeacher, fetchMyCourses);
courseRouter.get('/me/enrolled', verifyToken, fetchEnrolledCourses);
courseRouter.get('/:slug', fetchCourse);
courseRouter.put('/:courseId', verifyToken, isTeacher, updateCourse);
courseRouter.delete('/:courseId', verifyToken, isTeacher, deleteCourse);

// Enrollment
courseRouter.post('/:courseId/enroll', verifyToken, isStudent, enrollCourse);

// Ratings
courseRouter.post('/:courseId/ratings', verifyToken, updateRatingsCourse);
courseRouter.get('/:courseId/ratings', fetchRatingsCourse);

// Certificate
courseRouter.get('/:courseId/certificate', verifyToken, fetchCertificate);

export default courseRouter;
