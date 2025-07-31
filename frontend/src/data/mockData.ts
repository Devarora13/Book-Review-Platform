import type { Book, Review } from '@/types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    createdAt: '2025-01-15T10:00:00Z',
    averageRating: 4.2,
    reviewCount: 15
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'A gripping tale of racial injustice and childhood in the American South.',
    createdAt: '2025-01-10T14:30:00Z',
    averageRating: 4.8,
    reviewCount: 23
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description: 'An epic science fiction novel set in a distant future amidst a sprawling feudal interstellar empire.',
    createdAt: '2025-01-20T09:15:00Z',
    averageRating: 4.5,
    reviewCount: 12
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'A romantic novel about Elizabeth Bennet and her complex relationship with Mr. Darcy.',
    createdAt: '2025-01-08T16:45:00Z',
    averageRating: 4.6,
    reviewCount: 18
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'A fantasy adventure following Bilbo Baggins on his unexpected journey.',
    createdAt: '2025-01-25T11:20:00Z',
    averageRating: 4.7,
    reviewCount: 29
  },
  {
    id: '6',
    title: 'Becoming',
    author: 'Michelle Obama',
    genre: 'Biography',
    description: 'An intimate memoir by the former First Lady of the United States.',
    createdAt: '2025-01-18T13:30:00Z',
    averageRating: 4.4,
    reviewCount: 21
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    userName: 'John Doe',
    reviewText: 'A timeless classic that captures the essence of the American Dream. Fitzgerald\'s prose is beautiful and the characters are complex.',
    rating: 5,
    createdAt: '2025-01-16T10:30:00Z'
  },
  {
    id: '2',
    bookId: '1',
    userId: '2',
    userName: 'Jane Smith',
    reviewText: 'Great book but can be slow at times. The symbolism is rich and the ending is powerful.',
    rating: 4,
    createdAt: '2025-01-17T14:15:00Z'
  },
  {
    id: '3',
    bookId: '2',
    userId: '1',
    userName: 'John Doe',
    reviewText: 'An important book that everyone should read. Powerful themes and unforgettable characters.',
    rating: 5,
    createdAt: '2025-01-12T09:45:00Z'
  },
  {
    id: '4',
    bookId: '3',
    userId: '2',
    userName: 'Jane Smith',
    reviewText: 'Complex world-building and fascinating political intrigue. A must-read for sci-fi fans.',
    rating: 4,
    createdAt: '2025-01-22T16:20:00Z'
  },
  {
    id: '5',
    bookId: '4',
    userId: '1',
    userName: 'John Doe',
    reviewText: 'Austen\'s wit and social commentary are brilliant. The romance is beautifully developed.',
    rating: 5,
    createdAt: '2025-01-10T11:10:00Z'
  }
];