export const CHANGE_ACTIVE_GROUP = 'CHANGE_ACTIVE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const EDIT_GROUP = 'EDIT_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
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
