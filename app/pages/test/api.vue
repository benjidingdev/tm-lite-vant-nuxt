<script setup lang="ts">
const debug = useDebug('api')
const postInvite = async () => {
  const rz = await doFetch('/api/invite/updateRefId', {
    method: 'POST',
    body: {
      refId: 'ec993fd8-718d-45db-8eca-7f289ce18286',
    }
  })
  debug({ rz })
}

const getRank = async () => {
  const rz = await doFetch('/api/invite/rank', {
    method: 'GET',
  })
  debug({ rz })
}
</script>
<template>
    <div class="h-screen">
        <vanButton @click="postInvite">post invite refId</vanButton>
        <vanButton @click="getRank">get invite rank</vanButton>
    </div>
</template>
