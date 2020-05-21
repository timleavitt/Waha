import { SET_TOOLKIT_ENABLED } from '../actions/toolkitEnabledActions'

export function toolkitEnabled (state = false, action) {
  switch (action.type) {
    // note: only stores the active group's names
    case SET_TOOLKIT_ENABLED:
      return action.toSet
    default:
      return state
  }
}
