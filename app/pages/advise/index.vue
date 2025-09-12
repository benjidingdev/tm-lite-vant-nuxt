<script setup lang="ts">
import { getAdviseList, getTopicsVote } from "~/api/advise";
import { useRoute } from 'vue-router'

const { locale } = $(useI18n())
const route = useRoute()
const { setModal } = $(uiStore());
const { token } = $(authStore());

const voData = reactive({
  queryParams: {
    title: "",
    myself: 0,
    pageNo: 0,
    pageSize: 10,
  },
  list: [],
  total: 0
});

const loading = ref(false);
const finished = ref(false);

const init = () => {
  voData.list = [];
  voData.total = 0
  voData.queryParams.pageNo = 0;
  loading.value = false;
  finished.value = false;
  onLoad()
}

const onClear = () => {
  if (voData.queryParams.adviseId) {
    delete voData.queryParams.adviseId
  }

  init()
}

onMounted(() => {
  if (route.query.adviseId) {
    voData.queryParams.adviseId = route.query.adviseId
  }

  if (route.query.title) {
    voData.queryParams.title = route.query.title
  }

  init()
})

const onLoad = async () => {

  loading.value = true;

  try {
    voData.queryParams.pageNo++;

    let res = await getAdviseList(voData.queryParams);
    if (res.code === 0) {
      voData.list = voData.list.concat(res.data.list);
      voData.total = res.data.total;

      if (voData.list.length >= voData.total || res.data.list.length < voData.queryParams.pageSize) {
        finished.value = true;
      }
    } else {
      voData.queryParams.pageNo--;
    }
  } catch (error) {
    voData.queryParams.pageNo--;
  } finally {
    loading.value = false;
  }
};

const topicsVote = async (adviseId: number) => {
  if (token.accessToken === "") {
    setModal("loginModal", true);
    closeToast();
    return;
  } else {
    let res = await getTopicsVote(adviseId)
    if (res.code === 0) {
      voData.list.map(item => {
        if (item.adviseId === adviseId) {
          item.isVote = 1
          item.votes++
        }
      })
    }
  }
}


const claimReward = () => {
  if (token.accessToken === "") {
    setModal("loginModal", true);
    closeToast();
    return;
  } else {
    setModal("rewardModal", true);
  }
}

let title = ref('')
let adviseId = ref(0)

const goShares = (item: object) => {
  title.value = item.title
  adviseId.value = item.adviseId
  setModal("sharesModal", true);
}
</script>
<template>
  <div class="h-[calc(100dvh-var(--nav-height))] overflow-y-hidden flex flex-col">

    <van-search v-model="voData.queryParams.title" background="transparent" shape="round"
      :placeholder="$t('Search Prompt')" @search="init" @clear="onClear" />

    <van-tabs v-model:active="voData.queryParams.myself" animated @click-tab="init">
      <van-tab :title="$t('All')" />
      <van-tab :title="$t('My')" />
    </van-tabs>

    <van-list class="p-2 flex-1 overflow-y-scroll" v-model:loading="loading" :finished="finished" @load="onLoad">

      <van-card class="rounded-lg relative" v-for="item in voData.list" :key="item.adviseId">

        <template #title>
          <p class="text-lg font-bold">{{ item.title }}</p>
          <img v-if="voData.queryParams.myself === 0 && item.isVote" class="w-20 h-20 absolute -top-3 -right-3"
            src="/assets/icon/voted.svg" />
          <img v-if="voData.queryParams.myself === 1 && item.isAdopt" class="w-20 h-20 absolute -top-3 -right-3"
            src="/assets/icon/claimed.svg" />
        </template>

        <template #desc>
          <van-text-ellipsis class="text-ellipsis" rows="3" :content="item.description" :expand-text="$t('Expand')"
            :collapse-text="$t('Collapse')" />

          <div class="flex flex-row justify-between items-center pb-2">
            <div class="flex flex-row items-center">
              <img class="w-5 h-5 rounded-full mr-2" :src="item.avatar" />
              <p>{{ item.nickname }}</p>
              <van-icon v-if="voData.queryParams.myself === 1" @click="goShares(item)" name="share-o" size="15"
                class="ml-2" color="#1989fa" />
            </div>
            <p>{{ $t('Votes') }}：{{ item.votes }}</p>
          </div>

        </template>
        <template #footer>
          <van-button class="w-[80px]" size="small" type="primary" @click="topicsVote(item.adviseId)"
            v-if="voData.queryParams.myself === 0 && item.isVote === 0">
            {{ $t("Vote") }}
          </van-button>
        </template>
      </van-card>

      <template #finished>
        <p class="text-[#f1f1f1]">{{ $t('No More') }}</p>
      </template>
    </van-list>
    <div class="p-2 py-4 flex flex-row justify-between gap-x-4">
      <van-button round class="w-1/2" type="primary" @click="useNavigateTo('/advise/launch')">
        {{ $t("Initiate a topic") }}
      </van-button>
      <van-button round class="w-1/2" type="success" @click="claimReward">
        {{ $t('Claim reward') }}
      </van-button>
    </div>
  </div>
  <AdviseClaimReward />

  <AdviseShares :title="title" :adviseId="adviseId" />
</template>

<style scoped>
.text-ellipsis {
  margin: 10px 0px;
  line-height: 1.8;
}
</style>
