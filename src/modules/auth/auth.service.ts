import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { Driver } from '../driver/driver.model';

// User Registration Logic
const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, vehicleDetails, licenseNumber } = payload;

  // Create user
  const newUser = new User({
    name,
    email,
    password,
    role,
  });
  const savedUser = await newUser.save();

  // If role is driver, create a driver profile
  if (role === 'driver') {
    const newDriver = new Driver({
      userId: savedUser._id,
      vehicleDetails,
      licenseNumber,
    });
    await newDriver.save();
  }
  
  // Return the created user (without password)
  const userObject = savedUser.toObject();
  const { password: _, ...userData } = userObject;
  return userData;
};

// User Login Logic
const loginUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const user = await User.findOne({ email: email as string }).select('+password');
  
  if (!user || !(await bcrypt.compare(password as string, user.password))) {
    throw new Error('Invalid credentials');
  }

  if (user.isBlocked) {
    throw new Error('User is blocked');
  }

  const tokenPayload = { userId: user._id, role: user.role };
  const token = jwt.sign(tokenPayload, config.jwt_secret as string, { expiresIn: '1d' });

  const userObject = user.toObject();
  const { password: _, ...userData } = userObject;

  return {
    token,
    user: userData,
  };
};

// Get Profile Logic
const getMyProfile = async(userId: string) => {
    const user = await User.findById(userId);
    if(!user){
        throw new Error("User not found!");
    }
    return user;
}

export const authServices = {
  registerUser,
  loginUser,
  getMyProfile,
};