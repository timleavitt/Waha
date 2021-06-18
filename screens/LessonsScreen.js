import { useIsFocused } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'
import LessonItem from '../components/LessonItem'
import LessonSwipeBackdrop from '../components/LessonSwipeBackdrop'
import OptionsModalButton from '../components/OptionsModalButton'
import ScreenHeaderImage from '../components/ScreenHeaderImage'
import SetItem from '../components/SetItem'
import WahaBackButton from '../components/WahaBackButton'
import {
  getLessonInfo,
  itemHeights,
  lessonTypes,
  setItemModes
} from '../constants'
import {
  checkForAlmostCompleteSet,
  checkForFullyCompleteSet
} from '../functions/setProgressFunctions'
import MessageModal from '../modals/MessageModal'
import OptionsModal from '../modals/OptionsModal'
import ShareModal from '../modals/ShareModal'
import { downloadMedia, removeDownload } from '../redux/actions/downloadActions'
import { addSet, toggleComplete } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    downloads: state.downloads,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeDatabase: activeDatabaseSelector(state),
    activeGroup: activeGroupSelector(state),
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    downloadMedia: (type, lessonID, source) => {
      dispatch(downloadMedia(type, lessonID, source))
    },
    toggleComplete: (groupName, set, lessonIndex) => {
      dispatch(toggleComplete(groupName, set, lessonIndex))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    },
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    }
  }
}

/**
 * Screen that displays a list of lessons for a specific Story Set.
 * @param {Object} thisSet - The object for the set that we're displaying.
 */
