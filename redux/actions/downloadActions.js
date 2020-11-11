export const ADD_UPDATE_DOWNLOAD = 'ADD_UPDATE_DOWNLOAD'
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD'

import * as FileSystem from 'expo-file-system'

export function addUpdateDownload (progress, resumable, lessonID) {
  return {
    type: ADD_UPDATE_DOWNLOAD,
    progress,
    resumable,
    lessonID
  }
}

export function removeDownload (lessonID) {
  return {
    type: REMOVE_DOWNLOAD,
    lessonID
  }
}

// thunk function for async downloading
export function downloadMedia (type, lessonID, source) {
  var counter = 0

  var videoModifier = ''
  var fileEnd

  if (type === 'video') {
    videoModifier = 'v'
    fileEnd = 'v.mp4'
  } else {
    fileEnd = '.mp3'
  }

  return dispatch => {
    // callback function
    function callback ({ totalBytesWritten, totalBytesExpectedToWrite }) {
      progress = totalBytesWritten / totalBytesExpectedToWrite
      if (progress == 1) {
        dispatch(
          addUpdateDownload(
            progress,
            downloadResumable,
            lessonID + videoModifier
          )
        )
      } else if (counter % 10 == 0) {
        dispatch(
          addUpdateDownload(
            progress,
            downloadResumable,
            lessonID + videoModifier
          )
        )
      }
      counter += 1
    }

    // create our download object
    const downloadResumable = FileSystem.createDownloadResumable(
      source,
      FileSystem.documentDirectory + lessonID + fileEnd,
      {},
      callback
    )

    // add our download to state with progress 0
    dispatch(addUpdateDownload(0, downloadResumable, lessonID + videoModifier))

    // dispatch(storeDownload(downloadResumable, lessonID))

    // attempt to download file
    downloadResumable.downloadAsync().catch(error => {
      console.log(error)
    })
  }
}
