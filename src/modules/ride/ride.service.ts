import { Ride } from './ride.model';
import { Driver } from '../driver/driver.model';

const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new Error('Ride not found');
  }

  // Ensure the user cancelling is the rider who requested it
  if (ride.riderId.toString() !== riderId) {
    throw new Error('You are not authorized to cancel this ride');
  }

  // A ride can only be cancelled if it is in 'requested' or 'accepted' state
  if (ride.status !== 'requested' && ride.status !== 'accepted') {
    throw new Error(`Cannot cancel a ride with status: ${ride.status}`);
  }

  ride.status = 'cancelled';
  ride.rideHistory.push({ status: 'cancelled', timestamp: new Date() });
  await ride.save();
  return ride;
};

const getRiderHistory = async (riderId: string) => {
  const rides = await Ride.find({ riderId }).populate('driverId', 'name');
  return rides;
};

const getPendingRideRequests = async (_driverId: string) => {
    const driver = await Driver.findOne({userId: _driverId});
    if(!driver || driver.availability === 'offline' || driver.approvalStatus !== 'approved'){
        throw new Error('You must be an approved and online driver to see requests.')
    }
  const rides = await Ride.find({ status: 'requested' }).populate(
    'riderId',
    'name',
  );
  return rides;
};

const acceptRide = async (rideId: string, driverId: string) => {
    const ride = await Ride.findById(rideId);
    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.status !== 'requested') {
        throw new Error('This ride is no longer available');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ride.driverId = driverId as any;
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
  const validStatuses = ['picked_up', 'in_transit', 'completed'];
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

  ride.status = status as 'picked_up' | 'in_transit' | 'completed';
  ride.rideHistory.push({ status, timestamp: new Date() });
  await ride.save();
  return ride;
};

export const rideServices = {
  cancelRide,
  getRiderHistory,
  getPendingRideRequests,
  acceptRide,
  updateRideStatus,
};