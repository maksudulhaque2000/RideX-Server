import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['rider', 'driver', 'admin'], required: true },
  isBlocked: { type: Boolean, default: false },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
  }
  next();
});

export const User = model('User', userSchema);