import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

function DownloadStatusIndicator (props) {
  //// RENDER

  // WHAT TO RENDER
  // Has questionsType ?
  //  true: Has audio source?
  //    true: Downloaded?
  //      true: cloud-check
  //      false: Connected?
  // 	      true: Downloading?
  // 	    	  true: progress-bar
  // 		      false: cloud-download
  // 	      false: slash
  //    false: null
  //  false: cloud-down

  function getDownloadPercentage () {
    switch (props.lessonType) {
      case 'qa':
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

  // TODO: show download options/progress for lessons with ONLY video
  return props.lessonType !== 'q' ? (
    // if has audio source
    props.isDownloaded ? (
      // if downloaded, show check
      <TouchableOpacity
        onPress={props.showDeleteModal}
        style={styles.downloadButtonContainer}
      >
        <Icon name='cloud-check' color='#9FA5AD' size={22 * scaleMultiplier} />
      </TouchableOpacity>
    ) : props.isConnected ? (
      props.isDownloading ? (
        // if connected and currently downloading, show progress
        <View style={styles.downloadButtonContainer}>
          <AnimatedCircularProgress
            size={22 * scaleMultiplier}
            width={5 * scaleMultiplier}
            fill={getDownloadPercentage()}
            tintColor={'#828282'}
            rotation={0}
            backgroundColor='#FFFFFF'
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
            color={props.isDownloaded ? '#9FA5AD' : '#3A3C3F'}
            size={22 * scaleMultiplier}
          />
        </TouchableOpacity>
      )
    ) : (
      // if not downloaded and not connected, show slash
      <View style={styles.downloadButtonContainer}>
        <Icon name='cloud-slash' color='#3A3C3F' size={22 * scaleMultiplier} />
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
