import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/api/lcverify$': {
        target: 'https://hanamizu.feishu.cn',
        changeOrigin: true,
        rewrite: () => '/base/workflow/webhook/event/DJvLazywFwPCathZb3scjT4mnp3',
      },
    },
  },
})
