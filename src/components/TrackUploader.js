import React, { useState, useEffect, useContext } from "react";
import Track from "../lib/Track";
import PlayerContext from "./PlayerContext";

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function TrackUploader() {
  const [trackName, setTrackName] = useState('');
  const [audioData, setAudioData] = useState(null);
  const [cdgData, setCdgData] = useState(null);
  const { addTrack } = useContext(PlayerContext);

  useEffect(() => {
    function onChange() {
      if (audioData && cdgData) {
        addTrack(new Track(trackName, audioData, cdgData));
        setTrackName('');
        setAudioData(null);
        setCdgData(null);
      }
    }
    onChange();
  }, [audioData, cdgData, trackName]);

  const onFilesUploaded = async (e) => {
    const { files } = e.target;
    for (var i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop().toLowerCase();
      const decoded = new Uint8Array(await readFileAsync(file));
      if (ext === "cdg") {
        setCdgData(decoded);
      } else if (ext === "mp3") {
        setAudioData(decoded);
      }
      if (!trackName) {
        setTrackName(file.name);
      }
    }
  };

  const uploadInput = (
    <input type="file" accept=".mp3,.cdg" onChange={onFilesUploaded} multiple />
  );

  if (audioData && cdgData) {
    return <div>All set!</div>;
  } else if (cdgData && !audioData) {
    return (
      <div>
        {uploadInput}
        <p>Please add an audio file.</p>
      </div>
    );
  } else if (audioData && !cdgData) {
    return (
      <div>
        {uploadInput}
        <p>Please add a cdg file.</p>
      </div>
    );
  } else {
    return (
      <div>
        {uploadInput}
        <p>Please upload an MP3 and CDG file.</p>
      </div>
    );
  }
}

export default TrackUploader;
