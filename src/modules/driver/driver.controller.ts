import { Request, Response } from 'express';
import { driverServices } from './driver.service';

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
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

export const driverControllers = {
  updateAvailability,
};