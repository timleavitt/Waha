import {
  SET_ACTIVATE_ON_SWITCH,
  SET_CODE,
  SET_IS_MUTED,
  SET_SECURITY_ENABLED
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
    case SET_CODE:
      return {
        ...state,
        code: action.code
      }
    case SET_IS_MUTED:
      return {
        ...state,
        isMuted: action.toSet
      }
    default:
      return state
  }
}
