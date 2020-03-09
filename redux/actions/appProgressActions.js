export const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE'
export const RESET_PROGRESS = 'RESET_PROGRESS'

export function toggleComplete(lessonID) {
    return {
        type: TOGGLE_COMPLETE,
        lessonID
    }
}

export function resetProgress() {
    return {
        type: RESET_PROGRESS
    }
}