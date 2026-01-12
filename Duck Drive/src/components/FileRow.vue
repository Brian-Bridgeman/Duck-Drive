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
const emit = defineEmits(["delete", "select"]);

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
function onDeleteClick() {
  emit("delete", props.file.name);
}
function onFileSelect() {
  emit("select", props.file.name);
}
const downloadLink = ref(null);

async function downloadFile(filename) {
  try {
    const response = await fetch(`/api/files/${encodeURIComponent(filename)}`);
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
      return documentIcon;
    default:
      return fileIcon;
  }
});
</script>

<template>
  <div class="file-component" :class="{ selected }" @click.stop="onFileSelect">
    <div class="split">
      <img class="fileIcon" :src="fileFormatIcon" alt="" />
      <span>{{ file.name }}</span>
    </div>
    <div class="split">
      <span>{{ file.size }}</span>
    </div>
    <div class="split">
      <span>{{ file.uploadDate }}</span>
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
    </div>
    <a ref="downloadLink" style="display: none"></a>
  </div>
</template>

<style scoped>
.file-component {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #6b6d71;
}
.file-component:hover {
  background-color: #ededed;
}
.split {
  width: 25%;
  box-sizing: border-box;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: default;
}
.split span {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 10px;
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
  background-color: #e0e1e0;
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
