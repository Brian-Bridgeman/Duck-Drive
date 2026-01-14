<script setup>
    import { ref } from "vue";
    import UserIcon from "@/assets/icons/circle-user.png";
    const showDropdown = ref(false);
    function toggleDropDown() {
        showDropdown.value = !showDropdown.value;
    }
    async function handleLogout() {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                console.error("Logout failed");
                return;
            }
            window.location.reload();
        }
        catch (err) {
            console.error("Could not logout", err);
        }
    }
</script>
<template>
    <div class="logout-section">
        <img
            :src="UserIcon"
            alt="User icon"
            class="user-icon"
            @click="toggleDropDown"
        />
        <div v-if="showDropdown" class="dropdown">
            <button class="logout-button" @click="handleLogout">Logga ut</button>
        </div>
    </div>
</template>
<style scoped>
    .logout-section{
        position: relative;
        display: flex;
        align-items: center;
    }
    .user-icon{
        width: 32px;
        height: 32px;
        cursor: pointer;
        transition: opacity 0.2s;
    }
    .dropdown{
        position: absolute;
        top: 40px;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        min-width: 100px;
        z-index: 1000;
    }
    .logout-button {
        width: 100%;
        padding: 10px 16px;
        font-size: 1em;
        cursor: pointer;
        border: none;
        background: #ffffff;
        border-radius: 8px;
        transition: background-color 0.2s;
    }
    .logout-button:hover{
        background-color: #f0f0f0;
    }
</style>