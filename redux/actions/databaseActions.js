export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const STORE_LANGUAGE_DATA = 'STORE_LANGUAGE_DATA'
export const STORE_LANGUAGE_SETS = 'STORE_LANGUAGE_SETS'
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

export function storeLanguageSets (languageSets, languageInstanceID) {
  return {
    type: STORE_LANGUAGE_SETS,
    languageSets,
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
 * Downloads all the core files for a single language instance and does a whole bunch of stuff once they're done downloading. The core files include the header image, the dummy story mp3, and every question set mp3.
 * @export
 * @param {string} language - The ID for the language instance that we're downloading the core files for.
 */
export function downloadLanguageCoreFiles (language) {
  return async (dispatch, getState) => {
    // Set the totalDownloaded variable to 0. This is our download progress tracking variable. We add one to this variable whenever we finish downloading a file.
    var totalDownloaded = 0

    // Set the setTotalLanguageCoreFilesToDownload redux variable to the number of files we have to download.
    dispatch(
      setTotalLanguageCoreFilesToDownload(
        getState().database[language].files.length
      )
    )

    // 1. Add all the download resumables into one array.
    var filesToDownload = []

    // Run some code for each file we have to download for a language instance. The files we have to download are stored in our redux database (which we fetched from firebase).
    getState().database[language].files.forEach(fileName => {
      // Create download object.
      var download

      // Set the file extension based on what type of file we're downloading. Every language core file is an mp3 except for the header image which is a png.
      var fileExtension = fileName.includes('header') ? 'png' : 'mp3'

      // Set the firebase storage URL to download from. The file structure in firebase must be set up exactly right for this link to work.
      var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.${fileExtension}?alt=media`

      // Set the local storage path to download to and the name of the file. The format is simple: FileSystem/languageID-fileName.extension.
      var localPath = `${
        FileSystem.documentDirectory
      }${language}-${fileName.slice(0, -3)}.${fileExtension}`

      // Create the download object. Uses url and localPath from above, an empty parameters object, and an empty callback function.
      download = FileSystem.createDownloadResumable(
        url,
        localPath,
        {},
        () => {}
      )

      // Add this download to the filesToDownload object.
      filesToDownload.push(download)
    })

    // 2. Store out download resumables array in redux.
    dispatch(storeDownloads(filesToDownload))

    // 3. Start all the downloads in the download resumables array in parallel.

    /**
     * Downloads one file. Updates the total files downloaded redux variable once it's finished so we know how many files we've downloaded.
     * @param {Object} resumable - The download resumable object.
     */
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

    // Create an array of all of our download resumable objects. This is what allows us to execute some code once all the downloads finish using Promise.all.
    const downloadFunctions = filesToDownload.map(resumable =>
      downloadFile(resumable)
    )

    // Start all of our downloads at once.
    Promise.all(downloadFunctions).then(() => {
      // Once all the downloads have finished...
      if (totalDownloaded === getState().database[language].files.length) {
        // Log the language install in firebase for firebase analytics.
        logInstallLanguage(language, i18n.locale)

        // Create a new group using the default group name stored in constants.js. First we make sure there's no duplicates just in case a group has already been created.
        if (
          !getState().groups.some(group => group.name === groupNames[language])
        )
          dispatch(createGroup(groupNames[language], language, 'default'))

        // Change the active group to the new group we just created.
        dispatch(changeActiveGroup(groupNames[language]))

        // Set the setIsInstallingLanguageInstance redux variable to false since we're no longer actively installing a language instance.
        dispatch(setIsInstallingLanguageInstance(false))

        // Set the setHasInstalledFirstLanguageInstance redux variable to true because we've finished installing our first language instance.
        dispatch(setHasInstalledFirstLanguageInstance(true))

        // Set the setHasFetchedLanguageData variable to false so that on the next language install, it starts out as false.
        dispatch(setHasFetchedLanguageData(false))

        // Set the setLanguageCoreFilesDownloadProgress to 0 so that next time we install a language instance, our progress starts out at 0.
        dispatch(setLanguageCoreFilesDownloadProgress(0))

        // Set the setTotalLanguageCoreFilesToDownload to the number of files to download for this language. I think this is only here to avoid divide-by-zero erros but I'm not sure. I'm just too scared to delete it.
        dispatch(
          setTotalLanguageCoreFilesToDownload(
            getState().database[language].files.length
          )
        )
      }
    })
  }
}
