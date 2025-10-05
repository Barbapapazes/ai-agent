import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/mdc'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    openAiApiKey: '',
    mcpEndpoint: '',
  },
  compatibilityDate: '2025-10-05',
  nitro: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    }
  }
})
