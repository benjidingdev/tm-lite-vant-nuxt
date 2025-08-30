import Privy, * as PrivySDK from '@privy-io/js-sdk-core'
// import { networks } from '~/config/networks'
import type { Plugin as NuxtPlugin } from '#app'
import { getNetworks } from '@/config/networks'

const plugin: NuxtPlugin = defineNuxtPlugin(() => {
  const { appId, clientId } = useRuntimeConfig()?.public?.privy || {}
  const privy = new Privy({
    appId,
    clientId,
    supportedChains: getNetworks(useRuntimeConfig().public.isTestnet as boolean),
    storage: new PrivySDK.LocalStorage()
  });
  return { provide: { privy, PrivySDK } }

})

export default plugin
