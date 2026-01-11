<script setup>
import { defineModel } from "vue";

const searchQuery = defineModel();
</script>

<template>
  <h1>Välkommen till Duck Drive</h1>
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
  display: flex;
  margin: 20px;
  justify-content: center;
  align-items: center;
}

.search-input {
  width: 75%;
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
h1 {
  text-align: center;
  font-weight: 100;
  color: #333333;
}
</style>
