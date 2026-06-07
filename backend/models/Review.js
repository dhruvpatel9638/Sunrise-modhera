import mongoose from 'mongoose';
import { isMockMode, MockReview } from '../config/db.js';

const ReviewSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true },
  approved: { type: Boolean, default: true }
}, { timestamps: true });

export const Review = isMockMode ? MockReview : mongoose.model('Review', ReviewSchema);
