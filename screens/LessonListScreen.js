import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'
import LessonItem from '../components/list-items/LessonItem'
import LessonSwipeBackdrop from '../components/list-items/LessonSwipeBackdrop'
import SetItem from '../components/list-items/SetItem'
import OptionsModalButton from '../components/OptionsModalButton'
import BackButton from '../components/standard/BackButton'
import {
  colors,
  getLanguageFont,
  getLessonInfo,
  itemHeights,
  scaleMultiplier
} from '../constants'
import MessageModal from '../modals/MessageModal'
import OptionsModal from '../modals/OptionsModal'
import ShareModal from '../modals/ShareModal'
import { downloadMedia, removeDownload } from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
// import { logCompleteStorySet } from '../redux/LogEventFunctions'

function LessonListScreen (props) {
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
      headerTitle: () => (
        <Image
          style={styles.headerImage}
          source={{
            uri:
              FileSystem.documentDirectory +
              props.activeGroup.language +
              '-header.png'
          }}
        />
      ),
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  //+ FUNCTIONS

  //- checks which lessons and lesson videos are downloaded and stores in state
  useEffect(() => {
    var whichLessonsDownloaded = {}
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        props.route.params.thisSet.lessons.forEach(lesson => {
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
  }, [props.downloads])

  //- whenever progress or bookmarks update, update the progress and bookmarks for this set
  useEffect(() => {
    setThisSetProgress(
      props.activeGroup.addedSets.filter(
        set => set.id === props.route.params.thisSet.id
      )[0].progress
    )
    setThisSetBookmark(
      props.activeGroup.addedSets.filter(
        set => set.id === props.route.params.thisSet.id
      )[0].bookmark
    )
  }, [props.activeGroup.addedSets, props.activeGroup.setBookmark])

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
        if (props.downloads[lesson.id]) return true
        else return false
        break
      case 'qav':
        if (props.downloads[lesson.id] && props.downloads[lesson.id + 'v'])
          return true
        else return false
        break
      case 'qv':
      case 'v':
        if (props.downloads[lesson.id + 'v']) return true
        else return false
        break
    }
  }

  //- downloads a lesson's scripture mp3 via modal press based on its type
  function downloadLessonFromModal () {
    switch (getLessonType(activeLessonInModal)) {
      case 'qa':
      case 'a':
        props.downloadMedia(
          'audio',
          activeLessonInModal.id,
          getLessonInfo('audioSource', activeLessonInModal.id)
        )
        break
      case 'qav':
        props.downloadMedia(
          'audio',
          activeLessonInModal.id,
          getLessonInfo('audioSource', activeLessonInModal.id)
        )
        props.downloadMedia(
          'video',
          activeLessonInModal.id,
          getLessonInfo('videoSource', activeLessonInModal.id)
        )
        break
      case 'qv':
      case 'v':
        props.downloadMedia(
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

    props.removeDownload(activeLessonInModal.id)
    props.removeDownload(activeLessonInModal.id + 'v')
    hideModals()
  }

  //+ LESSON SWIPE FUNCTIONS

  //- sets activeLessonInModal to whatever lesson we're swiping so we can
  //-   share/mark it as complete
  function onLessonSwipeBegin (data) {
    setActiveLessonInModal(
      props.route.params.thisSet.lessons.filter(
        lesson => getLessonInfo('index', lesson.id) === parseInt(data)
      )[0]
    )
  }

  function checkForFullyComplete () {
    if (
      thisSetProgress.length ===
        props.route.params.thisSet.lessons.length - 1 &&
      !thisSetProgress.includes(getLessonInfo('index', activeLessonInModal.id))
    ) {
      // logCompleteStorySet(
      //   props.route.params.thisSet,
      //   props.activeGroup.language
      // )
      setShowSetCompleteModal(true)
    }
  }

  //- marks a lesson as complete from a swipe and closes the row
  function markLessonAsCompleteFromSwipe (data) {
    if (data.isActivated) {
      props.toggleComplete(
        props.activeGroup.name,
        props.route.params.thisSet,
        parseInt(data.key)
      )

      // check if we just fully completed the set
      checkForFullyComplete()
    }
  }

  //+ RENDER

  function renderLessonItem ({ item }) {
    return (
      <LessonItem
        thisLesson={item}
        onLessonSelect={() =>
          props.navigation.navigate('Play', {
            thisLesson: item,
            thisSet: props.route.params.thisSet,
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

  function renderLessonSwipeBackdrop (data, rowMap) {
    return (
      <LessonSwipeBackdrop
        isComplete={thisSetProgress.includes(
          getLessonInfo('index', data.item.id)
        )}
        toggleComplete={() => {
          props.toggleComplete(
            props.activeGroup.name,
            props.route.params.thisSet,
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
  }

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.studySetItemContainer,
          {
            height: itemHeights[props.font].SetItem
          }
        ]}
      >
        <SetItem thisSet={props.route.params.thisSet} mode='lessonlist' />
      </View>
      <SwipeListView
        data={props.route.params.thisSet.lessons}
        renderItem={renderLessonItem}
        ListFooterComponent={() => <View style={{ height: 30 }} />}
        keyExtractor={item => getLessonInfo('index', item.id).toString()}
        renderHiddenItem={renderLessonSwipeBackdrop}
        leftOpenValue={50}
        rightOpenValue={-50}
        //! these are different on platform because the activation is causing a
        //!   crash on android phones
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
        onLeftActionStatusChange={
          props.isRTL
            ? data => setShowShareModal(true)
            : data => {
                markLessonAsCompleteFromSwipe(data)
              }
        }
        onRightActionStatusChange={
          props.isRTL
            ? data => markLessonAsCompleteFromSwipe(data)
            : data => setShowShareModal(true)
        }
        swipeGestureBegan={data => onLessonSwipeBegin(data)}
      />

      {/* MODALS */}
      <OptionsModal
        isVisible={showDownloadLessonModal}
        hideModal={hideModals}
        closeText={props.translations.general.cancel}
      >
        <OptionsModalButton
          title={props.translations.lessons.popups.download_lesson_button_label}
          onPress={downloadLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showDeleteLessonModal}
        hideModal={hideModals}
        closeText={props.translations.general.cancel}
      >
        <OptionsModalButton
          title={props.translations.lessons.popups.delete_lesson_button_label}
          onPress={deleteLessonFromModal}
        />
      </OptionsModal>
      <ShareModal
        isVisible={showShareModal}
        hideModal={hideModals}
        closeText={props.translations.general.close}
        lesson={activeLessonInModal}
        lessonType={getLessonType(activeLessonInModal)}
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    downloads: state.downloads,
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language)
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

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen)
