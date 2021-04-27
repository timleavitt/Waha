import { Audio, Video } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { useKeepAwake } from 'expo-keep-awake'
import React, { useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { useEffect } from 'react/cjs/react.development'
import AlbumArtSwiper from '../components/AlbumArtSwiper'
import BookView from '../components/BookView'
import ChapterSelector from '../components/ChapterSelector'
import PlaybackControls from '../components/PlaybackControls'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import PlayScreenTitle from '../components/PlayScreenTitle'
import Scrubber from '../components/Scrubber'
import VideoPlayer from '../components/VideoPlayer'
import WahaBackButton from '../components/WahaBackButton'
import {
  chapters,
  getLessonInfo,
  lessonTypes,
  lockPortrait,
  scaleMultiplier
} from '../constants'
import MessageModal from '../modals/MessageModal'
import ShareModal from '../modals/ShareModal'
import { downloadMedia, removeDownload } from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    database: state.database,
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    translations: activeDatabaseSelector(state).translations,
    downloads: state.downloads,
    primaryColor: activeDatabaseSelector(state).primaryColor,
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
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

const middleAreaVisibility = {
  HIDE: 0,
  SHOW: 1
}

// Path for the file system directory for convenience.
const path = FileSystem.documentDirectory

/**
 * A screen where the user listens to (or watches) the different parts of a lesson.
 * @param {Object} thisLesson - The object for the lesson that the user has selected to do.
 * @param {Object} thisSet - The object for the set that thisLesson is a part of.
 * @param {boolean} isFullyDownloaded - Whether this lesson has its Story audio file already downloaded or not.
 * @param {boolean} isDownloading - Whether the
 */
const PlayScreen = ({
  // Props passed from navigation.
  navigation: { goBack, setOptions, isFocused },
  route: {
    // Props passed from previous screen.
    params: {
      thisLesson,
      thisSet,
      isFullyDownloaded,
      isAlreadyDownloading,
      lessonType,
      downloadedLessons
    }
  },
  // Props passed from redux.
  database,
  activeGroup,
  activeDatabase,
  translations,
  downloads,
  primaryColor,
  isRTL,
  font,
  isConnected,
  toggleComplete,
  downloadMedia,
  removeDownload
}) => {
  /** Keeps the screen from auto-dimming or auto-locking. */
  useKeepAwake()

  /** Keeps track of the potential sources for every chapter. */
  const [potentialSources, setPotentialSources] = useState({
    fellowshipLocal: `${path}${activeGroup.language}-${thisLesson.fellowshipType}.mp3`,
    applicationLocal: `${path}${activeGroup.language}-${thisLesson.applicationType}.mp3`,
    storyLocal: `${path}${thisLesson.id}.mp3`,
    storyStream: getLessonInfo('audioSource', thisLesson.id),
    storyDummy: `${path}${activeGroup.language}-dummy-story.mp3`,
    trainingLocal: `${path}${thisLesson.id}v.mp4`,
    trainingStream: getLessonInfo('videoSource', thisLesson.id)
  })

  /** State for the audio and video refs. */
  const [audioRef, setAudioRef] = useState(new Audio.Sound())
  const videoRef = useRef(null)

  /** Stores the length of the current media file in ms. */
  const [mediaLength, setMediaLength] = useState(null)

  /** Keeps track of whether the media file is loaded. */
  const [isMediaLoaded, setIsMediaLoaded] = useState(false)

  /** Keeps track of whether the media file is currently playing or paused. */
  const [isMediaPlaying, setIsMediaPlaying] = useState(false)

  /** Keeps track of whether audio should automatically start playing upon switching chapters. */
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)

  /** Keeps track of the current position of the seeker in ms. */
  const [thumbPosition, setThumbPosition] = useState(0)

  /** Keeps track of whether the seeker should update every second. Note: only time it shouldn't is during seeking, skipping, or loading a new chapter. */
  const shouldThumbUpdate = useRef(false)

  /** Keeps track of the currently playing chapter. Options are 'fellowship', 'story', 'training', or 'application'. */
  const [activeChapter, setActiveChapter] = useState(null)

  /** Keeps track of the sources for the various chapters used to load their audio. */
  const [chapterSources, setChapterSources] = useState(null)

  /** An object to store the progress of the set this lesson is a part of. */
  const [thisSetProgress, setThisSetProgress] = useState([])

  /** Stores the opacity and the z-index of the animated icon that pops up on play/pause press. */
  const [playFeedbackOpacity, setPlayFeedbackOpacity] = useState(
    new Animated.Value(0)
  )
  const [playFeedbackZIndex, setPlayFeedbackZIndex] = useState(0)

  /** Reference for the AlbumArtSwiper component. */
  const [albumArtSwiperRef, setAlbumArtSwiperRef] = useState()

  /** Keeps track of whether the various modals are visible. */
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false)

  /** Keeps track of the current fullscreen status for videos. */
  const [fullscreenStatus, setFullscreenStatus] = useState(
    Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
  )

  const [titleBackgroundColor, setTitleBackgroundColor] = useState(
    lessonType === lessonTypes.BOOK ? colors.porcelain : colors.white
  )

  const [videoPlayerOpacity, setVideoPlayerOpacity] = useState(
    new Animated.Value(0)
  )

  const [albumArtSwiperOpacity, setAlbumArtSwiperOpacity] = useState(
    new Animated.Value(0)
  )

  const getNavOptions = () => ({
    headerTitle: getLessonInfo('subtitle', thisLesson.id),
    headerRight: isRTL
      ? () => (
          <WahaBackButton
            onPress={() => {
              lockPortrait(() => {})
              goBack()
            }}
          />
        )
      : () => (
          <PlayScreenHeaderButtons
            shareOnPress={() => setShowShareLessonModal(true)}
            completeOnPress={updateCompleteStatus}
            completeCondition={thisSetProgress.includes(
              getLessonInfo('index', thisLesson.id)
            )}
          />
        ),
    headerLeft: isRTL
      ? () => (
          <PlayScreenHeaderButtons
            shareOnPress={() => setShowShareLessonModal(true)}
            completeOnPress={updateCompleteStatus}
            completeCondition={thisSetProgress.includes(
              getLessonInfo('index', thisLesson.id)
            )}
          />
        )
      : () => (
          <WahaBackButton
            onPress={() => {
              lockPortrait(() => {})
              goBack()
            }}
          />
        )
  })

  /**
   * useEffect function that updates the thisSetProgress state variable with the most updated version of the progress of the set that this lesson is a part of.
   * @function
   */
  useEffect(() => {
    setThisSetProgress(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
    )
  }, [activeGroup.addedSets])

  /**
   * useEffect function that sets the navigation options for this screen. Dependent on thisSetProgress because we want to update the complete button whenever the complete status of this lesson changes.
   */
  useEffect(() => {
    setOptions(getNavOptions())
  }, [thisSetProgress])

  /**
   * Updates on every api call to the audio object as well as every second. Covers the automatic switch of one chapter to the next and marking a lesson as complete at the finish of the last chapter.
   * @function
   */
  const onPlaybackStatusUpdate = playbackStatus => {
    // Set isLoaded state to true once media loads.
    if (playbackStatus.isLoaded) {
      setIsMediaLoaded(true)
    } else {
      setIsMediaLoaded(false)
    }

    // If we should update the thumb, update it to the newest value.
    if (shouldThumbUpdate.current)
      setThumbPosition(playbackStatus.positionMillis)

    // Keep the play button status in sync with the play status while in fullscreen mode.
    if (
      videoRef &&
      fullscreenStatus === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
    ) {
      if (playbackStatus.isPlaying) setIsMediaPlaying(true)
      else if (!playbackStatus.isPlaying) setIsMediaPlaying(false)
    }

    // On a chapter finish, call the appropriate handler function.
    if (playbackStatus.didJustFinish) {
      switch (activeChapter) {
        case chapters.FELLOWSHIP:
          onFellowshipFinish()
          break
        case chapters.STORY:
          onStoryFinish()
          break
        case chapters.TRAINING:
          onTrainingFinish()
          break
        case chapters.APPLICATION:
          onApplicationFinish()
          break
      }
    }

    // Error handling.
    if (playbackStatus.error) console.log('Playback status error.')
  }

  /**
   * useEffect function that acts as a constructor to set the sources for the various chapters, enable the device rotation listener, and upon exiting the screen, unloading the audio/video files.
   * @function
   */
  useEffect(() => {
    // Start downloading any necessary lesson files.
    downloadLessonFiles()

    // Set the sources for the various chapters.
    setSources()

    // Cleanup function that unloads any audio or video.
    return async function cleanup () {
      // console.log('cleanup')
      if (audioRef) {
        // setAudioRef(null)
        await audioRef.unloadAsync()
      }

      if (videoRef.current) {
        await videoRef.current.unloadAsync()
      }
    }
  }, [])

  const downloadLessonFiles = () => {
    if (
      lessonType === lessonTypes.STANDARD_DBS ||
      lessonType === lessonTypes.STANDARD_DMC
    )
      if (!downloadedLessons.includes(thisLesson.id) && !isAlreadyDownloading)
        downloadMedia(
          'audio',
          thisLesson.id,
          getLessonInfo('audioSource', thisLesson.id)
        )

    if (lessonType === lessonTypes.STANDARD_DMC)
      if (
        !downloadedLessons.includes(thisLesson.id + 'v') &&
        !isAlreadyDownloading
      )
        downloadMedia(
          'video',
          thisLesson.id,
          getLessonInfo('videoSource', thisLesson.id)
        )
  }

  /**
   * Sets all the source state files appropriately based on the lesson type and what is downloaded.
   */
  function setSources () {
    var fellowshipSource
    var storySource
    var trainingSource
    var applicationSource

    switch (lessonType) {
      case lessonTypes.STANDARD_DBS:
        fellowshipSource = potentialSources.fellowshipLocal
        storySource = potentialSources.storyLocal
        trainingSource = null
        applicationSource = potentialSources.applicationLocal
        break
      case lessonTypes.STANDARD_DMC:
        fellowshipSource = potentialSources.fellowshipLocal
        storySource = potentialSources.storyLocal
        trainingSource = potentialSources.trainingLocal
        applicationSource = potentialSources.applicationLocal
        break
      case lessonTypes.VIDEO_ONLY:
        fellowshipSource = null
        storySource = null
        trainingSource = isFullyDownloaded
          ? potentialSources.trainingLocal
          : potentialSources.trainingStream
        applicationSource = null
        break
      case lessonTypes.STANDARD_NO_AUDIO:
        fellowshipSource = potentialSources.fellowshipLocal
        storySource = potentialSources.storyDummy
        trainingSource = null
        applicationSource = potentialSources.applicationLocal
        break
      case lessonTypes.AUDIOBOOK:
        fellowshipSource = null
        storySource = isFullyDownloaded
          ? potentialSources.storyLocal
          : potentialSources.storyStream

        trainingSource = null
        applicationSource = null
        break
    }

    setChapterSources({
      [chapters.FELLOWSHIP]: fellowshipSource,
      [chapters.STORY]: storySource,
      [chapters.TRAINING]: trainingSource,
      [chapters.APPLICATION]: applicationSource
    })
  }

  useEffect(() => {
    chapterSources && setStartingChapter()
  }, [chapterSources])

  const setStartingChapter = () => {
    switch (lessonType) {
      case lessonTypes.STANDARD_DBS:
      case lessonTypes.STANDARD_DMC:
      case lessonTypes.STANDARD_NO_AUDIO:
        setActiveChapter(chapters.FELLOWSHIP)
        break
      case lessonTypes.VIDEO_ONLY:
        setActiveChapter(chapters.TRAINING)
        break
      case lessonTypes.AUDIOBOOK:
        setActiveChapter(chapters.STORY)
        break
    }
  }

  useEffect(() => {
    chapterSources && activeChapter && onChapterChange()
  }, [activeChapter, chapterSources])

  const changeChapter = chapter => {
    if (chapter !== activeChapter && isMediaLoaded) setActiveChapter(chapter)
    else playFromLocation(0)
  }

  const onChapterChange = async () => {
    console.log(
      `On chapter change firing with active chapter ${activeChapter}.`
    )
    shouldThumbUpdate.current = false

    if (audioRef) await audioRef.unloadAsync()
    if (videoRef.current) await videoRef.current.unloadAsync()

    setThumbPosition(0)

    if (activeChapter !== chapters.TRAINING) {
      lockPortrait(() => {})
      Animated.parallel([
        Animated.timing(albumArtSwiperOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(videoPlayerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(albumArtSwiperOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(videoPlayerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
    }

    chapterSources[activeChapter] && loadMedia(chapterSources[activeChapter])

    //   if (!thisLesson.hasAudio) swipeToScripture()
  }

  /**
   * Loads audio or video for playing.
   * @param type - The type of media--either audio or video.
   * @param source - The local or remote source of the media to load.
   */
  async function loadMedia (source) {
    var media =
      activeChapter === chapters.TRAINING ? videoRef.current : audioRef
    try {
      await media
        .loadAsync(
          { uri: source },
          {
            shouldPlay: shouldAutoPlay ? true : false,
            progressUpdateIntervalMillis: 1000
          }
        )
        .then(playbackStatus => {
          setMediaLength(playbackStatus.durationMillis)
          media.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
          shouldThumbUpdate.current = true
          if (shouldAutoPlay) setIsMediaPlaying(true)
          else setIsMediaPlaying(false)
        })
    } catch (error) {
      console.log(error)
    }
    if (!shouldAutoPlay) setShouldAutoPlay(true)
  }

  /**
   * Plays the audio if it's currently paused and pauses the audio if it's currently playing.
   */
  function playHandler () {
    // If we're still loading, don't try and do anything with the media.
    if (!isMediaLoaded) return

    // Decide if we're playing/pausing the audio or the video.
    const media =
      activeChapter === chapters.TRAINING ? videoRef.current : audioRef

    // Switch play button over to the opposite of its current state.
    setIsMediaPlaying(currentStatus => !currentStatus)

    // Animate the play indicator that appears over the album art.
    setPlayFeedbackZIndex(2)
    Animated.sequence([
      Animated.timing(playFeedbackOpacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true
      }),
      Animated.timing(playFeedbackOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => setPlayFeedbackZIndex(0))

    // Play or pause the media.
    isMediaPlaying ? media.pauseAsync() : media.playAsync()
  }

  /**
   * Plays media from a specified location.
   * @param value - The location to start playing from.
   */
  function playFromLocation (value) {
    // If we're still loading, don't try and do anything with the media.
    if (!isMediaLoaded) return

    shouldThumbUpdate.current = false
    setThumbPosition(value)

    const media =
      activeChapter === chapters.TRAINING ? videoRef.current : audioRef

    media
      .setStatusAsync({
        shouldPlay: isMediaPlaying ? true : false,
        positionMillis: value
      })
      .then(() => {
        shouldThumbUpdate.current = true
      })
  }

  /** Handles the finishing of the Fellowship chapter. */
  const onFellowshipFinish = () => {
    // If the lesson has no story audio, change to the Story chapter and swipe over to the scripture text so the user can still read it.
    if (!thisLesson.hasAudio) {
      changeChapter(chapters.STORY)
      albumArtSwiperRef.snapToItem(2)
    } // If a Story chapter is still downloading or it isn't downloaded and can't start downloading, swipe to the Scripture text so the user can read the text while they're waiting for it to download.
    else if (
      downloads[thisLesson.id] ||
      ((lessonType === lessonTypes.STANDARD_DBS ||
        lessonType === lessonTypes.STANDARD_DMC) &&
        !isConnected &&
        !isFullyDownloaded)
    )
      albumArtSwiperRef.snapToItem(2)
    // Otherwise, just change to the Story chapter.
    else changeChapter(chapters.STORY)
  }

  /** Handles the finishing of the Story chapter. */
  const onStoryFinish = () => {
    switch (lessonType) {
      // If we're in a standard DBS lesson, simply change to the Application chapter after a brief delay.
      case lessonTypes.STANDARD_DBS:
        setTimeout(() => changeChapter(chapters.APPLICATION), 1000)
        break
      // If we're in a standard DMC lesson, there's a Training chapter between Story and Application, so switch to that after a brief delay.
      case lessonTypes.STANDARD_DMC:
        if (!downloads[thisLesson.id + 'v']) {
          setTimeout(() => changeChapter(chapters.TRAINING), 1000)
        }
        break
      // If we're in an audiobook lesson, the Story chapter is the only chapter, so once we finish it, we can mark it as complete.
      case lessonTypes.AUDIOBOOK:
        if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id))) {
          updateCompleteStatus()
        }
    }
  }

  /** Handles the finishing of the Training chapter. */
  const onTrainingFinish = () => {
    // If we're in fullscreen, lock back to portrait orientation and close fullscreen.
    if (fullscreenStatus === Video.IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT)
      lockPortrait(() => videoRef.current.dismissFullscreenPlayer())

    switch (lessonType) {
      // If we're in a standard DMC lesson, switch to the Application chapter after a short delay.
      case lessonTypes.STANDARD_DMC:
        setTimeout(() => changeChapter(chapters.APPLICATION), 500)
        break
      // If we're in a video only lesson, the Training chapter is the only chapter, so we can mark the lesson as complete once it's finished.
      case lessonTypes.VIDEO_ONLY:
        if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id)))
          setTimeout(() => updateCompleteStatus(), 1000)
        break
    }
  }

  /** Handles the finishing of the Application chapter. */
  const onApplicationFinish = () => {
    if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id)))
      updateCompleteStatus()
  }

  //- pause lesson if we move to a different screen (i.e. when switching to
  //-   splash / game for security mode)
  /**
   * useEffect function that automatically pauses the media when the play screen becomes unfocused.
   * @function
   */
  useEffect(() => {
    if (isMediaPlaying) playHandler()
  }, [isFocused()])

  /**
   * useEffect function that removes a download record from the download tracker redux object once it's finished. Removes audio and video download records when necessary.
   * @function
   */
  useEffect(() => {
    switch (lessonType) {
      case lessonTypes.STANDARD_DBS:
        if (downloads[thisLesson.id] && downloads[thisLesson.id].progress === 1)
          removeDownload(thisLesson.id)
        break
      case lessonTypes.STANDARD_DMC:
        if (
          downloads[thisLesson.id] &&
          downloads[thisLesson.id + 'v'] &&
          downloads[thisLesson.id].progress === 1 &&
          downloads[thisLesson.id + 'v'].progress === 1
        ) {
          removeDownload(thisLesson.id)
          removeDownload(thisLesson.id + 'v')
        }
        break
      case lessonTypes.VIDEO_ONLY:
        if (
          downloads[thisLesson.id + 'v'] &&
          downloads[thisLesson.id + 'v'].progress === 1
        )
          removeDownload(thisLesson.id + 'v')
        break
    }
  }, [downloads])

  /**
   * Switches the complete status of a lesson to the opposite of its current status and alerts the user of the change. Also shows the set complete modal if this is the last lesson to complete in a story set.
   */
  function updateCompleteStatus () {
    // Lock back to portrait orientation in case the user does the lesson in upside-down portrait.
    lockPortrait(() => {})

    // Toggle the complete status of the lesson.
    toggleComplete(
      activeGroup.name,
      thisSet,
      getLessonInfo('index', thisLesson.id)
    )

    // Update the navigation options since one of the header buttons shows the complete status of the lesson.
    setOptions(getNavOptions())

    // If completing this lesson completes its whole set, show a special set-complete modal.
    if (
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
        .length /
        (thisSet.lessons.length - 1) ===
      1
    )
      setShowSetCompleteModal(true)
    // Otherwise, show an alert notifying the user that the lesson has been marked as complete.
    else if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id)))
      Alert.alert(
        translations.play.popups.marked_as_complete_title,
        translations.play.popups.marked_as_complete_message,
        [
          {
            text: translations.general.ok,
            onPress: () => goBack()
          }
        ]
      )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topHalfContainer}>
        {!lessonType.includes('BookText') && (
          <PlayScreenTitle
            text={thisLesson.title}
            backgroundColor={colors.white}
          />
        )}
        {!lessonType.includes('BookText') && (
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').width - 80,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {lessonType.includes('Questions') && (
              <Animated.View
                style={{
                  position: 'absolute',
                  zIndex:
                    activeChapter === chapters.TRAINING
                      ? middleAreaVisibility.HIDE
                      : middleAreaVisibility.SHOW,
                  opacity: albumArtSwiperOpacity
                }}
              >
                <AlbumArtSwiper
                  setAlbumArtSwiperRef={setAlbumArtSwiperRef}
                  iconName={thisSet.iconName}
                  thisLesson={thisLesson}
                  playHandler={playHandler}
                  playOpacity={playFeedbackOpacity}
                  animationZIndex={playFeedbackZIndex}
                  isMediaPlaying={isMediaPlaying}
                />
              </Animated.View>
            )}
            {lessonType.includes('Video') && (
              <Animated.View
                style={{
                  position: 'absolute',
                  zIndex:
                    activeChapter === chapters.TRAINING
                      ? middleAreaVisibility.SHOW
                      : middleAreaVisibility.HIDE,
                  opacity: videoPlayerOpacity
                }}
              >
                <VideoPlayer
                  videoSource={
                    chapterSources ? chapterSources[chapters.TRAINING] : null
                  }
                  videoRef={videoRef}
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                  setIsMediaPlaying={setIsMediaPlaying}
                  fullscreenStatus={fullscreenStatus}
                  setFullScreenStatus={status => setFullscreenStatus(status)}
                  activeChapter={activeChapter}
                />
              </Animated.View>
            )}
          </View>
        )}
        {lessonType.includes('BookText') && (
          <BookView thisLesson={thisLesson} />
        )}
      </View>

      {lessonType !== lessonTypes.BOOK && (
        <SafeAreaView>
          {lessonType.includes('Questions') && (
            <ChapterSelector
              activeChapter={activeChapter}
              changeChapter={changeChapter}
              isFullyDownloaded={isFullyDownloaded}
              lessonType={lessonType}
              lessonID={thisLesson.id}
            />
          )}
          <Scrubber
            onSlidingComplete={playFromLocation}
            onValueChange={() => (shouldThumbUpdate.current = false)}
            maximumValue={mediaLength}
            seekPosition={thumbPosition}
          />
          <PlaybackControls
            isMediaPlaying={isMediaPlaying}
            isMediaLoaded={isMediaLoaded}
            onPlayPress={playHandler}
            onSkipPress={value => playFromLocation(thumbPosition + value)}
          />
        </SafeAreaView>
      )}

      {/* Modals */}
      <ShareModal
        isVisible={showShareLessonModal}
        hideModal={() => setShowShareLessonModal(false)}
        closeText={translations.general.close}
        lesson={thisLesson}
        lessonType={lessonType}
        set={thisSet}
      />
      <MessageModal
        isVisible={showSetCompleteModal}
        hideModal={() => setShowSetCompleteModal(false)}
        title={translations.general.popups.set_complete_title}
        body={translations.general.popups.set_complete_message}
        confirmText={translations.general.got_it}
        confirmOnPress={() => {
          setShowSetCompleteModal(false)
          goBack()
        }}
      >
        <Image
          source={require('../assets/gifs/set_complete.gif')}
          style={{
            height: 200 * scaleMultiplier,
            margin: 20,
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
    </View>
  )
}

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
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen)
