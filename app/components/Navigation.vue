<template>
  <div class="h-16 flex items-center justify-between px-4">
    <div>
      <BalanceNavButton />
    </div>
    <div class="flex justify-center items-center space-x-2">
      <RequestQueueButton />
      <SettingsVolumeButton />
      <SettingsButton />
    </div>
  </div>
</template>

<style>
wui-flex > wui-text {
  color: white;
}
</style>
