//basic imports
import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { scaleMultiplier } from '../constants'
import { colors } from '../styles/colors'

function SwipeBar ({ opacity, side }) {
  return (
    <View
      style={[
        styles.swipeBarContainer,
        { alignSelf: side === 'right' ? 'flex-start' : 'flex-end' }
      ]}
    >
      <Animated.View style={[styles.swipeBar, { opacity: opacity }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  swipeBarContainer: {
    height: '100%',
    width: 24,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    marginLeft: -4
  },
  swipeBar: {
    width: 4,
    height: 75 * scaleMultiplier,
    backgroundColor: colors.chateau,
    borderRadius: 10
  }
})

export default SwipeBar
