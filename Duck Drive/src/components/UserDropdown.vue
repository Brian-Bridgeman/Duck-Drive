<script setup>
import { ref } from "vue";
import UserIcon from "@/assets/icons/circle-user.png";
import LogoutIcon from "@/assets/icons/user-logout.png";
import { onClickOutside } from "@vueuse/core";
const showDropdown = ref(false);
const dropdownRef = ref(null);
function toggleDropDown() {
  showDropdown.value = !showDropdown.value;
}
onClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});
async function handleLogout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Logout failed");
      return;
    }
    window.location.reload();
  } catch (err) {
    console.error("Could not logout", err);
  }
}
</script>
<template>
  <div class="logout-section" ref="dropdownRef">
    <img
      :src="UserIcon"
      alt="User icon"
      class="user-icon"
      @click="toggleDropDown"
    />
    <div v-if="showDropdown" class="dropdown">
      <button class="userdropdown-button" @click="handleLogout">
        <img :src="LogoutIcon" alt="Logout icon" class="dropdown-icon" />
        Logga ut
      </button>
    </div>
  </div>
</template>
<style scoped>
.logout-section {
  position: relative;
  display: flex;
  align-items: center;
}
.user-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}
.user-icon:hover {
  border-color: #ccc;
}
.user-icon:active {
  border-color: #b1b1b1;
  transform: scale(0.92);
}
.dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.userdropdown-button {
  width: 100%;
  padding: 10px 16px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  background: #ffffff;
  border-radius: 8px;
  transition: background-color 0.2s;
  font-family: inherit;
  color: #444746;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.userdropdown-button:hover {
  background-color: #f0f0f0;
}
.dropdown-icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
