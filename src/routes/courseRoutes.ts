import express from 'express';
import authController from '../controllers/authController';
import courseController from '../controllers/courseController';

const courseRoutes = express.Router();
courseRoutes.use(authController.authenticate);

courseRoutes.post('/', authController.authorize(['admin']), courseController.createCourse);
courseRoutes.route("/:id")
    .put(authController.authorize(['admin']), courseController.updateCourse)
    .delete(authController.authorize(['admin']), courseController.deleteCourse)
courseRoutes.post('/:id/assign', authController.authorize(['admin']), courseController.assignCourseToUser);
courseRoutes.post('/:id/unassign', authController.authorize(['admin']), courseController.unasignCourseFromUser);
courseRoutes.get('/my-courses', authController.authorize(['alumno']), courseController.getCoursesForUser);

export default courseRoutes;
