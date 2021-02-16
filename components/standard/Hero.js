import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'
import Separator from '../standard/Separator'

function Hero ({
  // Props passed from a parent component.
  source
}) {
  return (
    <View style={{ width: '100%' }}>
      <Separator />
      <View style={styles.topPortion}>
        <Image style={styles.topImage} source={source} />
      </View>
      <Separator />
    </View>
  )
}

const styles = StyleSheet.create({
  topPortion: {
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    resizeMode: 'contain',
    height: 170 * scaleMultiplier,
    alignSelf: 'center'
  }
})

export default Hero
