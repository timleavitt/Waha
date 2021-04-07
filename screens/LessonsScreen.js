import * as FileSystem from 'expo-file-system'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'
import LessonItem from '../components/list-items/LessonItem'
import LessonSwipeBackdrop from '../components/list-items/LessonSwipeBackdrop'
import SetItem from '../components/list-items/SetItem'
import OptionsModalButton from '../components/OptionsModalButton'
import ScreenHeaderImage from '../components/ScreenHeaderImage'
import BackButton from '../components/standard/BackButton'
import { getLessonInfo, itemHeights, scaleMultiplier } from '../constants'
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
  //+ STATE

  // keeps track of which lessons are downloaded
  const [downloadsInFileSystem, setDownloadsInFileSystem] = useState({})

  // keeps track of the lesson to download/delete/toggle complete when modals
  //  are up
  const [activeLessonInModal, setActiveLessonInModal] = useState({})

  // modal states
  const [showDownloadLessonModal, setShowDownloadLessonModal] = useState(false)
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false)
  const [showLessonOptionsModal, setShowLessonOptionsModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showHomeworkModal, setShowHomeworkModal] = useState(false)
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false)

  // progress and bookmark for the set we're looking at
  const [thisSetProgress, setThisSetProgress] = useState([])
  const [thisSetBookmark, setThisSetBookmark] = useState(1)

  //+ NAV OPTIONS

  function getNavOptions () {
    return {
      headerTitle: () => <ScreenHeaderImage />,
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => {},
      headerLeft: isRTL
        ? () => {}
        : () => <BackButton onPress={() => goBack()} />
    }
  }

  //+ CONSTRUCTOR

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  //+ FUNCTIONS

  // - checks which lessons and lesson videos are downloaded and stores in state
  useEffect(() => {
    var whichLessonsDownloaded = {}
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        thisSet.lessons.forEach(lesson => {
          if (contents.includes(lesson.id + '.mp3'))
            whichLessonsDownloaded[lesson.id] = true
          if (contents.includes(lesson.id + 'v.mp4')) {
            whichLessonsDownloaded[lesson.id + 'v'] = true
          }
        })
        return whichLessonsDownloaded
      })
      .then(whichLessonsDownloaded => {
        setDownloadsInFileSystem(whichLessonsDownloaded)
      })
  }, [downloads])

  //- whenever progress or bookmarks update, update the progress and bookmarks for this set
  useEffect(() => {
    setThisSetProgress(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
    )
    setThisSetBookmark(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].bookmark
    )
  }, [activeGroup.addedSets, activeGroup.setBookmark])

  //- gets the type of a lesson in string form
  //! note: not stored in db for ssot purposes
  function getLessonType (lesson) {
    // q = has questions, a = has audio, v = has video
    // options not allowed: av, a, or nothing
    var lessonType = ''
    lessonType += lesson.fellowshipType ? 'q' : ''
    lessonType += lesson.hasAudio ? 'a' : ''
    lessonType += lesson.hasVideo ? 'v' : ''

    return lessonType
  }

  //- hides all the modals
  function hideModals () {
    setShowDownloadLessonModal(false)
    setShowDeleteLessonModal(false)
    setShowShareModal(false)
  }

  //+ LESSON-TYPE-BASED FUNCTIONS
  //+ NOTE: for these functions, what is returned depends on the type of the
  //+   lesson. lesson type with a checks for audio, with v checks for video

  //- determines if a lesson is downloaded based on its type
  function getIsLessonDownloaded (lesson) {
    switch (getLessonType(lesson)) {
      case 'qa':
      case 'a':
        if (downloadsInFileSystem[lesson.id]) return true
        else return false
        break
      case 'qav':
        if (
          downloadsInFileSystem[lesson.id] &&
          downloadsInFileSystem[lesson.id + 'v']
        )
          return true
        else return false
        break
      case 'qv':
      case 'v':
        if (downloadsInFileSystem[lesson.id + 'v']) return true
        else return false
        break
    }
  }

  //- determines if a lesson is downloading based on its type
  function getIsLessonDownloading (lesson) {
    switch (getLessonType(lesson)) {
      case 'qa':
      case 'a':
        if (downloads[lesson.id]) return true
        else return false
        break
      case 'qav':
        if (downloads[lesson.id] && downloads[lesson.id + 'v']) return true
        else return false
        break
      case 'qv':
      case 'v':
        if (downloads[lesson.id + 'v']) return true
        else return false
        break
    }
  }

  //- downloads a lesson's scripture mp3 via modal press based on its type
  function downloadLessonFromModal () {
    switch (getLessonType(activeLessonInModal)) {
      case 'qa':
      case 'a':
        downloadMedia(
          'audio',
          activeLessonInModal.id,
          getLessonInfo('audioSource', activeLessonInModal.id)
        )
        break
      case 'qav':
        downloadMedia(
          'audio',
          activeLessonInModal.id,
          getLessonInfo('audioSource', activeLessonInModal.id)
        )
        downloadMedia(
          'video',
          activeLessonInModal.id,
          getLessonInfo('videoSource', activeLessonInModal.id)
        )
        break
      case 'qv':
      case 'v':
        downloadMedia(
          'video',
          activeLessonInModal.id,
          getLessonInfo('videoSource', activeLessonInModal.id)
        )
        break
    }
    hideModals()
  }

  //- deletes a lesson's chapter 2 mp3 via modal press based on its type
  function deleteLessonFromModal () {
    switch (getLessonType(activeLessonInModal)) {
      case 'qa':
      case 'a':
        FileSystem.deleteAsync(
          FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
        )
        break
      case 'qav':
        FileSystem.deleteAsync(
          FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
        )
        FileSystem.deleteAsync(
          FileSystem.documentDirectory + activeLessonInModal.id + 'v.mp4'
        )
        break
      case 'qv':
      case 'v':
        FileSystem.deleteAsync(
          FileSystem.documentDirectory + activeLessonInModal.id + 'v.mp4'
        )
        break
    }

    removeDownload(activeLessonInModal.id)
    removeDownload(activeLessonInModal.id + 'v')
    hideModals()
  }

  //+ LESSON SWIPE FUNCTIONS

  //- sets activeLessonInModal to whatever lesson we're swiping so we can
  //-   share/mark it as complete
  const onLessonSwipeBegin = useCallback(data => {
    setActiveLessonInModal(
      thisSet.lessons.filter(
        lesson => getLessonInfo('index', lesson.id) === parseInt(data)
      )[0]
    )
  }, [])

  function checkForFullyComplete () {
    if (
      thisSetProgress.length === thisSet.lessons.length - 1 &&
      !thisSetProgress.includes(getLessonInfo('index', activeLessonInModal.id))
    ) {
      // logCompleteStorySet(
      //   thisSet,
      //   activeGroup.language
      // )
      setShowSetCompleteModal(true)
    }
  }

  //- marks a lesson as complete from a swipe and closes the row
  function markLessonAsCompleteFromSwipe (data) {
    if (data.isActivated) {
      toggleComplete(activeGroup.name, thisSet, parseInt(data.key))

      // check if we just fully completed the set
      checkForFullyComplete()
    }
  }

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

  const keyExtractor = useCallback(
    item => getLessonInfo('index', item.id).toString(),
    []
  )

  const onLeftActionStatusChange = useCallback(data => {
    if (isRTL) setShowShareModal(true)
    else markLessonAsCompleteFromSwipe(data)
  }, [])

  const onRightActionStatusChange = useCallback(data => {
    if (isRTL) markLessonAsCompleteFromSwipe(data)
    else setShowShareModal(true)
  }, [])

  const getItemLayout = useCallback(
    (data, index) => ({
      length: itemHeights[font].LessonItem,
      offset: itemHeights[font].LessonItem * index,
      index
    }),
    []
  )

  const renderLessonItem = ({ item }) => {
    return (
      <LessonItem
        thisLesson={item}
        onLessonSelect={() =>
          navigate('Play', {
            thisLesson: item,
            thisSet: thisSet,
            // thisSetProgress: thisSetProgress,
            isDownloaded: getIsLessonDownloaded(item),
            isDownloading: getIsLessonDownloading(item),
            lessonType: getLessonType(item)
          })
        }
        isBookmark={getLessonInfo('index', item.id) === thisSetBookmark}
        isDownloaded={getIsLessonDownloaded(item)}
        isDownloading={getIsLessonDownloading(item)}
        lessonType={getLessonType(item)}
        isComplete={thisSetProgress.includes(getLessonInfo('index', item.id))}
        setActiveLessonInModal={() => setActiveLessonInModal(item)}
        setShowDownloadLessonModal={() => setShowDownloadLessonModal(true)}
        setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.studySetItemContainer,
          {
            height: itemHeights[font].SetItem
          }
        ]}
      >
        <SetItem thisSet={thisSet} screen='Lessons' />
      </View>
      <SwipeListView
        data={thisSet.lessons}
        renderItem={renderLessonItem}
        getItemLayout={getItemLayout}
        ListFooterComponent={() => <View style={{ height: 30 }} />}
        keyExtractor={keyExtractor}
        renderHiddenItem={renderLessonSwipeBackdrop}
        leftOpenValue={50}
        rightOpenValue={-50}
        // ! these are different on platform because the activation is causing a
        // !   crash on android phones
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

      {/* MODALS */}
      <OptionsModal
        isVisible={showDownloadLessonModal}
        hideModal={hideModals}
        closeText={translations.general.cancel}
      >
        <OptionsModalButton
          title={translations.lessons.popups.download_lesson_button_label}
          onPress={downloadLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showDeleteLessonModal}
        hideModal={hideModals}
        closeText={translations.general.cancel}
      >
        <OptionsModalButton
          title={translations.lessons.popups.delete_lesson_button_label}
          onPress={deleteLessonFromModal}
        />
      </OptionsModal>
      <ShareModal
        isVisible={showShareModal}
        hideModal={hideModals}
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

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.aquaHaze
  },
  studySetItemContainer: {
    width: '100%',
    height: 100 * scaleMultiplier
    // aspectRatio: 4
  },
  headerImage: {
    resizeMode: 'contain',
    width: 150,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(LessonsScreen)
