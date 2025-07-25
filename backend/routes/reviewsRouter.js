import express from 'express';
import { body } from 'express-validator';
import { getBookReviews, createReview, updateReview, deleteReview, getUserReviews } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all reviews for a book
router.get('/book/:bookId', getBookReviews);

// Create a new review (requires authentication)
router.post('/', auth, [
  body('bookId').isMongoId().withMessage('Valid book ID is required'),
  body('reviewText').trim().isLength({ min: 10, max: 1000 }).withMessage('Review must be between 10 and 1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], createReview);

// Update review (only by author)
router.put('/:id', auth, [
  body('reviewText').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Review must be between 10 and 1000 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], updateReview);

// Delete review (only by author)
router.delete('/:id', auth, deleteReview);

// Get all reviews by a user
router.get('/user/:userId', getUserReviews);

export default router;