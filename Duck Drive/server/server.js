"use strict";

import express from "express";
import fs from "fs";
import path from "path";
const app = express();
const port = 80;

app.use(express.static("."));
app.use(express.json());

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
    res.status(500).json({ error: "Failed to load files" });
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
