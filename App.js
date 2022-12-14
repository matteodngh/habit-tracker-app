import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import Navigation from './src/navigation';



export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
});
