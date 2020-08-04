// only here because of wack errors, DON'T DELETE
import { decode, encode } from 'base-64'
import * as Font from 'expo-font'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import LoadingView from './components/LoadingView'
import Root from './navigation/Root'
import { persistor, store } from './redux/store'

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
    await Font.loadAsync({
      'merriweather-black': require('./assets/fonts/Merriweather/Merriweather-Black.ttf')
    })
    await Font.loadAsync({
      'merriweather-medium': require('./assets/fonts/Merriweather/Merriweather-Bold.ttf')
    })
    await Font.loadAsync({
      'merriweather-regular': require('./assets/fonts/Merriweather/Merriweather-Regular.ttf')
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
