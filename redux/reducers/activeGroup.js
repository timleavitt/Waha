import { CHANGE_ACTIVE_GROUP } from '../actions/activeGroupActions'

/**
 * The active group redux reducer that stores the name of the currently active group. This state is persisted across app restarts.
 * @param {Object} action - Parameters passed from groupsAction.js functions.
 * @param {string} activeGroup - (state) The name of the active group.
 */
export function activeGroup (state = null, action) {
  switch (action.type) {
    case CHANGE_ACTIVE_GROUP:
      return action.groupName
    default:
      return state
  }
}
