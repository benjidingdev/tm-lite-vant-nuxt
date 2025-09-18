<template>
  <section class="w-full h-[calc(100dvh-var(--nav-height))] space-y-px overflow-y-scroll">
    <div class="px-4 flex flex-col space-y-4 pb-4">
      <Notice />
      <KpiCards />
      <TaskCard />
      <ShareInvite />
      <LeaderboardTabs />
      <RulesCard />
    </div>
  </section>
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import KpiCards from './KpiCards.vue'
import ShareInvite from './ShareInvite.vue'
import LeaderboardTabs from './LeaderboardTabs.vue'
import RulesCard from './RulesCard.vue'
import Notice from './Notice.vue'

</script>

