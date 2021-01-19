import {
  ADD_UPDATE_DOWNLOAD,
  REMOVE_DOWNLOAD
} from '../actions/downloadActions'

/**
 * The downloads reducer stores the progress for any active lesson downloads. Downloads that happen during the initial install of a language are NOT stored here. They are handled by the database.js reducer and the databaseActions.js. This is only for downloading lesson scripture audio files or lesson video files. This state NOT is persisted across app restarts, so all downloads are cancelled if the user quits the app.
 * @param {Object} action - Parameters passed from groupActions.js functions.
 * @param {Object} downloads - (state) All of the currently active downloads. Each key is the ID of the lesson that is downloading so that multiple lesson downloads can be stored at once.
 * @param {number} downloads[lessonID].progress - The progress of this lesson's download from 0 to 1.
 * @param {Object} downloads[lessonID].resumable - The resumable object for this lesson's download saved from the expo download object. This is stored so that we can "cancel" the download later. In this case, cancelling means pausing the download and never resuming it since expo doesn't have a cancel download function.
 */
export function downloads (state = {}, action) {
  switch (action.type) {
    /**
     * Adds or updates the progress for a download in the downloads state. The reason these are grouped into one is because the functionality is the same. If the lesson ID is found in the object, it replaces it (updates it). If it's not, it adds it.
     */
    case ADD_UPDATE_DOWNLOAD:
      return {
        ...state,
        [action.lessonID]: {
          progress: action.progress,
          resumable: action.resumable
        }
      }
    /**
     * Removes a download from the downloads state.
     */
    case REMOVE_DOWNLOAD:
      // get the key of the download we want to delete
      var idToDelete = action.lessonID

      // filters the key that should be deleted, then builds a new object from the remaining keys and the initial object
      return Object.keys(state)
        .filter(key => key !== idToDelete)
        .reduce((result, current) => {
          result[current] = state[current]
          return result
        }, {})
    default:
      return state
  }
}
