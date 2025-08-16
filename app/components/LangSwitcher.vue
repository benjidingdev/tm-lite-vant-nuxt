<script setup lang="ts">
    const { locale, locales, setLocale } = useI18n()
    const columns = $computed(() => {
        const rz = locales.value.map(item => {
            return {
                text: item.language,
                value: item.code,
            }
        })
        return rz
    })
    let currentLocale = $computed({
        get() {
            return [locale.value]
        },
        set(code) {
            setLocale(code)
        }
    })
    const localeName = $computed(() => locales.value.find(item => item.code === locale.value)?.language)

    let showPicker = $ref(false);
    const onConfirm = ({ selectedValues }) => {
        showPicker = false;
        currentLocale = selectedValues[0];
    };
</script>

<template>
    <van-field v-model="localeName" is-link readonly :label="$t('Language')" @click="showPicker = true" />
    <van-popup v-model:show="showPicker" destroy-on-close round position="bottom">
        <van-picker :model-value="currentLocale" :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
</template>
