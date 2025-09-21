<template>
  <section class="w-full h-dvh space-y-px overflow-y-scroll">
    <div class="px-4 flex flex-col space-y-4 py-4">
      <Notice />
      <KpiCards />
      <TaskCard />
      <ShareInvite />
      <Leaderboard />
      <RulesCard />
    </div>
  </section>
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import KpiCards from './KpiCards.vue'
import ShareInvite from './ShareInvite.vue'
import Leaderboard from './Leaderboard.vue'
import RulesCard from './RulesCard.vue'
import Notice from './Notice.vue'

definePageMeta({
  layout: "pdc-default",
});
</script>
