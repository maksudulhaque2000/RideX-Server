import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { Driver } from '../driver/driver.model';

const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, vehicleDetails, licenseNumber } = payload;

  const newUser = new User({
    name,
    email,
    password,
    role,
  });
  const savedUser = await newUser.save();

  if (role === 'driver') {
    const newDriver = new Driver({
      userId: savedUser._id,
      vehicleDetails,
      licenseNumber,
    });
    await newDriver.save();
  }
  
  const tokenPayload = { userId: savedUser._id, role: savedUser.role };
  const token = jwt.sign(tokenPayload, config.jwt_secret as string, { expiresIn: '1d' });

  const userObject = savedUser.toObject();
  const { password: _, ...userData } = userObject;

  return {
    token,
    user: userData,
  };
};

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = userObject;

  return {
    token,
    user: userData,
  };
};

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