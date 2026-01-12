<!--TODO: Fix sidebar button display and functionality-->
<script setup>

    import { computed } from "vue";
    import homeIcon from "@/assets/icons/home.png";
    import laptopIcon from "@/assets/icons/laptop.png";
    import devicesIcon from "@/assets/icons/devices.png";
    import clockIcon from "@/assets/icons/clock-three.png";
    import storageIcon from "@/assets/icons/cloud-back-up.png";
    import exclamationIcon from "@/assets/icons/octagon-exclamation.png";
    import sharedIcon from "@/assets/icons/shared.png";
    import starIcon from "@/assets/icons/star.png";
    import trashIcon from "@/assets/icons/trash.png";

    const props = defineProps({
        label: String,
        icon: String,
    });
    const iconMap = computed(() => {
        switch (props.icon) {
            case "home": return homeIcon;
            case "laptop": return laptopIcon;
            case "devices": return devicesIcon;
            case "clock": return clockIcon;
            case "storage": return storageIcon;
            case "exclamation": return exclamationIcon;
            case "shared": return sharedIcon;
            case "star": return starIcon;
            case "trash": return trashIcon;
            default: return null;
        }
    })
</script>
<template>
    <li class="sidebar-item">
        <a href="#" class="sidebar-link">
            <img v-if="iconMap" :src="iconMap" alt="Icon" class="sidebar-icon" />
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
    .sidebar-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
</style>