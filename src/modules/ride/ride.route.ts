import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { rideControllers } from './ride.controller';

const router = Router();

// Rider Routes
router.post('/request', authMiddleware(['rider']), rideControllers.requestRide);
router.patch('/:id/cancel', authMiddleware(['rider']), rideControllers.cancelRide);
router.get('/history/rider', authMiddleware(['rider']), rideControllers.getRiderHistory);
// Driver Routes
router.get('/requests', authMiddleware(['driver']), rideControllers.getPendingRideRequests);
router.patch('/:id/accept', authMiddleware(['driver']), rideControllers.acceptRide);
router.patch('/:id/status', authMiddleware(['driver']), rideControllers.updateRideStatus);

export const RideRoutes = router;