export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const STORE_DATA = 'STORE_DATA'
export const SET_FINISHED_ONBOARDING = 'SET_FINISHED_ONBOARDING'
export const SET_FINISHED_INITIAL_FETCH = 'SET_FINISHED_INITIAL_FETCH'
export const DELETE_LANGUAGE = 'DELETE_LANGUAGE'
export const SET_CURRENT_FETCH_PROGRESS = 'SET_CURRENT_FETCH_PROGRESS'
export const SET_TOTAL_TO_DOWNLOAD = 'SET_TOTAL_TO_DOWNLOAD'
import * as FileSystem from 'expo-file-system'
import i18n from 'i18n-js'
import { groupNames } from '../../constants'
import { setIsFetching } from '../actions/isFetchingActions'
import { logInstallLanguage } from '../LogEventFunctions'
import { changeActiveGroup, createGroup } from './groupsActions'
import { storeDownloads } from './storedDownloadsActions'

export function storeData (data, language) {
  console.log('beep')
  console.log(data.translations.sets.add_foundational_story_set_button_label)
  return {
    type: STORE_DATA,
    data,
    language
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

export function downloadLanguageFiles (language) {
  return async (dispatch, getState) => {
    var totalDownloaded = 0
    dispatch(setTotalToDownload(getState().database[language].files.length))

    function callback ({ totalBytesWritten, totalBytesExpectedToWrite }) {
      if (totalBytesWritten === totalBytesExpectedToWrite) {
        console.log('file downloaded')
        totalDownloaded += 1
        dispatch(setCurrentFetchProgress(totalDownloaded))
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
      // 2. add those download resumables to redux
    })

    dispatch(storeDownloads(filesToDownload))

    // 3. start downloads in parallel
    function downloadFile (resumable) {
      return resumable
        .downloadAsync()
        .catch(error => console.log('download error'))
    }

    const downloadFunctions = filesToDownload.map(resumable =>
      downloadFile(resumable)
    )

    Promise.all(downloadFunctions)
      .then(() => {
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
          dispatch(setIsFetching(false))

          // set setFinishedInitialFetch to true because we're done fetching
          dispatch(setFinishedInitialFetch(true))

          // set fetchProgress back to 0 (in case user downloads another
          //  language later)
          dispatch(setCurrentFetchProgress(0))
          dispatch(
            setTotalToDownload(getState().database[language].files.length)
          )
          // }
        }
      })
      .catch(error => {
        // FIREBASE ERROR
      })
  }
}

export function deleteLanguage (language) {
  return {
    type: DELETE_LANGUAGE,
    language
  }
}

// thunk function for adding a new language
// export function addLanguage (language) {
//   return async (dispatch, getState) => {
//     // set isFetching to true to signal that we're doing stuff and don't want to load the rest of the app
//     dispatch(setIsFetching(true))

//     //+ FIREBASE FETCH

//     //- get sets first
//     var sets = []

//     await db
//       .collection('sets')
//       .where('languageID', '==', language)
//       .get()
//       .then(response => {
//         response.forEach(set => {
//           console.log(set.id)
//           sets.push({
//             id: set.id,
//             ...set.data()
//           })
//         })
//       })
//       .catch(error => dispatch(setFetchError(true, language)))

//     //- then get language object from database and throw all of it in redux
//     await db
//       .collection('languages')
//       .doc(language)
//       .get()
//       .then(async doc => {
//         if (doc.exists) {
//           // store the language data and sets in redux
//           dispatch(
//             storeData(
//               {
//                 sets: sets,
//                 ...doc.data()
//               },
//               language
//             )
//           )

//           // set total to download so we can display progress through downloads
//           dispatch(setTotalToDownload(doc.data().files.length))

//           // used to track progress through downloads
//           var totalDownloaded = 0

//           //+ DOWNLOAD FUNCTIONS

//           // 1. for each file, create a download resumable and store it in redux
//           // 2. go through each

//           //- some magic for downloading a bunch of files and doing something
//           //-  when all of them are done
//           async function asyncForEach (array, callback) {
//             for (let index = 0; index < array.length; index++) {
//               await callback(array[index], index, array)
//             }
//           }

//           //- some more magic
//           const downloadStuff = async () => {
//             try {
//               await asyncForEach(
//                 doc.data().files,
//                 async (fileName, index, files) => {
//                   if (fileName.includes('header')) {
//                     var download = FileSystem.createDownloadResumable(
//                       `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.png?alt=media`,
//                       FileSystem.documentDirectory +
//                         language +
//                         '-' +
//                         fileName.slice(0, -3) +
//                         '.png'
//                     )

//                     // dispatch(storeDownload(download))

//                     // console.log(shouldDownload)

//                     await download
//                       .downloadAsync()
//                       .catch(error => dispatch(setFetchError(true, language)))

//                     // await FileSystem.downloadAsync(
//                     //   `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.png?alt=media`,
//                     //   FileSystem.documentDirectory +
//                     //     language +
//                     //     '-' +
//                     //     fileName.slice(0, -3) +
//                     //     '.png'
//                     // ).catch(error => dispatch(setFetchError(true, language)))
//                   } else {
//                     var download = FileSystem.createDownloadResumable(
//                       `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.mp3?alt=media`,
//                       FileSystem.documentDirectory +
//                         language +
//                         '-' +
//                         fileName.slice(0, -3) +
//                         '.mp3'
//                     )

//                     // dispatch(storeDownload(download))

//                     // console.log(shouldDownload)

//                     await download
//                       .downloadAsync()
//                       .catch(error => dispatch(setFetchError(true, language)))
//                     // await FileSystem.downloadAsync(
//                     //   `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${language}%2Fother%2F${fileName}.mp3?alt=media`,
//                     //   FileSystem.documentDirectory +
//                     //     language +
//                     //     '-' +
//                     //     fileName.slice(0, -3) +
//                     //     '.mp3'
//                     //   // if there's an error downloading a file
//                     // ).catch(error => {
//                     //   console.log(error)
//                     //   dispatch(setFetchError(true, language))
//                     // })
//                   }
//                   totalDownloaded += 1
//                   dispatch(setCurrentFetchProgress(totalDownloaded))
//                 }
//               )

//               //+ STUFF TO DO WHEN DONE DOWNLOADING

//               // log the language install for firebase analytics
//               logInstallLanguage(language, i18n.locale)

//               // create a new group using the default group name in constants.js
//               dispatch(createGroup(groupNames[language], language, 'default'))

//               // change the active group to the new group we just created
//               dispatch(changeActiveGroup(groupNames[language]))

//               // set isFetching to false since we're no longer fetching
//               dispatch(setIsFetching(false))

//               // set setFinishedInitialFetch to true because we're done fetching
//               dispatch(setFinishedInitialFetch(true))

//               // set fetchProgress back to 0 (in case user downloads another
//               //  language later)
//               dispatch(setCurrentFetchProgress(0))
//               dispatch(setTotalToDownload(doc.data().files.length))
//             } catch (error) {
//               console.log(error)
//               dispatch(setFetchError(true, language))
//             }
//           }

//           //+ ACTUALLY DOWNLOAD STUFF
//           try {
//             downloadStuff()
//           } catch (error) {
//             dispatch(setFetchError(true, language))
//           }
//         } else {
//           // if doc doesn't exist, throw an error
//           dispatch(setFetchError(true, language))
//         }
//       })
//       // if there's an error fetching from firebase
//       .catch(error => {
//         console.log(error)
//         dispatch(setFetchError(true, language))
//       })
//   }
// }
