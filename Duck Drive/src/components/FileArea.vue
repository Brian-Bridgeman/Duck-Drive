<script setup>
import { ref, onMounted, computed } from "vue";
import fuzzysort from "fuzzysort";
import SearchBar from "./SearchBar.vue";
import FileRow from "./FileRow.vue";

const files = ref([]);
const searchQuery = ref("");

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

async function deleteFile(filename) {
  try {
    const res = await fetch(`/api/files/${filename}`, {
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
  <section>
    <SearchBar v-model="searchQuery" />
    <span>Name</span>
    <span>Size</span>
    <span>Uploaded at</span>
    <div class="file-list">
      <FileRow
        v-for="file in filteredFiles"
        :key="file.name"
        :file="file"
        @delete="deleteFile"
      />
    </div>
  </section>
</template>

<style scoped>
.file-list {
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
}
span {
  margin-left: 70px;
}
</style>
