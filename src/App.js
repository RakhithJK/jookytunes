import React from "react";
import "./App.scss";
import Player from "./components/Player";
import { PlayerContextProvider } from "./components/PlayerContext";
import Playlist from "./components/Playlist";

function App() {
  return (
    <PlayerContextProvider>
      <div className="container">
        <div className="left-bar">
          <Playlist />
        </div>
        <div className="main-window">
          <div className="header"></div>
          <div className="player">
            <Player />
          </div>
          <div className="footer"></div>
        </div>
      </div>
    </PlayerContextProvider>
  );
}

export default App;
