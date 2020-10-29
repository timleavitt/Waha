import * as FileSystem from 'expo-file-system'
import i18n from 'i18n-js'
import { groupNames } from '../../constants'
import db from '../../firebase/db'
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

// thunk function for adding a new language
export function addLanguage (language) {
  return async (dispatch, getState) => {
    // set isFetching to true to signal that we're doing stuff and don't want to load the rest of the app
    dispatch(setIsFetching(true))

    //+ FIREBASE FETCH

    //- get sets first
    var sets = []

    await db
      .collection('sets')
      .where('languageID', '==', language)
      .get()
      .then(response => {
        response.forEach(set => {
          console.log(set.id)
          sets.push({
            id: set.id,
            ...set.data()
          })
        })
      })

    //- then get language object from database and throw all of it in redux
    await db
      .collection('languages')
      .doc(language)
      .get()
      .then(async doc => {
        if (doc.exists) {
          // store the language data and sets in redux
          dispatch(
            storeData(
              {
                sets: sets,
                ...doc.data()
              },
              language
            )
          )

          // set total to download so we can display progress through downloads
          dispatch(setTotalToDownload(doc.data().files.length))

          // used to track progress through downloads
          var totalDownloaded = 0

          //+ DOWNLOAD FUNCTIONS

          //- some magic for downloading a bunch of files and doing something
          //-  when all of them are done
          async function asyncForEach (array, callback) {
            for (let index = 0; index < array.length; index++) {
              await callback(array[index], index, array)
            }
          }

          //- some more magic
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
                      // if there's an error downloading a file
                    ).catch(error => {
                      console.log(error)
                      setFetchError(true, language)
                    })
                  }
                  totalDownloaded += 1
                  dispatch(setCurrentFetchProgress(totalDownloaded))
                }
              )

              //+ STUFF TO DO WHEN DONE DOWNLOADING

              // log the language install for firebase analytics
              logInstallLanguage(language, i18n.locale)

              // create a new group using the default group name in constants.js
              dispatch(createGroup(groupNames[language], language, 'default'))

              // change the active group to the new group we just created
              dispatch(changeActiveGroup(groupNames[language]))

              // set isFetching to false since we're no longer fetching
              dispatch(setIsFetching(false))

              // set setFinishedInitialFetch to true because we're done fetching
              dispatch(setFinishedInitialFetch(true))

              // set fetchProgress back to 0 (in case user downloads another
              //  language later)
              dispatch(setCurrentFetchProgress(0))
            } catch (error) {
              console.log(error)
              setFetchError(true, language)
            }
          }

          //+ ACTUALLY DOWNLOAD STUFF

          downloadStuff()
        } else {
          // if doc doesn't exist, throw an error
          dispatch(setFetchError(true, language))
        }
      })
      // if there's an error fetching from firebase
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
