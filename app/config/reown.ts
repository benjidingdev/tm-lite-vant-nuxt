import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { getNetworks } from './networks'
import { createAppKit } from '@reown/appkit/vue'
import { type AppKitNetwork } from '@reown/appkit/networks'
// import { http, webSocket } from '@wagmi/core'

// Singleton variables
let wagmiAdapter: WagmiAdapter | null = null

export function getWagmiAdapter() {
  if (!wagmiAdapter) {
    const config = useRuntimeConfig()
    const projectId = config.public.reownProjectId as string
    const isTestnet = config.public.isTestnet as boolean
    const networks = getNetworks(isTestnet)
    wagmiAdapter = new WagmiAdapter({
      networks,
      projectId,
    })
  }
  return wagmiAdapter
}

export function createModal() {
  const config = useRuntimeConfig()
  const wagmiAdapter = getWagmiAdapter()
  const projectId = config.public.reownProjectId as string
  const metadata = {
    name: config.public.siteName as string,
    description: config.public.siteDescription as string,
    url: config.public.siteUrl as string,
    icons: [`${config.public.siteUrl}/favicon.ico`]
  }
  return createAppKit({
    adapters: [wagmiAdapter],
    networks: wagmiAdapter?.wagmiChains?.filter((chain, index) => index !== 0) as [AppKitNetwork, ...AppKitNetwork[]],
    projectId,
    metadata,
    //defaultNetwork: wagmiAdapter.networks[0],
    themeMode: 'dark',
    featuredWalletIds: [],
    enableWalletConnect: true,
    allWallets: 'SHOW',
    enableCoinbase: false,
    coinbasePreference: 'smartWalletOnly',
    // termsConditionsUrl: "https://TuringM.io/terms",
    // privacyPolicyUrl: "https://TuringM.io/privacy",
    features: {
      email: false,
      socials: [],
      analytics: true,
      swaps: true,
      onramp: true,
      legalCheckbox: true
    }
  })
}
