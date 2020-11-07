import { SET_ARE_MOBILIZATION_TOOLS_UNLOCKED } from '../actions/areMobilizationToolsUnlockedActions'

export function areMobilizationToolsUnlocked (state = false, action) {
  switch (action.type) {
    // note: only stores the active group's names
    case SET_ARE_MOBILIZATION_TOOLS_UNLOCKED:
      return action.toSet
    default:
      return state
  }
}
