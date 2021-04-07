export const ADD_UPDATE_DOWNLOAD = 'ADD_UPDATE_DOWNLOAD'
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD'

import * as FileSystem from 'expo-file-system'

/**
 * Adds or updates the progress for a download in the downloads state.
 * @export
 * @param {number} progress - The progress of the lesson's download to update.
 * @param {Object} resumable - The resumable object of the download in case we want to cancel it.
 * @param {string} lessonID - The ID of the lessson to add or update the download for. If we're adding, we add a new key to the downloads object. If we're updating, we update the progress for the existing lesson's key.
 * @return {Object} - Object to send to the reducer.
 */
export function addUpdateDownload (progress, resumable, lessonID) {
  return {
    type: ADD_UPDATE_DOWNLOAD,
    progress,
    resumable,
    lessonID
  }
}

/**
 * Removes a download from the downloads object.
 * @export
 * @param {string} lessonID - The ID of the lesson whose download we want to remove from the downloads state.
 * @return {Object} - Object to send to the reducer.
 */
export function removeDownload (lessonID) {
  return {
    type: REMOVE_DOWNLOAD,
    lessonID
  }
}

/**
 * Downloads the scripture mp3 for a lesson or the video for a lesson. This is a thunk function, so it dispatches other actions, in this case addUpdateDownload() above.
 * @export
 * @param {string} type - The type of media to download. The two options are 'audio' or 'video'.
 * @param {string} lessonID - The ID of the lesson to start downloading the scripture mp3 for.
 * @param {string} source - The firebase URI for the file to download.
 * @return {Object} - Thunk object that allows us to get the state and dispatch actions.
 */
export function downloadMedia (type, lessonID, source) {
  var counter = 0

  // All video files are named the same as the audio files except with a 'v' at the end, so if we're downloading a video file we need to add that to the file name that we're wanting to download. We also want to adjust the file extension depending on the media type: .mp3 for audio and .mp4 for video. This is used for the name of the file as it will be saved as on the device.
  var videoModifier = ''
  var fileEnd

  if (type === 'video') {
    videoModifier = 'v'
    fileEnd = 'v.mp4'
  } else {
    fileEnd = '.mp3'
  }

  return dispatch => {
    // Callback function for updating the progress of a download.
    function callback ({ totalBytesWritten, totalBytesExpectedToWrite }) {
      // Calculate the progress of the download.
      progress = totalBytesWritten / totalBytesExpectedToWrite

      // We always want to update the progress whenever the download finishes so we know when it's done and can remove the download.
      if (progress == 1) {
        dispatch(
          addUpdateDownload(
            progress,
            downloadResumable,
            lessonID + videoModifier
          )
        )
        // A simple way to only update the progress every 10 calls to the callback function. This helps with performance, especially when downloading multiple files at the same time.
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

    // Create our download object.
    const downloadResumable = FileSystem.createDownloadResumable(
      source,
      FileSystem.documentDirectory + lessonID + fileEnd,
      {},
      callback
    )

    // Add our download to the downloads state object with progress 0.
    dispatch(addUpdateDownload(0, downloadResumable, lessonID + videoModifier))

    // Download the file.
    downloadResumable.downloadAsync().catch(error => {
      console.log(error)
    })
  }
}
