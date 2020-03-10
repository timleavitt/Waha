//simple file to combine all reducers to be used in redux/store.js

import { downloads } from '../reducers/downloads'
import { appProgress } from '../reducers/appProgress'
import { database } from '../reducers/database'

import { combineReducers } from 'redux'

export default rootReducer = combineReducers({
    downloads,
    appProgress,
    database
})