//reducer for all actions related to downloading lessons
//ADD_UPDATE_DOWNLOAD: store download progress of a download in redux to track its progress
//globally
//REMOVE_DOWNLOAD: deletes a download from the object once it's finished

//action imports
import { ADD_UPDATE_DOWNLOAD, REMOVE_DOWNLOAD, PURGE } from '../actions/downloadActions'

export function downloads(state = {}, action) {
    switch (action.type) {
        case ADD_UPDATE_DOWNLOAD:
            return  {
                ...state, [action.lessonID]: action.progress
            }
        case REMOVE_DOWNLOAD:
            //get the key of the download we want to delete
            var idToDelete = action.lessonID

            //filters the key that should be deleted then builds a new object from the remaining keys and the initial object.
            return Object.keys(state)
                .filter(key => key !== idToDelete)
                .reduce((result, current) => {
                result[current] = state[current];
                return result;
            }, {});
        default:
            return state
    }
}