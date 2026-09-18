import express from 'express';
import { getReviews, createReview, getAllReviews, approveReview, deleteReview, updateReview } from '../controllers/reviewController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Anyone can view approved reviews and submit new reviews
router.route('/')
  .get(getReviews)
  .post(createReview);

// Protected: Only Admin can view all reviews (including pending/unapproved)
router.route('/all')
  .get(verifyAdminToken, getAllReviews);

// Protected: Only Admin can update or delete reviews
router.route('/:id')
  .put(verifyAdminToken, updateReview)
  .delete(verifyAdminToken, deleteReview);

// Protected: Only Admin can approve reviews
router.route('/:id/approve')
  .put(verifyAdminToken, approveReview);

export default router;
