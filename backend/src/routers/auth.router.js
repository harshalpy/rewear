import express from 'express';
import { Login, Register, Me } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authenticate.js';


const AuthRouter = express.Router();

AuthRouter.get('/me', authMiddleware, Me);
AuthRouter.post('/register', Register);
AuthRouter.post('/login', Login);

export default AuthRouter;