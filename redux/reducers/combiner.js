import { combineReducers } from 'redux'
import { activeGroup } from '../reducers/activeGroup'
import { areMobilizationToolsUnlocked } from '../reducers/areMobilizationToolsUnlocked'
import { database } from '../reducers/database'
import { downloads } from '../reducers/downloads'
import { groups } from '../reducers/groups'
import { isInstallingLanguageInstance } from '../reducers/isInstallingLanguageInstance'
import { mtUnlockAttempts } from '../reducers/mtUnlockAttempts'
import { network } from '../reducers/network'
import { security } from '../reducers/security'
import { storedDownloads } from '../reducers/storedDownloads'

/**
 * Combines all the different reducers together.
 */
export default rootReducer = combineReducers({
  // downloads stores the active downloads for Story Chapters or Training Chapter videos.
  downloads,

  // database stores all the information for all the language instances, including general info and Story Sets.
  database,

  // groups stores all of the created groups in Waha. Each group has a bunch of information, like name, emoji, what Story Sets have been added, and the progress through Story Sets.
  groups,

  // activeGroup stores the name of the currently active or selected group.
  activeGroup,

  // network stores information about network connection.
  network,

  // isInstallingLanguageInstance simply stores whether the app is installing a language instance or not.
  isInstallingLanguageInstance,

  // areMobilizationToolsUnlocked stores whether the Mobilization Tools are globally unlocked or not.
  areMobilizationToolsUnlocked,

  // security stores all information related to Waha's Security Mode.
  security,

  // mtUnlockAttempts stores the number of times the user has tried to unlock the Mobilization Tools unsuccessfully.
  mtUnlockAttempts,

  // storedDownloads stores the download resumables of any downloading core files so they can be cancelled if necessary.
  storedDownloads
})
