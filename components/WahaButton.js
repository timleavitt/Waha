import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import {
  getLanguageFont,
  StandardTypography,
  SystemTypography
} from '../styles/typography'

function mapStateToProps (state) {
  return activeGroupSelector(state)
    ? {
        font: getLanguageFont(activeGroupSelector(state).language),
        isRTL: activeDatabaseSelector(state).isRTL,
        activeGroup: activeGroupSelector(state)
      }
    : {}
}

/**
 * Standard button component used throughout Waha.
 * @param {string} type - The type of the button. Possible options are 'filled' which renders a fully filled button, 'outline' which renders a butotn with a transparent background and a border, or 'inactive' which renders a filled un-clickable button with grayed out text.
 * @param {string} color - The color of the button.
 * @param {string} label - The label to display on the button.
 * @param {Object} style - (Optional) Extra style to apply to the button container.
 * @param {Object} textStyle - (Optional) Extra style to apply to the label of the button.
 * @param {number} width - (Optional) How wide the button should be.
 * @param {Function} onPress - Function to call when the button gets pressed.
 * @param {boolean} useDefaultFont - (Optional) Whether the button label should use the Standard or System typography. Defaults to false.
 * @param {Component} extraComponent - (Optional) An extra RN component to put in the button. Usually an icon.
 */
const WahaButton = ({
  // Props passed from a parent component.s
  type,
  color,
  label = '',
  style = {},
  textStyle = {},
  width = null,
  onPress,
  useDefaultFont = false,
  extraComponent = null,
  // Props passed from redux.
  font = null,
  isRTL = null,
  activeGroup = null
}) => {
  /** Keeps track of the color of the bottom border (shadow) of the button. */
  const [shadowColor, setShadowColor] = useState()

  /** useEffect function that sets the shadow color state based on the color prop. */
  useEffect(() => {
    if (color === colors.apple) setShadowColor(colors.appleShadow)
    else if (color === colors.red) setShadowColor(colors.redShadow)
    else if (color === colors.blue) setShadowColor(colors.blueShadow)
    else if (color === colors.chateau) setShadowColor(colors.chateauShadow)
    else if (color === colors.geyser) setShadowColor(colors.geyserShadow)
    else if (color === colors.waha) setShadowColor(colors.wahaShadow)
  }, [color])

  // Main container styles.
  const outerContainerStyle = [
    {
      overflow: 'hidden',
      borderRadius: 15,
      height: 65 * scaleMultiplier,
      width: width,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginVertical: 20 * scaleMultiplier
    },
    style
  ]

  // Inner container styles.
  const innerContainerStyle = {
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  }

  // Specific styles for the outline type button.
  const outlineButtonStyle = [
    innerContainerStyle,
    {
      borderRadius: 20,
      height: 65 * scaleMultiplier,
      width: width,
      flexDirection: 'row',
      marginVertical: 20 * scaleMultiplier,
      borderWidth: 2,
      borderColor: color
    },
    style
  ]

  // Specific styles for the filled and inactive type buttons.
  const filledAndInactiveButtonStyle = [
    innerContainerStyle,
    {
      backgroundColor: color,
      borderBottomWidth: 4,
      borderBottomColor: shadowColor
    }
  ]

  // Styles for the button text.
  const labelStyle = [
    useDefaultFont
      ? SystemTypography(false, 'h3', 'Bold', 'center', color)
      : StandardTypography({ font, isRTL }, 'h3', 'Bold', 'center', color),
    { fontWeight: font ? null : 'bold' },
    textStyle
  ]

  // Specific styles for the labels for the different types of buttons.
  const outlineLabelStyle = [labelStyle, { color: color }]
  const filledLabelStyle = [labelStyle, { color: colors.white }]
  const inactiveLabelStyle = [labelStyle, { color: colors.chateau }]

  switch (type) {
    case 'outline':
      return (
        <TouchableOpacity style={outlineButtonStyle} onPress={onPress}>
          <Text style={outlineLabelStyle}>{label}</Text>
          {extraComponent}
        </TouchableOpacity>
      )
      break
    case 'filled':
      return (
        <TouchableOpacity style={outerContainerStyle} onPress={onPress}>
          <View style={filledAndInactiveButtonStyle}>
            <Text style={filledLabelStyle}>{label}</Text>
            {extraComponent}
          </View>
        </TouchableOpacity>
      )
      break
    case 'inactive':
      return (
        <View style={outerContainerStyle}>
          <View style={filledAndInactiveButtonStyle}>
            <Text style={inactiveLabelStyle}>{label}</Text>
            {extraComponent}
          </View>
        </View>
      )
      break
  }
}

export default connect(mapStateToProps)(WahaButton)
