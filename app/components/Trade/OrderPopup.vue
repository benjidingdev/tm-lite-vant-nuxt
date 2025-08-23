<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";

const { modalIsShow } = $(uiStore());

const buyTab = ref("");
const sellTab = ref("");

const minDate = $ref(new Date(2020, 0, 1));
const maxDate = $ref(new Date(2025, 5, 1));

const onConfirm = () => {};

const onCancel = () => {
  showToast("cancel");
};
</script>

<template>
  <van-popup
    v-model:show="modalIsShow.showTradePicker"
    destroy-on-close
    round
    position="bottom"
  >
    <van-picker-group
      title="Position Trade"
      :tabs="['Buy', 'Sell']"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <van-cell-group v-model="buyTab">
        <van-field name="switch" label="YES/NO">
          <template #input>
            <van-switch v-model="checked" />
          </template>
        </van-field>
        <van-cell-group>
          <van-cell title="cell" value="content" />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            Buy
          </van-button>
        </div>
      </van-cell-group>

      <van-cell-group v-model="sellTab">
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            Sell
          </van-button>
        </div>
      </van-cell-group>
    </van-picker-group>
  </van-popup>
</template>
