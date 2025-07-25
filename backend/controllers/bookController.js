import { validationResult } from 'express-validator';
import Book from '../models/Book.js';

// Get all books with filtering and pagination
export const getBooks = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    
    if (req.query.genre && req.query.genre !== 'all') {
      filter.genre = req.query.genre;
    }
    
    if (req.query.author && req.query.author !== 'all') {
      filter.author = new RegExp(req.query.author, 'i');
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { author: new RegExp(req.query.search, 'i') }
      ];
    }

    // Build sort query
    let sort = {};
    switch (req.query.sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'rating':
        sort = { averageRating: -1 };
        break;
      case 'title':
        sort = { title: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute queries
    const [books, total, allBooks] = await Promise.all([
      Book.find(filter)
        .populate('addedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filter),
      Book.find({})
    ]);

    // Get unique genres and authors for filters
    const genres = [...new Set(allBooks.map(book => book.genre))].sort();
    const authors = [...new Set(allBooks.map(book => book.author))].sort();

    const totalPages = Math.ceil(total / limit);

    res.json({
      books,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit
      },
      filters: {
        genres,
        authors
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};

// Get book details by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id)
      .populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    res.status(500).json({ message: 'Server error while fetching book' });
  }
};

// Create a new book (requires authentication)
export const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, author, genre, description } = req.body;

    // Check if book already exists (same title and author)
    const existingBook = await Book.findOne({ 
      title: new RegExp(`^${title}$`, 'i'),
      author: new RegExp(`^${author}$`, 'i')
    });

    if (existingBook) {
      return res.status(400).json({ 
        message: 'A book with this title and author already exists' 
      });
    }

    const book = new Book({
      title,
      author,
      genre,
      description,
      addedBy: req.user._id
    });

    await book.save();
    await book.populate('addedBy', 'name email');

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error while adding book' });
  }
};

// Update book (only by owner)
export const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the one who added the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit books you added' });
    }

    const { title, author, genre, description } = req.body;
    
    // Check if updated book would conflict with existing book
    if (title || author) {
      const checkTitle = title || book.title;
      const checkAuthor = author || book.author;
      
      const existingBook = await Book.findOne({ 
        _id: { $ne: req.params.id },
        title: new RegExp(`^${checkTitle}$`, 'i'),
        author: new RegExp(`^${checkAuthor}$`, 'i')
      });

      if (existingBook) {
        return res.status(400).json({ 
          message: 'A book with this title and author already exists' 
        });
      }
    }
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (description) book.description = description;

    await book.save();
    await book.populate('addedBy', 'name email');

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    res.status(500).json({ message: 'Server error while updating book' });
  }
};

// Delete book (only by owner)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the one who added the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete books you added' });
    }

    await Book.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};
