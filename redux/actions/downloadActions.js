export const ADD_UPDATE_DOWNLOAD = 'ADD_UPDATE_DOWNLOAD'
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD'

import * as FileSystem from 'expo-file-system';

export function addUpdateDownload(progress, lessonID) {
   return {
      type: ADD_UPDATE_DOWNLOAD,
      progress,
      lessonID
   }
}

export function removeDownload(lessonID) {
   return {
      type: REMOVE_DOWNLOAD,
      lessonID
   }
}

// thunk function for async downloading
export function downloadLesson(lessonID, source) {

   // console.log(source)
   return dispatch => {

      // callback function
      function callback({ totalBytesWritten, totalBytesExpectedToWrite }) {
         var check = Math.floor(Math.random() * 200)
         progress = totalBytesWritten / totalBytesExpectedToWrite
         if (progress == 1)   
            dispatch(addUpdateDownload(progress, lessonID))
         else if (Math.round(progress * 100) % check === 0) {
            dispatch(addUpdateDownload(progress, lessonID))
         }
      }

      // create our download object
      const downloadResumable = FileSystem.createDownloadResumable(
         source,
         FileSystem.documentDirectory + lessonID + '.mp3',
         {},
         callback
      )

      // add our download to state with progress 0
      dispatch(addUpdateDownload(0, lessonID))

      // attempt to download file
      try {
         downloadResumable.downloadAsync()
      } catch (error) {
         console.error(error);
      }
   }
}