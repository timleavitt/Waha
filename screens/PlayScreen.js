import useInterval from '@use-it/interval'
import { Audio, Video } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { useKeepAwake } from 'expo-keep-awake'
import { DeviceMotion } from 'expo-sensors'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import AlbumArtSwiper from '../components/AlbumArtSwiper'
import BookView from '../components/BookView'
import ChapterSelect from '../components/ChapterSelect'
import PlaybackControls from '../components/PlaybackControls'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import Scrubber from '../components/Scrubber'
import BackButton from '../components/standard/BackButton'
import VideoPlayer from '../components/VideoPlayer'
import {
  colors,
  getLanguageFont,
  getLessonInfo,
  scaleMultiplier
} from '../constants'
import MessageModal from '../modals/MessageModal'
import ShareModal from '../modals/ShareModal'
import { downloadMedia, removeDownload } from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
// import { logCompleteStorySet } from '../redux/LogEventFunctions'
import { StandardTypography } from '../styles/typography'

/**
 * Component for the Play Screen, where the user listens to or watches the lesson.
 * @component
 * @category Screen
 * @param props
 */
function PlayScreen (props) {
  //+ AUDIO / VIDEO STATE

  /** State for audio object. */
  const [audio, setAudio] = useState(new Audio.Sound())

  /** State for video object. */
  const [video, setVideo] = useState()

  /** Stores the length of the current media file in ms. */
  const [mediaLength, setMediaLength] = useState(null)

  /** Keeps track of whether the media file is loaded. */
  const [isMediaLoaded, setIsMediaLoaded] = useState(false)

  /** Keeps track of whether the media file is currently playing or paused. */
  const [isMediaPlaying, setIsMediaPlaying] = useState(false)

  /** Keeps track of the current position of the seeker in ms. */
  const [seekPosition, setSeekPosition] = useState(0)

  /** Keeps track of whether the seeker should update every second. Note: only time it shouldn't is during seeking, skipping, or loading a new chapter. */
  const shouldThumbUpdate = useRef(false)

  //+ CHAPTER SOURCES STATE

  /** Keeps track of the currently playing chapter. Options are 'fellowship', 'story', 'training', or 'application'. */
  const [activeChapter, setActiveChapter] = useState('fellowship')

  /** Local source for fellowship chapter audio file. */
  const [fellowshipSource, setFellowshipSource] = useState()

  /** Local source for fellowship chapter audio file. */
  const [storySource, setStorySource] = useState()

  /** Local or remote source for fellowship chapter video file. */
  const [trainingSource, setTrainingSource] = useState()

  /** Local source for fellowship chapter audio file. */
  const [applicationSource, setApplicationSource] = useState()

  //+ MISCELLANEOUS STATE

  /** An object to store the progress of the set this lesson is a part of. */
  const [thisSetProgress, setThisSetProgress] = useState([])

  /** Stores the opacity of the play button that pops up on play/pause press. */
  const [playOpacity, setPlayOpacity] = useState(new Animated.Value(0))

  /** Stores the z-index of the play button that pops up on play/pause press. */
  const [animationZIndex, setAnimationZIndex] = useState(0)

  /** Reference for the AlbumArtSwiper component. */
  const [albumArtSwiperRef, setAlbumArtSwiperRef] = useState()

  /** Keeps track of whether the lesson share modal is visible. */
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)

  /** Keeps track of whether the set complete share modal is visible. */
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false)

  /** Keeps track of the current fullscreen status for videos. */
  const [fullscreenStatus, setFullscreenStatus] = useState(
    Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
  )

  /** Keeps track of the device rotation in an object (alpha, beta, and gamma). */
  const [deviceRotation, setDeviceRotation] = useState({})

  /**
   * useEffect function that enters fullscreen mode when the video component is present, the video source is loaded, we're on ios (this feature doesn't work on android), and the device rotation matches that of landscape.
   * @function
   */
  useEffect(() => {
    if (deviceRotation && Platform.OS === 'ios') {
      if (fullscreenStatus === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS) {
        if (
          video &&
          trainingSource &&
          deviceRotation &&
          (deviceRotation.alpha > 1 || deviceRotation.alpha < -1) &&
          (deviceRotation.gamma > 0.7 || deviceRotation.gamma < -0.7) &&
          deviceRotation.beta > -0.2 &&
          deviceRotation.beta < 0.2
        )
          video.presentFullscreenPlayer()
      }
    }
  }, [deviceRotation, video, trainingSource])

  /**
   * useEffect function that updates the thisSetProgress state variable with the most updated version of the set that this lesson is a part of's progress.
   * @function
   */
  useEffect(() => {
    setThisSetProgress(
      props.activeGroup.addedSets.filter(
        set => set.id === props.route.params.thisSet.id
      )[0].progress
    )
  }, [props.activeGroup.addedSets])

  /**
   * useEffect function that sets the header for this screen. Dependent on thisSetProgress because we want to update the "Set as complete" header button whenever the complete status of this lesson changes.
   * @function
   */
  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [thisSetProgress])

  /** Keeps the screen from auto-dimming or auto-locking on this screen. */
  useKeepAwake()

  /** Sets the navigation options for this screen. */
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

  /**
   * useEffect function that acts as a constructor to set the sources for the various chapters, enable the device rotation listener, and upon exiting the screen, unloading the audio/video files.
   * @function
   */
  useEffect(() => {
    // set sources and download stuff if we need to
    setSources()

    // check if we can get any device motion data and if so, add a listener
    if (Platform.OS === 'ios') {
      DeviceMotion.isAvailableAsync().then(isAvailable => {
        if (isAvailable) {
          DeviceMotion.setUpdateInterval(1000)
          DeviceMotion.addListener(({ rotation }) => {
            setDeviceRotation(rotation)
          })
        }
      })
    }

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
    }
  }, [])

  //+ LOADING FUNCTIONS

  /**
   * Sets all the source state files appropriately based on the lesson type and what is downloaded.
   */
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
          props.downloadMedia(
            'audio',
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
          props.downloadMedia(
            'audio',
            props.route.params.thisLesson.id,
            getLessonInfo('audioSource', props.route.params.thisLesson.id)
          )
          props.downloadMedia(
            'video',
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
          props.downloadMedia(
            'video',
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

  /**
   * useEffect function that loads the fellowship audio once we have a fellowship source set. We have this only for fellowship because the changeChapter function handles any chapter changes passed the initial load.
   * @function
   */
  //- once we set a chapter 1 source, load it up
  useEffect(() => {
    if (fellowshipSource) {
      loadMedia('audio', fellowshipSource)
    }
  }, [fellowshipSource])

  /**
   * useEffect function that reloads the video file if we end up going offline and come online again.
   * @function
   */
  useEffect(() => {
    if (props.route.params.lessonType === 'v')
      if (props.isConnected && !isMediaLoaded && trainingSource)
        loadVideoFile('video', trainingSource)
  }, [props.isConnected])

  /**
   * Loads audio or video for playing.
   * @param type - The type of media--either audio or video.
   * @param source - The local or remote source of the media to load.
   */
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

  /**
   * useEffect function that loads the video file once we have our video object and training chapter source set.
   * @function
   */
  useEffect(() => {
    if (video && trainingSource) {
      loadMedia('video', trainingSource)
    }
  }, [video, trainingSource])

  /**
   * useEffect function that loads the story chapter file once the story source is set. For audiobook lessons only. In every other case, we load the fellowship chapter first.
   * @function
   */
  useEffect(() => {
    if (props.route.params.lessonType === 'a' && storySource) {
      loadMedia('audio', storySource)
    }
  }, [storySource])

  //+ PLAYBACK CONTROL FUNCTIONS

  /**
   * Plays the audio if it's currently paused and pauses the audio if it's currently playing.
   */
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

  /**
   * Plays media from a specified location
   * @param value - The location to start playing from.
   */
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

  /**
   * Changes the active chapter and loads its media file.
   * @param chapter
   */
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

  /**
   * Updates on every api call to the audio object as well as every second. Covers the automatic switch of one chapter to the next and marking a lesson as complete at the finish of the last chapter.
   * @function
   */
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
  /**
   * useEffect function that automatically pauses the media when the play screen becomes unfocused.
   * @function
   */
  useEffect(() => {
    if (isMediaPlaying) playHandler()
  }, [props.navigation.isFocused()])

  //+ OTHER FUNCTIONS

  /**
   * Scrolls the album art swiper to the scripture pane.
   */
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
  /**
   * useEffect function that removes a download record from the download tracker redux object once it's finished. Removes audio and video download records when necessary.
   * @function
   */
  useEffect(() => {
    switch (props.route.params.lessonType) {
      case 'qa':
        if (
          props.downloads[props.route.params.thisLesson.id] &&
          props.downloads[props.route.params.thisLesson.id].progress === 1
        )
          props.removeDownload(props.route.params.thisLesson.id)
        break
      case 'qav':
        if (
          props.downloads[props.route.params.thisLesson.id] &&
          props.downloads[props.route.params.thisLesson.id + 'v'] &&
          props.downloads[props.route.params.thisLesson.id].progress === 1 &&
          props.downloads[props.route.params.thisLesson.id + 'v'].progress === 1
        ) {
          props.removeDownload(props.route.params.thisLesson.id)
          props.removeDownload(props.route.params.thisLesson.id + 'v')
        }
        break
      case 'qv':
      case 'v':
        if (
          props.downloads[props.route.params.thisLesson.id + 'v'] &&
          props.downloads[props.route.params.thisLesson.id + 'v'].progress === 1
        )
          props.removeDownload(props.route.params.thisLesson.id + 'v')
        break
    }
  }, [props.downloads])

  /**
   * Switches the complete status of a lesson to the opposite of its current status and alerts the user of the change. Also shows the set complete modal if this is the last lesson to complete in a story set.
   */
  function changeCompleteStatus () {
    props.toggleComplete(
      props.activeGroup.name,
      props.route.params.thisSet,
      getLessonInfo('index', props.route.params.thisLesson.id)
    )

    // update the nav options since our header button has changed
    props.navigation.setOptions(getNavOptions())

    if (checkForFullyComplete()) {
      setShowSetCompleteModal(true)
      // logCompleteStorySet(
      //   props.route.params.thisSet,
      //   props.activeGroup.language
      // )
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
  /**
   * Checks if the set that this lesson is a part of is fully completed.
   * @returns true if the set is fully complete and false if it's not.
   */
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

  /** The title section at the top of the screen. Only hidden on audio book lessons to make more room for the book viewer. */
  var titleSection = (
    <View style={styles.titlesContainer}>
      <Text
        style={StandardTypography(props, 'h3', 'Black', 'center', colors.shark)}
        numberOfLines={1}
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
            videoSource={trainingSource}
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
            // lastPortraitOrientation={lastPortraitOrientation}
            // navigateToFullscreen={() =>
            //   video.getStatusAsync().then(status => {
            //     props.navigation.navigate('Video', {
            //       shouldPlay: props.isMediaPlaying ? true : false,
            //       playFromPosition: status.positionMillis,
            //       source: trainingSource
            //     })
            //   })
            // }
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
          <SafeAreaView style={styles.audioControlContainer}>
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
            <PlaybackControls
              isMediaPlaying={isMediaPlaying}
              // isVideoBuffering={isVideoBuffering}
              onPlayPress={playHandler}
              onSkipPress={value => {
                playFromLocation(seekPosition + value)
              }}
            />
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.audioControlContainer}>
            <ActivityIndicator size='large' color={colors.shark} />
          </SafeAreaView>
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
    font: getLanguageFont(activeGroup.language),
    isConnected: state.network.isConnected
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleComplete: (groupName, set, lessonIndex) => {
      dispatch(toggleComplete(groupName, set, lessonIndex))
    },
    downloadMedia: (type, lessonID, source) => {
      dispatch(downloadMedia(type, lessonID, source))
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
