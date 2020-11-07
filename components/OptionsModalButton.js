import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// button rendered on the options modal component
function OptionsModalButton (props) {
  //+ RETURN

  return (
    <TouchableOpacity style={styles.modalButtonStyle} onPress={props.onPress}>
      <Text
        style={[
          props.style,
          Typography(props, 'h3', 'regular', 'center', colors.shark)
        ]}
      >
        {props.title}
      </Text>
      {props.children}
    </TouchableOpacity>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  modalButtonStyle: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    borderBottomColor: colors.athens,
    alignItems: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(OptionsModalButton)
