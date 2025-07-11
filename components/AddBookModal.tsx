import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Plus } from 'lucide-react-native';

interface AddBookModalProps {
  visible: boolean;
  onClose: () => void;
  onAddBook: (bookName: string) => void;
}

export default function AddBookModal({ visible, onClose, onAddBook }: AddBookModalProps) {
  const [bookName, setBookName] = useState('');

  const handleAddBook = () => {
    if (bookName.trim()) {
      onAddBook(bookName.trim());
      setBookName('');
      onClose();
    }
  };

  const handleClose = () => {
    setBookName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Book</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {/* Content */}
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Book Name</Text>
              <TextInput
                style={styles.bookNameInput}
                placeholder="Enter book name..."
                placeholderTextColor="rgba(102, 126, 234, 0.5)"
                value={bookName}
                onChangeText={setBookName}
                maxLength={50}
                autoFocus
              />
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.addButton,
                    !bookName.trim() && styles.disabledButton
                  ]}
                  onPress={handleAddBook}
                  disabled={!bookName.trim()}
                  activeOpacity={0.8}
                >
                  <Plus size={20} color={bookName.trim() ? "#667eea" : "#999"} />
                  <Text style={[
                    styles.addButtonText,
                    !bookName.trim() && styles.disabledButtonText
                  ]}>
                    Add Book
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    gap: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  bookNameInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#667eea',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#667eea',
  },
  disabledButtonText: {
    color: '#999',
  },
});