import React, { useEffect, useState } from 'react'
import * as Font from 'expo-font'
import Root from './navigation/Root'
import LoadingView from './components/LoadingView'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'

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

  /// / FUNCTIONS

  // loads up all the fonts
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
      'playfairdisplay-black': require('./assets/fonts/PlayfairDisplay/PlayfairDisplay-Black.ttf')
    })
    await Font.loadAsync({
      'playfairdisplay-medium': require('./assets/fonts/PlayfairDisplay/PlayfairDisplay-Medium.ttf')
    })
    await Font.loadAsync({
      'playfairdisplay-regular': require('./assets/fonts/PlayfairDisplay/PlayfairDisplay-Regular.ttf')
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
