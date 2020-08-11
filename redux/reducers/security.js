import {
  SET_CODE,
  SET_IS_MUTED,
  SET_IS_TIMED_OUT,
  SET_SECURITY_ENABLED,
  SET_TIMEOUT_DURATION,
  SET_TIMER
} from '../actions/securityActions'

export function security (state = { timeoutDuration: null }, action) {
  switch (action.type) {
    // note: only stores the active group's names
    case SET_SECURITY_ENABLED:
      return {
        ...state,
        securityEnabled: action.toSet
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
    case SET_TIMEOUT_DURATION:
      return {
        ...state,
        timeoutDuration: action.ms
      }
    case SET_TIMER:
      return {
        ...state,
        timer: action.ms
      }
    case SET_IS_TIMED_OUT:
      return {
        ...state,
        isTimedOut: action.toSet
      }
    default:
      return state
  }
}
