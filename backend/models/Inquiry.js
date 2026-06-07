import mongoose from 'mongoose';
import { isMockMode, MockInquiry } from '../config/db.js';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  inquiryType: { type: String, required: true }, // General, Event, Corporate Outing
  message: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

export const Inquiry = isMockMode ? MockInquiry : mongoose.model('Inquiry', InquirySchema);
