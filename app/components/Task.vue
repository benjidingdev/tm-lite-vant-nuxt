<script setup lang="ts">
import { onMounted } from "vue";
import { getUserTask, userTaskReceive } from "@/api/userInfo";

const { modalIsShow } = $(uiStore());
const router = useRouter();
const voData = $ref({
  taskList: [],
  chooseTask: null,
  openDrawer: false,
});

const receiveTask = async (sub) => {
  const res = await userTaskReceive({ id: sub.id });
  if (res.code == 0) getTasks();
};

const getTasks = async () => {
  try {
    let res = await getUserTask();
    if (res.code == 0) {
      voData.taskList = res.data;
    }
  } finally {
    // Handle any cleanup or final actions here if needed
  }
};
let active = $ref(0)
onMounted(() => {
  getTasks();
});

const theTaskImg = (img) => {
  return img === 'TaskImage' ? '/logo.png' : img
}
</script>

<template>
  <div class="p-4">
    <van-tabs v-model:active="active">
      <van-tab
        v-for="task in voData.taskList"
        :key="task.id"
        :title="task.name"
        class="rounded-xl"
      >
        <div
          v-for="sub in task.subTasks"
          :key="sub.id"
          class="task container mt-2"
        >
          <van-card
            :desc="sub.description"
            :currency="$t('Obtained: ')"
            :price="sub.rewardNumber * sub.finishedCount + ' ' + sub.rewardType"
            :title="sub.name"
            :thumb="theTaskImg(task.image)"
          >
            <template #tags>
              <van-tag class="p-2" plain type="primary"
                >{{ $t("Award") }}: {{ sub.rewardNumber }}
                {{ sub.rewardType }}</van-tag
              >
            </template>
            <template #footer>
              <van-button
                v-if="sub.isFinish"
                type="primary"
                size="small"
                plain
                @click="receiveTask(sub)"
              >
                {{ $t("Get Rewards") }}
              </van-button>
              <van-button
                v-else-if="sub.eventTasks[0]?.currentEventValue > 0"
                size="small"
                type="primary"
                plain
                @click="router.push(sub.skipUrl)"
              >
                {{ $t("In Progress") }}
              </van-button>
              <van-button
                v-else-if="sub.eventTasks[0]?.taskEvent == 'INVITE'"
                size="small"
                type="primary"
                plain
                @click="modalIsShow.share = true"
              >
                {{ $t("Go To Invite") }}
              </van-button>
              <van-button
                v-else-if="sub.eventTasks[0]?.taskEvent == 'TRADE'"
                size="small"
                type="primary"
                plain
              >
                {{ $t("Go To Trade") }}
              </van-button>
              <van-button
                v-else
                type="primary"
                size="small"
                plain
                @click="router.push(sub.skipUrl)"
              >
                {{ sub.skipTip }}
              </van-button>
            </template>
          </van-card>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.van-tag--primary.van-tag--plain {
  color: #00c58d;
}
</style>
