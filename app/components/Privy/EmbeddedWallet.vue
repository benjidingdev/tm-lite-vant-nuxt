<script setup lang="ts">
    const { wallet, doCreateWallet, isLoading } = $(privyStore())
</script>
<template>
    <div>
        <van-cell-group v-if="wallet">
            <van-cell :title="$t('Wallet')" :label="wallet" />
        </van-cell-group>
        <div v-else class="p-4">
            <van-button round block type="primary" @click="doCreateWallet" :loading="isLoading">
                {{ $t('Create wallet') }}
            </van-button>
        </div>
    </div>
</template>
