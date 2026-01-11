<script setup>
import { defineModel } from "vue";

const searchQuery = defineModel();
</script>

<template>
  <div class="search-bar">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Sök på Duck Drive..."
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar {
  margin: 20px;
  justify-self: center;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
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
</style>
