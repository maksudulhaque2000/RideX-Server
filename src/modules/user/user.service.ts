import { User } from './user.model';

const updateMyProfileInDB = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  const { name, phone, address } = payload;

  const updatedData: Record<string, unknown> = {};

  if (name) {
    updatedData.name = name;
  }
  if (phone) {
    updatedData.phone = phone;
  }
  if (address) {
    updatedData.address = address;
  }
  
  const result = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const userServices = {
  updateMyProfileInDB,
};