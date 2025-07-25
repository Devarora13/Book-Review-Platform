# 📚 Book Review Platform

A modern full-stack web application for discovering, adding, and reviewing books. Built as part of a 48-hour development challenge to demonstrate full-stack skills with React and Node.js.

## 🎯 Project Overview

This platform allows users to:
- Browse and search through a collection of books
- Add new books to the platform
- Write detailed reviews and rate books (1-5 stars)
- View average ratings and reviews for each book
- Filter books by genre, author, and search terms
- User authentication and authorization

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with functional components and hooks
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Radix UI** - Accessible, unstyled UI primitives
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - Object Document Mapper (ODM) for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **express-validator** - Input validation and sanitization

## 🏗 Architecture

The project follows a modern full-stack architecture:

```
Book Review Platform/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── contexts/       # React Context for state management
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript type definitions
├── backend/                 # Node.js Express API
│   ├── controllers/        # Business logic and request handlers
│   ├── models/            # MongoDB schemas and models
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication and validation middleware
│   └── server.js          # Express server configuration
```

### Backend Architecture Decisions

1. **MVC Pattern**: Separated routes, controllers, and models for better organization
2. **Controller Layer**: Centralized business logic for maintainability
3. **Middleware**: Reusable authentication and validation logic
4. **Data Validation**: Comprehensive input validation using express-validator

### Frontend Architecture Decisions

1. **Component-Based**: Modular, reusable React components
2. **Custom Hooks**: Encapsulated state logic and API interactions
3. **Context API**: Global state management for authentication
4. **TypeScript**: Strong typing for better code quality and developer experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Devarora13/Book-Review-Platform.git
cd Book-Review-Platform
```

2. **Set up the backend**
```bash
cd backend
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-review-platform
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. **Set up the frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
npm start
```
The API will be available at `http://localhost:5000`

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`

### Development Scripts

**Backend:**
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📱 Features Implemented

### ✅ Core Requirements

- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Protected routes for authenticated users

- **Book Management**
  - Add new books (authenticated users only)
  - View paginated list of all books
  - Filter books by genre and author
  - Search books by title or author

- **Review System**
  - Write reviews for books (authenticated users only)
  - Rate books from 1 to 5 stars
  - View all reviews for each book
  - Calculate and display average ratings

### 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop and mobile
- **Modern Interface** - Clean, intuitive design with Tailwind CSS
- **Visual Feedback** - Loading states, success/error messages
- **Star Ratings** - Interactive star rating component
- **Smooth Navigation** - React Router with protected routes

### 🔧 Technical Features

- **Form Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error handling and user feedback
- **Data Persistence** - MongoDB with proper relationships
- **API Security** - Authentication middleware and input validation
- **Code Organization** - MVC architecture with controllers

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  title: String,
  author: String,
  genre: String,
  description: String,
  addedBy: ObjectId (User reference),
  averageRating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  book: ObjectId (Book reference),
  user: ObjectId (User reference),
  reviewText: String,
  rating: Number (1-5),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Books
- `GET /api/books` - Get all books (with filtering/pagination)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `POST /api/reviews` - Add new review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `GET /api/reviews/user/:userId` - Get user's reviews

## 🔧 Known Limitations

1. **File Upload**: Currently no support for book cover images
2. **Email Verification**: User registration doesn't include email verification
3. **Social Features**: No user profiles or social interactions
4. **Advanced Search**: No full-text search capabilities
5. **Caching**: No Redis or similar caching implementation

## 🚀 Future Enhancements

- Book cover image uploads
- User profiles and reading lists
- Book recommendations algorithm
- Advanced search with filters
- Social features (follow users, share reviews)
- Email notifications
- Mobile app development

## 🧪 Testing

The application includes:
- Input validation on both client and server
- Error boundary components
- Comprehensive error handling
- Manual testing of all user flows

## 📈 Performance Considerations

- Pagination for large datasets
- Debounced search to reduce API calls
- Optimized MongoDB queries with proper indexing
- Efficient state management with React Context

## 🤝 Contributing

This project was built as a 48-hour coding challenge to demonstrate full-stack development skills. While contributions are welcome, the primary goal was to showcase technical abilities within the time constraint.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Dev Arora**
- GitHub: [@Devarora13](https://github.com/Devarora13)
- Project: Book Review Platform

---

*Built with ❤️ using React, Node.js, and MongoDB*
