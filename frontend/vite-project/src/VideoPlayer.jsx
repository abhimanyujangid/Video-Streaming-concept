import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// VideoPlayer Component
export const VideoPlayer = (props) => {
  // Refs to hold references to the DOM elements and Video.js player instance
  const videoRef = useRef(null); // Reference to the video container
  const playerRef = useRef(null); // Reference to the Video.js player instance
  const { options, onReady } = props; // Destructure options and onReady callback from props

  useEffect(() => {
    // Initialize Video.js player only once
    if (!playerRef.current) {
      // Create a new video-js element (this is required for React 18 Strict Mode)
      const videoElement = document.createElement("video-js");

      // Add class for centered big play button
      videoElement.classList.add("vjs-big-play-centered");
      // Append the video element to the container
      videoRef.current.appendChild(videoElement);

      // Initialize the Video.js player with the provided options
      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready"); // Log when the player is ready
        onReady && onReady(player); // Call the onReady callback if provided
      }));
    } else {
      // If the player already exists, update its properties
      const player = playerRef.current;

      player.autoplay(options.autoplay); // Update autoplay option
      player.src(options.sources); // Update video source
    }
  }, [options, videoRef]); // Dependencies are the options and videoRef

  useEffect(() => {
    // Dispose the Video.js player when the component unmounts
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose(); // Dispose the player to free up resources
        playerRef.current = null; // Reset the playerRef
      }
    };
  }, [playerRef]); // Dependency is the playerRef

  return (
    <div
      data-vjs-player
      style={{ width: "600px" }} // Set a fixed width for the video player
    >
      <div ref={videoRef} /> {/* This div will hold the video-js element */}
    </div>
  );
};

export default VideoPlayer;
