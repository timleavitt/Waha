export const SET_ARE_MOBILIZATION_TOOLS_UNLOCKED =
  'SET_ARE_MOBILIZATION_TOOLS_UNLOCKED'

/**
 * Sets whether the mobilization tools are unlocked globally or not.
 * @export
 * @param {boolean} toSet - The status to set.
 * @return {Object} - Object to send to the reducer.
 */
export function setAreMobilizationToolsUnlocked (toSet) {
  return {
    type: SET_ARE_MOBILIZATION_TOOLS_UNLOCKED,
    toSet
  }
}
