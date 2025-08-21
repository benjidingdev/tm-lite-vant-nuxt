// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const modules = [
  "@vant/nuxt",
  "@vue-macros/nuxt",
  "@pinia/nuxt",
  "@wagmi/vue/nuxt",
  "@nuxtjs/i18n",
  "pinia-plugin-persistedstate/nuxt",
  "@vueuse/motion/nuxt",
];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules,
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    define: {
      "window.FormData": "undefined",
      "import.meta.env.NUXT_PUBLIC_API_PREFIX": JSON.stringify(
        import.meta.env.NUXT_PUBLIC_API_PREFIX
      ),
      "import.meta.env.NUXT_PUBLIC_P_KEY": JSON.stringify(
        import.meta.env.NUXT_PUBLIC_P_KEY
      ),
      envName: process.env.ENV_NAME,
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
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["appkit-button"].includes(tag),
    },
  },
  runtimeConfig: {
    public: {
      reownProjectId: process.env.NUXT_PUBLIC_REOWN_PROJECT_ID,
      siteUrl: "",
      siteName: "",
      siteSlogan: "",
      siteDescription: "",
      branch: process.env.VERCEL_GIT_COMMIT_REF || "localDev",
      hash: process.env.VERCEL_GIT_COMMIT_SHA || "localDev",

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
