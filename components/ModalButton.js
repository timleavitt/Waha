import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// button rendered on the options modal component
function ModalButton (props) {
  //// RETURN

  return (
    <TouchableOpacity style={styles.modalButtonStyle} onPress={props.onPress}>
      <Text
        style={[
          styles.text,
          props.style,
          { fontFamily: props.font + '-regular' }
        ]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}

//// STYLES

const styles = StyleSheet.create({
  modalButtonStyle: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    borderBottomColor: colors.athens
  },
  text: {
    color: colors.shark,
    textAlign: 'center',
    fontSize: 19.5 * scaleMultiplier
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(ModalButton)
