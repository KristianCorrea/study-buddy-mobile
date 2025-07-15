import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Book {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  last_studied: string;
  created_at: string;
}

interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  fetchBooks: () => Promise<void>;
  updateBook: (bookId: number, updates: Partial<Book>) => Promise<void>;
  deleteBook: (bookId: number) => Promise<void>;
  markAsStudied: (bookId: number) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/api/books');
      setBooks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Omit<Book, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const response = await api.post('/api/books', book);
      setBooks(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const updateBook = async (bookId: number, updates: Partial<Book>) => {
    try {
      const response = await api.patch(`/api/books/${bookId}`, updates);
      setBooks(prev => prev.map(book => 
        book.id === bookId ? { ...book, ...response.data } : book
      ));
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  const deleteBook = async (bookId: number) => {
    try {
      await api.delete(`/api/books/${bookId}`);
      setBooks(prev => prev.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const markAsStudied = async (bookId: number) => {
    try {
      const response = await api.patch(`/api/books/${bookId}/study`);
      setBooks(prev => prev.map(book => 
        book.id === bookId ? { ...book, last_studied: response.data.last_studied } : book
      ));
    } catch (error) {
      console.error('Failed to mark book as studied:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BookContext.Provider value={{ 
      books, 
      loading, 
      addBook, 
      fetchBooks, 
      updateBook, 
      deleteBook,
      markAsStudied 
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
      throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};