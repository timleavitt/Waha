//standard stuff
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//only here because of wack errors, DON'T DELETE
import { encode, decode } from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

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
