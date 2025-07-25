import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Navigation } from '../components/Navigation';
import { useToast } from '../hooks/use-toast';
import { BookOpen, Plus } from 'lucide-react';
import { Genre } from '@/types';

const genres: Genre[] = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Thriller'
];

export const AddBook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Book added successfully!",
      description: `"${title}" by ${author} has been added to the library.`,
    });

    // Navigate back to books list
    navigate('/books');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-primary">
              <Plus className="w-8 h-8" />
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Add New Book
          </h1>
          <p className="text-xl text-muted-foreground">
            Share a great book with the community
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>
              Fill in the information about the book you'd like to add
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter the book title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Enter the author's name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Select value={genre} onValueChange={setGenre} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genreOption) => (
                      <SelectItem key={genreOption} value={genreOption}>
                        {genreOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a brief description of the book (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/books')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !title || !author || !genre}
                  className="flex-1 bg-gradient-primary shadow-elegant"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding Book...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Book
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Once added, other users will be able to find and review this book.
          </p>
        </div>
      </div>
    </div>
  );
};