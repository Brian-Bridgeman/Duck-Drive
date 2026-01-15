<script setup>
import Sidebar from "./components/Sidebar.vue";
import FileArea from "./components/FileArea.vue";
import SearchBar from "./components/SearchBar.vue";
import LoginForm from "./components/LoginForm.vue";
import { ref, provide, onMounted } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import UserDropdown from "./components/UserDropdown.vue";

const fileAreaRef = ref(null);
const searchQuery = ref("");
const currentUser = ref(null);
const isAuthenticated = ref(false);
const currentPath = ref("");
const selectedFile = ref(null);
const isDark = useDark({
  selector: "body",
  attribute: "color-scheme",
  valueDark: "dark",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);
function setSelected(filename) {
  selectedFile.value = filename;
}
function cancelSelect() {
  selectedFile.value = null;
}
provide("refreshFiles", () => {
  if (fileAreaRef.value) {
    fileAreaRef.value.fetchFiles();
  }
});
provide("searchQuery", searchQuery);
provide("currentPath", currentPath);
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
  <body color-scheme="isDark ? 'dark' : 'light'">
    <LoginForm v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    <div class="app-container" @click="cancelSelect()" v-else>
      <Sidebar />
      <div class="content-wrapper">
        <div class="header-bar">
          <SearchBar v-model="searchQuery" />
          <label class="switch">
            <input type="checkbox" @click="toggleDark()" />
            <span class="slider round"></span>
          </label>
          <UserDropdown />
        </div>

        <main class="main-content">
          <FileArea
            @select="setSelected"
            :selected-file="selectedFile"
            :search-query="searchQuery"
            ref="fileAreaRef"
          />
        </main>
      </div>
    </div>
  </body>
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
.header-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 4em;
}
.header-bar .switch {
  margin-left: auto;
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

/* Dark mode toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.header-bar .search-bar {
  max-width: 50%;
  flex: 1;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@media (max-width: 768px) {
  .header-bar {
    gap: 0px;
    justify-content: right;
    max-width: 70%;
    margin-left: 2em;
  }
  .header-bar .switch {
    margin-left: 0;
  }
}
/* Dark and light mode styling */

[color-scheme="dark"] {
  .main-content {
    background-color: #131314;
  }
  .main-content section {
    background-color: #131314;
    color: #e3e3e3;
  }
  .main-content .file-component.selected {
    background-color: #004a77;
  }
  .main-content .file-component.selected .fileBtn:hover {
    background-color: #1d5f87;
  }
  .main-content .file-component.selected:hover {
    background-color: #0f5682;
  }
  .main-content .file-component .fileBtnIcon {
    filter: invert();
  }
  .main-content .file-component .fileIcon {
    filter: invert();
  }
  .main-content .file-component .fileBtn:hover {
    background-color: #303131;
  }
  .main-content .file-component:hover {
    background-color: #242424;
  }
  .main-content .file-header {
    color: #e3e3e3;
  }
  .app-container {
    background-color: #1b1b1b;
  }
  .app-container .sidebar {
    background-color: #1b1b1b;
  }
  .app-container .sidebar-link:hover {
    background-color: #2b2b2b;
  }
  .app-container .sidebar-link {
    color: #e3e3e3;
  }
  .app-container .sidebar-icon {
    filter: invert();
  }
  .app-container h1 {
    color: #e3e3e3;
  }
  .app-container .new-button {
    background-color: #37393b;
    color: #e3e3e3;
  }
  .app-container .dropdown-menu {
    background-color: #1e1f20;
  }
  .app-container .menu-item {
    color: #e3e3e3;
  }
  .app-container .icon {
    filter: invert();
  }
  .app-container .menu-item:hover {
    background-color: #494b4c;
  }
  .app-container .new-button:hover {
    background-color: #494d53;
  }
  .app-container .plus-icon {
    filter: invert();
  }
  .content-wrapper .search-bar {
    background-color: #282a2c;
  }
  .content-wrapper .search-icon {
    filter: invert();
  }
  .content-wrapper .search-input {
    color: #e3e3e3;
  }
  .main-content .audioTemplate {
    background-color: #1f1f1f;
  }
  .main-content .cantDisplay {
    background-color: #1f1f1f;
  }
  .content-wrapper .slider {
    background-color: #282a2c;
  }
  .content-wrapper .user-icon {
    filter: invert();
  }
  .content-wrapper .dropdown {
    border: 1px solid #131314;
  }
  .content-wrapper .userdropdown-button {
    background-color: #1e1f20;
    color: #e3e3e3;
  }
  .content-wrapper .userdropdown-button:hover {
    background-color: #494b4c;
  }
  .content-wrapper .dropdown-icon {
    filter: invert();
  }
}
</style>
