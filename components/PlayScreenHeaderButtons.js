import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

function PlayScreenHeaderButtons ({
  // Props passed from a parent component.
  shareOnPress,
  completeOnPress,
  completeCondition,
  // Props passed from redux.
  isRTL
}) {
  //+ RENDER

  return (
    <View
      style={[
        styles.headerButtonsContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          marginHorizonal: 5
        }
      ]}
    >
      <TouchableOpacity onPress={shareOnPress}>
        <Icon
          name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
          size={32 * scaleMultiplier}
          color={colors.oslo}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginHorizontal: 5 }}
        onPress={completeOnPress}
      >
        <Icon
          name={completeCondition ? 'check-filled' : 'check-outline'}
          size={35 * scaleMultiplier}
          color={colors.oslo}
        />
      </TouchableOpacity>
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

export default connect(mapStateToProps)(PlayScreenHeaderButtons)
