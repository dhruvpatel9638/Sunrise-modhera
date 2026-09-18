import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  inquiryType: { type: String, required: true }, // General, Event, Corporate Outing
  message: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
