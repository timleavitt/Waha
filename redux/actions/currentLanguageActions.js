export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'

export function changeLanguage(newLanguage) {
    return {
        type: CHANGE_LANGUAGE,
        newLanguage
    }
}