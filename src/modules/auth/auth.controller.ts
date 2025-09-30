import { Request, Response } from 'express';
import { authServices } from './auth.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: result,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};


const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized Access' });
    }
    const userId = req.user.userId;
    const result = await authServices.getMyProfile(userId);
    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully!',
      data: result,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export const authControllers = {
  registerUser,
  loginUser,
  getMyProfile,
};