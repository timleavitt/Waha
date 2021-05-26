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
  onVideoPlaybackStatusUpdate,
  setIsMediaPlaying,
  fullscreenStatus,
  activeChapter,
  isMediaLoaded
}) => {
  /** Keeps track of whether to show the overlayed video controls or not. */
  const [shouldShowVideoControls, setShouldShowVideoControls] = useState(false)

  /** Keeps track of the device rotation in an object (alpha, beta, and gamma). */
  const [deviceRotation, setDeviceRotation] = useState({})

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
      videoRef.current.presentFullscreenPlayer()
  }, [deviceRotation])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // When the user taps on the video component and the video controls are not present, show them for a few seconds.
        if (!shouldShowVideoControls && isMediaLoaded) {
          setShouldShowVideoControls(true)
          setTimeout(() => setShouldShowVideoControls(false), 2000)
        }
      }}
    >
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          style={{
            // Force a 16:9 aspect ratio.
            width: Dimensions.get('window').width,
            height: (Dimensions.get('window').width * 9) / 16
          }}
          onPlaybackStatusUpdate={onVideoPlaybackStatusUpdate}
          onFullscreenUpdate={({ fullscreenUpdate, status }) => {
            if (Platform.OS === 'android') {
              switch (fullscreenUpdate) {
                // Lock video to landscape whenever we enter fullscreen.
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                  lockLandscape(() => {})
                  break
                // Lock video to portrait when we exit fullscreen.
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                  lockPortrait(() => {})
                  break
                // After exiting fullscreen, automatically start playing the video. This is because of strange Android behavior where upon exiting fullscreen while paused, the layout of the whole Play Screen gets messed up.
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
                  lockPortrait(() => {})
                  if (!isMediaPlaying) videoRef.current.playAsync()
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
            <TouchableOpacity
              onPress={() => videoRef.current.presentFullscreenPlayer()}
            >
              <Icon
                name='fullscreen-enter'
                size={100 * scaleMultiplier}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    height: Dimensions.get('window').width - 80,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shark
  },
  videoControlsOverlayContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shark + '70'
  }
})

export default VideoPlayer
