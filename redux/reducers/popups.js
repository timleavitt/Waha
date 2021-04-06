import { SET_SHOW_MT_TAB_ADDED_SNACKBAR } from '../actions/popupsActions'

/**
 * The popups reducer stores various states for any modals or snackbars that need to be triggered globally. This state is persisted across app restarts.
 * @param {Object} params - Parameters passed from popupsActions.js functions.
 * @param {boolean} popups - (state) The boolean values for whether modals/snackbars that need to be triggered globally are visible.
 */
export function popups (
  state = {
    showMTTabAddedSnackbar: false
  },
  params
) {
  switch (params.type) {
    case SET_SHOW_MT_TAB_ADDED_SNACKBAR:
      return {
        ...state,
        showMTTabAddedSnackbar: params.toSet
      }
    default:
      return state
  }
}
