import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { scaleMultiplier } from '../constants'

/**
 * Screen that gets navigated to whenever the app enters "background" mode on iOS. This is so the app preview is hidden in the iOS multitasking view.
 */
function SplashScreen ({}) {
  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/icons/splash.png')}
        style={{
          resizeMode: 'contain',
          width: Dimensions.get('window').width - 100 * scaleMultiplier
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E63946'
  }
})

export default SplashScreen
