export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const FETCH_ERROR = 'FETCH_ERROR'
export const STORE_DATA = 'STORE_DATA'
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'
export const SET_IS_FETCHING = 'SET_IS_FETCHING'
export const SET_FIRST_OPEN = 'SET_FIRST_OPEN'
export const SET_IS_READY_TO_START = 'SET_IS_READY_TO_START'
export const DELETE_LANGUAGE = 'DELETE_LANGUAGE'
export const ADD_SCRIPT = 'ADD_SCRIPT'
export const REMOVE_SCRIPT = 'REMOVE_SCRIPT'

import firebase from 'firebase';
import '@firebase/firestore'
import * as FileSystem from 'expo-file-system';
import { createGroup, changeActiveGroup } from '../actions/groupsActions'
import i18n from 'i18n-js';

// firebase initializing
const config = {
   apiKey: "***REMOVED***",
   authDomain: "waha-app-db.firebaseapp.com",
   databaseURL: "https://waha-app-db.firebaseio.com",
   projectId: "waha-app-db",
   storageBucket: "waha-app-db.appspot.com",
   messagingSenderId: "831723165603",
   appId: "1:831723165603:web:21a474da50b2d0511bec16",
   measurementId: "G-6SYY2T8DX1"
};
firebase.initializeApp(config);
const db = firebase.firestore();

const groupNames = {
   en: "Group 1",
   te: "facilisis 1"
}

export function storeData(data, language) {
   return {
      type: STORE_DATA,
      data,
      language
   }
}

export function setIsFetching(isFetching) {
   return {
      type: SET_IS_FETCHING,
      isFetching
   }
}

export function setFirstOpen(isFirstOpen) {
   return {
      type: SET_FIRST_OPEN,
      isFirstOpen
   }
}

export function setIsReadyToStart(isReadyToStart) {
   return {
      type: SET_IS_READY_TO_START,
      isReadyToStart
   }
}

export function fetchError() {
   return {
      type: FETCH_ERROR
   }
}

export function addScript(script) {
   return {
      type: ADD_SCRIPT,
      script
   }
}

export function removeScript(script) {
   return {
      type: REMOVE_SCRIPT,
      script
   }
}

// thunk function for adding a language
// data to add during fetch:
// 1. firebase data (translations, sets, lessons, urls for downloads, colors)
// 2. lesson 1 chapter 1 mp3 
// 3. lesson 1 chapter 3 mp3
// 4. generic chapter 1 mp3
// 5. generic chapter 3 mp3
// 6. header image
// 7. fonts

export function addLanguage(language) {
   return (dispatch, getState) => {

      
      // set the i18n language for loading screen translations
      i18n.locale = language;

      // set isFetching to true to signal that we're doing stuff and don't want to load the rest of the app
      dispatch(setIsFetching(true));

      // tracking what's downloaded

      //// FIREBASE FETCH

      // get stuff from database and throw it in redux
      db.collection("languages").doc(language).get().then(doc => {
         if (doc.exists) {
            dispatch(storeData(doc.data(), language));

            // downloads a file from url into local storage
            function downloadSomething(source, fileName) {
               var downloadResumable = FileSystem.createDownloadResumable(
                  doc.data()[source],
                  FileSystem.documentDirectory + language + fileName,
                  {},
               )
               return downloadResumable.downloadAsync().then(() => 'done')
            }

            function downloadFonts() {
               // check if script is already downloaded by checking scripts in getstate

               // if script is not, download fonts, add script to redux, and return promise

               // if script is, return and do nothing 

               // to still think about: deleting a language and deleting fonts
            }

            // downloads everything we need
            function downloadEverything() {
               return Promise.all([
                  downloadSomething('headerImageSource', 'header.png'),
                  downloadSomething('chapter1source', 'chapter1.mp3'),
                  downloadSomething('chapter3source', 'chapter3.mp3'),
                  downloadSomething('lesson1chapter1source', 'lesson1chapter1.mp3'),
                  downloadSomething('lesson1chapter3source', 'lesson1chapter3.mp3'),
                  downloadFonts()
               ])
            }

            // actually download everything, then create a group, set the active group to the
            // new group, and finally set isfetching to false so we can go into the app
            downloadEverything().then(() => {
               dispatch(createGroup(groupNames[language], language, ''))
               dispatch(changeActiveGroup(groupNames[language]))
               dispatch(setIsFetching(false));
            })
         } else {
            console.log("error: doc doesn't exist")
         }
      })
   }
}

export function deleteLanguage(language) {
   return {
      type: DELETE_LANGUAGE,
      language
   }
}