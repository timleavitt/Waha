//reducer for all actions related to app progress
//TOGGLE_COMPLETE:  marking a lesson as complete or incomplete depending on what
//it currently is 
//RESET_PROGRESS: marks all lessons as incomplete by removing everything from object

//action imports
import { CREATE_GROUP, DELETE_GROUP, TOGGLE_COMPLETE, RESET_PROGRESS, EDIT_GROUP, SET_BOOKMARK } from '../actions/groupsActions'

export function groups(state = [], action) {
   switch (action.type) {
      case CREATE_GROUP:
         return [...state, { name: action.groupName, progress: [], language: action.language, imageSource: action.imageSource, bookmark: action.language + '0101' }]
      //return { ...state, [action.groupName]: { progress: {}, language: action.language } }
      case EDIT_GROUP:
         return state.map(group => {
            if (group.name === action.oldGroupName) {
               return { ...group, name: action.newGroupName, imageSource: action.imageSource }
            }
            return group
         })
      case DELETE_GROUP:
         return state.filter(group => group.name != action.groupName)
      case TOGGLE_COMPLETE:
         return state.map(group => {
            if (group.name === action.groupName) {
               if (group.progress.includes(action.lessonID)) {
                  return { ...group, progress: group.progress.filter(id => id !== action.lessonID) }
               } else {
                  return { ...group, progress: [...group.progress, action.lessonID] }
               }
            }
            return group
         })
      case SET_BOOKMARK:
         var thisGroup = state.filter(group => group.name === action.groupName)[0]
         var bookmarkID = ''
         var bookmarkInt = 0;

         //if a group has no progress, return the first lesson in the first study set
         if (thisGroup.progress.length === 0) {
            bookmarkID = thisGroup.language + '0101'
         }

         //set the bookmark first to whatever the highest completed lesson is
         thisGroup.progress.forEach(lessonID => {
            if (parseInt(lessonID.slice(-4)) > bookmarkInt)
               bookmarkInt = parseInt(lessonID.slice(-4))
         })

         //string of the id of the last completed lesson 
         var bookmarkString = bookmarkInt.toString();
         var extraZero = ''
         if (bookmarkString.length < 4)
            extraZero = '0'
         bookmarkString = extraZero + bookmarkString

         var lessonListOfBookmarkStudySet = thisGroupDatabase.studySets.filter(
            studySet => (studySet.id).slice(2, 4) === bookmarkString.slice(0, 2)
         )[0].lessons

      // //edge case: the last completed lesson is the last in a study set
      // if (parseInt(bookmarkString.slice(-2)) === lessonListOfBookmarkStudySet.length) {
      //    //edge case: the last completed lesson is the last available lesson in any study set
      //    if (parseInt(bookmarkString.slice(0, 2)) === thisGroupDatabase.studySets.length) {
      //       return ('Contact us for more study sets!')
      //    } else {
      //       bookmarkString = (extraZero + (parseInt(bookmarkString.slice(0, 2)) + 1)).toString().concat(bookmarkString.slice(-2))
      //       lessonListOfBookmarkStudySet = thisGroupDatabase.studySets.filter(
      //          studySet => (studySet.id).slice(2, 4) === bookmarkString.slice(0, 2)
      //       )[0].lessons
      //       bookmarkLesson = lessonListOfBookmarkStudySet.filter(
      //          lesson => lesson.id === (lesson.id).slice(0, 2).concat(bookmarkString.slice(0, 2), '01')
      //       )
      //    }

      //    //normal case
      // } else {
      //    //get the lesson AFTER the last completed lesson 
      //    bookmarkLesson = lessonListOfBookmarkStudySet.filter(
      //       lesson => lesson.id === (lesson.id).slice(0, 2).concat(extraZero, (parseInt(bookmarkString) + 1).toString())
      //    )
      // }
      return state.map(group => {
         if (group.name === action.groupName) {
            return { ...group, bookmark: bookmarkID }
         }
         return group
      })

      case RESET_PROGRESS:
         return state.map((group) => {
            if (group.name === action.groupName) {
               return { ...group, progress: [] }
            }
            return group
         })
      default:
         return state
   }
}