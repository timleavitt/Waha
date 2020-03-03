import { combineReducers } from 'redux'
import { UPDATE_DOWNLOAD_PROGRESS } from './actions'

const initialState = {
    somethingDownloading: false,
    downloadProgress: 0
}

function downloadProgress(state = initialState, action) {
    switch (action.type) {
        case UPDATE_DOWNLOAD_PROGRESS:
            return Object.assign({}, state, {donwloadProgress: action.progress})
        default: 
            return initialState
    }
}


export default rootReducer = combineReducers({
    downloadProgress
})