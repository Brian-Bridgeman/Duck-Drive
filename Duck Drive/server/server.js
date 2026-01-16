"use strict";

import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";
import session from "express-session";
import bcrypt from "bcrypt";
const app = express();
const port = 80;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.use(express.json());
app.use(
  session({
    secret: "1337duck",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = resolveUserPath(req, req.query.path || "");
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.get("/index.html", (req, res) => {
  res.redirect("/");
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function authMiddleware(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

function resolveUserPath(req, relativePath = "") {
  const baseFolder = path.resolve(`./server/files/${req.session.userId}`);
  const target = path.resolve(path.join(baseFolder, relativePath));
  if (!target.startsWith(baseFolder)) {
    throw new Error("Invalid path");
  }
  return target;
}

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const usersData = await fs.promises.readFile(
      "./server/users.json",
      "utf-8"
    );
    const users = JSON.parse(usersData);

    if (users.find((user) => user.username === username)) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    await fs.promises.writeFile(
      "./server/users.json",
      JSON.stringify(users, null, 2)
    );
    await fs.promises.mkdir(`./server/files/${username}`, { recursive: true });
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Register failed" });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const usersData = await fs.promises.readFile(
      "./server/users.json",
      "utf-8"
    );
    const users = JSON.parse(usersData);
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    req.session.userId = username;
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout successful" });
});
app.get("/api/auth/status", (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, username: req.session.userId });
  } else {
    res.json({ authenticated: false });
  }
});

app.get("/api/files", authMiddleware, async (req, res) => {
  try {
    const userFolder = resolveUserPath(req, req.query.path || "");
    const items = await fs.promises.readdir(userFolder);
    const itemList = await Promise.all(
      items.map(async (itemName) => {
        const itemPath = path.join(userFolder, itemName);
        const stats = await fs.promises.stat(itemPath);
        const isDirectory = stats.isDirectory();
        const fileDate = new Date(stats.ctime);
        const currentDate = new Date();
        const isCurrentDate =
          fileDate.getFullYear() === currentDate.getFullYear() &&
          fileDate.getMonth() === currentDate.getMonth() &&
          fileDate.getDate() === currentDate.getDate();
        let size;
        if (isDirectory) {
          const folderSize = await getFolderSize(itemPath);
          size = formatSize(folderSize);
        } else {
          size = formatSize(stats.size);
        }

        return {
          name: itemName,
          size: size,
          editDate: isCurrentDate
            ? stats.ctime.toLocaleTimeString("sv-SE")
            : stats.ctime.toLocaleDateString("sv-SE"),
          type: isDirectory
            ? "folder"
            : itemName.split(".").pop().toLowerCase(),
          isFolder: isDirectory,
        };
      })
    );

    res.json(itemList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/files/:filename", authMiddleware, async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const relative = path.join(req.query.path || "", filename);
    const filepath = resolveUserPath(req, relative);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const stats = await fs.promises.stat(filepath);

    if (stats.isDirectory()) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.zip"`
      );

      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("error", (err) => {
        res.status(500).json({ error: "Failed to create zip" });
      });

      archive.pipe(res);
      archive.directory(filepath, filename);
      await archive.finalize();
    } else {
      res.sendFile(filepath);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/upload", authMiddleware, upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

app.post(
  "/api/upload-folder",
  authMiddleware,
  upload.array("files"),
  async (req, res) => {
    try {
      let paths = req.body.path;
      const files = req.files;

      if (!Array.isArray(paths)) {
        paths = [paths];
      }

      for (let i = 0; i < files.length; i++) {
        const basePath = req.query.path || "";
        const relativePathRaw = paths[i] || files[i].originalname;
        const relativePath = basePath
          ? path.join(basePath, relativePathRaw)
          : relativePathRaw;
        const targetPath = path.join(
          "./server/files",
          req.session.userId,
          relativePath
        );
        const targetDir = path.dirname(targetPath);

        if (!fs.existsSync(targetDir)) {
          await fs.promises.mkdir(targetDir, { recursive: true });
        }
        await fs.promises.rename(files[i].path, targetPath);
      }

      res.json({ message: "Folder uploaded successfully" });
    } catch (error) {
      console.error("Error uploading folder:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post("/api/folders", authMiddleware, async (req, res) => {
  try {
    const folderName = req.body.name;
    if (!folderName) {
      return res.status(400).json({ error: "Folder name is required" });
    }
    const baseFolder = resolveUserPath(req, req.query.path || "");
    const folderPath = path.join(baseFolder, folderName);
    if (fs.existsSync(folderPath)) {
      return res.status(409).json({ error: "Folder already exists" });
    }
    await fs.promises.mkdir(folderPath);
    res.json({ message: "Folder created successfully", name: folderName });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/files/:filename", authMiddleware, async (req, res) => {
  try {
    const oldFileName = path.basename(req.params.filename);
    const newFileNameInput = path.basename(req.body.newName);
    if (!newFileNameInput) {
      return res.status(400).json({ error: "New file name is required" });
    }
    const userFolder = resolveUserPath(req, req.query.path || "");
    const extension = path.extname(oldFileName);
    const newFileName = newFileNameInput.endsWith(extension)
      ? newFileNameInput
      : newFileNameInput + extension;
    const oldFilePath = path.join(userFolder, oldFileName);
    const newFilePath = path.join(userFolder, newFileName);
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
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/files/:filename", authMiddleware, async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const userFolder = resolveUserPath(req, req.query.path || "");
    const filepath = path.join(userFolder, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }
    const stats = await fs.promises.stat(filepath);
    if (stats.isDirectory()) {
      await fs.promises.rm(filepath, { recursive: true, force: true });
    } else {
      await fs.promises.unlink(filepath);
    }
    res.json({ message: "File or folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

async function loadFiles() {
  // används ej men behåller
  try {
    const userFolder = `./server/files/${req.session.userId}`;
    const data = await fs.promises.readdir(userFolder);
    return data;
  } catch (error) {
    console.error("Error loading files:", error);
    return [];
  }
}

async function getFolderSize(folderPath) {
  let size = 0;
  const files = await fs.promises.readdir(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      size += await getFolderSize(filePath);
    } else {
      size += stats.size;
    }
  }

  return size;
}

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
