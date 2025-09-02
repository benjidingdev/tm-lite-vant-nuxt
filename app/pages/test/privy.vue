<script setup lang="ts">
    const { userId, userEmail } = $(privyStore())
</script>
<template>
    <div class="h-screen">
        <div v-if="userId">
            <van-cell-group>
                <van-cell :title="$t('User')" :label="userId" :value="userEmail" />
            </van-cell-group>
            <PrivyEmbeddedWallet />
        </div>
        <PrivyEmailLogin v-else />
    </div>
</template>
