import React from "react";
import AddTrackButton from "../components/AddTrackButton";
import QueueStatus from "../components/QueueStatus";
import Player from "../components/Player";
import "./MainView.scss";

const MainView = () => {
  return (
    <div className="main-container">
      <div className="main-window">
        <Player className="player" />
      </div>
      <QueueStatus className="queue" />
      <AddTrackButton buttonClass="action-button" />
    </div>
  );
};

export default MainView;
