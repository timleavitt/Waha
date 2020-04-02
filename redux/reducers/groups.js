//reducer for all actions related to app progress
//TOGGLE_COMPLETE:  marking a lesson as complete or incomplete depending on what
//it currently is 
//RESET_PROGRESS: marks all lessons as incomplete by removing everything from object

//action imports
import { CHANGE_ACTIVE_GROUP, CREATE_GROUP, DELETE_GROUP } from '../actions/groupsActions'

export function groups(state = {}, action) {
   switch (action.type) {
      case CHANGE_ACTIVE_GROUP:
         return { ...state, activeGroup: action.groupName }
      case CREATE_GROUP:
         return { ...state, [action.groupName]: { progress: {}, language: action.language } }
      case DELETE_GROUP:
         var groupNameToDelete = action.groupName
         const { [groupNameToDelete]: value, ...newObject } = state;
         return newObject
      default:
         return state
   }
}