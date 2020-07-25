import React, { useEffect, useState } from 'react'
import * as Font from 'expo-font'
import Root from './navigation/Root'
import LoadingView from './components/LoadingView'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import * as ScreenOrientation from 'expo-screen-orientation'

// only here because of wack errors, DON'T DELETE
import { encode, decode } from 'base-64'
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

export default function App () {
  /// STATE

  // keeps track of whether fonts are loaded
  const [fontsLoaded, setFontsLoaded] = useState(false)

  /// / CONSTRUCTOR

  useEffect(() => {
    loadFonts()
  }, [])

  //// FUNCTIONS

  // lock orientation to portrait or upside down
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)

  // loads up all the fonts for all languages
  async function loadFonts () {
    await Font.loadAsync({
      waha: require('./assets/fonts/waha.ttf')
    })
    await Font.loadAsync({
      'roboto-black': require('./assets/fonts/Roboto/Roboto-Black.ttf')
    })
    await Font.loadAsync({
      'roboto-medium': require('./assets/fonts/Roboto/Roboto-Medium.ttf')
    })
    await Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf')
    })
    setFontsLoaded(true)
  }

  /// / RENDER

  if (fontsLoaded) {
    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <Root />
        </PersistGate>
      </Provider>
    )
  } else {
    return null
  }
}
