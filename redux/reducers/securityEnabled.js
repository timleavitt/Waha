import { SET_SECURITY_ENABLED } from '../actions/securityEnabledActions'

export function securityEnabled (state = false, action) {
  switch (action.type) {
    // note: only stores the active group's names
    case SET_SECURITY_ENABLED:
      return action.toSet
    default:
      return state
  }
}
