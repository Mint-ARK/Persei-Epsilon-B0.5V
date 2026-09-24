import {
  ArrowUpRight,
  CircleAlert,
  Database,
  Download,
  HardDrive,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Button, Card, Chip, ProgressBar, Table } from '@heroui/react'
import {
  DataList,
  DataRow,
  PageHeader,
  Section,
  StatCard,
  StatusDot,
  type Tone,
} from '../components/kit'
import { recentEvents, services } from '../data/mock'

const capacity: { label: string; value: number; text: string; tone: Tone }[] = [
  { label: '账号库容量', value: 62, text: '13.3 GB / 21.5 GB', tone: 'accent' },
  { label: '回放归档磁盘', value: 91, text: '455 GB / 500 GB', tone: 'danger' },
  { label: '邮件队列水位', value: 34, text: '4,208 / 12,000', tone: 'success' },
  { label: 'CDN 回源带宽', value: 78, text: '156 Mbps / 200 Mbps', tone: 'warning' },
]

export default function OverviewPanel() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="总览看板"
        description="当前沙盒环境的整体运行状况。数据每 30 秒轮询一次，指标口径与线上监控保持一致。"
        actions={
          <>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <RefreshCw className="size-4" />
              刷新
            </Button>
            <Button size="sm" className="gap-1.5">
              <Download className="size-4" />
              导出日报
            </Button>
          </>
        }
      />

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="在线玩家"
          value="12,480"
          icon={Users}
          tone="accent"
          delta="+8.2%"
          deltaTone="success"
          deltaNote="较昨日同时段"
        />
        <StatCard
          label="今日新增账号"
          value="1,024"
          icon={TrendingUp}
          tone="success"
          delta="+12.4%"
          deltaTone="success"
          deltaNote="近 7 日最高"
        />
        <StatCard
          label="当日流水"
          value="86,420"
          unit="元"
          icon={Wallet}
          tone="warning"
          delta="-3.1%"
          deltaTone="danger"
          deltaNote="较昨日同时段"
        />
        <StatCard
          label="待处理告警"
          value="3"
          unit="条"
          icon={CircleAlert}
          tone="danger"
          delta="1 严重"
          deltaTone="danger"
          deltaNote="回放归档磁盘写满"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section
          title="服务健康度"
          description="网关、战斗与周边服务的实时状态"
          className="lg:col-span-3"
          actions={
            <Button size="sm" variant="ghost" className="gap-1">
              全部服务
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        >
          <Card className="h-full p-5">
            <Card.Content className="gap-0">
              <div className="divide-y divide-separator">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <StatusDot tone={service.tone} pulse={service.tone === 'success'} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">
                        {service.name}
                      </div>
                      <div className="mt-0.5 truncate font-mono text-xs text-muted">
                        {service.endpoint}
                      </div>
                    </div>
                    <div className="hidden w-20 shrink-0 text-end text-xs tabular-nums text-muted sm:block">
                      {service.latency}
                    </div>
                    <div className="hidden w-16 shrink-0 text-end text-xs tabular-nums text-muted md:block">
                      {service.uptime}
                    </div>
                    <div className="w-16 shrink-0 text-end">
                      <Chip size="sm" variant="soft" color={service.tone}>
                        <Chip.Label>{service.status}</Chip.Label>
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section
          title="资源水位"
          description="存储与队列的占用比例"
          className="lg:col-span-2"
        >
          <Card className="h-full p-5">
            <Card.Content className="gap-4">
              {capacity.map((row) => (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-sm text-muted">{row.label}</span>
                    <span className="shrink-0 text-sm font-medium tabular-nums">{row.value}%</span>
                  </div>
                  <ProgressBar aria-label={row.label} color={row.tone} value={row.value}>
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                  <div className="text-xs tabular-nums text-muted">{row.text}</div>
                </div>
              ))}
            </Card.Content>
          </Card>
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section
          title="近期操作记录"
          description="控制台写操作的审计流水"
          className="lg:col-span-3"
          actions={
            <Button size="sm" variant="ghost" className="gap-1">
              查看全部
              <ArrowUpRight className="size-3.5" />
            </Button>
          }
        >
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="近期操作记录" className="min-w-[620px]">
                <Table.Header>
                  <Table.Column id="time" isRowHeader>
                    时间
                  </Table.Column>
                  <Table.Column id="kind">类型</Table.Column>
                  <Table.Column id="target">对象</Table.Column>
                  <Table.Column id="operator">操作人</Table.Column>
                  <Table.Column id="status" className="text-end">
                    状态
                  </Table.Column>
                </Table.Header>
                <Table.Body>
                  {recentEvents.map((row) => (
                    <Table.Row key={row.id} id={row.id}>
                      <Table.Cell className="font-mono text-xs whitespace-nowrap text-muted">
                        {row.time}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">{row.kind}</Table.Cell>
                      <Table.Cell className="max-w-[200px] truncate text-muted">
                        {row.target}
                      </Table.Cell>
                      <Table.Cell className="font-mono text-xs text-muted">
                        {row.operator}
                      </Table.Cell>
                      <Table.Cell className="text-end">
                        <Chip size="sm" variant="soft" color={row.tone}>
                          <Chip.Label>{row.status}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Section>

        <Section title="环境摘要" description="当前沙盒的运行参数" className="lg:col-span-2">
          <Card className="h-full p-5">
            <Card.Content className="gap-0">
              <DataList>
                <DataRow label="环境标识" value={<span className="font-mono">sandbox-v5</span>} />
                <DataRow label="服务端版本" value={<span className="font-mono">1.4.2+cb1de62</span>} />
                <DataRow label="协议版本" value={<span className="font-mono">v5 / codec-3</span>} />
                <DataRow label="数据库" value="account.db · 13.3 MB" />
                <DataRow label="活跃连接" value="5,412" />
                <DataRow label="最近重启" value="09-11 08:02" />
              </DataList>
            </Card.Content>
            <Card.Footer className="gap-2 pt-1">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <Database className="size-4" />
                备份数据库
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5">
                <HardDrive className="size-4" />
                清理归档
              </Button>
            </Card.Footer>
          </Card>
        </Section>
      </div>
    </div>
  )
}
