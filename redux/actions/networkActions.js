export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS'

export function updateConnectionStatus(status) {
   return {
      type: UPDATE_CONNECTION_STATUS,
      status
   }
}