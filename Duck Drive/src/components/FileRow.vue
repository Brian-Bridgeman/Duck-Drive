<!--TODO: Fix file row display and functionality-->
<script setup>
import { ref, computed } from "vue";
import trashIcon from "@/assets/icons/trash.png";
import downloadIcon from "@/assets/icons/download.png";
import imageIcon from "@/assets/icons/picture.png";
import audioIcon from "@/assets/icons/headphones.png";
import fileIcon from "@/assets/icons/file.png";
import pdfIcon from "@/assets/icons/file-pdf.png";
import zipIcon from "@/assets/icons/file-zipper.png";
import videoIcon from "@/assets/icons/clapperboard.png";
import documentIcon from "@/assets/icons/document.png";
import fileEditIcon from "@/assets/icons/pencil.png";
import folderIcon from "@/assets/icons/folder.png";
const emit = defineEmits(["delete", "select", "rename", "visible"]);

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
});

const isEditing = ref(false);
const newFileName = ref("");
const inputRef = ref(null);

function onDeleteClick() {
  emit("delete", props.file.name);
}
function onFileSelect() {
  emit("select", props.file.name);
}

function startEditing() {
  onFileSelect();
  isEditing.value = true;
  const extension = props.file.name.lastIndexOf(".");
  newFileName.value =
    extension > 0 ? props.file.name.substring(0, extension) : props.file.name;
  setTimeout(() => {
    inputRef.value.focus();
    inputRef.value.select();
  }, 0);
}
function cancelEditing() {
  isEditing.value = false;
  newFileName.value = "";
}
function handleKeyDown(event) {
  if (event.key === "Enter") {
    saveEdit();
  } else if (event.key === "Escape") {
    cancelEditing();
  }
}
async function saveEdit() {
  if (!newFileName.value || newFileName.value === props.file.name) {
    cancelEditing();
    return;
  }
  emit("rename", props.file.name, newFileName.value);
  isEditing.value = false;
}
const downloadLink = ref(null);

async function downloadFile(filename) {
  try {
    const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    downloadLink.value.href = url;
    downloadLink.value.download = filename;
    downloadLink.value.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
function displayFileContent() {
  emit("visible", props.file);
}

const fileFormatIcon = computed(() => {
  switch (props.file.type) {
    case "mp3":
    case "wav":
    case "flac":
    case "aiff":
      return audioIcon;
    case "png":
    case "jpg":
    case "jpeg":
    case "tif":
    case "tiff":
    case "raw":
      return imageIcon;
    case "pdf":
      return pdfIcon;
    case "zip":
      return zipIcon;
    case "mp4":
    case "mov":
    case "avi":
      return videoIcon;
    case "txt":
    case "docx":
    case "doc":
    case "csv":
    case "log":
    case "xml":
    case "md":
    case "json":
      return documentIcon;
    case "folder":
      return folderIcon;
    default:
      return fileIcon;
  }
});
</script>

<template>
  <div
    class="file-component file-grid"
    :class="{ selected }"
    @click.stop="onFileSelect"
    @dblclick="displayFileContent"
  >
    <div class="split fileName">
      <img class="fileIcon" :src="fileFormatIcon" alt="" />
      <span v-if="!isEditing">{{ file.name }}</span>
      <input
        v-else
        ref="inputRef"
        v-model="newFileName"
        @click.stop
        @blur="cancelEditing"
        @keydown="handleKeyDown"
        class="filename-input"
        type="text"
      />
    </div>
    <div class="split">
      <span>User icon</span>
    </div>
    <div class="split">
      <span>{{ file.uploadDate }}</span>
    </div>
    <div class="split">
      <span>{{ file.size }}</span>
    </div>
    <div class="split icons">
      <button
        @click.stop="onDeleteClick"
        class="fileBtn"
        :style="{ backgroundImage: `url(${trashIcon})` }"
      ></button>
      <button
        @click.stop="downloadFile(file.name)"
        class="fileBtn"
        :style="{ backgroundImage: `url(${downloadIcon})` }"
      ></button>
      <button
        @click.stop="startEditing"
        class="fileBtn"
        :style="{ backgroundImage: `url(${fileEditIcon})` }"
      ></button>
    </div>
    <a ref="downloadLink" style="display: none"></a>
  </div>
</template>

<style scoped>
.filename-input {
  flex: 1;
  margin: 0px;
  border: 1px solid #6b6d71;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  background-color: white;
}
.file-component {
  display: grid;
  align-items: center;
  border-bottom: 1px solid #6b6d71;
}
.file-component:hover {
  background-color: #ededed;
}
.file-grid {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr auto;
  align-items: center;
}
.split {
  display: flex;
  align-items: center;
  padding: 10px 0;
  min-width: 0;
  cursor: default;
}
.split span {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.fileBtn {
  width: 36px;
  height: 36px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-color: transparent;
  background-position: center;
  border: none;
  cursor: pointer;
  padding: 0px;
}
.fileBtn:hover {
  background-color: #c6c7c6;
  border-radius: 1rem;
}
.file-component.selected {
  background-color: #c2e7ff;
}
.file-component.selected .fileBtn:hover {
  background-color: #aad0e6;
}
.icons {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-end;
  padding-right: 20px;
}
.fileIcon {
  width: 20px;
  margin: 10px;
}
</style>
