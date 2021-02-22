//imports
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getLessonInfo, itemHeights, scaleMultiplier } from '../../constants'
import { removeDownload } from '../../redux/actions/downloadActions'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'
import DownloadStatusIndicator from '../DownloadStatusIndicator'

function LessonItem ({
  // Props passed from a parent component.
  thisLesson,
  onLessonSelect,
  isBookmark,
  isDownloaded,
  isDownloading,
  lessonType,
  isComplete,
  setActiveLessonInModal,
  setShowDownloadLessonModal,
  setShowDeleteLessonModal,
  // Props passed from redux.
  primaryColor,
  isRTL,
  activeGroup,
  downloads,
  translations,
  isConnected,
  font,
  removeDownload
}) {
  //+ CONSTRUCTOR

  useEffect(() => {
    // if we've completed the download for this lesson, remove the audio/video
    //  download from redux
    switch (lessonType) {
      case 'qa':
      case 'a':
        if (downloads[thisLesson.id] && downloads[thisLesson.id].progress === 1)
          removeDownload(thisLesson.id)
        break
      case 'qav':
        if (
          downloads[thisLesson.id] &&
          downloads[thisLesson.id] + 'v' &&
          downloads[thisLesson.id].progress === 1 &&
          downloads[thisLesson.id + 'v'].progress === 1
        ) {
          removeDownload(thisLesson.id)
          removeDownload(thisLesson.id + 'v')
        }
        break
      case 'qv':
      case 'v':
        if (
          downloads[thisLesson.id + 'v'] &&
          downloads[thisLesson.id + 'v'].progress === 1
        )
          removeDownload(thisLesson.id + 'v')
        break
    }
  }, [downloads])

  //+ FUNCTIONS

  // calls the various modal functions on LessonsScreen
  function showSaveModal () {
    setActiveLessonInModal.call()
    setShowDownloadLessonModal.call()
  }
  function showDeleteModal () {
    setActiveLessonInModal.call()
    setShowDeleteLessonModal.call()
  }

  //+ RENDER

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
        showDeleteModal={showDeleteModal}
        showSaveModal={showSaveModal}
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    downloads: state.downloads,
    translations: state.database[activeGroup.language].translations,
    isConnected: state.network.isConnected,
    font: getLanguageFont(activeGroup.language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonItem)
