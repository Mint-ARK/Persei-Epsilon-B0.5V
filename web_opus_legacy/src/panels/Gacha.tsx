import { useState } from 'react'
import { Dices, Flame, Sparkles, Target, TriangleAlert } from 'lucide-react'
import { Alert, Button, Card, Chip, Label, Slider, cn } from '@heroui/react'
import { DataList, DataRow, IconBadge, PageHeader, PlainSwitch, Section } from '../components/kit'
import { gachaPresets } from '../data/mock'

const drawLog = [
  { id: 'd-1', time: '14:02:11', pool: '限定探测 UP-2409', result: 'SSR · 夜刃', pity: 78, tone: 'warning' as const },
  { id: 'd-2', time: '13:58:40', pool: '限定探测 UP-2409', result: 'SR · 观测者', pity: 12, tone: 'default' as const },
  { id: 'd-3', time: '13:44:02', pool: '常规探测', result: 'SSR · 长夜', pity: 100, tone: 'danger' as const },
  { id: 'd-4', time: '13:21:55', pool: '常规探测', result: 'R · 通用模组', pity: 3, tone: 'default' as const },
]

export default function GachaPanel() {
  const [preset, setPreset] = useState('classic_safe')
  const [pity, setPity] = useState(42)
  const [upRate, setUpRate] = useState(50)
  const [guaranteed, setGuaranteed] = useState(true)
  const [disablePity, setDisablePity] = useState(false)
  const [trace, setTrace] = useState(true)

  return (
    <div className="space-y-6">
      <PageHeader
        title="卡池与保底"
        description="调节沙盒环境的探测概率与保底水位。修改仅作用于当前测试账号，不会写入线上卡池配置。"
        actions={
          <>
            <Button size="sm" variant="secondary">
              重置为线上值
            </Button>
            <Button size="sm">保存调控</Button>
          </>
        }
      />

      <Alert status="warning">
        <Alert.Indicator>
          <TriangleAlert className="size-5" />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>保底计数器与客户端本地缓存共享</Alert.Title>
          <Alert.Description>
            修改水位后需要玩家重新登录一次才能生效，否则客户端会用旧值做十连预测。
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <Section title="调控预设" description="选择一组预置曲线，或在下方手动微调">
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {gachaPresets.map((item) => {
            const active = preset === item.id
            return (
              <button
                key={item.id}
                type="button"
                className="block w-full text-start outline-none"
                onClick={() => setPreset(item.id)}
              >
                <Card
                  className={cn(
                    'h-full p-5 transition-shadow',
                    active ? 'ring-2 ring-accent' : 'hover:shadow-overlay',
                  )}
                >
                  <Card.Header className="flex-row items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <IconBadge icon={Dices} tone={active ? 'accent' : 'default'} size="sm" />
                      <Card.Title className="truncate text-sm font-semibold">{item.name}</Card.Title>
                    </div>
                    {active && (
                      <Chip size="sm" variant="soft" color="accent">
                        <Chip.Label>已选用</Chip.Label>
                      </Chip>
                    )}
                  </Card.Header>
                  <Card.Content className="gap-3">
                    <Card.Description className="text-xs leading-5">{item.summary}</Card.Description>
                    <div className="flex items-center gap-5 border-t border-separator pt-3">
                      <div className="min-w-0">
                        <div className="text-xs text-muted">硬保底</div>
                        <div className="mt-0.5 text-sm font-semibold tabular-nums">{item.pity}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted">UP 占比</div>
                        <div className="mt-0.5 text-sm font-semibold tabular-nums">{item.upRate}</div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </button>
            )
          })}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section title="手动微调" description="拖动滑块实时预览概率曲线" className="lg:col-span-3">
          <Card className="h-full p-5">
            <Card.Content className="gap-6">
              {/* Slider 自身是 grid（label / output / track 三个具名区域），
                  Label 与 Output 必须是直接子元素，不能再包一层 div */}
              <div className="space-y-2">
                <Slider
                  aria-label="当前保底水位"
                  maxValue={100}
                  minValue={0}
                  step={1}
                  value={pity}
                  onChange={(value) => setPity(value as number)}
                >
                  <Label>当前保底水位</Label>
                  <Slider.Output />
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider>
                <div className="flex justify-between text-xs tabular-nums text-muted">
                  <span>0</span>
                  <span>软保底 80</span>
                  <span>100</span>
                </div>
              </div>

              <div className="space-y-2">
                <Slider
                  aria-label="UP 角色占比"
                  maxValue={100}
                  minValue={0}
                  step={5}
                  value={upRate}
                  onChange={(value) => setUpRate(value as number)}
                >
                  <Label>UP 角色占比</Label>
                  <Slider.Output />
                  <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider>
                <div className="flex justify-between text-xs tabular-nums text-muted">
                  <span>0%</span>
                  <span>线上 50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="divide-y divide-separator border-t border-separator pt-1">
                <div className="flex items-center gap-3.5 py-3">
                  <IconBadge icon={Sparkles} tone={guaranteed ? 'success' : 'default'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">下次必定出 UP</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      跳过 50/50 判定，直接命中当期 UP 角色
                    </div>
                  </div>
                  <PlainSwitch
                    isSelected={guaranteed}
                    label="下次必定出 UP"
                    onChange={setGuaranteed}
                  />
                </div>
                <div className="flex items-center gap-3.5 py-3">
                  <IconBadge icon={Flame} tone={disablePity ? 'danger' : 'default'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">关闭保底机制</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      用于概率分布采样，开启后水位滑块不再生效
                    </div>
                  </div>
                  <PlainSwitch
                    isSelected={disablePity}
                    label="关闭保底机制"
                    onChange={setDisablePity}
                  />
                </div>
                <div className="flex items-center gap-3.5 py-3 last:pb-0">
                  <IconBadge icon={Target} tone={trace ? 'accent' : 'default'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">记录抽卡埋点</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted">
                      每次抽取写入 draw_service 日志，便于回溯
                    </div>
                  </div>
                  <PlainSwitch isSelected={trace} label="记录抽卡埋点" onChange={setTrace} />
                </div>
              </div>
            </Card.Content>
          </Card>
        </Section>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Section title="生效摘要" description="保存后将应用于当前测试账号">
            <Card className="p-5">
              <Card.Content className="gap-0">
                <DataList>
                  <DataRow
                    label="预设"
                    value={gachaPresets.find((p) => p.id === preset)?.name ?? '自定义'}
                  />
                  <DataRow label="保底水位" value={disablePity ? '已关闭' : `${pity} / 100`} />
                  <DataRow label="UP 占比" value={`${upRate}%`} />
                  <DataRow label="必出 UP" value={guaranteed ? '是' : '否'} />
                  <DataRow label="埋点记录" value={trace ? '开启' : '关闭'} />
                  <DataRow label="作用账号" value={<span className="font-mono">2174928301</span>} />
                </DataList>
              </Card.Content>
            </Card>
          </Section>

          <Section title="近期抽取" description="沙盒账号的最近 4 次记录" className="flex-1">
            <Card className="h-full p-5">
              <Card.Content className="gap-0">
                <div className="divide-y divide-separator">
                  {drawLog.map((row) => (
                    <div key={row.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                      <span className="w-[58px] shrink-0 font-mono text-[11px] tabular-nums text-muted">
                        {row.time}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{row.result}</div>
                        <div className="mt-0.5 truncate text-xs text-muted">{row.pool}</div>
                      </div>
                      <Chip size="sm" variant="soft" color={row.tone}>
                        <Chip.Label className="tabular-nums">{row.pity} 抽</Chip.Label>
                      </Chip>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  )
}
