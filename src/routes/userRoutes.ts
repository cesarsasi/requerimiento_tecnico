import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';

const userRouter = express.Router();
userRouter.use(authController.authenticate);

userRouter.post('/', authController.authorize(['admin']), userController.createUser);
userRouter.get('/', authController.authorize(['admin']), userController.getAllUsers);
userRouter.route("/:id")
    .get(authController.authorize(['admin']), userController.getUser)
    .put(authController.authorize(['admin']), userController.updateUser)
    .delete(authController.authorize(['admin']), userController.deleteUser);
userRouter.get('/by-email', authController.authorize(['admin']), userController.getUserByEmail);


export default userRouter;
