import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont } from '../../constants'
import { StandardTypography } from '../../styles/typography'

function SmallDrawerItem ({
  // passed from parents
  onPress,
  label,
  // passed from redux
  isRTL,
  font,
  activeGroup
}) {
  //+ RENDER

  return (
    <TouchableOpacity
      style={[
        styles.smallDrawerItemContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={onPress}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Bold',
          'left',
          colors.chateau
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  smallDrawerItemContainer: {
    paddingHorizontal: 10,
    // aspectRatio: 8,
    marginVertical: 5
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(SmallDrawerItem)
