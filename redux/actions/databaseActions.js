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
export const STORE_LANGUAGE_CORE_FILE_CREATED_TIME =
  'STORE_LANGUAGE_CORE_FILE_CREATED_TIME'
export const ADD_LANGUAGE_CORE_FILE_TO_UPDATE =
  'ADD_LANGUAGE_CORE_FILE_TO_UPDATE'
export const CLEAR_LANGUAGE_CORE_FILES_TO_UPDATE =
  'CLEAR_LANGUAGE_CORE_FILES_TO_UPDATE'
export const STORE_ACTING_LANGUAGE_ID = 'STORE_ACTING_LANGUAGE_ID'

import * as FileSystem from 'expo-file-system'
import firebase from 'firebase'
import i18n from 'i18n-js'
import { groupNames } from '../../constants'
import { logInstallLanguage } from '../LogEventFunctions'
import { changeActiveGroup, createGroup } from './groupsActions'
import { setIsInstallingLanguageInstance } from './isInstallingLanguageInstanceActions'
import { storeDownloads } from './storedDownloadsActions'

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

export function setHasOnboarded (hasOnboarded) {
  return {
    type: SET_HAS_ONBOARDED,
    hasOnboarded
  }
}

export function setHasInstalledFirstLanguageInstance (
  hasInstalledFirstLanguageInstance
) {
  return {
    type: SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE,
    hasInstalledFirstLanguageInstance
  }
}

export function setHasFetchedLanguageData (hasFetchedLanguageData) {
  return {
    type: SET_HAS_FETCHED_LANGUAGE_DATA,
    hasFetchedLanguageData
  }
}

export function setLanguageCoreFilesDownloadProgress (
  languageCoreFilesDownloadProgress
) {
  return {
    type: SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS,
    languageCoreFilesDownloadProgress
  }
}

export function setTotalLanguageCoreFilesToDownload (
  totalLanguageCoreFilesToDownload
) {
  return {
    type: SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD,
    totalLanguageCoreFilesToDownload
  }
}

export function deleteLanguageData (languageInstanceID) {
  return {
    type: DELETE_LANGUAGE_DATA,
    languageInstanceID
  }
}

export function storeLanguageCoreFileCreatedTime (fileName, timeCreated) {
  return {
    type: STORE_LANGUAGE_CORE_FILE_CREATED_TIME,
    fileName,
    timeCreated
  }
}

export function addLanguageCoreFileToUpdate (fileName) {
  // console.log('STORING FILES TO UPDATE ACTION FIRING\n')
  return {
    type: ADD_LANGUAGE_CORE_FILE_TO_UPDATE,
    fileName
  }
}

export function clearLanguageCoreFilesToUpdate () {
  return {
    type: CLEAR_LANGUAGE_CORE_FILES_TO_UPDATE
  }
}

export function storeActingLanguageID (languageID) {
  return {
    type: STORE_ACTING_LANGUAGE_ID,
    languageID: languageID
  }
}

/**
 * Downloads all the core files for a single language instance and does a whole bunch of stuff once they're done downloading. The core files include the header image, the dummy story mp3, and every question set mp3.
 * @export
 * @param {string} language - The ID for the language instance that we're downloading the core files for.
 */
export function downloadLanguageCoreFiles (language) {
  return async (dispatch, getState) => {
    // Store the ID of the language that we're downloading core files for so that if we cancel the install, we know what language to delete from the database.
    dispatch(storeActingLanguageID(language))

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

      // For when file name includes "v1".
      var fileExtension = fileName.includes('header') ? 'png' : 'mp3'

      // For when file name DOESN'T includes "v1".
      // var fileExtension = fileName === 'header' ? 'png' : 'mp3'

      // Set the firebase storage URL to download from. The file structure in firebase must be set up exactly right for this link to work.

      // PRODUCTION URL
      var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.${fileExtension}?alt=media`

      // TEST URL
      // var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-test-db.appspot.com/o/${language}%2Fother%2F${fileName}.${fileExtension}?alt=media`

      // Set the local storage path to download to and the name of the file. The format is simple: FileSystem/languageID-fileName.extension.

      // For when file name includes "v1".
      var localPath = `${
        FileSystem.documentDirectory
      }${language}-${fileName.slice(0, -3)}.${fileExtension}`

      // For when file name DOESN'T includes "v1".
      // var localPath = `${FileSystem.documentDirectory}${language}-${fileName}.${fileExtension}`

      // Create the download object. Uses url and localPath from above, an empty parameters object, and an empty callback function.
      download = FileSystem.createDownloadResumable(
        url,
        localPath,
        {},
        () => {}
      )

      // Add this download to the filesToDownload object.
      filesToDownload.push(download)

      // Add the time created of this file to our createdTimes redux object so that we know later if a file gets updated.
      firebase
        .storage()
        .refFromURL(url)
        .getMetadata()
        .then(metadata =>
          dispatch(
            storeLanguageCoreFileCreatedTime(
              // For when file name includes "v1".
              `${language}-${fileName.slice(0, -3)}`,
              metadata.timeCreated
              // For when file name DOESN'T includes "v1".
              // language + '-' + fileName,
              // metadata.timeCreated
            )
          )
        )
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
    Promise.all(downloadFunctions)
      .then(() => {
        // Once all the downloads have finished...
        if (totalDownloaded === getState().database[language].files.length) {
          // Log the language install in firebase for firebase analytics.
          logInstallLanguage(language, i18n.locale)

          // Create a new group using the default group name stored in constants.js, assuming a group hasn't already been created with the same name. We don't want any duplicates.
          if (
            !getState().groups.some(
              group => group.name === groupNames[language]
            )
          )
            dispatch(createGroup(groupNames[language], language, 'default'))

          // Change the active group to the new group we just created.
          dispatch(changeActiveGroup(groupNames[language]))

          // Set our actingLanguageID variable to null since we're not downloading a language instance anymore.
          dispatch(storeActingLanguageID(null))

          // Set the isInstallingLanguageInstance redux variable to false since we're no longer actively installing a language instance.
          dispatch(setIsInstallingLanguageInstance(false))

          // Set the hasInstalledFirstLanguageInstance redux variable to true because we've finished installing our first language instance.
          dispatch(setHasInstalledFirstLanguageInstance(true))

          // Set the hasFetchedLanguageData variable to false so that on the next language install, it starts out as false.
          dispatch(setHasFetchedLanguageData(false))

          // Set the languageCoreFilesDownloadProgress to 0 so that next time we install a language instance, our progress starts out at 0.
          dispatch(setLanguageCoreFilesDownloadProgress(0))

          // Clear stored downloads.
          dispatch(storeDownloads([]))

          // Set the setTotalLanguageCoreFilesToDownload to the number of files to download for this language. I think this is only here to avoid divide-by-zero erros but I'm not sure. I'm just too scared to delete it.
          dispatch(
            setTotalLanguageCoreFilesToDownload(
              getState().database[language].files.length
            )
          )
        }
      })
      .catch(error => {})
  }
}

