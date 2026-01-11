<script setup>
import Sidebar from "./components/Sidebar.vue";
import FileArea from "./components/FileArea.vue";
import { ref } from "vue";
</script>
<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <FileArea />
    </main>
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
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.app-container {
  display: flex;
  height: 100vh;
}
.main-content {
  flex: 1;
  overflow: auto;
}
</style>
