import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

function VideoPlayer (props) {
  //+ STATE

  const [showVideoControls, setShowVideoControls] = useState(false)
  const [video, setVideo] = useState()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!showVideoControls) {
          setShowVideoControls(true)
          setTimeout(() => setShowVideoControls(false), 1000)
        }
      }}
      style={{ width: '100%' }}
    >
      <View
        style={{
          // flex: 1,
          height: Dimensions.get('window').width - 80,
          width: Dimensions.get('window').width,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.shark
        }}
      >
        {/* <View
          style={{
            // width: Dimensions.get('window').width,
            // height: (Dimensions.get('window').width * 9) / 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        > */}
        <Video
          ref={ref => {
            setVideo(ref)
            props.setVideo(ref)
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          shouldPlay
          // onLoad={() => {
          //   console.log('loaded')
          //   props.setIsMediaLoaded(true)
          // }}
          style={{
            width: Dimensions.get('window').width,
            // height: Dimensions.get('window').width - 80
            height: (Dimensions.get('window').width * 9) / 16
            // flex: 1
          }}
          onPlaybackStatusUpdate={status => {
            // match up so there's a single source of truth between
            //  waha controls and full screen native video controls
            if (
              props.fullscreenStatus ===
              Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            ) {
              if (status.isPlaying) props.setIsMediaPlaying(true)
              else if (!status.isPlaying) props.setIsMediaPlaying(false)
            }

            if (status.isLoaded && !props.isMediaLoaded) {
              console.log('loaded')
              props.setIsMediaLoaded(true)
            }

            // if we're buffering, turn play icon into activity indicator
            // if (!status.isBuffering) props.setIsVideoBuffering(false)
            // else if (status.isBuffering) props.setIsVideoBuffering(true)

            // if video finishes, switch to last chapter

            // if (
            //   props.fullscreenStatus ===
            //   Video.IOS_FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
            // )

            // exit fullscreen once video finishes
            if (
              status.didJustFinish &&
              props.fullscreenStatus ===
                Video.IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            ) {
              ScreenOrientation.lockAsync(props.lastPortraitOrientation)
              props.video.dismissFullscreenPlayer()
            }

            if (status.didJustFinish && props.lessonType !== 'v')
              setTimeout(() => props.changeChapter('application'), 500)
            else if (
              status.didJustFinish &&
              props.lessonType === 'v' &&
              !props.isComplete
            ) {
              setTimeout(() => props.changeCompleteStatus(), 1000)
            }
          }}
          onLoadStart={() => props.setIsMediaLoaded(false)}
          onLoad={() => props.setIsMediaLoaded(true)}
          onFullscreenUpdate={({ fullscreenUpdate, status }) => {
            props.setFullScreenStatus(fullscreenUpdate)
          }}
        />
        {/* display a video icon placeholder when we're loading */}
        {props.isMediaLoaded ? null : (
          <View
            style={{
              alignSelf: 'center',
              width: '100%',
              position: 'absolute',
              alignItems: 'center'
            }}
          >
            <Icon
              name='video'
              size={100 * scaleMultiplier}
              color={colors.oslo}
            />
          </View>
        )}
        {/* video controls overlay */}
        {showVideoControls ? (
          <View
            style={{
              width: '100%',
              height: 65 * scaleMultiplier,
              position: 'absolute',
              alignSelf: 'flex-end',
              backgroundColor: colors.shark + '50',
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => {
                video.presentFullscreenPlayer()
              }}
            >
              <Icon
                name='fullscreen-enter'
                size={50 * scaleMultiplier}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {/* </View> */}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  topPortion: {
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    resizeMode: 'contain',
    height: 170 * scaleMultiplier,
    alignSelf: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(VideoPlayer)
