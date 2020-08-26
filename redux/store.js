import { AsyncStorage } from 'react-native'
import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers/combiner'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    'downloads',
    'fetchingStatus'
    // 'toolkitEnabled',
    // 'groups',
    // 'database',
    // 'security'
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware)
)

export const persistor = persistStore(store)
