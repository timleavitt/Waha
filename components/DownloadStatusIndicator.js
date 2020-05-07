import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

function DownloadStatusIndicator (props) {
  //// RENDER

  // Downloaded?
  // true: cloud-check
  // false: Connected?
  // 	true: Downloading?
  // 		true: progress-bar
  // 		false: cloud-down
  // 	false: slash

  return props.isDownloaded ? (
    // if downloaded
    <TouchableOpacity
      onPress={props.showDeleteModal}
      style={styles.downloadButtonContainer}
    >
      <Icon
        name='cloud-check-outline'
        color='#9FA5AD'
        size={25 * scaleMultiplier}
      />
    </TouchableOpacity>
  ) : props.isConnected ? (
    props.lessonID in props.downloads ? (
      // if connected and currently downloading
      <View style={styles.downloadButtonContainer}>
        <AnimatedCircularProgress
          size={22 * scaleMultiplier}
          width={5 * scaleMultiplier}
          fill={props.downloads[props.lessonID] * 100}
          tintColor={'#828282'}
          rotation={0}
          backgroundColor='#FFFFFF'
        />
      </View>
    ) : (
      // if not downloaded, not downloading, and connected
      <TouchableOpacity
        onPress={props.showSaveModal}
        style={styles.downloadButtonContainer}
      >
        <Icon
          name='cloud-download-outline'
          color={props.isDownloaded ? '#9FA5AD' : '#3A3C3F'}
          size={25 * scaleMultiplier}
        />
      </TouchableOpacity>
    )
  ) : (
    // not downloaded and not connected
    <View style={styles.downloadButtonContainer}>
      <Icon
        name='cloud-slash-outline'
        color='#3A3C3F'
        size={25 * scaleMultiplier}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  downloadButtonContainer: {
    justifyContent: 'center',
    marginHorizontal: 15
  }
})

function mapStateToProps (state) {
  return {
    isConnected: state.network.isConnected,
    downloads: state.downloads
  }
}

export default connect(mapStateToProps)(DownloadStatusIndicator)
