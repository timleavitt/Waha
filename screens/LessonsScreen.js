import * as FileSystem from 'expo-file-system'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
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
  scaleMultiplier,
  setItemModes
} from '../constants'
import MessageModal from '../modals/MessageModal'
import OptionsModal from '../modals/OptionsModal'
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
    downloads: state.downloads,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeDatabase: activeDatabaseSelector(state),
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations,
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
    params: { thisSet }
  },
  // Props passed from redux.
  downloads,
  isRTL,
  activeDatabase,
  activeGroup,
  translations,
  font,
  downloadMedia,
  toggleComplete,
  removeDownload
}) => {
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

  /** Keeps track of the progress of the set that we're displaying. */
  const [thisSetProgress, setThisSetProgress] = useState([])

  /** Keeps track of the bookmark for the set that we're displaying. */
  const [thisSetBookmark, setThisSetBookmark] = useState(1)

  /** Used to refresh the downloaded lessons. */
  const [refreshDownloadedLessons, setRefreshDownloadedLessons] = useState(
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

  /** useEffect function that updates the set progress and set bookmark state whenever whenever the progress updates or the set bookmark updates in redux. */
  useEffect(() => {
    setThisSetProgress(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
    )
    setThisSetBookmark(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].bookmark
    )
  }, [activeGroup.addedSets, activeGroup.setBookmark])

  /**
   * Gets the type of a specific lesson. See lessonTypes in constants.js. While every lesson's type stays constant, this information isn't stored in the database for single source of truth reasons.
   * @param {Object} lesson - The object for the lesson to get the type of.
   */
  function getLessonType (lesson) {
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
  function downloadLessonFromModal () {
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
  function deleteLessonFromModal () {
    if (modalLessonType.includes('Audio'))
      FileSystem.deleteAsync(
        FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
      ).then(() => setRefreshDownloadedLessons(current => !current))

    if (modalLessonType.includes('Video'))
      FileSystem.deleteAsync(
        FileSystem.documentDirectory + activeLessonInModal.id + 'v.mp4'
      ).then(() => setRefreshDownloadedLessons(current => !current))

    removeDownload(activeLessonInModal.id)
    removeDownload(activeLessonInModal.id + 'v')
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
  function checkForFullyComplete () {
    if (
      thisSetProgress.length === thisSet.lessons.length - 1 &&
      !thisSetProgress.includes(getLessonInfo('index', activeLessonInModal.id))
    ) {
      setShowSetCompleteModal(true)
    }
  }

  /** Renders the backdrop for the lesson item. This appears when the user swipes the lesson. */
  const renderLessonSwipeBackdrop = (data, rowMap) => (
    <LessonSwipeBackdrop
      isComplete={thisSetProgress.includes(
        getLessonInfo('index', data.item.id)
      )}
      toggleComplete={() => {
        toggleComplete(
          activeGroup.name,
          thisSet,
          getLessonInfo('index', data.item.id)
        )
        checkForFullyComplete()
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
      checkForFullyComplete()
    } else if (isRTL && data.isActivated) setShowShareModal(true)
  }, [])

  /** Triggers an action when the user swipes a certain distance to the right. */
  const onRightActionStatusChange = useCallback(data => {
    if (isRTL && data.isActivated) {
      toggleComplete(activeGroup.name, thisSet, parseInt(data.key))
      checkForFullyComplete()
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
  const renderLessonItem = ({ item }) => (
    <LessonItem
      thisLesson={item}
      goToPlayScreen={goToPlayScreen}
      thisSetBookmark={thisSetBookmark}
      lessonType={getLessonType(item)}
      thisSetProgress={thisSetProgress}
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
    />
  )

  return (
    <View style={styles.screen}>
      <View style={{ height: itemHeights[font].SetItem, width: '100%' }}>
        <SetItem thisSet={thisSet} mode={setItemModes.LESSONS_SCREEN} />
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
      />

      {/* Modals */}
      <OptionsModal
        isVisible={showDownloadLessonModal}
        hideModal={() => setShowDownloadLessonModal(false)}
        closeText={translations.general.cancel}
      >
        <OptionsModalButton
          title={translations.lessons.popups.download_lesson_button_label}
          onPress={downloadLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showDeleteLessonModal}
        hideModal={() => setShowDeleteLessonModal(false)}
        closeText={translations.general.cancel}
      >
        <OptionsModalButton
          title={translations.lessons.popups.delete_lesson_button_label}
          onPress={deleteLessonFromModal}
        />
      </OptionsModal>
      <ShareModal
        isVisible={showShareModal}
        hideModal={() => setShowShareModal(false)}
        closeText={translations.general.close}
        lesson={activeLessonInModal}
        lessonType={getLessonType(activeLessonInModal)}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(LessonsScreen)
