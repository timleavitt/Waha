import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../../constants'
import { StandardTypography, SystemTypography } from '../../styles/typography'

function WahaButton ({
  // passed from parents
  type,
  color,
  label,
  style = {},
  textStyle = {},
  width = null,
  onPress,
  useDefaultFont = false,
  extraComponent = null,
  // passed from redux
  font = null,
  isRTL = null,
  activeGroup = null
}) {
  switch (type) {
    case 'outline':
      return (
        <TouchableOpacity
          style={[
            { width: width },
            styles.buttonContainer,
            {
              borderWidth: 2,
              borderColor: color
            },
            style
          ]}
          onPress={onPress}
        >
          <Text
            style={[
              useDefaultFont
                ? SystemTypography(false, 'h3', 'Bold', 'center', color)
                : StandardTypography(
                    { font, isRTL },
                    'h3',
                    'Bold',
                    'center',
                    color
                  ),
              { fontWeight: font ? null : 'bold' },
              textStyle
            ]}
          >
            {label}
          </Text>
          {extraComponent}
        </TouchableOpacity>
      )
      break
    case 'filled':
      return (
        <TouchableOpacity
          style={[
            {
              width: width
            },
            styles.buttonContainer,
            {
              backgroundColor: color
            },
            style
          ]}
          onPress={onPress}
        >
          <Text
            style={[
              useDefaultFont
                ? SystemTypography(false, 'h3', 'Bold', 'center', colors.white)
                : StandardTypography(
                    { font, isRTL },
                    'h3',
                    'Bold',
                    'center',
                    colors.white
                  ),
              { fontWeight: font ? null : 'bold' },
              textStyle
            ]}
          >
            {label}
          </Text>
          {extraComponent}
        </TouchableOpacity>
      )
      break
    case 'inactive':
      return (
        <View
          style={[
            styles.buttonContainer,
            {
              width: width,
              backgroundColor: color
            },
            style
          ]}
        >
          <Text
            style={[
              useDefaultFont
                ? SystemTypography(false, 'p', 'Bold', 'center', colors.chateau)
                : StandardTypography(
                    { font, isRTL },
                    'p',
                    'Bold',
                    'center',
                    colors.chateau
                  ),
              textStyle
            ]}
          >
            {label}
          </Text>
          {extraComponent}
        </View>
      )
      break
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    marginVertical: 20 * scaleMultiplier,
    // paddingVertical: 20 * scaleMultiplier,
    // paddingVertical: 10 * scaleMultiplier,
    height: 65 * scaleMultiplier,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return activeGroup
    ? {
        font: getLanguageFont(activeGroup.language),
        isRTL: state.database[activeGroup.language].isRTL,
        activeGroup: activeGroup
      }
    : {}
}

export default connect(mapStateToProps)(WahaButton)
