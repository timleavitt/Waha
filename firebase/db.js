import '@firebase/firestore'
import firebase from 'firebase'
import { dbMode } from '../modeSwitch'
import { prodConfig } from './prodConfig'
import { testConfig } from './testConfig'
/**
 * This file contains configuration information for using Firebase in Waha,initalizes the Firestore database, and exports it so that any other file can access it. The google-services.json and GoogleService-Info.plist files also contained in the firebase folder are required to use Firebase with expo, so they should not be deleted. They are referenced in app.json.
 */

// Configurations for the Waha-Test Firestore database and Waha-Prod Firestore database. If switching to production, you must have the correct prod config file.
const config = dbMode === 'test' ? testConfig : prodConfig

// Create the Firebase object.
firebase.initializeApp(config)

// Create the database object for Firestore.
const db = firebase.firestore()

// Finally, export the Firestore database object so that other files can have access to it.
export default db
