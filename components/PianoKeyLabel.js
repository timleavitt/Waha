import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { colors } from '../styles/colors'
import { StandardTypography } from '../styles/typography'

/**
 * Component that displays a simple circle with a number. Used to label the various keys of the piano.
 * @param {string} backgroundColor - The background color of the label.
 * @param {string} style - Extra styles to apply to the label.
 * @param {string} number - The number to display on the label.
 */
const PianoKeyLabel = ({ backgroundColor, style, number }) => {
  return (
    <View style={[styles.circle, { backgroundColor: backgroundColor }, style]}>
      <Text
        style={StandardTypography(
          { font: 'Roboto' },
          'h2',
          'Bold',
          'center',
          colors.shark
        )}
      >
        {number}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: Dimensions.get('window').width / 12,
    height: Dimensions.get('window').width / 12,
    borderRadius: Dimensions.get('window').width / 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    zIndex: 3,
    marginBottom: 10
  }
})

export default PianoKeyLabel
