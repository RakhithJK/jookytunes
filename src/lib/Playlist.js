export default class Playlist {
  constructor({ onStatusChanged = () => {} }) {
    this.tracks = [];
    this.currentIndex = null;
    this.isPlaying = false;
    this.onStatusChanged = onStatusChanged;
  }

  publishStatusChange() {
    this.onStatusChanged({
      currentTrack: this.getCurrentTrack(),
      queue: this.tracks.slice(this.currentIndex + 1),
      isPlaying: this.isPlaying,
    });
  }

  play() {
    if (this.isPlaying || this.isEmpty()) {
      return;
    }
    if (this.currentIndex === null) {
      this.currentIndex = 0;
    }
    this.isPlaying = true;
    this.publishStatusChange();
  }

  pause() {
    if (!this.isPlaying) {
      return;
    }
    this.publishStatusChange();
  }

  stop() {
    this.pause();
    this.currentIndex = null;
    this.publishStatusChange();
  }

  isEmpty() {
    return this.tracks.length === 0;
  }

  addTrack(track, options = { autoPlay: true }) {
    const wasEmpty = this.isEmpty();
    this.tracks.push(track);
    this.publishStatusChange();
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
      this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    }
    this.publishStatusChange();
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
    this.publishStatusChange();
  }

  getCurrentTrack() {
    if (this.currentIndex === null || !this.tracks.length) {
      return null;
    }
    return this.tracks[this.currentIndex];
  }

}