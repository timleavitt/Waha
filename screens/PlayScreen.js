import useInterval from '@use-it/interval'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { useKeepAwake } from 'expo-keep-awake'
import { DeviceMotion } from 'expo-sensors'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import AlbumArtSwiper from '../components/AlbumArtSwiper'
import BackButton from '../components/BackButton'
import BookView from '../components/BookView'
import ChapterSelect from '../components/ChapterSelect'
import HomeworkModal from '../components/HomeworkModal'
import PlayPauseSkip from '../components/PlayPauseSkip'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import Scrubber from '../components/Scrubber'
import ShareModal from '../components/ShareModal'
import VideoPlayer from '../components/VideoPlayer'
import { colors } from '../constants'
import {
  downloadLesson,
  downloadVideo,
  removeDownload
} from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'

console.disableYellowBox = true

function PlayScreen (props) {
  /* 
    STATE
  */

  //// AUDIO SPECIFIC STATE

  // stores loaded audio file
  const [soundObject, setSoundObject] = useState(new Audio.Sound())

  // stores the length of the current audio file in milliseconds (loaded by sound object)
  const [audioFileLength, setAudioFileLength] = useState(null)

  // keeps track of if the audio file is loaded
  const [isLoaded, setIsLoaded] = useState(false)

  //// VIDEO SPECIFIC STATE

  // stores loaded video file
  const [videoObject, setVideoObject] = useState()

  // keeps track of if the video is buffering
  const [isVideoBuffering, setIsVideoBuffering] = useState(false)

  // keeps track of the current screen orientation for fullscreen videos
  const [screenOrientation, setScreenOrientation] = useState(0)

  //// AUDIO + VIDEO STATE

  // keeps track of whether the audio/video file is playing or paused
  const [isPlaying, setIsPlaying] = useState(false)

  // keeps track of the current position of the seeker
  const [seekPosition, setSeekPosition] = useState(0)

  // keeps track of if the seeker should update every second
  // note: only time it shouldn't is during seeking, skipping, or loading a new chapter
  const shouldTickUpdate = useRef(false)

  //// CHAPTER STATE

  // keeps track of currently playing chapter
  const [activeChapter, setActiveChapter] = useState('fellowship')

  // sources for all 3 audio files
  const [fellowshipSource, setFellowshipSource] = useState()
  const [storySource, setStorySource] = useState()
  const [trainingSource, setTrainingSource] = useState()
  const [applicationSource, setApplicationSource] = useState()

  //// ALBUM ART STATE

  // ref for the middle album art scroller
  const [albumArtSwiperRef, setAlbumArtSwiperRef] = useState()

  // keeps the screen always awake on this screen
  useKeepAwake()

  // pause lesson if we move to a different screen (i.e. when switching to
  //  splash / game for security mode)
  useEffect(() => {
    if (isPlaying) playHandler()
  }, [props.navigation.isFocused()])

  //// OTHER STATE

  // share modal
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)

  // animation state
  const [playOpacity, setPlayOpacity] = useState(new Animated.Value(0))
  const [animationZIndex, setAnimationZIndex] = useState(0)

  //// NAV OPTIONS
  function getNavOptions () {
    return {
      headerTitle: props.route.params.thisLesson.subtitle,
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => (
            <PlayScreenHeaderButtons
              shareOnPress={() => setShowShareLessonModal(true)}
              completeOnPress={changeCompleteStatus}
              completeCondition={props.route.params.thisSetProgress.includes(
                props.route.params.thisLesson.index
              )}
            />
          ),
      headerLeft: props.isRTL
        ? () => (
            <PlayScreenHeaderButtons
              shareOnPress={() => setShowShareLessonModal(true)}
              completeOnPress={changeCompleteStatus}
              completeCondition={props.route.params.thisSetProgress.includes(
                props.route.params.thisLesson.index
              )}
            />
          )
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //// CONSTRUCTOR

  useEffect(() => {
    //set nav options
    props.navigation.setOptions(getNavOptions())

    // set sources and download stuff if we need to
    setSources()

    //when leaving the screen, cancel the interval timer and unload the audio file
    return function cleanup () {
      // clearInterval(interval)

      if (soundObject) {
        soundObject.unloadAsync()
        setSoundObject(null)
      }

      if (videoObject) {
        videoObject.unloadAsync()
        setVideoObject(null)
      }
    }
  }, [])

  // once we set a chapter 1 source, load it up
  useEffect(() => {
    if (fellowshipSource) {
      try {
        loadAudioFile(fellowshipSource)
      } catch (error) {
        console.log(error)
      }
    }
  }, [fellowshipSource])

  useEffect(() => {
    if (props.route.params.lessonType === 'v')
      if (props.isConnected && !isLoaded && trainingSource)
        loadVideoFile(trainingSource)
  }, [props.isConnected])

  // interval for updating seeker
  useInterval(updateSeekerTick, 1000)

  //// CONSTRUCTOR FUNCTIONS

  // sets the sources for all the chapters based on lesson type and whether
  // various chapters are downloaded or not
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

    var storyStream = props.route.params.thisLesson.audioSource

    var storyDummy =
      FileSystem.documentDirectory +
      props.activeGroup.language +
      '-' +
      'dummy-story.mp3'

    var trainingLocal =
      FileSystem.documentDirectory + props.route.params.thisLesson.id + 'v.mp4'

    var trainingStream = props.route.params.thisLesson.videoSource

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
            props.route.params.thisLesson.audioSource
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
            props.route.params.thisLesson.audioSource
          )
          props.downloadVideo(
            props.route.params.thisLesson.id,
            props.route.params.thisLesson.videoSource
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
            props.route.params.thisLesson.videoSource
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

  // loads an audio file, sets the length, and starts playing it
  async function loadAudioFile (source) {
    try {
      await soundObject
        .loadAsync({ uri: source }, { progressUpdateIntervalMillis: 1000 })
        .then(playbackStatus => {
          setAudioFileLength(playbackStatus.durationMillis)
          soundObject.setStatusAsync({
            progressUpdateIntervalMillis: 1000,
            shouldPlay: true
          })
          shouldTickUpdate.current = true
          setIsPlaying(true)
        })
    } catch (error) {
      console.log(error)
    }
  }
  // loads an video file, sets the length, and starts playing it
  // note: basically the same as loadAudioFile()
  async function loadVideoFile (source) {
    try {
      await videoObject
        .loadAsync(
          { uri: trainingSource },
          { progressUpdateIntervalMillis: 100 }
        )
        .then(playbackStatus => {
          setAudioFileLength(playbackStatus.durationMillis)
          videoObject.setStatusAsync({
            progressUpdateIntervalMillis: 1000,
            shouldPlay: true
          })
          shouldTickUpdate.current = true
          setIsPlaying(true)
        })
    } catch (error) {
      console.log(error)
    }
  }

  //// UTILITY FUNCTIONS

  // if a download finishes, remove it from download tracker
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

  useEffect(() => {
    if (videoObject && trainingSource) {
      loadVideoFile(props.route.params.thisLesson.videoSource)

      // orientation listener to activate full screen when switched to landscape and vice versa
      DeviceMotion.addListener(({ orientation }) => {
        if (orientation !== screenOrientation) {
          setScreenOrientation(orientation)
        }
      })
    }
  }, [videoObject, trainingSource])

  // TODO: load audio file for audio books
  useEffect(() => {
    if (props.route.params.lessonType === 'a' && storySource) {
      loadAudioFile(storySource)
    }
  }, [storySource])

  useEffect(() => {
    if (screenOrientation === -90 || screenOrientation === 90) {
      videoObject.presentFullscreenPlayer()
    }
  }, [screenOrientation])

  //// PLAYBACK CONTROL FUNCTIONS

  // updates something on every api call to audio object and every second
  soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
    if (playbackStatus.isLoaded) {
      setIsLoaded(true)
    }

    // depending on what chapter we're on, either jump to the next
    // chapter once we finish or toggle the whole lesson as complete
    if (playbackStatus.didJustFinish) {
      if (activeChapter === 'fellowship') {
        if (!props.route.params.thisLesson.audioSource) {
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
              changeChapter('application')
            }
            break
          case 'qav':
            if (!props.downloads[props.route.params.thisLesson.id + 'v']) {
              changeChapter('training')
            }
            break
        }
      } else if (
        activeChapter === 'application' &&
        !props.route.params.thisSetProgress.includes(
          props.route.params.thisLesson.index
        )
      ) {
        changeCompleteStatus()
      }
    }
  })

  // gets called every second by our timer and updates the seeker position based on the progress through the audio file
  async function updateSeekerTick () {
    if (shouldTickUpdate.current) {
      if (videoObject) {
        try {
          await videoObject.getStatusAsync().then(playbackStatus => {
            setSeekPosition(playbackStatus.positionMillis)
          })
          //.catch(err => console.log(err))
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          await soundObject.getStatusAsync().then(playbackStatus => {
            setSeekPosition(playbackStatus.positionMillis)
          })
          //.catch(err => console.log(err))
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  // plays the audio if it's currently paused and pauses the audio if it's currently playing
  function playHandler () {
    if (isLoaded) {
      if (videoObject) {
        updateSeekerTick()
        isPlaying ? videoObject.pauseAsync() : videoObject.playAsync()
      } else {
        startPlayPauseAnimation()
        updateSeekerTick()
        isPlaying
          ? soundObject.setStatusAsync({
              progressUpdateIntervalMillis: 1000,
              shouldPlay: false
            })
          : soundObject.setStatusAsync({
              progressUpdateIntervalMillis: 1000,
              shouldPlay: true
            })
      }
      setIsPlaying(currentStatus => !currentStatus)
    }
  }

  // starts playing loaded audio from the position the user releases the thumb at
  // note: catchs are empty because of a weird ios-only warning appearing
  // that doesn't seem to affect any functionality--it's being ignored
  function onSeekRelease (value) {
    if (videoObject) {
      if (isPlaying) {
        videoObject
          .setStatusAsync({
            shouldPlay: false,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
          })
          .catch(err => {})
        videoObject
          .setStatusAsync({
            shouldPlay: true,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
          })
          .catch(err => {})
      } else {
        videoObject
          .setStatusAsync({
            shouldPlay: false,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
          })
          .catch(err => {})
      }
    } else {
      if (isPlaying) {
        soundObject
          .setStatusAsync({
            shouldPlay: false,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
          })
          .catch(err => {})
        soundObject
          .setStatusAsync({
            shouldPlay: true,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
          })
          .catch(err => {})
      } else {
        soundObject
          .setStatusAsync({
            shouldPlay: false,
            positionMillis: value,
            seekMillisToleranceBefore: 10000,
            seekMillisToleranceAfter: 10000
          })
          .catch(err => {})
      }
    }

    shouldTickUpdate.current = true
    setSeekPosition(value)
  }

  // sets shouldTickUpdate to flase to prevent the seeker from updating while dragging
  function onSeekDrag (value) {
    shouldTickUpdate.current = false
  }

  // skips an amount of milliseconds through the audio track
  function skip (amount) {
    if (videoObject) {
      isPlaying
        ? videoObject.setStatusAsync({
            shouldPlay: true,
            positionMillis: seekPosition + amount
          })
        : videoObject.setStatusAsync({
            shouldPlay: false,
            positionMillis: seekPosition + amount
          })
    } else {
      isPlaying
        ? soundObject.setStatusAsync({
            shouldPlay: true,
            positionMillis: seekPosition + amount
          })
        : soundObject.setStatusAsync({
            shouldPlay: false,
            positionMillis: seekPosition + amount
          })
    }
    setSeekPosition(seekPosition => seekPosition + amount)
  }

  // changes the active chapter
  function changeChapter (chapter) {
    if (chapter !== activeChapter) {
      soundObject.unloadAsync()
      shouldTickUpdate.current = false
      if (chapter === 'fellowship') {
        setSeekPosition(0)
        loadAudioFile(fellowshipSource)
      } else if (chapter === 'story') {
        setSeekPosition(0)
        if (storySource) {
          loadAudioFile(storySource)
        }
        // auto scroll to scripture if
        //  1. there's no audio source
        //  2. we're currently downloading the lesson
        //  3. there's an audio source, it's not downloading, and there's no internet
        if (!props.route.params.thisLesson.audioSource) swipeToScripture()
      } else if (chapter === 'application') {
        setSeekPosition(0)
        loadAudioFile(applicationSource)
      } else if (chapter === 'training') {
        setIsLoaded(false)
        setSeekPosition(0)
      }
      setActiveChapter(chapter)
    }
  }

  function swipeToScripture () {
    if (albumArtSwiperRef)
      albumArtSwiperRef.scrollToIndex({
        animated: true,
        viewPosition: 0.5,
        viewOffset: -Dimensions.get('screen').width,
        index: 0
      })
  }

  //// OTHER FUNCTIONS

  // switches the complete status of a lesson to the opposite of its current status
  // and alerts the user of the change
  function changeCompleteStatus () {
    props.toggleComplete(
      props.activeGroup.name,
      props.route.params.thisSet,
      props.route.params.thisLesson.index
    )

    if (
      props.route.params.thisSetProgress.includes(
        props.route.params.thisLesson.index
      )
    ) {
      Alert.alert(
        props.translations.play.popups.marked_as_incomplete_title,
        props.translations.play.popups.marked_as_incomplete_message,
        [
          {
            text: props.translations.general.ok,
            onPress: () => props.navigation.goBack()
          }
        ]
      )
    } else {
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

  //// RENDER

  var titleSection = (
    <View style={styles.titlesContainer}>
      <Text
        style={Typography(props, 'h2', 'black', 'center', colors.shark)}
        numberOfLines={1}
      >
        {props.route.params.thisLesson.title}
      </Text>
    </View>
  )

  return (
    <View style={styles.screen}>
      <View style={styles.topHalfContainer}>
        {props.route.params.lessonType === 'a' ? null : titleSection}

        {/* MIDDLE SECTION */}
        {props.route.params.lessonType === 'a' ? (
          <BookView
            thisLesson={props.route.params.thisLesson}
            titleSection={titleSection}
          />
        ) : activeChapter === 'training' ? (
          <VideoPlayer
            setVideoObject={setVideoObject}
            setIsLoaded={setIsLoaded}
            setIsPlaying={setIsPlaying}
            setIsVideoBuffering={setIsVideoBuffering}
            changeChapter={changeChapter}
            isLoaded={isLoaded}
          />
        ) : (
          <AlbumArtSwiper
            setAlbumArtSwiperRef={setAlbumArtSwiperRef}
            iconName={props.route.params.thisSet.iconName}
            thisLesson={props.route.params.thisLesson}
            playHandler={playHandler}
            playOpacity={playOpacity}
            animationZIndex={animationZIndex}
            isPlaying={isPlaying}
          />
        )}
      </View>

      {/* AUDIO CONTROLS */}
      {isLoaded ? (
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
            onSlidingComplete={onSeekRelease}
            onValueChange={onSeekDrag}
            maximumValue={audioFileLength}
            seekPosition={seekPosition}
          />
          <PlayPauseSkip
            isPlaying={isPlaying}
            isVideoBuffering={isVideoBuffering}
            onPlayPress={playHandler}
            onSkipPress={value => {
              skip(value)
            }}
          />
        </View>
      ) : (
        <View style={styles.audioControlContainer}>
          <ActivityIndicator size='large' color={colors.shark} />
        </View>
      )}

      {/* MODALS */}
      <ShareModal
        isVisible={showShareLessonModal}
        hideModal={() => setShowShareLessonModal(false)}
        closeText={props.translations.general.close}
        lesson={props.route.params.thisLesson}
        lessonType={props.route.params.lessonType}
        set={props.route.params.thisSet}
      />
      <HomeworkModal
        isVisible={showHomeworkModal}
        hideModal={() => setShowHomeworkModal(false)}
        homework={props.route.params.thisLesson.homework}
      />
    </View>
  )
}

//// STYLES

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
  albumArtContainer: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 10,
    backgroundColor: colors.porcelain,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.chateau,
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioControlContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '33%'
  }
})

//// REDUX

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
