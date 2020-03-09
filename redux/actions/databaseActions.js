export const FETCH_DATA = 'FETCH_DATA'
export const FETCH_ERROR = 'FETCH_ERROR'
export const STORE_DATA = 'STORE_DATA'
//export const CHOOSE_LANGUAGE = 'CHOOSE_LANGUAGE'

import firebase from 'firebase';
import '@firebase/firestore'

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

export function storeData(data) {
    return {
        type: STORE_DATA,
        data
    }
}

export function fetchError() {
    return {
        type: FETCH_ERROR
    }
}

export function fetchData() {
    return dispatch => {
        //Get stuff from database
        //console.log(db)
        db.collection("languages").doc("english").get().then(doc => {
            if (doc.exists) {
                //console.log(doc.data())
                dispatch(storeData(doc.data()))
            } else {
                console.log("error: doc doesn't exist")
            }})
    }
}