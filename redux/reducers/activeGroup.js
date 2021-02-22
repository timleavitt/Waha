import { CHANGE_ACTIVE_GROUP } from '../actions/activeGroupActions'

/**
 * The active group redux reducer that stores the name of the currently active group. This state is persisted across app restarts.
 * @param {Object} action - Parameters passed from groupsAction.js functions.
 * @param {string} activeGroup - (state) The name of the active group.
 */
export function activeGroup (state = null, params) {
  switch (params.type) {
    case CHANGE_ACTIVE_GROUP:
      return params.groupName
    default:
      return state
  }
}

/**
 * Takes in state and returns an object for the active group.
 */
export function activeGroupSelector (state) {
  return state.groups.filter(item => item.name === state.activeGroup)[0]
}

/**
 * Takes in state and returns the language of the active group.
 */
export function activeGroupLanguageSelector (state) {
  return state.groups.filter(item => item.name === state.activeGroup)[0]
    .language
}
