import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function SmallDrawerItem ({
  // Props passed from a parent component.s
  onPress,
  label,
  // Props passed from redux.
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
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state)
  }
}

export default connect(mapStateToProps)(SmallDrawerItem)
