<script setup>
import SidebarButton from "./SidebarButton.vue";
import { ref, inject } from "vue";
import duckIcon from "@/assets/duck-drive-icon.png";
import plusIcon from "@/assets/icons/plus.png";
import addFolderIcon from "@/assets/icons/folder-plus-circle.png";
import fileUploadIcon from "@/assets/icons/file-upload.png";
import folderUploadIcon from "@/assets/icons/folder-upload.png";

const fileInput = ref(null);
const folderInput = ref(null);
const refreshFiles = inject("refreshFiles", null);
const showMenu = ref(false);
const sidebarOpen = ref(false);

function openfilePicker() {
  fileInput.value.click();
}

function openFolderPicker() {
  folderInput.value.click();
}
async function uploadFolder(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
    formData.append("path", file.webkitRelativePath);
  });

  await fetch("/api/upload-folder", {
    method: "POST",
    body: formData,
  });

  if (refreshFiles) {
    await refreshFiles();
  }

  event.target.value = null;
  showMenu.value = false;
}

async function uploadFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (refreshFiles) {
    await refreshFiles();
  }

  event.target.value = null;
  showMenu.value = false;
}

async function createFolder() {
  const name = prompt("Ange namn för den nya mappen:");
  if (!name) return;

  await fetch("/api/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (refreshFiles) {
    await refreshFiles();
  }
  showMenu.value = false;
}
</script>
<template>
  <div>
    <button class="borgir" :class="{ open: sidebarOpen }" @click="sidebarOpen = !sidebarOpen">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="sidebarOpen = false"></div>
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="header-container">
        <img :src="duckIcon" alt="Duck drive icon" class="duck-icon" />
        <h1>Drive</h1>
      </div>
      <input
      type="file"
      ref="fileInput"
      @change="uploadFile"
      style="display: none"
      />
      <input
      type="file"
      ref="folderInput"
      @change="uploadFolder"
      style="display: none"
      webkitdirectory=""
      directory=""
      multiple
      />
      <div class="new-button-container">
        <button class="new-button" @click="showMenu = !showMenu">
          <img :src="plusIcon" alt="Plus icon" class="plus-icon" /> Nytt
        </button>
        <div class="dropdown-menu" v-if="showMenu">
          <button class="menu-item" @click="createFolder">
            <img
            :src="addFolderIcon"
            alt="Add folder icon"
            class="icon"
            width="20px"
            />
            Ny mapp
          </button>
          <button class="menu-item" @click="openfilePicker">
            <img
            :src="fileUploadIcon"
            alt="File upload icon"
            class="icon"
            width="20px"
            />
            Ladda upp fil
          </button>
          <button class="menu-item" @click="openFolderPicker">
            <img
            :src="folderUploadIcon"
            alt="Folder upload icon"
            class="icon"
            width="20px"
            />
            Ladda upp mapp
          </button>
        </div>
      </div>
      <nav>
        <ul>
          <SidebarButton label="Startsida" icon="home" />
          <SidebarButton label="Min Enhet" icon="laptop" />
          <SidebarButton label="Datorer" icon="devices" />
          <span class="divider"></span>
          <SidebarButton label="Delas med mig" icon="shared" />
          <SidebarButton label="Senaste" icon="clock" />
          <SidebarButton label="Stjärnmärkt" icon="star" />
          <span class="divider"></span>
          <SidebarButton label="Skräppost" icon="exclamation" />
          <SidebarButton label="Papperskorgen" icon="trash" />
          <SidebarButton label="Lagring" icon="storage" />
        <span class="divider"></span>
      </ul>
    </nav>
  </aside>
</div>
</template>
<style scoped>
  .borgir{
    display: none;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1001;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    gap: 5px;
    width: 35px;
    height: 35px;
    justify-content: center;
  }
  .bar{
    display: block;
    width: 100%;
    height: 3px;
    background-color: #333;
    border-radius: 2px;
    transition: 0.3s;
  }
  .borgir.open .bar:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .borgir.open .bar:nth-child(2) {
    opacity: 0;
  }

  .borgir.open .bar:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  } 
  .sidebar-overlay{
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .sidebar {
    width: 200px;
    background-color: #f5f5f5;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    transition: transform 0.3s ease;
  }
  .header-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-bottom: 0.6em;
  }
  .duck-icon {
    width: 3.5em;
    height: 3.5em;
  }
  h1 {
    color: #444746;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: normal;
    font-size: 1.7em;
  }
  .new-button {
    display: block;
    width: fit-content;
    padding: 20px 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
    color: black;
    border: none;
    font-size: 1.1em;
    border-radius: 16px;
    cursor: pointer;
    transition: ease-in-out 0.15s;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.568);
  }
  .plus-icon {
    width: 1.2em;
    height: 1.2em;
    margin-right: 8px;
    vertical-align: middle;
  }

  .new-button-container {
    margin-bottom: 20px;
    position: relative;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 5px 10px #00000033;
    z-index: 10;
    min-width: 150px;
    margin-top: 5px;
    overflow: hidden;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.95em;
    color: #444746;
    transition: background-color 0.15s;
  }

  .menu-item:hover {
    background-color: #f0f0f0;
  }

  .menu-item:active {
    background-color: #e8e8e8;
  }

  .new-button:hover {
    background-color: #edf1fa;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
  }
  .new-button:active {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    scale: 0.96;
  }
  nav ul {
    padding: 0;
  }
  .divider {
    display: block;
    height: 1px;
    margin: 10px 0;
  }
@media (max-width: 768px) {
  .borgir{
    display: flex;
  }
  .sidebar{
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
  }
  .header-container{
    margin-top: 45px;
  }
}
</style>
