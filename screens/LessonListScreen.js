import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import HomeworkModal from '../components/HomeworkModal'
import LessonItem from '../components/LessonItem'
import LessonSwipeBackdrop from '../components/LessonSwipeBackdrop'
import ModalButton from '../components/ModalButton'
import OptionsModal from '../components/OptionsModal'
import SetItem from '../components/SetItem'
import ShareModal from '../components/ShareModal'
import { colors } from '../constants'
import {
  downloadLesson,
  downloadVideo,
  removeDownload
} from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'

function LessonListScreen (props) {
  //// STATE

  // read downloaded files for testing purposes
  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
  //   console.log(contents)
  // })

  // keeps track of which lessons are downloaded
  const [downloadsInFileSystem, setDownloadsInFileSystem] = useState({})

  // keeps track of the lesson to download/delete/toggle complete when modals are up
  const [activeLessonInModal, setActiveLessonInModal] = useState({})

  // modal states
  const [showDownloadLessonModal, setShowDownloadLessonModal] = useState(false)
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false)
  const [showLessonOptionsModal, setShowLessonOptionsModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showHomeworkModal, setShowHomeworkModal] = useState(false)

  // progress and bookmark for the set we're looking at
  const [thisSetProgress, setThisSetProgress] = useState([])
  const [thisSetBookmark, setThisSetBookmark] = useState(1)

  //// NAV OPTIONS

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

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  // checks which lessons and lesson videos are downloaded and stores in state
  useEffect(() => {
    var whichLessonsDownloaded = {}
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        props.activeDatabase.lessons.forEach(lesson => {
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

  // whenever progress or bookmarks update, update the progress and bookmarks for this set
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

  //// FUNCTIONS

  // gets the type of a lesson in string form
  // note: not stored in db for ssot purposes
  function getLessonType (lesson) {
    // q = has questions, a = has audio, v = has video
    // options not allowed: av, a
    var lessonType = ''
    lessonType += lesson.fellowshipType ? 'q' : ''
    lessonType += lesson.audioSource ? 'a' : ''
    lessonType += lesson.videoSource ? 'v' : ''
    if (lessonType === '') lessonType = 'c'

    return lessonType
  }

  // NOTE: for next 4 functions, what is returned depends on the type of the
  //  lesson. qa checks only audio file, qav checks both audio and video files,
  //  and qv and v check only video files.

  // determines if a lesson is downloaded based on its type
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

  // determines if a lesson is downloading based on its type
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

  // downloads a lesson's chapter 2 mp3 via modal press based on its type
  function downloadLessonFromModal () {
    switch (getLessonType(activeLessonInModal)) {
      case 'qa':
      case 'a':
        props.downloadLesson(
          activeLessonInModal.id,
          activeLessonInModal.audioSource
        )
        break
      case 'qav':
        props.downloadLesson(
          activeLessonInModal.id,
          activeLessonInModal.audioSource
        )
        props.downloadVideo(
          activeLessonInModal.id,
          activeLessonInModal.videoSource
        )
        break
      case 'qv':
      case 'v':
        props.downloadVideo(
          activeLessonInModal.id,
          activeLessonInModal.videoSource
        )
        break
    }
    hideModals()
  }

  // deletes a lesson's chapter 2 mp3 via modal press based on its type
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

  // NOT USED: marks every lesson in current set as complete up until the
  //  selected lesson via modal press
  // function markUpToThisPointAsCompleteFromModal () {
  //   for (var i = 1; i <= activeLessonInModal.index; i++) {
  //     if (!thisSetProgress.includes(i)) {
  //       props.toggleComplete(
  //         props.activeGroup.name,
  //         props.route.params.thisSet,
  //         i
  //       )
  //     }
  //   }
  //   hideModals()
  // }

  // hides all the modals
  function hideModals () {
    setShowDownloadLessonModal(false)
    setShowDeleteLessonModal(false)
    setShowShareModal(false)
  }

  // opens the share sheet to share something
  // function share (type) {
  //   switch (type) {
  //     // share the link to Waha itself
  //     case 'app':
  //       Share.share({
  //         message:
  //           props.route.params.thisSet.category === 'mt'
  //             ? Platform.OS === 'ios'
  //               ? 'www.appstorelink.com' +
  //                 ' ' +
  //                 props.translations.general.share_toolkit_unlock_code
  //               : 'www.playstorelink.com' +
  //                 ' ' +
  //                 props.translations.general.share_toolkit_unlock_code
  //             : Platform.OS === 'ios'
  //             ? 'www.appstorelink.com'
  //             : 'www.playstorelink.com'
  //       })
  //       break
  //     // share the passage text for this lesson
  //     case 'text':
  //       var scriptureString = ''
  //       activeLessonInModal.scripture.forEach((scripturePiece, index) => {
  //         scriptureString += scripturePiece.header + '\n' + scripturePiece.text
  //         if (index !== activeLessonInModal.scripture.length - 1)
  //           scriptureString += '\n'
  //       })
  //       Share.share({
  //         message: scriptureString
  //       })
  //       break
  //     // share the audio file for this lesson
  //     case 'audio':
  //       FileSystem.getInfoAsync(
  //         FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
  //       ).then(({ exists }) => {
  //         exists
  //           ? Sharing.shareAsync(
  //               FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
  //             )
  //           : Alert.alert(
  //               props.translations.general.popups.lessons
  //                 .share_undownloaded_lesson_title,
  //               props.translations.general.popups.lessons
  //                 .share_undownloaded_lesson_message,
  //               [
  //                 {
  //                   text: props.translations.general.ok,
  //                   onPress: () => {}
  //                 }
  //               ]
  //             )
  //       })
  //       break
  //     // share the video link for this lesson
  //     case 'video':
  //       Share.share({
  //         message: activeLessonInModal.videoSource
  //       })
  //       break
  //   }
  // }

  //// RENDER

  function renderLessonItem (lessonList) {
    return (
      <LessonItem
        thisLesson={lessonList.item}
        onLessonSelect={
          // go to play screen unless we have a checklist lesson
          getLessonType(lessonList.item) !== 'c'
            ? () =>
                props.navigation.navigate('Play', {
                  thisLesson: lessonList.item,
                  thisSet: props.route.params.thisSet,
                  thisSetProgress: thisSetProgress,
                  isDownloaded: getIsLessonDownloaded(lessonList.item),
                  isDownloading: getIsLessonDownloading(lessonList.item),
                  lessonType: getLessonType(lessonList.item)
                })
            : () => {
                setActiveLessonInModal(lessonList.item)
                setShowHomeworkModal(true)
              }
        }
        isBookmark={lessonList.item.index === thisSetBookmark}
        isDownloaded={getIsLessonDownloaded(lessonList.item)}
        isDownloading={getIsLessonDownloading(lessonList.item)}
        lessonType={getLessonType(lessonList.item)}
        isComplete={thisSetProgress.includes(lessonList.item.index)}
        setActiveLessonInModal={() => setActiveLessonInModal(lessonList.item)}
        setShowDownloadLessonModal={() => setShowDownloadLessonModal(true)}
        setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.studySetItemContainer}>
        <SetItem thisSet={props.route.params.thisSet} mode='lessonlist' />
      </View>
      <SwipeListView
        data={props.activeDatabase.lessons.filter(
          lesson => props.route.params.thisSet.id === lesson.setid
        )}
        renderItem={renderLessonItem}
        ListFooterComponent={() => <View style={{ height: 30 }} />}
        keyExtractor={item => item.index.toString()}
        disableLeftSwipe={
          getLessonType(activeLessonInModal) === 'c' ? true : false
        }
        disableRightSwipe={
          getLessonType(activeLessonInModal) === 'c' ? true : false
        }
        renderHiddenItem={(data, rowMap) => (
          <LessonSwipeBackdrop
            isComplete={thisSetProgress.includes(data.item.index)}
            toggleComplete={() => {
              props.toggleComplete(
                props.activeGroup.name,
                props.route.params.thisSet,
                data.item.index
              )
              rowMap[data.item.index].closeRow()
            }}
            showShareModal={() => {
              setShowShareModal(true)
              rowMap[data.item.index].closeRow()
            }}
          />
        )}
        leftOpenValue={50}
        rightOpenValue={-50}
        // these are different on platform because the activation is causing a
        //  crash on android phones
        leftActivationValue={
          Platform.OS === 'ios' ? Dimensions.get('screen').width / 2 - 10 : 1000
        }
        rightActivationValue={
          Platform.OS === 'ios'
            ? -Dimensions.get('screen').width / 2 + 10
            : -1000
        }
        // leftActivationValue={Dimensions.get('screen').width / 2 - 10}
        // rightActivationValue={-Dimensions.get('screen').width / 2 + 10}
        stopLeftSwipe={Dimensions.get('screen').width / 2}
        stopRightSwipe={-Dimensions.get('screen').width / 2}
        onLeftActionStatusChange={
          props.isRTL
            ? data => {
                setShowShareModal(true)
              }
            : data => {
                if (data.isActivated)
                  props.toggleComplete(
                    props.activeGroup.name,
                    props.route.params.thisSet,
                    parseInt(data.key)
                  )
              }
        }
        onRightActionStatusChange={
          props.isRTL
            ? data => {
                if (data.isActivated)
                  props.toggleComplete(
                    props.activeGroup.name,
                    props.route.params.thisSet,
                    parseInt(data.key)
                  )
              }
            : data => {
                setShowShareModal(true)
              }
        }
        swipeGestureBegan={data => {
          setActiveLessonInModal(
            props.activeDatabase.lessons.filter(
              lesson =>
                props.route.params.thisSet.id === lesson.setid &&
                lesson.index === parseInt(data)
            )[0]
          )
        }}
      />

      {/* MODALS */}
      <OptionsModal
        isVisible={showDownloadLessonModal}
        hideModal={hideModals}
        closeText={props.translations.general.cancel}
      >
        <ModalButton
          title={props.translations.lessons.popups.download_lesson_button_label}
          onPress={downloadLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showDeleteLessonModal}
        hideModal={hideModals}
        closeText={props.translations.general.cancel}
      >
        <ModalButton
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
      <HomeworkModal
        isVisible={showHomeworkModal}
        hideModal={() => setShowHomeworkModal(false)}
        homework={activeLessonInModal.homework}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.aquaHaze
  },
  studySetItemContainer: {
    width: '100%',
    aspectRatio: 4
  },
  headerImage: {
    resizeMode: 'contain',
    width: 150,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    downloads: state.downloads,
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    downloadLesson: (lessonID, source) => {
      dispatch(downloadLesson(lessonID, source))
    },
    downloadVideo: (lessonID, source) => {
      dispatch(downloadVideo(lessonID, source))
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
