import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { rideControllers } from './ride.controller';

const router = Router();

router.post('/request', authMiddleware(['rider']), rideControllers.requestRide);
router.patch('/:id/cancel', authMiddleware(['rider']), rideControllers.cancelRide);
router.get('/history/rider', authMiddleware(['rider']), rideControllers.getRiderHistory);
router.get('/rider/active-ride', authMiddleware(['rider']), rideControllers.getActiveRideAsRider);
router.get('/requests', authMiddleware(['driver']), rideControllers.getPendingRideRequests);
router.patch('/:id/accept', authMiddleware(['driver']), rideControllers.acceptRide);
router.patch('/:id/status', authMiddleware(['driver']), rideControllers.updateRideStatus);
router.get('/driver/active-ride', authMiddleware(['driver']), rideControllers.getActiveRideAsDriver);
router.patch('/:id/reject', authMiddleware(['driver']), rideControllers.rejectRide);
router.get('/history/driver', authMiddleware(['driver']), rideControllers.getDriverHistory);

export const RideRoutes = router;