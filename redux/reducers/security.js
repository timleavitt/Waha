import {
  SET_SECURITY_ENABLED,
  SET_ACTIVATE_ON_SWITCH
} from '../actions/securityActions'

export function security (state = {}, action) {
  switch (action.type) {
    // note: only stores the active group's names
    case SET_SECURITY_ENABLED:
      return {
        ...state,
        securityEnabled: action.toSet
      }
    case SET_ACTIVATE_ON_SWITCH:
      return {
        ...state,
        activateOnSwitch: action.toSet
      }
    default:
      return state
  }
}
