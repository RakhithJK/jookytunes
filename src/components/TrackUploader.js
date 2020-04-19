import React, { useState, useEffect } from "react";
import Track from "../lib/Track";
import LinearProgress from "@material-ui/core/LinearProgress";

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

const FILE_NAME_REGEXES = [
  /^([A-Za-z0-9-]+) - (?<artist>.+) - (?<title>.+)\.(cdg|mp3)$/,
  /^(?<artist>.+) - (?<title>.+)\.(cdg|mp3)$/,
];

function guessTitleAndArtist(filename) {
  for (const re of FILE_NAME_REGEXES) {
    const m = re.exec(filename);
    if (m) {
      return { title: m.groups.title, artist: m.groups.artist };
    }
  }
  return null;
}

function TrackUploader({ onTrackAdded = () => {} }) {
  const [trackName, setTrackName] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [cdgData, setCdgData] = useState(null);
  const [inProgress, setInProgress] = useState(null);

  useEffect(() => {
    async function onChange() {
      if (audioData && cdgData && trackName) {
        const { title, artist } = guessTitleAndArtist(trackName) || {};
        setInProgress(true);
        const track = await Track.fromData(
          title || trackName,
          artist || "Unknown",
          audioData.buffer,
          cdgData
        );
        setInProgress(false);
        setTrackName("");
        setAudioData(null);
        setCdgData(null);
        onTrackAdded(track);
      }
    }
    onChange();
  }, [onTrackAdded, audioData, cdgData, trackName]);

  const onFilesUploaded = async (e) => {
    const { files } = e.target;
    let haveTrackName = !!trackName;
    for (var i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop().toLowerCase();
      const decoded = new Uint8Array(await readFileAsync(file));
      if (ext === "cdg") {
        setCdgData(decoded);
      } else if (ext === "mp3") {
        setAudioData(decoded);
      }
      if (!haveTrackName) {
        setTrackName(file.name);
        haveTrackName = true;
      }
    }
  };

  const uploadInput = (
    <input type="file" accept=".mp3,.cdg" onChange={onFilesUploaded} multiple />
  );

  if (inProgress) {
    return (
      <div>
        <h5>Uploading...</h5>
        <LinearProgress />
      </div>
    );
  }

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
