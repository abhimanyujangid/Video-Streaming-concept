# Video Streaming Concept

This project demonstrates a video streaming solution using Node.js, Express, and Video.js. The application allows users to upload video files, which are then converted to HLS (HTTP Live Streaming) format using FFmpeg. The converted videos can be streamed via a React frontend using Video.js.

## Features

- **Video Upload:** Upload videos through an Express.js backend.
- **Video Conversion:** Convert uploaded videos to HLS format using FFmpeg.
- **Video Streaming:** Stream the converted videos using Video.js in a React frontend.
- **Responsive Player:** The Video.js player is fully responsive and adapts to different screen sizes.

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - Multer (for handling file uploads)
  - FFmpeg (for video conversion)
  - UUID (for generating unique IDs)

- **Frontend:**
  - React.js
  - Video.js

## Getting Started

### Prerequisites

- Node.js (v14+)
- FFmpeg (Ensure FFmpeg is installed and accessible in your system's PATH)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abhimanyujangid/Video-Streaming-concept.git
   cd Video-Streaming-concept
