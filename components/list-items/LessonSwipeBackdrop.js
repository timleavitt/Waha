import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { activeDatabaseSelector } from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

// component rendered behind a lesson item that shows the swipe options

const LessonSwipeBackdrop = ({
  // Props passed from a parent component.s
  isComplete,
  toggleComplete,
  showShareModal,
  // Props passed from redux.
  isRTL
}) => {
  //+ RENDER

  // render complete button conditionally since it could be complete or incomplete
  var completeButton = isComplete ? (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: colors.chateau,
          alignItems: isRTL ? 'flex-end' : 'flex-start'
        }
      ]}
      onPress={toggleComplete}
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
          alignItems: isRTL ? 'flex-end' : 'flex-start'
        }
      ]}
      onPress={toggleComplete}
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
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      {completeButton}
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colors.blue,
            alignItems: isRTL ? 'flex-start' : 'flex-end'
          }
        ]}
        onPress={showShareModal}
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

//+ STYLES

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

export default connect(mapStateToProps)(LessonSwipeBackdrop)
