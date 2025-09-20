<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalDays: number
  checkedDays: number[]           // 已完成天数（含补签）
  todayIndex: number              // 今天/下一可打卡日（1-based）
  missedDays?: number[]           // 新增：可选，显式漏签天
}>()

const emit = defineEmits<{
  (e: 'select-missed', day: number): void
}>()

const checkedSet = computed(() => new Set(props.checkedDays))

const explicitMissedSet = computed(() => new Set(props.missedDays ?? []))

const missedSet = computed(() => {
  if (props.missedDays && props.missedDays.length > 0) return explicitMissedSet.value
  const s = new Set<number>()
  for (let d = 1; d < props.todayIndex; d++) {
    if (!checkedSet.value.has(d)) s.add(d)
  }
  return s
})

const items = computed(() =>
  Array.from({ length: props.totalDays }, (_, i) => {
    const day = i + 1
    const isDone = checkedSet.value.has(day)
    const isMissed = missedSet.value.has(day)
    const isToday = props.todayIndex > 0 && day === props.todayIndex
    let status: 'done' | 'missed' | 'today' | 'locked'
    if (isDone) status = 'done'
    else if (isMissed) status = 'missed'
    else if (isToday) status = 'today'
    else status = 'locked'
    return { day, status }
  })
)

const onClickDay = (day: number, status: string) => {
  if (status === 'missed') emit('select-missed', day)
}
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="i in items"
        :key="i.day"
        class="relative h-10 flex items-center justify-center rounded-md text-xs select-none transition"
        :class="{
          'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm': i.status === 'done',
          'ring-2 ring-indigo-500 bg-white text-indigo-600': i.status === 'today',
          'border border-dashed border-amber-500 text-amber-600 cursor-pointer hover:bg-amber-50': i.status === 'missed',
          'bg-gray-50 text-gray-400': i.status === 'locked',
        }"
        @click="onClickDay(i.day, i.status)"
      >
        <span>{{ i.day }}</span>

        <span
          v-if="i.status === 'missed'"
          class="absolute -top-1 -right-1 text-[10px] px-1 py-[1px] rounded bg-amber-500 text-white"
        >补</span>
      </div>
    </div>
  </div>
</template>
