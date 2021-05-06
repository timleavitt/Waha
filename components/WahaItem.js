import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

/**
 * A component used for standard list items/buttons throughout Waha.
 * @param {Function} onPress - (Optional) Function to fire when the item is pressed.
 * @param {Object} style - (Optional) Any extra style props to attach to the component.
 * @param {string} title - The text to display in the item.
 * @param {Component} children - Child components to display on the opposite side of the item from the title.
 */
const WahaItem = ({
  // Props passed from a parent component.s
  onPress = null,
  style = {},
  title,
  children,
  // Props passed from redux.
  font,
  isRTL,
  activeGroup
}) =>
  onPress ? (
    <TouchableOpacity
      style={[
        styles.wahaItemContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
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
        styles.wahaItemContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
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

const styles = StyleSheet.create({
  wahaItemContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  }
})

export default connect(mapStateToProps)(WahaItem)
