import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { validate } from 'class-validator';

export class UserController {
    constructor() {
    }

    async createUser(req: Request, res: Response) {
        try {
            const { email, name, password, role } = req.body;
            let user = new User();
            user.email = email;
            user.name = name;
            user.role = role;
            user.password = password;
            const validationErrors = await validate(user);
            if (validationErrors.length > 0) {
                res.status(400).json({ errors: validationErrors });
                return;
            }
            await user.save();
            res.status(201).json({ message: 'User created successfully', user });
            return;
        } catch (error:any) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(400).json({ message: 'The email is already registered.' });
                return;
            } else {
                res.status(500).json({ message: 'Error while saving the user.' });
                return;
            }
        }
    };

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { email, name, password, role } = req.body;
            const user = await User.findOne({ where: { id: parseInt(id) } });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            } else {
                user.email = email || user.email;
                user.name = name || user.name;
                user.role = role || user.role;
                user.password = password || user.password;
                const validationErrors = await validate(user);
                if (validationErrors.length > 0) {
                    res.status(400).json({ errors: validationErrors });
                    return;
                }
                await user.save();
                res.status(200).json({ message: 'User updated successfully', user });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while updating the user', error });
            return;
        }
    };

    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id: parseInt(id) } });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }else{
                await User.delete({ id: parseInt(id) });
                res.status(200).json({ message: 'User found successfully', user });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while getting the user', error });
            return;
        }
    };

    async getUserByEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }else{
                res.status(200).json({ message: 'User found successfully', user });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while getting the user', error });
            return;
        }
    };

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id: parseInt(id) } });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }else{
                await User.delete({ id: parseInt(id) });
                res.status(200).json({ message: 'User deleted successfully' });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while deleting the user', error });
            return;
        }
    };

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.find();
            res.status(200).json({users: users});
            return;
        } catch (error) {
            res.status(500).json({ message: 'Error to list users', error });
            return;
        }
    };
}

export default new UserController;
