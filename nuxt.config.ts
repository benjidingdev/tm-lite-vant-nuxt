// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const modules = [
  "@vant/nuxt",
  "@vue-macros/nuxt",
  "@pinia/nuxt",
  "@nuxtjs/i18n",
  "pinia-plugin-persistedstate/nuxt",
  "@vueuse/motion/nuxt",
  "@vueuse/nuxt",
];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules,
  css: ["~/assets/css/main.css"],
  vite: {
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
      "import.meta.env.NUXT_PUBLIC_API_PREFIX": JSON.stringify(
        import.meta.env.NUXT_PUBLIC_API_PREFIX
      ),
      "import.meta.env.NUXT_PUBLIC_P_KEY": JSON.stringify(
        import.meta.env.NUXT_PUBLIC_P_KEY
      ),
      "import.meta.env.NUXT_PUBLIC_PRIVY_CLIENT_ID": JSON.stringify(
        import.meta.env.NUXT_PUBLIC_PRIVY_CLIENT_ID
      ),
      "import.meta.env.NUXT_PUBLIC_BRANCH": JSON.stringify(process.env.VERCEL_GIT_COMMIT_REF || "localDev"),
      "import.meta.env.NUXT_PUBLIC_HASH": JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || "localDev"),
      "import.meta.env.NUXT_PUBLIC_LOG_ROCKET_ID": JSON.stringify(process.env.NUXT_PUBLIC_LOG_ROCKET_ID || ""),
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", language: "English", file: "en-US.json" },
      { code: "zh", language: "简体中文", file: "zh-CN.json" },
      { code: "zh-tw", language: "繁體中文", file: "zh-TW.json" },
      // { code: 'ja', language: '日本語', file: 'ja-JP.json' }
    ],
  },
  vueuse: {
    motion: true,
  },
  build: {
    transpile: ["form-data"],
  },
  runtimeConfig: {
    public: {
      reownProjectId: process.env.NUXT_PUBLIC_REOWN_PROJECT_ID,
      testnet: true,
      siteUrl: "",
      siteName: "",
      siteSlogan: "",
      siteDescription: "",
      branch: process.env.VERCEL_GIT_COMMIT_REF || "localDev",
      hash: process.env.VERCEL_GIT_COMMIT_SHA || "localDev",
      privyClientId: process.env.NUXT_PUBLIC_PRIVY_CLIENT_ID,

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
    },
  }
});
