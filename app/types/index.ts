export interface ApiResponse<T = any> {
  readonly code: number;
  readonly msg: string;
  readonly data: T;
}

export interface PageResult<T> {
  readonly total: number;
  readonly list: T[];
}

export interface Token {
  userId: number;
  accessToken: string;
  refreshToken?: string;
  expiresTime?: number;
}

export interface UserInfo {
  id: string;
  username: string;
  proxyWallet: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  inviteCode?: string;
  traderType: number;
  roles: string[];
}

export interface Web3Config {
  chain: {
    id: number
    rpcUrls: [string]
    scanUrl: string
    attempts: number
    interval: number
  }
  contract: {
    name: string
    version: number
    address: `0x${string}`
    decimal: number
  }
  main: {
    name: string
    version: number
    address: `0x${string}`
    decimal: number
  }
  meme: {
    name: string
    version: number
    address: `0x${string}`
    decimal: number
  }
}

export interface WebSocketMessage {
  type: string
  content: any
  time: Date
}

export interface SiweMessage {
  address: `0x${string}`
  chainId: number
  domain: string
  nonce: string
  uri: string
  version: '1'
  issuedAt: Date
  expirationTime: Date
  statement: string
}
