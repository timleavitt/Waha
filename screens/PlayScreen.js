import { Audio, Video } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { useKeepAwake } from 'expo-keep-awake'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { Media } from '../classes/media'
import ChapterSelector from '../components/ChapterSelector'
import PlaybackControls from '../components/PlaybackControls'
import PlayScreenSwiper from '../components/PlayScreenSwiper'
import Scrubber from '../components/Scrubber'
import VideoPlayer from '../components/VideoPlayer'
import WahaBackButton from '../components/WahaBackButton'
import {
  chapters,
  getLessonInfo,
  gutterSize,
  lessonTypes,
  lockPortrait,
  scaleMultiplier
} from '../constants'
import { logCompleteLesson } from '../LogEventFunctions'
import MessageModal from '../modals/MessageModal'
import ShareModal from '../modals/ShareModal'
import { downloadMedia, removeDownload } from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    database: state.database,
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    t: activeDatabaseSelector(state).translations,
    downloads: state.downloads,
    primaryColor: activeDatabaseSelector(state).primaryColor,
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    isTablet: state.deviceInfo.isTablet,
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

// Controls whether a piece of content in the middle area is visible or not.
const middleAreaVisibility = {
  HIDE: 0,
  SHOW: 1
}

// Path to the file system directory for convenience.
const path = FileSystem.documentDirectory

/**
 * A screen where the user listens to (or watches) the different parts of a lesson. Because of its size, this file is organized into some sections. The sections are as follows:
 * 1. STATE - The various state variables for this screen.
 * 2. SETUP - Functions related to setting up the play screen for the lesson, like setting the media sources and downloading necessary files.
 * 3. CHAPTER CHANGES / LOADING - Functions related to switching chapters and loading up the correct media.
 * 4. PLAYBACK STATUS UPDATES - Functions related to the onPlaybackStatusUpdate function which is called by the media with its current status. This is mostly used to handle when a chapter finishes.
 * 5. PLAYBACK CONTROL - Functions related to controlling the playback of the media, like playing, pausing, and skipping.
 * 6. DOWNLOADS - Functions related to checking the downloading/downloaded status of the lesson.
 * 7. PROGRESS UPDATING - Functions related to updating the progress of the lesson.
 * 8. MISC - A few small miscellaneous items.
 * @param {Object} thisLesson - The object for the lesson that the user has selected to do.
 * @param {Object} thisSet - The object for the set that thisLesson is a part of.
 * @param {boolean} isAudioAlreadyDownloaded - Whether this lesson has its Story audio file already downloaded or not.
 * @param {boolean} isVideoAlreadyDownloaded - Whether this lesson has its Training video file already downloaded or not.
 * @param {boolean} isAlreadyDownloading - Whether any content for this lesson is currently downloading.
 */
