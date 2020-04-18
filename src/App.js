import React, { useState } from "react";
import Player from "./components/Player";
import { PlayerContextProvider } from "./components/PlayerContext";
import QueueStatus from "./components/QueueStatus";
import AddTrackButton from "./components/AddTrackButton";

import "./App.scss";

function App() {
  return (
    <PlayerContextProvider>
      <div className="main-container">
        <div className="main-window">
          <Player className="player" />
        </div>
        <QueueStatus className="queue" />
        <AddTrackButton buttonClass="action-button" />
      </div>
    </PlayerContextProvider>
  );
}

export default App;
