import { useState } from 'react'
import { Clock, Gift, Mail, Paperclip, Send, Trash2, Users } from 'lucide-react'
import {
  Button,
  Card,
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  Separator,
  Table,
  TextArea,
  TextField,
} from '@heroui/react'
import { DataList, DataRow, IconBadge, PageHeader, PlainSwitch, Section } from '../components/kit'
import { mailHistory } from '../data/mock'

const scopes = [
  { id: 'all', label: '全服玩家' },
  { id: 'level', label: '按等级区间' },
  { id: 'uid', label: '指定 UID 列表' },
  { id: 'returning', label: '流失回归玩家' },
]

const schedules = [
  { id: 'now', label: '立即发送' },
  { id: 'today_20', label: '今日 20:00' },
  { id: 'tomorrow_10', label: '明日 10:00' },
]

const attachments = [
  { id: 1, name: '移转之辉', count: 8888 },
  { id: 2, name: '精准探测凭证', count: 50 },
  { id: 41710, name: '纯金誓约之戒', count: 5 },
]

export default function MailPanel() {
  const [title, setTitle] = useState('【隐科组】战备物资调配')
  const [body, setBody] = useState(
    '亲爱的管理员：\n隐科组已为您调度以下补给资产，请在有效期内查收，并用于前线作战指挥。',
  )
  const [scope, setScope] = useState('all')
  const [schedule, setSchedule] = useState('now')
  const [timed, setTimed] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="邮件派发"
        description="编辑全服或定向邮件，挂载附件后投递到玩家收件箱。草稿在确认发送前不会写入任何队列。"
        actions={
          <>
            <Button size="sm" variant="secondary">
              存为草稿
            </Button>
            <Button size="sm" className="gap-1.5">
              <Send className="size-4" />
              确认发送
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Section title="邮件内容" description="标题与正文将原样展示给玩家" className="lg:col-span-3">
          <Card className="h-full p-5">
            <Card.Content className="gap-4">
              <TextField fullWidth value={title} onChange={setTitle} isRequired>
                <Label>邮件标题</Label>
                <Input placeholder="请输入邮件标题" />
                <Description>建议不超过 20 个汉字，过长会在客户端截断</Description>
              </TextField>

              <TextField fullWidth value={body} onChange={setBody}>
                <Label>正文</Label>
                <TextArea placeholder="请输入正文内容" rows={6} />
                <Description>支持换行；不支持富文本标签</Description>
              </TextField>

              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <Select
                  fullWidth
                  selectedKey={scope}
                  onSelectionChange={(key) => setScope(String(key))}
                >
                  <Label>发送范围</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {scopes.map((option) => (
                        <ListBox.Item key={option.id} id={option.id}>
                          {option.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  fullWidth
                  isDisabled={!timed}
                  selectedKey={schedule}
                  onSelectionChange={(key) => setSchedule(String(key))}
                >
                  <Label>发送时间</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {schedules.map((option) => (
                        <ListBox.Item key={option.id} id={option.id}>
                          {option.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center gap-3.5">
                <IconBadge icon={Clock} tone={timed ? 'accent' : 'default'} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">定时发送</div>
                  <div className="mt-0.5 text-xs leading-5 text-muted">
                    关闭时点击「确认发送」立即投递
                  </div>
                </div>
                <PlainSwitch isSelected={timed} label="定时发送" onChange={setTimed} />
              </div>
            </Card.Content>
          </Card>
        </Section>

        <Section
          title="附件与预览"
          description="附件上限 10 项"
          className="lg:col-span-2"
          actions={
            <Button size="sm" variant="ghost" className="gap-1.5">
              <Paperclip className="size-4" />
              添加附件
            </Button>
          }
        >
          <div className="flex h-full flex-col gap-4">
            <Card className="p-5">
              <Card.Content className="gap-0">
                <div className="divide-y divide-separator">
                  {attachments.map((row) => (
                    <div key={row.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                      <IconBadge icon={Gift} tone="warning" size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{row.name}</div>
                        <div className="mt-0.5 font-mono text-xs text-muted">ID {row.id}</div>
                      </div>
                      <div className="w-20 shrink-0 text-end text-sm font-medium tabular-nums">
                        ×{row.count.toLocaleString('en-US')}
                      </div>
                      <Button aria-label={`移除 ${row.name}`} isIconOnly size="sm" variant="ghost">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card className="flex-1 p-5">
              <Card.Header>
                <Card.Title>客户端预览</Card.Title>
                <Card.Description>玩家收件箱中的实际呈现</Card.Description>
              </Card.Header>
              <Card.Content className="gap-0">
                <div className="rounded-2xl bg-surface-secondary p-4">
                  <div className="flex items-start gap-3">
                    <IconBadge icon={Mail} tone="accent" size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{title || '（未填写标题）'}</div>
                      <p className="mt-1.5 line-clamp-3 text-xs leading-5 whitespace-pre-line text-muted">
                        {body || '（未填写正文）'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-separator pt-3">
                    {attachments.map((row) => (
                      <Chip key={row.id} size="sm" variant="soft" color="default">
                        <Chip.Label>
                          {row.name} ×{row.count.toLocaleString('en-US')}
                        </Chip.Label>
                      </Chip>
                    ))}
                  </div>
                </div>
              </Card.Content>
              <Card.Footer className="mt-1 border-t border-separator pt-3">
                <DataList className="w-full">
                  <DataRow
                    label="覆盖玩家"
                    value={<span className="tabular-nums">12,480</span>}
                  />
                  <DataRow
                    label="发送范围"
                    value={scopes.find((s) => s.id === scope)?.label ?? '—'}
                  />
                  <DataRow
                    label="预计到达"
                    value={timed ? (schedules.find((s) => s.id === schedule)?.label ?? '—') : '立即'}
                  />
                </DataList>
              </Card.Footer>
            </Card>
          </div>
        </Section>
      </div>

      <Section
        title="发送历史"
        description="最近 30 天的派发记录与领取率"
        actions={
          <Button size="sm" variant="ghost" className="gap-1.5">
            <Users className="size-4" />
            领取明细
          </Button>
        }
      >
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="邮件发送历史" className="min-w-[680px]">
              <Table.Header>
                <Table.Column id="title" isRowHeader>
                  标题
                </Table.Column>
                <Table.Column id="scope">范围</Table.Column>
                <Table.Column id="sentAt">发送时间</Table.Column>
                <Table.Column id="claimed" className="text-end">
                  领取 / 覆盖
                </Table.Column>
                <Table.Column id="state">状态</Table.Column>
              </Table.Header>
              <Table.Body>
                {mailHistory.map((row) => (
                  <Table.Row key={row.id} id={row.id}>
                    <Table.Cell className="font-medium">{row.title}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-muted">{row.scope}</Table.Cell>
                    <Table.Cell className="font-mono text-xs whitespace-nowrap text-muted">
                      {row.sentAt}
                    </Table.Cell>
                    <Table.Cell className="text-end tabular-nums">{row.claimed}</Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={row.tone}>
                        <Chip.Label>{row.state}</Chip.Label>
                      </Chip>
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
