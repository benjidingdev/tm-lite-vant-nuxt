<script setup lang="ts">

const offset = ref({ x: 20, y: 20 });
const { t } = useI18n()
let show = $ref(false);

const route = useRoute()

const onOffsetChange = (p) => {
  // showToast(`x: ${p.x.toFixed(0)}, y: ${p.y.toFixed(0)}`);
};


const actions = $computed(() => [
  { to: '/', icon: '/logo.png', name: t('Turing Market'), subname: t('Predition with USDT on-chain') },
  { to: `/t-${route.params.id}/rank`, icon: '/icons/rank.svg', name: t('Rank Wall'), subname: t('A rank wall shows the top 50 inviters') },
  { to: `/t-${route.params.id}/friends`, icon:'/icons/friends.svg', name: t('Friends'), subname: t('More friends, more rewards') },
  { to: `/checkin`, icon:'/icons/deposit.svg', name: t('Daily Deposit'), subname: t('Daily deposit rewards') },``
])
const onSelect = (item) => {
  console.log('item', item)
  show = false;
  useNavigateTo(item.to)
};

</script>
<template>
  <div>
      <van-floating-bubble axis="xy" :offset icon="/tuit.png" magnetic="x" @offset-change="onOffsetChange"
        @click="show = true" />
      <van-action-sheet v-model:show="show" :actions @select="onSelect"  :cancel-text="$t('Cancel')" />
  </div>
</template>
