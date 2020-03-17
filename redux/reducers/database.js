//reducer for all actions related to firebase/redux database
//STORE_DATA: store a json for the language you want to add in redux
//CHANGE_LANGUAGE: change the currently selected language
//SET_IS_FETCHING: store whether we're fetching in redux so we can render
//components appropriately (we can't populate screens until we've fetched from firebase)
//FETCH_ERROR: stll todo

//action imports
import { STORE_DATA, FETCH_ERROR, SET_IS_FETCHING, CHANGE_LANGUAGE, SET_FIRST_OPEN } from '../actions/databaseActions'

export function database(state = {isFetching: true, isFirstOpen: true}, action) {
    switch (action.type) {
        case STORE_DATA:
            return {...state, [action.language]: action.data}
        case CHANGE_LANGUAGE:
            return Object.assign({}, state, {currentLanguage: action.newLanguage})
        case SET_IS_FETCHING:
            return {...state, isFetching: action.isFetching}
        case SET_FIRST_OPEN:
            return {...state, isFirstOpen: action.isFirstOpen}
        default:
            return state
    }
}