<script setup>
const { inviteCode } = $(inviteStore());
const { initWalletClient } = $(walletStore());
const { todoSign } = $(authStore());

console.log("inviteCode", inviteCode);
window?.localStorage.setItem("inviteCode", inviteCode);

onMounted(async () => {
  await initWalletClient();
  await todoSign();
});
</script>

<template>
  <div>
    <!--swipe card-->
    <div class="swipe-card-container px-10">
      <SwipeCard />
    </div>
  </div>
</template>

<style>
.swipe-card-container {
  height: calc(100vh - 130px);
}
</style>
