<script setup>
import { defineModel } from "vue";
import searchButton from "@/assets/icons/search.png";

const searchQuery = defineModel();
</script>

<template>
  <h1>Välkommen till Duck Drive</h1>
  <div class="search-bar">
    <span class="search-icon"
      ><img :src="searchButton" alt="Search icon"
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
  align-items: center;
  gap: 10px;
  max-width: 75%;
  margin: 20px auto;
  padding: 10px 15px;
  background-color: #e9eef6;
  border-radius: 20px;
}

.search-icon {
  display: flex;
  flex-shrink: 0;
}

.search-icon img {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  padding: 0;
  font-size: 16px;
  border: none;
  outline: none;
  background-color: transparent;
}

h1 {
  text-align: center;
  font-weight: 100;
  color: #333333;
}
</style>
