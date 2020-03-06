import { combineReducers } from 'redux'
import { ADD_UPDATE_DOWNLOAD, REMOVE_DOWNLOAD, PURGE } from './actions'

function downloads(state = {}, action) {
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

export default rootReducer = combineReducers({
    downloads
})