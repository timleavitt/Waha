import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../../constants'
import { StandardTypography } from '../../styles/typography'

function Blurb ({
  // passed from parent
  text,
  // passed from redux
  font,
  isRTL
}) {
  return (
    <View style={{ width: '100%', padding: 20 * scaleMultiplier }}>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'p',
          'Regular',
          'center',
          colors.shark
        )}
      >
        {text}
      </Text>
    </View>
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(Blurb)
