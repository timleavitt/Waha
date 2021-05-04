import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 * A simple pressable component with a backwards arrow that acts as a back button. Used in almost every header in Waha.
 * @param {Function} onPress - Function to call when the back button is pressed. Almost always navigation.goBack().
 * @param {string} color - The color of the back button icon. Not required.
 */
const WahaBackButton = ({
  // Props passed from a parent component.
  onPress,
  color = null,
  // Props passed from redux.
  isRTL
}) => (
  <TouchableOpacity
    style={[
      styles.backButtonContainer,
      { justifyContent: isRTL ? 'flex-end' : 'flex-start' }
    ]}
    onPress={onPress}
  >
    <Icon
      name={isRTL ? 'arrow-right' : 'arrow-left'}
      size={45 * scaleMultiplier}
      color={color ? color : colors.oslo}
    />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    width: 100
  }
})

export default connect(mapStateToProps)(WahaBackButton)
