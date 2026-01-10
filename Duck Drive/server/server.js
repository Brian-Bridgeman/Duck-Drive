"use strict";

import express from "express";
import fs from "fs";
const app = express();
const port = 80;

app.use(express.static("public"));
app.use(express.json());

app.get("/index.html", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
