import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useQuestions } from '@/contexts/QuizContext';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';

export default function QuizScreen() {
  const { bookId, bookTitle } = useLocalSearchParams();
  const book_id = parseInt(bookId as string);
  const { questions, loading, fetchQuestionsByBook } = useQuestions();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const { user } = useUser();
  // Make this reusable as it it repeated in the home screen.
  const animalEmojiMap: Record<string, string> = {
    raccoon: '🦝',
    cat: '🐱',
    dog: '🐶',
    bunny: '🐰',
    // Add more as needed
  };

  const petEmoji = user?.animalType ? animalEmojiMap[user.animalType] || '❓' : '❓';

  useEffect(() => {
    if (book_id) {
      fetchQuestionsByBook(book_id);
    }
  }, [book_id]);

  // Shuffle choices only when the current question changes
  const shuffledChoices = useMemo(() => {
    if (questions[current]) {
      const allChoices = [
        questions[current].correct_answer,
        ...questions[current].wrong_answers
      ];
      return allChoices.sort(() => Math.random() - 0.5);
    }
    return [];
  }, [questions, current]); // Only recalculate when questions or current changes

  // Don't render quiz content until questions are loaded
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  // Check if no questions exist for this book
  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Questions Available</Text>
        <Text style={styles.emptySubtitle}>
          This book doesn't have any quiz questions yet. 
          Scan some pages first to generate questions!
        </Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push({
            pathname: '/scan-pages',
            params: { bookId: bookId }
          })}
          activeOpacity={0.8}
        >
          <Text style={styles.scanButtonText}>Scan Pages</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Now we know questions[current] exists
  // const currentQuestion = questions[current];

  const handleChoice = (choice: string) => {
    if (!showFeedback) {
      setSelected(choice);
    }
  };

  const handleCheckAnswer = () => {
    setShowFeedback(true);
    if (selected === questions[current].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  const handleFinish = () => {
    router.back();
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return '#4CAF50'; // Green
    if (percentage >= 60) return '#FF9800'; // Orange
    return '#f44336'; // Red
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad! 📚';
    return 'Keep studying! 💪';
  };

  const getChoiceStyle = (choice: string) => {
    if (!showFeedback) {
      return selected === choice ? styles.selectedChoice : styles.choiceButton;
    }
    
    // Show feedback
    if (choice === questions[current].correct_answer) {
      return styles.correctChoice;
    } else if (choice === selected && choice !== questions[current].correct_answer) {
      return styles.wrongChoice;
    } else {
      return styles.choiceButton;
    }
  };

  const getChoiceTextStyle = (choice: string) => {
    if (!showFeedback) {
      return selected === choice ? styles.selectedChoiceText : styles.choiceText;
    }
    
    // Show feedback
    if (choice === questions[current].correct_answer) {
      return styles.correctChoiceText;
    } else if (choice === selected && choice !== questions[current].correct_answer) {
      return styles.wrongChoiceText;
    } else {
      return styles.choiceText;
    }
  };

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
          <View style={styles.headerContent}>
            <Text style={styles.title}>Quiz</Text>
            {/* Pet Face */}
            <View style={styles.petContainer}>
              <Text style={styles.petEmoji}>{petEmoji}</Text>
            </View>
            <Text style={styles.subtitle}>
              {bookTitle || 'Study Quiz'}
            </Text>
          </View>
          {/* Question Tracker */}
          <View style={styles.questionTracker}>
            <Text style={styles.questionNumber}>Q{current + 1}</Text>
            <Text style={styles.scoreTracker}>{score}/{current}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          {!finished ? (
            <View style={styles.quizCard}>
              {/* Progress */}
              <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                  Question {current + 1} of {questions.length}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((current + 1) / questions.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              {/* Question */}
              <Text style={styles.question}>
                {questions[current].question_text}
              </Text>
              
              {/* Choices */}
              <View style={styles.choices}>
                {shuffledChoices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChoice(choice)}
                    style={getChoiceStyle(choice)}
                    activeOpacity={0.8}
                    disabled={showFeedback}
                  >
                    <Text style={getChoiceTextStyle(choice)}>
                      {choice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Action Button */}
              {!showFeedback ? (
                <TouchableOpacity
                  onPress={handleCheckAnswer}
                  disabled={selected === null}
                  style={[
                    styles.checkButton,
                    selected === null && styles.disabledButton
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.checkButtonText,
                    selected === null && styles.disabledButtonText
                  ]}>
                    Check Answer
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.nextButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextButtonText}>
                    {current + 1 < questions.length ? "Next Question" : "Finish Quiz"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.resultCard}>
              {/* Trophy Icon */}
              <View style={styles.trophyContainer}>
                <Trophy size={60} color="#ffd700" />
              </View>
              
              {/* Score */}
              <Text style={styles.resultTitle}>Quiz Complete!</Text>
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score} / {questions.length}
              </Text>
              <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
              
              {/* Score Breakdown */}
              <View style={styles.scoreBreakdown}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Correct</Text>
                  <Text style={[styles.scoreValue, { color: '#4CAF50' }]}>{score}</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Incorrect</Text>
                  <Text style={[styles.scoreValue, { color: '#f44336' }]}>
                    {questions.length - score}
                  </Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Accuracy</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
                    {Math.round((score / questions.length) * 100)}%
                  </Text>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.resultActions}>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={handleRetry}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={20} color="#667eea" />
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.finishButton}
                  onPress={handleFinish}
                  activeOpacity={0.8}
                >
                  <Text style={styles.finishButtonText}>Finish</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  headerContent: {
    alignItems: 'center',
  },
  petContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  petEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  questionTracker: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  questionNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#667eea',
    marginBottom: 2,
  },
  scoreTracker: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  quizCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  question: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 24,
    lineHeight: 28,
  },
  choices: {
    gap: 12,
    marginBottom: 32,
  },
  choiceButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#d3d3d3',
  },
  selectedChoice: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  choiceText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    textAlign: 'center',
  },
  selectedChoiceText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
  },
  correctChoice: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#d4edda',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  correctChoiceText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#155724',
    textAlign: 'center',
  },
  wrongChoice: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8d7da',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  wrongChoiceText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#721c24',
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  nextButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  disabledButtonText: {
    color: '#999',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  trophyContainer: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
    marginBottom: 32,
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  retryButton: {
    flex: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scanButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
});