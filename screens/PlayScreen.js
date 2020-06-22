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
  Share
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { scaleMultiplier, setImages } from '../constants'
import { Audio } from 'expo-av'
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
  removeDownload
} from '../redux/actions/downloadActions'
import SVG from '../assets/svg'

console.disableYellowBox = true

function PlayScreen (props) {
  //// STATE

  // stores loaded audio file
  const [soundObject, setSoundObject] = useState(new Audio.Sound())

  // stores the length of the current audio file in milliseconds (loaded by sound object)
  const [audioFileLength, setAudioFileLength] = useState(null)

  // keeps track of if the audio file is loaded
  const [isLoaded, setIsLoaded] = useState(false)

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
  const [chapter1Source, setChapter1Source] = useState()
  const [chapter2Source, setChapter2Source] = useState()
  const [chapter3Source, setChapter3Source] = useState()

  const [videoSource, setVideoSource] = useState()

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
      svgName:
        'set' +
        props.activeDatabase.sets.filter(
          set => set.id === props.route.params.thisLesson.setid
        )[0].index
    },
    {
      key: '2',
      type: 'text'
    }
  ]

  //// CONSTRUCTOR

  useEffect(() => {
    //set nav options
    props.navigation.setOptions(getNavOptions())

    // set chapters 1 and 3 according the questions type of this lesson
    setChapter1Source(
      FileSystem.documentDirectory +
        props.activeGroup.language +
        '-' +
        props.route.params.thisLesson.questionsType +
        '-chapter1.mp3'
    )
    setChapter3Source(
      FileSystem.documentDirectory +
        props.activeGroup.language +
        '-' +
        props.route.params.thisLesson.questionsType +
        '-chapter3.mp3'
    )

    // check if this lesson has an audio source
    if (props.route.params.thisLesson.audioSource) {
      // if it does, set the source to it
      setChapter2Source(
        FileSystem.documentDirectory + props.route.params.thisLesson.id + '.mp3'
      )

      // if an audio file is not donwloading and not currently downloading, download it
      if (
        !props.route.params.isDownloaded &&
        !(props.route.params.thisLesson.id in props.downloads)
      ) {
        props.downloadLesson(
          props.route.params.thisLesson.id,
          props.route.params.thisLesson.audioSource
        )
      }
      // otherwise, set the source to our dummy mp3 file
    } else {
      setChapter2Source(
        FileSystem.documentDirectory +
          props.activeGroup.language +
          '-' +
          'dummy-chapter2.mp3'
      )
    }

    // TODO: video stuff
    if (props.route.params.thisLesson.videoSource) {
    }

    //set up our timer tick for updating the seeker every second
    const interval = setInterval(updateSeekerTick, 1000)

    //when leaving the screen, cancel the interval timer and unload the audio file
    return function cleanup () {
      clearInterval(interval)
      if (soundObject) {
        soundObject.unloadAsync()
        setSoundObject(null)
      }
    }
  }, [])

  // once we set a chapter 1 source, load it up
  useEffect(() => {
    if (chapter1Source) {
      try {
        loadAudioFile(chapter1Source)
      } catch (error) {
        console.log(error)
      }
    }
  }, [chapter1Source])

  // if a download finishes, remove it from download tracking object
  useEffect(() => {
    if (props.downloads[props.route.params.thisLesson.id] == 1) {
      props.removeDownload(props.route.params.thisLesson.id)
    }
  }, [props.downloads])

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
        changeChapter('passage')
      } else if (activeChapter === 'passage') {
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory +
            props.route.params.thisLesson.id +
            '.mp3'
        ).then(({ exists }) => {
          // only switch to chapter 2 if it's downloaded
          if (exists && !(props.route.params.thisLesson.id in props.downloads))
            changeChapter('application')
        })
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

  // gets called every second by our timer and updates the seeker position based on the progress through the audio file
  async function updateSeekerTick () {
    if (shouldTickUpdate.current) {
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

  // plays the audio if it's currently paused and pauses the audio if it's currently playing
  function playHandler () {
    if (isLoaded) {
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
      setIsPlaying(currentStatus => !currentStatus)
    }
  }

  // starts playing loaded audio from the position the user releases the thumb at
  // note: catchs are empty because of a weird ios-only warning appearing
  // that doesn't seem to affect any functionality--it's being ignored
  function onSeekRelease (value) {
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
    shouldTickUpdate.current = true
    setSeekPosition(value)
  }

  // sets shouldTickUpdate to flase to prevent the seeker from updating while dragging
  function onSeekDrag (value) {
    shouldTickUpdate.current = false
  }

  // skips an amount of milliseconds through the audio track
  function skip (amount) {
    isPlaying
      ? soundObject.setStatusAsync({
          shouldPlay: true,
          positionMillis: seekPosition + amount
        })
      : soundObject.setStatusAsync({
          shouldPlay: false,
          positionMillis: seekPosition + amount
        })
    setSeekPosition(seekPosition => seekPosition + amount)
  }

  //// OTHER FUNCTIONS

  // changes the active chapter
  function changeChapter (chapter) {
    shouldTickUpdate.current = false
    setSeekPosition(0)
    soundObject.unloadAsync()
    setActiveChapter(chapter)

    if (chapter === 'fellowship') {
      loadAudioFile(chapter1Source)
    } else if (chapter === 'passage') {
      loadAudioFile(chapter2Source)
    } else if (chapter === 'application') {
      loadAudioFile(chapter3Source)
    }
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

  // renders the play/pause/skip container conditionally because we don't want to show controls when the audio is loading
  // if we're loading, render a loading circle; otherwise load the audio controls
  var audioControlContainer = isLoaded ? (
    <View style={styles.audioControlContainer}>
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
      />
      <Scrubber
        value={seekPosition}
        onSlidingComplete={onSeekRelease}
        onValueChange={onSeekDrag}
        maximumValue={audioFileLength}
        seekPosition={seekPosition}
      />
      <PlayPauseSkip
        isPlaying={isPlaying}
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
        <View style={styles.albumArtListContainer}>
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
        </View>
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
    setBookmark: groupName => {
      dispatch(setBookmark(groupName))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen)