const PlayScreen = ({
  // Props passed from navigation.
  navigation: { goBack, setOptions, isFocused },
  route: {
    // Props passed from previous screen.
    params: {
      thisLesson,
      thisSet,
      isAudioAlreadyDownloaded,
      isVideoAlreadyDownloaded,
      isAlreadyDownloading,
      lessonType,
      downloadedLessons
    }
  },
  // Props passed from redux.
  database,
  activeGroup,
  activeDatabase,
  t,
  downloads,
  primaryColor,
  isRTL,
  font,
  isTablet,
  isConnected,
  toggleComplete,
  downloadMedia,
  removeDownload
}) => {
  /*
    STATE
  */

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
  // const audioRef = useRef(new Audio.Sound())
  const videoRef = useRef(null)

  const [media, setMedia] = useState(new Media(new Audio.Sound()))

  /** Stores the length of the current media file in ms. */
  const [mediaLength, setMediaLength] = useState(null)

  /** Keeps track of whether the media file is loaded. */
  const [isMediaLoaded, setIsMediaLoaded] = useState(false)

  /** Keeps track of whether the media file is currently playing or paused. */
  const [isMediaPlaying, setIsMediaPlaying] = useState(false)

  /** Keeps track of whether audio should automatically start playing upon switching chapters. */
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)

  /** Keeps track of the current position of the seeker in ms. */
  const [mediaProgress, setMediaProgress] = useState(0)

  /** Keeps track of whether the seeker should update every second. Note: only time it shouldn't is during seeking, skipping, or loading a new chapter. */
  const shouldThumbUpdate = useRef(false)

  /** Keeps track of the current fullscreen status for videos. */
  const fullscreenStatus = useRef(Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS)

  /** Keeps track of the currently playing chapter. Options are 'fellowship', 'story', 'training', or 'application'. */
  const [activeChapter, setActiveChapter] = useState(null)

  /** Keeps track of the chapter that should trigger a lesson as complete when getting 50% or more through it. */
  const [completionChapter, setCompletionChapter] = useState(null)

  /** Keeps track of the sources for the various chapters used to load their audio. */
  const [chapterSources, setChapterSources] = useState(null)

  /** Animation states. */
  const [playFeedbackOpacity, setPlayFeedbackOpacity] = useState(
    new Animated.Value(0)
  )
  const [playFeedbackZIndex, setPlayFeedbackZIndex] = useState(0)
  const [videoPlayerOpacity, setVideoPlayerOpacity] = useState(
    new Animated.Value(0)
  )
  const [albumArtSwiperOpacity, setAlbumArtSwiperOpacity] = useState(
    new Animated.Value(0)
  )

  /** Ref for the AlbumArtSwiper component. */
  const albumArtSwiperRef = useRef()

  /** Keeps track of whether the various modals are visible. */
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false)

  /** Keeps track of whether the audio and video files for this lesson are downloaded. */
  const [isAudioDownloaded, setIsAudioDownloaded] = useState(
    isAudioAlreadyDownloaded
  )
  const [isVideoDownloaded, setIsVideoDownloaded] = useState(
    isVideoAlreadyDownloaded
  )

  const isAudioDownloading = useRef(false)
  const isVideoDownloading = useRef(false)

  /** Ref for the lesson text content ScrollView. */
  const lessonTextContentRef = useRef(null)

  /** Keeps track of the scroll positions of the different lesson sections. */
  // const [sectionOffsets, setSectionOffsets] = useState([])
  const sectionOffsets = useRef([
    {
      title: 'END',
      subtitle: 'END',
      isBigSection: false,
      globalOffset: 1000000,
      localOffset: 1000000
    }
  ])

  /** Keeps track of whether this lesson is complete or not. */
  const isThisLessonComplete = useRef(
    activeGroup.addedSets
      .filter(set => set.id === thisSet.id)[0]
      .progress.includes(getLessonInfo('index', thisLesson.id))
  )

  /** Keeps track of whether this lesson was just completed. */
  const justCompleted = useRef(false)

  /** Sets the navigation options for this screen. */
  const getNavOptions = () => ({
    headerTitle: (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <View>
          {isThisLessonComplete.current && (
            <Icon name='check-outline' size={20} color={colors.chateau} />
          )}
        </View>
        <Text
          style={[
            StandardTypography(
              { font, isRTL, isTablet },
              'h3',
              'Bold',
              'center',
              colors.chateau
            ),
            { marginHorizontal: 2 }
          ]}
        >
          {getLessonInfo('subtitle', thisLesson.id)}
        </Text>
      </View>
    ),
    headerRight: isRTL
      ? () => <WahaBackButton onPress={onBackButtonPress} />
      : () => (
          <TouchableOpacity
            style={{ marginHorizontal: gutterSize }}
            onPress={() => setShowShareLessonModal(true)}
          >
            <Icon
              name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
              size={32 * scaleMultiplier}
              color={colors.oslo}
            />
          </TouchableOpacity>
        ),
    headerLeft: isRTL
      ? () => (
          <TouchableOpacity
            style={{ marginHorizontal: gutterSize }}
            onPress={() => setShowShareLessonModal(true)}
          >
            <Icon
              name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
              size={32 * scaleMultiplier}
              color={colors.oslo}
            />
          </TouchableOpacity>
        )
      : () => <WahaBackButton onPress={onBackButtonPress} />
  })

  /*
    SETUP
  */

  /** useEffect function that acts as a constructor to set the sources for the various chapters and download any necessary audio files. */
  useEffect(() => {
    // Start downloading any necessary lesson files.
    if (isConnected) downloadLessonFiles()

    // Set the sources for the various chapters.
    setSources()

    // Update the navigation options.
    setOptions(getNavOptions())
  }, [])

  /** useEffect function that adds video to the media object if this lesson has video. */
  useEffect(() => {
    if (videoRef.current) media.addVideo(videoRef.current)
  }, [videoRef.current])

  /** Downloads any necessary files for this lesson if they aren't downloaded/downloading already. */
  const downloadLessonFiles = () => {
    // Download audio for the Story chapter if necessary.
    if (
      lessonType === lessonTypes.STANDARD_DBS ||
      lessonType === lessonTypes.STANDARD_DMC
    )
      if (!isAudioDownloaded && !isAlreadyDownloading)
        downloadMedia(
          'audio',
          thisLesson.id,
          getLessonInfo('audioSource', thisLesson.id)
        )

    // Download video for the Training chapter if necessary.
    if (lessonType === lessonTypes.STANDARD_DMC)
      if (!isVideoDownloaded && !isAlreadyDownloading)
        downloadMedia(
          'video',
          thisLesson.id,
          getLessonInfo('videoSource', thisLesson.id)
        )
  }

  /** Sets all the source state files appropriately based on the lesson type and what is downloaded. */
  const setSources = () => {
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
        trainingSource = isVideoAlreadyDownloaded
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
        storySource = isAudioAlreadyDownloaded
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

  /*
    CHAPTER CHANGES / LOADING
  */

  /** useEffect function that sets our starting chapter as soon as the chapter sources are set. */
  useEffect(() => {
    chapterSources && setStartingChapter()
  }, [chapterSources])

  /** Sets the starting chapter for the lesson. */
  const setStartingChapter = () => {
    switch (lessonType) {
      // For standard lessons, we always start at Fellowship.
      case lessonTypes.STANDARD_DBS:
      case lessonTypes.STANDARD_DMC:
      case lessonTypes.STANDARD_NO_AUDIO:
        setActiveChapter(chapters.FELLOWSHIP)
        setCompletionChapter(chapters.APPLICATION)
        break
      // For video-only lessons, start on Training which is the chapter that plays the video.
      case lessonTypes.VIDEO_ONLY:
        setActiveChapter(chapters.TRAINING)
        setCompletionChapter(chapters.TRAINING)
        break
      // For audiobook lessons, start on Story which contains the audio for the audiobook.
      case lessonTypes.AUDIOBOOK:
        setActiveChapter(chapters.STORY)
        setCompletionChapter(chapters.STORY)
        break
    }
  }

  /**
   * Updates the active chapter.
   * @param {number} chapter - The chapter to switch to.
   */
  const changeChapter = async chapter => {
    if (!isMediaLoaded) return
    /* Pause audio or video before changing chapters. This is here because of some jank android-only error where the onPlaybackStatusUpdate function was being called continuously when switching from the Training chapter to a different chapter, even when media wasn't loaded, which caused the app to constantly switch between being loaded and not loaded. Pausing the audio or video before switching fixes this issue. */
    if (isMediaPlaying && isMediaLoaded) {
      // if (activeChapter === chapters.TRAINING) videoRef.current.pauseAsync()
      // else audioRef.current.pauseAsync()
      media.pause(activeChapter)
    }

    // Switch to the new chapter if it's different from the currently active chapter and the current media is loaded.
    if (chapter !== activeChapter) setActiveChapter(chapter)
    // If we're "changing" to our currently active chapter, start it over at the beginning.
    else playFromLocation(0)

    // Scroll the text to the appropriate position.
    if (
      lessonTextContentRef.current !== null &&
      sectionOffsets.current.length === thisLesson.scripture.length + 3
    ) {
      if (chapter === chapters.FELLOWSHIP)
        lessonTextContentRef.current.scrollTo({
          y: sectionOffsets.current[0].globalOffset,
          animated: true
        })
      else if (chapter === chapters.STORY)
        lessonTextContentRef.current.scrollTo({
          y: sectionOffsets.current[1].globalOffset + 40 * scaleMultiplier,
          animated: true
        })
      else if (chapter === chapters.APPLICATION)
        lessonTextContentRef.current.scrollTo({
          y:
            sectionOffsets.current[sectionOffsets.current.length - 2]
              .globalOffset +
            40 * scaleMultiplier,
          animated: true
        })
    }

    // If this lesson doesn't have any Story audio, swipe over to the text once we get to the Story chapter so the user can still read it.
    if (chapter === chapters.STORY && !thisLesson.hasAudio)
      albumArtSwiperRef.current.snapToItem(2)
  }

  /** useEffect function that calls the onChapterChange function whenever the active chapter changes.  */
  useEffect(() => {
    activeChapter && onChapterChange()
  }, [activeChapter])

  /** Handles the changing of the active chapter, including loading the new media. */
  const onChapterChange = async () => {
    // Don't update the thumb while we're changing chapters and loading new media.
    shouldThumbUpdate.current = false

    // Unload any existing media.
    // if (audioRef.current) await audioRef.current.unloadAsync()
    // if (videoRef.current) await videoRef.current.unloadAsync()
    media.unload()

    // Set isMediaLoaded to be false.
    setIsMediaLoaded(false)

    // Set our thumb position back to the start.
    setMediaProgress(0)

    // If we're switching to anything but the Training chapter, fade in the <AlbumArtSwiper/> and fade out the <VideoPlayer/>. If the <AlbumArtSwiper/> is already present, this animation does nothing.
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
    }
    // If we're switching to the Training chapter, fade out the <AlbumArtSwiper /> and fade in the <VideoPlayer />.
    else {
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

    // Finally, if we have a valid source for the media, load it up.
    chapterSources[activeChapter] && loadMedia(chapterSources[activeChapter])
  }

  /**
   * Loads audio or video for playing.
   * @param source - The source URI of the media to load.
   */
  const loadMedia = async source => {
    // var media =
    //   activeChapter === chapters.TRAINING ? videoRef.current : audioRef.current

    // await media
    //   .loadAsync(
    //     { uri: source },
    //     {
    //       // Initial play status depends on whether we should autoplay or not.
    //       shouldPlay: shouldAutoPlay ? true : false,
    //       // Call the onPlaybackStatusUpdate function once every second.
    //       progressUpdateIntervalMillis: 1000
    //     }
    //   )
    media
      .load(source, shouldAutoPlay, activeChapter)
      .then(playbackStatus => {
        // Set the length of this media. Used for the <Scrubber/>.
        setMediaLength(playbackStatus.durationMillis)

        // Start updating the thumb again.
        shouldThumbUpdate.current = true

        // Sync up isMediaPlaying with the play status of this media. Depends on shouldAutoPlay.
        if (shouldAutoPlay) setIsMediaPlaying(true)
        else setIsMediaPlaying(false)
      })
      .catch(error => console.log(error))

    // Auto play starts off false but after the first chapter should always be true, so after loading, we always set it to true.
    if (!shouldAutoPlay) setShouldAutoPlay(true)
  }

  /*
    PLAYBACK STATUS UPDATES
  */

  /**
   * Updates on every api call to the audio object as well as every second. Covers the automatic switch of one chapter to the next and marking a lesson as complete at the finish of the last chapter.
   * @param {Object} playbackStatus - The playback status object passed from the media reference. Includes information like load status, progress, play status, and more.
   */
  const onAudioPlaybackStatusUpdate = playbackStatus => {
    if (activeChapter !== chapters.TRAINING)
      onPlaybackStatusUpdate(playbackStatus)
  }

  /**
   * Updates on every api call to the audio object as well as every second. Covers the automatic switch of one chapter to the next and marking a lesson as complete at the finish of the last chapter.
   * @param {Object} playbackStatus - The playback status object passed from the media reference. Includes information like load status, progress, play status, and more.
   */
  const onVideoPlaybackStatusUpdate = playbackStatus => {
    if (activeChapter === chapters.TRAINING)
      onPlaybackStatusUpdate(playbackStatus)
  }

  /**
   * Updates on every api call to the audio object as well as every second. Covers the automatic switch of one chapter to the next and marking a lesson as complete at the finish of the last chapter.
   * @param {Object} playbackStatus - The playback status object passed from the media reference. Includes information like load status, progress, play status, and more.
   */
  const onPlaybackStatusUpdate = ({
    isLoaded,
    isPlaying,
    positionMillis,
    durationMillis,
    didJustFinish,
    uri,
    error
  }) => {
    // Set isLoaded state to true once media loads.
    if (isLoaded) setIsMediaLoaded(true)

    // If we should update the thumb, update it to the newest value.
    if (shouldThumbUpdate.current && positionMillis)
      setMediaProgress(positionMillis)

    // Mark a lesson as complete if we get at least halfway through its completion chapter and it's not already complete.
    if (
      positionMillis / durationMillis > 0.5 &&
      !isThisLessonComplete.current &&
      activeChapter === completionChapter
    ) {
      console.log('beep')
      markLessonAsComplete()
    }

    // Keep the isPlaying state in sync with the playback status while in fullscreen mode.
    if (
      activeChapter === chapters.TRAINING &&
      fullscreenStatus.current === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
    ) {
      if (isPlaying) setIsMediaPlaying(true)
      else if (!isPlaying) setIsMediaPlaying(false)
    }

    // On a chapter finish, call the appropriate handler function.
    if (didJustFinish) {
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

    // If an error happens, try reloading the active chapter.
    if (error) {
      console.log('Playback error.')
      loadMedia(chapterSources[activeChapter])
    }
  }

  /** useEffect function that refreshes the onPlaybackStatusUpdate function whenever the download status or fullscreen status of the lesson changes since both of those are used throughout the chapter finish handler functions below. */
  useEffect(() => {
    // audioRef.current.setOnPlaybackStatusUpdate(onAudioPlaybackStatusUpdate)
    media.setAudioOnStatusUpdate(onAudioPlaybackStatusUpdate)
  }, [activeChapter, isMediaLoaded, isMediaPlaying])

  /** Handles the finishing of the Fellowship chapter. */
  const onFellowshipFinish = () => {
    // If the lesson has no story audio, change to the Story chapter and swipe over to the scripture text so the user can still read it.
    if (!thisLesson.hasAudio) {
      changeChapter(chapters.STORY)
      albumArtSwiperRef.current.snapToItem(2)
    } // If a Story chapter is still downloading or it isn't downloaded and can't start downloading, swipe to the Scripture text so the user can read the text while they're waiting for it to download.
    else if (isAudioDownloading.current) albumArtSwiperRef.current.snapToItem(2)
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
      // case lessonTypes.AUDIOBOOK:
      //   if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id))) {
      //     updateCompleteStatus()
      //   }
      //   break
    }
  }

  /** Handles the finishing of the Training chapter. */
  const onTrainingFinish = () => {
    // If we're in fullscreen, lock back to portrait orientation and close fullscreen.
    if (fullscreenStatus.current === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT)
      // lockPortrait(() => videoRef.current.dismissFullscreenPlayer())
      lockPortrait(() => media.closeFullscreen())

    switch (lessonType) {
      // If we're in a standard DMC lesson, switch to the Application chapter after a short delay.
      case lessonTypes.STANDARD_DMC:
        setTimeout(() => changeChapter(chapters.APPLICATION), 500)
        break
      // If we're in a video only lesson, the Training chapter is the only chapter, so we can mark the lesson as complete once it's finished.
      // case lessonTypes.VIDEO_ONLY:
      //   if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id)))
      //     setTimeout(() => updateCompleteStatus(), 1000)
      //   break
    }
  }

  /** Handles the finishing of the Application chapter. */
  const onApplicationFinish = () => {
    // if (!thisSetProgress.includes(getLessonInfo('index', thisLesson.id)))
    //   updateCompleteStatus()
  }

  /*
    PLAYBACK CONTROL
  */

  /** Plays the audio if it's currently paused and pauses the audio if it's currently playing. Also animates a play status feedback indicator over the album art. */
  const playHandler = () => {
    // If we're still loading, don't try and do anything with the media.
    if (!isMediaLoaded) return

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

    isMediaPlaying ? media.pause(activeChapter) : media.play(activeChapter)

    // Play or pause the media.
    // if (activeChapter === chapters.TRAINING)
    //   isMediaPlaying
    //     ? videoRef.current.pauseAsync()
    //     : videoRef.current.playAsync()
    // else if (activeChapter !== chapters.TRAINING)
    //   isMediaPlaying
    //     ? audioRef.current.pauseAsync()
    //     : audioRef.current.playAsync()
    // isMediaPlaying ? media.pauseAsync() : media.playAsync()
  }

  /**
   * Plays media from a specified location.
   * @param value - The location to start playing from.
   */
  const playFromLocation = value => {
    // If we're still loading, don't try and do anything with the media.
    if (!isMediaLoaded) return

    shouldThumbUpdate.current = false
    setMediaProgress(value)

    // const media =
    //   activeChapter === chapters.TRAINING ? videoRef.current : audioRef.current

    // media
    //   .setStatusAsync({
    //     shouldPlay: isMediaPlaying ? true : false,
    //     positionMillis: value
    //   })
    media.playFromLocation(value, isMediaPlaying, activeChapter).then(() => {
      shouldThumbUpdate.current = true
    })
  }

  /*
    DOWNLOADS
  */

  /** useEffect function that checks a lesson's downloaded/downloading status. */
  useEffect(() => {
    // Checks whether a lesson's audio or video is currently downloading.
    if (downloads[thisLesson.id]) isAudioDownloading.current = true
    else isAudioDownloading.current = false
    if (downloads[thisLesson.id + 'v']) isVideoDownloading.current = true
    else isVideoDownloading.current = false

    // Checks whether a lesson's audio or video is downloaded.
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        if (contents.includes(thisLesson.id + '.mp3'))
          setIsAudioDownloaded(true)
        if (contents.includes(thisLesson.id + 'v.mp4')) {
          setIsVideoDownloaded(true)
        }
      }
    )
  }, [Object.keys(downloads).length])

  /** useEffect function that removes a download record from the download tracker redux object once it's finished. Removes audio and video download records when necessary. */
  useEffect(() => {
    switch (lessonType) {
      case lessonTypes.STANDARD_DBS:
        if (
          isAudioDownloading.current &&
          downloads[thisLesson.id].progress === 1
        )
          removeDownload(thisLesson.id)
        break
      case lessonTypes.STANDARD_DMC:
        if (
          isAudioDownloading.current &&
          isVideoDownloading.current &&
          downloads[thisLesson.id].progress === 1 &&
          downloads[thisLesson.id + 'v'].progress === 1
        ) {
          removeDownload(thisLesson.id)
          removeDownload(thisLesson.id + 'v')
        }
        break
      case lessonTypes.VIDEO_ONLY:
        if (
          isVideoDownloading.current &&
          downloads[thisLesson.id + 'v'].progress === 1
        )
          removeDownload(thisLesson.id + 'v')
        break
    }
  }, [downloads[thisLesson.id], downloads[thisLesson.id + 'v']])

  /*
    MISC
  */

  /** Marks a lesson as complete and handles any other logic related to that. */
  const markLessonAsComplete = () => {
    // Set isThisLessonComplete to true so that we know not to mark is as complete again.
    isThisLessonComplete.current = true

    // Set the justCompleted state to true so we know to show any relevant modals upon exiting the play screen.
    justCompleted.current = true

    // Toggle the complete status of the lesson.
    toggleComplete(
      activeGroup.name,
      thisSet,
      getLessonInfo('index', thisLesson.id)
    )

    // Track analytics.
    logCompleteLesson(thisLesson, activeGroup.id)

    // Update the navigation options since a check appears next to the header when a lesson is complete.
    setOptions(getNavOptions())
  }

  /**
   * Gets called when the user pressed the back button. Shows any necessary modals before going back as well.
   */
  const onBackButtonPress = async () => {
    // Lock to portrait orientaiton.
    lockPortrait(() => {})

    // Unload all the media.
    // if (audioRef.current) await audioRef.current.unloadAsync()
    // if (videoRef.current) await videoRef.current.unloadAsync()
    // audioRef.current = null
    // videoRef.current = null
    media.unload()
    media.cleanup()

    // Here is where any modals that appear after a lesson is completed for the first time should appear. This will be useful when the gamification update is implemented.
    if (justCompleted.current) {
      // If completing this lesson completes the whole set, show a celebratory modal.
      if (
        activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
          .length /
          (thisSet.lessons.length - 1) ===
        1
      )
        setShowSetCompleteModal(true)
      // Otherwise, just go back.
      else goBack()
    } else goBack()
  }

  /** Keeps the screen from auto-dimming or auto-locking. */
  useKeepAwake()

  /** useEffect function that automatically pauses the media when the play screen becomes unfocused. */
  useEffect(() => {
    if (isMediaPlaying) playHandler()
  }, [isFocused()])

  /*
    RENDER
  */

  return (
    <View style={styles.screen}>
      <View style={styles.middleAreaContainer}>
        {lessonType !== lessonTypes.VIDEO_ONLY && (
          <Animated.View
            style={{
              // Width/height instead of flex: 1 because of a PagerView bug.
              width: '100%',
              height: '100%',
              position: 'absolute',
              opacity:
                lessonType === lessonTypes.BOOK ? 1 : albumArtSwiperOpacity,
              zIndex:
                activeChapter === chapters.TRAINING
                  ? middleAreaVisibility.HIDE
                  : middleAreaVisibility.SHOW
            }}
          >
            <PlayScreenSwiper
              lessonTextContentRef={lessonTextContentRef}
              iconName={thisSet.iconName}
              thisLesson={thisLesson}
              lessonType={lessonType}
              playHandler={playHandler}
              playFeedbackOpacity={playFeedbackOpacity}
              playFeedbackZIndex={playFeedbackZIndex}
              isMediaPlaying={isMediaPlaying}
              sectionOffsets={sectionOffsets}
              markLessonAsComplete={markLessonAsComplete}
              isThisLessonComplete={isThisLessonComplete}
            />
          </Animated.View>
        )}
        {lessonType.includes('Video') && (
          <Animated.View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              opacity: videoPlayerOpacity,
              zIndex:
                activeChapter === chapters.TRAINING
                  ? middleAreaVisibility.SHOW
                  : middleAreaVisibility.HIDE
            }}
          >
            <VideoPlayer
              videoSource={
                chapterSources ? chapterSources[chapters.TRAINING] : null
              }
              videoRef={videoRef}
              onVideoPlaybackStatusUpdate={onVideoPlaybackStatusUpdate}
              setIsMediaPlaying={setIsMediaPlaying}
              fullscreenStatus={fullscreenStatus}
              activeChapter={activeChapter}
              isMediaLoaded={isMediaLoaded}
            />
          </Animated.View>
        )}
      </View>
      {/* For any lessons except book lessons, show some audio controls. */}
      {lessonType !== lessonTypes.BOOK && (
        <SafeAreaView>
          {/* Only lessons that have questions have separate chapters and require the chapter selector. */}
          {lessonType.includes('Questions') && (
            <ChapterSelector
              activeChapter={activeChapter}
              changeChapter={changeChapter}
              isAudioDownloaded={isAudioDownloaded}
              isVideoDownloaded={isVideoDownloaded}
              lessonType={lessonType}
              lessonID={thisLesson.id}
            />
          )}
          <Scrubber
            playFromLocation={playFromLocation}
            shouldThumbUpdate={shouldThumbUpdate}
            mediaLength={mediaLength}
            mediaProgress={mediaProgress}
          />
          <PlaybackControls
            isMediaPlaying={isMediaPlaying}
            isMediaLoaded={isMediaLoaded}
            playHandler={playHandler}
            mediaProgress={mediaProgress}
            playFromLocation={playFromLocation}
          />
        </SafeAreaView>
      )}
      {/* Modals */}
      <ShareModal
        isVisible={showShareLessonModal}
        hideModal={() => setShowShareLessonModal(false)}
        closeText={t.general && t.general.close}
        lesson={thisLesson}
        lessonType={lessonType}
        set={thisSet}
      />
      <MessageModal
        isVisible={showSetCompleteModal}
        hideModal={() => setShowSetCompleteModal(false)}
        title={t.general && t.general.set_complete_title}
        message={t.general && t.general.set_complete_message}
        confirmText={t.general && t.general.got_it}
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
  middleAreaContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen)
