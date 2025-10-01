import { Request, Response } from 'express';
import { adminServices } from './admin.service';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUsers(req.query);
    res
      .status(200)
      .json({ success: true, message: 'Users fetched successfully', data: result.data, meta: result.meta });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const getAllDrivers = async (req: Request, res: Response) => {
    try {
      const result = await adminServices.getAllDrivers(req.query);
      res
        .status(200)
        .json({ success: true, message: 'Drivers fetched successfully', data: result.data, meta: result.meta });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch drivers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

const getAllRides = async (req: Request, res: Response) => {
    try {
      const result = await adminServices.getAllRides(req.query);
      res
        .status(200)
        .json({ success: true, message: 'All rides fetched successfully', data: result.data, meta: result.meta });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch rides',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
};

const getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getDashboardAnalytics();
        res.status(200).json({
            success: true,
            message: "Analytics data fetched successfully!",
            data: result
        });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


const manageDriverApproval = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { status } = req.body;
    const result = await adminServices.manageDriverApproval(driverId, status);
    res
      .status(200)
      .json({
        success: true,
        message: `Driver status updated to ${status}`,
        data: result,
      });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: 'Failed to update driver status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

const manageUserBlockStatus = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;
        const result = await adminServices.manageUserBlockStatus(userId, isBlocked);
        res.status(200).json({ success: true, message: `User block status updated`, data: result });
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: 'Failed to update user block status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

const manageUserRole = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const result = await adminServices.manageUserRole(userId, role);
        res.status(200).json({ success: true, message: "User role updated successfully", data: result });
    } catch (error: unknown) {
        res.status(400).json({
            success: false,
            message: 'Failed to update user role',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const adminControllers = {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  getDashboardAnalytics,
  manageDriverApproval,
  manageUserBlockStatus,
  manageUserRole,
};