import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const FullScreenLoader: React.FC = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it appears above other components
  },
});

export default FullScreenLoader;
