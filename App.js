//standard stuff
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font'

//navigation
import WahaNavigator from './navigation/WahaNavigator';
import LoadingView from './components/LoadingView';

//redux
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react';

//only here because of wack errors, DON'T DELETE
import { encode, decode } from 'base-64';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function App() {
   useEffect(() => {
      loadFonts();
   }, [])

   const [fontsLoaded, setFontsLoaded] = useState(false)

   async function loadFonts() {
      await Font.loadAsync({
         'black': require('./assets/fonts/Roboto-Black.ttf'),
      });
      await Font.loadAsync({
         'bold': require('./assets/fonts/Roboto-Bold.ttf'),
      });
      await Font.loadAsync({
         'medium': require('./assets/fonts/Roboto-Medium.ttf'),
      });
      await Font.loadAsync({
         'regular': require('./assets/fonts/Roboto-Regular.ttf'),
      });
      await Font.loadAsync({
         'light': require('./assets/fonts/Roboto-Light.ttf'),
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