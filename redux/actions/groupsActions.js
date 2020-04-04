export const CHANGE_ACTIVE_GROUP = 'CHANGE_ACTIVE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE'
export const RESET_PROGRESS = 'RESET_PROGRESS'

export function changeActiveGroup(groupName) {
   return {
      type: CHANGE_ACTIVE_GROUP,
      groupName
   }
}

export function createGroup(groupName, language) {
   return {
      type: CREATE_GROUP,
      groupName,
      language
   }
}

export function deleteGroup(groupName) {
   return {
      type: DELETE_GROUP,
      groupName
   }
}

export function toggleComplete(groupName, lessonID) {
    return {
        type: TOGGLE_COMPLETE,
        groupName,
        lessonID
    }
}

export function resetProgress() {
    return {
        type: RESET_PROGRESS
    }
}