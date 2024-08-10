import "./App.css";
import VideoPlayer from "./VideoPlayer"; // Import the custom VideoPlayer component
import { useRef } from "react"; // Import useRef to create a reference to the player

function App() {
  const playerRef = useRef(null); // Reference to hold the Video.js player instance

  // URL to the video to be played
  const videoLink =
    "http://localhost:8000/uploads/courses/4b584224-3c4f-49f2-925b-142b7fb30aca/index.m3u8";

  // Configuration options for the Video.js player
  const videoPlayerOptions = {
    controls: true, // Display video controls (play, pause, etc.)
    responsive: true, // Make the player responsive to different screen sizes
    fluid: true, // Make the player fluid, adjusting its size based on its container
    sources: [
      {
        src: videoLink, // Source URL of the video
        type: "application/x-mpegURL", // Type of video being played (HLS format)
      },
    ],
  };

  // Callback function to handle the Video.js player when it is ready
  const handlePlayerReady = (player) => {
    playerRef.current = player; // Store the player instance in the reference

    // Add event listeners to the player
    player.on("waiting", () => {
      videojs.log("player is waiting"); // Log a message when the player is waiting (buffering)
    });

    player.on("dispose", () => {
      videojs.log("player will dispose"); // Log a message when the player is disposed
    });
  };

  return (
    <>
      <div>
        <h1>Video player</h1> {/* Display a heading */}
      </div>

      {/* Render the VideoPlayer component with the specified options and onReady callback */}
      <VideoPlayer
        options={videoPlayerOptions}
        onReady={handlePlayerReady}
      />
    </>
  );
}

export default App; // Export the App component as the default export
