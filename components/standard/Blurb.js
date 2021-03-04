import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

function Blurb ({
  // Props passed from a parent component.
  text,
  // Props passed from redux.
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

export default connect(mapStateToProps)(Blurb)
