import React, { useState, useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { AsyncStorage } from 'react-native'
import { scaleMultiplier } from '../constants'
import WahaDrawer from '../components/WahaDrawer'
import { updateConnectionStatus } from '../redux/actions/networkActions'
import MainStack from './MainStack'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { connect } from 'react-redux'
import {
  resumeDownload,
  removeDownload
} from '../redux/actions/downloadActions'
import * as FileSystem from 'expo-file-system'
import { db, storeData } from '../redux/actions/databaseActions'

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
  function downloadSomething (source, fileName) {
    var downloadResumable = FileSystem.createDownloadResumable(
      doc.data().sources[source],
      FileSystem.documentDirectory + activeGroup.language + '-' + fileName,
      {},
      callback
    )
    return downloadResumable.downloadAsync().catch(error => {
      throw error
    })
  }

  useEffect(() => {
    // add listener for connection status and update it accordingly
    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      props.updateConnectionStatus(state.isConnected)
    })

    // add listener for receiving updates in firebase
    db.collection('languages')
      .doc(props.activeGroup.language)
      .onSnapshot(function (doc) {

        // if a new c-t chapter 1 is available
        if (
          doc.data().sources['c-t-chapter1'] !==
          props.activeDatabase.sources['c-t-chapter1']
        ) {
          // ALERT
          // downloadSomething('c-t-chapter1', 'c-t-chapter1.mp3')
        }

        // if a new c-t chapter 3 is available
        if (
          doc.data().sources['c-t-chapter3'] !==
          props.activeDatabase.sources['c-t-chapter3']
        ) {
          // ALERT
          // downloadSomething('c-t-chapter3', 'c-t-chapter3.mp3')
        }

        // if a new mt chapter 1 is available
        if (
          doc.data().sources['mt-chapter1'] !==
          props.activeDatabase.sources['mt-chapter1']
        ) {
          // ALERT
          // downloadSomething('mt-chapter1', 'mt-chapter1.mp3')
        }

        // if a new mt chapter 3 is available
        if (
          doc.data().sources['mt-chapter3'] !==
          props.activeDatabase.sources['mt-chapter3']
        ) {
          // ALERT
          // downloadSomething('mt-chapter3', 'mt-chapter3.mp3')
        }

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

        props.storeData(doc.data(), props.activeGroup.language)
      })

    return function cleanup () {
      netInfoUnsubscribe()
    }
  }, [])

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
        edgeWidth={300 * scaleMultiplier}
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
    activeGroup: activeGroup,
    toolkitEnabled: state.toolkitEnabled
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainDrawer)
