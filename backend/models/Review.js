import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [1000, 'Review cannot be more than 1000 characters'],
    minlength: [10, 'Review must be at least 10 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      ret.bookId = ret.book;
      ret.userId = ret.user;
      
      // If user is populated, extract the name
      if (ret.user && typeof ret.user === 'object' && ret.user.name) {
        ret.userName = ret.user.name;
        ret.userId = ret.user._id || ret.user.id;
      }
      
      delete ret._id;
      delete ret.__v;
      delete ret.book;
      delete ret.user;
      return ret;
    }
  }
});

// Ensure one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Update book rating after review save
reviewSchema.post('save', async function() {
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.book);
  if (book) {
    await book.updateRating();
  }
});

// Update book rating after review deletion
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Book = mongoose.model('Book');
    const book = await Book.findById(doc.book);
    if (book) {
      await book.updateRating();
    }
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
