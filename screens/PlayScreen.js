import useInterval from '@use-it/interval'
import { Audio, Video } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { useKeepAwake } from 'expo-keep-awake'
import * as ScreenOrientation from 'expo-screen-orientation'
import { DeviceMotion } from 'expo-sensors'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import AlbumArtSwiper from '../components/AlbumArtSwiper'
import BackButton from '../components/BackButton'
import BookView from '../components/BookView'
import ChapterSelect from '../components/ChapterSelect'
import MessageModal from '../components/MessageModal'
import PlayPauseSkip from '../components/PlayPauseSkip'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import Scrubber from '../components/Scrubber'
import ShareModal from '../components/ShareModal'
import VideoPlayer from '../components/VideoPlayer'
import { colors, getLessonInfo, scaleMultiplier } from '../constants'
import {
  downloadLesson,
  downloadVideo,
  removeDownload
} from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'

function PlayScreen (props) {
  //+ AUDIO / VIDEO STATE

  // objects for storing audio/video
  const [audio, setAudio] = useState(new Audio.Sound())
  const [video, setVideo] = useState()

  // stores the length of the current media file in milliseconds (loaded by sound object)
  const [mediaLength, setMediaLength] = useState(null)

  // keeps track of if the media file is loaded
  const [isMediaLoaded, setIsMediaLoaded] = useState(false)

  // keeps track of if the video is buffering
  // const [isVideoBuffering, setIsVideoBuffering] = useState(false)

  // keeps track of whether the audio/video file is playing or paused
  const [isMediaPlaying, setIsMediaPlaying] = useState(false)

  // keeps track of the current position of the seeker in ms
  const [seekPosition, setSeekPosition] = useState(0)

  // keeps track of if the seeker should update every second
  // note: only time it shouldn't is during seeking, skipping, or loading a new //  chapter
  const shouldThumbUpdate = useRef(false)

  //+ CHAPTER SOURCES STATE

  // keeps track of currently playing chapter
  const [activeChapter, setActiveChapter] = useState('fellowship')

  // sources for all 3 audio files
  const [fellowshipSource, setFellowshipSource] = useState()
  const [storySource, setStorySource] = useState()
  const [trainingSource, setTrainingSource] = useState()
  const [applicationSource, setApplicationSource] = useState()

  //+ MISCELLANEOUS STATE

  const [thisSetProgress, setThisSetProgress] = useState([])

  // opacity/z-index of play button that pops up on play/pause
  const [playOpacity, setPlayOpacity] = useState(new Animated.Value(0))
  const [animationZIndex, setAnimationZIndex] = useState(0)

  // ref for the middle album art scroller
  const [albumArtSwiperRef, setAlbumArtSwiperRef] = useState()

  // share modal
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false)

  // keeps track of the current screen orientation for fullscreen videos
  const [fullscreenStatus, setFullscreenStatus] = useState(
    Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
  )
  const [deviceRotation, setDeviceRotation] = useState({})
  const [lastPortraitOrientation, setLastPortraitOrientation] = useState(
    ScreenOrientation.OrientationLock.PORTRAIT_UP
  )

  // handle device rotation changes and set device orientation accordingly
  useEffect(() => {
    if (deviceRotation) {
      if (fullscreenStatus === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS) {
        if (
          video &&
          trainingSource &&
          deviceRotation &&
          (deviceRotation.alpha > 1 || deviceRotation.alpha < -1) &&
          deviceRotation.beta > -0.2 &&
          deviceRotation.beta < 0.2
        )
          video.presentFullscreenPlayer()
        else if (deviceRotation.beta < -0.7) {
          ScreenOrientation.supportsOrientationLockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_DOWN
          ).then(isSupported => {
            if (isSupported) {
              ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_DOWN
              )
              setLastPortraitOrientation(
                ScreenOrientation.OrientationLock.PORTRAIT_DOWN
              )
            }
          })
        } else if (deviceRotation.beta > 0.7) {
          setLastPortraitOrientation(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          )
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          )
        }
      }
    }
  }, [deviceRotation, video, trainingSource])

  useEffect(() => {
    if (fullscreenStatus === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT) {
      ScreenOrientation.supportsOrientationLockAsync(
        ScreenOrientation.OrientationLock.ALL
      ).then(isSupported => {
        if (isSupported)
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL)
        else
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
      })
    } else {
      ScreenOrientation.lockAsync(lastPortraitOrientation)
    }
  }, [fullscreenStatus])

  useEffect(() => {
    setThisSetProgress(
      props.activeGroup.addedSets.filter(
        set => set.id === props.route.params.thisSet.id
      )[0].progress
    )
  }, [props.activeGroup.addedSets])

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [thisSetProgress])

  // keeps the screen always awake on this screen
  useKeepAwake()

  //+ NAV OPTIONS

  function getNavOptions () {
    return {
      headerTitle: getLessonInfo('subtitle', props.route.params.thisLesson.id),
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => (
            <PlayScreenHeaderButtons
              shareOnPress={() => setShowShareLessonModal(true)}
              completeOnPress={changeCompleteStatus}
              completeCondition={thisSetProgress.includes(
                getLessonInfo('index', props.route.params.thisLesson.id)
              )}
            />
          ),
      headerLeft: props.isRTL
        ? () => (
            <PlayScreenHeaderButtons
              shareOnPress={() => setShowShareLessonModal(true)}
              completeOnPress={changeCompleteStatus}
              completeCondition={thisSetProgress.includes(
                getLessonInfo('index', props.route.params.thisLesson.id)
              )}
            />
          )
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //+ CONSTRUCTOR

  useEffect(() => {
    // set some audio settings
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playThroughEarpieceAndroid: false
    })

    // set sources and download stuff if we need to
    setSources()

    // check if we can get any device motion data and if so, add a listener
    DeviceMotion.isAvailableAsync().then(isAvailable => {
      if (isAvailable) {
        DeviceMotion.setUpdateInterval(1000)
        DeviceMotion.addListener(({ rotation }) => {
          setDeviceRotation(rotation)
        })
      }
    })

    // when leaving the screen, cancel the interval timer and unload the audio
    //  file
    return async function cleanup () {
      if (audio) {
        setAudio(null)
        await audio.unloadAsync()
      }

      if (video) {
        setVideo(null)
        await video.unloadAsync()
      }
      // re-lock orientation to portrait up
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }
  }, [])

  // useEffect(() => {
  //   //set nav options
  //   console.log('setting nav options')

  // }, [props.activeGroup])

  //+ LOADING FUNCTIONS

  //- sets the sources for all the chapters based on lesson type and whether
  //-   various chapters are downloaded or not
  function setSources () {
    // set all possible sources for ease of use later
    var fellowshipLocal =
      FileSystem.documentDirectory +
      props.activeGroup.language +
      '-' +
      props.route.params.thisLesson.fellowshipType +
      '.mp3'

    var applicationLocal =
      FileSystem.documentDirectory +
      props.activeGroup.language +
      '-' +
      props.route.params.thisLesson.applicationType +
      '.mp3'

    var storyLocal =
      FileSystem.documentDirectory + props.route.params.thisLesson.id + '.mp3'

    var storyStream = getLessonInfo(
      'audioSource',
      props.route.params.thisLesson.id
    )

    var storyDummy =
      FileSystem.documentDirectory +
      props.activeGroup.language +
      '-' +
      'dummy-story.mp3'

    var trainingLocal =
      FileSystem.documentDirectory + props.route.params.thisLesson.id + 'v.mp4'

    var trainingStream = getLessonInfo(
      'videoSource',
      props.route.params.thisLesson.id
    )

    // set sources appropriately based on the lesson type
    switch (props.route.params.lessonType) {
      case 'qa':
        setFellowshipSource(fellowshipLocal)
        setStorySource(storyLocal)
        setTrainingSource(null)
        setApplicationSource(applicationLocal)

        // start downloading stuff if it's not downloaded
        if (
          !props.route.params.isDownloaded &&
          !props.route.params.isDownloading
        )
          props.downloadLesson(
            props.route.params.thisLesson.id,
            getLessonInfo('audioSource', props.route.params.thisLesson.id)
          )
        break
      case 'qav':
        setFellowshipSource(fellowshipLocal)
        setStorySource(storyLocal)
        setTrainingSource(trainingLocal)
        setApplicationSource(applicationLocal)

        // start downloading stuff if it's not downloaded
        if (
          !props.route.params.isDownloaded &&
          !props.route.params.isDownloading
        ) {
          props.downloadLesson(
            props.route.params.thisLesson.id,
            getLessonInfo('audioSource', props.route.params.thisLesson.id)
          )
          props.downloadVideo(
            props.route.params.thisLesson.id,
            getLessonInfo('videoSource', props.route.params.thisLesson.id)
          )
        }
        break
      case 'qv':
        setFellowshipSource(fellowshipLocal)
        setStorySource(storyDummy)
        setTrainingSource(trainingLocal)
        setApplicationSource(applicationLocal)

        // start downloading stuff if it's not downloaded
        if (
          !props.route.params.isDownloaded &&
          !props.route.params.isDownloading
        )
          props.downloadVideo(
            props.route.params.thisLesson.id,
            getLessonInfo('videoSource', props.route.params.thisLesson.id)
          )
        break
      case 'v':
        changeChapter('training')
        setFellowshipSource(null)
        setStorySource(null)
        setTrainingSource(
          props.route.params.isDownloaded ? trainingLocal : trainingStream
        )
        setApplicationSource(null)
        break
      case 'q':
        setFellowshipSource(fellowshipLocal)
        setStorySource(storyDummy)
        setTrainingSource(null)
        setApplicationSource(applicationLocal)
        break
      case 'a':
        changeChapter('story')
        setFellowshipSource(null)
        setStorySource(
          props.route.params.isDownloaded ? storyLocal : storyStream
        )
        setTrainingSource(null)
        setApplicationSource(null)
        break
    }
  }

  //- once we set a chapter 1 source, load it up
  useEffect(() => {
    if (fellowshipSource) {
      loadMedia('audio', fellowshipSource)
    }
  }, [fellowshipSource])

  //- if we lose connection during a video-only lesson, reload it once we come
  //-  back online
  useEffect(() => {
    if (props.route.params.lessonType === 'v')
      if (props.isConnected && !isMediaLoaded && trainingSource)
        loadVideoFile('video', trainingSource)
  }, [props.isConnected])

  //- loads an audio file, sets the length, and starts playing it
  async function loadMedia (type, source) {
    var media = type === 'video' ? video : audio
    try {
      await media
        .loadAsync({ uri: source }, { progressUpdateIntervalMillis: 1000 })
        .then(playbackStatus => {
          setMediaLength(playbackStatus.durationMillis)
          media.setStatusAsync({
            progressUpdateIntervalMillis: 1000,
            shouldPlay: true
          })
          shouldThumbUpdate.current = true
          setIsMediaPlaying(true)
        })
    } catch (error) {
      console.log(error)
    }
  }

  //- load video once we have our video object and training source
  //! only for lessons with videos
  useEffect(() => {
    if (video && trainingSource) {
      loadMedia('video', trainingSource)
    }
  }, [video, trainingSource])

  //- load audio file for audio books once we have a story source
  //! only for audio book lesosns
  useEffect(() => {
    if (props.route.params.lessonType === 'a' && storySource) {
      loadMedia('audio', storySource)
    }
  }, [storySource])

  //+ PLAYBACK CONTROL FUNCTIONS

  //- plays the audio if it's currently paused and pauses the audio if it's currently playing
  function playHandler () {
    var media = video ? video : audio
    media.action = isMediaPlaying ? media.pauseAsync : media.playAsync

    setIsMediaPlaying(currentStatus => !currentStatus)
    startPlayPauseAnimation()
    updateThumb()

    // only play/pause if we're loaded
    if (isMediaLoaded) {
      media.action()
    }
  }

  //- plays media from a specified location
  function playFromLocation (value) {
    console.log(value)
    shouldThumbUpdate.current = false
    setSeekPosition(value)

    var media = video ? video : audio
    // only play/pause if we're loaded
    if (isMediaLoaded) {
      media
        .setStatusAsync({
          shouldPlay: isMediaPlaying ? true : false,
          positionMillis: value
        })
        .then(() => {
          shouldThumbUpdate.current = true
        })
    }
  }

  //- starts the animation for the play button over the album art pane
  function startPlayPauseAnimation () {
    setAnimationZIndex(2)
    Animated.sequence([
      Animated.timing(playOpacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true
      }),
      Animated.timing(playOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => setAnimationZIndex(0))
  }

  //- interval for updating seeker
  useInterval(updateThumb, 1000)

  //- gets called every second by our timer and updates the seeker position based on the progress through the media file
  async function updateThumb () {
    var media = video ? video : audio

    // only update our seeker position if our state allows
    if (shouldThumbUpdate.current) {
      // get the current progress through the media and update state
      await media
        .getStatusAsync()
        .then(playbackStatus => {
          setSeekPosition(playbackStatus.positionMillis)
        })
        .catch(error => console.log(error))
    }
  }

  //- changes the active chapter
  function changeChapter (chapter) {
    if (chapter !== activeChapter) {
      audio.unloadAsync()
      shouldThumbUpdate.current = false
      if (chapter === 'fellowship') {
        setSeekPosition(0)
        loadMedia('audio', fellowshipSource)
      } else if (chapter === 'story') {
        setSeekPosition(0)
        if (storySource) {
          loadMedia('audio', storySource)
        }
        // auto scroll to scripture if
        //  1. there's no audio source
        //  2. we're currently downloading the lesson
        //  3. there's an audio source, it's not downloading, and there's no
        //    internet
        if (!props.route.params.thisLesson.hasAudio) swipeToScripture()
      } else if (chapter === 'application') {
        setSeekPosition(0)
        loadMedia('audio', applicationSource)
      } else if (chapter === 'training') {
        setIsMediaLoaded(false)
        setSeekPosition(0)
      }
      setActiveChapter(chapter)
    }
  }

  //- updates something on every api call to audio object and every second
  audio.setOnPlaybackStatusUpdate(playbackStatus => {
    if (playbackStatus.isLoaded) {
      setIsMediaLoaded(true)
    }

    // depending on what chapter we're on, either jump to the next
    //  chapter once we finish or toggle the whole lesson as complete
    if (playbackStatus.didJustFinish) {
      if (activeChapter === 'fellowship') {
        if (!props.route.params.thisLesson.hasAudio) {
          changeChapter('story')
          swipeToScripture()
        } else if (
          props.downloads[props.route.params.thisLesson.id] ||
          ((props.route.params.lessonType === 'qa' ||
            props.route.params.lessonType === 'qav') &&
            !props.isConnected &&
            !props.route.params.isDownloaded)
        ) {
          swipeToScripture()
        } else {
          changeChapter('story')
        }
      } else if (activeChapter === 'story') {
        switch (props.route.params.lessonType) {
          case 'qa':
            if (!props.isDownloading) {
              setTimeout(() => changeChapter('application'), 1000)
            }
            break
          case 'qav':
            if (!props.downloads[props.route.params.thisLesson.id + 'v']) {
              setTimeout(() => changeChapter('training'), 1000)
            }
            break
          case 'a':
            if (
              !thisSetProgress.includes(
                getLessonInfo('index', props.route.params.thisLesson.id)
              )
            ) {
              changeCompleteStatus()
            }
        }
      } else if (
        activeChapter === 'application' &&
        !thisSetProgress.includes(
          getLessonInfo('index', props.route.params.thisLesson.id)
        )
      ) {
        changeCompleteStatus()
      }
    }
  })

  //- pause lesson if we move to a different screen (i.e. when switching to
  //-   splash / game for security mode)
  useEffect(() => {
    if (isMediaPlaying) playHandler()
  }, [props.navigation.isFocused()])

  //+ OTHER FUNCTIONS

  //- scrolls the album art swiper to the scripture pane
  function swipeToScripture () {
    if (albumArtSwiperRef)
      albumArtSwiperRef.scrollToIndex({
        animated: true,
        viewPosition: 0.5,
        viewOffset: -Dimensions.get('screen').width,
        index: 0
      })
  }

  //- if a download finishes, remove it from download tracker
  useEffect(() => {
    switch (props.route.params.lessonType) {
      case 'qa':
        if (props.downloads[props.route.params.thisLesson.id] === 1)
          props.removeDownload(props.route.params.thisLesson.id)
        break
      case 'qav':
        if (
          props.downloads[props.route.params.thisLesson.id] === 1 &&
          props.downloads[props.route.params.thisLesson.id + 'v'] === 1
        ) {
          props.removeDownload(props.route.params.thisLesson.id)
          props.removeDownload(props.route.params.thisLesson.id + 'v')
        }
        break
      case 'qv':
      case 'v':
        if (props.downloads[props.route.params.thisLesson.id + 'v'] === 1)
          props.removeDownload(props.route.params.thisLesson.id + 'v')
        break
    }
  }, [props.downloads])

  //- switches the complete status of a lesson to the opposite of its current
  //-  status
  // and alerts the user of the change
  function changeCompleteStatus () {
    props.toggleComplete(
      props.activeGroup.name,
      props.route.params.thisSet,
      getLessonInfo('index', props.route.params.thisLesson.id)
    )

    props.navigation.setOptions(getNavOptions())

    if (checkForFullyComplete()) {
      setShowSetCompleteModal(true)
    } else {
      if (
        !thisSetProgress.includes(
          getLessonInfo('index', props.route.params.thisLesson.id)
        )
      ) {
        Alert.alert(
          props.translations.play.popups.marked_as_complete_title,
          props.translations.play.popups.marked_as_complete_message,
          [
            {
              text: props.translations.general.ok,
              onPress: () => props.navigation.goBack()
            }
          ]
        )
      }
    }
  }

  function checkForFullyComplete () {
    if (
      props.activeGroup.addedSets.filter(
        set => set.id === props.route.params.thisSet.id
      )[0].progress.length /
        (props.route.params.thisSet.lessons.length - 1) ===
      1
    ) {
      return true
    } else return false
  }

  //+ RENDER

  var titleSection = (
    <View style={styles.titlesContainer}>
      <Text
        style={Typography(props, 'h3', 'black', 'center', colors.shark)}
        numberOfLines={2}
      >
        {props.route.params.thisLesson.title}
      </Text>
    </View>
  )

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.topHalfContainer,
          {
            marginBottom: props.route.params.lessonType === '' ? 10 : 0
          }
        ]}
      >
        {/* <StatusBar hidden /> */}
        {/* don't display title section on audio book lessons */}
        {props.route.params.lessonType !== 'a' &&
        props.route.params.lessonType !== ''
          ? titleSection
          : null}

        {/* 
          MIDDLE SECTION 
          1. book reading view for audio book lessons
          2. video player for lessons with videos
          3. album art swiper to display album art, scripture, and questions
        */}
        {props.route.params.lessonType === 'a' ||
        props.route.params.lessonType === '' ? (
          <BookView
            thisLesson={props.route.params.thisLesson}
            titleSection={titleSection}
          />
        ) : activeChapter === 'training' ? (
          <VideoPlayer
            setVideo={setVideo}
            video={video}
            setIsMediaLoaded={setIsMediaLoaded}
            setIsMediaPlaying={setIsMediaPlaying}
            // setIsVideoBuffering={setIsVideoBuffering}
            changeChapter={changeChapter}
            isMediaLoaded={isMediaLoaded}
            lessonType={props.route.params.lessonType}
            isComplete={thisSetProgress.includes(
              getLessonInfo('index', props.route.params.thisLesson.id)
            )}
            changeCompleteStatus={changeCompleteStatus}
            setFullScreenStatus={status => setFullscreenStatus(status)}
            fullscreenStatus={fullscreenStatus}
            lastPortraitOrientation={lastPortraitOrientation}
          />
        ) : (
          <AlbumArtSwiper
            setAlbumArtSwiperRef={setAlbumArtSwiperRef}
            iconName={props.route.params.thisSet.iconName}
            thisLesson={props.route.params.thisLesson}
            playHandler={playHandler}
            playOpacity={playOpacity}
            animationZIndex={animationZIndex}
            isMediaPlaying={isMediaPlaying}
          />
        )}
      </View>

      {/* AUDIO CONTROLS */}
      {props.route.params.lessonType !== '' ? (
        isMediaLoaded ? (
          <View style={styles.audioControlContainer}>
            {props.route.params.lessonType !== 'v' &&
            props.route.params.lessonType !== 'a' ? (
              <ChapterSelect
                activeChapter={activeChapter}
                lessonID={props.route.params.thisLesson.id}
                onPress={chapter => changeChapter(chapter)}
                lessonType={props.route.params.lessonType}
                isDownloaded={props.route.params.isDownloaded}
              />
            ) : null}
            <Scrubber
              value={seekPosition}
              onSlidingComplete={playFromLocation}
              onValueChange={() => (shouldThumbUpdate.current = false)}
              maximumValue={mediaLength}
              seekPosition={seekPosition}
            />
            <PlayPauseSkip
              isMediaPlaying={isMediaPlaying}
              // isVideoBuffering={isVideoBuffering}
              onPlayPress={playHandler}
              onSkipPress={value => {
                playFromLocation(seekPosition + value)
              }}
            />
          </View>
        ) : (
          <View style={styles.audioControlContainer}>
            <ActivityIndicator size='large' color={colors.shark} />
          </View>
        )
      ) : null}

      {/* MODALS */}
      <ShareModal
        isVisible={showShareLessonModal}
        hideModal={() => setShowShareLessonModal(false)}
        closeText={props.translations.general.close}
        lesson={props.route.params.thisLesson}
        lessonType={props.route.params.lessonType}
        set={props.route.params.thisSet}
      />
      <MessageModal
        isVisible={showSetCompleteModal}
        hideModal={() => setShowSetCompleteModal(false)}
        title={props.translations.general.popups.set_complete_title}
        body={props.translations.general.popups.set_complete_message}
        confirmText={props.translations.general.got_it}
        confirmOnPress={() => {
          setShowSetCompleteModal(false)
          props.navigation.goBack()
        }}
      >
        <Image
          source={require('../assets/gifs/set_complete.gif')}
          style={{
            height: 200 * scaleMultiplier,
            margin: 20,
            // padding: 20,
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    backgroundColor: colors.white
  },
  topHalfContainer: {
    justifyContent: 'space-evenly',
    flex: 1
  },
  titlesContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingHorizontal: 20
  },
  audioControlContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '33%'
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    activeGroup: activeGroup,
    activeDatabase: state.database[activeGroup.language],
    translations: state.database[activeGroup.language].translations,
    downloads: state.downloads,
    primaryColor: state.database[activeGroup.language].primaryColor,
    isRTL: state.database[activeGroup.language].isRTL,
    font: state.database[activeGroup.language].font,
    isConnected: state.network.isConnected
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleComplete: (groupName, set, lessonIndex) => {
      dispatch(toggleComplete(groupName, set, lessonIndex))
    },
    downloadLesson: (lessonID, source) => {
      dispatch(downloadLesson(lessonID, source))
    },
    downloadVideo: (lessonID, source) => {
      dispatch(downloadVideo(lessonID, source))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen)

/* <HomeworkModal
        isVisible={showHomeworkModal}
        hideModal={() => setShowHomeworkModal(false)}
        homework={props.route.params.thisLesson.homework}
/> */
