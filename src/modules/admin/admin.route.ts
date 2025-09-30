import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminControllers } from './admin.controller';

const router = Router();

router.get('/users', authMiddleware(['admin']), adminControllers.getAllUsers);
router.get('/drivers', authMiddleware(['admin']), adminControllers.getAllDrivers);
router.get('/rides', authMiddleware(['admin']), adminControllers.getAllRides);
router.get('/analytics', authMiddleware(['admin']), adminControllers.getDashboardAnalytics);


router.patch(
    '/drivers/:driverId/approval',
    authMiddleware(['admin']),
    adminControllers.manageDriverApproval,
);

router.patch(
    '/users/:userId/block',
    authMiddleware(['admin']),
    adminControllers.manageUserBlockStatus
);

export const AdminRoutes = router;