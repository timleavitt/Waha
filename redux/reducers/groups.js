//reducer for all actions related to app progress
//TOGGLE_COMPLETE:  marking a lesson as complete or incomplete depending on what
//it currently is 
//RESET_PROGRESS: marks all lessons as incomplete by removing everything from object

//action imports
import { CREATE_GROUP, DELETE_GROUP, TOGGLE_COMPLETE, RESET_PROGRESS, EDIT_GROUP } from '../actions/groupsActions'

export function groups(state = [], action) {
   switch (action.type) {
      case CREATE_GROUP:
         return [...state, { name: action.groupName, progress: [], language: action.language }]
      //return { ...state, [action.groupName]: { progress: {}, language: action.language } }
      case EDIT_GROUP:
         return state.map(group => {
            if (group.name === action.oldGroupName) {
               return {...group, name: action.newGroupName}
            }
            return group
         })
      case DELETE_GROUP:
         return state.filter(group => group.name != action.groupName)
      case TOGGLE_COMPLETE:
         return state.map((item) => {
            if (item.name === action.groupName) {
               if (item.progress.includes(action.lessonID)) {
                  return {...item, progress: item.progress.filter(item => item !== action.lessonID)}
               } else {
                  return {...item, progress: [...item.progress, action.lessonID]}
               }
            }
            return item
          })
      case RESET_PROGRESS:
         return state.map((group) => {
            if (group.name === action.groupName) {
               return {...group, progress: []}
            }
            return group
         })
      default:
         return state
   }
}