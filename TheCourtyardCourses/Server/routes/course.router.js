import express from 'express';
import {
  createCourse,
  fetchCourses,
  fetchCourse,
  updateCourse,
  publishCourse,
  deleteCourse,
  enrollCourse,
  updateRatingsCourse,
  fetchRatingsCourse,
  fetchCertificate,
  fetchMyCourses,
  fetchEnrolledCourses,
} from '../controllers/course.controller.js';
import multer from 'multer';
import { verifyToken, isTeacher, isStudent } from '../middleware/auth.middleware.js';
import { uploadCourseAssets } from '../middleware/imageUpload.js';
const courseRouter = express.Router();

// any() -> chapter files na dynamic field names handle karva (fields() "Unexpected field" error faake)
const upload = multer({
  dest: 'upload/',
  limits: { fileSize: 100 * 1024 * 1024, files: 50 },
});

// CRUD
courseRouter.post('/', verifyToken, isTeacher, upload.any(), uploadCourseAssets, createCourse);
courseRouter.get('/', fetchCourses);
courseRouter.get('/me/courses', verifyToken, isTeacher, fetchMyCourses);
courseRouter.get('/me/enrolled', verifyToken, fetchEnrolledCourses);
// courseRouter.get('/me/whishlist', verifyToken, fetchWishlistCourses);
courseRouter.get('/:slug', fetchCourse);
courseRouter.put(
  '/:courseId',
  verifyToken,
  isTeacher,
  upload.any(),
  uploadCourseAssets,
  updateCourse
);
courseRouter.patch('/:courseId/publish', verifyToken, isTeacher, publishCourse);
courseRouter.delete('/:courseId', verifyToken, isTeacher, deleteCourse);

// Enrollment
courseRouter.post('/:courseId/enroll', verifyToken, isStudent, enrollCourse);

// Ratings
courseRouter.post('/:courseId/ratings', verifyToken, updateRatingsCourse);
courseRouter.get('/:courseId/ratings', fetchRatingsCourse);

// Certificate
courseRouter.get('/:courseId/certificate', verifyToken, fetchCertificate);

export default courseRouter;
