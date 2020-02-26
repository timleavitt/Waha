import Firebase from 'firebase';

let config = {
    apiKey: "***REMOVED***",
    authDomain: "waha-app-db.firebaseapp.com",
    databaseURL: "https://waha-app-db.firebaseio.com",
    projectId: "waha-app-db",
    storageBucket: "waha-app-db.appspot.com",
    messagingSenderId: "831723165603",
    appId: "1:831723165603:web:21a474da50b2d0511bec16",
    measurementId: "G-6SYY2T8DX1"
};

let app = Firebase.initializeApp(config);
export const db = app.database();