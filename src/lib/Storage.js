import Dexie from "dexie";
import Track from "./Track";
import { encode as b64encode, decode as b64decode } from "base64-arraybuffer";

export default class Storage {
  constructor() {
    this.db = new Dexie("TrackLibrary");
    this.db.version(1).stores({
      tracks: "&digest,artist,title",
      trackdata: "&digest,data",
    });
  }

  async initialize() {
    // Opening an IndexedDB connection can take several seconds. Dexie
    // will do it lazily if we didn't do it here.
    await this.db.open();
  }

  async addTrackToLibrary(track) {
    const { digest } = track;
    console.log(`Track digest: ${digest}`);

    const cachedData = track.getCachedData();
    if (!cachedData) {
      throw new Error('Track has no data.');
    }

    await this.db.transaction('rw?', [this.db.tracks, this.db.trackdata], async () => {
      const numExisting = await this.db.tracks
        .where("digest")
        .equals(digest)
        .count();
      if (!numExisting) {
        console.log("Track not in library, adding");
        const { audioData, cdgData } = cachedData;
        await this.db.tracks.add({
          digest: digest,
          artist: track.artist,
          title: track.title,
        });
        await this.db.trackdata.add({
          digest: digest,
          data: JSON.stringify({
            audioData: b64encode(audioData),
            cdgData: b64encode(cdgData),
          }),
        });
      } else {
        console.log("Track is in library!");
      }
    });
  }

  async iterAllTracks(cb) {
    await this.db.tracks.orderBy("title").each((trackRow) => {
      const { title, artist, digest } = trackRow;
      const track = new Track({ title, artist, digest, loader: this.loaderCb });
      cb(track);
    });
  }

  async listAllTracks() {
    const result = [];
    await this.iterAllTracks(result.push.bind(result));
    return result;
  }

  async loadTrackData(digest) {
    try {
      const record = await this.db.trackdata.get({ digest: digest });
      const parsed = JSON.parse(record.data);
      const audioData = new Uint8Array(b64decode(parsed.audioData));
      const cdgData = new Uint8Array(b64decode(parsed.cdgData));
      return {
        audioData,
        cdgData,
      };
    } catch (e) {
      return { audioData: null, cdgData: null };
    }
  }

}
