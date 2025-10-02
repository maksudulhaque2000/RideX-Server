import { Ride } from './ride.model';
import { Driver } from '../driver/driver.model';
import mongoose from 'mongoose';

const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  if (ride.riderId.toString() !== riderId) {
    throw new Error('You are not authorized to cancel this ride');
  }

  if (ride.status !== 'requested' && ride.status !== 'accepted') {
    throw new Error(`Cannot cancel a ride with status: ${ride.status}`);
  }

  ride.status = 'cancelled';
  ride.rideHistory.push({ status: 'cancelled', timestamp: new Date() });
  await ride.save();
  return ride;
};

const getRiderHistory = async (riderId: string, query: Record<string, unknown>) => {
    const { page = 1, limit = 10, status = '' } = query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const queryCondition: Record<string, any> = { riderId };
    if (status) {
        queryCondition.status = status;
    }

    const rides = await Ride.find(queryCondition).populate('driverId', 'name').skip(skip).limit(Number(limit));
    const total = await Ride.countDocuments(queryCondition);

    return {
        meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
        data: rides
    };
};

const getDriverHistory = async (driverId: string, query: Record<string, unknown>) => {
    const { page = 1, limit = 10, status = '' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const queryCondition: Record<string, any> = { driverId };
    if (status) {
        queryCondition.status = status;
    }

    const rides = await Ride.find(queryCondition).populate('riderId', 'name').skip(skip).limit(Number(limit));
    const total = await Ride.countDocuments(queryCondition);

    return {
        meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
        data: rides
    };
}

const getPendingRideRequests = async (driverId: string) => {
    const driver = await Driver.findOne({userId: driverId});
    if(!driver || driver.availability === 'offline' || driver.approvalStatus !== 'approved'){
        throw new Error('You must be an approved and online driver to see requests.')
    }
    const rides = await Ride.find({ 
        status: 'requested',
        rejectedBy: { $nin: [driverId] } 
    }).populate('riderId', 'name');

    return rides;
};

const acceptRide = async (rideId: string, driverId: string) => {
    const existingActiveRide = await Ride.findOne({
        driverId: driverId,
        status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    });

    if (existingActiveRide) {
        throw new Error('You are already on an active ride and cannot accept a new one.');
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.status !== 'requested') {
        throw new Error('This ride is no longer available');
    }

    ride.driverId = new mongoose.Types.ObjectId(driverId);
    ride.status = 'accepted';
    ride.rideHistory.push({ status: 'accepted', timestamp: new Date() });
    await ride.save();
    return ride;
};

const updateRideStatus = async (
  rideId: string,
  driverId: string,
  status: string,
) => {
  const validStatuses = ['picked_up', 'in_transit', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid ride status');
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new Error('Ride not found');
  }
  if (ride.driverId?.toString() !== driverId) {
    throw new Error('You are not assigned to this ride');
  }

  ride.status = status as 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
  ride.rideHistory.push({ status, timestamp: new Date() });
  await ride.save();
  return ride;
};

const getActiveRideAsDriver = async (driverId: string) => {
    const activeRide = await Ride.findOne({
        driverId: driverId,
        status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    }).populate('riderId', 'name email phone');
    return activeRide;
}

const getActiveRideAsRider = async (riderId: string) => {
    const activeRide = await Ride.findOne({
        riderId: riderId,
        status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    }).populate({
        path: 'driverId',
        select: 'name email phone'
    });
    return activeRide;
}

const rejectRide = async (rideId: string, driverId: string) => {
    const ride = await Ride.findByIdAndUpdate(
        rideId, 
        { 
            $addToSet: { rejectedBy: driverId } 
        },
        { new: true }
    );
    if (!ride) {
        throw new Error('Ride not found');
    }
    return ride;
}

export const rideServices = {
  cancelRide,
  getRiderHistory,
  getDriverHistory,
  getPendingRideRequests,
  acceptRide,
  updateRideStatus,
  getActiveRideAsDriver,
  getActiveRideAsRider,
  rejectRide,
};