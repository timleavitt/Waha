export const SET_SHOW_TRAILER_HIGHLIGHTS = 'SET_SHOW_TRAILER_HIGHLIGHTS'

export function setShowTrailerHighlights (toSet) {
  return {
    type: SET_SHOW_TRAILER_HIGHLIGHTS,
    toSet
  }
}
