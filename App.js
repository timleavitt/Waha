// only here because of wack errors, DON'T DELETE
import { decode, encode } from 'base-64'
import * as Font from 'expo-font'
import * as ScreenOrientation from 'expo-screen-orientation'
import { DeviceMotion } from 'expo-sensors'
import React, { useEffect, useState } from 'react'
// import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import LoadingView from './components/LoadingView'
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

  // lock orientation to portrait or upside down
  ScreenOrientation.supportsOrientationLockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT
  ).then(isSupported => {
    if (isSupported) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      // ScreenOrientation.lockPlatformAsync({
      //   screenOrientationConstantAndroid: 9
      // })
    } else
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
  })

  DeviceMotion.addListener(({ orientation }) => {
    // if (orientation === 0) console.log('portrait')
    // ScreenOrientation.lockPlatformAsync({
    //   screenOrientationConstantAndroid: 1
    // })
    // else if (orientation === 180) console.log('upside down portrait')
    // ScreenOrientation.lockPlatformAsync({
    //   screenOrientationConstantAndroid: 9
    // })
  })

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
          {/* <StatusBar
            backgroundColor={colors.aquaHaze}
            barStyle='dark-content'
          /> */}
          <Root />
        </PersistGate>
      </Provider>
    )
  } else {
    return null
  }
}
