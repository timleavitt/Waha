import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
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
    isTablet: state.deviceInfo.isTablet,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

/**
 * A simple button component that is used inside the <OptionsModal /> component.
 * @param {Function} onPress - Function to fire when the button is pressed.
 * @param {string} label - The text to display on the button.
 * @param {Component} children - (Optional) An extra component to show on the right side of the button.
 */
const OptionsModalButton = ({
  // Props passed from a parent component.
  onPress,
  style,
  label,
  children = null,
  // Props passed from redux.
  font,
  isTablet,
  isRTL,
  activeGroup
}) => (
  <TouchableOpacity
    style={styles.optionsModalButtonContainer}
    onPress={onPress}
  >
    <Text
      style={StandardTypography(
        { font, isRTL, isTablet },
        'h3',
        'Regular',
        'center',
        colors.shark
      )}
    >
      {label}
    </Text>
    {children}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  optionsModalButtonContainer: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(OptionsModalButton)
