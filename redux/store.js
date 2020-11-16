import { AsyncStorage } from 'react-native'
import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import { reduxMode } from '../modeSwitch'
import rootReducer from './reducers/combiner'

const blacklist =
  reduxMode === 'test'
    ? [
        'downloads',
        'isFetching',
        'mtUnlockAttempts',
        'areMobilizationToolsUnlocked',
        'groups',
        'database',
        'security',
        'storedDownloads'
      ]
    : ['downloads', 'isFetching', 'mtUnlockAttempts', 'storedDownloads']

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: blacklist
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware)
)

export const persistor = persistStore(store)
