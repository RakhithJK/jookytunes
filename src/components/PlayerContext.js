import React, { useState } from "react";
import Playlist from "../lib/Playlist";

const PlayerContext = React.createContext(null);

const PLAYLIST = new Playlist({});
export const addTrack = (t) => PLAYLIST.addTrack(t);
export const play = () => PLAYLIST.play();
export const stop = () => PLAYLIST.stop();
export const advance = () => PLAYLIST.advance();

export const PlayerContextProvider = function ({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);

  PLAYLIST.onPlayPause = (isPlaying) => {
    setIsPlaying(isPlaying);
    setCurrentTrack(PLAYLIST.getCurrentTrack());
    setTracks(PLAYLIST.tracks);
  };

  PLAYLIST.onCurrentTrackChanged = (newTrack) => {
    setCurrentTrack(newTrack);
    setTracks(PLAYLIST.tracks);
  };

  PLAYLIST.onTracksChanged = (newTracks) => {
    setTracks(newTracks);
  };

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
