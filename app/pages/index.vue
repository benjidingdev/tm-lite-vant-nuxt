<script setup>
const { inviteCode } = $(inviteStore());

console.log("inviteCode", inviteCode);
window?.localStorage.setItem("inviteCode", inviteCode || "");
</script>

<template>
  <div>
    <!--swipe card-->
    <div class="layout-height px-10">
      <SwipeCard />
    </div>
  </div>
</template>

<style>
.layout-height {
  height: calc(100vh - 60px - 50px);
}
</style>
