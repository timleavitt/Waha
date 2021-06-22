import LottieView from 'lottie-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { scaleMultiplier } from '../constants'
import { colors } from '../styles/colors'
import WahaSeparator from './WahaSeparator'

/**
 * A component that displays a full-width image. Used to display gifs on the Mobilization Tools and Security Mode screens.
 * @param {string} source - The source for the image to display.
 */
const WahaHero = ({
  // Props passed from a parent component.
  source
}) => {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: colors.white,
        alignItems: 'center'
      }}
    >
      <WahaSeparator />
      <View style={styles.imageContainer}>
        <LottieView style={styles.heroImage} autoPlay loop source={source} />
      </View>
      <WahaSeparator />
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    maxWidth: 600 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroImage: {
    // height: 170 * scaleMultiplier,
    width: '80%',
    alignSelf: 'center'
  }
})

export default WahaHero
