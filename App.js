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

/**
 * App.js is the most root level component and is the start of all rendering for Waha.
 */
export default function App () {
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

  /**
   * Loads all of the fonts to be used across all languages in Waha.
   */
  async function loadFonts () {
    // Load the icon font.
    await Font.loadAsync({
      waha: require('./assets/fonts/waha_icon_font.ttf')
    })

    // Load the language-specific fonts.
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

    // Once we finish loading every font, set our fontsLoaded state to true so we know we can render the app now.
    setFontsLoaded(true)
  }

  if (fontsLoaded) {
    return (
      // The provider passes the redux store to every component in Waha.
      <Provider store={store}>
        {/* The persist gate allows the redux data to persist across restarts. */}
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          {/* Set a few settings related to the status bar. */}
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
