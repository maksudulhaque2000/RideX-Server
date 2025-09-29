import { Schema, model } from 'mongoose';

const driverSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicleDetails: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'pending' },
  availability: { type: String, enum: ['online', 'offline'], default: 'offline' },
}, { timestamps: true });

export const Driver = model('Driver', driverSchema);