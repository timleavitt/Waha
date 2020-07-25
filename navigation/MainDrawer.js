import NetInfo from '@react-native-community/netinfo'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import React, { useEffect } from 'react'
import { Alert, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import WahaDrawer from '../components/WahaDrawer'
import { scaleMultiplier } from '../constants'
import { db, storeData } from '../redux/actions/databaseActions'
import {
  removeDownload,
  resumeDownload
} from '../redux/actions/downloadActions'
import { addSet } from '../redux/actions/groupsActions'
import { updateConnectionStatus } from '../redux/actions/networkActions'
import MainStack from './MainStack'
const Drawer = createDrawerNavigator()

//allows only accessing hamburger swipe from study set screen
function getGestureEnabled (route) {
  // Access the tab navigator's state using `route.state`
  const routeName = route.state
    ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
    : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'SetsRoot'
  if (routeName === 'SetsRoot') return true
  else return false
}

function MainDrawer (props) {
  useEffect(() => {
    // add listener for connection status and update it accordingly
    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      props.updateConnectionStatus(state.isConnected)
    })

    // add listener for receiving updates in firebase
    db.collection('languages')
      .doc(props.activeGroup.language)
      .onSnapshot(function (doc) {
        function downloadSomething (source, fileName) {
          var downloadResumable = FileSystem.createDownloadResumable(
            doc.data().sources[source],
            FileSystem.documentDirectory +
              props.activeGroup.language +
              '-' +
              fileName,
            {}
          )
          downloadResumable.downloadAsync().catch(error => {
            throw error
          })
        }
        // if a new c-t chapter 1 is available
        if (
          doc.data().sources['c-t-fellowship'] !==
          props.activeDatabase.sources['c-t-fellowship']
        ) {
          Alert.alert(
            props.translations.general.popups.new_chapter_downloading_title,
            props.translations.general.popups.new_chapter_downloading_message,
            [{ text: props.translations.general.ok, onPress: () => {} }]
          )
          downloadSomething('c-t-chapter1', 'c-t-chapter1.mp3')
        }

        // if a new c-t chapter 3 is available
        if (
          doc.data().sources['c-t-application'] !==
          props.activeDatabase.sources['c-t-application']
        ) {
          // ALERT
          Alert.alert(
            props.translations.general.popups.new_chapter_downloading_title,
            props.translations.general.popups.new_chapter_downloading_message,
            [{ text: props.translations.general.ok, onPress: () => {} }]
          )
          downloadSomething('c-t-chapter3', 'c-t-chapter3.mp3')
        }

        // if a new mt chapter 1 is available
        if (
          doc.data().sources['mt-fellowship'] !==
          props.activeDatabase.sources['mt-fellowship']
        ) {
          Alert.alert(
            props.translations.general.popups.new_chapter_downloading_title,
            props.translations.general.popups.new_chapter_downloading_message,
            [{ text: props.translations.general.ok, onPress: () => {} }]
          )
          downloadSomething('mt-chapter1', 'mt-chapter1.mp3')
        }

        // if a new mt chapter 3 is available
        if (
          doc.data().sources['mt-application'] !==
          props.activeDatabase.sources['mt-application']
        ) {
          Alert.alert(
            props.translations.general.popups.new_chapter_downloading_title,
            props.translations.general.popups.new_chapter_downloading_message,
            [{ text: props.translations.general.ok, onPress: () => {} }]
          )
          downloadSomething('mt-chapter3', 'mt-chapter3.mp3')
        }

        // store data
        props.storeData(doc.data(), props.activeGroup.language)

        // if
        // 1. all core story sets are completed
        // 2. a new core story set has been addded

        // 1. add it automatically to added sets for this group
        // 2. make it display the 'new' icon somehow

        // if
        // 1. mobilization tools is unlocked for this group
        // 2. a new mobilization tools set is added
        // if (props.activeGroup.showToolkit && )

        // 1. add it automatically to added sets for htis group
        // 2. make it dispaly the 'new' icon somehow
      })

    return function cleanup () {
      netInfoUnsubscribe()
    }
  }, [])

  useEffect(() => {
    // add any new mt sets to active group
    props.activeDatabase.sets
      .filter(set => set.category === 'mt')
      .forEach(set => {
        if (
          !props.activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
        )
          props.addSet(props.activeGroup.name, set.id)
      })
  }, [props.activeDatabase, props.activeGroup])

  // if we connect to internet, check to see if we have any paused downloads
  useEffect(() => {
    if (props.isConnected) {
      checkPausedDownloads()
    }
  }, [props.isConnected])

  //// FUNCTIONS
  async function checkPausedDownloads () {
    props.activeDatabase.lessons.forEach(async lesson => {
      await AsyncStorage.getItem(lesson.id)
        .then(async value => {
          if (value) {
            // error checking for if the async storage object was not deleted before
            // if we have a resumable download stored but the lesson is already downloaded,
            // we don't want to resume it
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
              contents => {
                if (!contents.includes(lesson.id + '.mp3')) {
                  props.resumeDownload(lesson.id, value)
                } else {
                  AsyncStorage.removeItem(lesson.id)
                }
              }
            )
          }
        })
        .catch(err => props.removeDownload(lesson.id))
      await AsyncStorage.getItem(lesson.id + 'v')
        .then(async value => {
          if (value) {
            // error checking for if the async storage object was not deleted before
            // if we have a resumable download stored but the lesson is already downloaded,
            // we don't want to resume it
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
              contents => {
                if (!contents.includes(lesson.id + 'v.mp3')) {
                  props.resumeDownload(lesson.id + 'v', value)
                } else {
                  AsyncStorage.removeItem(lesson.id + 'v')
                }
              }
            )
          }
        })
        .catch(err => props.removeDownload(lesson.id + 'v'))
    })
  }

  var direction = props.isRTL ? 'right' : 'left'
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerPosition={direction}
        drawerType='back'
        drawerContent={props => <WahaDrawer {...props} />}
        drawerStyle={{
          width: '80%'
        }}
        edgeWidth={75 * scaleMultiplier}
      >
        <Drawer.Screen
          options={({ route }) => ({
            gestureEnabled: getGestureEnabled(route)
          })}
          name='MainStack'
          component={MainStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    isConnected: state.network.isConnected,
    translations: state.database[activeGroup.language].translations,
    activeGroup: activeGroup,
    toolkitEnabled: state.toolkitEnabled,
    groups: state.groups
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateConnectionStatus: status => {
      dispatch(updateConnectionStatus(status))
    },
    resumeDownload: (lessonID, downloadSnapshotJSON) => {
      dispatch(resumeDownload(lessonID, downloadSnapshotJSON))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    },
    storeData: (data, language) => {
      dispatch(storeData(data, language))
    },
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainDrawer)
