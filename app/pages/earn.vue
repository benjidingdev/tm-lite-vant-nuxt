<script setup></script>

<template>
  <!--earn dashboard-->
  <div class="earn-dashboard-container bg-gray-100">
    <van-cell title="earn" icon="shop-o">
      <template #right-icon>
        <van-icon name="refund-o" />
      </template>
    </van-cell>
  </div>
</template>

<style>
.earn-dashboard-container {
  height: calc(100vh - 130px);
  /* Adjust height based on nav bar and tab bar */
}
</style>
