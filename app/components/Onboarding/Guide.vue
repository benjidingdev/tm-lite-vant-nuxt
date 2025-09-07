<script lang="ts" setup>
const { t } = useI18n();
const { onboarding } = $(uiStore());

const steps = [
  {
    attachTo: { element: "#step1" },
    content: {
      title: t("Your Balance"),
      description: t("This is your USDT Balance!"),
    },
  },
  {
    attachTo: { element: "#step2" },
    content: {
      title: t("Your Order list"),
      description: t("You could trade for your failed orders again here!"),
    },
  },
  {
    attachTo: { element: "#step3" },
    content: {
      title: t("Set Share volumes"),
      description: t("Set Share volumes!"),
    },
  },
  {
    attachTo: { element: "#step4" },
    content: {
      title: t("Card"),
      description: t("Swipe the card to trade now!"),
    },
  },
];

</script>

<template>
  <div>
    <VOnboardingWrapper ref="onboarding" :steps="steps" />
  </div>
</template>
