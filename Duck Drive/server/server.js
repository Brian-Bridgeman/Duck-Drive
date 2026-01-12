"use strict";

import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const port = 80;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.use(express.json());

const storage = multer.diskStorage({
  destination: "./server/files/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
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
          size:
            stats.size < 1024
              ? stats.size + " B"
              : stats.size < 1024 * 1024
              ? (stats.size / 1024).toFixed(2) + " KB"
              : (stats.size / (1024 * 1024)).toFixed(2) + " MB",
          uploadDate:
            stats.birthtime.toLocaleDateString("sv-SE") +
            " " +
            stats.birthtime.toLocaleTimeString("sv-SE"),
          type: filename.split(".").pop().toLowerCase(),
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

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

app.put("/api/files/:filename", async (req, res) => {
  try {
    const oldFileName = path.basename(req.params.filename);
    const newFileNameInput = path.basename(req.body.newName);
    if (!newFileNameInput) {
      return res.status(400).json({ error: "New file name is required" });
    }
    const extension = path.extname(oldFileName);
    const newFileName = newFileNameInput.endsWith(extension)
      ? newFileNameInput
      : newFileNameInput + extension;
    const oldFilePath = path.resolve(`./server/files/${oldFileName}`);
    const newFilePath = path.resolve(`./server/files/${newFileName}`);
    if (!fs.existsSync(oldFilePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    if (fs.existsSync(newFilePath)) {
      return res.status(409).json({ error: "File already exists" });
    }
    
    await fs.promises.rename(oldFilePath, newFilePath);
    res.json({
      message: "File renamed",
      oldName: oldFileName,
      newName: newFileName,
    })
  } catch (error) {
    res.status(500).json({ error: "Server erroR" });
  }
});

app.delete("/api/files/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filepath = path.resolve(`./server/files/${filename}`);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }
    await fs.promises.unlink(filepath);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
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
