export const CHANGE_ACTIVE_GROUP = 'CHANGE_ACTIVE_GROUP'

/**
 * Changes the active group. Alters state using the activeGroup.js reducer, NOT the groups.js reducer.
 * @export
 * @param {string} groupName - The name of the group to switch to.
 * @return {Object} - Object to send to the reducer.
 */
export function changeActiveGroup (groupName) {
  return {
    type: CHANGE_ACTIVE_GROUP,
    groupName
  }
}
