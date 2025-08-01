import type { TypedData, TypedDataDomain } from 'viem'

export interface SignTradeDataOptions {
  domain?: any;
  types?: any;
  order: any;
}

/**
 * domain format
 */
export const TYPEHASH_DOMAIN = {
  name: 'Turing Market',
  version: '1.0.0',
  chainId: 31337, 
  verifyingContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
} as const satisfies TypedDataDomain

export const TYPEHASH_ORDER = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  Order: [
    { name: 'salt', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'tokenAmount', type: 'uint256' },
    { name: 'tokenPriceInPaymentToken', type: 'uint256' },
    { name: 'paymentTokenAddress', type: 'address' },
    { name: 'slippageBps', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'side', type: 'uint8' },
    { name: 'feeTokenAddress', type: 'address' }
  ]
} as const

export const TYPEHASH_MERGE_SPLIT_ORDER = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  OrderSelf: [
    { name: 'salt', type: 'uint256' },
    { name: 'maker', type: 'address' },
    { name: 'marketId', type: 'uint256' },
    { name: 'tradeType', type: 'uint256' },
    { name: 'paymentTokenAmount', type: 'uint256' },
    { name: 'paymentTokenAddress', type: 'address' },
    { name: 'deadline', type: 'uint256' },
    { name: 'feeTokenAddress', type: 'address' }
  ]
} as const

export const TYPEHASH_WITHDRAW = {
  Withdraw: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'fee', type: 'uint256' },
    { name: 'tokenAddress', type: 'address' },
    { name: 'nonce', type: 'uint256' }
  ]
} as const satisfies TypedData

export const TYPEHASH_PERMIT = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const satisfies TypedData

export const TYPEHASH_REWARD = {
  Reward: [
    { name: "marketId", type: "uint256" },
    { name: "nftId", type: "uint256" },
    { name: "user", type: "address" },
    { name: "paymentTokenAddress", type: "address" },
    // { name: "feeTokenAddress", type: "address" },
    { name: "nonce", type: "uint256" },
  ],
} as const satisfies TypedData

export const TYPEHASH_BROKER = {
  Payout: [
    { name: "to", type: "address" },
    { name: "feeTokenAddress", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "payoutType", type: "uint8" },
    { name: "nonce", type: "uint256" },
  ],
} as const satisfies TypedData