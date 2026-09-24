import { Play, Power, RefreshCw, ScrollText, ServerCog, ShieldAlert, Square } from 'lucide-react'
import { Alert, Button, Card, Chip, Separator } from '@heroui/react'
import {
  DataList,
  DataRow,
  IconBadge,
  PageHeader,
  Section,
  StatusDot,
} from '../components/kit'
import { services } from '../data/mock'

export default function ServerPanel() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="服务与运维"
        description="进程级的启停与重载入口。所有操作会写入审计流水，危险操作需要二次确认。"
        actions={
          <>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <ScrollText className="size-4" />
              查看审计
            </Button>
            <Button size="sm" className="gap-1.5">
              <RefreshCw className="size-4" />
              重载配置
            </Button>
          </>
        }
      />

      <Section title="进程控制" description="每个进程独立启停，不影响其他服务">
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const running = service.status === '运行中'
            return (
              <Card key={service.name} className="h-full p-5">
                <Card.Header className="flex-row items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <IconBadge icon={ServerCog} tone={service.tone} size="sm" />
                    <div className="min-w-0">
                      <Card.Title className="truncate text-sm font-semibold">
                        {service.name}
                      </Card.Title>
                      <Card.Description className="mt-0.5 truncate font-mono text-xs">
                        {service.endpoint}
                      </Card.Description>
                    </div>
                  </div>
                  <Chip size="sm" variant="soft" color={service.tone}>
                    <Chip.Label>{service.status}</Chip.Label>
                  </Chip>
                </Card.Header>

                <Card.Content className="gap-0">
                  <DataList>
                    <DataRow label="平均延迟" value={service.latency} />
                    <DataRow label="可用率" hint="近 7 日" value={service.uptime} />
                  </DataList>
                </Card.Content>

                <Card.Footer className="gap-2 border-t border-separator pt-3">
                  <div className="flex flex-1 items-center gap-2 text-xs text-muted">
                    <StatusDot tone={service.tone} pulse={running} />
                    {running ? '进程健康' : '需要人工介入'}
                  </div>
                  {running ? (
                    <>
                      <Button size="sm" variant="ghost" className="gap-1.5">
                        <RefreshCw className="size-3.5" />
                        重启
                      </Button>
                      <Button size="sm" variant="danger-soft" className="gap-1.5">
                        <Square className="size-3.5" />
                        停止
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="gap-1.5">
                      <Play className="size-3.5" />
                      启动
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            )
          })}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section title="运行参数" description="来自 sdk_config.json 与启动命令行" className="lg:col-span-3">
          <Card className="h-full p-5">
            <Card.Content className="gap-0">
              <DataList>
                <DataRow label="监听地址" value={<span className="font-mono">0.0.0.0:8443</span>} />
                <DataRow label="TLS 证书" value={<span className="font-mono">sdk_cert.pem</span>} />
                <DataRow label="工作进程" value="4" />
                <DataRow label="心跳间隔" value="5 s" />
                <DataRow label="会话超时" value="30 min" />
                <DataRow label="日志级别" value={<span className="font-mono">INFO</span>} />
                <DataRow label="抓包代理" value="已开启 · cdn_proxy" />
                <DataRow label="数据库文件" value={<span className="font-mono">account.db</span>} />
              </DataList>
            </Card.Content>
          </Card>
        </Section>

        <Section title="危险操作" description="不可逆动作，执行前请确认已有备份" className="lg:col-span-2">
          <Card className="h-full p-5">
            <Card.Content className="gap-4">
              <Alert status="danger">
                <Alert.Indicator>
                  <ShieldAlert className="size-5" />
                </Alert.Indicator>
                <Alert.Content>
                  <Alert.Title>以下操作会影响全部在线玩家</Alert.Title>
                  <Alert.Description>建议在维护窗口内执行。</Alert.Description>
                </Alert.Content>
              </Alert>

              <div className="divide-y divide-separator">
                <div className="flex items-center gap-3 py-3 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">踢出全部在线会话</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      强制客户端重新登录，用于配置热更后的状态同步
                    </div>
                  </div>
                  <Button size="sm" variant="danger-soft">
                    执行
                  </Button>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">清空回放归档</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      释放 455 GB 磁盘，归档服务将自动恢复
                    </div>
                  </div>
                  <Button size="sm" variant="danger-soft">
                    执行
                  </Button>
                </div>
                <div className="flex items-center gap-3 py-3 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">重置沙盒数据库</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      回滚到 临上线基准数据，全部测试账号将被清空
                    </div>
                  </div>
                  <Button size="sm" variant="danger">
                    执行
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <IconBadge icon={Power} tone="danger" size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">停止全部服务</div>
                  <div className="mt-0.5 text-xs leading-5 text-muted">需要输入环境名二次确认</div>
                </div>
                <Button size="sm" variant="danger">
                  停服
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Section>
      </div>
    </div>
  )
}
