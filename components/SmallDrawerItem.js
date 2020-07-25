import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
function SmallDrawerItem (props) {
  //// RENDER

  return (
    <TouchableOpacity
      style={[
        styles.smallDrawerItemContainer,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={props.onPress}
    >
      <Text
        style={[
          styles.smallDrawerItemText,
          {
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-medium'
          }
        ]}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  )
}

//// STYLES

const styles = StyleSheet.create({
  smallDrawerItemContainer: {
    margin: 5,
    padding: 5
  },
  smallDrawerItemText: {
    fontSize: 18 * scaleMultiplier,
    color: colors.chateau
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(SmallDrawerItem)
