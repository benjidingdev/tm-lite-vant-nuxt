<script setup lang="ts">
  import { shortenHash } from "@/utils/processing";
  const { modalIsShow } = $(uiStore());
  const hash = import.meta.env.NUXT_PUBLIC_HASH;
  const branch = import.meta.env.NUXT_PUBLIC_BRANCH;
  let clickNum = 0;

  const shortHash = $computed(() => shortenHash(hash, 4));

  const initVconsole = async () => {
    clickNum++;
    if (clickNum < 3) return;
    const vConsole = new VConsole();
  };
</script>
<template>
  <van-popup v-model:show="modalIsShow.settings" position="right" :style="{ width: '80%', height: '100%' }">
    <div class="flex flex-col justify-around min-h-screen">
      <div class="flex-1">
        <LangSwitcherLabel />
        <TradeSettingLabel />
        <AuthLogoutLabel />
      </div>
      <van-cell-group>
        <van-cell :title="$t('Hash')" :value="shortHash" />
        <van-cell :title="$t('Branch')" :value="branch" @click="initVconsole" />
      </van-cell-group>
    </div>
  </van-popup>
</template>
