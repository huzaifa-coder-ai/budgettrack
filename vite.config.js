import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/budgettrack/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['favicon.svg', 'icons.svg'],

      manifest: {
        name: 'BudgetTrack',
        short_name: 'BudgetTrack',
        description: 'Track your expenses, budget and spending in one place.',

        theme_color: '#0f0d1a',
        background_color: '#0f0d1a',

        display: 'standalone',
        orientation: 'portrait-primary',

        start_url: '/budgettrack/',
        scope: '/budgettrack/',

        icons: [
          {
            src: '/budgettrack/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/budgettrack/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        navigateFallback: '/budgettrack/index.html',

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,

            handler: 'CacheFirst',

            options: {
              cacheName: 'fontawesome-cdn',

              expiration: {
                maxEntries: 2,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
