import express from 'express';
import { createInquiry, getInquiries, deleteInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

router.route('/')
  .get(getInquiries)
  .post(createInquiry);

router.route('/:id')
  .delete(deleteInquiry);

export default router;
