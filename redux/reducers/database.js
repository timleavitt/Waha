import { STORE_DATA, FETCH_ERROR, SET_IS_FETCHING, CHANGE_LANGUAGE } from '../actions/databaseActions'

export function database(state = {isFetching: true}, action) {
    switch (action.type) {
        case STORE_DATA:
            return {...state, [action.language]: action.data}
        case CHANGE_LANGUAGE:
            return Object.assign({}, state, {currentLanguage: action.newLanguage})
        case SET_IS_FETCHING:
            return {...state, isFetching: action.isFetching}
        default:
            return state
    }
}