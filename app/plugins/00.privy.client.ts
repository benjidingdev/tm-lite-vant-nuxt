import Privy, * as PrivySDK from '@privy-io/js-sdk-core'
import { networks } from '~/config/networks'
import type { Plugin as NuxtPlugin } from '#app'

const plugin: NuxtPlugin = defineNuxtPlugin(() => {
  const appId = 'cmenkmv1900dzla0b7lyg397f';
  const clientId = 'client-WY6PqaLdqE9izqnHkFcspb3m8Feh5A3EWqGudW4Cxqw91';
  const privy = new Privy({
    appId,
    clientId,
    supportedChains: networks,
    storage: new PrivySDK.LocalStorage()
  });
  return { provide: { privy, PrivySDK } }

})

export default plugin
