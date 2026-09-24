import { useState, type ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  Boxes,
  CalendarRange,
  Gauge,
  Hexagon,
  LayoutDashboard,
  Mail,
  Moon,
  ServerCog,
  Settings,
  Sliders,
  Sun,
  Users,
  Warehouse,
} from 'lucide-react'
import { Avatar, Button, Chip, SearchField, Separator, Tabs } from '@heroui/react'
import { IconBadge, StatusDot } from './components/kit'
import { ThemeProvider, useTheme } from './lib/theme'
import AccountsPanel from './panels/Accounts'
import ActivitiesPanel from './panels/Activities'
import GachaPanel from './panels/Gacha'
import InventoryPanel from './panels/Inventory'
import MailPanel from './panels/Mail'
import OverviewPanel from './panels/Overview'
import RealtimePanel from './panels/Realtime'
import ServerPanel from './panels/Server'
import SettingsPanel from './panels/Settings'
import WarehousePanel from './panels/Warehouse'

type NavItem = {
  id: string
  label: string
  icon: LucideIcon
  Panel: ComponentType
  /** 该项是新分组的起点，渲染一条分隔线 */
  groupStart?: boolean
  badge?: string
}

const NAV: NavItem[] = [
  { id: 'overview', label: '总览看板', icon: LayoutDashboard, Panel: OverviewPanel },
  { id: 'realtime', label: '实时监控', icon: Gauge, Panel: RealtimePanel, badge: '3' },

  { id: 'accounts', label: '账号管理', icon: Users, Panel: AccountsPanel, groupStart: true },
  { id: 'inventory', label: '资源背包', icon: Boxes, Panel: InventoryPanel },
  { id: 'warehouse', label: '仓库物品', icon: Warehouse, Panel: WarehousePanel },
  { id: 'mail', label: '邮件派发', icon: Mail, Panel: MailPanel, badge: '1' },
  { id: 'gacha', label: '卡池保底', icon: Sliders, Panel: GachaPanel },

  { id: 'activities', label: '活动开关', icon: CalendarRange, Panel: ActivitiesPanel, groupStart: true },
  { id: 'server', label: '服务运维', icon: ServerCog, Panel: ServerPanel },
  { id: 'settings', label: '系统设置', icon: Settings, Panel: SettingsPanel },
]

function TopBar() {
  const { resolved, setMode } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-2xl bg-foreground text-background">
            <Hexagon className="size-4" strokeWidth={2.5} />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">V5 控制面板</span>
        </div>

        <Chip size="sm" variant="soft" color="warning">
          <Chip.Label>沙盒环境</Chip.Label>
        </Chip>

        <div className="ms-auto flex items-center gap-2">
          <SearchField aria-label="全局搜索" fullWidth className="hidden w-[240px] xl:block">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索 UID / 道具 / 活动" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <Button aria-label="通知" isIconOnly size="sm" variant="ghost">
            <Bell className="size-4" />
          </Button>

          <Button
            aria-label={resolved === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
          >
            {resolved === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <div className="flex items-center gap-2.5">
            <Avatar size="sm" color="accent">
              <Avatar.Fallback>管</Avatar.Fallback>
            </Avatar>
            <div className="hidden leading-tight sm:block">
              <div className="text-[13px] font-medium">管理员</div>
              <div className="font-mono text-[11px] text-muted">admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Sidebar() {
  return (
    <aside className="sticky top-[4.5rem] flex w-[60px] shrink-0 flex-col gap-3 md:w-[232px]">
      <div className="flex items-center gap-2.5 rounded-2xl bg-surface p-2.5 shadow-surface md:p-3">
        <IconBadge icon={Hexagon} tone="accent" size="sm" />
        <div className="hidden min-w-0 flex-1 md:block">
          <div className="truncate text-[13px] font-semibold">沙盒工作区</div>
          <div className="truncate font-mono text-[11px] text-muted">sandbox-v5</div>
        </div>
      </div>

      <Tabs.ListContainer className="w-full">
        <Tabs.List aria-label="控制面板导航" className="w-full gap-0.5 p-1.5">
          {NAV.map((item) => (
            <Tabs.Tab
              key={item.id}
              id={item.id}
              className="h-9 w-full min-w-0 justify-center gap-2.5 px-2 text-start md:justify-start md:px-3"
            >
              {item.groupStart && <Tabs.Separator />}
              <Tabs.Indicator />
              <item.icon className="size-4 shrink-0" strokeWidth={2} />
              <span className="hidden min-w-0 flex-1 truncate md:block">{item.label}</span>
              {item.badge && (
                <span className="hidden shrink-0 rounded-full bg-danger px-1.5 py-px text-[10px] leading-4 font-medium tabular-nums text-danger-foreground md:block">
                  {item.badge}
                </span>
              )}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>

      <div className="hidden rounded-2xl bg-surface p-3.5 shadow-surface md:block">
        <div className="flex items-center gap-2">
          <StatusDot tone="success" pulse />
          <span className="text-xs font-medium">服务运行中</span>
        </div>
        <dl className="mt-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-xs text-muted">版本</dt>
            <dd className="font-mono text-xs tabular-nums">1.4.2</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-xs text-muted">在线</dt>
            <dd className="text-xs tabular-nums">12,480</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-xs text-muted">运行时长</dt>
            <dd className="text-xs tabular-nums">6h 03m</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}

function Console() {
  // 面板 id 同步到 URL hash，便于把某个页签的链接直接发给别人
  const [tab, setTab] = useState(() => {
    const id = window.location.hash.replace('#', '')
    return NAV.some((item) => item.id === id) ? id : 'overview'
  })

  const selectTab = (key: string) => {
    setTab(key)
    window.history.replaceState(null, '', `#${key}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />

      <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 pb-16 sm:px-6">
        <Tabs
          className="items-start gap-0"
          orientation="vertical"
          selectedKey={tab}
          onSelectionChange={(key) => selectTab(String(key))}
        >
          <Sidebar />

          <div className="min-w-0 flex-1 ps-4 sm:ps-6 lg:ps-8">
            {NAV.map(({ id, Panel }) => (
              <Tabs.Panel key={id} id={id} className="ms-0 w-full p-0">
                <Panel />
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Console />
    </ThemeProvider>
  )
}
