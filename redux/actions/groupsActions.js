export const CHANGE_ACTIVE_GROUP = 'CHANGE_ACTIVE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const EDIT_GROUP = 'EDIT_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE'
export const SET_BOOKMARK = 'SET_BOOKMARK'
export const RESET_PROGRESS = 'RESET_PROGRESS'
export const ADD_SET = 'ADD_SET'
export const SET_SHOW_TOOLKIT = 'SET_SHOW_TOOLKIT'

export function changeActiveGroup (groupName) {
  return {
    type: CHANGE_ACTIVE_GROUP,
    groupName
  }
}

export function createGroup (groupName, language, imageSource) {
  return {
    type: CREATE_GROUP,
    groupName,
    language,
    imageSource
  }
}

export function editGroup (oldGroupName, newGroupName, imageSource) {
  return {
    type: EDIT_GROUP,
    oldGroupName,
    newGroupName,
    imageSource
  }
}

export function deleteGroup (groupName) {
  return {
    type: DELETE_GROUP,
    groupName
  }
}

export function toggleComplete (groupName, set, lessonIndex) {
  return {
    type: TOGGLE_COMPLETE,
    groupName,
    set,
    lessonIndex
  }
}

export function setBookmark (groupName) {
  return {
    type: SET_BOOKMARK,
    groupName
  }
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
