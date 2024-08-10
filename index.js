import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process"; // Consider using a job queue instead of exec

const app = express();

// Multer middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Set destination for uploaded files
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with a UUID and preserve original extension
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
    }
});

// Multer configuration
const upload = multer({ storage: storage });

// Middleware setup
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true, // Allow credentials in cross-origin requests
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

// Basic route for testing the API
app.get('/', function (req, res) {
    res.json({ message: "Hello chai aur code" });
});

// File upload route
app.post("/upload", upload.single('file'), function (req, res) {
    const lessonId = uuidv4(); // Generate unique lesson ID
    const videoPath = req.file.path; // Path to the uploaded video
    const outputPath = `./uploads/courses/${lessonId}`; // Directory for HLS files
    const hlsPath = `${outputPath}/index.m3u8`; // HLS playlist path
    console.log("HLS path:", hlsPath);

    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // Command to convert video to HLS format using FFmpeg
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    // Run the ffmpeg command without queueing (consider adding job queue)
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`); // Log error
            return res.status(500).json({ message: "Failed to process video", error });
        }

        console.log(`FFmpeg stdout: ${stdout}`); // Log stdout
        console.error(`FFmpeg stderr: ${stderr}`); // Log stderr

        const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;
        // Respond with the path to the HLS playlist
        res.status(200).json({
            message: "File uploaded and processed successfully",
            lessonId: lessonId,
            videoUrl: videoUrl,
            hlsPath: hlsPath
        });
    });
});

// Start the server
app.listen(8000, function () {
    console.log("App is listening at port 8000");
});
