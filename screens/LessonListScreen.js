import React, { useState, useEffect } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  Button,
  Text,
  Share,
  Platform,
  Dimensions,
  SafeAreaView
} from 'react-native'
import LessonItem from '../components/LessonItem'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import SetItem from '../components/SetItem'
import OptionsModal from '../components/OptionsModal'
import ModalButton from '../components/ModalButton'
import NetInfo from '@react-native-community/netinfo'
import { scaleMultiplier } from '../constants'
import BackButton from '../components/BackButton'
import {
  downloadLesson,
  removeDownload,
  downloadVideo
} from '../redux/actions/downloadActions'
import { toggleComplete } from '../redux/actions/groupsActions'
import { connect } from 'react-redux'
import { SwipeListView } from 'react-native-swipe-list-view'
import LessonSwipeBackdrop from '../components/LessonSwipeBackdrop'
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
    return lesson.questionsType
      ? lesson.audioSource
        ? lesson.videoSource
          ? 'qav'
          : 'qa'
        : lesson.videoSource
        ? 'qv'
        : 'q'
      : 'v'
  }

  // NOTE: for next 4 functions, what is returned depends on the type of the
  //  lesson. qa checks only audio file, qav checks both audio and video files,
  //  and qv and v check only video files.

  // determines if a lesson is downloaded based on its type
  function getIsLessonDownloaded (lesson) {
    switch (getLessonType(lesson)) {
      case 'qa':
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
  function share (type) {
    switch (type) {
      // share the link to Waha itself
      case 'app':
        Share.share({
          message:
            Platform.OS === 'ios'
              ? 'www.appstorelink.com'
              : 'www.playstorelink.com'
        })
        break
      // share the passage text for this lesson
      case 'text':
        Share.share({
          message:
            activeLessonInModal.scriptureHeader +
            ': ' +
            activeLessonInModal.scriptureText
        })
        break
      // share the audio file for this lesson
      case 'audio':
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
        ).then(({ exists }) => {
          exists
            ? Sharing.shareAsync(
                FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
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
      // share the video link for this lesson
      case 'video':
        Share.share({
          message: activeLessonInModal.videoSource
        })
        break
    }
  }

  //// RENDER

  function renderLessonItem (lessonList) {
    return (
      <LessonItem
        thisLesson={lessonList.item}
        onLessonSelect={() =>
          props.navigation.navigate('Play', {
            thisLesson: lessonList.item,
            thisSet: props.route.params.thisSet,
            thisSetProgress: thisSetProgress,
            isDownloaded: getIsLessonDownloaded(lessonList.item),
            isDownloading: getIsLessonDownloading(lessonList.item),
            lessonType: getLessonType(lessonList.item)
          })
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
        closeText={
          props.activeDatabase.translations.modals.downloadLessonOptions.cancel
        }
      >
        <ModalButton
          isLast={true}
          title={
            props.activeDatabase.translations.modals.downloadLessonOptions
              .downloadLesson
          }
          onPress={downloadLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showDeleteLessonModal}
        hideModal={hideModals}
        closeText={
          props.activeDatabase.translations.modals.deleteLessonOptions.cancel
        }
      >
        <ModalButton
          isLast={true}
          title={
            props.activeDatabase.translations.modals.deleteLessonOptions
              .deleteLesson
          }
          onPress={deleteLessonFromModal}
        />
      </OptionsModal>
      <OptionsModal
        isVisible={showShareModal}
        hideModal={hideModals}
        closeText={props.activeDatabase.translations.modals.shareOptions.close}
      >
        <ModalButton
          title={props.activeDatabase.translations.modals.shareOptions.shareApp}
          onPress={() => share('app')}
        />
        {getLessonType(activeLessonInModal) !== 'v' ? (
          <ModalButton
            title={
              props.activeDatabase.translations.modals.shareOptions
                .sharePassageText
            }
            onPress={() => share('text')}
          />
        ) : null}
        {props.route.params.lessonType === 'qa' ||
        props.route.params.lessonType === 'qav' ||
        !props.downloads[activeLessonInModal.id] ? (
          <ModalButton
            title={
              props.activeDatabase.translations.modals.shareOptions
                .sharePassageAudio
            }
            onPress={() => share('audio')}
          />
        ) : null}
        {getLessonType(activeLessonInModal) !== 'qa' &&
        getLessonType(activeLessonInModal) !== 'q' ? (
          <ModalButton
            title={
              props.activeDatabase.translations.modals.shareOptions
                .shareVideoLink
            }
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
    flexDirection: 'column',
    backgroundColor: '#F7F9FA'
  },
  studySetItemContainer: {
    width: '100%',
    height: 100 * scaleMultiplier
  },
  headerImage: {
    resizeMode: 'contain',
    width: 120,
    height: 40,
    alignSelf: 'center'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    downloads: state.downloads,
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
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
