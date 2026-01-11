<!--TODO: Lägga till api-anrop vid klick på button för uppladdning-->

<script setup>
import SidebarButton from "./SidebarButton.vue";

function uploadFile() {
  console.log("Upload file clicked");
  //placeholder för uppladdningsknapp, fetch läggs häår senare
}
</script>
<template>
  <aside class="sidebar">
    <h1>Duck Drive</h1>
    <button class="new-button" @click="uploadFile">+ Nytt</button>
    <nav>
      <ul>
        <SidebarButton label="Startsida" icon="" />
        <SidebarButton label="Min Enhet" icon="" />
        <SidebarButton label="Datorer" icon="" />
        <SidebarButton label="Delas med mig" icon="" />
        <SidebarButton label="Senaste" icon="" />
        <SidebarButton label="Stjärnmärkt" icon="" />
        <SidebarButton label="Skräppost" icon="" />
        <SidebarButton label="Papperskorgen" icon="" />
        <SidebarButton label="Lagring" icon="" />
      </ul>
    </nav>
  </aside>
</template>
<style scoped>
/*stylingen för sidebar kan vi justera senare, bara lagt in grundläggande */
.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}

.new-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.new-button:hover {
  background-color: #0056b3;
}
</style>
