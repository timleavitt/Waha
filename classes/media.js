import { chapters } from '../constants'

export class Media {
  constructor (audio) {
    this.audio = audio
    this.video = null
  }

  addVideo (video) {
    this.video = video
  }

  load (source, shouldAutoPlay, activeChapter) {
    const media = activeChapter === chapters.TRAINING ? this.video : this.audio
    if (media !== null)
      return media.loadAsync(
        { uri: source },
        {
          // Initial play status depends on whether we should autoplay or not.
          shouldPlay: shouldAutoPlay ? true : false,
          // Call the onPlaybackStatusUpdate function once every second.
          progressUpdateIntervalMillis: 1000
        }
      )
  }

  play (activeChapter) {
    const media = activeChapter === chapters.TRAINING ? this.video : this.audio
    if (media !== null) return media.playAsync()
  }

  pause (activeChapter) {
    const media = activeChapter === chapters.TRAINING ? this.video : this.audio
    if (media !== null) return media.pauseAsync()
  }

  playFromLocation (location, isMediaPlaying, activeChapter) {
    const media = activeChapter === chapters.TRAINING ? this.video : this.audio
    if (media !== null)
      return media.setStatusAsync({
        shouldPlay: isMediaPlaying ? true : false,
        positionMillis: location
      })
  }

  setAudioOnStatusUpdate (onStatusUpdate) {
    if (this.audio !== null)
      this.audio.setOnPlaybackStatusUpdate(onStatusUpdate)
  }

  closeFullscreen () {
    if (this.video !== null) return this.video.dismissFullscreenPlayer()
  }

  openFullscreen () {
    if (this.video !== null) return this.video.presentFullscreenPlayer()
  }

  unload () {
    if (this.audio !== null) this.audio.unloadAsync()
    if (this.video !== null) this.video.unloadAsync()
  }

  cleanup () {
    this.audio = null
    this.video = null
  }
}
