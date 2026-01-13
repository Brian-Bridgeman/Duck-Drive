<script setup>
import SidebarButton from "./SidebarButton.vue";
import { ref, inject } from "vue";
import duckIcon from "@/assets/duck-drive-icon.png";
import plusIcon from "@/assets/icons/plus.png";

const fileInput = ref(null);
const refreshFiles = inject("refreshFiles", null);
const showMenu = ref(false);

function openfilePicker() {
  fileInput.value.click();
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
  <aside class="sidebar">
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
    <div class="new-button-container">
      <button class="new-button" @click="showMenu = !showMenu">
        <img :src="plusIcon" alt="Plus icon" class="plus-icon" /> Nytt
      </button>
      <div class="dropdown-menu" v-if="showMenu">
        <button class="menu-item" @click="createFolder">Ny mapp</button>
        <button class="menu-item" @click="openfilePicker">Ladda upp fil</button>
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
</template>
<style scoped>

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
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
  display: block;
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
</style>
