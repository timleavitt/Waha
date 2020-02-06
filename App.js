//standard stuff
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//navigation
import WahaNavigator from './navigation/Navigation';

export default function App() {
  return (
    <WahaNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
