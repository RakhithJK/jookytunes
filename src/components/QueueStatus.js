import React, { useContext } from "react";
import PlayerContext from "./PlayerContext";

import './QueueStatus.scss';

function QueueStatus({ ...props }) {
  const { queue } = useContext(PlayerContext);

  const items = queue.map((track, idx) => {
    return (
      <div key={track.digest} className="queued-track">
        {`${idx + 1}. `}{track.title}
      </div>
    );
  });

  return (
    <div {...props} className="container">
      <div className="queue">
        {items}
      </div>
    </div>
  );
}

export default QueueStatus;
