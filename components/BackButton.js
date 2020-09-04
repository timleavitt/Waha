import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// simple back button that is shown in almost every screen's header
function BackButton (props) {
  //+ RENDER

  return (
    <TouchableOpacity
      style={[
        styles.backButtonContainer,
        { justifyContent: props.isRTL ? 'flex-end' : 'flex-start' }
      ]}
      onPress={props.onPress}
    >
      <Icon
        name={props.isRTL ? 'arrow-right' : 'arrow-left'}
        size={45 * scaleMultiplier}
        color={colors.oslo}
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(BackButton)
