export default class Track {
  constructor({ title, artist, digest, audioData, cdgData }) {
    if (!digest) {
      throw new Error("Must have digest!");
    }
    this.digest = digest;
    this.title = title;
    this.artist = artist;
    this.audioData = audioData;
    this.cdgData = cdgData;
  }

  getCachedData() {
    if (this.audioData && this.cdgData) {
      return {
        audioData: this.audioData,
        cdgData: this.cdgData,
      };
    }
    return null;
  }

  clearCachedData() {
    this.cdgData = null;
    this.audioData = null;
  }

  static async getDigest(audioData, cdgData) {
    const combined = new Uint8Array([...audioData, ...cdgData]);
    const digestBuffer = await crypto.subtle.digest("SHA-256", combined);
    const digestArray = Array.from(new Uint8Array(digestBuffer));
    const digestHex = digestArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return digestHex;
  }

  static async fromData(title, artist, rawAudioData, rawCdgData) {
    const audioData = new Uint8Array(rawAudioData);
    const cdgData = new Uint8Array(rawCdgData);
    const digest = await Track.getDigest(audioData, cdgData);
    return new Track({
      title,
      artist,
      audioData,
      cdgData,
      digest,
    });
  }
}
