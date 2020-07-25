import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// component rendered behind a lesson item that shows the swipe options
function LessonSwipeBackdrop (props) {
  //// RENDER

  // render complete button conditionally since it could be complete or incomplete
  var completeButton = props.isComplete ? (
    <TouchableOpacity
      style={[styles.buttonContainer, { backgroundColor: colors.chateau }]}
      onPress={props.toggleComplete}
    >
      <View style={styles.iconContainer}>
        <Icon name='cancel-filled' size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: colors.apple,
          alignItems: props.isRTL ? 'flex-end' : 'flex-start'
        }
      ]}
      onPress={props.toggleComplete}
    >
      <View style={styles.iconContainer}>
        <Icon name='check-filled' size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  )

  return (
    <View
      style={[
        styles.lessonSwipeBackdropContainer,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      {completeButton}
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colors.blue,
            alignItems: props.isRLT ? 'flex-start' : 'flex-end'
          }
        ]}
        onPress={props.showShareModal}
      >
        <View style={styles.iconContainer}>
          <Icon
            name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
            size={20}
            color={colors.white}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  lessonSwipeBackdropContainer: {
    width: '100%',
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  iconContainer: {
    width: 50 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(LessonSwipeBackdrop)
