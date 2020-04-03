//reducer for all actions related to app progress
//TOGGLE_COMPLETE:  marking a lesson as complete or incomplete depending on what
//it currently is 
//RESET_PROGRESS: marks all lessons as incomplete by removing everything from object

//action imports
import { CHANGE_ACTIVE_GROUP } from '../actions/groupsActions'

export function activeGroup(state = null, action) {
   switch (action.type) {
      case CHANGE_ACTIVE_GROUP:
         return action.groupName
      default:
         return state
   }
}