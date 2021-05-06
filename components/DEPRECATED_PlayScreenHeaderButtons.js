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

/**
 * A component that diplays 2 buttons in the header of the Play Screen.
 * @param {Function} showShareModal - Shows the share modal.
 * @param {Function} updateCompleteStatus - Updates the complete status for this lesson.
 * @param {boolean} isComplete - Whether this lesson is complete or not.
 */
const PlayScreenHeaderButtons = ({
  // Props passed from a parent component.
  showShareModal,
  updateCompleteStatus,
  isComplete,
  // Props passed from redux.
  isRTL
}) => (
  <View
    style={[
      styles.headerButtonsContainer,
      {
        flexDirection: isRTL ? 'row-reverse' : 'row',
        marginHorizonal: 5
      }
    ]}
  >
    <TouchableOpacity onPress={showShareModal}>
      <Icon
        name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
        size={32 * scaleMultiplier}
        color={colors.oslo}
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{ marginHorizontal: 5 }}
      onPress={updateCompleteStatus}
    >
      <Icon
        name={isComplete ? 'check-filled' : 'check-outline'}
        size={35 * scaleMultiplier}
        color={colors.oslo}
      />
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

export default connect(mapStateToProps)(PlayScreenHeaderButtons)
