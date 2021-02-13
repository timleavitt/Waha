import { SET_MT_UNLOCK_ATTEMPTS } from '../actions/securityActions'

/**
 * This reducer stores the number of times that the user has unsuccessfully attempted to unlock the Mobilization Tools. After a few attempts, the app will lock out the user from attempting to unlock them for 30 minutes.
 * @param {Object} action - Parameters passed from securityActions.js functions.
 * @param {number} mtUnlockAttempts - (state) The number of times that the user has unsuccessfully attempted to unlock the Mobilization Tools. Defaults to 0.
 */
export function mtUnlockAttempts (state = 0, action) {
  switch (action.type) {
    case SET_MT_UNLOCK_ATTEMPTS:
      return action.numAttempts
    default:
      return state
  }
}
