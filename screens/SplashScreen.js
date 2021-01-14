import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { colors, scaleMultiplier } from '../constants'

function SplashScreen ({}) {
  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/splash.png')}
        style={{
          resizeMode: 'contain',
          width: Dimensions.get('window').width - 100 * scaleMultiplier
        }}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e43c44'
  },
  loadingMessageText: {
    color: colors.shark,
    textAlign: 'center',
    fontSize: 30,
    padding: 10
  },
  progressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shark,
    borderRadius: 5
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    color: colors.white
  }
})

export default SplashScreen
