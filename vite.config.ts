import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }
            }
          }
        ]
      },
      manifest: {
        name: 'Bluey 现实世界游戏',
        short_name: 'Bluey游戏',
        description: 'Bluey 主题亲子游戏助手 - 和宝宝一起玩真的！',
        theme_color: '#87CEEB',
        background_color: '#87CEEB',
        display: 'standalone',
        orientation: 'any',
        lang: 'zh-CN',
        start_url: '/',
        categories: ['kids', 'games', 'family'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
