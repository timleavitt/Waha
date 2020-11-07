export const SET_ARE_MOBILIZATION_TOOLS_UNLOCKED =
  'SET_ARE_MOBILIZATION_TOOLS_UNLOCKED'

export function setAreMobilizationToolsUnlocked (toSet) {
  return {
    type: SET_ARE_MOBILIZATION_TOOLS_UNLOCKED,
    toSet
  }
}
