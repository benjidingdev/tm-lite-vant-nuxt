<script setup lang="ts">
const emailPattern =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let { modalIsShow, pwdInputRef, isPwdFocused } = $(uiStore());
let {
  email,
  hasSend,
  isLoading,
  doLogin,
  sendEmail,
  oneTimePassword,
  errorInfo,
} = $(privyStore());
const { t } = useI18n();

let countdown = $ref(0);
let resendDisabled = $computed(() => countdown > 0);

/**
 * Send email to Privy to get one time password
 */
const getOTP = async () => {
  startCountdown();
  await sendEmail();
};

let countdownInterval;
const startCountdown = () => {
  countdown = 60;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    countdown--;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

watch(
  () => oneTimePassword,
  async (newVal: string) => {
    if (newVal.length === 6) {
      // The entrance of login
      await doLogin();
      isPwdFocused = true;
      pwdInputRef.value = "";
      pwdInputRef.focus();
      oneTimePassword = "";
    }
  }
);

watch(
  () => modalIsShow.loginModal,
  async (newVal: boolean) => {
    if (newVal) {
      setTimeout(() => {
        pwdInputRef.focus();
      }, 300);
    }
  }
);

watch(
  () => hasSend,
  async (newVal: boolean) => {
    if (newVal) {
      setTimeout(() => {
        pwdInputRef.focus();
      }, 300);
    }
  }
);

const counterText = $computed(() => {
  return countdown > 0
    ? t("Resend ({countdown}s)", { countdown })
    : t("Resend Code");
});
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
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="email"
            name="email"
            left-icon="envelop-o"
            :label="$t('Email')"
            :placeholder="$t('Email')"
            :rules="[
              { required: true, message: $t('Please enter email') },
              {
                pattern: emailPattern,
                message: $t('Please enter a valid email address'),
              },
            ]"
          />

          <span
            v-if="isLoading || errorInfo"
            :class="`text-sm my-4 float-right pr-4 ${
              errorInfo ? 'text-red-400' : 'text-gray-500'
            }`"
            >{{ errorInfo ? errorInfo : "Sending..." }}</span
          >
          <template v-if="hasSend">
            <AuthPasswordInput v-model="oneTimePassword" />

            <div class="flex justify-end">
              <button
                class="px-4 py-2 underline"
                :class="{
                  'decoration-gray-500': countdown > 0,
                  'decoration-blue-500': countdown <= 0,
                }"
                @click="getOTP"
                :disabled="resendDisabled"
              >
                <span
                  class="text-sm"
                  :class="{
                    'text-gray-500': countdown > 0,
                    'text-blue-500': countdown <= 0,
                  }"
                >
                  {{ counterText }}</span
                >
              </button>
            </div>
          </template>
          <div v-else class="mt-4">
            <van-button
              round
              block
              type="primary"
              @click="getOTP"
              native-type="submit"
              :loading="isLoading"
            >
              {{ $t("Submit") }}
            </van-button>
          </div>
        </van-cell-group>

        <div class="mt-8 mb-4 text-center text-sm text-gray-500">
          {{ $t("Powered by TuringM.IO") }}
        </div>
      </van-form>
    </div>
  </van-dialog>
</template>
