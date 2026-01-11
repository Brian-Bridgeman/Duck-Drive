<script setup>
import { ref, onMounted } from "vue";
import SearchBar from "./SearchBar.vue";
import FileRow from "./FileRow.vue";

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
  <section>
    <span>Name</span>
    <span>Size</span>
    <span>Uploaded at</span>
    <div class="file-list">
      <FileRow v-for="file in files" :key="file.name" :file="file" />
    </div>
  </section>
</template>

<style scoped>
section {
  border: 2px solid red;
}
.file-list {
  margin-top: 30px;
  border: 2px solid green;
}
span {
  margin-left: 70px;
  border: 2px solid yellow;
}
</style>
