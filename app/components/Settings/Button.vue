<script setup lang="ts">
    const { setModal } = $(uiStore())
</script>
<template>
    <van-button icon="setting-o" size="small" plain round hairline @click="setModal('settings', true)" />
</template>
