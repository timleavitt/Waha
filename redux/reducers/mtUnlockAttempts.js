import { SET_MT_UNLOCK_ATTEMPTS } from '../actions/securityActions'

export function mtUnlockAttempts (state = 0, action) {
  switch (action.type) {
    case SET_MT_UNLOCK_ATTEMPTS:
      return action.numAttempts
    default:
      return state
  }
}
