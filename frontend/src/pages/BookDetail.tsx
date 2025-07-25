import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { StarRating } from '../components/StarRating';
import { Navigation } from '../components/Navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { booksApi, reviewsApi } from '../lib/api';
import type { Book, Review } from '../types';
import { ArrowLeft, Calendar, MessageSquare, Star, Send } from 'lucide-react';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has already reviewed this book
  const userHasReviewed = reviews.some(r => r.userId === user?.id);

  // Fetch book details
  const fetchBook = async () => {
    if (!id) return;
    
    try {
      const bookData = await booksApi.getBook(id);
      setBook(bookData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch book');
    }
  };

  // Fetch reviews for this book
  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      const reviewsData = await reviewsApi.getBookReviews(id);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      // Don't set error for reviews, just log it
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBook(), fetchReviews()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Error Loading Book</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Link to="/books">
                <Button>Back to Books</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The book you're looking for doesn't exist.
              </p>
              <Link to="/books">
                <Button>Back to Books</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !reviewText.trim()) {
      toast({
        title: "Please complete your review",
        description: "Both rating and review text are required.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !book) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await reviewsApi.createReview({
        bookId: book.id,
        reviewText: reviewText.trim(),
        rating,
      });
      
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your thoughts about this book.",
      });
      
      setReviewText('');
      setRating(0);
      
      // Refresh reviews
      await fetchReviews();
    } catch (err) {
      toast({
        title: "Failed to submit review",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/books">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                    <CardDescription className="text-xl font-medium text-foreground">
                      by {book.author}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {book.genre}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <StarRating rating={book.averageRating || 0} size="lg" />
                      <span className="text-2xl font-bold">
                        {book.averageRating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Based on {book.reviewCount} reviews
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About this book</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {book.description || 'No description available for this book.'}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Added {new Date(book.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {book.reviewCount} Reviews
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Form */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Write a Review
                </CardTitle>
                <CardDescription>
                  Share your thoughts about this book
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userHasReviewed ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      You've already reviewed this book. Thank you for your feedback!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Rating</label>
                      <StarRating
                        rating={rating}
                        interactive
                        onRatingChange={setRating}
                        size="lg"
                      />
                    </div>

                    <div>
                      <label htmlFor="review" className="text-sm font-medium mb-2 block">
                        Your Review
                      </label>
                      <Textarea
                        id="review"
                        placeholder="What did you think about this book? Share your thoughts..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary shadow-elegant"
                      disabled={isSubmitting || !rating || !reviewText.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Review
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Reviews ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review this book!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review: Review) => (
                    <div key={review.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {review.reviewText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};