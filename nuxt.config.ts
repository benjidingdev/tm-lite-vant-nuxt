// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const modules = [
  "@vant/nuxt",
  "@vue-macros/nuxt",
  "@pinia/nuxt",
  "@wagmi/vue/nuxt",
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
    },
  },
  build: {
    transpile: ["form-data"],
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
      host: process.env.NUXT_PUBLIC_API_DOMAIN || "http://192.168.1.82:48082",
    },
  },
});
