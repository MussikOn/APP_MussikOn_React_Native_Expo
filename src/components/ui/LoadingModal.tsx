// components/LoadingModal.tsx
import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
};

const LoadingModal: React.FC<Props> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
  },
});

export default LoadingModal;
