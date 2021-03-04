import { UPDATE_CONNECTION_STATUS } from '../actions/networkActions'

/**
 * This reducer stores whether the app is connected to the internet or not. This state is persisted across app restarts.
 * @param {Object} action - Parameters passed from networkActions.js functions.
 * @param {Object} network - (state) Stores information related to the app's network connection.
 * @param {boolean} network.isConnected - Whether the app is connected to the internet or not. Defaults to true.
 */
export function network (state = { isConnected: true }, params) {
  switch (params.type) {
    case UPDATE_CONNECTION_STATUS:
      return { isConnected: params.status }
    default:
      return state
  }
}
