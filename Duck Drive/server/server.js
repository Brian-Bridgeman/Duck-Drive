"use strict";

import express from "express";
import fs from "fs";

const app = express();
const port = 80;

app.use(express.static("."));
app.use(express.json());

app.get("/index.html", (req, res) => {
  res.redirect("/");
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
