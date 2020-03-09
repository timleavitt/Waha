import {STORE_DATA, FETCH_ERROR} from '../actions/databaseActions'

export function database(state = {}, action) {
    switch (action.type) {
        case STORE_DATA:
            console.log(action.data)
            data = action.data
            return {...state, data}
        default:
            return state
    }
}