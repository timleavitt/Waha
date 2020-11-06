// only here because of wack errors, DON'T DELETE
import { decode, encode } from 'base-64'
import * as Font from 'expo-font'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import LoadingView from './components/LoadingView'
import { colors } from './constants'
// import { colors } from './constants'
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

  //+ FUNCTIONS

  // ScreenOrientation.getOrientationLockAsync().then(orientation =>
  //   console.log(ScreenOrientation.OrientationLock[orientation])
  // )

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
          <StatusBar
            backgroundColor={colors.aquaHaze}
            barStyle='dark-content'
          />
          <Root />
        </PersistGate>
      </Provider>
    )
  } else {
    return null
  }
}
