// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app', '.azurestaticapps.net/'], // Allows any ngrok subdomain
    }
  },  
  app: {
    head: {
      script: [{ src: "https://telegram.org/js/telegram-web-app.js", async: true }]
    }
  },
  ssr: false
})
