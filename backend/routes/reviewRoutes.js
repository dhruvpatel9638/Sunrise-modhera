import express from 'express';
import { getReviews, createReview, getAllReviews, approveReview, deleteReview, updateReview } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/all')
  .get(getAllReviews);

router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

router.route('/:id/approve')
  .put(approveReview);

export default router;
