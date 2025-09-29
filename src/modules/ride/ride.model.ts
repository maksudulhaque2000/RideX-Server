import { Schema, model } from 'mongoose';

const locationSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true }
}, { _id: false });

const rideSchema = new Schema({
  riderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  pickupLocation: { type: locationSchema, required: true },
  destinationLocation: { type: locationSchema, required: true },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
    default: 'requested',
  },
  fare: { type: Number, default: 0 },
  rideHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Ride = model('Ride', rideSchema);