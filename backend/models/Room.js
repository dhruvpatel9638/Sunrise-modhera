import mongoose from 'mongoose';
import { isMockMode, MockRoom } from '../config/db.js';

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // bhunga, tent, cottage
  price: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  size: { type: Number, required: true }, // in sq ft
  amenities: [{ type: String }],
  images: [{ type: String }],
  availableCount: { type: Number, default: 5 },
  description: { type: String, required: true }
}, { timestamps: true });

export const Room = isMockMode ? MockRoom : mongoose.model('Room', RoomSchema);
