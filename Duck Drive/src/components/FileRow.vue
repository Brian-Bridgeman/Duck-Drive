<!--TODO: Fix file row display and functionality-->
<script setup>
import { ref } from "vue";
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

const downloadLink = ref(null);

async function downloadFile(filename) {
  try {
    const response = await fetch(`/api/files/${encodeURIComponent(filename)}`);
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    downloadLink.value.href = url;
    downloadLink.value.download = filename;
    downloadLink.value.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
</script>

<template>
  <div class="file-component">
    <div class="split" @click="downloadFile(file.name)" style="cursor: pointer">
      <span>{{ file.name }}</span>
    </div>
    <div class="split">
      <span>{{ file.size }}</span>
    </div>
    <div class="split">
      <span>{{ file.uploadDate }}</span>
    </div>
    <div @click="onDeleteClick" class="split"><button>x</button></div>
    <a ref="downloadLink" style="display: none"></a>
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
