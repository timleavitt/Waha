//imports
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import {
  colors,
  getLessonInfo,
  itemHeights,
  scaleMultiplier
} from '../../constants'
import { removeDownload } from '../../redux/actions/downloadActions'
import { StandardTypography } from '../../styles/typography'
import DownloadStatusIndicator from '../DownloadStatusIndicator'
function LessonItem (props) {
  //+ CONSTRUCTOR

  useEffect(() => {
    // if we've completed the download for this lesson, remove the audio/video
    //  download from redux
    switch (props.lessonType) {
      case 'qa':
      case 'a':
        if (
          props.downloads[props.thisLesson.id] &&
          props.downloads[props.thisLesson.id].progress === 1
        )
          props.removeDownload(props.thisLesson.id)
        break
      case 'qav':
        if (
          props.downloads[props.thisLesson.id] &&
          props.downloads[props.thisLesson.id] + 'v' &&
          props.downloads[props.thisLesson.id].progress === 1 &&
          props.downloads[props.thisLesson.id + 'v'].progress === 1
        ) {
          props.removeDownload(props.thisLesson.id)
          props.removeDownload(props.thisLesson.id + 'v')
        }
        break
      case 'qv':
      case 'v':
        if (
          props.downloads[props.thisLesson.id + 'v'] &&
          props.downloads[props.thisLesson.id + 'v'].progress === 1
        )
          props.removeDownload(props.thisLesson.id + 'v')
        break
    }
  }, [props.downloads])

  //+ FUNCTIONS

  // calls the various modal functions on lessonlistscreen
  function showSaveModal () {
    props.setActiveLessonInModal.call()
    props.setShowDownloadLessonModal.call()
  }
  function showDeleteModal () {
    props.setActiveLessonInModal.call()
    props.setShowDeleteLessonModal.call()
  }

  //+ RENDER

  return (
    <View
      style={[
        styles.lessonItem,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row',
          height: itemHeights[props.font].LessonItem
        }
      ]}
    >
      {/* main touchable area */}
      <TouchableOpacity
        style={[
          styles.progressAndTitle,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={props.onLessonSelect}
      >
        {/* complete status indicator */}
        <View style={styles.completeStatusContainer}>
          <Icon
            name={
              props.isComplete
                ? 'check-outline'
                : props.isBookmark
                ? props.isRTL
                  ? 'triangle-left'
                  : 'triangle-right'
                : null
            }
            size={24 * scaleMultiplier}
            color={props.isComplete ? colors.chateau : props.primaryColor}
          />
        </View>

        {/* title and subtitle */}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            marginLeft: props.isRTL ? (props.thisLesson.hasAudio ? 0 : 20) : 20,
            marginRight: props.isRTL ? 20 : props.thisLesson.hasAudio ? 0 : 20
          }}
        >
          <Text
            style={StandardTypography(
              props,
              'h4',
              'medium',
              'left',
              props.isComplete ? colors.chateau : colors.shark
            )}
            numberOfLines={2}
          >
            {props.thisLesson.title}
          </Text>
          <Text
            style={StandardTypography(
              props,
              'd',
              'regular',
              'left',
              colors.chateau
            )}
            numberOfLines={1}
          >
            {getLessonInfo('subtitle', props.thisLesson.id)}
          </Text>
        </View>
      </TouchableOpacity>
      {/* cloud icon/download indicator */}
      <DownloadStatusIndicator
        isDownloaded={props.isDownloaded}
        isDownloading={props.isDownloading}
        isConnected={props.isConnected}
        showDeleteModal={showDeleteModal}
        showSaveModal={showSaveModal}
        lessonID={props.thisLesson.id}
        lessonType={props.lessonType}
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
    font: state.database[activeGroup.language].font
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
