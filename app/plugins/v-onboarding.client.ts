import { VOnboardingWrapper } from 'v-onboarding'
import 'v-onboarding/dist/style.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('VOnboardingWrapper', VOnboardingWrapper)
})
