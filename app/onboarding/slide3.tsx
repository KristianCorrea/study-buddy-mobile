import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Gamepad2, Trophy, ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function Slide3() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
        </View>
        
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Gamepad2 size={80} color="#ffffff" strokeWidth={1.5} />
        </View>
        
        {/* Content */}
        <Text style={styles.title}>Play games, earn XP, and evolve your pet!</Text>
        <Text style={styles.description}>
          Make studying fun! Complete quizzes to earn XP, level up your virtual pet, and unlock new customizations. Your pet's happiness depends on your study consistency.
        </Text>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Trophy size={20} color="#ffffff" />
            <Text style={styles.featureText}>Level up system</Text>
          </View>
          <View style={styles.feature}>
            <Trophy size={20} color="#ffffff" />
            <Text style={styles.featureText}>Pet customization</Text>
          </View>
        </View>
        
        {/* Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => router.push('/create-pet')}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Create Your Pet</Text>
          <ArrowRight size={20} color="#667eea" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 32,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  nextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
});