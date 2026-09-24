/**
 * 用无头浏览器给构建产物截图，便于快速核对视觉效果。
 * 用法：npm run build && npm run shot
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const page = join(root, 'dist', 'control-panel.html')
const outDir = join(root, 'dist', 'shots')

if (!existsSync(page)) {
  console.error('[shot] 未找到 dist/control-panel.html，请先执行 npm run build')
  process.exit(1)
}

const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((candidate) => existsSync(candidate))

if (!browser) {
  console.error('[shot] 未找到 Edge 或 Chrome')
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })

const base = pathToFileURL(page).href

const panels = [
  'overview',
  'realtime',
  'accounts',
  'inventory',
  'warehouse',
  'mail',
  'gacha',
  'activities',
  'server',
  'settings',
]

const targets = [
  ...panels.map((id) => ({ name: `${id}.png`, url: `${base}#${id}`, size: '1600,1500' })),
  {
    name: 'warehouse-table-20k.png',
    url: `${base}?wh=table&whSize=20000#warehouse`,
    size: '1600,1500',
  },
  {
    name: 'warehouse-list-20k.png',
    url: `${base}?wh=list&whSize=20000#warehouse`,
    size: '1600,1500',
  },
  {
    name: 'warehouse-plain-20k.png',
    url: `${base}?wh=grid&whSize=20000&whVirtual=0#warehouse`,
    size: '1600,1500',
  },
  { name: 'dark-overview.png', url: `${base}?theme=dark#overview`, size: '1600,1500' },
  { name: 'dark-warehouse.png', url: `${base}?theme=dark#warehouse`, size: '1600,1500' },
  { name: 'dark-gacha.png', url: `${base}?theme=dark#gacha`, size: '1600,1500' },
  { name: 'narrow-720.png', url: `${base}#accounts`, size: '720,1300' },
]

for (const target of targets) {
  const out = join(outDir, target.name).replace(/\\/g, '/')
  const result = spawnSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--virtual-time-budget=5000',
      `--window-size=${target.size}`,
      `--screenshot=${out}`,
      target.url,
    ],
    { stdio: 'ignore' },
  )
  console.log(`[shot] ${target.name} ${result.status === 0 ? 'ok' : `exit=${result.status}`}`)
}

console.log(`[shot] 输出目录：${outDir}`)
