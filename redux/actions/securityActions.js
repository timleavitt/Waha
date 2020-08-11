export const SET_SECURITY_ENABLED = 'SET_SECURITY_ENABLED'
export const SET_CODE = 'SET_CODE'
export const SET_IS_MUTED = 'SET_IS_MUTED'
export const SET_TIMEOUT_DURATION = 'SET_TIMEOUT_DURATION'
export const SET_TIMER = 'SET_TIMER'
export const SET_IS_TIMED_OUT = 'SET_IS_TIMED_OUT'

export function setSecurityEnabled (toSet) {
  return {
    type: SET_SECURITY_ENABLED,
    toSet
  }
}

export function setCode (code) {
  return {
    type: SET_CODE,
    code
  }
}

export function setIsMuted (toSet) {
  return {
    type: SET_IS_MUTED,
    toSet
  }
}

export function setTimeoutDuration (ms) {
  // console.log(timeoutMS)
  return {
    type: SET_TIMEOUT_DURATION,
    ms
  }
}

export function setTimer (ms) {
  // console.log(timeoutMS)
  return {
    type: SET_TIMER,
    ms
  }
}

export function setIsTimedOut (toSet) {
  return {
    type: SET_IS_TIMED_OUT,
    toSet
  }
}
