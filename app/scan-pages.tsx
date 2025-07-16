import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ArrowLeft, RotateCcw, Check, X, Image as ImageIcon } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import api from '@/lib/axios';

export default function ScanPagesScreen() {
  const { bookId } = useLocalSearchParams();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const MAX_IMAGES = 5;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.permissionContainer}>
          <Camera size={80} color="#ffffff" strokeWidth={1} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan textbook pages
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && capturedImages.length < MAX_IMAGES) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          setCapturedImages(prev => [...prev, photo.uri]);
          
          if (capturedImages.length + 1 >= MAX_IMAGES) {
            setShowCamera(false);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    if (!showCamera && capturedImages.length <= MAX_IMAGES) {
      setShowCamera(true);
    }
  };

  const finishScanning = async () => {
    if (capturedImages.length === 0) {
      Alert.alert('No Images', 'Please capture at least one page before finishing.');
      return;
    }
    setLoading(true);
    setError(null);
    
    console.log('=== Starting image upload ===');
    console.log('Book ID:', bookId);
    console.log('Number of images:', capturedImages.length);
    console.log('Image URIs:', capturedImages);
    
    try {
      const formData = new FormData();
      formData.append('book_id', String(bookId));
      
      capturedImages.forEach((uri, idx) => {
        // Extract filename from URI
        const name = uri.split('/').pop() || `page_${idx + 1}.jpg`;
        
        console.log(`Adding image ${idx + 1}:`, {
          uri: uri,
          name: name,
          type: 'image/jpeg'
        });
        
        // @ts-ignore: React Native FormData file object
        formData.append('files', { uri, name, type: 'image/jpeg' } as any);
      });
      
      console.log('FormData created successfully');
      console.log('Making API request to /api/generate-lesson/'); // Note the trailing slash
      
      const response = await api.post('/api/generate-lesson/', formData, { // Add trailing slash
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json', // Add this header
        },
      });
      
      console.log('API Response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      setLoading(false);
      Alert.alert(
        'Scanning Complete',
        `Successfully scanned ${capturedImages.length} page${capturedImages.length > 1 ? 's' : ''}!`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/library')
          }
        ]
      );
    } catch (err: any) {
      console.error('=== Upload Error Details ===');
      console.error('Error object:', err);
      console.error('Error message:', err?.message);
      console.error('Error response:', err?.response);
      console.error('Error status:', err?.response?.status);
      console.error('Error data:', err?.response?.data);
      console.error('Error config:', err?.config);
      console.error('Error stack:', err?.stack);
      
      setLoading(false);
      const errorMessage = err?.response?.data?.message || err?.message || 'Server error. Please try again.';
      console.error('Final error message:', errorMessage);
      setError(errorMessage);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Loading Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingModal}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Generating lesson...</Text>
          </View>
        </View>
      </Modal>
      {/* Error Modal */}
      <Modal visible={!!error} transparent animationType="fade" onRequestClose={() => setError(null)}>
        <View style={styles.loadingOverlay}>
          <View style={styles.errorModal}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.errorButton} onPress={() => setError(null)}>
              <Text style={styles.errorButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {showCamera && capturedImages.length < MAX_IMAGES ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            {/* Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>
                Scan Pages ({capturedImages.length}/{MAX_IMAGES})
              </Text>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={toggleCameraFacing}
                activeOpacity={0.8}
              >
                <RotateCcw size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {/* Camera Controls */}
            <View style={styles.cameraControls}>
              <View style={styles.capturedCount}>
                <ImageIcon size={20} color="#ffffff" />
                <Text style={styles.capturedCountText}>{capturedImages.length}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
                activeOpacity={0.8}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.finishButton}
                onPress={finishScanning}
                activeOpacity={0.8}
              >
                <Check size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <View style={styles.reviewContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.reviewHeader}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.reviewTitle}>Review Pages</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.reviewContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.reviewSubtitle}>
              {capturedImages.length} page{capturedImages.length > 1 ? 's' : ''} captured
            </Text>
            
            <View style={styles.imagesGrid}>
              {capturedImages.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.capturedImage} />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                  <Text style={styles.imageNumber}>Page {index + 1}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.reviewActions}>
              {capturedImages.length < MAX_IMAGES && (
                <TouchableOpacity 
                  style={styles.addMoreButton}
                  onPress={() => setShowCamera(true)}
                  activeOpacity={0.8}
                >
                  <Camera size={20} color="#667eea" />
                  <Text style={styles.addMoreButtonText}>Add More Pages</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={finishScanning}
                activeOpacity={0.8}
              >
                <Check size={20} color="#ffffff" />
                <Text style={styles.completeButtonText}>Complete Scanning</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  capturedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  capturedCountText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 25,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  permissionButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  reviewContainer: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  reviewContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  reviewSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  imagesGrid: {
    gap: 16,
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    padding: 4,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reviewActions: {
    gap: 16,
    paddingBottom: 32,
  },
  addMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addMoreButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 220,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#667eea',
    fontFamily: 'Poppins-SemiBold',
  },
  errorModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 220,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});