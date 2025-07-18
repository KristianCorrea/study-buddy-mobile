import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Plus, Eye, Trash2, Camera, CircleAlert as AlertCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AddBookModal from '@/components/AddBookModal';
import { useBooks } from '@/contexts/BookContext';
import { formatTimestamp } from '@/lib/utils';

interface Book {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  last_studied: string | null;
  created_at: string;
}

export default function LibraryScreen() {
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const { books, loading, addBook, deleteBook, markAsStudied } = useBooks();

  // Warns the user about their decision to prevent accidental deletion.
  const confirmBookDelete = (bookId: number, bookTitle: string) => {
  Alert.alert(
    'Delete Book',
    `Are you sure you want to delete "${bookTitle}"?`,
    [
      {
        text: 'Cancel'
      }
      ,
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => { handleDeleteBook(bookId);},
      },
    ],
    { cancelable: true }
  );
};

const handleAddBook = (bookName: string) => {
  addBook({
    user_id: 1,           // Default user_id to 1
    title: bookName,
    description: "none",     // Set description to null
    category: "none",        // Set category to null
  });
};


  const handleDeleteBook = (bookId: number) => {
    // If error, show error message.
    deleteBook(bookId);
  };

  const handleTakeQuiz = async (book: Book) => {
    // Mark the book as studied before navigating to quiz
    await markAsStudied(book.id);
    
    router.push({
      pathname: '/quiz',
      params: { 
        bookId: book.id,
        bookTitle: book.title 
      }
    });
  };

  const formatLastStudied = (lastStudied: string | null) => {
    if (!lastStudied) return 'Never Studied';
    return "Last Studied: " + formatTimestamp(lastStudied);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <BookOpen size={64} color="#667eea" strokeWidth={1} />
      </View>
      <Text style={styles.emptyTitle}>No books yet</Text>
      <Text style={styles.emptySubtitle}>Start by adding your first book!</Text>
      <TouchableOpacity 
        style={styles.scanButton} 
        onPress={() => setShowAddBookModal(true)}
        activeOpacity={0.8}>
        <Camera size={20} color="#ffffff" />
        <Text style={styles.scanButtonText}> Add Your First Book </Text>
      </TouchableOpacity>
    </View>
  );

  // This is where the book cards are automatically rendered.
  const renderBookCard = (book: Book) => (
    <View key={book.id} style={styles.bookCard}>
      <View style={styles.bookHeader}>

        {/*This is the book icon.*/}
        <View style={styles.bookIcon}> 
          <BookOpen size={24} color="#667eea" /> 
        </View>

        {/*This is the book title and last studied status.*/}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text> 
          <Text style={styles.bookMeta}>{formatLastStudied(book.last_studied)  } </Text> 
        </View>
      </View>
      
      <View style={styles.bookActions}>

        {/* Quiz Button. */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleTakeQuiz(book)}
          activeOpacity={0.8}
        >
          <Eye size={16} color="#667eea" />
          <Text style={styles.actionButtonText}>Quiz</Text>
        </TouchableOpacity>
        
        {/* Add Page Button. */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => router.push({
            pathname: '/scan-pages',
            params: { bookId: book.id }
          })}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#667eea" />
          <Text style={styles.actionButtonText}>Add Pages</Text>
        </TouchableOpacity>
        
        {/* Delete Button. */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => confirmBookDelete(book.id, book.title)}
          activeOpacity={0.8}
        >
          <Trash2 size={16} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#667eea" />
      <Text style={styles.loadingText}>Loading your books...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Inserted padding  */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}> My Library </Text>
          <Text style={styles.subtitle}> Your study materials </Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Add Book Button */}
          <View style={styles.addButtonContainer}>
            <TouchableOpacity 
              style={styles.addBookButton} 
              onPress={() => setShowAddBookModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={24} color="#ffffff" />
              <Text style={styles.addBookButtonText}> Add New Book </Text>
            </TouchableOpacity>
          </View>
          {/* Renders every book stored onto the screen */}
          {/* Loading State */}
          {loading ? (
            renderLoadingState()
          ) : books.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.booksContainer}>
              {books.map(renderBookCard)}
            </View>
          )}
        </View>
      </ScrollView>
      
      <AddBookModal 
        visible={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        onAddBook={handleAddBook}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  // Loading State needs testing.
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    marginTop: 16,
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 32,
  },
  scanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scanButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  booksContainer: {
    gap: 16,
  },
  bookCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  bookMeta: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 4,
  },
  // NOT USED
  bookDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    fontStyle: 'italic',
  },
  bookActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  addButtonContainer: {
    marginBottom: 24,
  },
  addBookButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addBookButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
});