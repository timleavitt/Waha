import { SET_IS_FETCHING } from '../actions/isFetchingActions'

export function isFetching (state = false, action) {
  switch (action.type) {
    case SET_IS_FETCHING:
      // true whenever we're getting data from firebase
      return action.isFetching
    default:
      return state
  }
}
