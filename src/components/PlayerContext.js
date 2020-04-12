import React, { useState } from "react";
import Playlist from '../lib/Playlist';

const PlayerContext = React.createContext(null);

export const PlayerContextProvider = function ({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);

  const [playlist] = useState(new Playlist({
    onPlayPause: (isPlaying) => {
      setIsPlaying(isPlaying);
      setCurrentTrack(playlist.getCurrentTrack());
      setTracks(playlist.tracks);
    },
    onCurrentTrackChanged: (newTrack) => {
      setCurrentTrack(newTrack);
      setTracks(playlist.tracks);
    },
    onTracksChanged: (newTracks) => {
      setTracks(newTracks);
    }
  }));

  const addTrack = (t) => playlist.addTrack(t);
  const play = () => playlist.play();
  const stop = () => playlist.stop();
  const advance = () => playlist.advance();

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTrack,
        tracks,
        addTrack,
        play,
        stop,
        advance,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const PlayerContextConsumer = PlayerContext.Consumer;
export default PlayerContext;
