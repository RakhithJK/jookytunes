import Dexie from "dexie";
import Track from "./Track";

export default class Storage {
  constructor() {
    this.db = new Dexie("TrackLibrary");
    this.db.version(1).stores({
      tracks: "&digest,artist,title,data",
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

    await this.db.transaction('rw?', this.db.tracks, async () => {
      const numExisting = await this.db.tracks
        .where("digest")
        .equals(digest)
        .count();
      if (!numExisting) {
        console.log("Track not in library, adding");
        await this.db.tracks.add({
          digest: digest,
          artist: track.artist,
          title: track.title,
          data: track.serializeData(),
        });
      } else {
        console.log("Track is in library!");
      }
    });
  }

  async iterAllTracks(cb) {
    this.db.tracks.orderBy("title").each((trackRow) => {
      const track = Track.fromSerialized(
        trackRow.title,
        trackRow.artist,
        trackRow.digest,
        trackRow.data
      );
      cb(track);
    });
  }
}
