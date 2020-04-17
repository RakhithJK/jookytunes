import { encode as b64encode, decode as b64decode } from "base64-arraybuffer";

export default class Track {
  constructor({ title, artist, audioData, cdgData, digest }) {
    this.title = title;
    this.artist = artist;
    this.audioData = audioData;
    this.cdgData = cdgData;
    if (!digest) {
      throw new Error("Must have digest!");
    }
    this.digest = digest;
  }

  serializeData() {
    return JSON.stringify({
      audioData: b64encode(this.audioData),
      cdgData: b64encode(this.cdgData),
    });
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

  static fromSerialized(title, artist, digest, jsonData) {
    const parsed = JSON.parse(jsonData);
    const audioData = new Uint8Array(b64decode(parsed.audioData));
    const cdgData = new Uint8Array(b64decode(parsed.cdgData));
    return new Track({ title, artist, audioData, cdgData, digest });
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
