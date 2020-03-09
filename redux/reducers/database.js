import {STORE_DATA, FETCH_ERROR} from '../actions/databaseActions'

export function database(state = {}, action) {
    switch (action.type) {
        case STORE_DATA:
            return {...state, [action.language]: action.data}
        default:
            return state
    }
}