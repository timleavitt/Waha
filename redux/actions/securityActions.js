export const SET_SECURITY_ENABLED = 'SET_SECURITY_ENABLED'
export const SET_CODE = 'SET_CODE'
export const SET_IS_MUTED = 'SET_IS_MUTED'
export const SET_TIMEOUT_DURATION = 'SET_TIMEOUT_DURATION'
export const SET_TIMER = 'SET_TIMER'
export const SET_IS_TIMED_OUT = 'SET_IS_TIMED_OUT'
export const SET_MT_UNLOCK_TIMEOUT = 'SET_MT_UNLOCK_TIMEOUT'
export const SET_MT_UNLOCK_ATTEMPTS = 'SET_MT_UNLOCK_ATTEMPTS'

/**
 * Sets whether Security Mode is enabled or not.
 * @export
 * @param {boolean} toSet - Whether Security Mode should be enabled or not.
 * @return {Object} - Object to send to the reducer.
 */
export function setSecurityEnabled (toSet) {
  return {
    type: SET_SECURITY_ENABLED,
    toSet
  }
}

/**
 * Sets the code to play on the piano to unlock Waha from the Piano Screen.
 * @export
 * @param {string} code - The unlock code.
 * @return {Object} - Object to send to the reducer.
 */
export function setCode (code) {
  return {
    type: SET_CODE,
    code
  }
}

/**
 * Sets whether the piano on the Piano Screen should be muted or not.
 * @export
 * @param {boolean} toSet - Whether the piano should be muted or not.
 * @return {Object} - Object to send to the reducer.
 */
export function setIsMuted (toSet) {
  return {
    type: SET_IS_MUTED,
    toSet
  }
}

/**
 * Set the timeout duration for Security Mode to activate.
 * @export
 * @param {boolean} ms - The timeout duration in milliseconds.
 * @return {Object} - Object to send to the reducer.
 */
export function setTimeoutDuration (ms) {
  return {
    type: SET_TIMEOUT_DURATION,
    ms
  }
}

/**
 * Sets the Security Mode timer.
 * @export
 * @param {boolean} ms - The amount of time in milliseconds since the app switched to "inactive".
 * @return {Object} - Object to send to the reducer.
 */
export function setTimer (ms) {
  return {
    type: SET_TIMER,
    ms
  }
}

/**
 * Sets whether Security Mode is "timed out" or not.
 * @export
 * @param {boolean} toSet - Whether Security Mode is "timed out" or not.
 * @return {Object} - Object to send to the reducer.
 */
export function setIsTimedOut (toSet) {
  return {
    type: SET_IS_TIMED_OUT,
    toSet
  }
}

/**
 * Sets the Mobilization Tools unlock timeout.
 * @export
 * @param {boolean} time - The amount of time the user has to wait before they can try and unlock the Mobilization Tools again in milliseconds.
 * @return {Object} - Object to send to the reducer.
 */
export function setMTUnlockTimeout (time) {
  return {
    type: SET_MT_UNLOCK_TIMEOUT,
    time
  }
}

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
