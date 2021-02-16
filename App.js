import { decode, encode } from 'base-64'
import { Audio } from 'expo-av'
import * as Font from 'expo-font'
import React, { useEffect, useState } from 'react'
import { StatusBar, Text } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import LoadingView from './components/LoadingView'
import { lockPortrait } from './constants'
import Root from './navigation/Root'
import { persistor, store } from './redux/store'
import { colors } from './styles/colors'

// These are only here because of some wack errors. Please do not delete.
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

// Set the max font scaling allowed. This is based on the system font scaling that the user sets in their phone's accessibility settings. We limit it so that the text in the app isn't allowed to get absolutely massive, which would not be good for the UI.
Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.2
}

// App.js is the most root level component.
export default function App () {
  //+ STATE

  /**  Keeps track of whether all the fonts are loaded. */
  const [fontsLoaded, setFontsLoaded] = useState(false)

  /**
   * useEffect function that acts as a constructor and takes care of a few tasks we always need to do when we start up the app.
   * @function
   */
  useEffect(() => {
    // Load up all the fonts.
    loadFonts()

    // Lock our orientation to portrait.
    lockPortrait(() => {})

    // Set up some config options for app audio.
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    })
  }, [])

  // Loads up all the fonts for all languages
  //! flag: update on new language family
  async function loadFonts () {
    await Font.loadAsync({
      waha: require('./assets/fonts/waha.ttf')
    })
    await Font.loadAsync({
      'Roboto-Black': require('./assets/fonts/Roboto/Roboto-Black.ttf')
    })
    await Font.loadAsync({
      'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Medium.ttf')
    })
    await Font.loadAsync({
      'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf')
    })
    await Font.loadAsync({
      'NotoSansArabic-Black': require('./assets/fonts/NotoSansArabic/NotoSansArabic-SemiCondensedBlack.ttf')
    })
    await Font.loadAsync({
      'NotoSansArabic-Bold': require('./assets/fonts/NotoSansArabic/NotoSansArabic-SemiCondensedSemiBold.ttf')
    })
    await Font.loadAsync({
      'NotoSansArabic-Regular': require('./assets/fonts/NotoSansArabic/NotoSansArabic-SemiCondensed.ttf')
    })
    setFontsLoaded(true)
  }

  //+ RENDER

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
