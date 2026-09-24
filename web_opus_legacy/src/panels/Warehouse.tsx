import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Boxes,
  Cpu,
  LayoutGrid,
  Package,
  RefreshCw,
  Rows3,
  Table2,
  Timer,
  TriangleAlert,
} from 'lucide-react'
import {
  Alert,
  Button,
  Card,
  Chip,
  ListBox,
  SearchField,
  Select,
  Separator,
  cn,
} from '@heroui/react'
import { IconBadge, PageHeader, PlainSwitch, Section, StatCard, type Tone } from '../components/kit'
import { useElementSize } from '../lib/useElementSize'
import {
  CATEGORIES,
  QUALITIES,
  formatNumber,
  generateItems,
  qualityTone,
  type QualityTier,
  type WarehouseItem,
} from '../data/warehouse'

/* ------------------------------------------------------------------ 布局常量 */

const VIEWPORT_HEIGHT = 560
const GRID_GAP = 12
const GRID_MIN_WIDTH = 186
const GRID_CARD_HEIGHT = 112
const GRID_PADDING = 12
const ROW_HEIGHT = { grid: GRID_CARD_HEIGHT + GRID_GAP, table: 46, list: 34 } as const
const OVERSCAN = 3

/** 关闭虚拟滚动时的渲染上限——2 万张卡片全量挂载足以让浏览器失去响应 */
const PLAIN_RENDER_CAP = 5000

const TABLE_COLUMNS = 'minmax(0,1fr) 96px 116px 88px 128px 88px'
const LIST_COLUMNS = '88px minmax(0,1fr) 132px 96px 132px 96px'

const SIZES = [1000, 5000, 20000] as const
const VIEWS = [
  { id: 'grid', label: '网格卡片', icon: LayoutGrid },
  { id: 'table', label: '数据表格', icon: Table2 },
  { id: 'list', label: '紧凑列表', icon: Rows3 },
] as const

type ViewMode = (typeof VIEWS)[number]['id']

/**
 * 初始状态可由 URL 覆写，便于把某个校验配置直接分享/截图：
 *   ?wh=table&whSize=20000&whVirtual=0
 */
function readInitialState() {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('wh')
  const size = Number(params.get('whSize'))
  return {
    view: (VIEWS.some((item) => item.id === view) ? view : 'grid') as ViewMode,
    size: (SIZES as readonly number[]).includes(size) ? size : 5000,
    virtual: params.get('whVirtual') !== '0',
  }
}

/* ------------------------------------------------------------------ 小组件 */

/** default 品质的 soft 变体几乎无底色，这里换 secondary 保持同等可读性 */
function QualityChip({ quality }: { quality: QualityTier }) {
  const tone = qualityTone[quality]
  return (
    <Chip size="sm" color={tone} variant={tone === 'default' ? 'secondary' : 'soft'}>
      <Chip.Label>{quality}</Chip.Label>
    </Chip>
  )
}

