<!--TODO: Lägga till api-anrop vid klick på button för uppladdning-->

<script setup>
import SidebarButton from "./SidebarButton.vue";
import { ref, inject } from "vue";
import duckIcon from "@/assets/duck-drive-icon.png";
import plusIcon from "@/assets/icons/plus.png";

const fileInput = ref(null);
const refreshFiles = inject('refreshFiles', null);

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
    <button class="new-button" @click="openfilePicker"><img :src="plusIcon" alt="Plus icon" class="plus-icon" /> Nytt</button>
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
/*stylingen för sidebar kan vi justera senare, bara lagt in grundläggande */
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
}
.duck-icon {
  width: 40px;
  height: 40px;
}
h1 {
  color: #333333;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
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
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: ease-in-out 0.15s;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.568);
}
.plus-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}

.new-button:hover {
  background-color: #edf1fa;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
}
nav ul {
  padding: 0;
}
.divider{
  display: block;
  height: 1px;
  margin: 10px 0;
}
</style>
