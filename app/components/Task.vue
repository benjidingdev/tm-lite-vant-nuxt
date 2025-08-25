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

const openDetail = (item) => {
  voData.openDrawer = true;
  voData.chooseTask = item;
};

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
onMounted(() => {
  getTasks();
});
</script>

<template>
  <div class="p-4">
    <van-tabs v-model:active="active">
      <van-tab
        v-for="task in voData.taskList"
        :key="task.id"
        :title="task.name"
      >
        <div
          v-for="sub in task.subTasks"
          :key="sub.id"
          class="task container mt-1"
        >
          <van-card
            :desc="sub.description"
            currency="Obtained: "
            :price="sub.rewardNumber * sub.finishedCount + ' ' + sub.rewardType"
            :title="sub.name"
            :thumb="task.image"
          >
            <template #tags>
              <van-tag class="p-2" plain type="primary"
                >Award: {{ sub.rewardNumber }} {{ sub.rewardType }}</van-tag
              >
            </template>
            <template #footer>
              <van-button
                v-if="sub.isFinish"
                type="primary"
                class="w-[40%] text-sm font-bold rounded-full border-0 ml-0 mt-4!"
                @click="receiveTask(sub)"
              >
                Get Rewards
              </van-button>
              <van-button
                v-else-if="sub.eventTasks[0]?.currentEventValue > 0"
                type="primary"
                class="w-[40%] text-sm font-bold rounded-full border-0 ml-0 mt-4!"
                @click="router.push(sub.skipUrl)"
              >
                In Progress
              </van-button>
              <van-button
                v-else-if="sub.eventTasks[0]?.taskEvent == 'INVITE'"
                type="primary"
                @click="modalIsShow.share = true"
                class="w-[40%] text-sm font-bold rounded-full border-0 ml-0 mt-4!"
              >
                Go To Invite
              </van-button>
              <van-button
                v-else-if="sub.eventTasks[0]?.taskEvent == 'TRADE'"
                type="primary"
                class="w-[40%] text-sm font-bold rounded-full border-0 ml-0 mt-4!"
              >
                Go To Trade
              </van-button>
              <van-button
                v-else
                type="primary"
                class="w-[40%] text-sm font-bold rounded-full border-0 ml-0 mt-4!"
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
.earn-dashboard-container {
  height: calc(100vh - 130px);
  /* Adjust height based on nav bar and tab bar */
}
.van-tag--primary.van-tag--plain {
  color: #00c58d;
}
</style>
