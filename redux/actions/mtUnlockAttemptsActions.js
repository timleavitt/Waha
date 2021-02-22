export const SET_MT_UNLOCK_ATTEMPTS = 'SET_MT_UNLOCK_ATTEMPTS'

/**
 * Sets the number of times the user has tried unsucessfully to unlock the Mobilization Tools.
 * @export
 * @param {boolean} toSet - Whether Security Mode should be enabled or not.
 * @return {Object} - Object to send to the reducer.
 */
export function setMTUnlockAttempts (numAttempts) {
  return {
    type: SET_MT_UNLOCK_ATTEMPTS,
    numAttempts
  }
}
