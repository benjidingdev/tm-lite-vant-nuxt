<script setup lang="ts">
const emailPattern =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { todoSign } = $(authStore());
const { setModal, modalIsShow, keyBoardIsShow, setKeyBoard } = $(uiStore());
const {
  email,
  hasSend,
  oneTimePassword,
  isLoading,
  doLoginPrivy,
  wallet,
  userId,
  initWallet,
} = $(privyStore());

let errorInfo = $ref("");
let otpValue = $ref("");
let showKeyboard = $ref(false);
let currentStep = $ref(1);

const login = async () => {
  await initWallet();
  await todoSign();
  setModal("loginModal", false);
};

watch(otpValue, (newOtpValue) => {
  if (newOtpValue.length === 6 && newOtpValue !== "123456") {
    errorInfo = "OPT code is incorrect, please try again.";
  } else {
    errorInfo = "";
  }
});
</script>

<template>
  <van-dialog
    v-model:show="modalIsShow.loginModal"
    closeable
    :show-confirm-button="false"
    title="Login in or sign up"
  >
    <div v-if="!userId" class="step-one">
      <img
        class="w-[60%] py-8 rounded-xl m-auto"
        src="@/assets/img/logo-light.png"
      />
      <van-form @submit="doLoginPrivy">
        <van-cell-group inset>
          <van-field
            v-model="email"
            name="email"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :rules="[{ required: true, message: $t('Please enter email') }]"
          />
          <van-password-input
            v-if="hasSend"
            :value="oneTimePassword"
            :mask="false"
            :focused="showKeyboard.settings"
            @focus="setKeyBoard('settings', true)"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="isLoading"
          >
            {{ $t("Submit") }}
          </van-button>
        </div>
      </van-form>
    </div>

    <div v-else class="step-two" >
      <van-cell-group v-if="wallet">
        <van-cell :title="$t('Wallet')" :label="wallet?.address" />
        <div class="flex justify-evenly py-4">
          <van-button round type="primary" @click="login" :loading="isLoading">
            {{ $t("Login") }}
          </van-button>
        </div>
      </van-cell-group>
      <div v-else class="p-4">
        <van-button
          round
          block
          type="primary"
          @click="initWallet"
          :loading="isLoading"
        >
          {{ $t("Create wallet") }}
        </van-button>
      </div>
    </div>
    <div></div>
  </van-dialog>
</template>
