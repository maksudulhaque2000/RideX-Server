import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { driverControllers } from './driver.controller';

const router = Router();

router.patch(
  '/availability',
  authMiddleware(['driver']),
  driverControllers.updateAvailability,
);

export const DriverRoutes = router;