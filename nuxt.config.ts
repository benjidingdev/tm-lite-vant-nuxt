// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const modules = ["@vant/nuxt", "@vue-macros/nuxt", "@pinia/nuxt"];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules,
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});