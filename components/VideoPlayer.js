import { Video } from 'expo-av'
import { DeviceMotion } from 'expo-sensors'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import {
  chapters,
  lockLandscape,
  lockPortrait,
  scaleMultiplier
} from '../constants'
import { colors } from '../styles/colors'

const VideoPlayer = ({
  // Props passed from a parent component.
  videoSource,
  videoRef,
  onPlaybackStatusUpdate,
  setIsMediaPlaying,
  fullscreenStatus,
  setFullScreenStatus,
  activeChapter
}) => {
  const [shouldShowVideoControls, setShouldShowVideoControls] = useState(false)

  /** Keeps track of the device rotation in an object (alpha, beta, and gamma). */
  const [deviceRotation, setDeviceRotation] = useState({})

  /** useEffect function that adds a device motion listener on iOS devices. This is so that the app can automatically enter fullscreen when the user rotates their phone. */
  useEffect(() => {
    // check if we can get any device motion data and if so, add a listener
    if (Platform.OS === 'ios' && activeChapter === chapters.TRAINING)
      DeviceMotion.isAvailableAsync().then(isAvailable => {
        console.log(isAvailable)
        if (isAvailable) {
          DeviceMotion.setUpdateInterval(1000)
          DeviceMotion.addListener(({ rotation }) => {
            setDeviceRotation(rotation)
          })
        }
      })
    else DeviceMotion.removeAllListeners()

    // Cleanup function that cancels the device motion listener.
    return async function cleanup () {
      DeviceMotion.removeAllListeners()
    }
  }, [activeChapter])

  /**
   * Checks if the current device rotation is within the bounds of being considered landscape.
   * @returns - Whether the current device rotation satisfies the requirements for landscape.
   */
  const isLandscape = () =>
    deviceRotation
      ? (deviceRotation.alpha > 1 || deviceRotation.alpha < -1) &&
        (deviceRotation.gamma > 0.7 || deviceRotation.gamma < -0.7) &&
        deviceRotation.beta > -0.2 &&
        deviceRotation.beta < 0.2
      : false

  /**
   * useEffect function that enters fullscreen mode when the video component is present, the video source is loaded, we're on ios (this feature doesn't work on android), and the device rotation matches that of landscape.
   * @function
   */
  useEffect(() => {
    // If the user's phone is in landscape position, the video is on screen, and they're not in full screen mode, activate full screen mode.
    if (
      activeChapter === chapters.TRAINING &&
      fullscreenStatus === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS &&
      isLandscape()
    )
      videoRef.current.presentFullscreenPlayer()
  }, [deviceRotation])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!shouldShowVideoControls) {
          setShouldShowVideoControls(true)
          setTimeout(() => setShouldShowVideoControls(false), 2000)
        }
      }}
      style={{ width: '100%', position: 'absolute' }}
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
          ref={videoRef}
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
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          // onLoadStart={() => setIsMediaLoaded(false)}
          // onLoad={() => setIsMediaLoaded(true)}
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
                  videoRef.playAsync()
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
        {/* {isMediaLoaded ? null : (
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
        )} */}
        {/* video controls overlay */}
        {shouldShowVideoControls ? (
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
                videoRef.presentFullscreenPlayer()
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
