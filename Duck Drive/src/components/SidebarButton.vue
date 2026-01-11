<!--TODO: Fix sidebar button display and functionality-->
<script setup>
    console.log("SidebarButton component loaded");
    defineProps({
        label: String,
        icon: String,
    });
</script>
<template>
    <li class="sidebar-item">
        <a href="#" class="sidebar-link">
            <span v-if="icon" class="icon">{{ icon }}</span>
            <span class="label">{{ label }}</span>
        </a>
    </li>
</template>
<style scoped>
    .sidebar-item {
        list-style: none;
    }
    .sidebar-link{
        display: flex;
        align-items: center;
        padding: 10px;
        text-decoration: none;
        color: #333;
        border-radius: 16px;
        transition: background-color 0.3s;
    }
    .sidebar-link:hover {
        background-color: #e0e0e0;
    }
    .icon{
        margin-right: 10px;
    }
</style>