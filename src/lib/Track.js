export default class Track {
  constructor(name, audioFile, cdgData) {
    this.name = name;
    this.audioFile = audioFile;
    this.cdgData = cdgData;
    this.id = new Date();
  }
}
