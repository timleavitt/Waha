import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useState } from 'react'
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'

function VideoPlayer (props) {
  //+ STATE

  const [showVideoControls, setShowVideoControls] = useState(false)
  const [video, setVideo] = useState()

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

            // lock portrait and exit full screen once the video finishes
            if (
              status.didJustFinish &&
              props.fullscreenStatus ===
                Video.IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
            ) {
              ScreenOrientation.supportsOrientationLockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
              ).then(isSupported => {
                if (isSupported) {
                  ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT
                  ).then(() => {
                    props.video.dismissFullscreenPlayer()
                  })
                } else {
                  ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                  ).then(() => {
                    props.video.dismissFullscreenPlayer()
                  })
                }
              })
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
            if (Platform.OS === 'android') {
              switch (fullscreenUpdate) {
                // lock video to landscape whenever you enter full screen
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
                  ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE
                  )
                  break
                // lock video to portrait when we exit full screen
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                  ScreenOrientation.supportsOrientationLockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT
                  ).then(isSupported => {
                    if (isSupported) {
                      ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.PORTRAIT
                      )
                    } else {
                      ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.PORTRAIT_UP
                      )
                    }
                  })
                  break
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
                  props.video.playAsync()
                  props.setIsMediaPlaying(true)
              }
            } else {
              if (
                fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
              ) {
                props.setIsMediaPlaying(false)
              }
            }
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
                // props.navigateToFullscreen()
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

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(VideoPlayer)
