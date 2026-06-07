import { Inquiry } from '../models/Inquiry.js';

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;
    
    if (!name || !email || !phone || !inquiryType || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newInquiry = await Inquiry.create({
      name,
      email,
      phone,
      inquiryType,
      message,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ message: 'Inquiry submitted successfully!', data: newInquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inquiries', error: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    await Inquiry.deleteMany({ _id: id });
    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
};
