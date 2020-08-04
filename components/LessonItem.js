//imports
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import DownloadStatusIndicator from '../components/DownloadStatusIndicator'
import { colors, scaleMultiplier } from '../constants'
import { removeDownload } from '../redux/actions/downloadActions'
function LessonItem (props) {
  //// CONSTRUCTOR

  useEffect(() => {
    // if we've completed the download for this lesson, remove the audio/video
    //  download from redux
    switch (props.lessonType) {
      case 'qa':
        if (props.downloads[props.thisLesson.id] === 1)
          props.removeDownload(props.thisLesson.id)
        break
      case 'qav':
        if (
          props.downloads[props.thisLesson.id] === 1 &&
          props.downloads[props.thisLesson.id + 'v'] === 1
        ) {
          props.removeDownload(props.thisLesson.id)
          props.removeDownload(props.thisLesson.id + 'v')
        }
        break
      case 'qv':
      case 'v':
        if (props.downloads[props.thisLesson.id + 'v'] === 1)
          props.removeDownload(props.thisLesson.id + 'v')
        break
    }
  }, [props.downloads])

  //// FUNCTIONS

  // calls the various modal functions on lessonlistscreen
  function showSaveModal () {
    props.setActiveLessonInModal.call()
    props.setShowDownloadLessonModal.call()
  }
  function showDeleteModal () {
    props.setActiveLessonInModal.call()
    props.setShowDeleteLessonModal.call()
  }

  //// RENDER

  return (
    <View
      style={[
        styles.lessonItem,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row'
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
            color={props.isComplete ? colors.oslo : props.primaryColor}
          />
        </View>

        {/* title and subtitle */}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            marginLeft: props.isRTL
              ? props.thisLesson.audioSource
                ? 0
                : 20
              : 20,
            marginRight: props.isRTL
              ? 20
              : props.thisLesson.audioSource
              ? 0
              : 20
          }}
        >
          <Text
            style={{
              fontSize: 18 * scaleMultiplier,
              textAlignVertical: 'center',
              color: props.isComplete ? colors.chateau : colors.shark,
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-medium'
            }}
            numberOfLines={2}
          >
            {props.thisLesson.title}
          </Text>
          <Text
            style={{
              fontSize: 14 * scaleMultiplier,
              color: colors.chateau,
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-regular'
            }}
            numberOfLines={1}
          >
            {props.thisLesson.subtitle}
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

//// STYLES

const styles = StyleSheet.create({
  lessonItem: {
    // height: 68 * scaleMultiplier,
    aspectRatio: 5.9,
    flexDirection: 'row',
    backgroundColor: colors.aquaHaze,
    flex: 1,
    paddingLeft: 20
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

//// REDUX

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
