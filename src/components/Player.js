import React, { useRef, useEffect, useState, useContext } from "react";
import CDGPlayer from "cdgraphics";
import PlayerContext, { advance } from "./PlayerContext";

function Player() {
  const canvasElement = useRef(null);
  const [cdgPlayer, setCdgPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const { currentTrack: track } = useContext(PlayerContext);

  // Create an audiocontext once we load.
  useEffect(() => {
    function onSetup() {
      if (!track) {
        return;
      }
      console.log("Creating audio player...");
      const ctx = new AudioContext();
      ctx.decodeAudioData(track.audioFile.buffer, (audioBuffer) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        setAudioSource(source);
        source.onended = function () {
          advance();
        };
      });
    }
    function cleanup() {
      console.log("TODO: Clean up audio context");
    }
    onSetup();
    return cleanup;
  }, [track]);

  // Create a CDGPlayer once we have a canvas.
  useEffect(() => {
    function onSetup() {
      const canvas = canvasElement && canvasElement.current;
      if (!canvas) {
        return;
      }
      console.log("Creating CDG player...");
      setCdgPlayer(new CDGPlayer(canvas, { forceTransparent: false }));
    }
    onSetup();
  }, [canvasElement]);

  // Bootstrap the CDGPlayer with data once we have it.
  useEffect(() => {
    function onSetup() {
      if (!track || !cdgPlayer) {
        return;
      }
      console.log("Loading CDG data...");
      cdgPlayer.load(track.cdgData);
      setIsPlaying(true);
    }
    onSetup();
  }, [track, cdgPlayer]);

  // Bootstrap the audio player with data once we have it.
  useEffect(() => {
    function onSetup() {
      if (!cdgPlayer || !audioSource) {
        return;
      }
      if (isPlaying) {
        console.log("Playing ...");
        audioSource.start();
        cdgPlayer.play();
      } else {
        console.log("Stopping ...");
        // TODO
      }
    }
    onSetup();
  }, [cdgPlayer, audioSource, isPlaying]);

  return (
    <div className="cdg-player">
      <canvas width={600} height={432} ref={canvasElement} />
    </div>
  );
}

export default Player;
