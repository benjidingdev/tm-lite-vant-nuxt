<script setup lang="ts">
  import type { StepperItem } from '@nuxt/ui'

  const { title, cbFunc } = $defineProps<{
    title: string,
    cbFunc: Function
  }>()

  const emit = defineEmits<{ close: [boolean] }>()

  const doClose = async () => {
    emit('close', true)
    await cbFunc()
  }

  // logic
  // const { yourStats } = $(airdropStore())
  const items = [
    {
      slot: 'retweet' as const,
      title: 'Retweet',
      icon: 'garden:arrow-retweet-fill-16'
    }, {
      slot: 'submit' as const,
      title: 'Submit Link',
      icon: 'pajamas:issue-type-requirements'
    },
    {
      slot: 'claim' as const,
      title: 'Claim $TUIT',
      icon: 'fa6-solid:hand-holding-dollar',
    }
  ] satisfies StepperItem[]

  let activeStep = $ref(0)
  // watch($$(yourStats), () => {
  //   if (yourStats.hasRetweet) {
  //     activeStep = 1
  //   }
  //   if (yourStats.finishedTasks.includes('airdrop:retweet')) {
  //     activeStep = 2
  //   }
  // }, { immediate: true })

  const user = useSupabaseUser()
  const twitterSlug = $computed(() => {
    const twitterIdentity = user.value?.identities?.find(
      identity => identity.provider === 'twitter'
    )
    return twitterIdentity?.identity_data?.preferred_username
  })

  const shareLink = $computed(() => `${location.origin}${location.pathname}?ref=${twitterSlug}`)
  // const shareLink = 'https://avax-test-airdrop.turingmarket.cc?ref=AdamMa_TuringM'
  const text = $computed(() => `
I’m joining the TuringM Prediction Master 🏆🏆🏆🏆🏆

Follow @TuringMarket, @TuringM_CN, RT and LIKE via ${shareLink} to get 1000 testnet $TUIT.

1000 USDT up for grabs!
 `);
  const shareTweetStatusLink = "https://x.com/TuringMarket/status/1958786009753428017";
  const tags = "TuringM,TuringMaster,Airdrop";
  const twitterShareBtnLink = $computed(() => {
    return `https://twitter.com/intent/tweet?text=${encodeURI(text)}&url=${shareTweetStatusLink}&hashtags=${tags}`;
  });

  const twitterShareBtnLinkClick = () => {
    activeStep = 1
  }

  let retweetLink = $ref('')
  let submitError = $ref('')
  const updateSubmitLink = () => {
    submitError = ''
  }

  const config = useRuntimeConfig()
  const network = config.public.network

  // const { doClaimToken } = $(airdropStore())
  let isLoading = $ref(false)
  const doSubmitRetweetLink = async () => {
    if (isLoading) return
    isLoading = true
    submitError = ''
    if (!retweetLink || !retweetLink.startsWith(`https://x.com/${twitterSlug}`)) {
      submitError = 'Invalid retweet link'
      isLoading = false
      return
    }
    try {
      await doFetch('/api/airdrop/saveRetweetLink', {
        method: 'POST',
        body: {
          retweetLink,
          network,
          reason: 'airdrop:retweet'
        },
      })

      activeStep = 2
    } catch (e) {
      console.error(e)
      submitError = 'Failed to submit retweet link'
    }
    isLoading = false
  }

  const clickToClaim = async () => {
    if (isLoading) return
    isLoading = true
    try {
      // await doClaimToken('airdrop:retweet')
      await doClose()
    } catch (e) {
      console.error(e)
    }
    isLoading = false
  }
</script>

<template>
  <UModal :close="{ onClick: doClose }" :title="title">
    <template #body>
      <UStepper v-model="activeStep" :items="items" class="w-full pt-10">
        <template #retweet>
          <div class="flex-cc p-10">
            <UButton icon="i-ci-twitter" @click="twitterShareBtnLinkClick" :to="twitterShareBtnLink" target="_blank">
              Click to Retweet</UButton>
          </div>
        </template>
        <template #submit>
          <div class="p-10 space-y-4">
            <div class="space-y-2">
              <UInput @update:modelValue="updateSubmitLink" :color="submitError ? 'error' : 'primary'"
                :highlight="submitError !== ''" v-model="retweetLink" placeholder="Your retweet link" size="lg"
                class="block" />
              <div class="text-error" v-if="submitError">
                {{ submitError }}
              </div>
              <div class="text-secondary">
                eg: {{ `https://x.com/${twitterSlug}/status/xxxx` }}
              </div>
            </div>
            <div>
              <UButton block @click="doSubmitRetweetLink" :loading="isLoading">Submit</UButton>
            </div>
          </div>
        </template>
        <template #claim>
          <div class="flex-cc p-10">
            <UButton @click="clickToClaim" :loading="isLoading">
              Click to Claim</UButton>
          </div>
        </template>
      </UStepper>
    </template>
  </UModal>
</template>
