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
  Platform
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
  removeDownload
} from '../redux/actions/downloadActions'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { connect } from 'react-redux'

function LessonListScreen (props) {
  //// STATE

  // console.log(props.activeGroup.addedSets)

  // keeps track of whether the user has internet connection

  // keeps track of which lessons are downloaded
  const [downloadsInFileSystem, setDownloadsInFileSystem] = useState([])

  // keeps track of the lesson to download/delete/toggle complete when modals are up
  const [activeLessonInModal, setActiveLessonInModal] = useState({})

  // modal states
  const [showSaveLessonModal, setShowSaveLessonModal] = useState(false)
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false)
  const [showLessonOptionsModal, setShowLessonOptionsModal] = useState(false)

  var thisSetProgress = props.activeGroup.addedSets.filter(
    set => set.id === props.route.params.thisSet.id
  )[0].progress

  var thisSetBookmark = props.activeGroup.addedSets.filter(
    set => set.id === props.route.params.thisSet.id
  )[0].bookmark

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  // checks which lessons are downloaded and stores in state
  useEffect(() => {
    var whichLessonsDownloaded = {}
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        props.activeDatabase.lessons.forEach(lesson => {
          if (contents.includes(lesson.id + '.mp3'))
            whichLessonsDownloaded[lesson.id] = true
          else whichLessonsDownloaded[lesson.id] = false
        })
        return whichLessonsDownloaded
      })
      .then(whichLessonsDownloaded => {
        setDownloadsInFileSystem(whichLessonsDownloaded)
      })
  }, [props.downloads])

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

  //// FUNCTIONS

  // downloads a lesson's chapter 2 mp3 via modal press
  function downloadLessonFromModal () {
    props.downloadLesson(
      activeLessonInModal.id,
      activeLessonInModal.audioSource
    )
    hideModals()
  }

  // deletes a lesson's chapter 2 mp3 via modal press
  function deleteLessonFromModal () {
    FileSystem.deleteAsync(
      FileSystem.documentDirectory + activeLessonInModal.id + '.mp3'
    )
    props.removeDownload(activeLessonInModal.id)
    hideModals()
  }

  // changes the complete status of a lesson via modal press
  // note: don't change it if they're marking it as what it's already marked as
  function toggleCompleteFromModal (statusToMark) {
    if (
      thisSetProgress.includes(activeLessonInModal.index) &&
      statusToMark === 'incomplete'
    ) {
      props.toggleComplete(
        props.activeGroup.name,
        props.route.params.thisSet,
        activeLessonInModal.index
      )
      // props.setBookmark(props.activeGroup.name)
    } else if (
      !thisSetProgress.includes(activeLessonInModal.index) &&
      statusToMark === 'complete'
    ) {
      props.toggleComplete(
        props.activeGroup.name,
        props.route.params.thisSet,
        activeLessonInModal.index
      )
      // props.setBookmark(props.activeGroup.name)
    }
    hideModals()
  }

  // marks every lesson in current set as complete up until the selected lesson via modal press
  function markUpToThisPointAsCompleteFromModal () {
    for (var i = 1; i <= activeLessonInModal.index; i++) {
      if (!thisSetProgress.includes(i)) {
        props.toggleComplete(
          props.activeGroup.name,
          props.route.params.thisSet,
          i
        )
      }
    }
    hideModals()
  }

  // hides all the modals
  function hideModals () {
    setShowSaveLessonModal(false)
    setShowDeleteLessonModal(false)
    setShowLessonOptionsModal(false)
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
            activeLessonInModal.scriptureHeader +
            ': ' +
            activeLessonInModal.scriptureText
        })
        break
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
            isDownloaded: downloadsInFileSystem[lessonList.item.id]
          })
        }
        isBookmark={lessonList.item.index === thisSetBookmark}
        isDownloaded={downloadsInFileSystem[lessonList.item.id]}
        isComplete={thisSetProgress.includes(lessonList.item.index)}
        setActiveLessonInModal={() => setActiveLessonInModal(lessonList.item)}
        setShowSaveLessonModal={() => setShowSaveLessonModal(true)}
        setShowDeleteLessonModal={() => setShowDeleteLessonModal(true)}
        setShowLessonOptionsModal={() => setShowLessonOptionsModal(true)}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.studySetItemContainer}>
        <SetItem thisSet={props.route.params.thisSet} mode='lessonlist' />
      </View>
      <FlatList
        data={props.activeDatabase.lessons.filter(
          lesson => props.route.params.thisSet.id === lesson.setid
        )}
        renderItem={renderLessonItem}
        keyExtractor={item => item.id}
      />

      {/* MODALS */}
      <OptionsModal
        isVisible={showSaveLessonModal}
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
        isVisible={showLessonOptionsModal}
        hideModal={hideModals}
        closeText={props.activeDatabase.translations.modals.lessonOptions.close}
      >
        <ModalButton
          title={
            props.activeDatabase.translations.modals.lessonOptions
              .markLessonComplete
          }
          onPress={() => toggleCompleteFromModal('complete')}
        />
        <ModalButton
          title={
            props.activeDatabase.translations.modals.lessonOptions
              .markLessonIncomplete
          }
          onPress={() => toggleCompleteFromModal('incomplete')}
        />
        <ModalButton
          title={
            props.activeDatabase.translations.modals.lessonOptions.shareApp
          }
          onPress={() => share('app')}
        />
        <ModalButton
          title={
            props.activeDatabase.translations.modals.lessonOptions
              .sharePassageText
          }
          onPress={() => share('text')}
        />
        <ModalButton
          title={
            props.activeDatabase.translations.modals.lessonOptions
              .sharePassageAudio
          }
          onPress={() => share('audio')}
        />
        <ModalButton
          isLast={true}
          title={
            props.activeDatabase.translations.modals.lessonOptions
              .markUpToPointAsComplete
          }
          onPress={markUpToThisPointAsCompleteFromModal}
        />
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
  },
  hiddenItemContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  // console.log(activeGroup)
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
    toggleComplete: (groupName, set, lessonIndex) => {
      dispatch(toggleComplete(groupName, set, lessonIndex))
    },
    setBookmark: groupName => {
      dispatch(setBookmark(groupName))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonListScreen)
