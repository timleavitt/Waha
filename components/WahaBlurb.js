import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 * A component to show a nicely styled blurb (section of text). Used on the Mobilization Tools and Security Mode screens.
 * @param {string} text - The text of the blurb to display.
 */
const WahaBlurb = ({
  // Props passed from a parent component.
  text,
  // Props passed from redux.
  font,
  isRTL
}) => (
  <View
    style={{
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 20 * scaleMultiplier
    }}
  >
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

export default connect(mapStateToProps)(WahaBlurb)
