import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ScrollView,
  Share,
  TouchableWithoutFeedback
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { scaleMultiplier } from '../constants'
import { Audio, Video } from 'expo-av'
import OptionsModal from '../components/OptionsModal'
import ModalButton from '../components/ModalButton'
import Scrubber from '../components/Scrubber'
import PlayPauseSkip from '../components/PlayPauseSkip'
import ChapterSelect from '../components/ChapterSelect'
import PlayScreenHeaderButtons from '../components/PlayScreenHeaderButtons'
import BackButton from '../components/BackButton'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { connect } from 'react-redux'
import {
  downloadLesson,
  removeDownload,
  downloadVideo
} from '../redux/actions/downloadActions'
import SVG from '../assets/svg'
import useInterval from '@use-it/interval'
import { TouchableOpacity } from 'react-native-gesture-handler'

console.disableYellowBox = true

function PlayScreen (props) {
  //// STATE

  // stores loaded audio file
  const [soundObject, setSoundObject] = useState(new Audio.Sound())
  const [videoObject, setVideoObject] = useState()

  // stores the length of the current audio file in milliseconds (loaded by sound object)
  const [audioFileLength, setAudioFileLength] = useState(null)

  // keeps track of if the audio file is loaded
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVideoBuffering, setIsVideoBuffering] = useState(false)
  const [showVideoControls, setShowVideoControls] = useState(false)
  // keeps track of whether the audio file is playing or paused
  const [isPlaying, setIsPlaying] = useState(false)

  // keeps track of the current position of the seeker
  const [seekPosition, setSeekPosition] = useState(0)

  // keeps track of if the seeker should update every second
  // note: only time it shouldn't is during seeking, skipping, or loading a new chapter
  const shouldTickUpdate = useRef(false)

  // keeps track of currently playing chapter
  const [activeChapter, setActiveChapter] = useState('fellowship')

  // sources for all 3 audio files
  const [fellowshipSource, setFellowshipSource] = useState()
  const [storySource, setStorySource] = useState()
  const [applicationSource, setApplicationSource] = useState()

  const [trainingSource, setTrainingSource] = useState()

  const [albumArtRef, setAlbumArtRef] = useState()

  //share modal
  const [showShareLessonModal, setShowShareLessonModal] = useState(false)

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

  //// CONSTRUCTOR

  // NEW INTERVAL
  useInterval(updateSeekerTick, 1000)

  useEffect(() => {
    //set nav options
    props.navigation.setOptions(getNavOptions())

    if (props.route.params.thisLesson.questionsType) {
      // set chapters 1 and 3 according the questions type of this lesson
      setFellowshipSource(
        FileSystem.documentDirectory +
          props.activeGroup.language +
          '-' +
          props.route.params.thisLesson.questionsType +
          '-chapter1.mp3'
      )
      setApplicationSource(
        FileSystem.documentDirectory +
          props.activeGroup.language +
          '-' +
          props.route.params.thisLesson.questionsType +
          '-chapter3.mp3'
      )

      // check if this lesson has an audio source
      if (props.route.params.thisLesson.audioSource) {
        // if it does, set the source to it
        setStorySource(
          FileSystem.documentDirectory +
            props.route.params.thisLesson.id +
            '.mp3'
        )
      } else {
        setStorySource(
          FileSystem.documentDirectory +
            props.activeGroup.language +
            '-' +
            'dummy-chapter2.mp3'
        )
      }

      if (props.route.params.thisLesson.videoSource) {
        setTrainingSource(
          FileSystem.documentDirectory +
            props.route.params.thisLesson.id +
            'v.mp4'
        )
      }

      // if an audio file is not downloaded and not currently downloading, download it
      if (
        !props.route.params.isDownloaded &&
        !(props.route.params.thisLesson.id in props.downloads)
      ) {
        props.downloadLesson(
          props.route.params.thisLesson.id,
          props.route.params.thisLesson.audioSource
        )
        if (props.route.params.thisLesson.videoSource) {
          props.downloadVideo(
            props.route.params.thisLesson.id,
            props.route.params.thisLesson.videoSource
          )
        }
      }
      // otherwise, set the source to our dummy mp3 file
    } else {
      changeChapter('training')
      FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
        contents => {
          if (contents.includes(props.route.params.thisLesson.id + 'v.mp4')) {
            setTrainingSource(
              FileSystem.documentDirectory +
                props.route.params.thisLesson.id +
                'v.mp4'
            )
          } else {
            setTrainingSource(props.route.params.thisLesson.videoSource)
          }
        }
      )
    }

    //set up our timer tick for updating the seeker every second
    // const interval = setInterval(updateSeekerTick, 1000)

    //when leaving the screen, cancel the interval timer and unload the audio file
    return function cleanup () {
      // clearInterval(interval)
      if (soundObject) {
        soundObject.unloadAsync()
        setSoundObject(null)
      }
    }
  }, [])

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

  // if a download finishes, remove it from download tracking object
  useEffect(() => {
    if (props.downloads[props.route.params.thisLesson.id] == 1) {
      props.removeDownload(props.route.params.thisLesson.id)
    }

    if (props.downloads[props.route.params.thisLesson.id + 'v'] == 1) {
      props.removeDownload(props.route.params.thisLesson.id + 'v')
    }
  }, [props.downloads])

  //// AUDIO CONTROL FUNCTIONS

  // updates something on every api call to audio object and every second
  soundObject.setOnPlaybackStatusUpdate(playbackStatus => {
    if (playbackStatus.isLoaded) {
      setIsLoaded(true)
    }

    // depending on what chapter we're on, either jump to the next
    // chapter once we finish or toggle the whole lesson as complete
    if (playbackStatus.didJustFinish) {
      if (activeChapter === 'fellowship') {
        if (!props.route.params.thisLesson.id in props.downloads)
          changeChapter('story')
      } else if (activeChapter === 'story') {
        if (props.route.params.thisLesson.videoSource) {
          changeChapter('training')
        } else {
          FileSystem.getInfoAsync(
            FileSystem.documentDirectory +
              props.route.params.thisLesson.id +
              '.mp3'
          ).then(({ exists }) => {
            // only switch to chapter 2 if it's downloaded
            if (
              exists &&
              !(props.route.params.thisLesson.id in props.downloads)
            )
              changeChapter('application')
          })
        }
      } else if (activeChapter === 'application') {
        if (
          !props.activeGroup.addedSets
            .filter(
              addedSet => addedSet.id === props.route.params.thisSet.id
            )[0]
            .progress.includes(props.route.params.thisLesson.index)
        ) {
          changeCompleteStatus()
        }
      }
    }
  })

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

  useEffect(() => {
    if (videoObject && trainingSource) {
      loadVideoFile(props.route.params.thisLesson.videoSource)
    }
  }, [videoObject, trainingSource])

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

  // useEffect(() => {
  //   console.log(videoObject)
  // }, [videoObject])

  //// OTHER FUNCTIONS

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
      } else if (chapter === 'application') {
        setSeekPosition(0)
        loadAudioFile(applicationSource)
      } else if (chapter === 'training') {
        setIsLoaded(false)
        setSeekPosition(0)
      }
      setActiveChapter(chapter)
    }

    // else if (chapter === 'training') {
    //   loadVideoFile(props.route.params.thisLesson.videoSource)
    // }
  }

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
        props.translations.alerts.markedAsIncomplete.header,
        props.translations.alerts.markedAsIncomplete.text,
        [
          {
            text: props.translations.alerts.ok,
            onPress: () => props.navigation.goBack()
          }
        ]
      )
    } else {
      Alert.alert(
        props.translations.alerts.markedAsComplete.header,
        props.translations.alerts.markedAsComplete.text,
        [
          {
            text: props.translations.alerts.ok,
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
                props.translations.alerts.shareUndownloaded.header,
                props.translations.alerts.shareUndownloaded.text,
                [
                  {
                    text: props.translations.alerts.options.ok,
                    onPress: () => {}
                  }
                ]
              )
        })
        break
    }
  }

  //// RENDER

  function renderAlbumArtItem ({ item }) {
    if (item.type === 'text') {
      var scrollBarLeft =
        item.key === '0' ? null : <View style={styles.scrollBar} />
      var scrollBarRight =
        item.key === '0' ? <View style={styles.scrollBar} /> : null
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
            style={[
              styles.textContainer,
              {
                marginLeft: item.key === '2' ? 10 : 0,
                marginRight: item.key === '0' ? 10 : 0,
                marginVertical: 10
              }
            ]}
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
          />
          {scrollBarRight}
        </View>
      )
    } else {
      return (
        <View
          style={[
            styles.albumArtContainer,
            { justifyContent: 'center', alignItems: 'center' }
          ]}
        >
          <SVG
            name={item.svgName}
            width={Dimensions.get('window').width - 80}
            height={Dimensions.get('window').width - 80}
            color='#1D1E20'
          />
        </View>
      )
    }
  }

  function renderTextContent (textList) {
    return (
      <View>
        <Text
          style={[
            styles.albumArtText,
            {
              fontFamily: props.font + '-medium',
              textAlign: props.isRTL ? 'right' : 'left'
            }
          ]}
        >
          {textList.item.header}
        </Text>
        <Text
          style={[
            styles.albumArtText,
            {
              fontFamily: props.font + '-regular',
              textAlign: props.isRTL ? 'right' : 'left'
            }
          ]}
        >
          {textList.item.text + '\n'}
        </Text>
      </View>
    )
  }

  var videoPlayer = (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!showVideoControls) {
          setShowVideoControls(true)
          setTimeout(() => setShowVideoControls(false), 1000)
        }
      }}
    >
      <View
        style={{
          height: Dimensions.get('window').width - 80,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: 'black'
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
          }}
          onLoadStart={() => setIsLoaded(false)}
          onLoad={() => setIsLoaded(true)}
          onFullscreenUpdate={({ fullscreenUpdate, status }) => {}}
        />
        {isLoaded ? null : (
          <View
            style={{
              alignSelf: 'center',
              width: '100%',
              position: 'absolute',
              alignItems: 'center'
            }}
          >
            <Icon name='video' size={100 * scaleMultiplier} color='#828282' />
          </View>
        )}
        {showVideoControls ? (
          <View
            style={{
              width: '100%',
              height: 65 * scaleMultiplier,
              position: 'absolute',
              alignSelf: 'flex-end',
              backgroundColor: '#00000050',
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
                color='#FFF'
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  )

  var middleSection =
    activeChapter === 'training' ? (
      videoPlayer
    ) : (
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
      />
    )

  // renders the play/pause/skip container conditionally because we don't want to show controls when the audio is loading
  // if we're loading, render a loading circle; otherwise load the audio controls
  var audioControlContainer = isLoaded ? (
    <View style={styles.audioControlContainer}>
      {props.route.params.thisLesson.questionsType ? (
        <ChapterSelect
          activeChapter={activeChapter}
          lessonID={props.route.params.thisLesson.id}
          onPress={chapter => changeChapter(chapter)}
          goToScripture={() =>
            albumArtRef.scrollToIndex({
              animated: true,
              viewPosition: 0.5,
              viewOffset: -Dimensions.get('screen').width,
              index: 0
            })
          }
          hasAudioSource={
            props.route.params.thisLesson.audioSource ? true : false
          }
          hasVideoSource={
            props.route.params.thisLesson.videoSource ? true : false
          }
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
      <ActivityIndicator size='large' color='black' />
    </View>
  )

  return (
    <View style={styles.screen}>
      <View style={styles.topHalfContainer}>
        <View style={styles.titlesContainer}>
          <Text style={[styles.title, { fontFamily: props.font + '-black' }]}>
            {props.route.params.thisLesson.title}
          </Text>
        </View>
        <View style={styles.albumArtListContainer}>{middleSection}</View>
      </View>
      {audioControlContainer}

      {/* MODALS */}
      <OptionsModal
        isVisible={showShareLessonModal}
        hideModal={() => setShowShareLessonModal(false)}
        closeText={props.translations.modals.shareOptions.close}
      >
        <ModalButton
          title={props.translations.modals.shareOptions.shareApp}
          onPress={() => share('app')}
        />
        <ModalButton
          title={props.translations.modals.shareOptions.sharePassageText}
          onPress={() => share('text')}
        />
        <ModalButton
          isLast={true}
          title={props.translations.modals.shareOptions.sharePassageAudio}
          onPress={() => share('audio')}
        />
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
    backgroundColor: '#FFFFFF'
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
    flexWrap: 'nowrap'
  },
  title: {
    textAlign: 'center',
    fontSize: 30 * scaleMultiplier,
    flexWrap: 'nowrap'
  },
  albumArtListContainer: {
    width: '100%'
  },
  albumArtContainer: {
    width: Dimensions.get('window').width - 80,
    height: Dimensions.get('window').width - 80,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: '#DEE3E9',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1
  },
  albumArtText: {
    fontSize: 18 * scaleMultiplier
  },
  scrollBar: {
    width: 4,
    height: 150 * scaleMultiplier,
    backgroundColor: '#9FA5AD',
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
    font: state.database[activeGroup.language].font
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
    setBookmark: groupName => {
      dispatch(setBookmark(groupName))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen)
