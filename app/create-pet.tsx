import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
// import axios  from 'axios';
import { useUser } from '@/contexts/UserContext';

const petOptions = [
  { id: 'raccoon', emoji: '🦝', name: 'Raccoon', description: 'Clever and curious' },
  { id: 'cat', emoji: '🐱', name: 'Cat', description: 'Independent and wise' },
  { id: 'bunny', emoji: '🐰', name: 'Bunny', description: 'Energetic and friendly' },
];

export default function CreatePetScreen() {
  const [petName, setPetName] = useState('');
  const [selectedPet, setSelectedPet] = useState('raccoon');
  const { setUser } = useUser();

  

  const handleContinue = async () => {
  if (petName.trim()) {
    setUser({
      id: 1, // or generate/fetch the real user id
      name: '', // set this if you have a user name input elsewhere
      animalType: selectedPet,
      animalName: petName,
      level: 1,
      xp: 0,
      streak: 0,
    });
    router.push('/(tabs)');
  }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Pet</Text>
            <Text style={styles.subtitle}>Choose your study companion</Text>
          </View>
          
          {/* Pet Selection */}
          <View style={styles.petSelectionContainer}>
            <Text style={styles.sectionTitle}>Choose your buddy</Text>
            <View style={styles.petOptions}>
              {petOptions.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petOption,
                    selectedPet === pet.id && styles.selectedPetOption
                  ]}
                  onPress={() => setSelectedPet(pet.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.petEmoji}>{pet.emoji}</Text>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petDescription}>{pet.description}</Text>
                  {selectedPet === pet.id && (
                    <View style={styles.selectedIndicator}>
                      <Heart size={16} color="#667eea" fill="#667eea" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Name Input */}
          <View style={styles.nameContainer}>
            <Text style={styles.sectionTitle}>Name your buddy</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter a name..."
              placeholderTextColor="rgba(102, 126, 234, 0.5)"
              value={petName}
              onChangeText={setPetName}
              maxLength={20}
            />
          </View>
          
          {/* Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.previewPet}>
              <Text style={styles.previewEmoji}>
                {petOptions.find(p => p.id === selectedPet)?.emoji}
              </Text>
              <View style={styles.heartContainer}>
                {[1, 2, 3, 4].map((heart) => (
                  <Heart key={heart} size={16} color="#ff6b6b" fill="#ff6b6b" />
                ))}
              </View>
            </View>
            <Text style={styles.previewName}>
              {petName || 'Your Buddy'}
            </Text>
          </View>
          
          {/* Continue Button */}
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !petName.trim() && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!petName.trim()}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              !petName.trim() && styles.disabledButtonText
            ]}>
              Meet Your Buddy!
            </Text>
            <ArrowRight size={20} color={petName.trim() ? "#667eea" : "#999"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
  petSelectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  petOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  petOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPetOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#ffffff',
  },
  petEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  petName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  petDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  nameContainer: {
    marginBottom: 32,
  },
  nameInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#667eea',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  previewPet: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  previewEmoji: {
    fontSize: 40,
  },
  heartContainer: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  previewName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
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