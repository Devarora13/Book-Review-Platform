import express from 'express';
import { body, query } from 'express-validator';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all books with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('genre').optional().trim(),
  query('author').optional().trim(),
  query('search').optional().trim(),
  query('sortBy').optional().isIn(['newest', 'oldest', 'rating', 'title']).withMessage('Invalid sort option')
], getBooks);

// Get book details by ID
router.get('/:id', getBookById);

// Create a new book (requires authentication)
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('author').trim().isLength({ min: 1, max: 100 }).withMessage('Author is required and must be less than 100 characters'),
  body('genre').isIn([
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Thriller'
  ]).withMessage('Invalid genre'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required and must be less than 1000 characters')
], createBook);

// Update book (only by owner)
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('author').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Author must be less than 100 characters'),
  body('genre').optional().isIn([
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Thriller'
  ]).withMessage('Invalid genre'),
  body('description').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be less than 1000 characters')
], updateBook);

// Delete book (only by owner)
router.delete('/:id', auth, deleteBook);

export default router;
