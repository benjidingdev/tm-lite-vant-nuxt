<script setup lang="ts">
const emailPattern =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { $privy } = useNuxtApp();
const { todoSign } = $(authStore());
const { setModal, modalIsShow, keyBoardIsShow, setKeyBoard } = $(uiStore());
const {
  email,
  hasSend,
  oneTimePassword,
  isLoading,
  doLogin,
  wallet,
  userId,
  initWallet,
  errorInfo,
} = $(privyStore());

let otpValue = $ref("");
let showKeyboard = $ref(false);
let currentStep = $ref(1);
let countdown = $ref(0);
let resendDisabled = $ref(false);
let countdownInterval = null;

const resendBtnColor = $computed(() => {
  return countdown > 0 ? "text-gray-500" : "text-blue-500";
});
const underlineColor = $computed(() => {
  return countdown > 0 ? "decoration-gray-500" : "decoration-blue-500";
});

const login = async () => {
  if (!oneTimePassword) {
    return;
  }
  await doLogin();
  await initWallet();
  await todoSign();
};

const resend = async () => {
  startCountdown();
  await sendEmail();
};

const sendEmail = async () => {
  await $privy.auth.email.sendCode(email);
};

function updateButtonState() {
  if (countdown > 0) {
    resendDisabled = true;
  } else {
    resendDisabled = false;
  }
}

const startCountdown = () => {
  countdown = 60;
  updateButtonState();

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    countdown--;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
    }
    updateButtonState();
  }, 1000);
};

watch(
  () => oneTimePassword,
  (newVal: string) => {
    if (newVal.length === 6) {
      login();
    }
  }
);
</script>

<template>
  <van-dialog
    v-model:show="modalIsShow.loginModal"
    closeable
    :show-confirm-button="false"
    :title="$t('Login in or sign up')"
  >
    <div class="step-one">
      <img
        class="w-[60%] py-8 rounded-xl m-auto"
        src="@/assets/img/logo-light.png"
      />
      <van-form @submit="login">
        <van-cell-group inset>
          <van-field
            v-model="email"
            name="email"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :rules="[{ required: true, message: $t('Please enter email') }]"
          />
          <span
            v-if="isLoading || errorInfo"
            :class="`text-sm my-4 float-right pr-4 ${
              errorInfo ? 'text-red-400' : 'text-gray-500'
            }`"
            >{{ errorInfo ? errorInfo : "Sending..." }}</span
          >
          <van-password-input
            v-if="hasSend"
            :value="oneTimePassword"
            :mask="false"
            :focused="true"
            @focus="setKeyBoard('settings', true)"
          />
        </van-cell-group>
        <div v-if="hasSend" class="flex justify-end">
          <button
            :class="`px-4 py-2 underline ${underlineColor}`"
            @click="resend"
            :disabled="resendDisabled"
          >
            <span :class="`text-sm ${resendBtnColor}`">{{
              countdown > 0 ? `Resend (${countdown}s)` : "Resend Code"
            }}</span>
          </button>
        </div>
        <div v-if="!hasSend" style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="isLoading"
            @click="doLogin"
          >
            {{ $t("Submit") }}
          </van-button>
        </div>
        <div class="mt-8 mb-4 text-center font-bold">Supported by TuringM</div>
      </van-form>
    </div>
  </van-dialog>
</template>
