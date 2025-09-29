import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { userControllers } from './user.controller';

const router = Router();

router.patch(
  '/me',
  authMiddleware(['admin', 'driver', 'rider']),
  userControllers.updateMyProfile,
);

export const UserRoutes = router;