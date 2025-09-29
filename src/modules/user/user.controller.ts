import { Request, Response } from 'express';
import { userServices } from './user.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const userId = req.user.userId;
    const profileData = req.body;

    const result = await userServices.updateMyProfileInDB(userId, profileData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error,
    });
  }
};

export const userControllers = {
  updateMyProfile,
};