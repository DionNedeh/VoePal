import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/VoePal/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg'],
      manifest: {
        name: 'VoePal',
        short_name: 'VoePal',
        description: 'An offline-first robot companion for voice and text emotional check-ins.',
        theme_color: '#18243c',
        background_color: '#f6f8ef',
        display: 'standalone',
        start_url: '/VoePal/',
        scope: '/VoePal/',
        icons: [
          {
            src: 'icons/voepal.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icons/apple-touch-icon.svg',
            sizes: '180x180',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest}'],
        navigateFallback: '/VoePal/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  test: {
    environment: 'node',
    globals: true
  }
});
