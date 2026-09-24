/**
 * 静态演示数据 —— 本项目不接数据库，所有数值均为排版用样例。
 * 数字刻意保留不同位数（4 位 / 6 位 / 带小数），用来检验 tabular-nums 下的右对齐效果。
 */
import type { Tone } from '../components/kit'

export type Service = {
  name: string
  endpoint: string
  status: '运行中' | '降级' | '已停止'
  tone: Tone
  latency: string
  uptime: string
}

export const services: Service[] = [
  { name: '登录网关', endpoint: 'gateway :8443', status: '运行中', tone: 'success', latency: '12 ms', uptime: '99.98%' },
  { name: '战斗服', endpoint: 'battle-udp :9101', status: '运行中', tone: 'success', latency: '28 ms', uptime: '99.91%' },
  { name: '资源 CDN', endpoint: 'cdn-proxy :8080', status: '降级', tone: 'warning', latency: '340 ms', uptime: '97.40%' },
  { name: '邮件调度', endpoint: 'mail-worker', status: '运行中', tone: 'success', latency: '9 ms', uptime: '99.99%' },
  { name: '回放归档', endpoint: 'replay-archiver', status: '已停止', tone: 'danger', latency: '—', uptime: '0.00%' },
]

export type EventRow = {
  id: string
  time: string
  kind: string
  target: string
  operator: string
  status: '成功' | '待确认' | '失败'
  tone: Tone
}

export const recentEvents: EventRow[] = [
  { id: 'e-1', time: '09-11 14:02:37', kind: '邮件派发', target: '全服 · 12,480 人', operator: 'admin', status: '成功', tone: 'success' },
  { id: 'e-2', time: '09-11 13:51:02', kind: '卡池配置', target: '限定池 UP-2409', operator: 'liuyi', status: '成功', tone: 'success' },
  { id: 'e-3', time: '09-11 13:20:44', kind: '资源发放', target: 'UID 2174928301', operator: 'admin', status: '待确认', tone: 'warning' },
  { id: 'e-4', time: '09-11 12:47:15', kind: '活动开关', target: '道馆对弈 · 第 3 期', operator: 'zhaoqi', status: '成功', tone: 'success' },
  { id: 'e-5', time: '09-11 11:38:09', kind: '回放归档', target: 'replay-archiver', operator: 'system', status: '失败', tone: 'danger' },
  { id: 'e-6', time: '09-11 10:05:51', kind: '账号封禁', target: 'UID 2174003392', operator: 'wangsan', status: '成功', tone: 'success' },
]

export type Player = {
  id: string
  uid: string
  name: string
  initials: string
  level: number
  server: string
  vip: number
  lastSeen: string
  state: '在线' | '离线' | '封禁'
  tone: Tone
}

export const players: Player[] = [
  { id: 'p-1', uid: '2174928301', name: '夜刃·Kestrel', initials: '夜', level: 78, server: '主服 S1', vip: 9, lastSeen: '2 分钟前', state: '在线', tone: 'success' },
  { id: 'p-2', uid: '2174003392', name: '归零测试号', initials: '归', level: 12, server: '测试 T3', vip: 0, lastSeen: '3 天前', state: '封禁', tone: 'danger' },
  { id: 'p-3', uid: '2175610044', name: 'Aster_长夜', initials: 'A', level: 64, server: '主服 S1', vip: 6, lastSeen: '18 分钟前', state: '在线', tone: 'success' },
  { id: 'p-4', uid: '2176882150', name: '沉默的赤道', initials: '沉', level: 51, server: '主服 S2', vip: 3, lastSeen: '昨天 21:40', state: '离线', tone: 'default' },
  { id: 'p-5', uid: '2177245908', name: 'Mira·观测者', initials: 'M', level: 90, server: '主服 S1', vip: 12, lastSeen: '刚刚', state: '在线', tone: 'success' },
  { id: 'p-6', uid: '2178330471', name: '灰烬回响', initials: '灰', level: 33, server: '测试 T3', vip: 1, lastSeen: '6 小时前', state: '离线', tone: 'default' },
]

export type Item = {
  id: number
  name: string
  category: string
  stock: string
  quality: Tone
  qualityLabel: string
}

export const items: Item[] = [
  { id: 1, name: '移转之辉', category: '通用货币', stock: '8,888', quality: 'accent', qualityLabel: '货币' },
  { id: 31, name: '移转之花', category: '通用货币', stock: '6,480', quality: 'accent', qualityLabel: '货币' },
  { id: 2, name: '精准探测凭证', category: '探测凭证', stock: '50', quality: 'warning', qualityLabel: '限定' },
  { id: 3, name: '常规探测凭证', category: '探测凭证', stock: '120', quality: 'default', qualityLabel: '常规' },
  { id: 401, name: '纯净冷却剂（大）', category: '体力道具', stock: '20', quality: 'success', qualityLabel: '消耗' },
  { id: 41710, name: '纯金誓约之戒', category: '誓约材料', stock: '10', quality: 'warning', qualityLabel: '限定' },
  { id: 31001, name: '极星赋能因子', category: '养成材料', stock: '999', quality: 'default', qualityLabel: '常规' },
  { id: 20104, name: '战术模组·甲型', category: '装备模组', stock: '36', quality: 'success', qualityLabel: '消耗' },
]

