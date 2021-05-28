import { SET_IS_TABLET } from '../actions/deviceInfoActions'

/**
 * This reducer stores whether the app is connected to the internet or not. This state is persisted across app restarts.
 * @param {Object} action - Parameters passed from networkActions.js functions.
 * @param {Object} deviceInfo - (state) Stores information related to the user's device.
 * @param {boolean} deviceInfo.isTablet - WWhether the user's device is a tablet or not.
 */
export function deviceInfo (state = { isTablet: false }, params) {
  switch (params.type) {
    case SET_IS_TABLET:
      return { isTablet: params.isTablet }
    default:
      return state
  }
}
