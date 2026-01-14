<script setup>
import { ref, onMounted, computed, inject } from "vue";
import fuzzysort from "fuzzysort";
import FileRow from "./FileRow.vue";
import DialogWindow from "./DialogWindow.vue";

const files = ref([]);
const selectedFile = ref(null);
const isDragging = ref(false);
const fileInput = ref(null);
const isVisible = ref(false);
const activeFile = ref(null);
const currentPath = inject("currentPath", ref(""));

const searchQuery = inject("searchQuery");

function selectFile(filename) {
  selectedFile.value = filename;
}
async function onChange(e) {
  await uploadFiles(e.target.files);
  fileInput.value.value = null;
}
function dragover(e) {
  e.preventDefault();
  isDragging.value = true;
}
function dragleave() {
  isDragging.value = false;
}
async function drop(e) {
  e.preventDefault();
  isDragging.value = false;

  const items = e.dataTransfer.items;
  if (items && items.length && items[0].webkitGetAsEntry) {
    const allFiles = [];
    const traverse = (entry, path = "") => {
      return new Promise((resolve) => {
        if (entry.isFile) {
          entry.file((file) => {
            file.relativePath = path + file.name;
            allFiles.push(file);
            resolve();
          });
        } else if (entry.isDirectory) {
          const reader = entry.createReader();
          reader.readEntries(async (entries) => {
            for (const ent of entries) {
              await traverse(ent, path + entry.name + "/");
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    };
    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) promises.push(traverse(entry));
    }
    await Promise.all(promises);
    await uploadFiles(allFiles, true);
  } else {
    await uploadFiles(e.dataTransfer.files);
  }
}
async function fetchFiles() {
  try {
    const params = currentPath.value
      ? `?path=${encodeURIComponent(currentPath.value)}`
      : "";

    const response = await fetch(`/api/files${params}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }
    const data = await response.json();
    files.value = data;
  } catch (error) {
    console.error("Error fetching files:", error);
  }
}

onMounted(() => {
  fetchFiles();
});

async function deleteFile(filename) {
  try {
    const params = currentPath.value
      ? `?path=${encodeURIComponent(currentPath.value)}`
      : "";

    const res = await fetch(`/api/files/${filename}${params}`, {
      credentials: "include",
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete file");
    }

    await fetchFiles();
  } catch (err) {
    console.error(err);
  }
}
async function uploadFiles(files, isFolder = false) {
  if (!files || !files.length) return;

  const formData = new FormData();
  for (const file of files) {
    if (isFolder && (file.relativePath || file.webkitRelativePath)) {
      formData.append("files", file);
      formData.append("path", file.relativePath || file.webkitRelativePath);
    } else {
      formData.append("file", file);
    }
  }

  await fetch(isFolder ? "/api/upload-folder" : "/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  await fetchFiles();
}
async function renameFile(oldName, newName) {
  try {
    const params = currentPath.value
      ? `?path=${encodeURIComponent(currentPath.value)}`
      : "";

    const response = await fetch(`/api/files/${oldName}${params}`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName }),
    });
    if (!response.ok) {
      throw new Error("Failed to rename file");
    }
    await fetchFiles();
  } catch (error) {
    console.error(error);
  }
}
function openFile(file) {
  activeFile.value = file;
  isVisible.value = true;
}
function closeFile() {
  isVisible.value = false;
}

function openFolder(folder) {
  if (!(folder.isFolder || folder.type === "folder")) return;

  currentPath.value = currentPath.value
    ? `${currentPath.value}/${folder.name}`
    : folder.name;
  fetchFiles();
}
const filteredFiles = computed(() => {
  if (!searchQuery.value) {
    return files.value;
  }

  const results = fuzzysort.go(searchQuery.value, files.value, {
    key: "name",
    threshold: -10000,
  });

  return results.map((result) => result.obj);
});

defineExpose({ fetchFiles });
</script>

<template>
  <section
    class="dropzone-container"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
    :class="{ dragging: isDragging }"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden-input"
      @change="onChange"
    />
    <div v-if="isVisible">
      <DialogWindow @close="closeFile" :file="activeFile" />
    </div>
    <div>
      <div class="navigation">
        <button @click="goBack" :disabled="!currentPath">Tillbaka</button>
        <span class="path-label">{{ currentPath }}</span>
      </div>
      <div class="file-header file-grid">
        <span>Name</span>
        <span>Owner</span>
        <span>Last modified</span>
        <span>Size</span>
        <span></span>
      </div>

      <div class="file-list">
        <FileRow
          v-for="file in filteredFiles"
          :key="file.name"
          :file="file"
          :selected="file.name === selectedFile"
          @select="selectFile"
          @delete="deleteFile"
          @rename="renameFile"
          @visible="openFile"
          @open-folder="openFolder"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.dropzone-container {
  min-height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
.dropzone-container.dragging {
  background-color: #e6f5ff;
  outline: 2px solid #8ad0ff;
  outline-offset: -2px;
  border-radius: 1rem;
}
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
.file-header {
  margin-right: 20px;
  margin-left: 20px;
  padding: 10px 20px;
  font-weight: 600;
  color: #6b6d71;
  border-bottom: 1px solid #6b6d71;
}
.file-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  align-items: center;
}
.file-list {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
