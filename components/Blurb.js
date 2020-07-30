import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

function Blurb (props) {
  return (
    <View style={{ width: '100%', padding: 20 }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 14 * scaleMultiplier,
          fontFamily: props.font + '-regular',
          color: colors.shark
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
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(Blurb)
