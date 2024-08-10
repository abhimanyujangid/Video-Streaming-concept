import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

const app = express();

// Multer middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
    }
});

// Multer configuration
const upload = multer({ storage: storage });

// Middleware
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get('/', function (req, res) {
    res.json({ message: "Hello chai aur code" });
});

app.post("/upload", upload.single('file'), function (req, res) {
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/courses/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;
    console.log("HLS path:", hlsPath);

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // Command to convert video to HLS format using ffmpeg
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    // Run the ffmpeg command..........no queue not is good way
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            return res.status(500).json({ message: "Failed to process video", error });
        }

        console.log(`FFmpeg stdout: ${stdout}`);
        console.error(`FFmpeg stderr: ${stderr}`);
        const  viderUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`
        // Respond with the path to the HLS playlist
        res.status(200).json({ message: "File uploaded and processed successfully",lessonId:lessonId,viderUrl:viderUrl, hlsPath });
    });
});

app.listen(8000, function () {
    console.log("App is listening at port 8000");
});
