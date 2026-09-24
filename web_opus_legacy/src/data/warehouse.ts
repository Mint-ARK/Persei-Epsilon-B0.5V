/**
 * 仓库压力数据生成器
 *
 * 用确定性伪随机（mulberry32 + 固定种子）生成，保证：
 *  - 同一规模每次生成结果完全一致，便于反复对比性能与截图
 *  - 不依赖 Math.random，避免 React StrictMode 双调用导致数据抖动
 */
import type { Tone } from '../components/kit'

export const QUALITIES = ['普通', '精良', '稀有', '史诗', '传说'] as const
export type QualityTier = (typeof QUALITIES)[number]

export const qualityTone: Record<QualityTier, Tone> = {
  普通: 'default',
  精良: 'success',
  稀有: 'accent',
  史诗: 'warning',
  传说: 'danger',
}

export const CATEGORIES = [
  '通用货币',
  '探测凭证',
  '养成材料',
  '装备模组',
  '体力道具',
  '誓约材料',
  '活动道具',
  '消耗品',
] as const

const PREFIX = [
  '移转', '极星', '纯净', '战术', '深潜', '曜石', '归零', '苍环',
  '赤道', '隐科', '界外', '熔铸', '霜蚀', '雷华', '虚数', '拟态',
]

const CORE = [
  '之辉', '之花', '赋能因子', '冷却剂', '模组', '凭证', '结晶', '齿轮',
  '轴承', '涂层', '芯片', '密钥', '棱镜', '回路', '燃料', '图谱',
]

const SUFFIX = ['', '', '', '', '·甲型', '·乙型', '·丙型', '（大）', '（中）', '（小）', 'Ⅱ', 'Ⅲ']

/** 品质权重：越稀有越少，贴近真实仓库的长尾分布 */
const QUALITY_WEIGHTS = [46, 27, 16, 8, 3]
const QUALITY_TOTAL = QUALITY_WEIGHTS.reduce((sum, weight) => sum + weight, 0)

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type WarehouseItem = {
  id: number
  name: string
  category: (typeof CATEGORIES)[number]
  quality: QualityTier
  count: number
  obtained: string
}

export function generateItems(total: number, seed = 20260911): WarehouseItem[] {
  const random = mulberry32(seed)
  const items: WarehouseItem[] = new Array(total)

  for (let i = 0; i < total; i += 1) {
    const name =
      PREFIX[Math.floor(random() * PREFIX.length)] +
      CORE[Math.floor(random() * CORE.length)] +
      SUFFIX[Math.floor(random() * SUFFIX.length)]

    // 按权重抽品质
    let roll = random() * QUALITY_TOTAL
    let qualityIndex = 0
    while (qualityIndex < QUALITY_WEIGHTS.length - 1 && roll > QUALITY_WEIGHTS[qualityIndex]) {
      roll -= QUALITY_WEIGHTS[qualityIndex]
      qualityIndex += 1
    }

    // 数量分布刻意跨 1~5 位，用来检验 tabular-nums 下的右对齐
    const magnitude = Math.floor(random() * 5)
    const count = Math.max(1, Math.floor(random() * 10 ** (magnitude + 1)))

    items[i] = {
      id: 10001 + i,
      name,
      category: CATEGORIES[Math.floor(random() * CATEGORIES.length)],
      quality: QUALITIES[qualityIndex],
      count,
      obtained: `${String(6 + Math.floor(random() * 4)).padStart(2, '0')}-${String(
        1 + Math.floor(random() * 28),
      ).padStart(2, '0')}`,
    }
  }

  return items
}

export const formatNumber = (value: number) => value.toLocaleString('en-US')
