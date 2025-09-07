<script setup lang="ts">
  import { getUserTask, userTaskReceive } from "@/api/userInfo";
  const { modalIsShow } = $(uiStore());

  let voData = reactive({
    list: []
  })

  const userTask = async () => {
    let res = await getUserTask({ slug: 'advise-task' })
    if (res.code === 0) {
      voData.list = res.data[0].subTasks
    }
  }

  const { locale } = $(useI18n())
  const goLink = async (path: string) => {
    const url = locale === "en-US" ? path : `/${locale}${path}`;
    await navigateTo(url);
  }

  const getReward = async (id: number) => {
    let res = await userTaskReceive({ id })
    if (res.code === 0) {
      userTask()
    }
  }
</script>
<template>
  <van-dialog v-model:show="modalIsShow.rewardModal" :title="$t('Reward Title')" @open="userTask" closeable
    :show-confirm-button="false">
    <ul class="max-h-[500px] pt-5 overflow-y-scroll">
      <li v-for="item in voData.list" :key="item.id" class="mb-4 px-4">
        <p class="text-sm font-bold mt-4 mb-2">{{ item.name }}</p>
        <p class="text-sm mb-2">{{ item.description }}</p>
        <p class="mb-1 text-sm">{{ $t('Mission Reward') }}：{{ item.rewardNumber }}
          <span class="mr-2">{{ item.rewardType }}</span>
        </p>
        <p class="mb-1 text-sm">{{ $t('Obtained') }}：{{ item.finishedCount * item.rewardNumber }}</p>
        <p class="mb-1 text-sm">{{ $t('Progress') }} ： {{ item.eventTasks[0].currentEventValue }} / {{
          item.eventTasks[0].taskEventValue }}
        </p>
        <p class="text-right">
          <van-button round size="small" type="primary" :disabled="item.isReceive" v-if="item.isFinish"
            @click="getReward(item.id)">
            {{ item.isReceive ? 'FINISHED' : 'GET REWARD' }}
          </van-button>
          <van-button round size="small" type="primary" v-else @click="goLink(item.skipUrl)">
            {{ item.skipTip }}
          </van-button>
        </p>
      </li>
    </ul>
  </van-dialog>
</template>
