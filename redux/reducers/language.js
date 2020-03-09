import { CHANGE_LANGUAGE } from '../actions/currentLanguageActions'

export function language(state = {}, action) {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return Object.assign({}, state, {currentLanguage: action.newLanguage})
        default:
            return state;
    } 
}