import express from 'express';
import upload from '../middleware/upload.js';
import { authMiddleware } from '../middleware/authenticate.js';
import { uploadProfileImage } from '../controllers/user.controller.js';
import { getUserById , updateUser , getUserPoints , getAllUsers} from '../controllers/user.controller.js';

const UsersRouter = express.Router();

UsersRouter.use(authMiddleware);

UsersRouter.get('/', getAllUsers);
UsersRouter.get('/:id', getUserById);
UsersRouter.patch('/:id', updateUser);
UsersRouter.get('/:id/points', getUserPoints);
UsersRouter.post('/:id/profile-image', authMiddleware, upload.single('image'), uploadProfileImage);


export default UsersRouter;
