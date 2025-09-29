import { User } from '../user/user.model';
import { Driver } from '../driver/driver.model';
import { Ride } from '../ride/ride.model';

// Get all users (riders) with pagination and search
const getAllUsers = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, searchTerm = '' } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const searchCondition = searchTerm
    ? {
        role: 'rider',
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
      }
    : { role: 'rider' };

  const users = await User.find(searchCondition).skip(skip).limit(Number(limit));
  const total = await User.countDocuments(searchCondition);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: users,
  };
};

// Get all drivers with pagination and search
const getAllDrivers = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, searchTerm = '' } = query;
  const skip = (Number(page) - 1) * Number(limit);
  
  // We will search on the User model first to get matching user IDs
  const userSearchCondition = searchTerm
    ? {
        role: 'driver',
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
      }
    : { role: 'driver' };

  const matchingUsers = await User.find(userSearchCondition).select('_id');
  const matchingUserIds = matchingUsers.map(user => user._id);

  const driverCondition = { userId: { $in: matchingUserIds } };

  const drivers = await Driver.find(driverCondition)
    .populate('userId')
    .skip(skip)
    .limit(Number(limit));
  
  const total = await Driver.countDocuments(driverCondition);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: drivers,
  };
};

// Get all rides with pagination and filtering
const getAllRides = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, status = '' } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filterCondition: Record<string, unknown> = {};
  if (status) {
    filterCondition.status = status;
  }
  
  const rides = await Ride.find(filterCondition)
    .populate('riderId', 'name email')
    .populate('driverId', 'name email')
    .skip(skip)
    .limit(Number(limit));

  const total = await Ride.countDocuments(filterCondition);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: rides,
  };
};

// New function for dashboard analytics
const getDashboardAnalytics = async () => {
    const totalRiders = await User.countDocuments({ role: 'rider' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalRides = await Ride.countDocuments();

    const revenueResult = await Ride.aggregate([
        { $match: { status: 'completed', fare: { $exists: true } } },
        { $group: { _id: null, totalRevenue: { $sum: '$fare' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return {
        totalRiders,
        totalDrivers,
        totalRides,
        totalRevenue,
    };
}


const manageDriverApproval = async (driverUserId: string, status: 'approved' | 'suspended') => {
  const driver = await Driver.findOne({ userId: driverUserId });
  if (!driver) {
    throw new Error('Driver not found');
  }
  driver.approvalStatus = status;
  if (status === 'suspended') {
    driver.availability = 'offline';
  }
  await driver.save();
  return driver;
};

const manageUserBlockStatus = async (userId: string, isBlocked: boolean) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.isBlocked = isBlocked;
  await user.save();
  return user;
};

export const adminServices = {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  getDashboardAnalytics, // Added new service
  manageDriverApproval,
  manageUserBlockStatus,
};