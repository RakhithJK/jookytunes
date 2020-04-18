import React, { useState } from "react";
import Controller from "../lib/Controller";

const PlayerContext = React.createContext(null);

const CONTROLLER = new Controller();
export const addTrack = (t) => CONTROLLER.addTrack(t);
export const play = () => CONTROLLER.play();
export const stop = () => CONTROLLER.stop();
export const advance = () => CONTROLLER.advance();

export const PlayerContextProvider = function ({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);

  CONTROLLER.onStateChange = (controllerState) => {
    console.log('got state', controllerState);
    setIsPlaying(controllerState.isPlaying);
    setCurrentTrack(controllerState.currentTrack);
    setQueue([...controllerState.queue]);
  }

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTrack,
        queue,
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
