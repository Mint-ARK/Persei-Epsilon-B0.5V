import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 相对路径，便于构建产物直接从本地文件系统打开
  base: './',
  plugins: [tailwindcss(), react()],
  server: {
    port: 5273,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 单入口内联，配合 scripts/inline.mjs 产出可直接双击打开的单文件预览
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app[extname]',
      },
    },
  },
})
