import '@firebase/firestore'
import * as FileSystem from 'expo-file-system'
import firebase from 'firebase'
import i18n from 'i18n-js'
import { changeActiveGroup, createGroup } from '../actions/groupsActions'
import { logInstallLanguage } from '../LogEventFunctions'

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
export const SET_TOTAL_TO_DOWNLOAD = 'SET_TOTAL_TO_DOWNLOAD'

// firebase initializing

// PRODUCTION
// const config = {
//   apiKey: '***REMOVED***',
//   authDomain: 'waha-app-db.firebaseapp.com',
//   databaseURL: 'https://waha-app-db.firebaseio.com',
//   projectId: 'waha-app-db',
//   storageBucket: 'waha-app-db.appspot.com',
//   messagingSenderId: '831723165603',
//   appId: '1:831723165603:web:21a474da50b2d0511bec16',
//   measurementId: 'G-6SYY2T8DX1'
// }

// TEST
const config = {
  apiKey: 'AIzaSyCh_ma-QDdHhaImEyedzAC1JJzy7YrwS8c',
  authDomain: 'waha-app-test-db.firebaseapp.com',
  databaseURL: 'https://waha-app-test-db.firebaseio.com',
  projectId: 'waha-app-test-db',
  storageBucket: 'waha-app-test-db.appspot.com',
  messagingSenderId: '346600922120',
  appId: '1:346600922120:web:a27e4abf05c9a7bf3845bd',
  measurementId: 'G-LSESVSE9SS'
}

firebase.initializeApp(config)
export const db = firebase.firestore()

const groupNames = {
  en: 'Group 1'
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

export function setTotalToDownload (total) {
  return {
    type: SET_TOTAL_TO_DOWNLOAD,
    total
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
  return async (dispatch, getState) => {
    // set isFetching to true to signal that we're doing stuff and don't want to load the rest of the app
    dispatch(setIsFetching(true))

    //+ FIREBASE FETCH

    var sets = []

    await db
      .collection('languages')
      .doc(language)
      .collection('sets')
      .get()
      .then(response => {
        response.forEach(set => {
          sets.push({
            id: set.id,
            ...set.data()
          })
        })
      })

    // get language object from database and throw it in redux
    await db
      .collection('languages')
      .doc(language)
      .get()
      .then(async doc => {
        if (doc.exists) {
          dispatch(
            storeData(
              {
                sets: sets,
                ...doc.data()
              },
              language
            )
          )
          dispatch(setTotalToDownload(doc.data().files.length))

          async function asyncForEach (array, callback) {
            for (let index = 0; index < array.length; index++) {
              await callback(array[index], index, array)
            }
          }

          var totalDownloaded = 0

          const downloadStuff = async () => {
            try {
              await asyncForEach(
                doc.data().files,
                async (fileName, index, files) => {
                  if (fileName.includes('header')) {
                    await FileSystem.downloadAsync(
                      `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.png?alt=media`,
                      FileSystem.documentDirectory +
                        language +
                        '-' +
                        fileName.slice(0, -3) +
                        '.png'
                    )
                  } else {
                    await FileSystem.downloadAsync(
                      `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.mp3?alt=media`,
                      FileSystem.documentDirectory +
                        language +
                        '-' +
                        fileName.slice(0, -3) +
                        '.mp3'
                    ).catch(error => {
                      console.log(error)
                      setFetchError(true, language)
                    })
                  }
                  totalDownloaded += 1
                  dispatch(setCurrentFetchProgress(totalDownloaded))
                }
              )
              logInstallLanguage(language, i18n.locale)
              dispatch(createGroup(groupNames[language], language, 'default'))
              dispatch(changeActiveGroup(groupNames[language]))
              dispatch(setIsFetching(false))
              dispatch(setFinishedInitialFetch(true))
              dispatch(setCurrentFetchProgress(0))
            } catch (error) {
              console.log(error)
              setFetchError(true, language)
            }
          }

          downloadStuff()
        } else {
          dispatch(setFetchError(true, language))
        }
      })
      .catch(error => {
        console.log(error)
        dispatch(setFetchError(true, language))
      })
  }
}

export function deleteLanguage (language) {
  return {
    type: DELETE_LANGUAGE,
    language
  }
}
