//standard stuff
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font'

//only here because of wack errors, DON'T DELETE
import { encode, decode } from 'base-64';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

//navigation
import WahaNavigator from './navigation/Navigation';
import LoadingView from './components/LoadingView';

//redux
import { Provider } from 'react-redux'
import {persistor, store} from './redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react';

export default function App() {

  useEffect(() => {
    loadFonts();
  }, [])

  const [fontsLoaded, setFontsLoaded] = useState(false)

  async function loadFonts() {
    await Font.loadAsync({
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });
    await Font.loadAsync({
        'open-sans-light': require('./assets/fonts/OpenSans-Light.ttf'),
    });
    await Font.loadAsync({
        'open-sans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    });
    setFontsLoaded(true);
  }

  if (fontsLoaded) {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <WahaNavigator/>
        </PersistGate>
      </Provider>
    );
  } else {
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});