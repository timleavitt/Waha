//simple file to combine all reducers to be used in redux/store.js

import { combineReducers } from 'redux'
import { activeGroup } from '../reducers/activeGroup'
import { areMobilizationToolsUnlocked } from '../reducers/areMobilizationToolsUnlocked'
import { database, fetchingStatus } from '../reducers/database'
import { downloads } from '../reducers/downloads'
import { groups } from '../reducers/groups'
import { mtUnlockAttempts } from '../reducers/mtUnlockAttempts'
import { network } from '../reducers/network'
import { security } from '../reducers/security'
import { storedDownloads } from '../reducers/storedDownloads'

export default rootReducer = combineReducers({
  downloads,
  database,
  groups,
  activeGroup,
  network,
  fetchingStatus,
  areMobilizationToolsUnlocked,
  security,
  mtUnlockAttempts,
  storedDownloads
})
