import { UPDATE_CONNECTION_STATUS } from '../actions/networkActions'

export function network(state = {isConnected: true}, action) {
   switch (action.type) {
      case UPDATE_CONNECTION_STATUS:
         return {isConnected: action.status}
      default:
         return state
   }
}