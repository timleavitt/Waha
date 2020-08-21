import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// renders the icon on the right side of lesson item that shows the download
//  status
function DownloadStatusIndicator (props) {
  //// RENDER

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
    switch (props.lessonType) {
      case 'qa':
      case 'a':
        return props.downloads[props.lessonID] * 100
        break
      case 'qav':
        return (
          ((props.downloads[props.lessonID] +
            props.downloads[props.lessonID + 'v']) /
            2) *
          100
        )
        break
      case 'qv':
      case 'v':
        return props.downloads[props.lessonID + 'v'] * 100
        break
    }
  }

  // if lesson isn't only video
  return props.lessonType !== 'q' && props.lessonType !== 'c' ? (
    // if lesson has audio source
    props.isDownloaded ? (
      // if lesson is downloaded, show check
      <TouchableOpacity
        onPress={props.showDeleteModal}
        style={styles.downloadButtonContainer}
      >
        <Icon
          name='cloud-check'
          color={colors.chateau}
          size={22 * scaleMultiplier}
        />
      </TouchableOpacity>
    ) : props.isConnected ? (
      props.isDownloading ? (
        // if connected and currently downloading, show progress
        <View style={styles.downloadButtonContainer}>
          <AnimatedCircularProgress
            size={22 * scaleMultiplier}
            width={5 * scaleMultiplier}
            fill={getDownloadPercentage()}
            tintColor={colors.oslo}
            rotation={0}
            backgroundColor={colors.white}
          />
        </View>
      ) : (
        // if not downloaded, not downloading, and connected, show download icon
        <TouchableOpacity
          onPress={props.showSaveModal}
          style={styles.downloadButtonContainer}
        >
          <Icon
            name='cloud-download'
            color={props.isDownloaded ? colors.chateau : colors.tuna}
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

//// STYLES

const styles = StyleSheet.create({
  downloadButtonContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20
  }
})

//// REDUX

function mapStateToProps (state) {
  return {
    isConnected: state.network.isConnected,
    downloads: state.downloads
  }
}

export default connect(mapStateToProps)(DownloadStatusIndicator)
