import firebase from 'firebase'
import '@firebase/firestore'
import * as FileSystem from 'expo-file-system'
import { createGroup, changeActiveGroup } from '../actions/groupsActions'
import i18n from 'i18n-js'
import { getStateFromPath } from '@react-navigation/native'

export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const SET_FETCH_ERROR = 'SET_FETCH_ERROR'
export const STORE_DATA = 'STORE_DATA'
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'
export const SET_IS_FETCHING = 'SET_IS_FETCHING'
export const SET_FINISHED_ONBOARDING = 'SET_FINISHED_ONBOARDING'
export const SET_FINISHED_INITIAL_FETCH = 'SET_FINISHED_INITIAL_FETCH'
export const DELETE_LANGUAGE = 'DELETE_LANGUAGE'
export const ADD_SCRIPT = 'ADD_SCRIPT'
export const REMOVE_SCRIPT = 'REMOVE_SCRIPT'
export const SET_CURRENT_FETCH_PROGRESS = 'SET_CURRENT_FETCH_PROGRESS'

// firebase initializing
const config = {
  apiKey: '***REMOVED***',
  authDomain: 'waha-app-db.firebaseapp.com',
  databaseURL: 'https://waha-app-db.firebaseio.com',
  projectId: 'waha-app-db',
  storageBucket: 'waha-app-db.appspot.com',
  messagingSenderId: '831723165603',
  appId: '1:831723165603:web:21a474da50b2d0511bec16',
  measurementId: 'G-6SYY2T8DX1'
}
firebase.initializeApp(config)
export const db = firebase.firestore()

const groupNames = {
  en: 'Group 1',
  te: 'facilisis 1'
}

export function storeData (data, language) {
  return {
    type: STORE_DATA,
    data,
    language
  }
}

export function setIsFetching (isFetching) {
  return {
    type: SET_IS_FETCHING,
    isFetching
  }
}

export function setFinishedOnboarding (haveFinishedOnboarding) {
  return {
    type: SET_FINISHED_ONBOARDING,
    haveFinishedOnboarding
  }
}

export function setFinishedInitialFetch (haveFinishedInitialFetch) {
  return {
    type: SET_FINISHED_INITIAL_FETCH,
    haveFinishedInitialFetch
  }
}

export function setCurrentFetchProgress (progress) {
  return {
    type: SET_CURRENT_FETCH_PROGRESS,
    progress
  }
}

export function setFetchError (status, language) {
  return {
    type: SET_FETCH_ERROR,
    status,
    language
  }
}

// thunk function for adding a language
// data to add during fetch:
// 1. firebase data (translations, sets, lessons, urls for downloads, colors)
// 2. lesson 1 chapter 1 mp3
// 3. lesson 1 chapter 3 mp3
// 4. generic chapter 1 mp3
// 5. generic chapter 3 mp3
// 6. header image

export function addLanguage (language) {
  return (dispatch, getState) => {
    // set the i18n language for loading screen translations
    i18n.locale = language

    // set isFetching to true to signal that we're doing stuff and don't want to load the rest of the app
    dispatch(setIsFetching(true))

    /// / FIREBASE FETCH

    // get language object from database and throw it in redux
    db.collection('languages')
      .doc(language)
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch(storeData(doc.data(), language))
          console.log(doc.data())

          var totalProgressObject = {}
          var isFirstCallBackObject = {}
          var totalToDownload = 0
          var counter = 0

          // callback function
          function callback ({ totalBytesWritten, totalBytesExpectedToWrite }) {
            var allGood = true
            // every first callback, update the total bytes to download across all downloads
            if (!isFirstCallBackObject[totalBytesExpectedToWrite]) {
              isFirstCallBackObject[totalBytesExpectedToWrite] = true
              totalToDownload += totalBytesExpectedToWrite
              for (value in isFirstCallBackObject) {
                if (!isFirstCallBackObject[value]) {
                  allGood = false
                }
              }
            }

            if (allGood) {
              // update fetch progress every 100 callbacks (for performance) or if we're just about done
              if (
                counter % 100 == 0 ||
                totalBytesWritten / totalBytesExpectedToWrite > 0.99
              ) {
                // update progress specific to this download
                totalProgressObject[
                  totalBytesExpectedToWrite
                ] = totalBytesWritten

                // re add up the total progress each time
                var totalProgress = 0
                for (download in totalProgressObject) {
                  totalProgress += totalProgressObject[download]
                }
                if (totalToDownload != 0) {
                  dispatch(
                    setCurrentFetchProgress(totalProgress / totalToDownload)
                  )
                }
              }
              counter += 1
            }
          }

          // downloads a file from url into local storage
          function downloadSomething (source, fileName) {
            var downloadResumable = FileSystem.createDownloadResumable(
              doc.data().sources[source],
              FileSystem.documentDirectory + language + '-' + fileName,
              {},
              callback
            )
            return downloadResumable.downloadAsync().catch(error => {
              throw error
            })
          }

          // downloads everything we need
          function downloadEverything () {
            return Promise.all([
              downloadSomething('header', 'header.png'),
              downloadSomething('regular-chapter1', 'regular-chapter1.mp3'),
              downloadSomething('regular-chapter3', 'regular-chapter3.mp3'),
              downloadSomething('first-chapter1', 'first-chapter1.mp3'),
              downloadSomething('first-chapter3', 'first-chapter3.mp3')
            ])
          }

          // actually download everything, then create a group, set the active group to the
          // new group, and finally set isfetching to false so we can go into the app
          downloadEverything()
            .then(() => {
              dispatch(createGroup(groupNames[language], language, ''))
              dispatch(changeActiveGroup(groupNames[language]))
              dispatch(setIsFetching(false))
              dispatch(setFinishedInitialFetch(true))
              dispatch(setCurrentFetchProgress(0))
            })
            .catch(() => {
              dispatch(setFetchError(true, language))
            })
        } else {
          dispatch(setFetchError(true, language))
        }
      })
      .catch(() => dispatch(setFetchError(true, language)))
  }
}

export function deleteLanguage (language) {
  return {
    type: DELETE_LANGUAGE,
    language
  }
}
