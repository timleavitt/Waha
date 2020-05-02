//simple file to combine all reducers to be used in redux/store.js

import { downloads } from '../reducers/downloads'
import { database } from '../reducers/database'
import { groups } from '../reducers/groups'
import { activeGroup } from '../reducers/activeGroup'
import { network } from '../reducers/network'
import { combineReducers } from 'redux'

export default rootReducer = combineReducers({
    downloads,
    database,
    groups,
    activeGroup,
    network
})