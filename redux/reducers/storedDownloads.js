import { STORE_DOWNLOADS } from '../actions/storedDownloadsActions'

export function storedDownloads (state = [], action) {
  switch (action.type) {
    case STORE_DOWNLOADS:
      return action.resumables
    default:
      return state
  }
}
