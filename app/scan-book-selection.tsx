import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, ArrowLeft, Camera } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const mockBooks = [
  {
    id: '1',
    title: 'Introduction to Psychology',
    progress: 0.75,
    quizCount: 12,
    lastStudied: '2 hours ago',
  },
  {
    id: '2',
    title: 'Calculus: Early Transcendentals',
    progress: 0.45,
    quizCount: 8,
    lastStudied: '1 day ago',
  },
];

export default function ScanBookSelectionScreen() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedBook) {
      router.push({
        pathname: '/scan-pages',
        params: { bookId: selectedBook }
      });
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <BookOpen size={64} color="#667eea" strokeWidth={1} />
      </View>
      <Text style={styles.emptyTitle}>No books yet</Text>
      <Text style={styles.emptySubtitle}>Add a book first to start scanning pages</Text>
      <TouchableOpacity 
        style={styles.addBookButton} 
        onPress={() => router.push('/(tabs)/library')}
        activeOpacity={0.8}
      >
        <Text style={styles.addBookButtonText}>Go to Library</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Book</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>Choose which book you want to scan pages for</Text>
          
          {mockBooks.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <View style={styles.booksContainer}>
                {mockBooks.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={[
                      styles.bookCard,
                      selectedBook === book.id && styles.selectedBookCard
                    ]}
                    onPress={() => setSelectedBook(book.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.bookHeader}>
                      <View style={styles.bookIcon}>
                        <BookOpen size={24} color="#667eea" />
                      </View>
                      <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        <Text style={styles.bookMeta}>{book.quizCount} quizzes • {book.lastStudied}</Text>
                      </View>
                      {selectedBook === book.id && (
                        <View style={styles.selectedIndicator}>
                          <Camera size={16} color="#667eea" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.continueButton,
                  !selectedBook && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={!selectedBook}
                activeOpacity={0.8}
              >
                <Camera size={20} color={selectedBook ? "#667eea" : "#999"} />
                <Text style={[
                  styles.continueButtonText,
                  !selectedBook && styles.disabledButtonText
                ]}>
                  Start Scanning
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
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
    textAlign: 'center',
  },
  addBookButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addBookButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  booksContainer: {
    gap: 16,
    marginBottom: 32,
  },
  bookCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBookCard: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  selectedIndicator: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
  continueButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  disabledButtonText: {
    color: '#999',
  },
});