<template>
  <div>
    <!--swipe card-->
    <div class="swipe-card-container px-10">
      <SwipeCard />
    </div>
  </div>
</template>

<script setup>
const { inviteCode } = $(inviteStore());
console.log("inviteCode", inviteCode);
window?.localStorage.setItem("inviteCode", inviteCode);
</script>

<style>
.swipe-card-container {
  height: calc(100vh - 130px);
  /* Adjust height based on nav bar and tab bar */
}
</style>
