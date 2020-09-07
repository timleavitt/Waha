import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// renders a simple touchable item within the main navigation drawer
function DrawerItem (props) {
  // RENDER

  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={props.onPress}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={props.iconName}
          size={45 * scaleMultiplier}
          color={colors.tuna}
        />
      </View>
      <Text
        style={[
          Typography(props, 'h3', 'medium', 'left', colors.shark),
          { paddingHorizontal: 10 }
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

// STYLES

const styles = StyleSheet.create({
  settingsItem: {
    height: 55 * scaleMultiplier,
    // aspectRatio: 5.5,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50 * scaleMultiplier
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(DrawerItem)
