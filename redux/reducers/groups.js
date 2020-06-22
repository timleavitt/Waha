import {
  CREATE_GROUP,
  DELETE_GROUP,
  UPDATE_PROGRESS,
  RESET_PROGRESS,
  EDIT_GROUP,
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
    case UPDATE_PROGRESS:
      // SET BOOKMARK
      // move set bookmark to the set of the lesson that was just marked as complete

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

      // store the set bookmark to be the set of the lesson
      var setBookmark = action.set.id

      // start recent core or tool as null in case we're on a topical set
      var recentCoreOrTool = null

      // start the lesson bookmark at 0
      var lessonBookmark = 0

      // set the recentcoreortool if this set is a core or toolkit
      if (action.set.category === 'core' || action.set.category === 'toolkit')
        recentCoreOrTool = action.set.id

      return state.map(group => {
        // get specified group
        if (group.name === action.groupName) {
          // if we didn't set the most recent core/tool set before, leave it as what it was before
          if (recentCoreOrTool === null)
            recentCoreOrTool = group.recentCoreOrTool

          // change some stuff in our specified group
          return {
            // return the rest of the group stuff as is
            ...group,

            //// ADDED SETS (progress and lesson bookmark setting)
            addedSets: group.addedSets.map(set => {
              // get the set we're changing
              if (set.id === action.set.id) {
                // if the lesson is already marked as completed, mark it as uncomplete and set the bookmark
                if (set.progress.includes(action.lessonIndex)) {
                  // increment the bookmark until we get to 1 that's incomplete
                  // (including the one we're marking)
                  do {
                    lessonBookmark += 1
                  } while (
                    set.progress.includes(lessonBookmark) &&
                    lessonBookmark !== action.lessonIndex
                  )

                  // return the set with the new bookmark and progress
                  return {
                    ...set,
                    bookmark: lessonBookmark,
                    progress: set.progress.filter(
                      index => index !== action.lessonIndex
                    )
                  }
                  // otherwise, mark it as complete and set the bookmark
                } else {
                  // if we've completed everything in a set
                  if (set.progress.length + 1 === action.set.length) {
                    // if core or toolkit, set to next in that category
                    if (
                      action.set.category === 'core' ||
                      action.set.category === 'toolkit'
                    ) {
                      setBookmark = action.nextSet
                        ? action.nextSet.id
                        : group.setBookmark

                      recentCoreOrTool = setBookmark
                      // if topical, set to recentCoreOrTool
                    } else {
                      setBookmark = recentCoreOrTool
                    }
                  }

                  // increment the bookmark until we get to 1 that's incomplete
                  // (including the one we're marking)
                  do {
                    lessonBookmark += 1
                  } while (
                    set.progress.includes(lessonBookmark) ||
                    lessonBookmark === action.lessonIndex
                  )

                  // return the set with the new bookmark and progress
                  return {
                    ...set,
                    bookmark: lessonBookmark,
                    progress: [...set.progress, action.lessonIndex]
                  }
                }
                // return the rest of the sets that we don't care about changing
              } else {
                return set
              }
            }),

            //// MOST RECENT CORE OR TOOLKIT SET
            recentCoreOrTool: recentCoreOrTool,

            //// SET BOOKMARK
            setBookmark: setBookmark
          }
        }
        return group
      })
    case RESET_PROGRESS:
      return state.map(group => {
        if (group.name === action.groupName) {
          return {
            ...group,
            setBookmark: group.language + '01',
            addedSets: group.addedSets.map(set => {
              return { ...set, progress: [], bookmark: 1 }
            })
          }
        }
        return group
      })

    case ADD_SET:
      return state.map(group => {
        if (group.name === action.groupName) {
          return {
            ...group,
            addedSets: [
              ...group.addedSets,
              {
                id: action.setID,
                progress: [],
                bookmark: 1
              }
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
