import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { colors } from '../../constants'
function SmallDrawerItem (props) {
  //+ RENDER

  return (
    <TouchableOpacity
      style={[
        styles.smallDrawerItemContainer,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={props.onPress}
    >
      <Text style={Typography(props, 'h3', 'medium', 'left', colors.chateau)}>
        {props.label}
      </Text>
    </TouchableOpacity>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  smallDrawerItemContainer: {
    paddingHorizontal: 10,
    // aspectRatio: 8,
    marginVertical: 5
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
