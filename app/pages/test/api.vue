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

  // if (rz.statusMessage === 'RefIdAlreadyExists') {
  //   debug('refId already exists')
  // } else {
  //   debug('refId not exists')
  // }
}
</script>
<template>
    <div class="h-screen">
        <vanButton @click="postInvite">test invite post</vanButton>
    </div>
</template>
