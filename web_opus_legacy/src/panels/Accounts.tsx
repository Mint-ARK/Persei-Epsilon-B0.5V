import { useState } from 'react'
import {
  Ban,
  Filter,
  ListFilter,
  MailPlus,
  MoreHorizontal,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import {
  Avatar,
  Button,
  Chip,
  ListBox,
  SearchField,
  Select,
  Separator,
  Table,
} from '@heroui/react'
import { PageHeader, Section, StatCard } from '../components/kit'
import { players } from '../data/mock'

const stateOptions = [
  { id: 'all', label: '全部状态' },
  { id: 'online', label: '在线' },
  { id: 'offline', label: '离线' },
  { id: 'banned', label: '封禁' },
]

const serverOptions = [
  { id: 'all', label: '全部区服' },
  { id: 's1', label: '主服 S1' },
  { id: 's2', label: '主服 S2' },
  { id: 't3', label: '测试 T3' },
]

export default function AccountsPanel() {
  const [keyword, setKeyword] = useState('')
  const [state, setState] = useState('all')
  const [server, setServer] = useState('all')

  return (
    <div className="space-y-6">
      <PageHeader
        title="账号管理"
        description="按 UID、昵称或设备号检索账号，查看等级与在线状态，并执行封禁、补发等管理动作。"
        actions={
          <>
            <Button size="sm" variant="secondary" className="gap-1.5">
              <MailPlus className="size-4" />
              批量补发
            </Button>
            <Button size="sm" className="gap-1.5">
              <UserPlus className="size-4" />
              新建测试号
            </Button>
          </>
        }
      />

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="账号总数" value="128,940" icon={Users} tone="accent" delta="+1,024" deltaNote="今日新增" />
        <StatCard label="当前在线" value="12,480" icon={ShieldCheck} tone="success" delta="9.7%" deltaNote="占总量比例" />
        <StatCard label="封禁中" value="86" icon={Ban} tone="danger" delta="+4" deltaTone="danger" deltaNote="近 24 小时" />
        <StatCard label="待审申诉" value="7" icon={ListFilter} tone="warning" delta="2 超时" deltaTone="warning" deltaNote="超过 48 小时" />
      </div>

      <Section
        title="账号列表"
        description="共 128,940 条记录，当前展示第 1 页"
        actions={
          <Button size="sm" variant="ghost" className="gap-1.5">
            <Filter className="size-4" />
            高级筛选
          </Button>
        }
      >
        {/* 工具条：检索在左、筛选在右，控件统一 36px 高，与表格左右边距对齐 */}
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <SearchField
            aria-label="检索账号"
            fullWidth
            className="w-full sm:w-[300px]"
            value={keyword}
            onChange={setKeyword}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="UID / 昵称 / 设备号" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <div className="flex items-center gap-2.5">
            <Select
              aria-label="按状态筛选"
              fullWidth
              className="w-[128px]"
              selectedKey={state}
              onSelectionChange={(key) => setState(String(key))}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {stateOptions.map((option) => (
                    <ListBox.Item key={option.id} id={option.id}>
                      {option.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              aria-label="按区服筛选"
              fullWidth
              className="w-[128px]"
              selectedKey={server}
              onSelectionChange={(key) => setServer(String(key))}
            >
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
          </div>

          <div className="ms-auto hidden items-center gap-2.5 lg:flex">
            <span className="text-xs text-muted">每页 20 条</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs tabular-nums text-muted">1 – 6 / 128,940</span>
          </div>
        </div>

        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="账号列表" className="min-w-[900px]">
              <Table.Header>
                <Table.Column id="player" isRowHeader>
                  玩家
                </Table.Column>
                <Table.Column id="uid">UID</Table.Column>
                <Table.Column id="level" className="text-end">
                  等级
                </Table.Column>
                <Table.Column id="vip" className="text-end">
                  VIP
                </Table.Column>
                <Table.Column id="server">区服</Table.Column>
                <Table.Column id="lastSeen">最近活跃</Table.Column>
                <Table.Column id="state">状态</Table.Column>
                <Table.Column id="actions" className="text-end">
                  操作
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {players.map((player) => (
                  <Table.Row key={player.id} id={player.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" color={player.tone === 'danger' ? 'danger' : 'accent'}>
                          <Avatar.Fallback>{player.initials}</Avatar.Fallback>
                        </Avatar>
                        <span className="truncate font-medium">{player.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-mono text-xs text-muted">{player.uid}</Table.Cell>
                    <Table.Cell className="text-end tabular-nums">{player.level}</Table.Cell>
                    <Table.Cell className="text-end tabular-nums text-muted">
                      {player.vip > 0 ? `V${player.vip}` : '—'}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-muted">{player.server}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-muted">
                      {player.lastSeen}
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={player.tone}>
                        <Chip.Label>{player.state}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost">
                          详情
                        </Button>
                        <Button aria-label="更多操作" isIconOnly size="sm" variant="ghost">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs tabular-nums text-muted">已选 0 条 · 共 128,940 条</span>
          <div className="flex items-center gap-2">
            <Button isDisabled size="sm" variant="secondary">
              上一页
            </Button>
            <span className="px-1 text-xs tabular-nums text-muted">第 1 / 6,447 页</span>
            <Button size="sm" variant="secondary">
              下一页
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
