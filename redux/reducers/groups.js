import {
  CREATE_GROUP,
  DELETE_GROUP,
  TOGGLE_COMPLETE,
  RESET_PROGRESS,
  EDIT_GROUP,
  SET_BOOKMARK,
  ADD_SET,
  SET_SHOW_TOOLKIT
} from '../actions/groupsActions'

export function groups (state = [], action) {
  switch (action.type) {
    case CREATE_GROUP:
      return [
        ...state,
        {
          name: action.groupName,
          language: action.language,
          imageSource: action.imageSource,
          recentCoreOrTool: action.language + '01',
          setBookmark: action.language + '01',
          addedSets: [
            {
              id: action.language + '01',
              progress: [],
              bookmark: 1
            },
            {
              id: action.language + '02',
              progress: [],
              bookmark: 1
            }
          ],
          showToolkit: false
        }
      ]
    case EDIT_GROUP:
      // only 2 things that the user can edit are the name and the image
      return state.map(group => {
        if (group.name === action.oldGroupName) {
          return {
            ...group,
            name: action.newGroupName,
            imageSource: action.imageSource
          }
        }
        return group
      })
    case DELETE_GROUP:
      return state.filter(group => group.name != action.groupName)
    case TOGGLE_COMPLETE:
      // SET BOOKMARK
      // move set bookmark to the set of the lesson that was just marked as complete
      console.log(action.set)
      var setBookmark = action.set.id
      var recentCoreOrTool = null
      var lessonBookmark = 0

      if (action.set.category === 'core' || action.set.category === 'toolkit')
        recentCoreOrTool = action.set.id

      // MOST RECENT
      // check if the set is core or toolkit
      //    -> if it is, set the recentCoreOrTool to this set
      //    -> if it isn't, do nothing

      // PROGRESS
      // check if lesson index is already in progress for this set
      //    -> if it isn't, add lesson index to progress for the set with this lesson
      //    -> if it is, remove lesson index from progress for this set

      // LESSON BOOKMARK
      // set bookmark to earliest uncompleted lesson in this set

      // AUTO-UNLOCK SET
      // check if the set for this lesson is a core story set and is 75% completed
      //    -> if it is, unlock the next core story set automatically

      // WHAT TO DO ON FULLY COMPLETED
      // check if the set for this lesson is fully completed
      //    -> if it is now, check if it's a core/toolkit or topical
      //       -> if it's topical, move the set bookmark to whatever set is stored in
      //       -> if it's a core or toolkit, move the set bookmark to the next in the progression

      return state.map(group => {
        // get specified group
        if (group.name === action.groupName) {
          // if we didn't set the most recent core/tool set before, leave it as what it was before
          if (recentCoreOrTool === null)
            recentCoreOrTool = group.recentCoreOrTool
          // change some stuff in our specified group
          return {
            ...group,
            addedSets: group.addedSets.map(set => {
              // get the set we're changing
              if (set.id === action.set.id) {
                // get earliest uncompleted lesson

                // if the lesson is already marked as completed, mark it as uncomplete and set the bookmark
                if (set.progress.includes(action.lessonIndex)) {
                  do {
                    lessonBookmark += 1
                  } while (
                    set.progress.includes(lessonBookmark) &&
                    lessonBookmark !== action.lessonIndex
                  )

                  return {
                    ...set,
                    bookmark: lessonBookmark,
                    progress: set.progress.filter(
                      id => id !== action.lessonIndex
                    )
                  }
                  // otherwise, mark it as complete and set the bookmark
                } else {
                  do {
                    lessonBookmark += 1
                  } while (
                    set.progress.includes(lessonBookmark) ||
                    lessonBookmark === action.lessonIndex
                  )

                  return {
                    ...set,
                    bookmark: lessonBookmark,
                    progress: [...set.progress, action.lessonIndex]
                  }
                }
              } else {
                return set
              }
            }),
            recentCoreOrTool: recentCoreOrTool,
            setBookmark: setBookmark
          }
        }
        return group
      })

    case SET_BOOKMARK:
      var thisGroup = state.filter(group => group.name === action.groupName)[0]
      var bookmarkIndex = 0

      // increase bookmark index until we get to a lesson that isn't completed
      do {
        bookmarkIndex += 1
      } while (thisGroup.progress.includes(bookmarkIndex))

      return state.map(group => {
        if (group.name === action.groupName) {
          return { ...group, bookmark: bookmarkIndex }
        }
        return group
      })

    case RESET_PROGRESS:
      return state.map(group => {
        if (group.name === action.groupName) {
          return { ...group, progress: [] }
        }
        return groupq
      })

    case ADD_SET:
      return state.map(group => {
        if (group.name === action.groupName) {
          return {
            ...group,
            addedSets: [
              ...group.addedSets,
              { id: action.setID, progress: [], bookmark: 1 }
            ]
          }
        }
        return group
      })
    case SET_SHOW_TOOLKIT:
      return state.map(group => {
        if (group.name === action.groupName) {
          return { ...group, showToolkit: action.toSet }
        }
        return group
      })
    default:
      return state
  }
}
