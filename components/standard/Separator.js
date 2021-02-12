import React from 'react'
import { View } from 'react-native'
import { colors } from '../../styles/colors'

function Separator ({}) {
  return (
    <View
      style={{
        width: '100%',
        height: 2,
        backgroundColor: colors.athens
        // backgroundColor: 'blue'
      }}
    />
  )
}

export default Separator
