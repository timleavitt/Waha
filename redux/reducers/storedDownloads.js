import { STORE_DOWNLOADS } from '../actions/storedDownloadsActions'

/**
 * This reducer stores the download resumables of any downloading core files so they can be cancelled if necessary. These are separate from those in the downloads.js reducer. These resumables are only for core files, which are downloaded immediately upon a language instance install. The reason we store these is so that we have the option to cancel the downloads, thus cancelling our language install. This state is NOT persisted across app restarts.
 * @param {Object} action - Parameters passed from storedDownloadsActions.js functions.
 * @param {Object[]} storedDownloads - (state) An array of download resumable objects.
 */
export function storedDownloads (state = [], params) {
  switch (params.type) {
    case STORE_DOWNLOADS:
      return params.resumables
    default:
      return state
  }
}
