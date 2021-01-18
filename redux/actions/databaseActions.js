export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const STORE_LANGUAGE_DATA = 'STORE_LANGUAGE_DATA'
export const SET_HAS_ONBOARDED = 'SET_HAS_ONBOARDED'
export const SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE =
  'SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE'
export const DELETE_LANGUAGE_DATA = 'DELETE_LANGUAGE_DATA'
export const SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS =
  'SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS'
export const SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD =
  'SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD'
export const SET_HAS_FETCHED_LANGUAGE_DATA = 'SET_HAS_FETCHED_LANGUAGE_DATA'

import * as FileSystem from 'expo-file-system'
import i18n from 'i18n-js'
import { groupNames } from '../../constants'
import { logInstallLanguage } from '../LogEventFunctions'
import { changeActiveGroup, createGroup } from './groupsActions'
import { setIsInstallingLanguageInstance } from './isInstallingLanguageInstanceActions'
import { storeDownloads } from './storedDownloadsActions'

/**
 *
 * @export
 * @param {*} languageData
 * @param {*} languageInstanceID
 * @return {Object} - Object to send to the reducer.
 */
export function storeLanguageData (languageData, languageInstanceID) {
  return {
    type: STORE_LANGUAGE_DATA,
    languageData,
    languageInstanceID
  }
}

/**
 *
 * @export
 * @param {*} hasOnboarded
 * @return {Object} - Object to send to the reducer.
 */
export function setHasOnboarded (hasOnboarded) {
  return {
    type: SET_HAS_ONBOARDED,
    hasOnboarded
  }
}

/**
 *
 * @export
 * @param {*} hasInstalledFirstLanguageInstance
 * @return {Object} - Object to send to the reducer.
 */
export function setHasInstalledFirstLanguageInstance (
  hasInstalledFirstLanguageInstance
) {
  return {
    type: SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE,
    hasInstalledFirstLanguageInstance
  }
}

/**
 *
 * @export
 * @param {*} hasFetchedLanguageData
 * @return {Object} - Object to send to the reducer.
 */
export function setHasFetchedLanguageData (hasFetchedLanguageData) {
  return {
    type: SET_HAS_FETCHED_LANGUAGE_DATA,
    hasFetchedLanguageData
  }
}

/**
 *
 * @export
 * @param {*} languageCoreFilesDownloadProgress
 * @return {Object} - Object to send to the reducer.
 */
export function setLanguageCoreFilesDownloadProgress (
  languageCoreFilesDownloadProgress
) {
  return {
    type: SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS,
    languageCoreFilesDownloadProgress
  }
}

/**
 *
 * @export
 * @param {*} totalLanguageCoreFilesToDownload
 * @return {Object} - Object to send to the reducer.
 */
export function setTotalLanguageCoreFilesToDownload (
  totalLanguageCoreFilesToDownload
) {
  return {
    type: SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD,
    totalLanguageCoreFilesToDownload
  }
}

/**
 *
 * @export
 * @param {*} languageInstanceID
 * @return {Object} - Object to send to the reducer.
 */
export function deleteLanguageData (languageInstanceID) {
  return {
    type: DELETE_LANGUAGE_DATA,
    languageInstanceID
  }
}

/**
 *
 * @export
 * @param {*} language
 * @return {Object} - Thunk object that allows us to get the state and dispatch actions.
 */
export function downloadLanguageCoreFiles (language) {
  return async (dispatch, getState) => {
    var totalDownloaded = 0
    dispatch(
      setTotalLanguageCoreFilesToDownload(
        getState().database[language].files.length
      )
    )

    function callback ({ totalBytesWritten, totalBytesExpectedToWrite }) {
      if (totalBytesWritten === totalBytesExpectedToWrite) {
        // totalDownloaded += 1
        // console.log(`file ${totalDownloaded} downloaded`)
        // dispatch(setCurrentFetchProgress(totalDownloaded))
      }
    }

    // 1. add all download resumables into one array
    var filesToDownload = []

    getState().database[language].files.forEach(fileName => {
      var download
      if (fileName.includes('header')) {
        download = FileSystem.createDownloadResumable(
          `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.png?alt=media`,
          FileSystem.documentDirectory +
            language +
            '-' +
            fileName.slice(0, -3) +
            '.png',
          {},
          callback
        )
      } else {
        download = FileSystem.createDownloadResumable(
          `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.mp3?alt=media`,
          FileSystem.documentDirectory +
            language +
            '-' +
            fileName.slice(0, -3) +
            '.mp3',
          {},
          callback
        )
      }

      filesToDownload.push(download)
    })

    // 2. add those download resumables to redux
    dispatch(storeDownloads(filesToDownload))

    // 3. start downloads in parallel
    function downloadFile (resumable) {
      return resumable
        .downloadAsync()
        .catch(error => console.log('download error'))
        .then(status => {
          if (status) {
            totalDownloaded += 1
            dispatch(setLanguageCoreFilesDownloadProgress(totalDownloaded))
          }
        })
    }

    const downloadFunctions = filesToDownload.map(resumable =>
      downloadFile(resumable)
    )

    Promise.all(downloadFunctions).then(() => {
      if (totalDownloaded === getState().database[language].files.length) {
        console.log('resolved')
        // var stupid = false
        // if (stupid) {

        //log the language install for firebase analytics
        logInstallLanguage(language, i18n.locale)

        // create a new group using the default group name in constants.js
        dispatch(createGroup(groupNames[language], language, 'default'))

        // change the active group to the new group we just created
        dispatch(changeActiveGroup(groupNames[language]))

        // set isFetching to false since we're no longer fetching
        dispatch(setIsInstallingLanguageInstance(false))

        // set setFinishedInitialFetch to true because we're done fetching
        dispatch(setHasInstalledFirstLanguageInstance(true))

        dispatch(setHasFetchedLanguageData(false))

        // set fetchProgress back to 0 (in case user downloads another
        //  language later)
        dispatch(setLanguageCoreFilesDownloadProgress(0))
        dispatch(
          setTotalLanguageCoreFilesToDownload(
            getState().database[language].files.length
          )
        )
      }
    })
  }
}
