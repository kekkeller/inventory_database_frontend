import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  define: {
    '__VUE_OPTIONS_API__': true,  // Aktiviere die Options-API, falls benötigt
    '__VUE_PROD_DEVTOOLS__': false,  // Deaktiviere Vue Devtools in der Produktion
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': true  // Definiere das Feature-Flag
  }
})
