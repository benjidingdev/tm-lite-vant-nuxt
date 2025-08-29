<script setup lang="ts">
const { session } = $(privyStore());
</script>

<template>
  <div class="layout-height bg-white overflow-auto">
    <UserInfoCard />
    <OrderList v-if="session" />
    <TradeOrderPopup />
  </div>
</template>
<script setup />
