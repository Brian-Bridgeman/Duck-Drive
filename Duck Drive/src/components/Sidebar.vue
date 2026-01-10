<!--TODO: Lägga till api-anrop vid klick på button för uppladdning-->

<script setup>
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
                <li><a href="#">Startsida</a></li>
                <li><a href="#">Min Enhet</a></li>
                <li><a href="#">Datorer</a></li>
                <li><a href="#">Delas med mig</a></li>
                <li><a href="#">Senaste</a></li>
                <li><a href="#">Stjärnmärkt</a></li>
                <li><a href="#">Skräppost</a></li>
                <li><a href="#">Papperskorgen</a></li>
                <li><a href="#">Lagring</a></li>
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