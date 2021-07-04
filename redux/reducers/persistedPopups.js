import { SET_SHOW_TRAILER_HIGHLIGHTS } from '../actions/persistedPopupsActions'

/**
 * The popups reducer stores various states for any modals or snackbars that need to be triggered globally. This state is persisted across app restarts.
 * @param {Object} params - Parameters passed from popupsActions.js functions.
 * @param {boolean} popups - (state) The boolean values for whether modals/snackbars that need to be triggered globally are visible.
 */
export function persistedPopups (
  state = {
    showTrailerHighlights: true
  },
  params
) {
  switch (params.type) {
    case SET_SHOW_TRAILER_HIGHLIGHTS:
      return {
        ...state,
        showTrailerHighlights: params.toSet
      }
    default:
      return state
  }
}
