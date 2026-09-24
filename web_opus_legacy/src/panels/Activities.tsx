import { useState } from 'react'
import { CalendarClock, CalendarRange, Flag, Layers, Settings2, Swords } from 'lucide-react'
import { Button, Card, Chip, Table } from '@heroui/react'
import {
  IconBadge,
  PageHeader,
  PlainSwitch,
  Section,
  StatCard,
  StatusDot,
} from '../components/kit'
import { activities } from '../data/mock'

const schedule = [
  { id: 's-1', name: '道馆对弈 · 第 4 期', type: '玩法活动', start: '09-19 05:00', end: '10-03 04:59', state: '已排期', tone: 'accent' as const },
  { id: 's-2', name: '限定探测 · UP-2410', type: '卡池', start: '09-22 11:00', end: '10-06 03:59', state: '已排期', tone: 'accent' as const },
  { id: 's-3', name: '中秋限时副本', type: '副本', start: '09-20 00:00', end: '10-06 23:59', state: '待配置', tone: 'warning' as const },
  { id: 's-4', name: '国庆登录签到', type: '签到', start: '10-01 00:00', end: '10-07 23:59', state: '待配置', tone: 'warning' as const },
]

export default function ActivitiesPanel() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(activities.map((item) => [item.id, item.enabled] as const)),
  )

  const enabledCount = Object.values(state).filter(Boolean).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="活动与开关"
        description="总控当前版本的玩法活动、卡池与周期礼包。关闭后客户端入口会在下一次心跳内隐藏。"
        actions={
          <>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <CalendarRange className="size-4" />
              排期日历
            </Button>
            <Button size="sm" className="gap-1.5">
              <Settings2 className="size-4" />
              批量配置
            </Button>
          </>
        }
      />

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="活动总数" value={String(activities.length)} icon={Layers} tone="accent" delta="本版本" deltaNote="含已归档" />
        <StatCard label="进行中" value={String(enabledCount)} icon={Flag} tone="success" delta="已开启" deltaNote="客户端可见" />
        <StatCard label="待排期" value="2" icon={CalendarClock} tone="warning" delta="需配置" deltaTone="warning" deltaNote="7 日内开启" />
        <StatCard label="参与人次" value="3,310" icon={Swords} tone="default" delta="+184" deltaNote="道馆对弈本期" />
      </div>

      <Section
        title="活动开关"
        description="开关立即生效，不需要重启服务"
        actions={<span className="text-xs tabular-nums text-muted">{enabledCount} / {activities.length} 已开启</span>}
      >
        <Card className="p-5">
          <Card.Content className="gap-0">
            <div className="divide-y divide-separator">
              {activities.map((item) => {
                const enabled = state[item.id]
                return (
                  <div key={item.id} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                    <IconBadge icon={Swords} tone={enabled ? item.tone : 'default'} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{item.name}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <StatusDot tone={enabled ? item.tone : 'default'} />
                        <span className="truncate">{item.phase}</span>
                      </div>
                    </div>
                    <div className="hidden w-[148px] shrink-0 text-end font-mono text-xs tabular-nums text-muted md:block">
                      {item.window}
                    </div>
                    <div className="hidden w-20 shrink-0 text-end sm:block">
                      <Chip size="sm" variant="soft" color={enabled ? 'success' : 'default'}>
                        <Chip.Label>{enabled ? '已开启' : '已关闭'}</Chip.Label>
                      </Chip>
                    </div>
                    <PlainSwitch
                      isSelected={enabled}
                      label={item.name}
                      onChange={(value) => setState((prev) => ({ ...prev, [item.id]: value }))}
                    />
                  </div>
                )
              })}
            </div>
          </Card.Content>
        </Card>
      </Section>

      <Section title="后续排期" description="未来 30 天内计划开启的内容">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="活动排期" className="min-w-[720px]">
              <Table.Header>
                <Table.Column id="name" isRowHeader>
                  名称
                </Table.Column>
                <Table.Column id="type">类型</Table.Column>
                <Table.Column id="start">开始</Table.Column>
                <Table.Column id="end">结束</Table.Column>
                <Table.Column id="state">状态</Table.Column>
                <Table.Column id="actions" className="text-end">
                  操作
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {schedule.map((row) => (
                  <Table.Row key={row.id} id={row.id}>
                    <Table.Cell className="font-medium">{row.name}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-muted">{row.type}</Table.Cell>
                    <Table.Cell className="font-mono text-xs whitespace-nowrap text-muted">
                      {row.start}
                    </Table.Cell>
                    <Table.Cell className="font-mono text-xs whitespace-nowrap text-muted">
                      {row.end}
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={row.tone}>
                        <Chip.Label>{row.state}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <Button size="sm" variant="ghost">
                        编辑
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Section>
    </div>
  )
}
