export const ADD_UPDATE_DOWNLOAD = 'ADD_UPDATE_DOWNLOAD'
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD'

import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';
import { AsyncStorage } from 'react-native'

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
   var counter = 0;

   return dispatch => {

      // callback function
      function callback({ totalBytesWritten, totalBytesExpectedToWrite }) {
         progress = totalBytesWritten / totalBytesExpectedToWrite
         if (progress == 1) {
            dispatch(addUpdateDownload(progress, lessonID))
         }
         else if (counter % 10 == 0) {
            dispatch(addUpdateDownload(progress, lessonID))
         }
         counter += 1;
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
      downloadResumable.downloadAsync().catch(() => {
         // if we get an error, set our progress back to 0
         dispatch(addUpdateDownload(0, lessonID))

         // then, store the download resumable object so we can start it later
         AsyncStorage.setItem(lessonID, JSON.stringify(downloadResumable.savable()));
      })
   }
}

export function resumeDownload(lessonID, downloadSnapshotJSON) {
   var counter = 0;
   return async dispatch => {
      // callback function
      function callback({ totalBytesWritten, totalBytesExpectedToWrite }) {
         progress = totalBytesWritten / totalBytesExpectedToWrite
         if (progress == 1) {
            dispatch(addUpdateDownload(progress, lessonID))
            AsyncStorage.removeItem(lessonID)
         }
         else if (counter % 10 == 0) {
            dispatch(addUpdateDownload(progress, lessonID))
         }
         counter += 1;
      }

      const downloadSnapshot = JSON.parse(downloadSnapshotJSON);
      const downloadResumable = new FileSystem.DownloadResumable(
         downloadSnapshot.url,
         downloadSnapshot.fileUri,
         downloadSnapshot.options,
         callback,
         downloadSnapshot.resumeData
      );

      downloadResumable.resumeAsync().catch(() => AsyncStorage.setItem(lessonID, JSON.stringify(downloadResumable.savable())));
   }
}