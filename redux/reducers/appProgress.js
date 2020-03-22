//reducer for all actions related to app progress
//TOGGLE_COMPLETE:  marking a lesson as complete or incomplete depending on what
//it currently is 
//RESET_PROGRESS: marks all lessons as incomplete by removing everything from object

//action imports
import { TOGGLE_COMPLETE, RESET_PROGRESS } from '../actions/appProgressActions'

export function appProgress(state = {}, action) {
    switch (action.type) {
        case TOGGLE_COMPLETE:
            if (action.lessonID in state) {
                var idToDelete = action.lessonID
                const { [idToDelete]: value, ...newObject } = state;
                return newObject
            } else {
                return {...state, [action.lessonID]: 'complete'}
            }
        case RESET_PROGRESS: 
            return {}
        default:
            return state
    }
}