export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  createdAt: string;
  averageRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  reviewText: string;
  rating: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type Genre = 
  | 'Fiction'
  | 'Non-Fiction'
  | 'Mystery'
  | 'Romance'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Biography'
  | 'History'
  | 'Self-Help'
  | 'Thriller';

export interface CreateBookRequest {
  title: string;
  author: string;
  genre: Genre;
  description: string;
}

export interface CreateReviewRequest {
  bookId: string;
  reviewText: string;
  rating: number;
}
