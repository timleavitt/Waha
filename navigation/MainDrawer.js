import NetInfo from '@react-native-community/netinfo'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import WahaDrawer from '../components/WahaDrawer'
import { scaleMultiplier } from '../constants'
import db from '../firebase/db'
import { storeData } from '../redux/actions/databaseActions'
import {
  removeDownload,
  resumeDownload
} from '../redux/actions/downloadActions'
import { addSet } from '../redux/actions/groupsActions'
import { updateConnectionStatus } from '../redux/actions/networkActions'
import MainStack from './MainStack'

const Drawer = createDrawerNavigator()

function MainDrawer (props) {
  //allows only accessing hamburger swipe from study set screen
  function getGestureEnabled (route) {
    // Access the tab navigator's state using `route.state`
    const routeName = route.state
      ? // Get the currently active route name in the tab navigator
        route.state.routes[route.state.index].name
      : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || props.security.securityEnabled
      ? 'Game'
      : 'SetTabs'
    if (routeName === 'SetTabs') return true
    else return false
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
        // download a file
        function downloadSomething (url, fileName) {
          var downloadResumable = FileSystem.createDownloadResumable(
            url,
            FileSystem.documentDirectory +
              props.activeGroup.language +
              '-' +
              fileName,
            {}
          )
          return downloadResumable.downloadAsync().catch(error => {
            throw error
          })
        }

        // check for new fellowship or application chapters or header image
        doc.data().files.forEach(fileName => {
          if (!props.activeDatabase.files.includes(fileName)) {
            // ALERT
            Alert.alert(
              props.translations.general.popups.new_chapter_downloading_title,
              props.translations.general.popups.new_chapter_downloading_message,
              [{ text: props.translations.general.ok, onPress: () => {} }]
            )
            if (fileName.includes('header'))
              return downloadSomething(
                `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${props.activeGroup.language}%2Fother%2F${fileName}.png?alt=media`,
                fileName.slice(0, -3) + '.png'
              )
            else
              return downloadSomething(
                `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${props.activeGroup.language}%2Fother%2F${fileName}.mp3?alt=media`,
                fileName.slice(0, -3) + '.mp3'
              )
          }
        })

        // store data
        props.storeData(
          { ...doc.data(), sets: props.activeDatabase.sets },
          props.activeGroup.language
        )

        //     // if
        //     // 1. all core story sets are completed
        //     // 2. a new core story set has been addded

        //     // 1. add it automatically to added sets for this group
        //     // 2. make it display the 'new' icon somehow

        //     // if
        //     // 1. mobilization tools is unlocked for this group
        //     // 2. a new mobilization tools set is added
        //     // if (props.activeGroup.showToolkit && )

        //     // 1. add it automatically to added sets for htis group
        //     // 2. make it dispaly the 'new' icon somehow
      })

    db.collection('sets')
      .where('languageID', '==', props.activeGroup.language)
      .onSnapshot(querySnapshot => {
        var sets = []
        querySnapshot.forEach(doc => {
          sets.push({
            id: doc.id,
            ...doc.data()
          })
        })
        props.storeData(
          { ...props.activeDatabase, sets: sets },
          props.activeGroup.language
        )
      })

    return function cleanup () {
      netInfoUnsubscribe()
    }
  }, [])

  // useEffect(() => {
  //   // add any new mt sets to active group
  //   props.activeDatabase.sets
  //     .filter(set => set.category === 'mt')
  //     .forEach(set => {
  //       if (
  //         !props.activeGroup.addedSets.some(addedSet => addedSet.id === set.id)
  //       )
  //         props.addSet(props.activeGroup.name, set.id)
  //     })
  // }, [props.activeDatabase, props.activeGroup])

  // if we connect to internet, check to see if we have any paused downloads
  // useEffect(() => {
  //   if (props.isConnected) {
  //     checkPausedDownloads()
  //   }
  // }, [props.isConnected])

  //+ FUNCTIONS
  // async function checkPausedDownloads () {
  //   var downloadedStuff = {}
  //   await FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
  //     contents => {
  //       downloadedStuff = contents
  //     }
  //   )
  //   // get paused downloads from asyncstorage
  //   await AsyncStorage.getItem('pausedDownloads')
  //     .then(async downloads => {
  //       // if anything is there
  //       if (downloads) {
  //         // convert string to object and iterate through
  //         Object.keys(JSON.parse(downloads)).forEach(lessonID => {
  //           if (!downloadedStuff.includes(downloads[lessonID] + '.mp3')) {
  //             props.resumeDownload(lessonID, value)
  //           } else {
  //             AsyncStorage.removeItem(lessonID)
  //           }
  //           if (!downloadedStuff.includes(lessonID + 'v.mp4')) {
  //             props.resumeDownload(lessonID + 'v', value)
  //           } else {
  //             AsyncStorage.removeItem(lessonID + 'v')
  //           }
  //         })
  //       }
  //     })
  //     .catch(err => {
  //       props.removeDownload(lessonID)
  //       props.removeDownload(lessonID + 'v')
  //     })
  // }

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
  // console.log(state.database[activeGroup.language])
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    isConnected: state.network.isConnected,
    translations: state.database[activeGroup.language].translations,
    activeGroup: activeGroup,
    toolkitEnabled: state.toolkitEnabled,
    groups: state.groups,
    security: state.security
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
