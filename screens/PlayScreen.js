import useInterval from '@use-it/interval'
import { Audio, Video } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { useKeepAwake } from 'expo-keep-awake'
import { DeviceMotion } from 'expo-sensors'
import * as Sharing from 'expo-sharing'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Share,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { connect } from 'react-redux'
import SVG from '../assets/svg'
import BackButton from '../components/BackButton'
import ChapterSelect from '../components/ChapterSelect'
import ModalButton from '../components/ModalButton'
import OptionsModal from '../components/OptionsModal'
import PlayPauseSkip from '../components/PlayPauseSkip'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import Scrubber from '../components/Scrubber'
import { colors, scaleMultiplier } from '../constants'
import {
  downloadLesson,
  downloadVideo,
  removeDownload
} from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
console.disableYellowBox = true

function PlayScreen (props) {
  //// STATE

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

  // keeps track of whether the video controls overlay is visible
  const [showVideoControls, setShowVideoControls] = useState(false)

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
  const [albumArtRef, setAlbumArtRef] = useState()
  const [isMiddle, setIsMiddle] = useState(true)
  const [middleScrollBarOpacity, setMiddleScrollBarOpacity] = useState(
    new Animated.Value(0)
  )
  const [sideScrollBarOpacity, setSideScrollBarOpacity] = useState(
    new Animated.Value(0.8)
  )

  const onViewRef = useRef(info => {
    if (info.viewableItems.some(item => item.index === 0)) setIsMiddle(true)
    else setIsMiddle(false)
  })
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  // keeps the screen always awake on this screen
  useKeepAwake()

  useEffect(() => {
    if (isMiddle)
      Animated.sequence([
        Animated.timing(middleScrollBarOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(sideScrollBarOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true
        })
      ]).start()
    else {
      Animated.sequence([
        Animated.timing(sideScrollBarOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(middleScrollBarOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [isMiddle])

  //// OTHER STATE

  // share modal
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)

  // animation state
  const [playOpacity, setPlayOpacity] = useState(new Animated.Value(0))
  const [animationZIndex, setAnimationZIndex] = useState(0)

  // data for album art flatlist
  const albumArtData = [
    {
      key: '0',
      type: 'text'
    },
    {
      key: '1',
      type: 'image',
      svgName: props.route.params.thisSet.icon
    },
    {
      key: '2',
      type: 'text'
    }
  ]

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
      if (props.isConnected) if (!isLoaded) loadVideoFile(trainingSource)
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
      props.route.params.thisLesson.questionsType +
      '-fellowship.mp3'

    var applicationLocal =
      FileSystem.documentDirectory +
      props.activeGroup.language +
      '-' +
      props.route.params.thisLesson.questionsType +
      '-application.mp3'

    var storyLocal =
      FileSystem.documentDirectory + props.route.params.thisLesson.id + '.mp3'

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
    }
  }

  // loads an audio file, sets the length, and starts playing it
  async function loadAudioFile (source) {
    //console.log(source);
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
        loadAudioFile(storySource)
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
    if (albumArtRef)
      albumArtRef.scrollToIndex({
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

  // opens the share sheet to share a chapter of a lesson
  function share (type) {
    switch (type) {
      case 'app':
        Share.share({
          message:
            Platform.OS === 'ios'
              ? 'www.appstorelink.com'
              : 'www.playstorelink.com'
        })
        break
      case 'text':
        Share.share({
          message:
            props.route.params.thisLesson.scriptureHeader +
            ': ' +
            props.route.params.thisLesson.scriptureText
        })
        break
      case 'audio':
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory +
            props.route.params.thisLesson.id +
            '.mp3'
        ).then(({ exists }) => {
          exists
            ? Sharing.shareAsync(
                FileSystem.documentDirectory +
                  props.route.params.thisLesson.id +
                  '.mp3'
              )
            : Alert.alert(
                props.translations.general.popups
                  .share_undownloaded_lesson_title,
                props.translations.general.popups
                  .share_undownloaded_lesson_message,
                [
                  {
                    text: props.translations.general.ok,
                    onPress: () => {}
                  }
                ]
              )
        })
        break
      case 'video':
        Share.share({
          message: props.route.params.thisLesson.videoSource
        })
        break
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

  // renders the album art section in the middle of the screen
  function renderAlbumArtItem ({ item }) {
    var scrollBarLeft = (
      <View
        style={{
          height: '100%',
          width: 20,
          position: 'absolute',
          alignSelf: 'flex-start',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Animated.View
          style={[
            styles.scrollBar,
            {
              opacity:
                item.key === '1' ? middleScrollBarOpacity : sideScrollBarOpacity
            }
          ]}
        />
      </View>
    )
    var scrollBarRight = (
      <View
        style={{
          height: '100%',
          width: 20,
          position: 'absolute',
          alignSelf: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Animated.View
          style={[
            styles.scrollBar,
            {
              opacity:
                item.key === '1' ? middleScrollBarOpacity : sideScrollBarOpacity
            }
          ]}
        />
      </View>
    )

    if (item.type === 'text') {
      return (
        <View
          style={[
            styles.albumArtContainer,
            {
              marginLeft: item.key === '0' ? 30 : 10,
              marginRight: item.key === '2' ? 30 : 10,
              paddingHorizontal: item.key === '1' ? 0 : 10
            }
          ]}
        >
          {scrollBarLeft}
          <FlatList
            style={{
              flexDirection: 'column',
              flex: 1,
              marginLeft: item.key === '2' ? 10 : 0,
              marginRight: item.key === '0' ? 10 : 0
            }}
            data={
              item.key === '0'
                ? props.activeDatabase.questions[
                    props.route.params.thisLesson.questionsType
                  ]
                : props.route.params.thisLesson.scripture
            }
            renderItem={renderTextContent}
            keyExtractor={item => item.header}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={{ width: '100%', height: 10 }} />
            )}
          />
          {scrollBarRight}
        </View>
      )
    } else {
      return (
        <View
          style={[
            styles.albumArtContainer,
            {
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <View style={{ zIndex: 1, width: '100%', height: '100%' }}>
            <TouchableHighlight
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={playHandler}
              underlayColor={colors.white + '00'}
              activeOpacity={1}
            >
              <SVG
                name={item.svgName}
                width={Dimensions.get('window').width - 80}
                height={Dimensions.get('window').width - 80}
                fill='#1D1E20'
              />
            </TouchableHighlight>
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              opacity: playOpacity,
              transform: [
                {
                  scale: playOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 1]
                  })
                }
              ],
              zIndex: animationZIndex
            }}
          >
            <Icon
              name={isPlaying ? 'play' : 'pause'}
              size={100 * scaleMultiplier}
              color={colors.white}
            />
          </Animated.View>
          {scrollBarLeft}
          {scrollBarRight}
        </View>
      )
    }
  }

  // renders the questions/scripture text content
  function renderTextContent (textList) {
    return (
      <View>
        <Text
          style={{
            color: colors.shark,
            fontSize: 18 * scaleMultiplier,
            fontFamily: props.font + '-medium',
            textAlign: props.isRTL ? 'right' : 'left'
          }}
        >
          {textList.item.header}
        </Text>
        <Text
          style={{
            color: colors.shark,
            fontSize: 18 * scaleMultiplier,
            fontFamily: props.font + '-regular',
            textAlign: props.isRTL ? 'right' : 'left'
          }}
        >
          {textList.item.text + '\n'}
        </Text>
      </View>
    )
  }

  // render the middle section of the screen conditionally
  // if fellowship, story, or application are the active chapter, show album
  //  art
  // if training is the active chapter, show the video player
  var middleSection =
    activeChapter === 'training' ? (
      <TouchableWithoutFeedback
        onPress={() => {
          if (!showVideoControls) {
            setShowVideoControls(true)
            setTimeout(() => setShowVideoControls(false), 1000)
          }
        }}
        style={{ width: '100%' }}
      >
        <View
          style={{
            height: Dimensions.get('window').width - 80,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center'
            // backgroundColor: 'black'
          }}
        >
          <Video
            ref={ref => setVideoObject(ref)}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode='contain'
            shouldPlay
            usePoster
            onLoad={() => setIsLoaded(true)}
            style={{ flex: 1 }}
            onPlaybackStatusUpdate={status => {
              // match up so there's a single source of truth between
              // waha controls and native video controls
              if (status.isPlaying) setIsPlaying(true)
              else if (!status.isPlaying) setIsPlaying(false)

              // if we're buffering, turn play icon into activity indicator
              if (!status.isBuffering) setIsVideoBuffering(false)
              else if (status.isBuffering) setIsVideoBuffering(true)

              // if video finishes, switch to last chapter
              if (status.didJustFinish && props.route.params.lessonType !== 'v')
                changeChapter('application')
            }}
            onLoadStart={() => setIsLoaded(false)}
            onLoad={() => setIsLoaded(true)}
            onFullscreenUpdate={({ fullscreenUpdate, status }) => {
              console.log(fullscreenUpdate)
            }}
          />
          {/* display a video icon placeholder when we're loading */}
          {isLoaded ? null : (
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
                height: 65 * scaleMultiplier,
                position: 'absolute',
                alignSelf: 'flex-end',
                backgroundColor: colors.shark + '50',
                justifyContent: 'center'
              }}
            >
              <TouchableOpacity
                style={{ alignSelf: 'flex-end' }}
                onPress={() => {
                  videoObject.presentFullscreenPlayer()
                }}
              >
                <Icon
                  name='fullscreen-enter'
                  size={50 * scaleMultiplier}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View style={{ width: '100%' }}>
          <FlatList
            data={albumArtData}
            renderItem={renderAlbumArtItem}
            ref={ref => setAlbumArtRef(ref)}
            horizontal={true}
            pagingEnabled={true}
            snapToAlignment={'start'}
            snapToInterval={Dimensions.get('window').width - 70}
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').width - 70,
              offset: Dimensions.get('window').width - 70 * index,
              index
            })}
            initialScrollIndex={1}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={onViewRef.current}
          />
        </View>
      </View>
    )

  // entire playback control section
  // isLoaded ?
  //  true: show scrubber
  //        show play/pause
  //        isLessonType = video only ?
  //          true: hide chapter select
  //          false: show chapter select
  //  false: show loading circle
  var audioControlContainer = isLoaded ? (
    <View style={styles.audioControlContainer}>
      {props.route.params.lessonType !== 'v' ? (
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
  )

  return (
    <View style={styles.screen}>
      <View style={styles.topHalfContainer}>
        <View style={styles.titlesContainer}>
          <Text
            numberOfLines={1}
            style={[styles.title, { fontFamily: props.font + '-black' }]}
          >
            {props.route.params.thisLesson.title}
          </Text>
        </View>
        {middleSection}
      </View>
      {audioControlContainer}

      {/* MODALS */}
      <OptionsModal
        isVisible={showShareLessonModal}
        hideModal={() => setShowShareLessonModal(false)}
        closeText={props.translations.general.close}
      >
        <ModalButton
          title={props.translations.general.share_app}
          onPress={() => share('app')}
        />
        {props.route.params.lessonType !== 'v' ? (
          <ModalButton
            title={props.translations.general.share_passage_text}
            onPress={() => share('text')}
          />
        ) : null}
        {(props.route.params.lessonType === 'qa' ||
          props.route.params.lessonType === 'qav') &&
        !props.downloads[props.route.params.thisLesson.id] ? (
          <ModalButton
            title={props.translations.general.share_passage_audio}
            onPress={() => share('audio')}
          />
        ) : null}
        {props.route.params.lessonType !== 'qa' &&
        props.route.params.lessonType !== 'q' ? (
          <ModalButton
            title={props.translations.general.share_video_link}
            onPress={() => share('video')}
          />
        ) : null}
      </OptionsModal>
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
  title: {
    color: colors.shark,
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    flexWrap: 'nowrap'
  },
  albumArtContainer: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: colors.porcelain,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.chateau
  },
  scrollBar: {
    width: 4,
    height: 75 * scaleMultiplier,
    backgroundColor: colors.chateau,
    borderRadius: 10,
    alignSelf: 'center'
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
