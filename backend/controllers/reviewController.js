import { validationResult } from 'express-validator';
import Review from '../models/Review.js';
import Book from '../models/Book.js';

// Get all reviews for a book
export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Validate ObjectId format
    if (!bookId || bookId === 'undefined' || bookId === 'null' || !bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Create a new review (requires authentication)
export const createReview = async (req, res) => {
  try {
    console.log('Review creation request:', {
      body: req.body,
      user: req.user ? req.user._id : 'No user'
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { bookId, reviewText, rating } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ 
      book: bookId, 
      user: req.user._id 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      book: bookId,
      user: req.user._id,
      reviewText,
      rating
    });

    await review.save();
    await review.populate('user', 'name email');

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

// Update review (only by author)
export const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the one who wrote the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    const { reviewText, rating } = req.body;
    
    if (reviewText) review.reviewText = reviewText;
    if (rating) review.rating = rating;

    await review.save();
    await review.populate('user', 'name email');

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid review ID' });
    }
    res.status(500).json({ message: 'Server error while updating review' });
  }
};

// Delete review (only by author)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the one who wrote the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid review ID' });
    }
    res.status(500).json({ message: 'Server error while deleting review' });
  }
};

// Get all reviews by a user
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('book', 'title author')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user reviews' });
  }
};
