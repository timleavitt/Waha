import { getLessonInfo, getSetInfo } from '../../constants'
import {
  logAddStorySet,
  logCompleteLesson,
  logCompleteStorySet,
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

export function changeActiveGroup (groupName) {
  return {
    type: CHANGE_ACTIVE_GROUP,
    groupName
  }
}

export function createGroup (groupName, language, emoji, groupNumber) {
  logCreateGroup(language, groupName, groupNumber)
  return {
    type: CREATE_GROUP,
    groupName,
    language,
    emoji
  }
}

export function editGroup (oldGroupName, newGroupName, emoji) {
  return {
    type: EDIT_GROUP,
    oldGroupName,
    newGroupName,
    emoji
  }
}

export function deleteGroup (groupName) {
  return {
    type: DELETE_GROUP,
    groupName
  }
}

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

export function toggleComplete (groupName, set, lessonIndex) {
  return (dispatch, getState) => {
    var thisLanguage = getState().groups.filter(
      group => group.name === groupName
    )[0].language
    var nextSet = getState().database[thisLanguage].sets.filter(
      dbSet =>
        getSetInfo('category', dbSet.id) === getSetInfo('category', set.id) &&
        getSetInfo('index', dbSet.id) === getSetInfo('index', set.id) + 1
    )[0]
    var thisLesson = set.lessons.filter(
      lesson => getLessonInfo('index', lesson.id) === lessonIndex
    )[0]
    var setLength = set.lessons.length
    var thisGroup = getState().groups.filter(item => item.name === groupName)[0]
    var thisSetProgress = thisGroup.addedSets.filter(
      addedSet => addedSet.id === set.id
    )[0].progress

    // Track analytics.
    if (!thisSetProgress.includes(lessonIndex)) {
      logCompleteLesson(thisLesson, groupName)
    }
    if (
      !thisSetProgress.includes(lessonIndex) &&
      thisSetProgress.length === setLength - 1
    ) {
      logCompleteStorySet(set, groupName)
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
  logAddStorySet(set, groupName)
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
