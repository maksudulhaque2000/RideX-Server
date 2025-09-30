import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { driverControllers } from './driver.controller';

const router = Router();

router.patch(
  '/availability',
  authMiddleware(['driver']),
  driverControllers.updateAvailability,
);

router.get(
  '/me/earnings',
  authMiddleware(['driver']),
  driverControllers.getDriverEarnings,
);

router.get(
    '/me/earnings-analytics',
    authMiddleware(['driver']),
    driverControllers.getDriverEarningsAnalytics
);

export const DriverRoutes = router;