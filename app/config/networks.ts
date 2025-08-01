import { defineChain, avalanche, polygon } from '@reown/appkit/networks'

export const localHardhat = defineChain({
    id: 31337,
    caipNetworkId: 'eip155:31337',
    chainNamespace: 'eip155',
    name: 'local Hardhat',
    nativeCurrency: {
        decimals: 18,
        name: 'LH',
        symbol: 'LH',
    },
    rpcUrls: {
        default: {
            http: [
                'http://127.0.0.1:8545/'
            ],
        }
    }
})

export const jdDevnet = defineChain({
    id: 31337,
    caipNetworkId: 'eip155:31337',
    chainNamespace: 'eip155',
    name: 'JD Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'JD',
        symbol: 'JD',
    },
    rpcUrls: {
        default: { http: ['http://150.242.83.196:8545'] },
    }
})


export const juChainTestnet = defineChain({
    id: 202599,
    caipNetworkId: 'eip155:31337',
    chainNamespace: 'eip155',
    name: 'JuChain Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'JU',
        symbol: 'JU',
    },
    rpcUrls: {
        default: {
            http: [
                'https://testnet-rpc.juchain.org'
            ],
            webSocket: [
                'wss://testnet-ws.juchain.org'
            ]
        }
    },
    blockExplorers: {
        default: {
            name: 'JuScan',
            url: 'https://testnet.juscan.io'
        }
    },
    faucets: [
        'https://faucet-testnet.juchain.org/'
    ],
    minGasToken: "0.01",
    faucetRewardGasToken: "0.2",
})

export const avaxTest = defineChain({
    id: 43113,
    // caipNetworkId: 'eip155:31337',
    // chainNamespace: 'eip155',
    name: 'Avalanche Fuji C-Chain',
    nativeCurrency: {
        decimals: 18,
        name: 'AVAX',
        symbol: 'AVAX',
    },
    rpcUrls: {
        default: {
            http: [
                'https://api.avax-test.network/ext/bc/C/rpc'
            ],
            webSocket: [
                'wss://api.avax-test.network/ext/bc/C/ws'
            ]
        }
    },
    blockExplorers: {
        default: {
            name: 'SnowTrace',
            url: 'https://subnets-test.avax.network/c-chain'
        }
    },
     faucets: [
        'https://core.app/tools/testnet-faucet/'
    ],
    minGasToken: "0.01",
    faucetRewardGasToken: "1",
})

export const networks = [
    // jdDevnet,
    polygon,
    localHardhat,
    avalanche,
]