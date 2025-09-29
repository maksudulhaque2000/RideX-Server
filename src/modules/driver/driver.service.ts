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

export const driverServices = {
  updateAvailability,
};