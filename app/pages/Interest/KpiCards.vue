<script setup lang="ts">
import 'odometer/themes/odometer-theme-default.css'
let participants = $ref(8412)
let pool = $ref(1286500)

let loading = $ref(true)

const participantsEl = $ref<HTMLElement | null>(null)
const poolEl = $ref<HTMLElement | null>(null)

let participantsOdo: any
let poolOdo: any
let OdometerCtor: any

const ensureOdometer = async () => {
  if (!OdometerCtor) {
    const mod = await import('odometer')
    OdometerCtor = (mod as any).default || (mod as any)
  }
}

const initOdometers = async () => {
  await ensureOdometer()
  if (participantsEl && !participantsOdo) {
    participantsOdo = new OdometerCtor({
      el: participantsEl,
      value: 0,           // 先从 0 开始，下面立刻更新到真实值，确保出现翻页动画
      format: '(,ddd)',
      duration: 800,
    })
    setTimeout(() => participantsOdo?.update(participants), 60)
  }
  if (poolEl && !poolOdo) {
    poolOdo = new OdometerCtor({
      el: poolEl,
      value: 0,
      format: '(,ddd)',
      duration: 800,
    })
    setTimeout(() => poolOdo?.update(pool), 60)
  }
}

onMounted(async () => {
  if (!loading) {
    await nextTick()
    initOdometers()
  }
})

watch(() => loading, async (v) => {
  if (!v) {
    await nextTick()
    initOdometers()
  }
})

// 数值变化时更新动画
watch(() => participants, (val) => {
  if (participantsOdo) participantsOdo.update(val)
})
watch(() => pool, (val) => {
  if (poolOdo) poolOdo.update(val)
})

// 假数据跳动（单人最多 1K 上限）
let tickTimer: any = null

const simulateTick = ()=> {
  // 随机增加参与人数（35% 概率，+1~3）
  const addParticipants = Math.random() < 0.35 ? (Math.floor(Math.random() * 3) + 1) : 0
  if (addParticipants > 0) {
    participants += addParticipants
  }

  // 当前池子的最大允许值（每人最多 1K）
  const maxPool = participants * 1000

  // 已达上限则不再增长
  if (pool >= maxPool) {
    pool = maxPool
    return
  }

  // 基础增长 + 新增参与者奖金
  const baseInc = 40 + Math.floor(Math.random() * 200) // 40~239
  const perPersonBonus = addParticipants * (200 + Math.floor(Math.random() * 500)) // 每个新参与者 200~699

  let nextPool = pool + baseInc + perPersonBonus
  if (nextPool > maxPool) nextPool = maxPool
  pool = nextPool
}

const scheduleNextTick = () =>  {
  const delay = 1200 + Math.floor(Math.random() * 2800) // 1.2s ~ 4s
  tickTimer = setTimeout(() => {
    simulateTick()
    scheduleNextTick()
  }, delay)
}

onMounted(() => {
  scheduleNextTick()
})

onUnmounted(() => {
  if (tickTimer) {
    clearTimeout(tickTimer)
    tickTimer = null
  }
})

setTimeout(() => {
  loading = false
}, 1000)
</script>

<template>
  <van-skeleton :loading="loading" animated  class="!px-0">
    <template #template>
      <div class="grid grid-cols-2 gap-3 w-full">
        <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
          <div class="h-3 w-16 bg-[#f2f3f5] rounded" />
          <div class="h-6 w-24 bg-[#f2f3f5] rounded mt-3" />
        </div>
        <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
          <div class="h-3 w-16 bg-[#f2f3f5] rounded" />
          <div class="h-6 w-24 bg-[#f2f3f5] rounded mt-3" />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
        <div class="text-xs text-gray-500">参与人数</div>
        <!-- 初始文本保持纯数字；格式化交给 Odometer 的 format 实现 -->
        <div ref="participantsEl" class="text-2xl font-semibold mt-1 odometer">{{ participants }}</div>
      </div>
      <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
        <div class="text-xs text-gray-500">当前积分池</div>
        <div ref="poolEl" class="text-2xl font-semibold mt-1 odometer">{{ pool }}</div>
      </div>
    </div>
  </van-skeleton>
</template>
