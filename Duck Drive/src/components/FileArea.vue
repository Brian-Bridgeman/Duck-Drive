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
  setTimeout(() => {
    fetchFiles();
  }, 500);
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
    <div class="file-list">
      <FileRow v-for="file in files" :key="file.name" :file="file" />
    </div>
  </section>
</template>

<style scoped>
.file-list {
  margin-top: 30px;
}
span {
  margin-left: 70px;
}
</style>
