<script setup lang="ts">
const props = defineProps<{
  cardID?: string | number
}>()

const { userInfo } = $(userStore());

const shareCard = () => {
  const { cardID } = props;
  const inviteCode = userInfo?.inviteCode || '';
  const params: any = { cardID, inviteCode };
  inviteUser(params);
}
</script>

<template>
  <div>
    <div @click="shareCard()">
      <van-icon name="share-o" />
    </div>
  </div>
</template>
