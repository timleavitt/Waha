import { Video } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont } from '../constants'

function VideoScreen (props) {
  //+ STATE
  const [video, setVideo] = useState()

  //+ CONSTRUCTOR

  useEffect(() => {
    console.log(props.route.params)
    if (video)
      video
        .loadAsync(
          {
            uri: props.route.params.source
          },
          { progressUpdateIntervalMillis: 1000 }
        )
        .then(() =>
          video.setStatusAsync({
            shouldPlay: props.route.params.shouldPlay,
            positionMillis: props.route.params.playFromPosition
          })
        )
  }, [video])

  //+ FUNCTIONS

  //+ RENDER

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <Video
        ref={ref => {
          setVideo(ref)
        }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        shouldPlay
        style={{
          width: (Dimensions.get('window').width * 16) / 9,
          height: Dimensions.get('window').width,
          transform: [{ rotate: '90deg' }]
        }}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    security: state.security,
    mtUnlockAttempts: state.mtUnlockAttempts
  }
}
function mapDispatchToProps (dispatch) {
  return {
    setAreMobilizationToolsUnlocked: toSet => {
      dispatch(setAreMobilizationToolsUnlocked(toSet))
    },
    setMTUnlockTimeout: time => {
      dispatch(setMTUnlockTimeout(time))
    },
    setMTUnlockAttempts: numAttempts => {
      dispatch(setMTUnlockAttempts(numAttempts))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen)
