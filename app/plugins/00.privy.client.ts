import Privy, {avalancheFuji, LocalStorage} from '@privy-io/js-sdk-core';

import type { Plugin as NuxtPlugin } from '#app'

const plugin: NuxtPlugin = defineNuxtPlugin(() => {
  const appId = 'cmenkmv1900dzla0b7lyg397f';
  const clientId = 'client-WY6PqaLdqE9izqnHkFcspb3m8Feh5A3EWqGudW4Cxqw91';
  const privy = new Privy({
    appId,
    clientId,
    supportedChains: [avalancheFuji],
    storage: new LocalStorage()
  });
  // const iframeUrl = privy.embeddedWallet.getURL();
  // const iframe = document.createElement('iframe');
  // iframe.src = iframeUrl;
  // document.body.appendChild(iframe);
  // privy.setMessagePoster(iframe.contentWindow);
  // const listener = (e) => privy.embeddedWallet.onMessage(e.data);
  // window.addEventListener('message', listener);

  return { provide: { privy } }

})

export default plugin
