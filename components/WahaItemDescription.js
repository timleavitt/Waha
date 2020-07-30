import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

function WahaItemDescription (props) {
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 5,
        flexDirection: props.isRTL ? 'row-reverse' : 'row'
      }}
    >
      <Text
        style={{
          fontFamily: props.font + '-regular',
          fontSize: 14 * scaleMultiplier,
          color: colors.chateau
        }}
      >
        {props.text}
      </Text>
    </View>
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(WahaItemDescription)