export type MailRecord = {
  id: string
  title: string
  scope: string
  sentAt: string
  claimed: string
  state: '已送达' | '发送中' | '草稿'
  tone: Tone
}

export const mailHistory: MailRecord[] = [
  { id: 'm-1', title: '【隐科组】战备物资调配', scope: '全服', sentAt: '09-11 14:02', claimed: '9,214 / 12,480', state: '已送达', tone: 'success' },
  { id: 'm-2', title: '道馆对弈第 3 期结算奖励', scope: '参与玩家', sentAt: '09-11 09:30', claimed: '3,077 / 3,310', state: '已送达', tone: 'success' },
  { id: 'm-3', title: '版本补偿 · 1.4.2 热修', scope: '全服', sentAt: '09-11 15:00', claimed: '—', state: '发送中', tone: 'warning' },
  { id: 'm-4', title: '中秋回归礼包（待审）', scope: '流失回归', sentAt: '—', claimed: '—', state: '草稿', tone: 'default' },
]

export type GachaPreset = {
  id: string
  name: string
  summary: string
  pity: string
  upRate: string
}

export const gachaPresets: GachaPreset[] = [
  { id: 'classic_safe', name: '标准保底', summary: '线上同款曲线，80 抽软保底、100 抽硬保底', pity: '100', upRate: '50%' },
  { id: 'fast_test', name: '快速验证', summary: '压缩保底区间，用于抽卡流程回归测试', pity: '20', upRate: '100%' },
  { id: 'stress', name: '压力样本', summary: '关闭保底，用于概率分布与埋点采样', pity: '—', upRate: '2.5%' },
]

export type Activity = {
  id: string
  name: string
  phase: string
  window: string
  enabled: boolean
  tone: Tone
}

export const activities: Activity[] = [
  { id: 'a-1', name: '道馆对弈 · 自走棋', phase: '进行中 · 第 3 期', window: '09-05 → 09-19', enabled: true, tone: 'success' },
  { id: 'a-2', name: '限定探测 · UP-2409', phase: '进行中', window: '09-08 → 09-22', enabled: true, tone: 'success' },
  { id: 'a-3', name: '周期礼包 · 连续登录', phase: '进行中', window: '长期', enabled: true, tone: 'accent' },
  { id: 'a-4', name: '肉鸽远征 · 深潜', phase: '预热中', window: '09-15 → 09-29', enabled: false, tone: 'warning' },
  { id: 'a-5', name: '中秋限时副本', phase: '未开启', window: '09-20 → 10-06', enabled: false, tone: 'default' },
  { id: 'a-6', name: '江湖高手（已下线）', phase: '已归档', window: '已结束', enabled: false, tone: 'danger' },
]

export type LogLine = {
  id: string
  time: string
  level: 'INFO' | 'WARN' | 'ERROR'
  tone: Tone
  source: string
  message: string
}

export const logLines: LogLine[] = [
  { id: 'l-1', time: '14:05:12.338', level: 'INFO', tone: 'default', source: 'gateway', message: 'session established uid=2174928301 region=cn-east' },
  { id: 'l-2', time: '14:05:10.907', level: 'INFO', tone: 'default', source: 'autochess', message: 'hook lifecycle=ON_ROUND_START matched skills=12' },
  { id: 'l-3', time: '14:04:58.221', level: 'WARN', tone: 'warning', source: 'cdn-proxy', message: 'upstream latency 340ms exceeds soft budget 200ms' },
  { id: 'l-4', time: '14:04:41.760', level: 'INFO', tone: 'default', source: 'mail', message: 'batch dispatch queued size=12480 template=30003' },
  { id: 'l-5', time: '14:04:12.085', level: 'ERROR', tone: 'danger', source: 'replay', message: 'archiver exited code=1 reason=disk quota exceeded' },
  { id: 'l-6', time: '14:03:55.412', level: 'INFO', tone: 'default', source: 'inventory', message: 'grant items uid=2175610044 count=3 source=gm_console' },
  { id: 'l-7', time: '14:03:30.004', level: 'WARN', tone: 'warning', source: 'draw', message: 'pity counter drift detected, reconciled to 42' },
  { id: 'l-8', time: '14:03:02.889', level: 'INFO', tone: 'default', source: 'gateway', message: 'heartbeat ok peers=5 rtt_avg=12ms' },
]

export type NodeRow = {
  id: string
  name: string
  role: string
  cpu: number
  memory: number
  conns: string
  tone: Tone
}

export const nodes: NodeRow[] = [
  { id: 'n-1', name: 'node-gateway-01', role: '网关', cpu: 38, memory: 61, conns: '4,120', tone: 'success' },
  { id: 'n-2', name: 'node-battle-01', role: '战斗', cpu: 72, memory: 68, conns: '2,904', tone: 'warning' },
  { id: 'n-3', name: 'node-battle-02', role: '战斗', cpu: 44, memory: 52, conns: '2,617', tone: 'success' },
  { id: 'n-4', name: 'node-data-01', role: '数据', cpu: 25, memory: 77, conns: '318', tone: 'success' },
]
