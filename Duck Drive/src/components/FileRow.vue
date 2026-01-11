<!--TODO: Fix file row display and functionality-->
<script setup>
const emit = defineEmits(["delete"]);
const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});
function onDeleteClick() {
  emit("delete", props.file.name);
}
</script>

<template>
  <div class="file-component">
    <div class="split">
      <span>{{ file.name }}</span>
    </div>
    <div class="split">
      <span>{{ file.size }}</span>
    </div>
    <div class="split">
      <span>{{ file.uploadDate }}</span>
    </div>
    <div @click="onDeleteClick" class="split"><button>x</button></div>
  </div>
</template>

<style scoped>
.file-component {
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  margin: 5px;
}
.split {
  width: 25%;
  box-sizing: border-box;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}
.split span {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 10px;
}
</style>
