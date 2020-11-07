import React from 'react'
import { View } from 'react-native'
import { colors } from '../../constants'

function Separator (props) {
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