/**
 * Very similar to downloadLanguageCoreFiles, but with a few key differences. This function is used to update core files in an already-installed language instance instead of downloading core files for a new one. We download any files stored in languageCoreFilesToUpdate instead of every core file for a language instance. Note: there's no language parameter as this function can update core files for multiple language instances at the same time if need be.
 * @export
 */
export function updateLanguageCoreFiles () {
  return async (dispatch, getState) => {
    // Set the totalDownloaded variable to 0. This is our update progress tracking variable. We add one to this variable whenever we finish downloading a file.
    var totalDownloaded = 0

    // Remove any duplicates in the languageCoreFilesToUpdate variable.
    var languageCoreFilesToUpdate = getState().database.languageCoreFilesToUpdate.filter(
      (item, pos) =>
        getState().database.languageCoreFilesToUpdate.indexOf(item) == pos
    )

    // Set the totalLanguageCoreFilesToDownload redux variable to the number of files we have to update.
    dispatch(
      setTotalLanguageCoreFilesToDownload(languageCoreFilesToUpdate.length)
    )

    // 1. Add all the download resumables into one array.
    var filesToDownload = []

    // Run some code for each file we have to download for a language instance. The files we have to download are stored in our redux database (which we fetched from firebase).
    languageCoreFilesToUpdate.forEach(fileName => {
      // This is here because I'm a fool and didn't automatically include the language ID in the file names in Firebase. Therefore, we have to remove the language ID here. Will be fixed soon.
      var languageID = fileName.slice(0, 2)

      // Also because I'm a fool and didn't create a better system for distinguishing updated files. Will be fixed soon.
      var shortenedFileName = fileName.slice(3) + '-v1'

      // Create the download object.
      var download

      // Set the file extension based on what type of file we're downloading. Every language core file is an mp3 except for the header image which is a png.
      var fileExtension = shortenedFileName.includes('header') ? 'png' : 'mp3'

      // Set the firebase storage URL to download from. The file structure in firebase must be set up exactly right for this link to work.

      // PRODUCTION URL
      var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${languageID}%2Fother%2F${shortenedFileName}.${fileExtension}?alt=media`

      // TEST URL
      // var url = `https://firebasestorage.googleapis.com/v0/b/waha-app-test-db.appspot.com/o/${languageID}%2Fother%2F${shortenedFileName}.${fileExtension}?alt=media`

      // Set the local storage path to download to and the name of the file. The format is simple: "FileSystem/languageID-localFileName.extension".
      var localPath = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`

      // Create the download object. Uses url and localPath from above, an empty parameters object, and an empty callback function.
      download = FileSystem.createDownloadResumable(
        url,
        localPath,
        {},
        () => {}
      )

      // Add this download resumable to the filesToDownload object.
      filesToDownload.push(download)

      // Add the new created time of this core file to our createdTimes redux object so that we know later if a core file gets updated.
      firebase
        .storage()
        .refFromURL(url)
        .getMetadata()
        .then(metadata =>
          dispatch(
            storeLanguageCoreFileCreatedTime(fileName, metadata.timeCreated)
          )
        )
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
      if (totalDownloaded === languageCoreFilesToUpdate.length) {
        // Set the isInstallingLanguageInstance redux variable to false since we're no longer actively installing a language instance.
        dispatch(setIsInstallingLanguageInstance(false))

        // Set the hasFetchedLanguageData variable to false so that on the next language install, it starts out as false.
        dispatch(setHasFetchedLanguageData(false))

        // Set the languageCoreFilesToUpdate redux variable to an empty array since we've downloaded all the new files that we need to.
        dispatch(clearLanguageCoreFilesToUpdate())

        // Set the languageCoreFilesDownloadProgress to 0 so that next time we install a language instance, our progress starts out at 0.
        dispatch(setLanguageCoreFilesDownloadProgress(0))

        // Clear stored downloads.
        dispatch(storeDownloads([]))

        // I think this is only here to avoid divide-by-zero erros but I'm not sure. I'm just too scared to delete it.
        dispatch(setTotalLanguageCoreFilesToDownload(1))
      }
    })
  }
}
