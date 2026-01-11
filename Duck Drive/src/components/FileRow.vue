<!--TODO: Fix file row display and functionality-->
<script setup>
defineProps({
  file: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="file-component">
    <span>{{ file.name }}</span>
    <span>{{ file.size }}</span>
    <span>{{ file.uploadDate }}</span>
  </div>
</template>

<style scoped>
.file-component {
  background-color: #f5f5f5;
  margin: 10px;
  padding: 20px;
  border-radius: 1rem;
}
span {
  margin-right: 50px;
}
</style>
