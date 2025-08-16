<script setup lang="ts">
    const { setModal } = $(uiStore())
    const { locale, locales } = useI18n()
    const localeName = $computed(() => locales.value.find(item => item.code === locale.value)?.language)
</script>

<template>
    <van-field v-model="localeName" is-link readonly :label="$t('Language')" @click="setModal('langSwitcher', true)" />
</template>
