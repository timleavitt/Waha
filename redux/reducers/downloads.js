//reducer for all actions related to downloading lessons
//ADD_UPDATE_DOWNLOAD: store download progress of a download in redux to track its progress
//globally
//REMOVE_DOWNLOAD: deletes a download from the object once it's finished
//PURGE: removes all downloads from object in case of errors

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

            //return new object with the lesson we want to delete taken out
            Object.keys(state).reduce((object, key) => {
                if (key !== idToDelete) {
                  object[key] = state[key]
                }
                return object
              }, {})
        case PURGE:
            console.log('purging')
            return {}
        default:
            return state
    }
}