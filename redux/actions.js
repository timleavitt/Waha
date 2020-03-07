export const ADD_UPDATE_DOWNLOAD = 'ADD_UPDATE_DOWNLOAD'
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD'
export const PURGE = 'PURGE'

export const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE'
export const RESET_PROGRESS = 'RESET_PROGRESS'

import * as FileSystem from 'expo-file-system';

//progress actions

export function toggleComplete(lessonID) {
    return {
        type: TOGGLE_COMPLETE,
        lessonID
    }
}

export function resetProgress() {
    return {
        type: RESET_PROGRESS
    }
}

//download actions

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

export function purge() {
    return {
        type: PURGE
    }
}

export function downloadLesson(lessonID) {
    return dispatch => {

        //callback function
        function callback({ totalBytesWritten, totalBytesExpectedToWrite }) {
            progress = totalBytesWritten / totalBytesExpectedToWrite
            if (progress >= 1) 
                dispatch(removeDownload(lessonID))
            else
                dispatch(addUpdateDownload(progress, lessonID))
        }

        //create our download object
        const downloadResumable = FileSystem.createDownloadResumable(
            'https://dl.airtable.com/.attachments/153694f4bc874577dda5bb4ccfe70187/aeb2055d/Acolyte.mp3',
            FileSystem.documentDirectory + lessonID + '.mp3',
            {},
            callback
        )

        //add our download to state with progress 0
        dispatch(addUpdateDownload(0, lessonID))

        //attempt to download file
        try {
            downloadResumable.downloadAsync().then(({uri}) => console.log('Finished downloading to ', uri))
        } catch (error) {
            console.error(error);
        }
    }
}