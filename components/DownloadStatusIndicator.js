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

// renders the icon on the right side of lesson item that shows the download
//  status
const DownloadStatusIndicator = ({
  // Props passed from a parent component.s
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
  //+ RENDER

  // HERE'S WHAT IS GOING ON
  // Has questionsType (i.e. isn't only video) ?
  //  true: Has audio source ?
  //    true: Downloaded ?
  //      true: cloud-check (downloaded)
  //      false: Connected ?
  // 	      true: Downloading ?
  // 	    	  true: progress-bar (downloading)
  // 		      false: cloud-down (able to download)
  // 	      false: slash (unable to download)
  //    false: null (nothing)
  //  false: cloud-down (able to download)

  const [downloadPercentage, setDownloadPercentage] = useState(0)

  useEffect(() => {
    if (downloads[lessonID] || downloads[lessonID + 'v'])
      switch (lessonType) {
        case lessonTypes.STANDARD_DBS:
        case lessonTypes.AUDIOBOOK:
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
          setDownloadPercentage(downloads[lessonID + 'v'].progress * 100)
          break
      }
  }, [downloads[lessonID], downloads[lessonID + 'v']])

  // if lesson isn't only video
  return lessonType !== lessonTypes.STANDARD_NO_AUDIO &&
    lessonType !== lessonTypes.BOOK ? (
    // if lesson has audio source
    isFullyDownloaded ? (
      // if lesson is downloaded, show check
      <TouchableOpacity
        onPress={showDeleteLessonModal}
        style={styles.downloadButtonContainer}
      >
        <Icon
          name='cloud-check'
          color={colors.chateau}
          size={22 * scaleMultiplier}
        />
      </TouchableOpacity>
    ) : isConnected ? (
      isDownloading ? (
        // if connected and currently downloading, show progress
        <TouchableOpacity
          style={styles.downloadButtonContainer}
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
      ) : (
        // if not downloaded, not downloading, and connected, show download icon
        <TouchableOpacity
          onPress={showDownloadLessonModal}
          style={styles.downloadButtonContainer}
        >
          <Icon
            name='cloud-download'
            color={isFullyDownloaded ? colors.chateau : colors.tuna}
            size={22 * scaleMultiplier}
          />
        </TouchableOpacity>
      )
    ) : (
      // if not downloaded and not connected, show slash
      <View style={styles.downloadButtonContainer}>
        <Icon
          name='cloud-slash'
          color={colors.tuna}
          size={22 * scaleMultiplier}
        />
      </View>
    )
  ) : // if no audio source, show nothing
  null
}

//+ STYLES

const styles = StyleSheet.create({
  downloadButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadStatusIndicator)
