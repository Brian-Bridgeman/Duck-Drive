<script setup>
import { ref, onMounted } from "vue";

const files = ref([]);

async function fetchFiles() {
  try {
    const response = await fetch("/api/files");
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
function deleteFile(fileId) {
  //todo
}
function uploadFile(file) {
  //todo
}
//TODO, fixa layout osv, just nu bara lagt till grundläggande för att visa upp uppladdade filer
</script>
<template>
  <div class="file-list">
    <ul>
      <li v-for="file in files" :key="file.name">
        {{ file.name }} - {{ file.size }} - {{ file.uploadDate }}
      </li>
    </ul>
  </div>
</template>
