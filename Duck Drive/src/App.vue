<script setup>
import Sidebar from "./components/Sidebar.vue";
import FileArea from "./components/FileArea.vue";
import SearchBar from "./components/SearchBar.vue";
import LoginForm from "./components/LoginForm.vue";
import { ref, provide, onMounted } from "vue";

const fileAreaRef = ref(null);
const searchQuery = ref("");
const currentUser = ref(null);
const isAuthenticated = ref(false);

provide("refreshFiles", () => {
  if (fileAreaRef.value) {
    fileAreaRef.value.fetchFiles();
  }
});
provide("searchQuery", searchQuery);
async function checkAuth() {
  try {
    const response = await fetch("/api/auth/status");
    const data = await response.json();
    isAuthenticated.value = data.authenticated;
    currentUser.value = data.username;
  } catch (error) {
    console.error("auth check failed", error);
  }
}
function handleLoginSuccess(username) {
  isAuthenticated.value = true;
  currentUser.value = username;
}
onMounted(() => {
  checkAuth();
});
</script>
<template>
  <LoginForm v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
  <div class="app-container" v-else>
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
