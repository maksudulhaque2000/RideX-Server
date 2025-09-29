import { Router } from 'express';
import { authControllers } from './auth.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/register', authControllers.registerUser);

router.post('/login', authControllers.loginUser);

router.get(
  '/me',
  authMiddleware(['rider', 'driver', 'admin']),
  authControllers.getMyProfile
);

export const AuthRoutes = router;