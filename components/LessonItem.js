import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getLessonInfo, itemHeights, scaleMultiplier } from '../constants'
import { removeDownload } from '../redux/actions/downloadActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import DownloadStatusIndicator from './DownloadStatusIndicator'

function mapStateToProps (state) {
  return {
    primaryColor: activeDatabaseSelector(state).primaryColor,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state),
    downloads: state.downloads,
    translations: activeDatabaseSelector(state).translations,
    isConnected: state.network.isConnected,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

/**
 * A list item used to display a single lesson on the LessonsScreen. Shows the title, subtitle, complete status, and download status.
 * @param {Object} thisLesson - The object for the lesson to display.
 * @param {Function} onLessonSelect - Function to fire when the user presses a lesson item.
 * @param {boolean} isBookmark - Whether this lesson is the currently bookmarked lesson for its Story Set or not.
 * @param {boolean} isDownloaded - Whether this lesson is downloaded.
 * @param {boolean} isDownloading - Whether this lesson is currently downloading.
 * @param {string} lessonType - The type of this lesson. See getLessonType() from LessonsScreen.js for more info.
 * @param {boolean} isComplete - Whether this lesson is complete.
 * @param {Function} showDownloadLessonModal - Function that shows the download lesson modal.
 * @param {Function} showDeleteLessonModal - Function that shows the delete lesson modal.
 */
const LessonItem = ({
  // Props passed from a parent component.
  thisLesson,
  onLessonSelect,
  isBookmark,
  isDownloaded,
  isDownloading,
  lessonType,
  isComplete,
  showDownloadLessonModal,
  showDeleteLessonModal,
  // Props passed from redux.
  primaryColor,
  isRTL,
  activeGroup,
  downloads,
  translations,
  isConnected,
  font,
  removeDownload
}) => {
  /** useEffect function that removes an active download from the downloads redux object after it finishes. */
  useEffect(() => {
    // Remove finished audio downloads.
    if (
      lessonType.includes('a') &&
      downloads[thisLesson.id] &&
      downloads[thisLesson.id].progress === 1
    )
      removeDownload(thisLesson.id)

    // Remove finished video downloads.
    if (
      lessonType.includes('v') &&
      downloads[thisLesson.id + 'v'] &&
      downloads[thisLesson.id + 'v'].progress === 1
    )
      removeDownload(thisLesson.id + 'v')
  }, [downloads])

  return (
    <View
      style={[
        styles.lessonItem,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          height: itemHeights[font].LessonItem
        }
      ]}
    >
      {/* main touchable area */}
      <TouchableOpacity
        style={[
          styles.progressAndTitle,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={onLessonSelect}
      >
        {/* complete status indicator */}
        <View style={styles.completeStatusContainer}>
          <Icon
            name={
              isComplete
                ? 'check-outline'
                : isBookmark
                ? isRTL
                  ? 'triangle-left'
                  : 'triangle-right'
                : null
            }
            size={24 * scaleMultiplier}
            color={isComplete ? colors.chateau : primaryColor}
          />
        </View>

        {/* title and subtitle */}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            marginLeft: isRTL ? (thisLesson.hasAudio ? 0 : 20) : 20,
            marginRight: isRTL ? 20 : thisLesson.hasAudio ? 0 : 20
          }}
        >
          <Text
            style={StandardTypography(
              { font, isRTL },
              'h4',
              'Bold',
              'left',
              isComplete ? colors.chateau : colors.shark
            )}
            numberOfLines={2}
          >
            {thisLesson.title}
          </Text>
          <Text
            style={StandardTypography(
              { font, isRTL },
              'd',
              'Regular',
              'left',
              colors.chateau
            )}
            numberOfLines={1}
          >
            {getLessonInfo('subtitle', thisLesson.id)}
          </Text>
        </View>
      </TouchableOpacity>
      {/* cloud icon/download indicator */}
      <DownloadStatusIndicator
        isDownloaded={isDownloaded}
        isDownloading={isDownloading}
        showDeleteLessonModal={showDeleteLessonModal}
        showDownloadLessonModal={showDownloadLessonModal}
        lessonID={thisLesson.id}
        lessonType={lessonType}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  lessonItem: {
    // height: 80 * scaleMultiplier,
    // aspectRatio: 6.1,
    flexDirection: 'row',
    backgroundColor: colors.aquaHaze,
    flex: 1,
    paddingLeft: 20
    // paddingVertical: 5
  },
  progressAndTitle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignContent: 'center',
    flex: 1
  },
  completeStatusContainer: {
    justifyContent: 'center',
    width: 24 * scaleMultiplier
  }
})

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.isDownloading === nextProps.isDownloading &&
    prevProps.isDownloaded === nextProps.isDownloaded &&
    prevProps.downloadPercentage === nextProps.downloadPercentage &&
    prevProps.isBookmark === nextProps.isBookmark &&
    prevProps.isComplete === nextProps.isComplete
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(LessonItem, areEqual))
