import { Request, Response } from 'express';
import { Course } from '../models/courseModel';
import { User } from '../models/userModel';
import { validate } from 'class-validator';

class CourseController {
    constructor() {
    }

    async createCourse(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            let course = new Course();
            course.name = name;
            course.description = description;
            const validationErrors = await validate(course);
            if (validationErrors.length > 0) {
                res.status(400).json({ errors: validationErrors });
                return;
            }
            await course.save();
            res.status(201).json({ message: 'Course created successfully', course });
            return;
        } catch (error) {
            res.status(500).json({ message: 'Error while saving the course', error });
            return;
        }
    };

    async updateCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const course = await Course.findOne({ where: { id: parseInt(id) } });
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            } else {
                course.name = name;
                course.description = description;
                const validationErrors = await validate(course);
                if (validationErrors.length > 0) {
                    res.status(400).json({ errors: validationErrors });
                    return;
                }
                await course.save();
                res.status(200).json({ message: 'Course updated successfully', course });
                return;
            }    
        } catch (error) {
            res.status(500).json({ message: 'Error while updating the course', error });
            return;
        }
    };

    async deleteCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const course = await Course.findOne({ where: { id: parseInt(id) } });
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            } else {
                await Course.delete({ id: parseInt(id) });
                res.status(200).json({ message: 'Course deleted successfully' });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while deleting the course', error });
            return;
        }
    };

    async assignCourseToUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId} = req.body;
            const course = await Course.findOne({ where: { id: parseInt(id) }, relations: ['users'] });
            const user = await User.findOne({ where: { id: parseInt(userId) } });
            if (!course || !user) {
                res.status(404).json({ message: 'Course or user not found' });
                return;
            } else {
                course.users.push(user); 
                await course.save();
                res.status(200).json({ message: 'Course assigned to user successfully' });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while assigning course to user', error });
            return;
        }
    };

    async unasignCourseFromUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId} = req.body;
            const course = await Course.findOne({ where: { id: parseInt(id) }, relations: ['users'] });
            const user = await User.findOne({ where: { id: parseInt(userId) } });
            if (!course || !user) {
                res.status(404).json({ message: 'Course or user not found' });
                return;
            } else {
                course.users = course.users.filter(u => u.id !== user.id);
                await course.save();
                res.status(200).json({ message: 'Course unassigned from user successfully' });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while unassigning course from user', error });
            return;
        }
    };
    
    async getCoursesForUser(req: Request, res: Response) {
        try {
            if (req.user) {
                const user = await User.findOne({ where: { id: Number(req.user.id) }, relations: ['courses']  });
                if (!user ) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                } else {
                    res.status(200).json({ courses: user.courses });
                    return;
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while retrieving courses for user', error });
            return;
        }
    };
}

export default new CourseController;
