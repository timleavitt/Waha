export const SET_SECURITY_ENABLED = 'SET_SECURITY_ENABLED'

export function setSecurityEnabled (toSet) {
  return {
    type: SET_SECURITY_ENABLED,
    toSet
  }
}