const LessonsScreen = ({
  // Props passed from navigation.
  navigation: { goBack, setOptions, navigate },
  route: {
    // Props passed from previous screen.
    params: { setID }
  },
  // Props passed from redux.
  downloads,
  isRTL,
  activeDatabase,
  activeGroup,
  t,
  font,
  downloadMedia,
  toggleComplete,
  removeDownload,
  addSet
}) => {
  const isFocused = useIsFocused()

  /** Keeps track of what lessons are downloaded to the file system. */
  const [downloadedLessons, setDownloadedLessons] = useState([])

  /** Whenever we enable a lesson-specific modal, we also set this state to the specific lesson so we can use its information for whatever action we're doing. */
  const [activeLessonInModal, setActiveLessonInModal] = useState({})

  /** Keeps track of the type of the active lesson in a modal. */
  const [modalLessonType, setModalLessonType] = useState()

  /** A whole lot of modal states. */
  const [showDownloadLessonModal, setShowDownloadLessonModal] = useState(false)
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false)

  const [thisSet, setThisSet] = useState(
    activeDatabase.sets.filter(set => set.id === setID)[0]
  )

  const [addedSet, setAddedSet] = useState(
    activeGroup.addedSets.filter(addedSet => addedSet.id === thisSet.id)[0]
  )

  /** Keeps track of whether this lesson was just completed. */
  const justCompleted = useRef(false)

  const [isInInfoMode, setIsInInfoMode] = useState(false)

  const [animationFinished, setAnimationFinished] = useState(false)

  /** Keeps track of the progress of the set that we're displaying. */
  // const [thisSetProgress, setThisSetProgress] = useState([])
  // const [progressPercentage, setProgressPercentage] = useState(
  //   activeGroup.addedSets.filter(addedSet => addedSet.id === thisSet.id)[0]
  //     .progressPercentage
  // )

  // const [progressArray, setProgressArray] = useState()

  // /** Keeps track of the bookmark for the set that we're displaying. */
  // const [thisSetBookmark, setThisSetBookmark] = useState(1)

  /** Used to refresh the downloaded lessons. */
  const [refreshDownloadedLessons, setRefreshDownloadedLessons] = useState(
    false
  )

  /** Keeps track of whether the unlock modal is visible. */
  const [showNextSetUnlockedModal, setShowNextSetUnlockedModal] = useState(
    false
  )

  /** useEffect function to set the navigation options. */
  useEffect(() => {
    setOptions({
      headerTitle: () => <ScreenHeaderImage />,
      headerRight: isRTL
        ? () => <WahaBackButton onPress={() => goBack()} />
        : () => {},
      headerLeft: isRTL
        ? () => {}
        : () => <WahaBackButton onPress={() => goBack()} />
    })
  }, [])

  /** useEffect function that checks which lessons are downloaded to the file system whenever the downloads redux object changes or when we manually refresh. */
  useEffect(() => {
    var downloadedLessons = []
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        thisSet.lessons.forEach(lesson => {
          if (contents.includes(lesson.id + '.mp3'))
            downloadedLessons.push(lesson.id)
          if (contents.includes(lesson.id + 'v.mp4')) {
            downloadedLessons.push(lesson.id + 'v')
          }
        })
        return downloadedLessons
      })
      .then(whichLessonsDownloaded => {
        setDownloadedLessons(whichLessonsDownloaded)
      })
  }, [Object.keys(downloads).length, refreshDownloadedLessons])

  /** useEffect functino that updates the addedSet state whenever it changes in redux. */
  useEffect(() => {
    setAddedSet(activeGroup.addedSets.filter(set => set.id === thisSet.id)[0])
  }, [activeGroup.addedSets.filter(set => set.id === thisSet.id)[0]])

  /** useEffect function that updates whenever this set's progress changes and handles the changes appropriately. */
  useEffect(() => {
    if (isFocused && justCompleted.current) {
      checkForAlmostCompleteSet(
        thisSet,
        addedSet,
        activeGroup,
        activeDatabase,
        addSet,
        setShowNextSetUnlockedModal
      )
      checkForFullyCompleteSet(thisSet, addedSet, setShowSetCompleteModal)
    }
  }, [addedSet.progress])

  /**
   * Gets the type of a specific lesson. See lessonTypes in constants.js. While every lesson's type stays constant, this information isn't stored in the database for single source of truth reasons.
   * @param {Object} lesson - The object for the lesson to get the type of.
   */
  const getLessonType = lesson => {
    if (lesson.fellowshipType && lesson.hasAudio && !lesson.hasVideo)
      return lessonTypes.STANDARD_DBS
    else if (lesson.fellowshipType && lesson.hasAudio && lesson.hasVideo)
      return lessonTypes.STANDARD_DMC
    else if (lesson.hasVideo) return lessonTypes.VIDEO_ONLY
    else if (lesson.fellowshipType) return lessonTypes.STANDARD_NO_AUDIO
    else if (lesson.text && lesson.hasAudio) return lessonTypes.AUDIOBOOK
    else return lessonTypes.BOOK
  }

  /** Downloads the necessary content for a lesson. */
  const downloadLessonFromModal = () => {
    if (
      modalLessonType.includes('Audio') &&
      !downloadedLessons.includes(activeLessonInModal.id)
    )
      downloadMedia(
        'audio',
        activeLessonInModal.id,
        getLessonInfo('audioSource', activeLessonInModal.id)
      )

    if (
      modalLessonType.includes('Video') &&
      !downloadedLessons.includes(activeLessonInModal.id + 'v')
    )
      downloadMedia(
        'video',
        activeLessonInModal.id,
        getLessonInfo('videoSource', activeLessonInModal.id)
      )

    setShowDownloadLessonModal(false)
  }

  /** Deletes a lesson. */
  const deleteLessonFromModal = () => {
    // If a lesson contains audio, delete it and refresh the downloaded lessons.
    if (modalLessonType.includes('Audio'))
      FileSystem.deleteAsync(
        FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
      ).then(() => setRefreshDownloadedLessons(current => !current))

    // If a lesson contains video, delete it and refresh the downloaded lessons.
    if (modalLessonType.includes('Video'))
      FileSystem.deleteAsync(
        FileSystem.documentDirectory + activeLessonInModal.id + 'v.mp4'
      ).then(() => setRefreshDownloadedLessons(current => !current))

    setShowDeleteLessonModal(false)
  }

  /** Navigates to the Play screen with some parameters. */
  const goToPlayScreen = params =>
    navigate('Play', { ...params, thisSet: thisSet })

  /** Whenever we start swiping a lesson, set the active lesson in modal. */
  const onLessonSwipeBegin = useCallback(data => {
    setActiveLessonInModal(
      thisSet.lessons.filter(
        lesson => getLessonInfo('index', lesson.id) === parseInt(data)
      )[0]
    )
  }, [])

  /** Check if a lesson is fully complete or not. */
  // const checkForFullyComplete = () => {
  //   if (
  //     !addedSet.progress.includes(
  //       getLessonInfo('index', activeLessonInModal.id)
  //     )
  //   )
  //     checkForFullyCompleteSet(thisSet, addedSet, setShowSetCompleteModal)
  // }

  /** Renders the backdrop for the lesson item. This appears when the user swipes the lesson. */
  const renderLessonSwipeBackdrop = (data, rowMap) => (
    <LessonSwipeBackdrop
      isComplete={addedSet.progress.includes(
        getLessonInfo('index', data.item.id)
      )}
      toggleComplete={() => {
        toggleComplete(
          activeGroup.name,
          thisSet,
          getLessonInfo('index', data.item.id)
        )
        justCompleted.current = true
        rowMap[getLessonInfo('index', data.item.id)].closeRow()
      }}
      showShareModal={() => {
        setShowShareModal(true)
        rowMap[getLessonInfo('index', data.item.id)].closeRow()
      }}
    />
  )

  /** Triggers an action when the user swipes a certain distance to the left. */
  const onLeftActionStatusChange = useCallback(data => {
    if (!isRTL && data.isActivated) {
      toggleComplete(activeGroup.name, thisSet, parseInt(data.key))
      justCompleted.current = true
    } else if (isRTL && data.isActivated) setShowShareModal(true)
  }, [])

  /** Triggers an action when the user swipes a certain distance to the right. */
  const onRightActionStatusChange = useCallback(data => {
    if (isRTL && data.isActivated) {
      toggleComplete(activeGroup.name, thisSet, parseInt(data.key))
      justCompleted.current = true
    } else if (!isRTL && data.isActivated) setShowShareModal(true)
  }, [])

  // We know the height of these items ahead of time so we can use getItemLayout to make our FlatList perform better.
  const getItemLayout = useCallback(
    (data, index) => ({
      length: itemHeights[font].LessonItem,
      offset: itemHeights[font].LessonItem * index,
      index
    }),
    []
  )

  /** Renders a lesson item. */
  const renderLessonItem = ({ item }) => {
    if (item.scripture) {
      var scriptureList = item.scripture[0].header

      item.scripture.forEach((passage, index) => {
        if (index !== 0) scriptureList += ', ' + passage.header
      })
    }
    return (
      <LessonItem
        thisLesson={item}
        goToPlayScreen={goToPlayScreen}
        isBookmark={addedSet.bookmark === getLessonInfo('index', item.id)}
        lessonType={getLessonType(item)}
        isComplete={addedSet.progress.includes(getLessonInfo('index', item.id))}
        downloadedLessons={downloadedLessons}
        showDownloadLessonModal={() => {
          setActiveLessonInModal(item)
          setModalLessonType(getLessonType(item))
          setShowDownloadLessonModal(true)
        }}
        showDeleteLessonModal={() => {
          setActiveLessonInModal(item)
          setModalLessonType(getLessonType(item))
          setShowDeleteLessonModal(true)
        }}
        scriptureList={scriptureList}
        isInInfoMode={isInInfoMode}
        animationFinished={animationFinished}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <View style={{ height: itemHeights[font].SetItem, width: '100%' }}>
        <SetItem
          thisSet={thisSet}
          mode={setItemModes.LESSONS_SCREEN}
          progressPercentage={addedSet.progress.length / thisSet.lessons.length}
          setIsInInfoMode={setIsInInfoMode}
          isInInfoMode={isInInfoMode}
          setAnimationFinished={setAnimationFinished}
        />
      </View>
      <SwipeListView
        data={thisSet.lessons}
        renderItem={renderLessonItem}
        getItemLayout={getItemLayout}
        ListFooterComponent={() => <View style={{ height: 30 }} />}
        keyExtractor={item => getLessonInfo('index', item.id).toString()}
        renderHiddenItem={renderLessonSwipeBackdrop}
        leftOpenValue={50}
        rightOpenValue={-50}
        // For whatever reason, the activation value causes a crash on Android, so this is ios-only.
        leftActivationValue={
          Platform.OS === 'ios' ? Dimensions.get('screen').width / 2 - 10 : 1000
        }
        rightActivationValue={
          Platform.OS === 'ios'
            ? -Dimensions.get('screen').width / 2 + 10
            : -1000
        }
        stopLeftSwipe={Dimensions.get('screen').width / 2}
        stopRightSwipe={-Dimensions.get('screen').width / 2}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
        swipeGestureBegan={onLessonSwipeBegin}
        disableRightSwipe={isInInfoMode}
        disableLeftSwipe={isInInfoMode}
      />

      {/* Modals */}
      <OptionsModal
        isVisible={showDownloadLessonModal}
        hideModal={() => setShowDownloadLessonModal(false)}
        closeText={t.general && t.general.cancel}
      >
        <OptionsModalButton
          label={t.lessons && t.lessons.download_lesson}
          onPress={downloadLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showDeleteLessonModal}
        hideModal={() => setShowDeleteLessonModal(false)}
        closeText={t.general && t.general.cancel}
      >
        <OptionsModalButton
          label={t.lessons && t.lessons.remove_download}
          onPress={deleteLessonFromModal}
        />
      </OptionsModal>
      <ShareModal
        isVisible={showShareModal}
        hideModal={() => setShowShareModal(false)}
        closeText={t.general && t.general.close}
        lesson={activeLessonInModal}
        lessonType={getLessonType(activeLessonInModal)}
        set={thisSet}
      />
      <MessageModal
        isVisible={showSetCompleteModal}
        hideModal={() => setShowSetCompleteModal(false)}
        title={t.sets && t.sets.set_complete_title}
        message={t.sets && t.sets.set_complete_message}
        confirmText={t.general && t.general.got_it}
        confirmOnPress={() => {
          setShowSetCompleteModal(false)
        }}
      >
        <LottieView
          style={{ width: '100%' }}
          autoPlay
          loop
          resizeMode='cover'
          source={require('../assets/lotties/set_complete.json')}
        />
      </MessageModal>
      <MessageModal
        isVisible={showNextSetUnlockedModal}
        hideModal={() => setShowNextSetUnlockedModal(false)}
        title={t.sets && t.sets.new_story_set_unlocked_title}
        message={t.sets && t.sets.new_story_set_unlocked_message}
        confirmText={t.general && t.general.got_it}
        confirmOnPress={() => setShowNextSetUnlockedModal(false)}
      >
        <LottieView
          style={{ width: '100%' }}
          autoPlay
          loop
          resizeMode='cover'
          source={require('../assets/lotties/new_set_unlocked.json')}
        />
      </MessageModal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(LessonsScreen)
