<!--TODO: Lägga till api-anrop vid klick på button för uppladdning-->

<script setup>
import SidebarButton from "./SidebarButton.vue";
import { ref } from "vue";
import duckIcon from "@/assets/duck-drive-icon.png";

const fileInput = ref(null);

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
  event.target.value = null;
  console.log("vi nådde hit");
  await fetchFiles();
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
    <button class="new-button" @click="openfilePicker">+ Nytt</button>
    <nav>
      <ul>
        <SidebarButton label="Startsida" icon="" />
        <SidebarButton label="Min Enhet" icon="" />
        <SidebarButton label="Datorer" icon="" />
        <SidebarButton label="Delas med mig" icon="" />
        <SidebarButton label="Senaste" icon="" />
        <SidebarButton label="Stjärnmärkt" icon="" />
        <SidebarButton label="Skräppost" icon="" />
        <SidebarButton label="Papperskorgen" icon="" />
        <SidebarButton label="Lagring" icon="" />
      </ul>
    </nav>
  </aside>
</template>
<style scoped>
/*stylingen för sidebar kan vi justera senare, bara lagt in grundläggande */
.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}
.header-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}
.duck-icon {
  width: 40px;
  height: 40px;
}

.new-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: ease-in-out 0.15s;
}

.new-button:hover {
  background-color: #0056b3;
}
</style>
