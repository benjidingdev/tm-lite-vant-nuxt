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
      "window.FormData": "undefined", // 防止 SSR 问题
    },
  },
  nitro: {
    routeRules: {
      "/app-api/**": {
        proxy: "http://192.168.1.82:48082",
      },
    },
  },
  build: {
    transpile: ["form-data"],
  },
});

