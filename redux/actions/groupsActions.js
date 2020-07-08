export const CHANGE_ACTIVE_GROUP = 'CHANGE_ACTIVE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const EDIT_GROUP = 'EDIT_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
export const RESET_PROGRESS = 'RESET_PROGRESS'
export const ADD_SET = 'ADD_SET'
export const SET_SHOW_TOOLKIT = 'SET_SHOW_TOOLKIT'
import * as Analytics from 'expo-firebase-analytics'

export function changeActiveGroup (groupName) {
  return {
    type: CHANGE_ACTIVE_GROUP,
    groupName
  }
}

export function createGroup (groupName, language, emoji) {
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

function updateProgress (groupName, set, nextSet, lessonIndex) {
  return {
    type: UPDATE_PROGRESS,
    groupName,
    set,
    nextSet,
    lessonIndex
  }
}

export function toggleComplete (groupName, set, lessonIndex) {
  logToggleComplete(set)
  return (dispatch, getState) => {
    var thisLanguage = getState().groups.filter(
      group => group.name === groupName
    )[0].language
    var nextSet = getState().database[thisLanguage].sets.filter(
      dbSet => dbSet.category === set.category && dbSet.index === set.index + 1
    )[0]
    dispatch(updateProgress(groupName, set, nextSet, lessonIndex))
  }
}

async function logToggleComplete (set) {
  console.log('beep')
  await Analytics.logEvent('LessonComplete', {
    set: set.title
  })
}

export function resetProgress (groupName) {
  return {
    type: RESET_PROGRESS,
    groupName
  }
}

export function addSet (groupName, setID) {
  return {
    type: ADD_SET,
    groupName,
    setID
  }
}

export function setShowToolkit (groupName, toSet) {
  return {
    type: SET_SHOW_TOOLKIT,
    groupName,
    toSet
  }
}
