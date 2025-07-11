import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Heart, Zap, Flame, Trophy, Camera, Brain } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function HomeScreen() {
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
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Pet Section */}
        <View style={styles.petSection}>
          <View style={styles.petContainer}>
            <Text style={styles.petEmoji}>🦝</Text>
            <View style={styles.healthContainer}>
              {[1, 2, 3, 4].map((heart) => (
                <Heart key={heart} size={16} color="#ff6b6b" fill="#ff6b6b" />
              ))}
            </View>
          </View>
          <Text style={styles.petName}>Buddy</Text>
          <Text style={styles.petMood}>Happy & Ready to Study!</Text>
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Zap size={24} color="#667eea" />
              </View>
              <Text style={styles.statValue}>Level 3</Text>
              <Text style={styles.statLabel}>Focused Learner</Text>
              <View style={styles.xpBar}>
                <View style={[styles.xpFill, { width: '65%' }]} />
              </View>
              <Text style={styles.xpText}>650 / 1000 XP</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Flame size={24} color="#ff6b6b" />
              </View>
              <Text style={styles.statValue}>7 days</Text>
              <Text style={styles.statLabel}>Study Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Trophy size={24} color="#ffd700" />
              </View>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Last Quiz</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/scan-book-selection')}
              activeOpacity={0.8}
            >
              <Camera size={32} color="#667eea" />
              <Text style={styles.actionButtonText}>Scan Page</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/library')}
              activeOpacity={0.8}
            >
              <Brain size={32} color="#667eea" />
              <Text style={styles.actionButtonText}>Take Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>No recent activity</Text>
            <Text style={styles.activitySubtext}>Start by scanning your first textbook page!</Text>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  petSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  petContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  petEmoji: {
    fontSize: 60,
  },
  healthContainer: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  petName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  petMood: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
  xpBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  xpText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  activitySection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  activitySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
});
