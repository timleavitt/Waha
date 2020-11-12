export const STORE_DOWNLOADS = 'STORE_DOWNLOADS'

export function storeDownloads (resumables) {
  return {
    type: STORE_DOWNLOADS,
    resumables
  }
}
