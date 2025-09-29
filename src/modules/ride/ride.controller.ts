import { Request, Response } from 'express';
import { Ride } from './ride.model';
import { rideServices } from './ride.service';

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const requestRide = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { pickupLocation, destinationLocation } = req.body;
    const riderId = req.user.userId;

    const newRide = new Ride({
      riderId,
      pickupLocation,
      destinationLocation,
      rideHistory: [{ status: 'requested', timestamp: new Date() }],
    });

    const savedRide = await newRide.save();
    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      data: savedRide,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Failed to request ride',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const cancelRide = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const riderId = req.user.userId;
        const result = await rideServices.cancelRide(id, riderId);
        res.status(200).json({
            success: true,
            message: 'Ride cancelled successfully',
            data: result,
        });
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: 'Failed to cancel ride',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

const getRiderHistory = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const riderId = req.user.userId;
        const result = await rideServices.getRiderHistory(riderId);
        res.status(200).json({
            success: true,
            message: 'Ride history fetched successfully',
            data: result,
        });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ride history',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

const getPendingRideRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const driverId = req.user.userId;
        const result = await rideServices.getPendingRideRequests(driverId);
        res.status(200).json({ success: true, message: 'Pending ride requests fetched', data: result });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

const acceptRide = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const driverId = req.user.userId;
        const result = await rideServices.acceptRide(id, driverId);
        res.status(200).json({ success: true, message: 'Ride accepted successfully', data: result });
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: 'Failed to accept ride',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

const updateRideStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const { status } = req.body;
        const driverId = req.user.userId;
        const result = await rideServices.updateRideStatus(id, driverId, status);
        res.status(200).json({ success: true, message: `Ride status updated to ${status}`, data: result });
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: 'Failed to update status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};


export const rideControllers = {
  requestRide,
  cancelRide,
  getRiderHistory,
  getPendingRideRequests,
  acceptRide,
  updateRideStatus,
};