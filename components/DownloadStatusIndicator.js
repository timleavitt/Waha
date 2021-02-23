import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
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
function DownloadStatusIndicator ({
  // Props passed from a parent component.s
  isDownloaded,
  isDownloading,
  showDeleteModal,
  showSaveModal,
  lessonID,
  lessonType,
  // Props passed from redux.
  isConnected,
  downloads,
  removeDownload
}) {
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

  function getDownloadPercentage () {
    switch (lessonType) {
      case 'qa':
      case 'a':
        return downloads[lessonID] ? downloads[lessonID].progress * 100 : null
        break
      case 'qav':
        return downloads[lessonID] && downloads[lessonID + 'v']
          ? ((downloads[lessonID].progress +
              downloads[lessonID + 'v'].progress) /
              2) *
              100
          : null
        break
      case 'qv':
      case 'v':
        return downloads[lessonID + 'v']
          ? downloads[lessonID + 'v'].progress * 100
          : null
        break
    }
  }

  // if lesson isn't only video
  return lessonType !== 'q' && lessonType !== '' ? (
    // if lesson has audio source
    isDownloaded ? (
      // if lesson is downloaded, show check
      <TouchableOpacity
        onPress={showDeleteModal}
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
            fill={getDownloadPercentage()}
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
          onPress={showSaveModal}
          style={styles.downloadButtonContainer}
        >
          <Icon
            name='cloud-download'
            color={isDownloaded ? colors.chateau : colors.tuna}
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
