<script setup>
import { ref } from 'vue';

const files=ref([
    { id: 1, name: 'duck.txt' , date: '2026-01-10'}, //
    { id: 2, name: 'quack.mp3', date: '2026-01-10' },//
    { id: 3, name: 'quack.jpg', date: '2026-01-10' } //radera dessa när vi gjort api-anrop, bara för att visa något
]);

function fetchFiles() {
    //TODO: lägga till api-anrop för att hämta filer
}
function deleteFile(fileId) {
    //todo
}
function uploadFile(file) {
    //todo
}
//TODO, fixa layout osv, just nu bara lagt till grundläggande för att visa upp uppladdade filer
</script>
<template>
    <div class="file-list">
        <ul>
            <li v-for="file in files" :key="file.id">{{ file.name }} - {{ file.date }}</li>
        </ul>
    </div>
</template>