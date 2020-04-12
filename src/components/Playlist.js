import React, { useContext } from "react";
import TrackUploader from "./TrackUploader";
import PlayerContext from "./PlayerContext";

import './Playlist.scss';

function Playlist() {
  const { tracks, currentTrack } = useContext(PlayerContext);

  const playlistItems = tracks.map((track) => {
    const isActive = track.id === currentTrack.id;
    return (
      <div key={track.id} className={`track ${isActive ? 'active' : ''}`}>
        {track.name}
      </div>
    );
  });

  return (
    <div className="playlist">
      <div className="tracks">
        <h5>Playlist</h5>
        {playlistItems}
      </div>
      <div className="uploader">
        <TrackUploader />
      </div>
    </div>
  );
}

export default Playlist;
