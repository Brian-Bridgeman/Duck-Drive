<script setup>
import { defineModel } from "vue";
import searchIcon from "@/assets/icons/search.png";

const searchQuery = defineModel();
</script>

<template>
  <h1>Välkommen till Duck Drive</h1>
  <div class="search-bar">
    <span class="search-icon"
      ><img :src="searchIcon" style="width: 20px" alt=""
    /></span>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Sök på Duck Drive..."
      class="search-input"
      id="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  margin: 20px;
  justify-content: center;
  align-items: center;
  position: relative;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
}

.search-icon {
  position: absolute;
  left: 10px;
  font-size: 20px;
  color: #5f6368;
  pointer-events: none;
  user-select: none;
  margin-left: 5px;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 45px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  outline: none;
  background-color: #e9eef6;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: gray;
}
h1 {
  text-align: center;
  font-weight: 100;
  color: #333333;
}
</style>
