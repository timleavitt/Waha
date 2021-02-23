import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup
  }
}

function WahaItemDescription ({
  // Props passed from a parent component.
  text,
  // Props passed from redux.
  font,
  isRTL,
  activeGroup
}) {
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
