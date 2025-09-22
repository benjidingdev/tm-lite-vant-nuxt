<script setup>
import Request from "@/utils/request";

definePageMeta({
  layout: "order-campaign",
});

const { locale, setLocale } = useI18n();
const { token } = $(authStore());
const { userInfo } = $(userStore())
const { wallet } = $(privyStore());
const { setModal } = $(uiStore());
const { t } = useI18n()

const active = ref(0);
const rulesVisible = ref(false);
const rankList = ref([])
const userAmount = ref(0)
const shareLink = 'https://www.x.com/intent/post'

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

const isEnglish = $computed(
  () => locale.value === 'en-US'
);

const tempRankList = computed(() => {
  const temp = [...rankList.value]
  if (temp.length > 1)
    temp.splice(0, 2, temp[1], temp[0]);
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

const toggleLang = () => {
  setLocale(isEnglish ? 'zh-TW' : 'en-US')
}

const share = () => {
  if (!token?.accessToken) {
    setModal('loginModal', true)
    return
  }
  const randomIndex = Math.random() < 0.6 ? 0 : 1
  window.open(`${shareLink}?text=${encodeURIComponent(shareText[randomIndex])}&url=${window.location.href}?inviteCode=${userInfo.inviteCode}`, '_blank')
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
      useNavigateTo('/')
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
      class="w-full text-white bg-black bg-[url('/campaign/page_bg_mobile.png')] lg:bg-[url('/campaign/page_bg.jpg')] bg-[length:100%_auto] bg-no-repeat lg:pb-66 pb-10">
      <van-row class="justify-end">
        <van-switch class="mt-2 mr-2" v-model="isEnglish" size="24" active-color="var(--van-switch-background)"
          @change="toggleLang">
          <template #background>
            <van-row class="h-full text-xs justify-between items-center pl-1 pr-1.5">
              <van-col>EN</van-col>
              <van-col>中</van-col>
            </van-row>
          </template>
        </van-switch>
      </van-row>
      <van-row class="flex justify-center lg:pt-10 pt-4">
        <van-image class="lg:!h-20 h-14" src="/campaign/logo.png" />
      </van-row>
      <van-row class="flex justify-center mt-12 lg:!text-[40px] text-[30px] font-black text-white"
        :class="{ '!text-[26px]': isEnglish }">
        {{ t('Campaign Title') }}
      </van-row>
      <van-row :class="{ 'lg:!text-[75px] !text-[60px]': isEnglish }"
        class="!block lg:!flex justify-center mt-4 text-[120px] lg:text-[100px] font-black bg-gradient-to-r from-[#06FFF0] to-[#03FB75] bg-clip-text text-transparent">
        <van-row class="!hidden lg:!block h-30 justify-center" :class="{ '!h-18': isEnglish }">{{ t('Compete') }}</van-row>
        <van-row class="!hidden lg:!block lg:px-4">•</van-row>
        <van-row class="!hidden lg:!block h-30 justify-center" :class="{ '!h-18': isEnglish }">{{ t('Conquer') }}</van-row>
        <van-row class="!hidden lg:!block lg:px-4">•</van-row>
        <van-row class="!hidden lg:!block justify-center">{{ t('Harvest') }}</van-row>
      </van-row>
      <van-row class="flex justify-center mt-8 text-[16px] lg:text-[30px] font-black"
        :class="{ '!text-[16px] lg:!text-[30px]': isEnglish }">
        <van-highlight class="text-white text-center px-14 lg:w-1/2" :class="{ '!px-4': isEnglish }"
          highlight-class="!text-[#B3FF26]" :source-string="t('Campaign Headline')" keywords="$TUIT" />
      </van-row>
      <van-row
        class="!hidden font-roboto lg:!flex justify-center mt-10 lg:mt-4 text-[20px] text-center px-6 lg:px-28 mx-auto lg:w-1/2"
        :class="{ 'lg:!px-20': isEnglish }">
        {{ t('Campaign Introduction') }}
      </van-row>
      <van-row class="flex justify-center mt-7.5 text-[20px] text-center">
        <van-button class="font-roboto h-11 text-lg lg:!h-14 lg:!text-[24px] !font-black !rounded-full !px-10"
          @click="rulesVisible = true">{{ t('Activity Rules') }}</van-button>
        <van-button
          class="font-roboto h-11 text-lg lg:!h-14 lg:!text-[24px] !font-black !rounded-full !px-6 !ml-4 !text-white !bg-black !border-0"
          icon="/campaign/x.svg" @click="share">{{ t('Share on X') }}</van-button>
      </van-row>
      <div
        class="w-[90%] lg:w-[1222px] lg:px-[152px] px-5 backdrop-blur-xs bg-[#11111199] bg-[url('/campaign/card_bg_mobile.png')] lg:bg-[url('/campaign/card_bg.svg')] bg-[length:100%_100%] lg:bg-[length:100%_auto] bg-no-repeat rounded-4xl mx-auto mt-15">
        <van-row class="font-roboto flex justify-center font-bold text-2xl lg:text-[36px] lg:pt-12 pt-9">
          {{ t('Participate Activity') }}
        </van-row>
        <van-row class="mt-4 lg:mt-8">
          <CampaignSteps :value="[t('Login/Register'), t('Share on X'), t('Place Order')]"
            :button="[t('Login'), t('Go Share'), t('Go Place Order')]" :active="active" @click="stepsButtonHandle" />
        </van-row>
        <van-divider dashed />
        <van-row class="flex justify-center text-center font-bold text-[24px] mt-6 mb-9 lg:mt-9 px-10"
          :class="{ '!text-[20px] lg:!text-[24px] !px-0': isEnglish }">
          {{ t('Why Join') }} 「{{ t('Campaign Title') }}」？
        </van-row>
        <van-row class="flex justify-between lg:pb-8 pb-4">
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/reward.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">
              {{ t('Double Reward') }}
            </van-row>
            <van-row class="px-4 text-sm lg:text-base opacity-80 justify-center"
              :class="{ '!text-xs lg:!text-base !px-0': isEnglish }">
              {{ t('Double Reward Desc') }}
            </van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/leaderboard.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">
              {{ t('Leaderboard Challenge') }}
            </van-row>
            <van-row class="px-6 text-sm lg:text-base opacity-80 justify-center"
              :class="{ '!text-xs lg:!text-base !px-0': isEnglish }">
              {{ t('Leaderboard Challenge Desc') }}
            </van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/fair.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">
              {{ t('Fairness') }}
            </van-row>
            <van-row class="px-6 text-sm lg:text-base opacity-80 justify-center"
              :class="{ '!text-xs lg:!text-base !px-0': isEnglish }">
              {{ t('Fairness Desc') }}
            </van-row>
          </van-col>
        </van-row>
        <van-divider dashed />
        <van-row class="flex justify-center text-center font-bold text-[24px] mt-6 mb-9 lg:mt-9"
          :class="{ '!text-[20px] lg:!text-[24px]': isEnglish }">
          {{ t('Valid Order') }}
        </van-row>
        <van-row class="flex justify-between">
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/order.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">
              {{ t('Only Limit Orders') }}
            </van-row>
            <van-row class="text-sm lg:text-base opacity-80 justify-center"
              :class="{ '!text-xs lg:!text-base': isEnglish }">
              {{ t('No Market Orders') }}
            </van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/flow.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">
              {{ t('Provide Liquidity') }}
            </van-row>
            <van-row class="px-2 text-sm lg:text-base opacity-80 justify-center"
              :class="{ '!text-xs lg:!text-base !px-0': isEnglish }">
              {{ t('Bids Valid') }}<span class="hidden lg:inline"> / </span>{{ t('Asks Valid') }}
            </van-row>
          </van-col>
          <van-col class="w-1/3 text-center">
            <van-image class="!w-10" src="/campaign/forbidden.svg" />
            <van-row class="lg:text-xl font-bold pt-4 pb-2 lg:pt-7 lg:pb-3.5 justify-center">
              {{ t('No Early Cancellation') }}
            </van-row>
            <van-row class="text-sm lg:text-base opacity-80 justify-center"
              :class="{ '!text-xs lg:!text-base': isEnglish }">
              {{ t('Canceled Orders Lose Eligibility') }}
            </van-row>
          </van-col>
        </van-row>
        <van-row
          class="font-roboto justify-center text-center font-bold text-lg text-[#03FB75] pt-6 pb-2 lg:pt-8 lg:pb-9 px-4"
          :class="{ '!text-base lg:!text-lg !px-0': isEnglish }">
          {{ t('Place Orders Longer') }}
        </van-row>
        <van-divider dashed />
        <van-row class="justify-center text-center font-bold lg:text-lg lg:pt-4 pb-6 lg:pb-8.5"
          :class="{ 'px-4': isEnglish }">
          {{ t('Total Score') }}
        </van-row>
      </div>
      <div
        class="w-[90%] lg:w-[1192px] lg:px-8 px-4 backdrop-blur-xs bg-[#11111199] bg-[url('/campaign/card_bg_mobile.png')] lg:bg-[url('/campaign/card_bg.svg')] bg-[length:100%_100%] lg:bg-[length:100%_auto] bg-no-repeat rounded-4xl mx-auto lg:mt-88 mt-4 pb-6">
        <van-row class="font-roboto justify-center font-bold text-[32px] pt-9 pb-10 lg:pt-15 lg:pb-13 uppercase">
          {{ t('Leaderboard') }}
        </van-row>
        <van-row
          class="lg:w-[88%] lg:h-48 h-35 bg-bottom lg:bg-auto bg-[url('/campaign/ranking.svg')] bg-[length:100%_auto] bg-no-repeat mx-auto lg:mt-20">
          <van-col class="relative w-1/3" v-for="(item, ind) in tempRankList.slice(0, 3)">
            <van-col class="absolute lg:bottom-8 w-full text-center"
              :class="{ 'bottom-[-6px] lg:!bottom-12': ind === 1 }">
              <van-row class="font-dinpro justify-center text-2xl font-bold lg:pb-4 pb-2"
                :class="{ '!pb-0': ind === 1 }">{{
                  ind === 0 ? 2 : ind === 1 ? ind : ind + 1 }}</van-row>
              <van-row v-if="ind === 1" class="justify-center mb-1">
                <van-image class="w-5 h-4 lg:!w-7 lg:!h-5" src="/campaign/champion.svg" />
              </van-row>
              <van-image class="w-15 h-15 lg:!w-24 lg:!h-24 border-4 border-[#FFFFFF33] rounded-full"
                src="/icons/Avalanche.svg" />
              <van-row class="lg:items-begin items-center justify-center lg:mt-8 mt-1"
                :class="{ 'lg:!mt-10 mt-2': ind === 1 }">
                <van-col>
                  <van-image class="w-6 h-5.5 lg:w-[58px] lg:h-[46px]"
                    :src="`/campaign/0${ind === 0 ? 2 : ind === 1 ? ind : ind + 1}.svg`" />
                </van-col>
                <van-col class="lg:pl-4 pl-1">
                  <van-row class="text-xs lg:text-base opacity-60">{{ item?.nickname }}</van-row>
                  <van-row class="font-dinpro lg:text-xl">{{ item?.total || 0 }}</van-row>
                </van-col>
              </van-row>
            </van-col>
          </van-col>
        </van-row>
        <van-row
          class="h-12 leading-12 font-bold rounded-2xl bg-gradient-to-tr from-[#1652F033] to-[var(--turing-purple-color)] lg:mt-4 mt-8">
          <van-col class="lg:pl-16 px-4 lg:pr-6">{{ t('Rank') }}</van-col>
          <van-col class="w-1/2">{{ t('Trader') }}</van-col>
          <van-col>{{ t('Amount') }}</van-col>
        </van-row>
        <van-list class="max-h-[448px] overflow-auto">
          <van-row class="h-16 leading-16 font-bold rounded-xl" :class="{ 'bg-[#FFFFFF0A]': ind % 2 === 1 }"
            v-for="(item, ind) in rankList.slice(3)" :key="ind">
            <van-col
              class="!w-8 h-8 leading-8 text-center text-sm rounded-full bg-[#FFFFFF33] my-auto lg:ml-16 ml-4 mr-6">{{
                ind + 4 }}</van-col>
            <van-col class="w-1/2 font-normal !flex">
              <van-image class="!w-10 !h-10 rounded-full my-auto lg:mr-4 mr-2"
                :src="item?.user?.avatar || '/favicon.ico'" />
              <van-row>{{ item?.nickname }}</van-row>
            </van-col>
            <van-col>{{ item?.total || 0 }}</van-col>
          </van-row>
        </van-list>
        <van-row class="h-16 leading-16 font-bold rounded-xl bg-[#3A5AFE] items-center">
          <van-col
            class="!w-8 h-8 leading-8 text-center text-sm rounded-full bg-[#FFFFFF33] my-auto lg:ml-16 ml-4 mr-6">
            {{ myRank < 0 ? '99+' : myRank + 1 }} </van-col>
              <van-col class="w-1/2 font-normal !flex">
                <van-image class="!w-10 !h-10 rounded-full my-auto lg:mr-4 mr-2" src="/favicon.ico" />
                <van-row class="h-16 flex-1">{{ token?.accessToken ? userInfo?.nickname : t('Login To View Rank')
                  }}</van-row>
              </van-col>
              <van-col v-if="token?.accessToken">{{ userAmount }}</van-col>
              <van-button v-else class="font-dinpro !h-10 !text-[#3A5AFE] !rounded-xl"
                @click="setModal('loginModal', true)">{{ t('Login') }}</van-button>
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
<i18n lang="json">
{
  "en-US": {
    "Campaign Title": "Predictive Yield Farming",
    "Compete": "Compete",
    "Conquer": "Conquer",
    "Harvest": "Harvest",
    "Campaign Headline": "Your strategic limit orders now generate dual yields: from winning predictions AND from daily $TUIT rewards. Don't just trade, farm.",
    "Campaign Introduction": "At TuringMarket, we're merging the power of prediction with the innovation of DeFi. Welcome to Predictive Yield Farming, a groundbreaking program that rewards you for building liquidity and depth in our markets. Every valid limit order you place doesn't just wait for a outcome—it actively farms our native token, $TUIT.",
    "Activity Rules": "Rules",
    "Share on X": "Share",
    "Participate Activity": "Complete the steps to join",
    "Login/Register": "Login/Register",
    "Place Order": "Place Order",
    "Go Share": "Go Share",
    "Go Place Order": "Place Order",
    "Why Join": "Why Join",
    "Double Reward": "Dual Rewards",
    "Double Reward Desc": "Prediction gains + $TUIT incentives",
    "Leaderboard Challenge": "Leaderboard Challenge",
    "Leaderboard Challenge Desc": "Outplay others, claim the crown",
    "Fairness": "On-Chain Fairness",
    "Fairness Desc": "Transparent, verifiable rules",
    "Valid Order": "What Counts as a Valid Order?",
    "Only Limit Orders": "Limit orders only",
    "No Market Orders": "no market orders",
    "Provide Liquidity": "Provide liquidity",
    "Bids Valid": "bids < last price ",
    "Asks Valid": "asks > last price",
    "No Early Cancellation": "No early cancellation",
    "Canceled Orders Lose Eligibility": "Canceled orders lose eligibility",
    "Place Orders Longer": "Place orders longer, closer, and bigger to earn a larger share of the rewards!",
    "Total Score": "Total Score = Contribution Points (time × precision × size)",
    "Leaderboard": "Leaderboard",
    "Trader": "Trader",
    "Login To View Rank": "Login to view your ranking"
  },
  "zh-TW": {
    "Campaign Title": "掛單榮耀爭霸",
    "Compete": "競爭",
    "Conquer": "征服",
    "Harvest": "收穫",
    "Campaign Headline": "下有效限價單，登上排行榜，贏取每日 $TUIT 獎勵。",
    "Campaign Introduction": "在 TuringMarket，不只是預測，更是建設市場流動性的機會。 為了鼓勵用戶積極掛單、提升盤口深度，我們推出 「掛單榮耀爭霸計劃」 —— 每一筆真實有效的掛單，都能為你帶來 $TUIT 獎勵與榮耀排名。",
    "Activity Rules": "活動規則",
    "Share on X": "分享",
    "Participate Activity": "完成已下步骤参与活动",
    "Login/Register": "登录/注册账号",
    "Place Order": "挂单",
    "Go Share": "去分享",
    "Go Place Order": "去挂单",
    "Why Join": "為什麼要加入",
    "Double Reward": "雙重獎勵",
    "Double Reward Desc": "預測收益 + $TUIT 獎勵",
    "Leaderboard Challenge": "排行榜挑戰",
    "Leaderboard Challenge Desc": "技壓群雄 奪取榮耀",
    "Fairness": "鏈上公平",
    "Fairness Desc": "規則透明 可驗證",
    "Valid Order": "什麼是有效掛單？",
    "Only Limit Orders": "僅限價單",
    "No Market Orders": "市價單不計算",
    "Provide Liquidity": "提供流動性",
    "Bids Valid": "買單需低於現價",
    "Asks Valid": "賣單需高於現價",
    "No Early Cancellation": "不可提前撤單",
    "Canceled Orders Lose Eligibility": "撤單後失去競爭權利",
    "Place Orders Longer": "掛單越久、越近、越大，就能贏得更大獎勵份額！",
    "Total Score": "累計總分數 = 貢獻值 (時間 × 精準度 × 金額)",
    "Leaderboard": "排行榜",
    "Trader": "交易員",
    "Login To View Rank": "登录账号查看您的排名"
  },
  "ja-JP": {},
  "ko-KR": {}
}
</i18n>
