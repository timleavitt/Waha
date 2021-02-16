import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function WahaItem ({
  // Props passed from a parent component.s
  onPress,
  style = {},
  title,
  children = null,
  // Props passed from redux.
  font,
  isRTL,
  activeGroup
}) {
  return onPress ? (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row'
        },
        style
      ]}
      onPress={onPress}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Bold',
          'left',
          colors.shark
        )}
      >
        {title}
      </Text>
      {children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        styles.itemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row'
        },
        style
      ]}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Bold',
          'left',
          colors.shark
        )}
      >
        {title}
      </Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    // aspectRatio: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  }
})

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

export default connect(mapStateToProps)(WahaItem)
