import { initConfig } from "@/services/configService";
// plugins/config.plugin.ts
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  initConfig(config.public)
})