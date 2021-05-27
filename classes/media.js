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
    return media.playAsync()
  }

  pause (activeChapter) {
    const media = activeChapter === chapters.TRAINING ? this.video : this.audio
    return media.pauseAsync()
  }

  playFromLocation (location, isMediaPlaying, activeChapter) {
    const media = activeChapter === chapters.TRAINING ? this.video : this.audio
    return media.setStatusAsync({
      shouldPlay: isMediaPlaying ? true : false,
      positionMillis: location
    })
  }

  setAudioOnStatusUpdate (onStatusUpdate) {
    this.audio.setOnPlaybackStatusUpdate(onStatusUpdate)
  }

  closeFullscreen () {
    return this.video.dismissFullscreenPlayer()
  }

  unload () {
    if (this.audio) this.audio.unloadAsync()
    if (this.video) this.video.unloadAsync()
  }

  cleanup () {
    this.audio = null
    this.video = null
  }
}
