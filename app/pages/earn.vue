<script setup></script>

<template>
  <!--earn dashboard-->
  <div class="earn-dashboard-container bg-gray-100 inset pt-2">
    <div>
      <van-cell-group inset>
        <van-cell title="TUIT" value="1000" />
      </van-cell-group>
    </div>

    <div class="p-4">
      <van-tabs v-model:active="active">
        <van-tab title="Hot task">
          <div class="Task container mt-1">
            <van-card
              desc="+100TUIT"
              title="Trade to earn TUIT"
              thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
            >
              <template #footer>
                <van-button size="small" type="primary">Earn</van-button>
              </template>
            </van-card>
          </div>
        </van-tab>
        <van-tab title="Invitations"></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style>
.earn-dashboard-container {
  height: calc(100vh - 130px);
  /* Adjust height based on nav bar and tab bar */
}
</style>
