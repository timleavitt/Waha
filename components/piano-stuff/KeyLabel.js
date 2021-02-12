import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../styles/colors'
import { StandardTypography } from '../../styles/typography'

function KeyLabel ({ backgroundColor, style, number }) {
  // RENDER

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

// STYLES

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

export default KeyLabel