function HeaderCell({ children, align }: { children: string; align?: 'end' }) {
  return (
    <div className={cn('truncate px-4 text-xs font-medium text-muted', align === 'end' && 'text-end')}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ 面板 */

export default function WarehousePanel() {
  const initial = useRef(readInitialState()).current
  const [size, setSize] = useState<number>(initial.size)
  const [seed, setSeed] = useState(20260911)
  const [view, setView] = useState<ViewMode>(initial.view)
  const [virtual, setVirtual] = useState(initial.virtual)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [quality, setQuality] = useState('all')

  /* ---------------- 数据生成与筛选（各自计时） ---------------- */

  const { source, generateMs } = useMemo(() => {
    const started = performance.now()
    const items = generateItems(size, seed)
    return { source: items, generateMs: performance.now() - started }
  }, [size, seed])

  const { filtered, filterMs } = useMemo(() => {
    const started = performance.now()
    const keyword = query.trim().toLowerCase()
    const result = source.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (quality !== 'all' && item.quality !== quality) return false
      if (!keyword) return true
      return item.name.toLowerCase().includes(keyword) || String(item.id).includes(keyword)
    })
    return { filtered: result, filterMs: performance.now() - started }
  }, [source, query, category, quality])

  /* ---------------- 视口与窗口计算 ---------------- */

  const { ref: viewportRef, width: viewportWidth, height: viewportHeight } =
    useElementSize<HTMLDivElement>()
  const [scrollTop, setScrollTop] = useState(0)

  const columns =
    view === 'grid'
      ? Math.max(
          1,
          Math.floor((viewportWidth - GRID_PADDING * 2 + GRID_GAP) / (GRID_MIN_WIDTH + GRID_GAP)),
        )
      : 1

  const rowHeight = ROW_HEIGHT[view]
  const capped = !virtual && filtered.length > PLAIN_RENDER_CAP
  const renderable = capped ? filtered.slice(0, PLAIN_RENDER_CAP) : filtered

  const totalRows = Math.ceil(renderable.length / columns)
  const totalHeight = totalRows * rowHeight

  let startRow = 0
  let endRow = totalRows
  if (virtual) {
    // 视口高度是固定常量；不能等 ResizeObserver 回调，
    // 否则首帧会因为 height=0 退化成「全量渲染」，虚拟滚动形同虚设
    const height = viewportHeight || VIEWPORT_HEIGHT
    startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
    endRow = Math.min(totalRows, Math.ceil((scrollTop + height) / rowHeight) + OVERSCAN)
  }

  const slice = renderable.slice(startRow * columns, Math.min(renderable.length, endRow * columns))
  const offsetY = startRow * rowHeight

  /* ---------------- 性能采样 ---------------- */

  const [renderMs, setRenderMs] = useState(0)
  const [domNodes, setDomNodes] = useState(0)
  const [fps, setFps] = useState(0)

  // 在 render 期间打点，useLayoutEffect 里读出提交完成的时刻
  const renderStarted = useRef(0)
  renderStarted.current = performance.now()

  // 只在「控制项变化」时测量首帧，滚动导致的切片更新不重复触发。
  // columns 参与 key：首帧宽度未知时列数为 1，等 ResizeObserver 定下真实列数后再测一次，
  // 读数才是稳定布局下的值。
  const controlKey = `${size}|${seed}|${view}|${virtual}|${query}|${category}|${quality}`
  const measureKey = `${controlKey}|${columns}`
  useLayoutEffect(() => {
    setRenderMs(performance.now() - renderStarted.current)
    setDomNodes(viewportRef.current?.getElementsByTagName('*').length ?? 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measureKey])

  // 控制项变化后回到顶部，避免停留在越界的滚动位置（改变列数不重置）
  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0
    setScrollTop(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlKey])

  const scrollRaf = useRef(0)
  const fpsRaf = useRef(0)
  const scrolling = useRef(false)
  const idleTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
      if (fpsRaf.current) cancelAnimationFrame(fpsRaf.current)
      window.clearTimeout(idleTimer.current)
    },
    [],
  )

  const sampleFps = () => {
    let frames = 0
    let windowStart = performance.now()
    const tick = () => {
      frames += 1
      const now = performance.now()
      if (now - windowStart >= 400) {
        setFps(Math.round((frames * 1000) / (now - windowStart)))
        frames = 0
        windowStart = now
      }
      fpsRaf.current = scrolling.current ? requestAnimationFrame(tick) : 0
    }
    fpsRaf.current = requestAnimationFrame(tick)
  }

  const handleScroll = () => {
    if (!scrolling.current) {
      scrolling.current = true
      sampleFps()
    }
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      scrolling.current = false
    }, 500)

    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0
      setScrollTop(viewportRef.current?.scrollTop ?? 0)
    })
  }

  /* ---------------- 派生指标 ---------------- */

  const renderedShare = renderable.length > 0 ? (slice.length / renderable.length) * 100 : 0
  const fpsTone: Tone = fps === 0 ? 'default' : fps >= 50 ? 'success' : fps >= 30 ? 'warning' : 'danger'
  const renderTone: Tone = renderMs <= 16 ? 'success' : renderMs <= 80 ? 'warning' : 'danger'

  /* ---------------- 渲染 ---------------- */

  const renderRow = (item: WarehouseItem) => {
    if (view === 'grid') {
      return (
        <Card key={item.id} className="gap-2 p-3" style={{ height: GRID_CARD_HEIGHT }}>
          <Card.Header className="flex-row items-center justify-between gap-2">
            <IconBadge icon={Package} tone={qualityTone[item.quality]} size="sm" />
            <QualityChip quality={item.quality} />
          </Card.Header>
          <Card.Content className="justify-end gap-1">
            <div className="truncate text-[13px] font-medium">{item.name}</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[11px] text-muted">{item.id}</span>
              <span className="text-[13px] font-semibold tabular-nums">
                ×{formatNumber(item.count)}
              </span>
            </div>
          </Card.Content>
        </Card>
      )
    }

    if (view === 'table') {
      return (
        <div
          key={item.id}
          className="grid items-center border-b border-separator-tertiary/50 bg-surface"
          style={{ height: rowHeight, gridTemplateColumns: TABLE_COLUMNS }}
        >
          <div className="flex min-w-0 items-center gap-3 px-4">
            <IconBadge icon={Package} tone={qualityTone[item.quality]} size="sm" />
            <span className="truncate text-sm font-medium">{item.name}</span>
          </div>
          <div className="truncate px-4 font-mono text-xs text-muted">{item.id}</div>
          <div className="truncate px-4 text-sm text-muted">{item.category}</div>
          <div className="px-4">
            <QualityChip quality={item.quality} />
          </div>
          <div className="px-4 text-end text-sm font-medium tabular-nums">
            {formatNumber(item.count)}
          </div>
          <div className="px-4 text-end font-mono text-xs text-muted">{item.obtained}</div>
        </div>
      )
    }

    return (
      <div
        key={item.id}
        className="grid items-center border-b border-separator-tertiary/50 bg-surface"
        style={{ height: rowHeight, gridTemplateColumns: LIST_COLUMNS }}
      >
        <div className="truncate px-4 font-mono text-[11px] text-muted">{item.id}</div>
        <div className="truncate px-4 text-[13px] font-medium">{item.name}</div>
        <div className="truncate px-4 text-xs text-muted">{item.category}</div>
        <div className="flex items-center gap-1.5 px-4 text-xs text-muted">
          <span
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              qualityTone[item.quality] === 'default' ? 'bg-muted' : '',
              qualityTone[item.quality] === 'success' ? 'bg-success' : '',
              qualityTone[item.quality] === 'accent' ? 'bg-accent' : '',
              qualityTone[item.quality] === 'warning' ? 'bg-warning' : '',
              qualityTone[item.quality] === 'danger' ? 'bg-danger' : '',
            )}
          />
          {item.quality}
        </div>
        <div className="px-4 text-end text-[13px] font-medium tabular-nums">
          {formatNumber(item.count)}
        </div>
        <div className="px-4 text-end font-mono text-[11px] text-muted">{item.obtained}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="仓库物品 · 容量校验"
        description="用上万条合成物品检验这套界面的密集展示能力：三种视图、可开关的虚拟滚动，以及生成 / 筛选 / 渲染三段耗时与滚动帧率的实时读数。"
        actions={
          <Button size="sm" variant="secondary" className="gap-1.5" onPress={() => setSeed(Date.now())}>
            <RefreshCw className="size-4" />
            重新生成
          </Button>
        }
      />

      <Section title="校验参数" description="切换任一项都会重新计时">
        <Card className="p-5">
          <Card.Content className="gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium">数据规模</span>
                <div className="flex items-center gap-1.5 rounded-2xl bg-default p-1.5">
                  {SIZES.map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={size === value ? 'secondary' : 'ghost'}
                      className={cn('tabular-nums', size === value && 'shadow-surface')}
                      onPress={() => setSize(value)}
                    >
                      {formatNumber(value)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium">视图</span>
                <div className="flex items-center gap-1.5 rounded-2xl bg-default p-1.5">
                  {VIEWS.map((option) => (
                    <Button
                      key={option.id}
                      size="sm"
                      variant={view === option.id ? 'secondary' : 'ghost'}
                      className={cn('gap-1.5', view === option.id && 'shadow-surface')}
                      onPress={() => setView(option.id)}
                    >
                      <option.icon className="size-3.5" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">虚拟滚动</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {virtual ? '只挂载可视区条目' : `全量挂载，上限 ${formatNumber(PLAIN_RENDER_CAP)} 条`}
                  </div>
                </div>
                <PlainSwitch isSelected={virtual} label="虚拟滚动" onChange={setVirtual} />
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-2.5">
              <SearchField
                aria-label="检索物品"
                fullWidth
                className="w-full sm:w-[280px]"
                value={query}
                onChange={setQuery}
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="按名称或 ID 检索" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>

              <Select
                aria-label="按分类筛选"
                fullWidth
                className="w-[136px]"
                selectedKey={category}
                onSelectionChange={(key) => setCategory(String(key))}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="all">全部分类</ListBox.Item>
                    {CATEGORIES.map((name) => (
                      <ListBox.Item key={name} id={name}>
                        {name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                aria-label="按品质筛选"
                fullWidth
                className="w-[120px]"
                selectedKey={quality}
                onSelectionChange={(key) => setQuality(String(key))}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="all">全部品质</ListBox.Item>
                    {QUALITIES.map((name) => (
                      <ListBox.Item key={name} id={name}>
                        {name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <div className="ms-auto hidden items-center gap-2 text-xs tabular-nums text-muted lg:flex">
                <span>命中 {formatNumber(filtered.length)} 条</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{view === 'grid' ? `${columns} 列` : '单列'}</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </Section>

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="数据规模"
          value={formatNumber(filtered.length)}
          unit="项"
          icon={Boxes}
          tone="accent"
          delta={`生成 ${generateMs.toFixed(1)} ms`}
          deltaTone="default"
          deltaNote={`筛选 ${filterMs.toFixed(1)} ms`}
        />
        <StatCard
          label="实际挂载条目"
          value={formatNumber(slice.length)}
          unit="项"
          icon={Package}
          tone={virtual ? 'success' : 'warning'}
          delta={`${renderedShare.toFixed(renderedShare < 1 ? 2 : 0)}%`}
          deltaTone={virtual ? 'success' : 'warning'}
          deltaNote="占命中总量"
        />
        <StatCard
          label="视口 DOM 节点"
          value={formatNumber(domNodes)}
          icon={Cpu}
          tone={virtual ? 'success' : 'warning'}
          delta={virtual ? '常量级' : '线性增长'}
          deltaTone={virtual ? 'success' : 'warning'}
          deltaNote="与数据量的关系"
        />
        <StatCard
          label="首帧渲染"
          value={renderMs.toFixed(1)}
          unit="ms"
          icon={Timer}
          tone={renderTone}
          delta={fps > 0 ? `${fps} FPS` : '滚动后采样'}
          deltaTone={fpsTone}
          deltaNote="滚动帧率"
        />
      </div>

      {capped && (
        <Alert status="warning">
          <Alert.Indicator>
            <TriangleAlert className="size-5" />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>
              已关闭虚拟滚动，渲染量被限制在前 {formatNumber(PLAIN_RENDER_CAP)} 条
            </Alert.Title>
            <Alert.Description>
              命中 {formatNumber(filtered.length)} 条全部挂载会让浏览器长时间无响应。即便只渲染
              {' '}
              {formatNumber(PLAIN_RENDER_CAP)} 条，也能从上方的 DOM 节点数与首帧耗时看出差距。
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <Section
        title="仓库视图"
        description={`视口固定 ${VIEWPORT_HEIGHT}px，滚动时自动采样帧率`}
        actions={
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="soft" color={virtual ? 'success' : 'warning'}>
              <Chip.Label>{virtual ? '虚拟滚动' : '全量渲染'}</Chip.Label>
            </Chip>
          </div>
        }
      >
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className="cp-scroll relative overflow-auto rounded-3xl bg-surface-secondary"
          style={{ height: VIEWPORT_HEIGHT }}
        >
          {view !== 'grid' && renderable.length > 0 && (
            <div
              className="sticky top-0 z-10 grid items-center border-b border-separator/60 bg-surface-secondary"
              style={{ height: 38, gridTemplateColumns: view === 'table' ? TABLE_COLUMNS : LIST_COLUMNS }}
            >
              {view === 'table' ? (
                <>
                  <HeaderCell>物品</HeaderCell>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>分类</HeaderCell>
                  <HeaderCell>品质</HeaderCell>
                  <HeaderCell align="end">数量</HeaderCell>
                  <HeaderCell align="end">入库</HeaderCell>
                </>
              ) : (
                <>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>名称</HeaderCell>
                  <HeaderCell>分类</HeaderCell>
                  <HeaderCell>品质</HeaderCell>
                  <HeaderCell align="end">数量</HeaderCell>
                  <HeaderCell align="end">入库</HeaderCell>
                </>
              )}
            </div>
          )}

          {renderable.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <IconBadge icon={Package} tone="default" />
              <p className="text-sm text-muted">没有命中任何物品，试试放宽筛选条件</p>
            </div>
          ) : (
            <div
              style={{ height: totalHeight }}
              className={view === 'grid' ? 'px-3 py-3' : undefined}
            >
              <div
                style={
                  view === 'grid'
                    ? {
                        transform: `translateY(${offsetY}px)`,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: GRID_GAP,
                      }
                    : { transform: `translateY(${offsetY}px)` }
                }
              >
                {slice.map(renderRow)}
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}
