<script setup>
import { ref } from 'vue';

const files=ref([
    { id: 1, name: 'duck.txt' }, //
    { id: 2, name: 'quack.mp3' },//
    { id: 3, name: 'quack.jpg' } //radera dessa när vi gjort api-anrop, bara för att visa något
]);

function fetchFiles() {
    //TODO: lägga till api-anrop för att hämta filer
}
//TODO, fixa layout osv, just nu bara lagt till grundläggande för att visa upp uppladdade filer
</script>
<template>
    <div class="file-list">
        <ul>
            <li v-for="file in files" :key="file.id">{{ file.name }}</li>
        </ul>
    </div>
</template>