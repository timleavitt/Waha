import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../../constants'
import { StandardTypography } from '../../styles/typography'

function WahaItemDescription ({
  // passed from parents
  text,
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

export default connect(mapStateToProps)(WahaItemDescription)
