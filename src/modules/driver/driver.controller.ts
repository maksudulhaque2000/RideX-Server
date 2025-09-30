import { Request, Response } from 'express';
import { driverServices } from './driver.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const updateAvailability = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const driverUserId = req.user.userId;
    const { availability } = req.body;
    const result = await driverServices.updateAvailability(driverUserId, availability);
    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: result,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: 'Failed to update availability',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const getDriverEarnings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const driverId = req.user.userId;
    const result = await driverServices.getDriverEarnings(driverId);
    res.status(200).json({
      success: true,
      message: 'Earnings data fetched successfully!',
      data: result,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch earnings data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const getDriverEarningsAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const driverId = req.user.userId;
        const result = await driverServices.getDriverEarningsAnalytics(driverId);
        res.status(200).json({
            success: true,
            message: "Earnings analytics fetched successfully!",
            data: result
        });
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: 'Failed to fetch earnings analytics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const driverControllers = {
  updateAvailability,
  getDriverEarnings,
  getDriverEarningsAnalytics,
};