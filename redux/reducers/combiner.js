//simple file to combine all reducers to be used in redux/store.js

import { downloads } from '../reducers/downloads'
import { appProgress } from '../reducers/appProgress'
import { database } from '../reducers/database'
import { groups } from '../reducers/groups'
import { activeGroup } from '../reducers/activeGroup'

import { combineReducers } from 'redux'

export default rootReducer = combineReducers({
    downloads,
    appProgress,
    database,
    groups,
    activeGroup
})