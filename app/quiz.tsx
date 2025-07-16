import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const quizQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    choices: ["Madrid What is the capital of France?", "Berlin", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Mars",
  },
  {
    id: 3,
    question: "Who wrote 'Hamlet'?",
    choices: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    answer: "William Shakespeare",
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    choices: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: "Pacific Ocean",
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'O'?",
    choices: ["Gold", "Oxygen", "Osmium", "Zinc"],
    answer: "Oxygen",
  },
  {
    id: 6,
    question: "How many continents are there?",
    choices: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    id: 7,
    question: "What year did the Titanic sink?",
    choices: ["1912", "1905", "1920", "1898"],
    answer: "1912",
  },
  {
    id: 8,
    question: "Which language is primarily spoken in Brazil?",
    choices: ["Spanish", "Portuguese", "French", "Italian"],
    answer: "Portuguese",
  },
  {
    id: 9,
    question: "What is the square root of 64?",
    choices: ["6", "7", "8", "9"],
    answer: "8",
  },
  {
    id: 10,
    question: "Who painted the Mona Lisa?",
    choices: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Michelangelo"],
    answer: "Leonardo da Vinci",
  },
];

export default function QuizScreen() {
  const { bookId, bookTitle } = useLocalSearchParams();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleChoice = (choice: string) => {
    setSelected(choice);
  };

  const handleNext = () => {
    if (selected === quizQuestions[current].answer) {
      setScore(score + 1);
    }

    if (current + 1 < quizQuestions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const handleFinish = () => {
    // Show completion alert and navigate back
    Alert.alert(
      'Quiz Complete!',
      `Great job! You scored ${score} out of ${quizQuestions.length} questions correctly.`,
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return '#4CAF50'; // Green
    if (percentage >= 60) return '#FF9800'; // Orange
    return '#f44336'; // Red
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad! 📚';
    return 'Keep studying! 💪';
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
              <Text style={styles.petEmoji}>🦝</Text>
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
                  Question {current + 1} of {quizQuestions.length}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((current + 1) / quizQuestions.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              {/* Question */}
              <Text style={styles.question}>
                {quizQuestions[current].question}
              </Text>
              
              {/* Choices */}
              <View style={styles.choices}>
                {quizQuestions[current].choices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChoice(choice)}
                    style={[
                      styles.choiceButton,
                      selected === choice && styles.selectedChoice
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.choiceText,
                      selected === choice && styles.selectedChoiceText
                    ]}>
                      {choice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Next Button */}
              <TouchableOpacity
                onPress={handleNext}
                disabled={selected === null}
                style={[
                  styles.nextButton,
                  selected === null && styles.disabledButton
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.nextButtonText,
                  selected === null && styles.disabledButtonText
                ]}>
                  {current + 1 < quizQuestions.length ? "Next Question" : "Finish Quiz"}
                </Text>
              </TouchableOpacity>
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
                {score} / {quizQuestions.length}
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
                    {quizQuestions.length - score}
                  </Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Accuracy</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
                    {Math.round((score / quizQuestions.length) * 100)}%
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
});