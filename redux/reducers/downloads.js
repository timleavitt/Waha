import {
  ADD_UPDATE_DOWNLOAD,
  REMOVE_DOWNLOAD
} from '../actions/downloadActions'

// {
//   en.1.1.1: {
//     progress: 0.5,
//     resumable: downloadResumable
//   }
// }

export function downloads (state = {}, action) {
  switch (action.type) {
    case ADD_UPDATE_DOWNLOAD:
      return {
        ...state,
        [action.lessonID]: {
          progress: action.progress,
          resumable: action.resumable
        }
      }
    case REMOVE_DOWNLOAD:
      //get the key of the download we want to delete
      var idToDelete = action.lessonID

      //filters the key that should be deleted then builds a new object from the remaining keys and the initial object.
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
