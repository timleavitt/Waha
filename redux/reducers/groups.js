import { getSetInfo } from '../../constants'
import {
  ADD_SET,
  CREATE_GROUP,
  DELETE_GROUP,
  EDIT_GROUP,
  RESET_PROGRESS,
  SET_SHOULD_SHOW_MOBILIZATION_TOOLS_TAB,
  UPDATE_PROGRESS
} from '../actions/groupsActions'

/**
 * The groups redux reducer stores all the information related to groups. This state is persisted across app restarts.
 * @param {Object} params - Parameters passed from groupActions.js functions.
 * @param {Object[]} groups - (state) Stores all the created groups in an array.
 * @param {string} groups[].name - The name of the group.
 * @param {number} groups[].id - The unique ID for the group.
 * @param {string} groups[].language - The language ID associated with the group.
 * @param {string} groups[].emoji - The name of the emoji used for this group's avatar. Called 'default' by default.
 * @param {string} groups[].recentCoreOrTool - The ID of the most recent foundational or mobilization tools set that has completed a lesson. Note: the name is outdated.
 * @param {string} groups[].setBookmark - The ID of the bookmarked set for this group.
 * @param {boolean} groups[].shouldShowMobilizationToolsTab - Whether the mobilization tools tab should show on the story sets screen.
 * @param {Object[]} groups[].addedSets - An array of sets that have been 'added' to this group. The first 2 foundational sets are added automatically upon creating a new group.
 * @param {string} groups[].addedSet[].id - The ID of the added set.
 * @param {number[]} groups[].addedSet[].progress - Stores the progress for this particular set. Each element is a number for the index of the lesson that has been completed. A set with 0 completed lessons would have an empty progress array.
 * @param {number} groups[].addedSet[].bookmark - The index
 */
export function groups (state = [], params) {
  switch (params.type) {
    /**
     * Adds a new group to the state.
     */
    case CREATE_GROUP:
      return [
        ...state,
        {
          name: params.groupName,
          id: params.groupID,
          language: params.language,
          emoji: params.emoji,
          // Set the recent Foundational or Mobilization Tool set and the set bookmark to the Set 1.1.
          recentCoreOrTool: params.language + '.1.1',
          setBookmark: params.language + '.1.1',
          // Adds the first 2 Foundational Story Sets automatically as well as the first 2 Mobilization Tools Sets. Even though the user won't see the MT Sets yet, we add them now, so that when they unlock the MTs later, the sets show up automatically.
          addedSets: [
            {
              id: params.language + '.1.1',
              progress: [],
              bookmark: 1
            },
            {
              id: params.language + '.1.2',
              progress: [],
              bookmark: 1
            },
            {
              id: params.language + '.3.1',
              progress: [],
              bookmark: 1
            },
            {
              id: params.language + '.3.2',
              progress: [],
              bookmark: 1
            }
          ]
        }
      ]
    case EDIT_GROUP:
      return state.map(group => {
        if (group.name === params.oldGroupName) {
          return {
            ...group,
            // Only allowable changes are to the group name and the emoji.
            name: params.newGroupName,
            emoji: params.emoji
          }
        }
        return group
      })
    case DELETE_GROUP:
      return state.filter(group => group.name != params.groupName)
    /**
     * Toggles a lesson as complete or incomplete, and takes care of all of extra functionality that goes along with that.
     */
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
      var setBookmark = params.set.id

      // start recent core or tool as null in case we're on a topical set
      var recentCoreOrTool = null

      // start the lesson bookmark at 0
      var lessonBookmark = 0

      // set the recentcoreortool if this set is a core or toolkit
      if (
        getSetInfo('category', params.set.id) === 'foundational' ||
        getSetInfo('category', params.set.id) === 'mobilization tools'
      )
        recentCoreOrTool = params.set.id

      return state.map(group => {
        // get specified group
        if (group.name === params.groupName) {
          // if we didn't set the most recent core/tool set before, leave it as what it was before
          if (recentCoreOrTool === null)
            recentCoreOrTool = group.recentCoreOrTool

          // change some stuff in our specified group
          return {
            // return the rest of the group stuff as is
            ...group,

            //+ ADDED SETS (progress and lesson bookmark setting)
            addedSets: group.addedSets.map(set => {
              // get the set we're changing
              if (set.id === params.set.id) {
                // if the lesson is already marked as completed, mark it as uncomplete and set the bookmark
                if (set.progress.includes(params.lessonIndex)) {
                  // increment the bookmark until we get to 1 that's incomplete
                  // (including the one we're marking)
                  do {
                    lessonBookmark += 1
                  } while (
                    set.progress.includes(lessonBookmark) &&
                    lessonBookmark !== params.lessonIndex
                  )

                  // return the set with the new bookmark and progress
                  return {
                    ...set,
                    bookmark: lessonBookmark,
                    progress: set.progress.filter(
                      index => index !== params.lessonIndex
                    )
                  }
                  // otherwise, mark it as complete and set the bookmark
                } else {
                  // if we've completed everything in a set
                  if (set.progress.length + 1 === params.setLength) {
                    // if core or toolkit, set to next in that category
                    if (
                      getSetInfo('category', params.set.id) ===
                        'foundational' ||
                      getSetInfo('category', params.set.id) ===
                        'mobilization tools'
                    ) {
                      setBookmark = params.nextSet
                        ? params.nextSet.id
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
                    lessonBookmark === params.lessonIndex
                  )

                  // return the set with the new bookmark and progress
                  return {
                    ...set,
                    bookmark: lessonBookmark,
                    progress: [...set.progress, params.lessonIndex]
                  }
                }
                // return the rest of the sets that we don't care about changing
              } else {
                return set
              }
            }),

            //+ MOST RECENT CORE OR TOOLKIT SET
            recentCoreOrTool: recentCoreOrTool,

            //+ SET BOOKMARK
            setBookmark: setBookmark
          }
        }
        return group
      })
    /**
     * DEPECRATED. Resets the progress for a group.
     */
    case RESET_PROGRESS:
      return state.map(group => {
        if (group.name === params.groupName) {
          return {
            ...group,
            setBookmark: group.language + '.1.1',
            addedSets: group.addedSets.map(set => {
              return { ...set, progress: [], bookmark: 1 }
            })
          }
        }
        return group
      })
    case ADD_SET:
      return state.map(group => {
        if (group.name === params.groupName) {
          return {
            ...group,
            addedSets: [
              ...group.addedSets,
              {
                // The bookmark starts at the first lesson and the progress for this set starts at empty.
                id: params.set.id,
                progress: [],
                bookmark: 1
              }
            ]
          }
        }
        return group
      })
    case SET_SHOULD_SHOW_MOBILIZATION_TOOLS_TAB:
      return state.map(group => {
        if (group.name === params.groupName) {
          return {
            ...group,
            shouldShowMobilizationToolsTab: params.toSet
          }
        }
        return group
      })
    default:
      return state
  }
}
