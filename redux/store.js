import { AsyncStorage } from 'react-native'
import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import { reduxMode } from '../modeSwitch'
import rootReducer from './combiner'

// Blacklist contains the reducers that we DON'T want to persist across app restarts. These are set based on which mode we're in. Note: test mode is only for testing. Always make sure reduxMode is set to prod mode before building.
const blacklist =
  reduxMode === 'test'
    ? // In test mode, we want nothing to be persisted so that we can reset the app fully with every restart. This is helpful for testing the language select screen and onboarding so that we don't have to uninstall and reinstall the app every time.
      [
        'downloads',
        'isInstallingLanguageInstance',
        'mtUnlockAttempts',
        'areMobilizationToolsUnlocked',
        'groups',
        'database',
        'security',
        'storedDownloads'
      ]
    : // In prod mode, we want only a few specific reducers to be persisted.
      [
        'downloads',
        'isInstallingLanguageInstance',
        'mtUnlockAttempts',
        'storedDownloads',
        'areMobilizationToolsUnlocked'
      ]

// Congif object for the persisted reducer.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: blacklist
}

// Create the persisted reducer using our config file and the combined reducer taken from ./combiner.js which is all of our reducers combined into one.
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create the redux store and apply middleware. Here, we apply the thunk middleware so that we can dispatch actions and get the state in a few action functions.
export const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware)
)

// Finally, create our store with the persistor.
export const persistor = persistStore(store)
