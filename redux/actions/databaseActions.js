export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const FETCH_ERROR = 'FETCH_ERROR'
export const STORE_DATA = 'STORE_DATA'
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'
export const SET_IS_FETCHING = 'SET_IS_FETCHING'
export const SET_FIRST_OPEN = 'SET_FIRST_OPEN'
export const SET_IS_READY_TO_START = 'SET_IS_READY_TO_START'
export const DELETE_LANGUAGE = 'DELETE_LANGUAGE'

import firebase from 'firebase';
import '@firebase/firestore'

import * as FileSystem from 'expo-file-system';

//firebase initializing
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

//action creators
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

//thunk function for fetching a language from the database
//this includes colors, translations, study sets, lessons, and chapter 1
//and 3 audio files
export function addLanguage(language) {
   return (dispatch, getState) => {
      //set isFetching to true to signal that we're fetching data from firebase
      dispatch(setIsFetching(true));

      //console.log(`typeof language passed in: ${typeof language}`)

      var chapter1Downloaded = false;
      var chapter3Downloaded = false;

      //Get stuff from database and throw it in redux
      db.collection("languages").doc(language).get().then(doc => {
         if (doc.exists) {
            dispatch(storeData(doc.data(), language));
            //after we get our firebase data, we can download chapters 1 and 3

            //create our download object for chapter 1
            var downloadResumable = FileSystem.createDownloadResumable(
               doc.data().chapter1,
               FileSystem.documentDirectory + language + 'chapter1.mp3',
               {},
            )
            try {
               downloadResumable.downloadAsync().then(({ uri }) => {
                  console.log('Finished downloading to ', uri);
                  chapter1Downloaded = true;
                  if (chapter1Downloaded && chapter3Downloaded)
                     dispatch(setIsFetching(false));
               })
            } catch (error) {
               console.error(error);
            }

            //create our download object for chapter 3
            downloadResumable = FileSystem.createDownloadResumable(
               doc.data().chapter3,
               FileSystem.documentDirectory + language + 'chapter3.mp3',
               {},
            )
            try {
               downloadResumable.downloadAsync().then(({ uri }) => {
                  console.log('Finished downloading to ', uri);
                  chapter3Downloaded = true;
                  if (chapter1Downloaded && chapter3Downloaded)
                     dispatch(setIsFetching(false));
               })
            } catch (error) {
               console.error(error);
            }
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