import NetInfo from '@react-native-community/netinfo'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer
} from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import firebase from 'firebase'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import WahaDrawer from '../components/WahaDrawer'
import { scaleMultiplier } from '../constants'
import db from '../firebase/db'
import { appVersion } from '../modeSwitch'
import {
  addLanguageCoreFileToUpdate,
  storeLanguageData,
  storeLanguageSets
} from '../redux/actions/databaseActions'
import { changeActiveGroup, deleteGroup } from '../redux/actions/groupsActions'
import { updateConnectionStatus } from '../redux/actions/networkActions'
import MainStack from './MainStack'

// Create the drawer navigator.
const Drawer = createDrawerNavigator()

/**
 * This component renders a drawer navigator that contains Waha's navigation drawer. It's placed around the MainStack navigator. It also contains a ton of logic related to things that happen globally in the background, such as updating the connection status and retrieving updates from Firestore.
 */
function MainDrawer ({
  // Props passed from redux.
  isRTL,
  activeDatabase,
  isConnected,
  translations,
  activeGroup,
  security,
  updateConnectionStatus,
  storeLanguageData
}) {
  /**
   * Determines whether a screen should be able to access the navigation drawer via gesture. Should only return true on the StorySetTabs navigator because this is the only spot we should be able to swipe to open the drawer.
   * @param {string} route - The route passed from the navigation component.
   * @return {boolean} - Whether gestures should be enabled or not.
   */
  function getGestureEnabled (route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'StorySetTabs'
    if (routeName === 'StorySetTabs') return true
    else return false
  }

  useEffect(() => {
    // Add a listener for connection status and update the redux state accordingly.
    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      updateConnectionStatus(state.isConnected)
    })

    return function cleanup () {
      // Cancel our connection status listener.
      netInfoUnsubscribe()
    }
  }, [])

  // Check for database updates. This function gets triggered whenever a user downloads a new lesson and whenever the active group changes.
  useEffect(() => {
    // Whether the app should write the new Firestore changes to redux or not. The only reason that it wouldn't is if the app version is behind the database version.
    var shouldWrite = false

    // Fetch data from the languages Firestore collection.
    db.collection('languages')
      .doc(props.activeGroup.language)
      .get()
      .then(async doc => {
        // If we get some legitimate data back...
        if (doc.exists && doc.data()) {
          // If the Waha version is greater than or equal to the app version in the database...
          if (doc.data().appVersion <= appVersion) {
            // Set shouldWrite to true. This way, when we fetch data for the Story Sets for this language, we know we're safe to write to redux.
            shouldWrite = true

            // Store our language info in redux.
            props.storeLanguageData(doc.data(), props.activeGroup.language)

            // Check if we need replacements for already downloaded core files by comparing the created times of downloaded core files in redux with the created times of the current Firebase storage core files. If the created times don't match, it means a core file has been updated and we need to queue the new core file to download.
            doc.data().files.forEach(fileName => {
              // Set the file extension for the core file we're currently checking.
              var fileExtension = fileName.includes('header') ? 'png' : 'mp3'

              // PRODUCTION FIREBASE URL
              // Always have this uncommented when it's time to build a new version.
              var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${props.activeGroup.language}%2Fother%2F${fileName}.${fileExtension}?alt=media`

              // TEST FIREBASE URL
              // Use this for test Firebase storage.
              // var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-test-db.appspot.com/o/${props.activeGroup.language}%2Fother%2F${fileName}.${fileExtension}?alt=media`

              // Check the timeCreated of this core file in Firebase storage.
              firebase
                .storage()
                .refFromURL(url)
                .getMetadata()
                .then(({ timeCreated }) => {
                  // If the created time of this core file has already been stored previously AND the created time of the core file in Firebase is different from the created time that's stored in redux...
                  if (
                    props.languageCoreFilesCreatedTimes[
                      `${props.activeGroup.language}-${fileName.slice(0, -3)}`
                    ] &&
                    timeCreated !==
                      props.languageCoreFilesCreatedTimes[
                        `${props.activeGroup.language}-${fileName.slice(0, -3)}`
                      ]
                  ) {
                    // Add the core file to our redux array of files to update, assuming that it hasn't already been added.
                    if (
                      !props.languageCoreFilesToUpdate.includes(
                        `${props.activeGroup.language}-${fileName.slice(0, -3)}`
                      )
                    ) {
                      // console.log(`${fileName} needs to be replaced.\n`)
                      props.addLanguageCoreFileToUpdate(
                        `${props.activeGroup.language}-${fileName.slice(0, -3)}`
                      )
                    }
                  }
                })
            })

            // Read the contents of Waha's file directory to check which core files are downloaded.
            FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
              contents => {
                // For each core file listed in Firestore, verify that it's already downloaded.
                doc.data().files.forEach(fileName => {
                  var fileExtension = fileName.includes('header')
                    ? 'png'
                    : 'mp3'
                  // If it isn't downloaded...
                  if (
                    !contents.includes(
                      `${props.activeGroup.language}-${fileName.slice(
                        0,
                        -3
                      )}.${fileExtension}`
                    )
                  ) {
                    // Add the core file to our redux array of files to download, assuming that it hasn't already been added.
                    if (
                      !props.languageCoreFilesToUpdate.includes(
                        `${props.activeGroup.language}-${fileName.slice(0, -3)}`
                      )
                    ) {
                      console.log(`${fileName} needs to be added.\n`)
                      props.addLanguageCoreFileToUpdate(
                        `${props.activeGroup.language}-${fileName.slice(0, -3)}`
                      )
                    }
                  }
                })
              }
            )
          }
        }
      })
      .catch(error => {
        console.log('Error retrieving data from Firestore.')
      })

    // Fetch data from the Story Sets Firestore collection. Get all Story Sets of the current language.
    db.collection('sets')
      .where('languageID', '==', activeGroup.language)
      .get()
      .then(querySnapshot => {
        // If the data is valid and the current Waha version is greater than or equal to the version in Firebase (we set the shouldWrite variable earlier)...
        if (!querySnapshot.empty) {
          if (shouldWrite) {
            // Add each Story Set to a temporary set array...
            var sets = []
            querySnapshot.forEach(doc => {
              sets.push({
                id: doc.id,
                ...doc.data()
              })
            })
            /// ...and write all of them to redux.
            storeLanguageSets(sets, props.activeGroup.language)
          }
        }
      })
      .catch(error => {
        console.log('Error retrieving data from Firestore.')
      })
  }, [Object.keys(props.downloads).length, props.activeGroup])

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerPosition={isRTL ? 'right' : 'left'}
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
    database: state.database,
    activeDatabase: state.database[activeGroup.language],
    isConnected: state.network.isConnected,
    translations: state.database[activeGroup.language].translations,
    activeGroup: activeGroup,
    security: state.security,
    languageCoreFilesCreatedTimes: state.database.languageCoreFilesCreatedTimes,
    languageCoreFilesToUpdate: state.database.languageCoreFilesToUpdate,
    mtUnlockAttempts: state.mtUnlockAttempts,
    downloads: state.downloads,
    groups: state.groups
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateConnectionStatus: status => {
      dispatch(updateConnectionStatus(status))
    },
    storeLanguageData: (data, language) => {
      dispatch(storeLanguageData(data, language))
    },
    storeLanguageSets: (sets, language) => {
      dispatch(storeLanguageSets(sets, language))
    },
    addLanguageCoreFileToUpdate: fileName => {
      dispatch(addLanguageCoreFileToUpdate(fileName))
    },
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    },
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainDrawer)
