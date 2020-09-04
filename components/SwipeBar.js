//basic imports
import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { colors, scaleMultiplier } from '../constants'

function SwipeBar (props) {
  return (
    <View
      style={[
        styles.swipeBarContainer,
        { alignSelf: props.side === 'right' ? 'flex-start' : 'flex-end' }
      ]}
    >
      <Animated.View style={[styles.swipeBar, { opacity: props.opacity }]} />
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
