import { Video } from 'expo-av'
import React, { useState } from 'react'
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { lockLandscape, lockPortrait, scaleMultiplier } from '../constants'
import { colors } from '../styles/colors'

function VideoPlayer ({
  // Props passed from a parent component.
  videoSource,
  video,
  setVideo,
  setIsMediaLoaded,
  setIsMediaPlaying,
  changeChapter,
  isMediaLoaded,
  lessonType,
  isComplete,
  changeCompleteStatus,
  setFullScreenStatus,
  fullscreenStatus
}) {
  //+ STATE

  const [showVideoControls, setShowVideoControls] = useState(false)
  // const [video, setVideo] = useState()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!showVideoControls) {
          setShowVideoControls(true)
          setTimeout(() => setShowVideoControls(false), 2000)
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
        <Video
          ref={ref => {
            setVideo(ref)
            setVideo(ref)
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          shouldPlay
          // onLoad={() => {
          //   console.log('loaded')
          //   setIsMediaLoaded(true)
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
              fullscreenStatus === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            ) {
              if (status.isPlaying) setIsMediaPlaying(true)
              else if (!status.isPlaying) setIsMediaPlaying(false)
            }

            if (status.isLoaded && !isMediaLoaded) {
              console.log('loaded')
              setIsMediaLoaded(true)
            }

            // lock portrait and exit full screen once the video finishes
            if (
              status.didJustFinish &&
              fullscreenStatus ===
                Video.IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            ) {
              lockPortrait(() => video.dismissFullscreenPlayer())
              // ScreenOrientation.supportsOrientationLockAsync(
              //   ScreenOrientation.OrientationLock.PORTRAIT
              // ).then(isSupported => {
              //   if (isSupported) {
              //     ScreenOrientation.lockAsync(
              //       ScreenOrientation.OrientationLock.PORTRAIT
              //     ).then(() => {
              //       video.dismissFullscreenPlayer()
              //     })
              //   } else {
              //     ScreenOrientation.lockAsync(
              //       ScreenOrientation.OrientationLock.PORTRAIT_UP
              //     ).then(() => {
              //       video.dismissFullscreenPlayer()
              //     })
              //   }
              // })
            }

            if (status.didJustFinish && lessonType !== 'v')
              setTimeout(() => changeChapter('application'), 500)
            else if (
              status.didJustFinish &&
              lessonType === 'v' &&
              !isComplete
            ) {
              setTimeout(() => changeCompleteStatus(), 1000)
            }
          }}
          onLoadStart={() => setIsMediaLoaded(false)}
          onLoad={() => setIsMediaLoaded(true)}
          onFullscreenUpdate={({ fullscreenUpdate, status }) => {
            if (Platform.OS === 'android') {
              switch (fullscreenUpdate) {
                // lock video to landscape whenever you enter full screen
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                  lockLandscape(() => {})
                  // ScreenOrientation.lockAsync(
                  //   ScreenOrientation.OrientationLock.LANDSCAPE
                  // )
                  break
                // lock video to portrait when we exit full screen
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                  lockPortrait(() => {})
                  // ScreenOrientation.supportsOrientationLockAsync(
                  //   ScreenOrientation.OrientationLock.PORTRAIT
                  // ).then(isSupported => {
                  //   if (isSupported) {
                  //     ScreenOrientation.lockAsync(
                  //       ScreenOrientation.OrientationLock.PORTRAIT
                  //     )
                  //   } else {
                  //     ScreenOrientation.lockAsync(
                  //       ScreenOrientation.OrientationLock.PORTRAIT_UP
                  //     )
                  //   }
                  // })
                  break
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
                  lockPortrait(() => {})
                  // ScreenOrientation.supportsOrientationLockAsync(
                  //   ScreenOrientation.OrientationLock.PORTRAIT
                  // ).then(isSupported => {
                  //   if (isSupported) {
                  //     ScreenOrientation.lockAsync(
                  //       ScreenOrientation.OrientationLock.PORTRAIT
                  //     )
                  //   } else {
                  //     ScreenOrientation.lockAsync(
                  //       ScreenOrientation.OrientationLock.PORTRAIT_UP
                  //     )
                  //   }
                  // })
                  video.playAsync()
                  setIsMediaPlaying(true)
                  break
                // default:
                //   ScreenOrientation.supportsOrientationLockAsync(
                //     ScreenOrientation.OrientationLock.PORTRAIT
                //   ).then(isSupported => {
                //     if (isSupported) {
                //       ScreenOrientation.lockAsync(
                //         ScreenOrientation.OrientationLock.PORTRAIT
                //       )
                //     } else {
                //       ScreenOrientation.lockAsync(
                //         ScreenOrientation.OrientationLock.PORTRAIT_UP
                //       )
                //     }
                //   })
                //   break
              }
            } else {
              if (
                fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
              ) {
                setIsMediaPlaying(false)
              }
            }
            setFullScreenStatus(fullscreenUpdate)
          }}
        />
        {/* display a video icon placeholder when we're loading */}
        {isMediaLoaded ? null : (
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
              height: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.shark + '70'
            }}
          >
            <TouchableOpacity
              style={{}}
              onPress={() => {
                video.presentFullscreenPlayer()
                // navigateToFullscreen()
              }}
            >
              <Icon
                name='fullscreen-enter'
                size={100 * scaleMultiplier}
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

export default VideoPlayer
