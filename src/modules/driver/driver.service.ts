import mongoose from 'mongoose';
import { Ride } from '../ride/ride.model';
import { Driver } from './driver.model';

const updateAvailability = async (driverUserId: string, availability: 'online' | 'offline') => {
  const driver = await Driver.findOne({ userId: driverUserId });

  if (!driver) {
    throw new Error('Driver profile not found');
  }

  if (driver.approvalStatus === 'suspended' && availability === 'online') {
    throw new Error('Your account is suspended. You cannot go online.');
  }

  driver.availability = availability;
  await driver.save();
  return driver;
};

const getDriverEarnings = async (driverUserId: string) => {
  const completedRides = await Ride.find({
    driverId: driverUserId,
    status: 'completed',
  });

  const totalEarnings = completedRides.reduce(
    (sum, ride) => sum + (ride.fare || 0),
    0,
  );
  const completedRidesCount = completedRides.length;

  return {
    totalEarnings,
    completedRides: completedRidesCount,
  };
};

const getDriverEarningsAnalytics = async (driverUserId: string) => {
    const monthlyEarnings = await Ride.aggregate([
        {
            $match: {
                driverId: new mongoose.Types.ObjectId(driverUserId),
                status: 'completed'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                totalEarnings: { $sum: '$fare' },
                totalRides: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                totalEarnings: 1,
                totalRides: 1
            }
        },
        {
            $sort: { year: 1, month: 1 }
        }
    ]);

    return monthlyEarnings;
}

export const driverServices = {
  updateAvailability,
  getDriverEarnings,
  getDriverEarningsAnalytics,
};