import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      // tsconfig paths와 동일하게 @ -> ./src (vite-tsconfig-paths 의존성 없이 수동 매핑)
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // public-env.ts가 import 시점에 절대 URL을 요구하므로 placeholder 주입
    env: {
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_API_URL: 'http://localhost:8080',
    },
  },
})
