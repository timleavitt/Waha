import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../../constants'
import { BrandTypography } from '../../styles/typography'

function Blurb (props) {
  return (
    <View style={{ width: '100%', padding: 20 * scaleMultiplier }}>
      <Text
        style={BrandTypography(props, 'p', 'regular', 'center', colors.shark)}
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
