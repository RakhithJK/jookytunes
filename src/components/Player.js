import React, {  useEffect, useState, useContext } from "react";
import CDGPlayer from "cdgraphics";
import PlayerContext, { advance } from "./PlayerContext";
import SplashScreen from './SplashScreen';
import { useDebounce } from 'use-debounce';

import "./Player.scss";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 432;
const CANVAS_ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;

class Canvas extends React.PureComponent {
  render() {
    const { onCanvasReady, ...props } = this.props;
    return <canvas ref={(node) => node && onCanvasReady(node)} {...props} />;
  }
}

function Player() {
  const [rawWindowAspectRatio, setWindowAspectRatio] = useState(window.innerWidth / window.innerHeight);
  const [windowAspectRatio] = useDebounce(rawWindowAspectRatio, 200);
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [cdgPlayer, setCdgPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const { currentTrack: track } = useContext(PlayerContext);

  useEffect(() => {
    function handleResize() {
      setWindowAspectRatio(window.innerWidth / window.innerHeight);
    };
    function cleanupListener() {
      window.removeEventListener('resize', handleResize)
    }
    window.addEventListener('resize', handleResize);
    return cleanupListener;
  }, []);

  // Create an audiocontext once we load.
  useEffect(() => {
    function onSetup() {
      if (!track) {
        return;
      }
      console.log("Creating audio player...");
      const ctx = new AudioContext();
      ctx.decodeAudioData(track.audioData.buffer, (audioData) => {
        const source = ctx.createBufferSource();
        source.buffer = audioData;
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
      if (!currentCanvas) {
        return;
      }
      console.log("Creating CDG player...");
      setCdgPlayer(new CDGPlayer(currentCanvas, { forceTransparent: false, scale: 2 }));
    }
    onSetup();
  }, [currentCanvas]);

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

  const effectiveAspectRatio = windowAspectRatio / CANVAS_ASPECT_RATIO;
  let width, height;
  if (effectiveAspectRatio >= 1.0) {
    height = '100%';
    width = `${100 / effectiveAspectRatio}%`;
  } else {
    width = '100%';
    height = `${100 * effectiveAspectRatio}%`;
  }

  return (
    <div className="cdg-player">
      <Canvas
        width={600}
        height={432}
        style={{
          width,
          height,
          display: isPlaying ? 'block' : 'none',
        }}
        onCanvasReady={setCurrentCanvas}
      />
      {!isPlaying && <SplashScreen />}
    </div>
  );
}

export default Player;
