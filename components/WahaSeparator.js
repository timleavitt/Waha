import React from 'react'
import { View } from 'react-native'
import { colors } from '../styles/colors'

/**
 * A simple component that renders a horizontal line. Used to separate list items, text, or whatever else.
 */
const WahaSeparator = () => (
  <View
    style={{
      width: '100%',
      height: 2,
      backgroundColor: colors.athens
    }}
  />
)

export default WahaSeparator
