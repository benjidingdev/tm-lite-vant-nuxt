// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const modules = [
  "@vant/nuxt",
  "@vue-macros/nuxt",
  "@pinia/nuxt",
  '@nuxtjs/supabase',
  "@nuxtjs/i18n",
  "pinia-plugin-persistedstate/nuxt",
  "@vueuse/motion/nuxt",
  "@vueuse/nuxt",
  "nuxt-meta-pixel"
];

const buildTime = Date.now() - 3600*1000*12
const branch = process.env.VERCEL_GIT_COMMIT_REF || "localBranch"
const hash = process.env.VERCEL_GIT_COMMIT_SHA || "localHash"
console.log("branch", branch)
console.log("hash", hash)
console.log("buildTime", buildTime)
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules,
  css: ["~/assets/css/main.css"],
  vite: {
    server: {
      allowedHosts: ["localhost", "9f88f6df8068.ngrok-free.app", "frp.jdoffices.com"],
    },
    plugins: [
      tailwindcss(),
      nodePolyfills({
        include: ['path'],
        // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
        exclude: [
          'http', // Excludes the polyfill for `http` and `node:http`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Override the default polyfills for specific modules.
        overrides: {
          // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
          fs: 'memfs',
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    define: {
      "window.FormData": "undefined",
      "import.meta.env.NUXT_PUBLIC_API_PREFIX": JSON.stringify(process.env.NUXT_PUBLIC_API_PREFIX),
      "import.meta.env.NUXT_PUBLIC_PRIVY_CLIENT_ID": JSON.stringify(process.env.NUXT_PUBLIC_PRIVY_CLIENT_ID),
      "import.meta.env.NUXT_PUBLIC_BRANCH": JSON.stringify(branch),
      "import.meta.env.NUXT_PUBLIC_HASH": JSON.stringify(hash),
      "import.meta.env.NUXT_PUBLIC_LOG_ROCKET_ID": JSON.stringify(process.env.NUXT_PUBLIC_LOG_ROCKET_ID || ""),
      "import.meta.env.NUXT_PUBLIC_TG_BOT_INFO": JSON.stringify(process.env.NUXT_PUBLIC_TG_BOT_INFO || ""),
      "import.meta.env.NUXT_LIGHTHOUSE_STORAGE_API_KEY": JSON.stringify(process.env.NUXT_LIGHTHOUSE_STORAGE_API_KEY || ""),
      "import.meta.env.NUXT_PUBLIC_IPFS_GATEWAY_URL": JSON.stringify(process.env.NUXT_PUBLIC_IPFS_GATEWAY_URL || ""),
    },
  },
  i18n: {
    defaultLocale: "en-US",
    locales: [
      { code: "en-US", language: "English", file: "en-US.json" },
      { code: "zh-TW", language: "繁體中文", file: "zh-TW.json" },
      { code: 'ja-JP', language: '日本語', file: 'ja-JP.json' },
      { code: 'ko-KR', language: '한국어', file: 'ko-KR.json' },
    ],
  },
  // @vueuse/motion is configured through the module in the modules array
  build: {
    transpile: ["form-data"],
  },
  piniaPluginPersistedstate: {
    key: 'v1_0_0_%id',
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      },
    },
  },
  runtimeConfig: {
    lighthouseStorageApiKey: process.env.NUXT_LIGHTHOUSE_STORAGE_API_KEY,
    public: {
      buildTime,
      branch,
      hash,
      ipfsGatewayUrl: process.env.NUXT_PUBLIC_IPFS_GATEWAY_URL,
      tgBotInfo: process.env.NUXT_PUBLIC_TG_BOT_INFO,
      reownProjectId: process.env.NUXT_PUBLIC_REOWN_PROJECT_ID,
      isTestnet: process.env.NUXT_PUBLIC_IS_TESTNET === 'true',
      siteUrl: "",
      siteName: "",
      siteSlogan: "",
      siteDescription: "",
      privy: {
        appId: process.env.NUXT_PUBLIC_PRIVY_APP_ID || "",
        clientId: process.env.NUXT_PUBLIC_PRIVY_CLIENT_ID || "",
      },

      // all options can be found here: https://www.npmjs.com/package/logrocket?activeTab=code
      // dist/types.d.ts --> interface IOptions
      logRocket: {
        id: process.env.NUXT_PUBLIC_LOG_ROCKET_ID || "",
        dev: false, // or true if you want
        enablePinia: true,
        config: {},
      },
      apiPrefix:
        process.env.NUXT_PUBLIC_API_PREFIX || "http://192.168.1.82:48082",
      metapixel: {
        default: { id: '909961260585999' },
      }
    },
  }
});
