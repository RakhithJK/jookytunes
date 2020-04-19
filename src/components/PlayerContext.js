import React, { useState } from "react";
import Controller from "../lib/Controller";

const PlayerContext = React.createContext(null);

export const PlayerContextProvider = function ({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [controller] = useState(new Controller({
    onStateChange: (controllerState) => {
      setIsPlaying(controllerState.isPlaying);
      setCurrentTrack(controllerState.currentTrack);
      setQueue([...controllerState.queue]);
    },
  }));

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTrack,
        queue,
        controller,
        storage: controller.storage,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const PlayerContextConsumer = PlayerContext.Consumer;
export default PlayerContext;
