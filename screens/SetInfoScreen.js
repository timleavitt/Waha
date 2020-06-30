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
function SetInfoScreen (props) {
  //// STATE

  // read downloaded files for testing purposes
  FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
    console.log(contents)
  })

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

  // whenever progress or bookmarks update, update the progress and bookmarks for this set
  useEffect(() => {}, [])

  //// FUNCTIONS

  return (
    <View style={styles.screen}>
      <View style={styles.studySetItemContainer}>
        <SetItem thisSet={props.thisSet} mode='lessonlist' />
      </View>
      <FlatList
        data={props.activeDatabase.lessons.filter(
          lesson => props.thisSet.id === lesson.setid
        )}
        renderItem={({ item }) => <View></View>}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(SetInfoScreen)
