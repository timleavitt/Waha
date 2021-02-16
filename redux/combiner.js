import { combineReducers } from 'redux'
import { activeGroup } from './reducers/activeGroup'
import { areMobilizationToolsUnlocked } from './reducers/areMobilizationToolsUnlocked'
import { database } from './reducers/database'
import { downloads } from './reducers/downloads'
import { groups } from './reducers/groups'
import { isInstallingLanguageInstance } from './reducers/isInstallingLanguageInstance'
import { mtUnlockAttempts } from './reducers/mtUnlockAttempts'
import { network } from './reducers/network'
import { security } from './reducers/security'
import { storedDownloads } from './reducers/storedDownloads'

/**
 * Combines all the different reducers together using the combineReducers redux function.
 */
export default rootReducer = combineReducers({
  downloads,
  database,
  groups,
  activeGroup,
  network,
  isInstallingLanguageInstance,
  areMobilizationToolsUnlocked,
  security,
  mtUnlockAttempts,
  storedDownloads
})
