import { Request, Response } from 'express';
import { authServices } from './auth.service';

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: result,
    });
  } catch (error: unknown) { // পরিবর্তন এখানে: any -> unknown
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      // পরিবর্তন এখানে: এররের ধরন যাচাই করা হয়েছে
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
  } catch (error: unknown) { // পরিবর্তন এখানে: any -> unknown
    res.status(500).json({
      success: false,
      message: 'Login failed',
       // পরিবর্তন এখানে: এররের ধরন যাচাই করা হয়েছে
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

const getMyProfile = async (req: unknown, res: Response) => {
  try {
    const userId = req.user.userId;
    const result = await authServices.getMyProfile(userId);
    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully!',
      data: result,
    });
  } catch (error: unknown) { // পরিবর্তন এখানে: any -> unknown
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
       // পরিবর্তন এখানে: এররের ধরন যাচাই করা হয়েছে
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export const authControllers = {
  registerUser,
  loginUser,
  getMyProfile,
};