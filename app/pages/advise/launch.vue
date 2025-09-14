<script setup lang="ts">
import { addAdviseList } from "~/api/advise";

const { wallet } = $(privyStore())
const { token } = $(authStore());
const { setModal } = $(uiStore());

const voData = reactive({
  title: "test",
  description: "aaaa",
  hash: '',
});

const formRef = ref();
const loading = ref(false);

const more = ref(false)
const adviseId = ref(0)
const title = ref('')

const onSubmit = async (values: object) => {
  if (token.accessToken === "") {
    setModal("loginModal", true);
    closeToast();
    return;
  } else {
    loading.value = true;
    const { hash } = await doFetch('/api/lighthouse/upload', {
      method: 'POST',
      body: {
        title: voData.title,
        description: voData.description,
        address: wallet?.address,
      }
    })
    voData.hash = hash
    let res = await addAdviseList(voData)
    adviseId.value = res.data
    title.value = voData.title

    if (res.code === 0) {
      await showDialog({
        message: $t('Successful prompt'),
        confirmButtonText: $t('Shares'),
        showCancelButton: true
      }).then(async () => {
        setModal("sharesModal", true);
        await safeResetForm();
      }).catch(async () => {
        loading.value = false;
        await safeResetForm();
      });
      loading.value = false;
    } else {
      loading.value = false;
    }
  }
};

const safeResetForm = () => {
  if (formRef.value && typeof formRef.value.reset === "function") {
    formRef.value.reset();
  } else {
    voData.title = "";
    voData.description = "";
  }
};

const getTuit = () => {
  setModal("tuitModal", true);
}
</script>
<template>
  <div class="h-[calc(100dvh-var(--nav-height))] overflow-y-scroll">
    <p class="text-center font-bold mb-4 text-white">{{ $t('Initiate a topic') }}</p>
    <van-form ref="formRef" @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="voData.title" name="title" :label="$t('Title')" :placeholder="$t('Title')" autosize
          maxlength="20" show-word-limit :rules="[{ required: true, message: $t('Ttitle Prompt') }]" />
        <van-field v-model="voData.description" name="description" :label="$t('Description')"
          :placeholder="$t('Description')" rows="5" type="textarea" />
      </van-cell-group>
      <div class="p-4">
        <van-button round block type="primary" :loading="loading" :disabled="loading" loading-text="loading..."
          native-type="submit">
          {{ $t('Submit') }}
        </van-button>
      </div>
    </van-form>
    <div class="px-4 pb-4">
      <ol type="1" class="text-sm">
        <li class="mb-4 text-white">{{ $t('Suggested Rules') }}</li>
        <li class="mb-4 text-white">{{ $t('Consideration Rules') }}</li>
        <li class="mb-4 text-white"> {{ $t('Adopt Rules') }}
          <span @click="getTuit" class="underline">（{{ $t('Desc Tuit') }}？）</span>
        </li>
        <li v-if="more" class="mb-4 text-white"> {{ $t('Hide Rules') }}</li>
        <p class="text-right text-white" @click="more = !more">
          {{ more ? $t('Collapse') : $t('Expand') }}
          <van-icon :name="more ? 'arrow-up' : 'arrow-down'" />
        </p>
      </ol>
    </div>
  </div>
  <AdviseTuitIntroduction />
  <AdviseShares :title="title" :adviseId="adviseId" />
</template>
