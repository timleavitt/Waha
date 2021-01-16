import { CHANGE_ACTIVE_GROUP } from '../actions/groupsActions'

/**
 * The active group redux reducer that stores the name of the currently active group.
 * @param {*} action Parameters passed from
 */
export function activeGroup (state = null, action) {
  switch (action.type) {
    // note: only stores the active group's names
    case CHANGE_ACTIVE_GROUP:
      return action.groupName
    default:
      return state
  }
}
