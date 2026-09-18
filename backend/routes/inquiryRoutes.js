import express from 'express';
import { createInquiry, getInquiries, deleteInquiry } from '../controllers/inquiryController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Visitors can send inquiries
// Protected: Only authenticated Admin can view all inquiries
router.route('/')
  .get(verifyAdminToken, getInquiries)
  .post(createInquiry);

// Protected: Only authenticated Admin can delete inquiries
router.route('/:id')
  .delete(verifyAdminToken, deleteInquiry);

export default router;
