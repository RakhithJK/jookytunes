export default class Playlist {
  constructor({ onTracksChanged = () => {}, onCurrentTrackChanged = () => {}, onPlayPause = () => {} }) {
    this.tracks = [];
    this.currentIndex = null;
    this.isPlaying = false;
    this.onTracksChanged = onTracksChanged;
    this.onCurrentTrackChanged = onCurrentTrackChanged;
    this.onPlayPause = onPlayPause;
  }

  play() {
    if (this.isPlaying || this.isEmpty()) {
      return;
    }
    if (this.currentIndex === null) {
      this.currentIndex = 0;
    }
    this.isPlaying = true;
    this.onPlayPause(this.isPlaying);
    this.onCurrentTrackChanged(this.getCurrentTrack());
  }

  pause() {
    if (!this.isPlaying) {
      return;
    }
    this.onPlayPause(this.isPlaying);
  }

  stop() {
    this.pause();
    this.onCurrentTrackChanged(this.getCurrentTrack());
    this.currentIndex = null;
  }

  isEmpty() {
    return this.tracks.length === 0;
  }

  addTrack(track, options = { autoPlay: true }) {
    const wasEmpty = this.isEmpty();
    this.tracks.push(track);
    this.onTracksChanged([...this.tracks]);
    if (wasEmpty && options.autoPlay) {
      this.play();
    }
  }

  nextTrack() {
    if (this.isEmpty()) {
      return;
    }
    if (this.currentIndex === null) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = (this.currentIndex + 1 ) % this.tracks.length;
    }
    this.onCurrentTrackChanged(this.getCurrentTrack());
  }

  // Like `next()`, but stops & does not loop around if at end of playlist.
  advance() {
    if (!this.isPlaying) {
      return;
    }
    if (this.currentIndex === (this.tracks.length - 1)) {
      this.stop();
    } else {
      this.nextTrack();
    }
  }

  previousTrack() {
    if (this.isEmpty()) {
      return;
    }
    if (this.currentIndex === null) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = (this.currentIndex - 1) % this.tracks.length;
    }
    this.onCurrentTrackChanged(this.getCurrentTrack());
  }

  getCurrentTrack() {
    if (this.currentIndex === null || !this.tracks.length) {
      return null;
    }
    return this.tracks[this.currentIndex];
  }

}