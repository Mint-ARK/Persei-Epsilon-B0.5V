import { useState } from 'react'
import { Bell, Info, KeyRound, Monitor, Moon, Palette, Sun } from 'lucide-react'
import {
  Button,
  Card,
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
  cn,
} from '@heroui/react'
import {
  DataList,
  DataRow,
  FieldGrid,
  IconBadge,
  PageHeader,
  PlainSwitch,
  Section,
} from '../components/kit'
import { useTheme, type ThemeMode } from '../lib/theme'

const serverOptions = [
  { id: 's1', label: '主服 S1' },
  { id: 's2', label: '主服 S2' },
  { id: 't3', label: '测试 T3' },
]

const densityOptions = [
  { id: 'comfortable', label: '标准' },
  { id: 'compact', label: '紧凑' },
]

const themeOptions: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: '浅色', icon: Sun },
  { id: 'dark', label: '深色', icon: Moon },
  { id: 'system', label: '跟随系统', icon: Monitor },
]

export default function SettingsPanel() {
  const { mode, setMode, resolved } = useTheme()
  const [name, setName] = useState('V5 控制面板')
  const [operator, setOperator] = useState('admin')
  const [server, setServer] = useState('t3')
  const [density, setDensity] = useState('comfortable')
  const [confirmDanger, setConfirmDanger] = useState(true)
  const [auditLog, setAuditLog] = useState(true)
  const [desktopNotice, setDesktopNotice] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="系统设置"
        description="控制台自身的偏好设置。这些选项只影响当前浏览器，不会写入服务端配置。"
        actions={
          <>
            <Button size="sm" variant="secondary">
              恢复默认
            </Button>
            <Button size="sm">保存设置</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Section title="基础设置" description="控制台标识与默认工作区" className="lg:col-span-3">
          <Card className="h-full p-5">
            <Card.Content className="gap-4">
              <FieldGrid cols={2}>
                <TextField fullWidth value={name} onChange={setName}>
                  <Label>控制台名称</Label>
                  <Input placeholder="控制台名称" />
                </TextField>

                <TextField fullWidth value={operator} onChange={setOperator}>
                  <Label>操作人标识</Label>
                  <Input className="font-mono" placeholder="admin" />
                </TextField>

                <Select
                  fullWidth
                  selectedKey={server}
                  onSelectionChange={(key) => setServer(String(key))}
                >
                  <Label>默认区服</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {serverOptions.map((option) => (
                        <ListBox.Item key={option.id} id={option.id}>
                          {option.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  fullWidth
                  selectedKey={density}
                  onSelectionChange={(key) => setDensity(String(key))}
                >
                  <Label>列表密度</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {densityOptions.map((option) => (
                        <ListBox.Item key={option.id} id={option.id}>
                          {option.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </FieldGrid>

              <TextField fullWidth defaultValue="https://127.0.0.1:8443">
                <Label>服务端地址</Label>
                <Input className="font-mono" placeholder="https://" />
                <Description>仅用于控制台自身的接口请求，视觉稿中不会真正发起连接</Description>
              </TextField>
            </Card.Content>
          </Card>
        </Section>

        <Section title="外观" description="主题跟随 HeroUI 的 data-theme 令牌" className="lg:col-span-2">
          <Card className="h-full p-5">
            <Card.Content className="gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">主题</span>
                  <Chip size="sm" variant="soft" color="default">
                    <Chip.Label>当前 {resolved === 'dark' ? '深色' : '浅色'}</Chip.Label>
                  </Chip>
                </div>
                {/* 分段选择：三个等宽按钮，选中态用 secondary，未选中用 ghost */}
                <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-default p-1.5">
                  {themeOptions.map((option) => (
                    <Button
                      key={option.id}
                      size="sm"
                      variant={mode === option.id ? 'secondary' : 'ghost'}
                      className={cn('gap-1.5', mode === option.id && 'shadow-surface')}
                      onPress={() => setMode(option.id)}
                    >
                      <option.icon className="size-3.5" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-separator border-t border-separator pt-1">
                <div className="flex items-center gap-3.5 py-3">
                  <IconBadge icon={Palette} tone="accent" size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">彩色状态标记</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      在列表中使用语义色区分状态
                    </div>
                  </div>
                  <PlainSwitch isSelected label="彩色状态标记" onChange={() => {}} />
                </div>
                <div className="flex items-center gap-3.5 py-3 last:pb-0">
                  <IconBadge icon={Bell} tone={desktopNotice ? 'accent' : 'default'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">桌面通知</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      告警触发时弹出系统通知
                    </div>
                  </div>
                  <PlainSwitch
                    isSelected={desktopNotice}
                    label="桌面通知"
                    onChange={setDesktopNotice}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section title="安全与审计" description="影响危险操作的确认流程" className="lg:col-span-3">
          <Card className="h-full p-5">
            <Card.Content className="gap-0">
              <div className="divide-y divide-separator">
                <div className="flex items-center gap-3.5 py-3.5 first:pt-0">
                  <IconBadge icon={KeyRound} tone={confirmDanger ? 'success' : 'danger'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">危险操作二次确认</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      停服、清库等操作需要输入环境名后才能提交
                    </div>
                  </div>
                  <PlainSwitch
                    isSelected={confirmDanger}
                    label="危险操作二次确认"
                    onChange={setConfirmDanger}
                  />
                </div>
                <div className="flex items-center gap-3.5 py-3.5 last:pb-0">
                  <IconBadge icon={Info} tone={auditLog ? 'success' : 'default'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">记录操作审计</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      所有写操作写入审计流水，保留 90 天
                    </div>
                  </div>
                  <PlainSwitch isSelected={auditLog} label="记录操作审计" onChange={setAuditLog} />
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section title="关于" description="构建与依赖信息" className="lg:col-span-2">
          <Card className="h-full p-5">
            <Card.Content className="gap-0">
              <DataList>
                <DataRow label="面板版本" value={<span className="font-mono">1.0.0</span>} />
                <DataRow label="UI 框架" value={<span className="font-mono">HeroUI v3.2.4</span>} />
                <DataRow label="React" value={<span className="font-mono">19</span>} />
                <DataRow label="Tailwind CSS" value={<span className="font-mono">v4</span>} />
                <DataRow label="数据来源" value="静态样例（未接数据库）" />
              </DataList>
            </Card.Content>
          </Card>
        </Section>
      </div>
    </div>
  )
}
