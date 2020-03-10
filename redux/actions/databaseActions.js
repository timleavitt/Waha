export const ADD_LANGUAGE = 'ADD_LANGUAGE'
export const FETCH_ERROR = 'FETCH_ERROR'
export const STORE_DATA = 'STORE_DATA'
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'
export const SET_IS_FETCHING = 'SET_IS_FETCHING'

//export const CHOOSE_LANGUAGE = 'CHOOSE_LANGUAGE'

import firebase from 'firebase';
import '@firebase/firestore'

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

export function fetchError() {
    return {
        type: FETCH_ERROR
    }
}

export function addLanguage(language) {
    return dispatch => {
        dispatch(setIsFetching(true));
        //Get stuff from database and throw it in redux
        db.collection("languages").doc(language).get().then(doc => {
            if (doc.exists) {
                dispatch(storeData(doc.data(), language));
                dispatch(setIsFetching(false));
            } else {
                console.log("error: doc doesn't exist")
            }})
    }
}

export function changeLanguage(newLanguage) {
    console.log('change language action creator firing')
    return {
        type: CHANGE_LANGUAGE,
        newLanguage
    }
}