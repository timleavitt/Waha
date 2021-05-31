import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import { DeviceMotion } from 'expo-sensors'
import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  chapters,
  isTablet,
  lockLandscape,
  lockPortrait,
  scaleMultiplier
} from '../constants'
import { colors } from '../styles/colors'

/**
 * A component that shows a video. Used on the Play Screen during Training chapters.
 * @param {string} videoSource - The URI source (local or remote) of the .mp4 file to play.
 * @param {ref} videoRef - The ref for the video.
 * @param {Function} onVideoPlaybackStatusUpdate - Function to call whenever the playback status changes. Used for audio and video.
 * @param {Function} setIsMediaPlaying - Function to set the isMediaPlaying state on the Play Screen.
 * @param {number} fullscreenStatus - The current fullscreen status as a number which is a value of an enum used in the Video library.
 * @param {number} activeChapter - The currently active chapter. See chapters in constants.js.
 */
const VideoPlayer = ({
  // Props passed from a parent component.
  videoSource,
  videoRef,
  media,
  onVideoPlaybackStatusUpdate,
  isMediaPlaying,
  setIsMediaPlaying,
  fullscreenStatus,
  activeChapter,
  isMediaLoaded
}) => {
  /** Keeps track of whether to show the overlayed video controls or not. */
  const [shouldShowVideoControls, setShouldShowVideoControls] = useState(false)

  /** Keeps track of the device rotation in an object (alpha, beta, and gamma). */
  const [deviceRotation, setDeviceRotation] = useState({})

  const [currentOrientation, setCurrentOrientation] = useState()

  const setOrientation = orientation => {
    switch (orientation) {
      case ScreenOrientation.Orientation.UNKNOWN:
      case ScreenOrientation.Orientation.PORTRAIT_UP:
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        setCurrentOrientation('portrait')
        break
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        setCurrentOrientation('landscape')
        break
    }
  }

  useEffect(() => {
    ScreenOrientation.getOrientationAsync().then(orientation => {
      setOrientation(orientation)
    })

    const orientationListener = ScreenOrientation.addOrientationChangeListener(
      ({ orientationInfo }) => setOrientation(orientationInfo.orientation)
    )

    return async function cleanup () {
      ScreenOrientation.removeOrientationChangeListener(orientationListener)
    }
  }, [])

  useEffect(() => {
    console.log(currentOrientation)
  }, [currentOrientation])

  /** useEffect function that adds a device motion listener on iOS devices. This is so that the app can automatically enter fullscreen when the user rotates their phone. */
  useEffect(() => {
    if (Platform.OS === 'ios' && activeChapter === chapters.TRAINING)
      DeviceMotion.isAvailableAsync().then(isAvailable => {
        if (isAvailable) {
          DeviceMotion.setUpdateInterval(1000)
          DeviceMotion.addListener(({ rotation }) => {
            setDeviceRotation(rotation)
          })
        }
      })
    else if (Platform.OS === 'ios' && activeChapter !== chapters.TRAINING)
      DeviceMotion.removeAllListeners()

    // Cleanup function that cancels the device motion listener.
    return async function cleanup () {
      if (Platform.OS === 'ios') DeviceMotion.removeAllListeners()
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

  /** useEffect function that enters fullscreen mode when we're on the Training chapter, we're not already in fullscreen, and the user's phone is in landscape orientation. */
  useEffect(() => {
    // If the user's phone is in landscape position, the video is on screen, and they're not in full screen mode, activate full screen mode.
    if (
      activeChapter === chapters.TRAINING &&
      fullscreenStatus.current === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS &&
      isLandscape()
    )
      media.openFullscreen()
  }, [deviceRotation])

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: '100%',
        height: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        flexDirection: currentOrientation === 'portrait' ? 'row' : 'column'
      }}
      onPress={() => {
        // When the user taps on the video component and the video controls are not present, show them for a few seconds.
        if (!shouldShowVideoControls && isMediaLoaded) {
          setShouldShowVideoControls(true)
          setTimeout(() => setShouldShowVideoControls(false), 2000)
        }
      }}
    >
      <View
        style={{
          flex: 1,
          aspectRatio: 14 / 9,
          backgroundColor: colors.shark,
          overflow: 'hidden'
        }}
      >
        <Video
          ref={videoRef}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          style={{
            flex: 1
          }}
          onPlaybackStatusUpdate={onVideoPlaybackStatusUpdate}
          onFullscreenUpdate={({ fullscreenUpdate, status }) => {
            if (Platform.OS === 'android') {
              switch (fullscreenUpdate) {
                // Lock video to landscape whenever we enter fullscreen.
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                  !isTablet && lockLandscape(() => {})
                  break
                // Lock video to portrait when we exit fullscreen.
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                  !isTablet && lockPortrait(() => {})
                  break
                // After exiting fullscreen, automatically start playing the video. This is because of strange Android behavior where upon exiting fullscreen while paused, the layout of the whole Play Screen gets messed up.
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
                  !isTablet && lockPortrait(() => {})
                  if (!isMediaPlaying) media.play(activeChapter)
                  setIsMediaPlaying(true)
                  break
              }
            } else if (Platform.OS === 'ios') {
              // The default iOS behavior is to pause a video whenever fullscreen exits. In order to keep the playing status of the video lined up with the isMediaPlaying state, we set the latter to false whenever fullscreen exits.
              if (
                fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
              )
                setIsMediaPlaying(false)
            }

            // Update the fullscreenStatus Play Screen state.
            fullscreenStatus.current = fullscreenUpdate
          }}
        />
        {/* Video controls overlay. */}
        {shouldShowVideoControls && (
          <View style={styles.videoControlsOverlayContainer}>
            <TouchableOpacity onPress={() => media.openFullscreen()}>
              <Icon
                name='fullscreen-enter'
                size={100 * scaleMultiplier}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    aspectRatio: 9 / 16
  },
  videoControlsOverlayContainer: {
    paddingVertical: 20,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shark + '60'
  }
})

export default VideoPlayer
