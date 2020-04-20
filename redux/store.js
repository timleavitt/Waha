import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers/combiner'
import { persistStore, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['downloads', 'groups', 'database']
}
//

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, applyMiddleware(thunkMiddleware));

export const persistor = persistStore(store)