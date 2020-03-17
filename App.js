//standard stuff
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingView />} persistor={persistor}>
        <WahaNavigator/>
      </PersistGate>
    </Provider>
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