import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL
  }
}

// simple back button that is shown in almost every screen's header
function BackButton ({
  // Props passed from a parent component.
  onPress,
  color,
  // Props passed from redux.
  isRTL
}) {
  //+ RENDER

  return (
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
}

//+ STYLES

const styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    width: 100
  }
})

export default connect(mapStateToProps)(BackButton)
