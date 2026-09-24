/**
 * 构建后处理：把 dist/app.js 与 dist/app.css 内联进 HTML，
 * 产出一个可以直接双击用浏览器打开的单文件预览（无需起服务）。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const htmlPath = join(dist, 'index.html')

if (!existsSync(htmlPath)) {
  console.error('[inline] 未找到 dist/index.html，请先执行 vite build')
  process.exit(1)
}

const readAsset = (name) => readFileSync(join(dist, name.replace(/^\.?\//, '')), 'utf8')

let html = readFileSync(htmlPath, 'utf8')

html = html.replace(/<script[^>]*\ssrc="([^"]+\.js)"[^>]*><\/script>/g, (_match, src) => {
  const code = readAsset(src).replace(/<\/script/gi, '<\\/script')
  return `<script type="module">\n${code}\n</script>`
})

html = html.replace(/<link[^>]*rel="stylesheet"[^>]*\shref="([^"]+\.css)"[^>]*>/g, (_match, href) => {
  return `<style>\n${readAsset(href)}\n</style>`
})

const outPath = join(dist, 'control-panel.html')
writeFileSync(outPath, html, 'utf8')

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0)
console.log(`[inline] 单文件预览已生成：dist/control-panel.html (${kb} KB)`)
