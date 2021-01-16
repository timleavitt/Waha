import { getLessonInfo, getSetInfo } from '../../constants'
import {
  logAddStorySet,
  logCompleteLesson,
  logCreateGroup
} from '../LogEventFunctions'

export const CHANGE_ACTIVE_GROUP = 'CHANGE_ACTIVE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const EDIT_GROUP = 'EDIT_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
export const RESET_PROGRESS = 'RESET_PROGRESS'
export const ADD_SET = 'ADD_SET'
export const SET_SHOULD_SHOW_MOBILIZATION_TOOLS_TAB =
  'SET_SHOULD_SHOW_MOBILIZATION_TOOLS_TAB'

/**
 * Changes the active group. Alters state using the activeGroup.js reducer, NOT the groups.js reducer.
 * @export
 * @param {string} groupName The name of the group to switch to.
 * @return {Object} Object to send to the reducer.
 */
export function changeActiveGroup (groupName) {
  return {
    type: CHANGE_ACTIVE_GROUP,
    groupName
  }
}

/**
 * Creates a new group.
 * @export
 * @param {string} groupName The name of the new group.
 * @param {string} language The language ID of the new group.
 * @param {string} emoji The name of the emoji for the new group's avatar.
 * @return {Object} Object to send to the reducer.
 */
export function createGroup (groupName, language, emoji) {
  logCreateGroup(language)
  return {
    type: CREATE_GROUP,
    groupName,
    language,
    emoji
  }
}

/**
 * Edits the information for a group.
 * @export
 * @param {string} oldGroupName The name of the group to edit.
 * @param {string} newGroupName The new name to replace oldGroupName.
 * @param {string} emoji The name of the emoji for the group's avatar.
 * @return {Object} Object to send to the reducer.
 */
export function editGroup (oldGroupName, newGroupName, emoji) {
  return {
    type: EDIT_GROUP,
    oldGroupName,
    newGroupName,
    emoji
  }
}

/**
 * Deletes a group.
 * @export
 * @param {string} groupName The name of the group to delete.
 * @return {Object} Object to send to the reducer.
 */
export function deleteGroup (groupName) {
  return {
    type: DELETE_GROUP,
    groupName
  }
}

/**
 * Update the progress of a set for a group, i.e. marking a lesson within a set complete or incomplete. Only called within the toggleComplete function below.
 * @param {string} groupName The name of the group to update the progress in.
 * @param {Object} set The set to update the progress in.
 * @param {Object} nextSet The set after the one to update the progress in. We need this in case the lesson we're marking as complete finishes a set and the bookmark needs to move onto the next set. This only happens for foundational and mobilization tools sets.
 * @param {number} lessonIndex The index of the lesson within the set we need to mark/unmark as complete.
 * @param {number} setLength The length of the set that the lesson we're updating the progress in is a part of.
 * @return {Object} Object to send to the reducer.
 */
function updateProgress (groupName, set, nextSet, lessonIndex, setLength) {
  return {
    type: UPDATE_PROGRESS,
    groupName,
    set,
    nextSet,
    lessonIndex,
    setLength
  }
}

/**
 * Toggles the complete status of a lesson. This function acts a bridge function. It's called in components but doesn't send anything to the reducer itself. Its purpose is only to use state to get some more information that the above updateProgress function needs in order to work.
 * @export
 * @param {string} groupName The name of the group to update the progress in.
 * @param {Object} set The set to update the progress in.
 * @param {number} lessonIndex The index of the lesson within the set we need to mark/unmark as complete.
 * @return {Object} Object to send to the reducer.
 */
export function toggleComplete (groupName, set, lessonIndex) {
  // set up as thunk function so we can get state and dispatch other actions from within
  return (dispatch, getState) => {
    // get the language for the group we're editing the progress of
    var thisLanguage = getState().groups.filter(
      group => group.name === groupName
    )[0].language

    // get the set AFTER the set we're updating the progress in
    var nextSet = getState().database[thisLanguage].sets.filter(
      dbSet =>
        getSetInfo('category', dbSet.id) === getSetInfo('category', set.id) &&
        getSetInfo('index', dbSet.id) === getSetInfo('index', set.id) + 1
    )[0]

    // get the object for the lesson that we're updating the progress of
    var thisLesson = set.lessons.filter(
      lesson => getLessonInfo('index', lesson.id) === lessonIndex
    )[0]

    // get the length of the set that the lesson we're updating the progress of is in
    var setLength = set.lessons.length
    var thisGroup = getState().groups.filter(item => item.name === groupName)[0]
    var thisSetProgress = thisGroup.addedSets.filter(
      addedSet => addedSet.id === set.id
    )[0].progress
    if (!thisSetProgress.includes(lessonIndex)) {
      logCompleteLesson(thisLesson, set, thisLanguage)
    }
    dispatch(updateProgress(groupName, set, nextSet, lessonIndex, setLength))
  }
}

export function resetProgress (groupName) {
  return {
    type: RESET_PROGRESS,
    groupName
  }
}

export function addSet (groupName, set) {
  logAddStorySet(set)
  return {
    type: ADD_SET,
    groupName,
    set
  }
}

export function setShouldShowMobilizationToolsTab (groupName, toSet) {
  return {
    type: SET_SHOULD_SHOW_MOBILIZATION_TOOLS_TAB,
    groupName,
    toSet
  }
}
