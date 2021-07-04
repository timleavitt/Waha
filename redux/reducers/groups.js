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
          shouldShowMobilizationToolsTab: params.shouldShowMobilizationToolsTab,
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
            emoji: params.emoji,
            shouldShowMobilizationToolsTab:
              params.shouldShowMobilizationToolsTab
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
      // By default, the bookmarked set is the set that has had a lesson completed most recently, i.e. the set of the lesson that was just marked as complete.
      var idOfBookmarkedSet = params.set.id

      // If we complete a Topical set, the set bookmark defaults back to the most recent Foundational or Mobilization Tools set that has had a lesson completed. We start it off as null because we don't want to update it if the lesson that has just been completed is a Topical lesson.
      var mostRecentlyUpdatedFoundationalOrMTSet = null

      // The bookmarked lesson should start at the first lesson by default, since we iterate through the lessons of a set until we find the first one that hasn't been completed. This is what the bookmark will be.
      var indexOfBookmarkedLesson = 0

      // If the set that had a lesson completed is a Foundational or Mobilization Tools one, update the recentCoreOrTool variable.
      if (
        getSetInfo('category', params.set.id) === 'Foundational' ||
        getSetInfo('category', params.set.id) === 'MobilizationTools'
      )
        mostRecentlyUpdatedFoundationalOrMTSet = params.set.id

      // We're going to map the groups array.
      return state.map(group => {
        // The active group gets updated and the rest get returned as they are.
        if (group.name !== params.groupName) return group

        // If recentCoreOrTool wasn't changed earlier, then leave it the same as it was before this lesson was marked as complete.
        if (mostRecentlyUpdatedFoundationalOrMTSet === null)
          mostRecentlyUpdatedFoundationalOrMTSet = group.recentCoreOrTool

        // Update the object for the active group.
        return {
          // Return the rest of the keys for the active group that aren't being changed below.
          ...group,

          // In addedSets, we'll update the progress and bookmark of the set and lesson.
          addedSets: group.addedSets.map(set => {
            // Update only the set that had a lesson completed.
            if (set.id !== params.set.id) return set

            // If the lesson was marked as incomplete, update the set progress and change the bookmark.
            if (set.progress.includes(params.lessonIndex)) {
              // Increment the lesson bookmark until we find one that hasn't been completed. It could be the one that just got marked as complete.
              do indexOfBookmarkedLesson += 1
              while (
                set.progress.includes(indexOfBookmarkedLesson) &&
                indexOfBookmarkedLesson !== params.lessonIndex
              )

              // Return the set with the new bookmark and progress with this lesson removed.
              return {
                ...set,
                bookmark: indexOfBookmarkedLesson,
                progress: set.progress.filter(
                  index => index !== params.lessonIndex
                )
              }
            } // If we're marking a lesson as complete, check for a fully complete set and update the bookmark and progress.
            else {
              // If this lesson will complete a set, we have some special things to do.
              if (set.progress.length + 1 === params.setLength) {
                // If the set that is being completed is a Foundational or Mobilization Tools set, we need to change the set bookmark to the set AFTER the one that just got completed.
                if (
                  getSetInfo('category', params.set.id) === 'Foundational' ||
                  getSetInfo('category', params.set.id) === 'MobilizationTools'
                ) {
                  idOfBookmarkedSet = params.nextSet
                    ? params.nextSet.id
                    : group.setBookmark

                  // We also need to update the recent Foundataionl/MT set to the new one.
                  mostRecentlyUpdatedFoundationalOrMTSet = idOfBookmarkedSet
                } // If the set that is being completed is a Topical, change the set bookmark to the most recently updated Foundational/MT set.
                else idOfBookmarkedSet = mostRecentlyUpdatedFoundationalOrMTSet
              }

              // Increment the lesson bookmark until we find one that hasn't been completed. The one that just got marked as complete is exempt.
              do indexOfBookmarkedLesson += 1
              while (
                set.progress.includes(indexOfBookmarkedLesson) ||
                indexOfBookmarkedLesson === params.lessonIndex
              )

              // Return the set with the new bookmark and the completed lesson added to the progress.
              return {
                ...set,
                bookmark: indexOfBookmarkedLesson,
                progress: [...set.progress, params.lessonIndex]
              }
            }
          }),

          // Set the recent Foundational or MT Set and the bookmarked set for this group.
          recentCoreOrTool: mostRecentlyUpdatedFoundationalOrMTSet,
          setBookmark: idOfBookmarkedSet
        }
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
