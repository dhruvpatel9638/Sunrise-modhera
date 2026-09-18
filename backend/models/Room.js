import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // bhunga, tent, cottage, deluxe
  price: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  size: { type: Number, required: true }, // in sq ft
  amenities: [{ type: String }],
  images: [{ type: String }],
  availableCount: { type: Number, default: 5 },
  description: { type: String, required: true }
}, { timestamps: true });

export const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);
