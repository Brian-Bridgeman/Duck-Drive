<script setup>
import { ref, watch, computed } from "vue";
import closeIcon from "@/assets/icons/white-cross.png";
import audioIcon from "@/assets/icons/headphones.png";
import cantDisplay from "@/assets/icons/eye-crossed.png";
const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const textContent = ref("");
const isLoading = ref(true);
function closeWindow() {
  emit("close");
}
const fileFormat = computed(() => {
  switch (props.file.type) {
    case "mp3":
    case "wav":
    case "flac":
    case "aiff":
      return "audio";
    case "png":
    case "jpg":
    case "jpeg":
    case "tif":
    case "tiff":
    case "raw":
      return "picture";
    case "pdf":
      return "pdf";
    case "zip":
      return "zip";
    case "mp4":
    case "mov":
    case "avi":
      return "video";
    case "txt":
    case "csv":
    case "log":
    case "xml":
    case "md":
    case "json":
      return "text";
    default:
      return "cantDisplay";
  }
});
watch(
  () => props.file,

  async (file) => {
    if (!file) return;

    isLoading.value = true;
    const response = await fetch(`/api/files/${file.name}`);
    textContent.value = await response.text();
    isLoading.value = false;
  },
  { immediate: true }
);
</script>

<template>
  <div class="overlay">
    <div class="popup-window">
      <div v-if="isLoading" class="loader">
        <div class="spinner"></div>
      </div>
      <div v-show="!isLoading">
        <video
          v-if="fileFormat === 'video'"
          controls
          :src="`/api/files/${file.name}`"
          @loadeddata="isLoading = false"
        ></video>
        <img
          v-if="fileFormat === 'picture'"
          class="imageDisplay"
          :src="`/api/files/${file.name}`"
          @load="isLoading = false"
        />
        <div
          v-if="fileFormat === 'audio'"
          class="audio"
          @loadeddata="isLoading = false"
        >
          <div class="audioTemplate">
            <img :src="audioIcon" alt="" class="headphoneImg" />
          </div>
          <audio controls :src="`/api/files/${file.name}`"></audio>
        </div>

        <div v-if="fileFormat === 'pdf'" class="pdf" @load="isLoading = false">
          <object
            :data="`/api/files/${file.name}`"
            width="800"
            height="500"
          ></object>
        </div>

        <pre v-if="fileFormat === 'text'" class="text-preview">{{
          textContent
        }}</pre>

        <div
          v-if="fileFormat === 'cantDisplay'"
          class="cantDisplay"
          @load="isLoading = false"
        >
          <img :src="cantDisplay" alt="" class="cantDisplayIcon" />
          <span>This file cannot be displayed</span>
        </div>

        <button
          class="close"
          :style="{ backgroundImage: `url(${closeIcon})` }"
          @click="closeWindow"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.imageDisplay {
  border-radius: 1rem;
  max-width: 50vw;
}
.cantDisplayIcon {
  height: 40%;
  margin-bottom: 20px;
}
.cantDisplay {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 40vh;
  height: 15vw;
  border-radius: 1rem;
  background-color: #f5f5f5;
  font-size: 20px;
}
.text-preview {
  white-space: pre-wrap;
  font-family: monospace;
  background-color: #f5f5f5;
  color: black;
  padding: 16px;
  height: 60vh;
  width: 60vw;
  overflow: auto;
  border-radius: 1rem;
}
.pdf {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
  width: 30vw;
}
.headphoneImg {
  height: 40%;
}

audio {
  width: 20vw;
  border-radius: 1rem;
}

.audioTemplate {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background-color: #f5f5f5;
  width: 20vw;
  height: 20vh;
}
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-window {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
video {
  max-height: 75vh;
  border-radius: 1rem;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-color: transparent;
  background-position: center;
  border: none;
  cursor: pointer;
  padding: 0px;
}
</style>
