import { User } from './user.model';
import { Driver } from '../driver/driver.model';

const updateMyProfileInDB = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  const { name, phone, address, vehicleDetails, licenseNumber } = payload;

  const updatedUserData: Record<string, unknown> = {};
  if (name) updatedUserData.name = name;
  if (phone) updatedUserData.phone = phone;
  if (address) updatedUserData.address = address;
  
  const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new Error('User not found!');
  }

  if (updatedUser.role === 'driver') {
    const updatedDriverData: Record<string, unknown> = {};
    if (vehicleDetails) updatedDriverData.vehicleDetails = vehicleDetails;
    if (licenseNumber) updatedDriverData.licenseNumber = licenseNumber;
    if (Object.keys(updatedDriverData).length > 0) {
      await Driver.findOneAndUpdate({ userId }, updatedDriverData, {
        new: true,
        runValidators: true,
      });
    }
  }

  const finalProfile = await User.findById(userId);
  return finalProfile;
};

export const userServices = {
  updateMyProfileInDB,
};