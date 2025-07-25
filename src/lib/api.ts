const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Books API
export const booksApi = {
  // Get all books with filters and pagination
  getBooks: async (params: {
    page?: number;
    limit?: number;
    genre?: string;
    author?: string;
    search?: string;
    sortBy?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/books?${queryParams.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get single book by ID
  getBook: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Add new book
  createBook: async (bookData: {
    title: string;
    author: string;
    genre: string;
    description: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    return handleResponse(response);
  },

  // Update book
  updateBook: async (id: string, bookData: Partial<{
    title: string;
    author: string;
    genre: string;
    description: string;
  }>) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    });
    return handleResponse(response);
  },

  // Delete book
  deleteBook: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Reviews API
export const reviewsApi = {
  // Get reviews for a book
  getBookReviews: async (bookId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/book/${bookId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get reviews by user
  getUserReviews: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Add new review
  createReview: async (reviewData: {
    bookId: string;
    reviewText: string;
    rating: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  // Update review
  updateReview: async (id: string, reviewData: Partial<{
    reviewText: string;
    rating: number;
  }>) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  // Delete review
  deleteReview: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Auth API (already handled in AuthContext, but included for completeness)
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};
