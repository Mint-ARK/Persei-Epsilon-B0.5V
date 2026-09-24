import { useState } from 'react'
import { Activity, Cpu, Gauge, MemoryStick, Radio, TriangleAlert, Waves } from 'lucide-react'
import { Alert, Button, Card, Chip, ProgressBar, ScrollShadow } from '@heroui/react'
import { PageHeader, PlainSwitch, Section, StatCard, StatusDot } from '../components/kit'
import { logLines, nodes } from '../data/mock'

const traffic = [
  { path: '/login/auth', count: '48,210', share: 100 },
  { path: '/stage/settle', count: '31,884', share: 66 },
  { path: '/inventory/sync', count: '22,470', share: 47 },
  { path: '/mail/list', count: '15,092', share: 31 },
  { path: '/draw/pool', count: '9,338', share: 19 },
  { path: '/autochess/frame', count: '6,201', share: 13 },
]

export default function RealtimePanel() {
  const [autoRefresh, setAutoRefresh] = useState(true)

  return (
    <div className="space-y-6">
      <PageHeader
        title="实时监控"
        description="节点负载、接口分布与运行日志的滚动视图，用于定位瞬时抖动与异常堆栈。"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <StatusDot tone={autoRefresh ? 'success' : 'default'} pulse={autoRefresh} />
              <span className="text-xs text-muted">
                {autoRefresh ? '每 5 秒刷新' : '已暂停'}
              </span>
            </div>
            <PlainSwitch isSelected={autoRefresh} label="自动刷新" onChange={setAutoRefresh} />
          </div>
        }
      />

      <Alert status="danger">
        <Alert.Indicator>
          <TriangleAlert className="size-5" />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>回放归档服务已退出（exit code 1）</Alert.Title>
          <Alert.Description>
            磁盘配额已写满 455 GB / 500 GB，归档任务自 14:04:12 起停止。清理历史回放后可自动恢复。
          </Alert.Description>
        </Alert.Content>
        <Button size="sm" variant="danger-soft" className="shrink-0 self-center">
          立即处理
        </Button>
      </Alert>

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="每秒请求" value="4,812" unit="QPS" icon={Activity} tone="accent" delta="+6.4%" deltaNote="近 5 分钟" />
        <StatCard label="平均响应" value="28" unit="ms" icon={Gauge} tone="success" delta="-3 ms" deltaNote="较上一周期" />
        <StatCard label="错误率" value="0.42" unit="%" icon={Waves} tone="warning" delta="+0.11%" deltaTone="warning" deltaNote="阈值 0.50%" />
        <StatCard label="长连接" value="5,412" icon={Radio} tone="accent" delta="稳定" deltaNote="峰值 6,980" />
      </div>

      <Section title="节点负载" description="CPU 与内存占用，超过 70% 会转为警示色">
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {nodes.map((node) => (
            <Card key={node.id} className="h-full p-5">
              <Card.Header className="flex-row items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <StatusDot tone={node.tone} pulse />
                  <Card.Title className="truncate font-mono text-[13px] font-medium">
                    {node.name}
                  </Card.Title>
                </div>
                <Chip size="sm" variant="soft" color="default">
                  <Chip.Label>{node.role}</Chip.Label>
                </Chip>
              </Card.Header>
              <Card.Content className="gap-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Cpu className="size-3.5" />
                      CPU
                    </span>
                    <span className="text-xs font-medium tabular-nums">{node.cpu}%</span>
                  </div>
                  <ProgressBar
                    aria-label={`${node.name} CPU 占用`}
                    color={node.cpu >= 70 ? 'warning' : 'accent'}
                    size="sm"
                    value={node.cpu}
                  >
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <MemoryStick className="size-3.5" />
                      内存
                    </span>
                    <span className="text-xs font-medium tabular-nums">{node.memory}%</span>
                  </div>
                  <ProgressBar
                    aria-label={`${node.name} 内存占用`}
                    color={node.memory >= 70 ? 'warning' : 'accent'}
                    size="sm"
                    value={node.memory}
                  >
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>
              </Card.Content>
              <Card.Footer className="justify-between border-t border-separator pt-3">
                <span className="text-xs text-muted">连接数</span>
                <span className="text-xs font-medium tabular-nums">{node.conns}</span>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section
          title="运行日志"
          description="最近 200 条，按时间倒序"
          className="lg:col-span-3"
          actions={
            <Button size="sm" variant="ghost">
              下载全量
            </Button>
          }
        >
          <Card className="h-full gap-0 overflow-hidden p-0">
            <ScrollShadow className="cp-scroll max-h-[332px] px-5 py-2">
              <div className="divide-y divide-separator">
                {logLines.map((line) => (
                  <div key={line.id} className="flex items-start gap-3 py-2.5">
                    <span className="w-[86px] shrink-0 pt-px font-mono text-[11px] tabular-nums text-muted">
                      {line.time}
                    </span>
                    <span className="w-14 shrink-0">
                      <Chip size="sm" variant="soft" color={line.tone}>
                        <Chip.Label className="font-mono text-[10px]">{line.level}</Chip.Label>
                      </Chip>
                    </span>
                    <span className="w-[76px] shrink-0 truncate pt-px font-mono text-[11px] text-muted">
                      {line.source}
                    </span>
                    <span className="min-w-0 flex-1 pt-px font-mono text-[11px] leading-5 break-words">
                      {line.message}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollShadow>
          </Card>
        </Section>

        <Section title="接口调用分布" description="近 1 小时累计请求量" className="lg:col-span-2">
          <Card className="h-full p-5">
            <Card.Content className="gap-3.5">
              {traffic.map((row) => (
                <div key={row.path} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate font-mono text-xs text-muted">{row.path}</span>
                    <span className="shrink-0 text-xs font-medium tabular-nums">{row.count}</span>
                  </div>
                  <ProgressBar
                    aria-label={row.path}
                    color="accent"
                    size="sm"
                    value={row.share}
                  >
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>
              ))}
            </Card.Content>
          </Card>
        </Section>
      </div>
    </div>
  )
}
