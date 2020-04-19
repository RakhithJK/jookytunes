import React from "react";
import Player from "./components/Player";
import { PlayerContextProvider } from "./components/PlayerContext";
import QueueStatus from "./components/QueueStatus";
import AddTrackButton from "./components/AddTrackButton";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

import "./App.scss";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <PlayerContextProvider>
      <ThemeProvider theme={theme}>
        <div className="main-container">
          <div className="main-window">
            <Player className="player" />
          </div>
          <QueueStatus className="queue" />
          <AddTrackButton buttonClass="action-button" />
        </div>
      </ThemeProvider>
    </PlayerContextProvider>
  );
}

export default App;
