//simple file to combine all reducers to be used in redux/store.js

import { downloads } from '../reducers/downloads'
import { database, fetchingStatus } from '../reducers/database'
import { groups } from '../reducers/groups'
import { activeGroup } from '../reducers/activeGroup'
import { network } from '../reducers/network'
import { toolkitEnabled } from '../reducers/toolkitEnabled'
import { combineReducers } from 'redux'

export default rootReducer = combineReducers({
  downloads,
  database,
  groups,
  activeGroup,
  network,
  fetchingStatus,
  toolkitEnabled
})
