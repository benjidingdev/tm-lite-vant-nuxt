<script setup lang="ts">
const { login, logout, getAccessToken, getIDToken, getDecodedIDToken, getGrantedAllScopes } = $(liffStore());

const accessToken = ref()
const testGetAccessToken = async () => {
  accessToken.value = getAccessToken()
}

const idToken = ref()
const testGetIDToken = async () => {
  idToken.value = getIDToken()
}

const decodedIDToken = ref()
const testGetDecodedIDToken = async () => {
  decodedIDToken.value = getDecodedIDToken()
}

const grantedAllScopes = ref()
const testGetGrantedAllScopes = async () => {
  grantedAllScopes.value = await getGrantedAllScopes()
}
</script>
<template>
  <van-cell-group inset title="LIFF测试" class="text-[#fff]">
    <van-cell is-link title="登录" @click="login()" />
    <van-cell is-link title="登出" @click="logout()" />
    <van-cell is-link title="获取accessToken" @click="testGetAccessToken" :label="accessToken" />
    <van-cell is-link title="获取IDToken" @click="testGetIDToken" :label="idToken" />
    <van-cell is-link title="获取DecodedIDToken" @click="testGetDecodedIDToken" :label="decodedIDToken" />
    <van-cell is-link title="获取全部权限" @click="testGetGrantedAllScopes" :label="grantedAllScopes" />
  </van-cell-group>
</template>
