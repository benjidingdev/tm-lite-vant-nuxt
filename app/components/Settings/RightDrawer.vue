<script setup lang="ts">
  import { shortenHash } from "@/utils/processing";
  const { modalIsShow } = $(uiStore());
  const hash = import.meta.env.NUXT_PUBLIC_HASH;
  const branch = import.meta.env.NUXT_PUBLIC_BRANCH;
  let clickNum = 0;

  const shortHash = $computed(() => shortenHash(hash, 10));
  let { startParam } = $(shareStore());
  const { token } = $(authStore());
  const initVconsole = async () => {
    clickNum++;
    if (clickNum < 3) return;
    const vConsole = new VConsole();
  };
</script>
<template>
  <van-popup v-model:show="modalIsShow.settings" position="right" :style="{ width: '80%', height: '100%' }">
    <div class="flex flex-col justify-around h-dvh relatvie">
      <span class="text-gray-200 absolute z-99 opacity-70 w-full flex justify-center px-5">{{ startParam }}</span>

      <div class="flex-1">
        <LangSwitcherLabel />
        <TradeSettingLabel />
        <AuthLogoutLabel v-if="!token" />
      </div>
      <van-cell-group>
        <van-cell :title="$t('Branch')" :value="branch" @click="initVconsole" />
        <van-cell :title="$t('Hash')" :value="shortHash" />
      </van-cell-group>
    </div>
  </van-popup>
</template>
