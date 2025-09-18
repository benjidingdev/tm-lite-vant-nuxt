<script setup>
import Request from "@/utils/request";

definePageMeta({
  layout: "order-campaign",
});

const { token } = $(authStore());
const { userInfo } = $(userStore())
const { wallet } = $(privyStore());
const { setModal } = $(uiStore());

const active = ref(0);
const rulesVisible = ref(false);
const rankList = ref([])
const userAmount = ref(0)
const shareLink = 'https://www.x.com/intent/post'
const stepsValue = ['登录/注册账号', '分享到推特', '挂单']
const stepsButton = ['登录', '去分享', '去挂单']
const shareText = [
  `My limit orders on @TuringMarket are now earning me FREE $TUIT rewards.
You’re missing out if you’re not doing it. 🚀
#Airdrop #YieldFarming
`,
  `Predict → Win.
Place Orders → Farm $TUIT.
Double Duty. Double the Gain.
#TUIT #TuringM
`
]

const tempRankList = computed(() => {
  const temp = [...rankList.value]
  temp.splice(0, 2, temp[1], temp[0]);
  console.log('temp', temp)
  return temp
})

const myRank = computed(() => {
  return rankList.value.findIndex(item => item.proxyWallet === wallet?.address)
})

watch(() => token?.accessToken, (val) => {
  if (val) {
    active.value = 1
    loadLeaderBoard()
  }
})

const share = () => {
  const randomIndex = Math.random() < 0.6 ? 0 : 1
  window.open(`${shareLink}?text=${encodeURIComponent(shareText[randomIndex])}&url=${window.location.href}`, '_blank')
  active.value = 2
  localStorage.setItem('shareX', 'true')
}

const stepsButtonHandle = (ind) => {
  switch (ind) {
    case 0:
      setModal('loginModal', true)
      break;
    case 1:
      share()
      break;
    case 2:
      navigateTo('/')
      break;
  }
}

async function loadLeaderBoard() {
  try {
    const res = await Request({
      url: '/app-api/topic/markets/ranks',
      method: 'POST',
      data: {
        type: "order-reward",
        filterType: "30d",
        timeStart: null,
        timeEnd: null,
        limit: 100,
        proxyWallet: wallet?.address || ""
      }
    })

    rankList.value = res.data.list || []
    userAmount.value = res.data.userTotal || 0
  } catch (e) {
    console.error('loadLeaderBoard', e);
  }
}

