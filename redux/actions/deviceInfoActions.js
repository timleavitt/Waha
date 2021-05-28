export const SET_IS_TABLET = 'SET_IS_TABLET'

/**
 * Updates whether the user's device is a tablet or not.
 * @export
 * @param {boolean} isTablet - Whether the user's device is a tablet or not.
 * @return {Object} - Object to send to the reducer.
 */
export function setIsTablet (isTablet) {
  return {
    type: SET_IS_TABLET,
    isTablet
  }
}
