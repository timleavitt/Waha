export const UPDATE_DOWNLOAD_PROGRESS = 'UPDATE_DOWNLOAD_PROGRESS'

export function updateDownloadProgress(progress) {
    return {type: UPDATE_DOWNLOAD_PROGRESS, progress}
}