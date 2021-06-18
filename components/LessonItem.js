import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import {
  getLessonInfo,
  isTablet,
  itemHeights,
  lessonTypes,
  scaleMultiplier
} from '../constants'
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
    t: activeDatabaseSelector(state).translations,
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
 * @param {Function} goToPlayScreen - Navigates to the play screen with some custom parameters.
 * @param {boolean} thisSetBookmark - The bookmark for the set this lesson is a part of.
 * @param {string} lessonType - The type of this lesson. See getLessonType() from LessonsScreen.js for more info.
 * @param {number[]} thisSetProgress - The progress for the set this lesson is a part of.
 * @param {Object[]} downloadedLessons - An array of the downloaded lessons
 * @param {Function} showDownloadLessonModal - Function that shows the download lesson modal.
 * @param {Function} showDeleteLessonModal - Function that shows the delete lesson modal.
 */
const LessonItem = ({
  // Props passed from a parent component.
  thisLesson,
  goToPlayScreen,
  isBookmark,
  isComplete,
  lessonType,
  downloadedLessons,
  showDownloadLessonModal,
  showDeleteLessonModal,
  scriptureList,
  isInInfoMode,
  animationFinished,
  // Props passed from redux.
  primaryColor,
  isRTL,
  activeGroup,
  downloads,
  t,
  isConnected,
  font,
  removeDownload
}) => {
  // console.log(`${Date.now()} Lesson ${thisLesson.id} is re-rendering.`)
  /** Keeps track of whether this lesson is downloaded or not. */
  const [isFullyDownloaded, setIsFullyDownloaded] = useState(false)

  /** Keeps track of whether this lesson is currently downloading or not. */
  const [isDownloading, setIsDownloading] = useState(false)

  /** useEffect function that removes an active download from the downloads redux object after it finishes. */
  useEffect(() => {
    // Remove finished audio downloads.
    if (
      lessonType.includes('Audio') &&
      downloads[thisLesson.id] &&
      downloads[thisLesson.id].progress === 1
    )
      removeDownload(thisLesson.id)

    // Remove finished video downloads.
    if (
      lessonType.includes('Video') &&
      downloads[thisLesson.id + 'v'] &&
      downloads[thisLesson.id + 'v'].progress === 1
    )
      removeDownload(thisLesson.id + 'v')
  }, [downloads[thisLesson.id], downloads[thisLesson.id + 'v']])

  /** useEffect function that updates the downloading and downloaded status of a lesson whenever a download gets added or removed from the downloads redux object. */
  useEffect(() => {
    switch (lessonType) {
      case lessonTypes.STANDARD_DBS:
      case lessonTypes.AUDIOBOOK:
        if (downloadedLessons.includes(thisLesson.id))
          setIsFullyDownloaded(true)
        else setIsFullyDownloaded(false)
        if (downloads[thisLesson.id]) setIsDownloading(true)
        else setIsDownloading(false)
        break
      case lessonTypes.STANDARD_DMC:
        if (
          downloadedLessons.includes(thisLesson.id) &&
          downloadedLessons.includes(thisLesson.id + 'v')
        )
          setIsFullyDownloaded(true)
        else setIsFullyDownloaded(false)
        if (downloads[thisLesson.id] || downloads[thisLesson.id + 'v'])
          setIsDownloading(true)
        else setIsDownloading(false)
        break
      case lessonTypes.VIDEO_ONLY:
        if (downloadedLessons.includes(thisLesson.id + 'v'))
          setIsFullyDownloaded(true)
        else setIsFullyDownloaded(false)
        if (downloads[thisLesson.id + 'v']) setIsDownloading(true)
        else setIsDownloading(false)
        break
    }
  }, [downloadedLessons, Object.keys(downloads).length])

  return (
    <View
      style={[
        styles.lessonItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          paddingVertical: isInInfoMode ? 10 : 0,
          paddingLeft: 20,
          // alignItems: isInInfoMode ? 'flex-start' : 'center',
          alignItems: 'center',
          minHeight: isTablet
            ? itemHeights[font].LessonItem + 15
            : itemHeights[font].LessonItem,
          height: isInInfoMode
            ? null
            : isTablet
            ? itemHeights[font].LessonItem + 15
            : itemHeights[font].LessonItem
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.touchableAreaContainer,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: isRTL ? 'flex-end' : 'flex-start'
          }
        ]}
        onPress={() =>
          goToPlayScreen({
            thisLesson: thisLesson,
            isAudioAlreadyDownloaded: downloadedLessons.includes(thisLesson.id),
            isVideoAlreadyDownloaded: downloadedLessons.includes(
              thisLesson.id + 'v'
            ),
            isAlreadyDownloading: isDownloading,
            lessonType: lessonType,
            downloadedLessons: downloadedLessons
          })
        }
      >
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
        <View
          style={[
            styles.titlesContainer,
            {
              marginLeft: isRTL ? (thisLesson.hasAudio ? 0 : 20) : 20,
              marginRight: isRTL ? 20 : thisLesson.hasAudio ? 0 : 20
            }
          ]}
        >
          <Text
            // adjustsFontSizeToFit
            style={[
              StandardTypography(
                { font, isRTL },
                'h4',
                'Bold',
                'left',
                isComplete ? colors.chateau : colors.shark
              ),
              {
                // flex: 1
              }
            ]}
            numberOfLines={2}
          >
            {thisLesson.title}
          </Text>
          {/* <Text
          // numberOfLines={2}
          > */}
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'd',
                'Regular',
                'left',
                colors.chateau
              ),
              {
                // fontSize: 13 * scaleMultiplier,
              }
            ]}
            // numberOfLines={1}
          >
            {getLessonInfo('subtitle', thisLesson.id)}
          </Text>
          {/* {isInInfoMode && (
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'd',
                  'Regular',
                  'left',
                  colors.tuna
                ),
                {
                  fontSize: 13 * scaleMultiplier
                }
              ]}
            >
              {' '}
              •{' '}
            </Text>
          )} */}
          {isInInfoMode && (
            <Text
              style={StandardTypography(
                { font, isRTL },
                'd',
                'Regular',
                'left',
                colors.chateau
              )}
              // numberOfLines={2}
            >
              {scriptureList}
            </Text>
          )}
          {/* </Text> */}
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: 22 * scaleMultiplier + 40
        }}
      >
        {!isInInfoMode && (
          <DownloadStatusIndicator
            isFullyDownloaded={isFullyDownloaded}
            isDownloading={isDownloading}
            showDeleteLessonModal={showDeleteLessonModal}
            showDownloadLessonModal={showDownloadLessonModal}
            lessonID={thisLesson.id}
            lessonType={lessonType}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  lessonItemContainer: {
    backgroundColor: colors.aquaHaze,
    flex: 1,
    alignItems: 'center'
  },
  touchableAreaContainer: {
    alignItems: 'center',
    flex: 1
  },
  completeStatusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24 * scaleMultiplier
  },
  titlesContainer: {
    flexDirection: 'column',
    flex: 1,
    height: '100%'
  }
})

/*
  Lesson items need to update when:
  1. Their or any other lesson in the set's complete status changes
  2. Their download progress changes
  3. Their downloaded status changes
*/
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.isBookmark === nextProps.isBookmark &&
    prevProps.isComplete === nextProps.isComplete &&
    prevProps.downloads[prevProps.thisLesson.id] ===
      nextProps.downloads[nextProps.thisLesson.id] &&
    prevProps.downloads[prevProps.thisLesson.id + 'v'] ===
      nextProps.downloads[nextProps.thisLesson.id + 'v'] &&
    prevProps.downloadedLessons.includes(prevProps.thisLesson.id) ===
      nextProps.downloadedLessons.includes(nextProps.thisLesson.id) &&
    prevProps.downloadedLessons.includes(prevProps.thisLesson.id + 'v') ===
      nextProps.downloadedLessons.includes(nextProps.thisLesson.id + 'v') &&
    prevProps.isInInfoMode === nextProps.isInInfoMode
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(LessonItem, areEqual))
