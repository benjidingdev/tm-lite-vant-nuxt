<script setup lang="ts">
const { session } = $(privyStore());
</script>

<template>
  <div class="h-[calc(100dvh-var(--nav-height))] bg-white overflow-auto">
    <UserInfoCard />
    <OrderList v-if="session" />
    <TradeOrderPopup />
  </div>
</template>
<script setup />
