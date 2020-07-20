export const SET_SECURITY_ENABLED = 'SET_SECURITY_ENABLED'
export const SET_ACTIVATE_ON_SWITCH = 'SET_ACTIVATE_ON_SWITCH'

export function setSecurityEnabled (toSet) {
  return {
    type: SET_SECURITY_ENABLED,
    toSet
  }
}

export function setActivateOnSwitch (toSet) {
  return {
    type: SET_ACTIVATE_ON_SWITCH,
    toSet
  }
}
