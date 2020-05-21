export const SET_TOOLKIT_ENABLED = 'SET_TOOLKIT_ENABLED'

export function setToolkitEnabled (toSet) {
  return {
    type: SET_TOOLKIT_ENABLED,
    toSet
  }
}
