<script setup lang="ts">
    const { labelWidth, setModal } = $(uiStore())
    const { locale, locales} = useI18n()
    const localeName = $computed(() => locales.value.find(item => item.code === locale.value)?.language)
</script>

<template>
    <van-field input-align="right" v-model="localeName" :label-width="labelWidth" is-link readonly
        :label="$t('TRSetting.Language')" @click="setModal('langSwitcher', true)" />
</template>
