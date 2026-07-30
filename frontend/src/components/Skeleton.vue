<template>
    <div :class="['skeleton-pulse', customClass]" :style="{ width, height, borderRadius: radius }"></div>
</template>

<script setup>
defineProps({
    width: { type: String, default: '100%' },
    height: { type: String, default: '20px' },
    radius: { type: String, default: '6px' },
    customClass: { type: String, default: '' }
});
</script>

<style scoped>
.skeleton-pulse {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>
