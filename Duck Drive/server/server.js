"use strict";

import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
const app = express();
const port = 80;

app.use(express.static("."));
app.use(express.json());

const storage = multer.diskStorage({
  destination: './server/files/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });


app.get("/index.html", (req, res) => {
  res.redirect("/");
});

app.get("/api/files", async (req, res) => {
  try {
    const files = await loadFiles();
    const fileList = await Promise.all(
      files.map(async (filename) => {
        const stats = await fs.promises.stat(`./server/files/${filename}`);
        return {
          name: filename,
          size: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
          uploadDate:
            stats.birthtime.toLocaleDateString("sv-SE") +
            " " +
            stats.birthtime.toLocaleTimeString("sv-SE"),
        };
      })
    );

    res.json(fileList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/files/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filepath = path.resolve(`./server/files/${filename}`);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }
    res.sendFile(filepath);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/upload", upload.single('file'), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  })
});

app.delete("/api/files/:filename", (req, res) => {
  //TODO: Implement file deletion functionality
});

async function loadFiles() {
  try {
    const data = await fs.promises.readdir("./server/files");
    return data;
  } catch (error) {
    console.error("Error loading files:", error);
    return [];
  }
}

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
