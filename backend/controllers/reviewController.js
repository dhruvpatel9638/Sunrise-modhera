import { Review } from '../models/Review.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving all reviews', error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { guestName, rating, comment } = req.body;
    
    if (!guestName || !rating || !comment) {
      return res.status(400).json({ message: 'All fields (name, rating, comment) are required.' });
    }

    const newReview = await Review.create({
      guestName,
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      approved: true
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    await Review.findByIdAndUpdate(id, { approved: true });
    res.status(200).json({ message: 'Review approved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving review', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    await Review.deleteMany({ _id: id });
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { guestName, rating, comment, date, approved } = req.body;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    
    const updated = await Review.findByIdAndUpdate(id, {
      guestName,
      rating: rating ? Number(rating) : undefined,
      comment,
      date,
      approved: approved !== undefined ? approved : undefined
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

