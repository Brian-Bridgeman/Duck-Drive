<script setup>
import Sidebar from './components/Sidebar.vue';
  import { ref } from 'vue';
</script>
<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <h1>Duck Drive</h1>
    </main>
  </div>
</template>
<style>
  /* Styling kan vi lägag till senare, men sidebaren syns iallafall
  Bara temporärt lagt till så sidebaren är längst till vänster */
  #app{
    max-width: none;
    margin: 0;
    padding: 0;
  }
  body{
    margin: 0;
    padding: 0;
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