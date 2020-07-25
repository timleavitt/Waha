import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
function PlayScreenHeaderButtons (props) {
  //// RENDER

  return (
    <View
      style={[
        styles.headerButtonsContainer,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row',
          marginHorizonal: 5
        }
      ]}
    >
      <TouchableOpacity onPress={props.shareOnPress}>
        <Icon
          name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
          size={32 * scaleMultiplier}
          color={colors.oslo}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginHorizontal: 5 }}
        onPress={props.completeOnPress}
      >
        <Icon
          name={props.completeCondition ? 'check-filled' : 'check-outline'}
          size={35 * scaleMultiplier}
          color={colors.oslo}
        />
      </TouchableOpacity>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(PlayScreenHeaderButtons)
