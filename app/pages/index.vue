<script setup>
  const { inviteCode } = $(inviteStore());

  console.log("inviteCode", inviteCode);
  window?.localStorage.setItem("inviteCode", inviteCode);

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
