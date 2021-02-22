import { SET_ARE_MOBILIZATION_TOOLS_UNLOCKED } from '../actions/areMobilizationToolsUnlockedActions'

/**
 * The mobilization tools unlock redux reducer that stores whether the mobilization tools are unlocked globally. This is different from whether a group should show the mobilization tools tab or not. Before the user is able to show or hide the tab for a group, they have to enable the mobilization tools globally via this reducer. This state is persisted across app restarts.
 * @param {Object} action - Parameters passed from areMobilizationToolsUnlockedActions.js functions.
 * @param {boolean} areMobilizationToolsUnlocked - (state) Whether the mobilization tools are unlocked globally.
 */
export function areMobilizationToolsUnlocked (state = false, params) {
  switch (params.type) {
    case SET_ARE_MOBILIZATION_TOOLS_UNLOCKED:
      return params.toSet
    default:
      return state
  }
}
