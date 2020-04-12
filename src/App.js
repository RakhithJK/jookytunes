import React, { useState } from "react";
import "./App.css";
import Player from "./lib/Player";
import TrackUploader from "./lib/TrackUploader";

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Jooktunes!</h1>
        </header>
        <h3>Select a track to play.</h3>
        <TrackUploader onTrackReady={setCurrentTrack} />
        <Player track={currentTrack} />
      </div>
      <div></div>
    </>
  );
}

export default App;
