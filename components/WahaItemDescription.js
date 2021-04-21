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
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

const WahaItemDescription = ({
  // Props passed from a parent component.
  text,
  // Props passed from redux.
  font,
  isRTL,
  activeGroup
}) => {
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 20 * scaleMultiplier,
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'p',
          'Regular',
          'left',
          colors.oslo
        )}
      >
        {text}
      </Text>
    </View>
  )
}

export default connect(mapStateToProps)(WahaItemDescription)
