import { decode, encode } from 'base-64'
import { Audio } from 'expo-av'
import * as Font from 'expo-font'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useEffect, useState } from 'react'
import { StatusBar, Text } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import LoadingView from './components/LoadingView'
import { colors } from './constants'
import Root from './navigation/Root'
import { persistor, store } from './redux/store'

// set the max font scaling allowed
Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.2
}
// only here because of wack errors, DON'T DELETE
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

export default function App () {
  //+ STATE

  // keeps track of whether fonts are loaded
  const [fontsLoaded, setFontsLoaded] = useState(false)

  //+ CONSTRUCTOR

  useEffect(() => {
    // load up fonts
    loadFonts()

    // lock orientation
    ScreenOrientation.supportsOrientationLockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    ).then(isSupported => {
      if (isSupported) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      } else {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        )
      }
    })

    // set audio mode
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

  //+ FUNCTIONS

  // loads up all the fonts for all languages
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
