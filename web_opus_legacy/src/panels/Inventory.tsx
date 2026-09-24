import { useState } from 'react'
import { Boxes, Package, PackagePlus, Plus, Send, Trash2, Warehouse } from 'lucide-react'
import {
  Button,
  Card,
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  Table,
  TextField,
} from '@heroui/react'
import { DataList, DataRow, IconBadge, PageHeader, Section, StatCard } from '../components/kit'
import { items } from '../data/mock'

const channels = [
  { id: 'direct', label: '直接入库' },
  { id: 'mail', label: '邮件附件' },
  { id: 'popup', label: '弹窗奖励' },
]

const categories = ['全部', '通用货币', '探测凭证', '体力道具', '养成材料', '装备模组']

type Draft = { id: number; name: string; count: number }

export default function InventoryPanel() {
  const [uid, setUid] = useState('2174928301')
  const [itemId, setItemId] = useState('31001')
  const [count, setCount] = useState('999')
  const [channel, setChannel] = useState('direct')
  const [category, setCategory] = useState('全部')
  const [draft, setDraft] = useState<Draft[]>([
    { id: 1, name: '移转之辉', count: 8888 },
    { id: 2, name: '精准探测凭证', count: 50 },
    { id: 41710, name: '纯金誓约之戒', count: 5 },
  ])

  const visible = category === '全部' ? items : items.filter((item) => item.category === category)
  const total = draft.reduce((sum, row) => sum + row.count, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="资源与背包"
        description="向指定账号补发道具、货币与养成材料。发放走与线上一致的物品配置表，支持入库、邮件与弹窗三种到账方式。"
        actions={
          <Button size="sm" variant="secondary" className="gap-1.5">
            <Warehouse className="size-4" />
            物品配置表
          </Button>
        }
      />

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="可用物品配置" value="1,286" unit="项" icon={Boxes} tone="accent" delta="已收敛" deltaNote="清理 230 项脏数据" />
        <StatCard label="今日发放次数" value="342" icon={PackagePlus} tone="success" delta="+56" deltaNote="较昨日" />
        <StatCard label="待领取附件" value="9,214" icon={Package} tone="warning" delta="73.8%" deltaTone="warning" deltaNote="领取率" />
        <StatCard label="异常回滚" value="0" icon={Trash2} tone="default" delta="无" deltaNote="近 7 日" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Section
          title="快捷发放"
          description="填写目标与数量后加入待发清单"
          className="lg:col-span-2"
        >
          <Card className="h-full p-5">
            <Card.Content className="gap-4">
              <TextField fullWidth value={uid} onChange={setUid}>
                <Label>目标 UID</Label>
                <Input placeholder="例如 2174928301" />
                <Description>留空表示全服发放，建议先在沙盒账号验证</Description>
              </TextField>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <TextField fullWidth value={itemId} onChange={setItemId}>
                  <Label>物品 ID</Label>
                  <Input className="font-mono" placeholder="31001" />
                </TextField>
                <TextField fullWidth value={count} onChange={setCount}>
                  <Label>数量</Label>
                  <Input className="text-end font-mono tabular-nums" placeholder="1" />
                </TextField>
              </div>

              <Select
                fullWidth
                selectedKey={channel}
                onSelectionChange={(key) => setChannel(String(key))}
              >
                <Label>到账方式</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {channels.map((option) => (
                      <ListBox.Item key={option.id} id={option.id}>
                        {option.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </Card.Content>
            <Card.Footer className="pt-1">
              <Button fullWidth className="gap-1.5">
                <Plus className="size-4" />
                加入待发清单
              </Button>
            </Card.Footer>
          </Card>
        </Section>

        <Section
          title="待发清单"
          description={`共 ${draft.length} 项，合计 ${total.toLocaleString('en-US')} 个`}
          className="lg:col-span-3"
          actions={
            <Button isDisabled={draft.length === 0} size="sm" className="gap-1.5">
              <Send className="size-4" />
              确认发放
            </Button>
          }
        >
          <Card className="h-full p-5">
            <Card.Content className="gap-0">
              {draft.length === 0 ? (
                <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 text-center">
                  <IconBadge icon={Package} tone="default" />
                  <p className="text-sm text-muted">清单为空，请先从左侧加入物品</p>
                </div>
              ) : (
                <div className="divide-y divide-separator">
                  {draft.map((row) => (
                    <div key={row.id} className="flex items-center gap-3.5 py-3 first:pt-0">
                      <IconBadge icon={Package} tone="accent" size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{row.name}</div>
                        <div className="mt-0.5 font-mono text-xs text-muted">ID {row.id}</div>
                      </div>
                      <div className="w-24 shrink-0 text-end text-sm font-medium tabular-nums">
                        ×{row.count.toLocaleString('en-US')}
                      </div>
                      <Button
                        aria-label={`移除 ${row.name}`}
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => setDraft(draft.filter((d) => d.id !== row.id))}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
            <Card.Footer className="mt-1 border-t border-separator pt-3">
              <DataList className="w-full">
                <DataRow label="目标账号" value={<span className="font-mono">{uid || '全服'}</span>} />
                <DataRow
                  label="到账方式"
                  value={channels.find((c) => c.id === channel)?.label ?? '—'}
                />
              </DataList>
            </Card.Footer>
          </Card>
        </Section>
      </div>

      <Section
        title="物品配置表"
        description="按分类筛选，数量列为沙盒库存快照"
        actions={
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={category === name ? 'secondary' : 'ghost'}
                onPress={() => setCategory(name)}
              >
                {name}
              </Button>
            ))}
          </div>
        }
      >
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="物品配置表" className="min-w-[720px]">
              <Table.Header>
                <Table.Column id="name" isRowHeader>
                  物品
                </Table.Column>
                <Table.Column id="id">ID</Table.Column>
                <Table.Column id="category">分类</Table.Column>
                <Table.Column id="quality">标签</Table.Column>
                <Table.Column id="stock" className="text-end">
                  沙盒库存
                </Table.Column>
                <Table.Column id="actions" className="text-end">
                  操作
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {visible.map((item) => (
                  <Table.Row key={item.id} id={String(item.id)}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <IconBadge icon={Package} tone={item.quality} size="sm" />
                        <span className="truncate font-medium">{item.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-mono text-xs text-muted">{item.id}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-muted">{item.category}</Table.Cell>
                    <Table.Cell>
                      {/* default 色的 soft 变体几乎无底色，中性标签改用 secondary 保持同等可读性 */}
                      <Chip
                        size="sm"
                        color={item.quality}
                        variant={item.quality === 'default' ? 'secondary' : 'soft'}
                      >
                        <Chip.Label>{item.qualityLabel}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-end tabular-nums">{item.stock}</Table.Cell>
                    <Table.Cell className="text-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          setDraft((prev) =>
                            prev.some((d) => d.id === item.id)
                              ? prev
                              : [...prev, { id: item.id, name: item.name, count: 1 }],
                          )
                        }
                      >
                        加入清单
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
