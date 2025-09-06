<script setup lang="ts">
  const emailPattern =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  const { todoSign } = $(authStore());
  const { modalIsShow, setKeyBoard } = $(uiStore());
  const {
    email,
    hasSend,
    isLoading,
    doLogin,
    initWallet,
    errorInfo,
    sendEmail,
  } = $(privyStore());
  const { t } = useI18n();
  let { oneTimePassword } = $(privyStore());

  let countdown = $ref(0);
  let resendDisabled = $computed(() => countdown > 0);

  const login = async () => {
    // van form vaddate pass; then to here
    // 1. send email
    if (!hasSend) {
      resend();
      return;
    }

    //
    if (!oneTimePassword) {
      return;
    }
    await doLogin();
    setKeyBoard('settings', false);
    await initWallet();
    await todoSign();
  };

  const resend = async () => {
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

  const handleFocus = async () => {
    try {
      // const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
      // if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
      // }

      const pastedText = await navigator.clipboard.readText();
      const extractedCode = pastedText.match(/\d{6}/);

      if (extractedCode) {
        oneTimePassword = extractedCode[0];
      }
    } catch (error) {
      console.error(error);
    }
    setKeyBoard("settings", true);
  };

  watch(
    () => oneTimePassword,
    (newVal: string) => {
      if (newVal.length === 6) {
        login();
      }
    }
  );

  const counterText = $computed(() => {
    return countdown > 0 ? t('Resend ({countdown}s)', { countdown }) : t('Resend Code');
  });
</script>

<template>
  <van-dialog v-model:show="modalIsShow.loginModal" closeable :show-confirm-button="false"
    :title="$t('Login in or sign up')">
    <div class="step-one">
      <img class="w-[60%] py-8 rounded-xl m-auto" src="@/assets/img/logo-light.png" />
      <van-form>
        <van-cell-group inset>
          <van-field v-model="email" name="email" :label="$t('Email')" :placeholder="$t('Email')"
            :rules="[{ required: true, message: $t('Please enter email') }, { pattern: emailPattern, message: $t('Please enter a valid email address') }]" />

          <span v-if="isLoading || errorInfo" :class="`text-sm my-4 float-right pr-4 ${errorInfo ? 'text-red-400' : 'text-gray-500'
            }`">{{ errorInfo ? errorInfo : "Sending..." }}</span>


          <template v-if="hasSend">
            <van-password-input :value="oneTimePassword" :mask="false" :focused="true" @focus="handleFocus" />

            <div class="flex justify-end">
              <button class="px-4 py-2 underline"
                :class="{ 'decoration-gray-500': countdown > 0, 'decoration-blue-500': countdown <= 0 }" @click="resend"
                :disabled="resendDisabled">
                <span class="text-sm" :class="{ 'text-gray-500': countdown > 0, 'text-blue-500': countdown <= 0 }"> {{
                  counterText }}</span>
              </button>
            </div>
          </template>
          <div v-else class="mt-4">
            <van-button round block type="primary" @click="login" native-type="submit" :loading="isLoading">
              {{ $t("Submit") }}
            </van-button>
          </div>
        </van-cell-group>

        <div class="mt-8 mb-4 text-center text-sm text-gray-500">{{ $t('Powered by TuringM.IO') }}</div>
      </van-form>
    </div>
  </van-dialog>
</template>