onMounted(() => {
  if (token?.accessToken) {
    active.value = 1
    if (localStorage.getItem('shareX')) {
      active.value = 2
    }
  }
  loadLeaderBoard()
})
</script>
<template>
  <div class="w-full h-screen overflow-y-scroll">
    <div
      class="w-full text-white bg-black bg-[url('/campaign/page_bg_mobile.png')] lg:bg-[url('/campaign/page_bg.jpg')] bg-contain lg:bg-[length:auto_100%] lg:bg-center bg-no-repeat lg:pt-20 lg:pb-66 pt-14 pb-10">
      <van-row class="flex justify-center">
        <van-image class="lg:!h-20 h-14" src="/campaign/logo.png" />
      </van-row>
      <van-row class="flex justify-center mt-12 lg:text-[40px] text-[30px] font-black text-white">
        {{ $t('掛單榮耀爭霸') }}
      </van-row>
      <van-row
        class="!block lg:!flex justify-center mt-4 text-[120px] lg:text-[100px] font-black bg-gradient-to-r from-[#06FFF0] to-[#03FB75] bg-clip-text text-transparent">
        <van-row class="h-30 justify-center">競爭</van-row>
        <van-row class="!hidden lg:!block lg:px-4">•</van-row>
        <van-row class="h-30 justify-center">征服</van-row>
        <van-row class="!hidden lg:!block lg:px-4">•</van-row>
        <van-row class="justify-center">收穫</van-row>
      </van-row>
      <van-row class="flex justify-center mt-8 text-[30px] font-black">
        <van-highlight class="text-white text-center px-14" highlight-class="!text-[#B3FF26]"
          source-string="下有效限價單，登上排行榜，贏取每日 $TUIT 獎勵。" keywords="每日 $TUIT" />
      </van-row>
      <van-row class="font-roboto flex justify-center mt-10 lg:mt-4 text-[20px] text-center px-6 lg:px-66 mx-auto">
        在 TuringMarket，不只是預測，更是建設市場流動性的機會。 為了鼓勵用戶積極掛單、提升盤口深度，我們推出 「掛單榮耀爭霸計劃」 —— 每一筆真實有效的掛單，都能為你帶來 $TUIT 獎勵與榮耀排名。
      </van-row>
      <van-row class="flex justify-center mt-7.5 text-[20px] text-center">
        <van-button class="font-roboto h-11 text-lg lg:!h-14 lg:!text-[24px] !font-black !rounded-full !px-10"
          @click="rulesVisible = true">活动规则</van-button>
        <van-button
          class="font-roboto h-11 text-lg lg:!h-14 lg:!text-[24px] !font-black !rounded-full !px-6 !ml-4 !text-white !bg-black !border-0"
          icon="/campaign/x.svg" @click="share">分享到推特</van-button>
      </van-row>
      <div
        class="w-[90%] lg:w-[1222px] lg:px-[152px] px-5 backdrop-blur-xs bg-[#11111199] bg-[url('/campaign/card_bg_mobile.png')] lg:bg-[url('/campaign/card_bg.svg')] bg-[length:100%_100%] bg-no-repeat rounded-4xl mx-auto lg:mt-15 mt-74">
        <van-row class="font-roboto flex justify-center font-bold text-2xl lg:text-[36px] lg:pt-12 pt-9">
          完成已下步骤参与活动
        </van-row>
        <van-row class="mt-4 lg:mt-8">
          <CampaignSteps :value="stepsValue" :button="stepsButton" :active="active" @click="stepsButtonHandle" />
        </van-row>
        <van-divider dashed />
        <van-row class="flex justify-center text-center font-bold text-[24px] mt-6 mb-9.5 lg:mt-9 lg:mb-12 px-14">
          為什麼要加入 「掛單榮耀爭霸」？
        </van-row>
        <van-row class="flex justify-between lg:px-[10%] lg:pb-8 pb-4">
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/reward.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">雙重獎勵</van-row>
            <van-row class="px-4 text-sm lg:text-base opacity-80 justify-center">預測收益 + $TUIT 獎勵</van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/leaderboard.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">排行榜挑戰</van-row>
            <van-row class="px-6 text-sm lg:text-base opacity-80 justify-center">技壓群雄 奪取榮耀</van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/fair.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">鏈上公平</van-row>
            <van-row class="px-6 text-sm lg:text-base opacity-80 justify-center">規則透明 可驗證</van-row>
          </van-col>
        </van-row>
        <van-divider dashed />
        <van-row class="flex justify-center font-bold text-[24px] mt-6 mb-9.5">
          什麼是有效掛單？
        </van-row>
        <van-row class="flex justify-between lg:px-[10%]">
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/order.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">僅限價單</van-row>
            <van-row class="text-sm lg:text-base opacity-80 justify-center">市價單不計算</van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/flow.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">提供流動性</van-row>
            <van-row class="px-2 text-sm lg:text-base opacity-80 justify-center">
              買單需低於現價<span class="hidden lg:inline"> / </span>賣單需高於現價
            </van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/forbidden.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">禁止提前撤單</van-row>
            <van-row class="text-sm lg:text-base opacity-80 justify-center">撤單即失效</van-row>
          </van-col>
        </van-row>
        <van-row
          class="font-roboto justify-center text-center font-bold text-lg text-[#03FB75] pt-6 pb-2 lg:pt-8 lg:pb-9 px-10">
          掛得久、掛得近、掛得多，就能贏得更大獎勵份額！
        </van-row>
        <van-divider dashed />
        <van-row class="justify-center font-bold lg:text-lg lg:pt-4 pb-6 lg:pb-8">
          累計總分數 = 貢獻值 (時間 × 精準度 × 金額)
        </van-row>
      </div>
      <div
        class="w-[90%] lg:w-[1192px] px-8 backdrop-blur-xs bg-[#11111199] bg-[url('/campaign/card_bg_mobile.png')] lg:bg-[url('/campaign/card_bg.svg')] bg-[length:100%_auto] bg-no-repeat rounded-4xl mx-auto lg:mt-88 mt-4 lg:pb-6 pb-10">
        <van-row class="font-roboto justify-center font-bold text-[32px] pt-9.5 pb-10 lg:pt-15 lg:pb-13 uppercase">
          Leaderboard
        </van-row>
        <van-row
          class="lg:w-[88%] lg:h-48 h-35 bg-bottom lg:bg-auto bg-[url('/campaign/ranking.svg')] bg-[length:100%_auto] bg-no-repeat mx-auto lg:mt-20">
          <van-col class="relative w-1/3" v-for="(item, ind) in tempRankList.slice(0, 3)">
            <van-col class="absolute lg:bottom-8 w-full text-center"
              :class="{ 'bottom-[-6px] lg:!bottom-12': ind === 1 }">
              <van-row class="font-dinpro justify-center text-2xl font-bold lg:pb-4 pb-2"
                :class="{ '!pb-0': ind === 1 }">{{ ind === 0 ? 2 : ind === 1 ? ind : ind + 1 }}</van-row>
              <van-row v-if="ind === 1" class="justify-center mb-1">
                <van-image class="w-5 h-4 lg:!w-7 lg:!h-5" src="/campaign/champion.svg" />
              </van-row>
              <van-image class="w-15 h-15 lg:!w-24 lg:!h-24 border-4 border-[#FFFFFF33] rounded-full"
                src="/icons/Avalanche.svg" />
              <van-row class="lg:items-begin items-center justify-center lg:mt-8 mt-1"
                :class="{ 'lg:!mt-10 mt-2': ind === 1 }">
                <van-col>
                  <van-image class="w-6 h-5.5 lg:w-[58px] lg:h-[46px]" :src="`/campaign/0${ind === 0 ? 2 : ind === 1 ? ind : ind + 1}.svg`" />
                </van-col>
                <van-col class="lg:pl-4 pl-1">
                  <van-row class="text-xs lg:text-base opacity-60">{{ item?.nickname }}</van-row>
                  <van-row class="font-dinpro text-xl">{{ item?.total || 0 }}</van-row>
                </van-col>
              </van-row>
            </van-col>
          </van-col>
        </van-row>
        <van-row
          class="h-12 leading-12 font-bold rounded-2xl bg-gradient-to-tr from-[#1652F033] to-[#7000FF] lg:mt-4 mt-8">
          <van-col class="lg:pl-16 pl-4 pr-4">Rank</van-col>
          <van-col class="w-1/2">Trader</van-col>
          <van-col>Amount</van-col>
        </van-row>
        <van-list class="max-h-[448px] overflow-auto">
          <van-row class="h-16 leading-16 font-bold rounded-xl" :class="{ 'bg-[#FFFFFF0A]': ind % 2 === 1 }"
            v-for="(item, ind) in rankList.slice(3)" :key="ind">
            <van-col
              class="!w-8 h-8 leading-8 text-center text-sm rounded-full bg-[#FFFFFF33] my-auto lg:ml-16 ml-4 mr-6">{{ ind + 4 }}</van-col>
            <van-col class="w-1/2 font-normal !flex">
              <van-image class="!w-10 !h-10 rounded-full my-auto mr-4" :src="item?.user?.avatar || '/favicon.ico'" />
              <van-row>{{ item?.nickname }}</van-row>
            </van-col>
            <van-col>{{ item?.total || 0 }}</van-col>
          </van-row>
        </van-list>
        <van-row class="h-16 leading-16 font-bold rounded-xl bg-[#3A5AFE] items-center">
          <van-col
            class="!w-8 h-8 leading-8 text-center text-sm rounded-full bg-[#FFFFFF33] my-auto lg:ml-16 ml-6 mr-6">{{ myRank < 0 ? '99+' : myRank + 1 }}</van-col>
          <van-col class="w-1/2 font-normal !flex">
            <van-image class="!w-10 !h-10 rounded-full my-auto mr-4" src="/favicon.ico" />
            <van-row>{{ token?.accessToken ? userInfo?.nickname : '登录账号查看您的排名' }}</van-row>
          </van-col>
          <van-col v-if="token?.accessToken">{{ userAmount }}</van-col>
          <van-button v-else class="font-dinpro !h-10 !text-[#3A5AFE] !rounded-xl"
            @click="setModal('loginModal', true)">去登陆</van-button>
        </van-row>
      </div>
    </div>
  </div>
  <campaign-rules :visible.sync="rulesVisible" @close="rulesVisible = false" />
</template>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
