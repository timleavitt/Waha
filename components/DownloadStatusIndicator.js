import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { lessonTypes, scaleMultiplier } from '../constants'
import { removeDownload } from '../redux/actions/downloadActions'
import { colors } from '../styles/colors'

function mapStateToProps (state) {
  return {
    isConnected: state.network.isConnected,
    downloads: state.downloads
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
 * A component that shows the status of the download for a lesson as a button which allows the user to do an action related to the download, like start it or delete it.
 * @param {boolean} isFullyDownloaded - Whether the media for this lesson is fully downloaded or not.
 * @param {boolean} isDownloading - Whether the media for this lesson is actively downloading or not.
 * @param {Function} showDeleteLessonModal - Function which shows the delete lesson modal.
 * @param {Function} showDownloadLessonModal - Function which shows the download lesson modal.
 * @param {string} lessonID - The ID for the lesson this is showing the download status of.
 * @param {boolean} lessonType - The type of the lesson this is showing the download status of.
 */
const DownloadStatusIndicator = ({
  // Props passed from a parent component.
  isFullyDownloaded,
  isDownloading,
  showDeleteLessonModal,
  showDownloadLessonModal,
  lessonID,
  lessonType,
  // Props passed from redux.
  isConnected,
  downloads,
  removeDownload
}) => {
  /** Keeps track of the percentage of the download for this lesson if it's currently downloading. */
  const [downloadPercentage, setDownloadPercentage] = useState(0)

  /** useEffect function that updates the percentage of the download for this lesson based on what the lesson type is. */
  useEffect(() => {
    if (downloads[lessonID] || downloads[lessonID + 'v'])
      switch (lessonType) {
        case lessonTypes.STANDARD_DBS:
        case lessonTypes.AUDIOBOOK:
          // For audio only lessons, the progress is just the progress of the video download.
          setDownloadPercentage(downloads[lessonID].progress * 100)
          break
        // Special case. When we're in a DMC lesson, the download progress should be the audio and video download progress combined. If one has already finished and has been removed from the downloads redux object, use 1 for its progress instead.
        case lessonTypes.STANDARD_DMC:
          var audioPercentage = downloads[lessonID]
            ? downloads[lessonID].progress
            : 1
          var videoPercentage = downloads[lessonID + 'v']
            ? downloads[lessonID + 'v'].progress
            : 1
          setDownloadPercentage(((audioPercentage + videoPercentage) / 2) * 100)
          break
        case lessonTypes.VIDEO_ONLY:
          // For video only lessons, the progress is just the progress of the video download.
          setDownloadPercentage(downloads[lessonID + 'v'].progress * 100)
          break
      }
  }, [downloads[lessonID], downloads[lessonID + 'v']])

  // If our lesson has no media to download, return nothing.
  if (
    lessonType === lessonTypes.STANDARD_NO_AUDIO ||
    lessonType === lessonTypes.BOOK
  )
    return null
  // If all the media for the lesson is downloaded, show the checkmark icon. Pressing on this deletes the media.
  else if (isFullyDownloaded)
    return (
      <TouchableOpacity
        onPress={showDeleteLessonModal}
        style={styles.downloadStatusIndicatorContainer}
      >
        <Icon
          name='cloud-check'
          color={colors.chateau}
          size={22 * scaleMultiplier}
        />
      </TouchableOpacity>
    )
  // If we're actively downloading the media for the lesson, show a progress bar of the download. Pressing on it stops the download.
  else if (isDownloading && isConnected)
    return (
      <TouchableOpacity
        style={styles.downloadStatusIndicatorContainer}
        onPress={() => {
          if (downloads[lessonID]) {
            downloads[lessonID].resumable.pauseAsync()
            removeDownload(lessonID)
          }
          if (downloads[lessonID + 'v']) {
            downloads[lessonID + 'v'].resumable.pauseAsync()
            removeDownload(lessonID + 'v')
          }
        }}
      >
        <AnimatedCircularProgress
          size={22 * scaleMultiplier}
          width={4 * scaleMultiplier}
          fill={downloadPercentage}
          tintColor={colors.oslo}
          rotation={0}
          backgroundColor={colors.white}
          padding={2}
        >
          {() => (
            <View
              style={{
                width: 5 * scaleMultiplier,
                height: 5 * scaleMultiplier,
                backgroundColor: colors.shark
              }}
            />
          )}
        </AnimatedCircularProgress>
      </TouchableOpacity>
    )
  // If we're not actively downloading the media for this lesson, it's not already downloaded, and we're connected to the internet, show the download icon which starts downloading the media when pressed.
  else if (!isDownloading && !isFullyDownloaded && isConnected)
    return (
      <TouchableOpacity
        onPress={showDownloadLessonModal}
        style={styles.downloadStatusIndicatorContainer}
      >
        <Icon
          name='cloud-download'
          color={isFullyDownloaded ? colors.chateau : colors.tuna}
          size={22 * scaleMultiplier}
        />
      </TouchableOpacity>
    )
  // Lastly, if the media isn't downloaded and we have no connection, show a slash icon which indicates the lesson can't be downloaded right now.
  else if (!isFullyDownloaded && !isConnected)
    return (
      <View style={styles.downloadStatusIndicatorContainer}>
        <Icon
          name='cloud-slash'
          color={colors.tuna}
          size={22 * scaleMultiplier}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  downloadStatusIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100%'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadStatusIndicator)
