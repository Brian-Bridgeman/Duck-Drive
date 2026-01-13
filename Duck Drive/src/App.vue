<script setup>
import Sidebar from "./components/Sidebar.vue";
import FileArea from "./components/FileArea.vue";
import SearchBar from "./components/SearchBar.vue";
import { ref, provide } from "vue";

const fileAreaRef = ref(null);
const searchQuery = ref("");

provide("refreshFiles", () => {
  if (fileAreaRef.value) {
    fileAreaRef.value.fetchFiles();
  }
});
</script>
<template>
  <div class="app-container">
    <Sidebar />
    <div class="content-wrapper">
      <SearchBar v-model="searchQuery" />
      <main class="main-content">
        <FileArea :search-query="searchQuery" ref="fileAreaRef" />
      </main>
    </div>
  </div>
</template>
<style>
/* Styling kan vi lägag till senare, men sidebaren syns iallafall
  Bara temporärt lagt till så sidebaren är längst till vänster */
#app {
  max-width: none;
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.app-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}
.main-content {
  flex: 1;
  overflow: auto;
  margin-left: 20px;
  margin-right: 60px;
  margin-bottom: 20px;
  border-radius: 1rem;
  background-color: white;
}
</style>
