# Chatwoot AI 客服 Bridge 异步回写方案（Node + RabbitMQ）

> 配套文档：[ai-chatwoot-customer-service-integration.md](./ai-chatwoot-customer-service-integration.md)
>
> 本方案依据当前项目源码、Chatwoot 官方 AgentBot 工作方式和 RabbitMQ 官方可靠投递机制整理。已确认 Dify / FastGPT 一次响应通常需要约 2 分钟。

## 0. 先看结论

Chatwoot 原生支持异步 AgentBot：

```text
客户发消息
  ↓
Chatwoot 后台推送 webhook
  ↓
Bridge 把任务可靠发布到 RabbitMQ
  ↓
RabbitMQ 确认接收后，Bridge 快速返回 200
  ↓
Worker 后台调用 AI，等待约两分钟
  ↓
Worker 调用 Create New Message API
  ↓
Chatwoot 后台发送到 WhatsApp / 网页聊天等实际渠道
```

Bridge 不在 webhook 请求里等 AI，也不需要把 Chatwoot 全站 `WEBHOOK_TIMEOUT` 调到两分钟。

RabbitMQ 在这里负责保存“Chatwoot 已经交给 Bridge、但尚未处理完成”的任务。Bridge 不保存共享运行状态，也不引入额外的缓存或状态服务。

生产可靠性的核心规则：

1. **RabbitMQ publisher confirm 成功后才能向 Chatwoot 返回 200。**
2. **消息必须持久化，exchange/queue 必须 durable。**
3. **Worker 使用手动 ack，业务完成前不能确认消息。**
4. **重试消息或 DLQ 消息确认发布成功后，才能 ack 原消息。**
5. **RabbitMQ 是 at-least-once，多 Worker 下可能重复调用 AI 和重复回复，业务接受该风险。**
6. **Dify 和 FastGPT 使用同一套失败判断：HTTP 非 200 或 3 分钟内未取得完整响应即失败，正常重试链路最多调用 3 次。**

---

## 1. Chatwoot 哪些地方已经异步

### 1.1 客户消息不会等待 AgentBot

当前项目通过：

```ruby
AgentBots::WebhookJob.perform_later(agent_bot.outgoing_url, payload)
```

把 AgentBot webhook 交给后台任务。客户发消息的原始请求不会等待 Bridge。

源码：`app/listeners/agent_bot_listener.rb:67-70`。

### 1.2 webhook 后台任务只需要等 Bridge 快速确认

Chatwoot 后台任务内部执行普通 HTTP POST，默认超时 5 秒：

```ruby
RestClient::Request.execute(..., timeout: webhook_timeout)
```

它等待的是 Bridge 的“RabbitMQ 已可靠接收”，不是 AI 答案。

源码：

- `app/jobs/webhook_job.rb:4-5`
- `lib/webhooks/trigger.rb:33-41`
- `lib/webhooks/trigger.rb:108-113`

### 1.3 AI 答案通过独立 API 延后写回

Chatwoot 官方 AgentBot 流程是：Bot 收到 webhook 后自行处理，再通过 Create New Message API 回写。

- [Chatwoot AgentBot 官方说明](https://www.chatwoot.com/hc/user-guide/articles/1677497472-how-to-use-agent-bots)
- [Create New Message API](https://developers.chatwoot.com/api-reference/messages/create-new-message)

回复不放在 webhook HTTP 响应体中。

### 1.4 Chatwoot 向实际渠道发送也是后台任务

Create New Message API 先保存消息，随后 Chatwoot 执行：

```ruby
SendReplyJob.perform_later(id)
```

再把消息发到 WhatsApp、Telegram、网页聊天等渠道。

源码：

- `app/controllers/api/v1/accounts/conversations/messages_controller.rb:8-13`
- `app/models/message.rb:390-393`
- `app/jobs/send_reply_job.rb`

---

## 2. 目标和责任边界

### 2.1 必须做到

1. webhook 正常情况下 1 秒内确认，最长不超过 3 秒；
2. AI 等两分钟不占用 Chatwoot webhook 连接；
3. RabbitMQ 接管的消息在 Worker 崩溃后能够重新投递；
4. 人工中途接管后尽量不发送迟到 AI 答案；
5. AI 最终失败、队列等待过久时主动转人工；
6. Producer、Worker 可以独立扩容；
7. RabbitMQ 或 Chatwoot 不可用时有明确兜底。

### 2.2 不需要做

- 不需要把 `WEBHOOK_TIMEOUT` 调到 120～180 秒；
- 不需要让 nginx 保持两分钟 webhook 连接；
- 不需要用 webhook 响应体承载 AI 答案；
- 不需要让 Bridge 负责 WhatsApp 等渠道的最终发送；
- 不需要把 `ai_handoff` 自定义属性作为人工归属真相；
- 不需要保存消息处理状态、会话待处理顺序或会话锁；
- 不需要保存 Dify / FastGPT conversation ID；
- 不需要实现消息去重或业务 exactly-once；
- 接受多 Worker、连接中断、进程重启或重试切换造成的偶发重复 AI 调用和重复回复；
- 不保证同一会话的多条消息严格按发送顺序完成。

### 2.3 会话归属以 Chatwoot 状态为准

复用 Chatwoot AgentBot 状态语义：

```text
pending → AgentBot 处理
open    → 人工客服处理
```

Worker 只在以下条件同时满足时发送 AI 回复：

```text
status == pending
assignee_type != User
assignee_agent_bot_id 为空，或等于当前 AgentBot
```

`assignee_agent_bot_id` 为空是收件箱默认 AgentBot 的正常状态，不能因此丢弃消息。Bridge endpoint 与 `CHATWOOT_AGENT_BOT_ID` 一一对应，并通过该 AgentBot 的独立 HMAC secret 验证 webhook；如果会话已经明确指派给其他 AgentBot，当前 Worker 直接 ack，不调用 AI。

一套 work/retry/DLQ 队列只服务一个 AgentBot。部署多个 AgentBot 时必须使用不同队列名、routing key 或独立 vhost，Worker 收到 `agentBotId` 与自身配置不一致的任务时进入 DLQ，不能使用错误 Bot 身份回复。

人工把 `open` 改回 `pending`，表示重新交给 Bot，不再额外维护一套容易冲突的 `ai_handoff` 真相。

---

## 3. 总体架构

```mermaid
flowchart LR
  C[客户] --> CW[Chatwoot]
  CW -->|后台 webhook| N[nginx / 内网入口]
  N --> P1[Producer 1]
  N --> P2[Producer 2]
  P1 -->|publisher confirm| RMQ[(RabbitMQ)]
  P2 -->|publisher confirm| RMQ
  RMQ --> W1[Worker 1]
  RMQ --> W2[Worker 2]
  W1 --> AI[Dify / FastGPT]
  W2 --> AI
  W1 -->|Create New Message / 转人工| CW
  W2 -->|Create New Message / 转人工| CW
  CW -->|SendReplyJob| CH[WhatsApp / Web / 其他渠道]
```

### 3.1 Producer

只负责：

- 校验 AgentBot webhook；
- 过滤非客户公开入站消息；
- 把持久消息发布到 RabbitMQ；
- 等待 publisher confirm；
- 快速返回 HTTP 结果。

Producer 不调用 AI。

### 3.2 RabbitMQ

负责：

- 持久保存待处理任务；
- 把任务分发给 Worker；
- 保存未 ack 的在途消息；
- Worker 断线后重新投递；
- 通过 TTL + Dead Letter Exchange 实现延迟重试；
- 保存最终失败的 DLQ 消息。

### 3.3 Worker

负责：

- 手动消费和 ack；
- 检查会话仍归 Bot；
- 从 Chatwoot 获取本次调用需要的最近消息上下文；
- 调用 Dify / FastGPT；
- 重试、熔断和并发限制；
- 回写 Chatwoot；
- 最终失败时主动转人工。

### 3.4 无共享状态设计

Producer 和 Worker 都不维护跨进程共享状态：

- Producer 以 RabbitMQ publisher confirm 作为唯一接收成功依据；
- Worker 的处理进度由 RabbitMQ delivery、ack、retry queue 和 DLQ 表达；
- 会话是否仍归 Bot，以 Chatwoot 实时数据为准；
- Provider 每次请求均为无状态调用，需要的上下文从 Chatwoot 最近消息构造；
- 运行情况通过 RabbitMQ 指标、结构化日志和 DLQ 观察，不设置额外巡检状态。

---

## 4. RabbitMQ 队列拓扑

### 4.1 拓扑图

```mermaid
flowchart LR
  P[Producer] -->|persistent + confirm| EX[cw.ai.exchange]
  EX --> WQ[[cw.ai.work<br/>quorum queue]]
  WQ --> WK[Worker]
  WK -->|首次调用失败| R5[[cw.ai.retry.5s<br/>quorum queue]]
  WK -->|第 2 次调用失败| R30[[cw.ai.retry.30s<br/>quorum queue]]
  R5 -->|TTL 到期 / DLX| EX
  R30 -->|TTL 到期 / DLX| EX
  WK -->|最终失败| DLX[cw.ai.dlx]
  DLX --> DLQ[[cw.ai.dlq<br/>quorum queue]]
```

### 4.2 建议实体

| 类型 | 名称 | 用途 |
|---|---|---|
| direct exchange | `cw.ai.exchange` | 正常工作任务入口 |
| quorum queue | `cw.ai.work` | 待处理和处理中任务 |
| direct exchange | `cw.ai.retry` | 重试入口 |
| quorum retry queue | `cw.ai.retry.5s` | 5 秒后重新进入工作队列 |
| quorum retry queue | `cw.ai.retry.30s` | 30 秒后重新进入工作队列 |
| direct exchange | `cw.ai.dlx` | 最终失败入口 |
| quorum queue | `cw.ai.dlq` | 保存最终失败任务 |

Dify 和 FastGPT 均固定最多调用 3 次：首次调用失败后进入 `cw.ai.retry.5s`，第 2 次调用失败后进入 `cw.ai.retry.30s`，第 3 次调用失败后不再重试，转人工并进入 DLQ。

### 4.3 为什么使用 TTL + DLX

本方案不依赖 RabbitMQ delayed-message 插件，使用内置能力：

```text
失败消息发布到固定 retry queue
  ↓
retry queue 的 message TTL 到期
  ↓
Dead Letter Exchange 把消息送回 work exchange
```

使用固定延迟队列，避免同一个队列中不同 per-message TTL 造成队头阻塞。

不要对失败消息直接执行 `nack(requeue=true)` 形成热循环，否则同一条失败消息会立刻反复占用 Worker。

### 4.4 DLX 默认不是可靠转发，必须显式加固

RabbitMQ 默认的 dead-letter 转发属于 **at-most-once**：源队列删除消息后，内部重新发布到 DLX 的过程默认不等待 publisher confirm。目标 exchange、queue 或集群节点异常时，死信存在丢失风险。

本方案的重试链路不能依赖默认设置。所有会触发 dead-letter 的源队列均使用 quorum queue，并通过 policy 开启 at-least-once dead-lettering：

| 队列 | 必要策略 |
|---|---|
| `cw.ai.work` | `dead-letter-exchange=cw.ai.dlx`、`dead-letter-routing-key=dlq`、`dead-letter-strategy=at-least-once`、`overflow=reject-publish`、`delivery-limit=10` |
| `cw.ai.retry.5s` | `message-ttl=5000`、`dead-letter-exchange=cw.ai.exchange`、`dead-letter-routing-key=work`、`dead-letter-strategy=at-least-once`、`overflow=reject-publish` |
| `cw.ai.retry.30s` | `message-ttl=30000`，其余同上 |

这里有两套互补机制：

- Worker 主动重试时，先把新消息发布到 retry queue，等 publisher confirm 成功后才 ack 原消息；
- Worker 在处理期间反复崩溃、消息达到 `delivery-limit` 时，由 `cw.ai.work` 将毒消息可靠地转入 DLQ。

`at-least-once` 会用额外内存和磁盘换取可靠性，因此还要限制队列长度并监控 dead-letter backlog。目标 exchange/queue 必须提前创建且保持可用，否则源 quorum queue 会保留待转发死信并持续重试。可变参数优先通过 RabbitMQ policy 配置，不要硬编码成无法在线调整的 `x-arguments`。

如果当前 RabbitMQ 版本或部署方式不能启用 at-least-once dead-lettering，就不要把关键重试建立在 TTL + DLX 上，应改为专门的重试调度消费者，并由应用使用 publisher confirm 重新发布。

- [RabbitMQ Quorum Queue 的 at-least-once dead-lettering](https://www.rabbitmq.com/docs/quorum-queues#dead-lettering)
- [RabbitMQ Dead Letter Exchanges](https://www.rabbitmq.com/docs/dlx)

### 4.5 durable、persistent、confirm 缺一不可

```text
exchange durable=true
queue durable=true
message persistent=true / deliveryMode=2
publisher confirm=true
```

durable queue 只能保证队列定义在 Broker 重启后存在；persistent 消息表示消息需要落盘；publisher confirm 表示 Broker 已经接管发布结果。三者共同构成 Producer 向 Chatwoot 返回 200 的基础。

RabbitMQ 官方说明：持久消息进入 durable queue 后，publisher confirm 会在 Broker 持久化后返回；quorum queue 则在法定数量副本接受消息后确认。

- [RabbitMQ Publisher Confirms 与 Consumer Acknowledgements](https://www.rabbitmq.com/docs/confirms)
- [RabbitMQ Quorum Queues](https://www.rabbitmq.com/docs/quorum-queues)

---

## 5. Producer 接收流程

### 5.1 正常流程

```mermaid
flowchart TD
  A[收到 AgentBot webhook] --> B[读取原始 body + 验证]
  B --> C{客户公开入站消息?}
  C -- 否 --> D[200 ignored]
  C -- 是 --> E{必填字段完整?}
  E -- 否 --> F[422]
  E -- 是 --> I[发布 persistent 消息]
  I --> J{mandatory 路由成功<br/>且 publisher confirm?}
  J -- 是 --> L[200 queued]
  J -- 否/超时 --> N[503]
  N --> O[Chatwoot 原生失败转人工]
```

Producer 总预算建议 3 秒，小于 Chatwoot 默认 5 秒。

### 5.2 HTTP 返回值

| 返回 | 使用场景 | 含义 |
|---|---|---|
| `200 queued` | RabbitMQ mandatory 路由成功且 publisher confirm 成功 | 后续责任转给 Worker |
| `200 ignored` | 明确不是客户公开入站消息 | 正常忽略 |
| `401/403` | 鉴权失败 | 不接受请求 |
| `422` | 客户消息缺少必要字段 | 不能假装成功 |
| `503` | RabbitMQ、confirm channel 不可用或发布超时 | Chatwoot 原生失败转人工 |

禁止先返回 200，再在后台发布 RabbitMQ。

### 5.3 消息属性

```text
messageId   = cw_ai_{accountId}_{messageId}
contentType = application/json
type        = chatwoot.ai.request
timestamp   = 当前 Unix 时间
persistent  = true
mandatory   = true
headers:
  x-attempt = 1
  x-created-at = 原消息创建时间
```

`mandatory=true` 用于发现 exchange 没有绑定到任何 queue 的配置错误。Publisher 必须同时处理 `basic.return`、confirm ack、confirm nack 和 confirm 超时。

### 5.4 Publisher connection

- 使用长期 AMQP connection，不要每个 webhook 新建连接；
- Producer 使用独立 confirm channel；
- 自动重连后重新声明或验证 topology；
- connection/channel 未 ready 时 `/health/ready` 返回 503；
- publish confirm 超过预算时不能返回 200；
- confirm 状态不明时允许后续出现重复发布，通过 RabbitMQ `messageId` 和日志追踪，业务接受可能产生重复处理。

---

## 6. Publisher confirm 边界和半成功

Producer 不写其他状态存储，因此不存在 RabbitMQ 与共享状态之间的双写。仍需正确处理“Broker 已接收，但 HTTP 结果不确定”的半成功边界。

### 6.1 唯一接收成功依据

```text
mandatory 路由成功 + publisher confirm ack → 返回 200 queued
basic.return / confirm nack / confirm 超时 → 返回 503
```

Producer 本身无状态。进程重启后无需恢复任何业务状态，只需恢复 AMQP connection、confirm channel 和 topology readiness。

### 6.2 异常处理

| 异常 | 处理 |
|---|---|
| Producer 在 publish 前崩溃 | 请求失败；Chatwoot 按原生逻辑转人工 |
| RabbitMQ 发布明确失败 | 返回 503；Chatwoot 按原生逻辑转人工 |
| RabbitMQ 已接收，但 confirm 在网络中丢失 | Producer 返回 503；消息可能仍被消费，Worker 发送前发现会话已 open 并丢弃 |
| 两边成功但 HTTP 200 返回前崩溃 | Chatwoot 转人工；Worker 二次状态检查阻止迟到回复 |
| Producer 重发导致 RabbitMQ 重复消息 | 每个 delivery 独立处理；通过 `messageId` 追踪，接受重复 AI 调用和重复回复 |

不再运行状态巡检器。未完成任务直接表现为 RabbitMQ ready/unacked、retry 或 DLQ 消息，并通过队列指标和日志处理。

---

## 7. Worker 消费和手动 ack

### 7.1 主流程

```mermaid
flowchart TD
  A[RabbitMQ delivery] --> B{消息格式有效?}
  B -- 否 --> DLQ[确认发布 DLQ 后 ack 原消息]
  B -- 是 --> D{超过最大排队时间?}
  D -- 是 --> HO[主动转人工]
  D -- 否 --> G{会话仍归 Bot?}
  G -- 否 --> ACK[ack 原消息]
  G -- 是 --> CTX[读取 Chatwoot 最近消息上下文]
  CTX --> AI[无状态调用 Dify / FastGPT]
  AI -- 失败且调用次数少于 3 次 --> RETRY2[确认发布 retry queue 后 ack 原消息]
  AI -- 第 3 次调用失败 --> HO
  AI -- 成功 --> CHECK{发送前再次检查归属}
  CHECK -- 已人工接管 --> ACK
  CHECK -- 仍归 Bot --> WRITE[写入 Chatwoot 回复]
  WRITE --> SUCCESS[创建接口明确成功后 ack]
  HO --> FAIL[open 会话 + 失败记录 + 确认发布 DLQ + ack]
```

### 7.2 ack 规则

使用 `noAck=false`。只有以下情况才能 ack 原消息：

- Chatwoot 回复创建接口已经明确成功；
- 会话已经由人工接管，AI 无需再处理；
- 主动转人工成功，失败记录和 DLQ 已可靠发布；
- 重试消息已经收到 RabbitMQ publisher confirm。

如果发布 retry/DLQ 失败：

- 不 ack 原消息；
- 必要时关闭 consumer channel；
- RabbitMQ 会把未 ack 消息重新入队并再次投递。

### 7.3 不使用自动 ack

自动 ack 会在消息刚送到 Node 时就让 RabbitMQ 删除它。AI 处理两分钟期间如果 Worker 崩溃，任务将无法恢复。

RabbitMQ 官方建议可靠消费者优先使用手动确认，并通过 prefetch 限制未确认消息数量：

- [RabbitMQ Queues 与 Consumer Acknowledgements](https://www.rabbitmq.com/docs/queues)
- [RabbitMQ Reliability Guide](https://www.rabbitmq.com/docs/reliability)

### 7.4 prefetch 和并发

```text
RABBITMQ_PREFETCH=10
WORKER_CONCURRENCY=10
```

prefetch 限制一个 Worker channel 同时持有的未 ack 消息数，形成背压。值为 0 表示无限制，禁止使用。

Worker 的实际并发不能超过 Dify/FastGPT 容量。先从 10 起步，压测后调整。

### 7.5 Worker 崩溃

Worker 进程、connection 或 channel 关闭时，RabbitMQ 会重新投递未 ack 消息。重新投递可能造成重复执行，所以消费者必须检查：

- `redelivered` 标记；
- 会话是否已经 open。

RabbitMQ 提供 at-least-once，不提供业务 exactly-once。原 Worker 的 AI 请求或 Chatwoot 请求可能仍在执行，新 Worker 也可能同时处理重新投递的消息，因此允许出现重复调用和重复回复。

---

## 8. 无共享状态的处理边界

RabbitMQ 单队列通常按发布顺序投递，但多 Worker、重试和重投递都可能改变完成顺序。本方案接受这一业务边界，不为同一会话维护待处理顺序，也不使用会话锁。

### 8.1 会话上下文

每条任务独立处理。Worker 调用 Provider 前，从 Chatwoot 查询当前会话最近消息，并只取截至本条客户消息的必要上下文构造请求。

这样不需要保存 Provider conversation ID，Chatwoot 仍是唯一会话记录来源。代价是每次会重复传入部分上下文，并且同一会话的多条任务可能并行完成。

### 8.2 重复投递边界

重复 webhook 或 RabbitMQ redelivery 可能导致同一个客户消息再次进入 Worker。本方案不查询历史处理结果，也不对消息做业务去重，每个 delivery 都按独立任务处理。

多 Worker 下，RabbitMQ connection/channel 中断、Worker 重启、重试消息已发布但原消息尚未 ack 等情况，都可能让两个 Worker 同时处理同一客户消息。由此产生的重复 AI 调用、重复模型费用和重复回复属于已接受的业务风险。

RabbitMQ `messageId` 仅用于日志、指标和 DLQ 定位，不能阻止重复处理。

### 8.3 异常任务

- Worker 崩溃：未 ack delivery 由 RabbitMQ 重新投递；
- 临时失败：确认发布到 retry queue 后 ack 原 delivery；
- 最终失败：主动转人工，确认发布到 DLQ 后 ack 原 delivery；
- 排队超过业务时限：按 `MAX_QUEUE_WAIT_MS` 主动转人工；
- 运维定位：查看 ready/unacked、retry、DLQ、结构化日志和 Chatwoot 会话，不维护额外巡检状态。

---

## 9. AI 超时、重试和熔断

### 9.1 时间预算

```text
Producer webhook 总预算：3 秒
RabbitMQ publish confirm：最多 2 秒且包含在 Producer 预算内
AI 单次调用：180 秒
整个 Worker job：630 秒
Chatwoot API 单次调用：8 秒
最大队列等待：300 秒
```

AI 的两分钟发生在 Worker，不占用 Chatwoot webhook。

3 次 AI 调用最多占用 540 秒，两次重试延迟合计 35 秒；`JOB_DEADLINE_MS=630000` 为上下文读取、队列调度和结果处理预留了额外时间。

RabbitMQ 的 consumer acknowledgement timeout 必须大于 Worker job 总预算和停机等待时间。默认值通常足够，但上线时必须显式核对，不能让 Broker 在 AI 尚未完成时关闭 consumer channel。

### 9.2 统一失败判断和重试规则

Dify 和 FastGPT 使用完全相同的失败判断及重试规则。一次 AI 调用只有同时满足以下条件才算成功：

1. AI 平台返回 HTTP 200；
2. 从发起调用开始 3 分钟内取得完整响应。

出现以下任一情况，本次调用即视为失败：

- AI 平台返回 HTTP 非 200 状态码；
- 单次调用在 3 分钟内未取得完整响应，包括响应流未正常结束。

首次调用失败后，系统自动重试，最多总共调用 3 次。也就是最多自动重试 2 次；第 3 次调用仍失败时，不再调用 AI，主动转人工并将任务发布到 DLQ。每次调用均独立执行 3 分钟超时判断，不因 Dify、FastGPT 或 HTTP 状态码不同而改变重试次数。

这里的 3 次是正常业务重试链路的上限。RabbitMQ at-least-once 重投递或 Worker 在调用后、ack 前崩溃仍可能造成重复调用，该已知边界见 8.2 节。

其他操作的重试策略如下：

| 操作 | 策略 |
|---|---|
| Chatwoot 切换 open | 有限重试 |
| 创建 Chatwoot 回复 | 接口结果不明确时进入有限重试；可能造成重复回复，业务接受 |
| RabbitMQ retry/DLQ publish | 必须等 publisher confirm；失败则不 ack 原消息 |

### 9.3 熔断

```text
CLOSED：正常调用
  ↓ 短时间大量失败
OPEN：不调用 AI，新任务快速转人工
  ↓ 冷却
HALF_OPEN：少量探测
  ↓
成功恢复，失败继续 OPEN
```

熔断后不要把消息长期留在 work queue；按业务规则主动转人工。

熔断器只维护 Worker 进程内状态，各实例独立判断；进程重启后重新进入 `CLOSED`，不保存共享熔断状态。

---

## 10. 重复处理的接受边界

### 10.1 为什么可能重复

RabbitMQ confirm 或 consumer ack 可能在网络中丢失：

```text
Worker 调用 Create New Message
  ↓
Chatwoot 已保存
  ↓
响应丢失或 Worker 随后崩溃
  ↓
RabbitMQ 重新投递原消息
```

直接再次创建就会产生重复回复。

### 10.2 处理规则

1. Bridge 不保存已处理消息状态；
2. Worker 不在创建回复前查询历史处理结果；
3. Chatwoot 创建回复接口明确成功后 ack；
4. API 结果不明确时按有限重试策略处理；
5. 重复 delivery 仍会再次调用 AI 和创建回复；
6. 使用 RabbitMQ `messageId`、`redelivered` 和结构化日志定位重复处理。

本方案不承诺业务 exactly-once，也不承诺一条客户消息只产生一条 Bot 回复。

### 10.3 使用 AgentBot access token

Bridge 调用 Create New Message 和切换状态时使用 AgentBot 自己的 access token，不借用人工管理员 token。这样 outgoing message 才正确标记为 AgentBot，报表和事件过滤才能保持一致。

### 10.4 渠道发送

Create New Message 成功表示消息已经写入 Chatwoot；实际渠道发送由 `SendReplyJob` 负责。Bridge 观察 `sent/delivered/failed`，不重复实现渠道发送。

---

## 11. 转人工和失败责任

### 11.1 发布前失败

RabbitMQ 不可用、消息无法路由或 publisher confirm 超时：

```text
Producer 返回 503
  ↓
Chatwoot webhook 失败处理
  ↓
pending 会话变为 open
  ↓
记录 AgentBot 失败 activity
```

保持：

```text
keep_pending_on_bot_failure=false
```

### 11.2 RabbitMQ 已确认后的失败

Producer 已返回 200 后，Worker 必须主动：

1. 将失败消息发布到 DLQ 并等待 confirm；
2. 把会话切换为 `open`；
3. 创建内部失败备注或 activity；
4. ack 原 delivery；
5. 告警；同会话后续任务处理时发现会话已 `open`，直接 ack，不再调用 AI。

DLQ 放在状态变更前，是为了避免“会话已经 open，但 DLQ 发布失败”的不可追查窗口。Worker 在 DLQ confirm 后、转人工完成前崩溃时，可能产生重复 DLQ 记录或重复失败说明，属于本方案接受的重复边界。

### 11.3 AI 主动转人工

AI 返回 `[HUMAN_HANDOFF_REQUIRED]` 时：

1. 去掉标记；
2. 可发送正常转人工说明；
3. 把会话切换为 `open`；
4. ack 当前 delivery；
5. 同会话后续任务通过实时会话归属检查自然终止。

### 11.4 排队过久

任务等待超过 `MAX_QUEUE_WAIT_MS` 时主动转人工。无限排队技术上没丢消息，但业务上已经失败。

---

## 12. Provider 无状态调用

### 12.1 上下文来源

Chatwoot 是唯一会话记录来源。Worker 收到任务后按 `accountId`、`conversationId` 查询最近消息，筛选截至当前 `messageId` 的客户消息和 Bot 回复，并按模型上下文上限截断后构造 Provider 请求。

不把上下文写入 Chatwoot `custom_attributes`，避免整份 JSON 替换时覆盖人工或其他集成字段。

### 12.2 不保存 Provider 会话标识

Provider adapter 使用无状态或新会话调用方式，不保存或复用 Dify / FastGPT 返回的 conversation ID。若某个 Provider 接口要求请求级标识，使用当前 RabbitMQ `messageId` 作为调用关联字段，不把它作为跨消息会话状态。

这意味着每条任务都需要重新传入必要上下文，换取 Bridge 无共享状态、实例可直接横向扩容和进程重启无需恢复会话映射。

### 12.3 Provider 故障

- HTTP 非 200，或 3 分钟内未取得完整响应：本次调用失败；
- 第 1、2 次调用失败：确认发布到对应 retry queue 后 ack 原 delivery；
- 第 3 次调用失败：主动转人工并进入 DLQ；
- Worker 进程崩溃：原 delivery 未 ack，由 RabbitMQ 重新投递；
- 不存在需要恢复或修复的 Provider 会话映射。

---

## 13. AgentBot webhook 鉴权

Chatwoot 官方文档描述 `X-Chatwoot-Signature`、`X-Chatwoot-Timestamp` 和 `X-Chatwoot-Delivery`：

- [Chatwoot Webhook 验证说明](https://www.chatwoot.com/hc/user-guide/articles/1677693021-how-to-use-webhooks)

当前项目已经实现 AgentBot HMAC：

- `app/listeners/agent_bot_listener.rb` 把 `bot_config['webhook_secret']` 和随机 delivery ID 传给 WebhookJob；
- `lib/webhooks/trigger.rb` 自动生成 `X-Chatwoot-Signature`、`X-Chatwoot-Timestamp` 和 `X-Chatwoot-Delivery`；
- Producer 必须基于原始 body 验证 HMAC，并校验 timestamp 防重放；
- delivery ID 和 RabbitMQ `messageId` 用于链路追踪和 DLQ 定位。

每个 AgentBot 使用独立 secret，生产必须配置 `CHATWOOT_WEBHOOK_SECRET`，不能在 secret 为空时放行未鉴权请求。`BRIDGE_SHARED_SECRET` 只保留给能显式发送 `X-Bridge-Secret` 的受控兼容客户端，正常 Chatwoot AgentBot 不使用它。

---

## 14. RabbitMQ 部署

### 14.1 单节点起步

当前规模可以先部署一个持久化 RabbitMQ 节点：

```yaml
rabbitmq:
  image: rabbitmq:4-management
  hostname: rabbitmq
  restart: always
  environment:
    RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
    RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    RABBITMQ_DEFAULT_VHOST: chatwoot_ai
  volumes:
    - rabbitmq_data:/var/lib/rabbitmq
  healthcheck:
    test: ['CMD', 'rabbitmq-diagnostics', '-q', 'ping']
    interval: 10s
    timeout: 5s
    retries: 5
  ports:
    - '127.0.0.1:15672:15672'
  deploy:
    resources:
      limits:
        memory: 1G
        cpus: '2'

volumes:
  rabbitmq_data:
```

AMQP 5672 只供 Compose 内部服务访问，不暴露宿主机。管理端口 15672 也应限制在本机或管理网络。

生产应固定经过验证的 RabbitMQ 版本或镜像 digest，不长期使用浮动 tag。

### 14.2 单节点的保障边界

单节点 + durable queue + persistent message + publisher confirm 可以抵抗：

- Producer/Worker 重启；
- RabbitMQ 容器正常重启；
- Worker 处理中崩溃；
- 普通网络断开和重连。

它不能抵抗 RabbitMQ 主机或数据盘永久损坏。需要 Broker 高可用时使用 3 节点 RabbitMQ 集群和 3 副本 quorum queue，或托管 RabbitMQ。

RabbitMQ 官方建议生产使用持久存储，并指出 3 节点集群可以容忍一个节点不可用：

- [RabbitMQ Production Deployment Guidelines](https://www.rabbitmq.com/docs/production-checklist)

### 14.3 存储和资源

- RabbitMQ 数据目录必须使用可靠持久化磁盘；
- 监控剩余磁盘和 disk alarm；
- 不与数据库共用同一个数据目录；
- 给操作系统和文件缓存保留内存；
- RabbitMQ 生产不建议只分配 1 个 CPU；
- 队列只保存 ID 和最小上下文，避免大附件进入 RabbitMQ；
- 配置消息最大年龄、队列长度和磁盘告警。

### 14.4 vhost 和权限

使用独立 vhost `chatwoot_ai` 和独立用户，不使用默认 guest 账号。

最小权限：

- Producer：写 work exchange，读取 publisher return/confirm；
- Worker：读 work queue，写 retry exchange 和 DLX；
- topology bootstrap：单独拥有 configure 权限；
- 生产可由初始化脚本声明 topology，业务账号不必拥有所有 configure 权限。

跨主机访问 RabbitMQ 时启用 TLS。

---

## 15. nginx、健康检查和停机

### 15.1 nginx

```nginx
upstream bridge_producer {
  server 127.0.0.1:8788 max_fails=3 fail_timeout=10s;
  server 127.0.0.1:8789 max_fails=3 fail_timeout=10s;
  keepalive 32;
}

location /chatwoot/agent-bot {
  proxy_pass http://bridge_producer;
  proxy_connect_timeout 1s;
  proxy_read_timeout 4s;
  proxy_next_upstream off;
}
```

Producer 快速 publish + confirm，不需要两分钟超时。`proxy_next_upstream off` 避免 nginx 在发布结果不明时自动换实例重发；RabbitMQ 或 Worker 层仍可能重复处理，业务接受该风险。

### 15.2 健康检查

Producer：

```text
/health/live  → Node 活着
/health/ready → RabbitMQ connection/confirm channel ready + 未停机
```

Worker：

```text
live  → Node 和事件循环正常
ready → RabbitMQ consumer 已注册
```

AI provider 熔断不等于 Worker 进程死亡，应暴露熔断指标而不是不断重启 Worker。

### 15.3 Producer 停机

1. readiness 变 503；
2. 停止接收 webhook；
3. 等待 outstanding publisher confirms；
4. 未确认发布返回 503；
5. 关闭 confirm channel 和 connection。

### 15.4 Worker 停机

1. `basic.cancel` 停止领取新消息；
2. 等当前 delivery 在 grace period 内完成；
3. 成功则正常 ack；
4. 超时则中断 AI 并关闭 consumer channel；
5. 未 ack 消息由 RabbitMQ 重新投递。

---

## 16. 容量估算

AI 平均响应 120 秒：

```text
所需 AI 并发 ≈ 目标 RPS × 120
```

| 目标吞吐 | 理论 AI 并发需求 |
|---:|---:|
| 每分钟 30 条（0.5 RPS） | 约 60 |
| 每分钟 60 条（1 RPS） | 约 120 |
| 5 RPS | 约 600 |
| 10 RPS | 约 1200 |

如果 provider 只允许 100 并发：

```text
理论吞吐 ≈ 100 ÷ 120 ≈ 0.83 RPS
```

增加 RabbitMQ 或 Worker 数量不能突破 provider 上限，只会增加 ready 消息积压。

RabbitMQ 在这个场景通常不是瓶颈，真正瓶颈是 AI 并发和平均响应时间。

---

## 17. 用户等待体验

两分钟对客户较长，可异步发送一次确认消息：

```text
“已收到你的问题，正在查询，请稍候。”
```

- 超过最大队列等待时间主动转人工；
- 确认消息不能延长 webhook 响应。

由于 Bridge 不保存短期状态，本方案不做确认消息去重、跨消息冷却或连续短句聚合。启用确认消息时，也接受偶发重复发送；不能接受时应关闭该功能。

---

## 18. 日志、指标和告警

### 18.1 全链路字段

```text
reqId
rabbitMessageId
accountId
conversationId
messageId
provider
attempt
redelivered
result
duration
workerId
queue
errorStage
errorType
errorMessage
```

### 18.2 RabbitMQ 指标

| 指标 | 作用 |
|---|---|
| work queue messages_ready | 等待处理数量 |
| messages_unacknowledged | Worker 在途数量 |
| 最老消息年龄 | 客户真实等待时间 |
| publisher confirm latency/nack/timeout | Producer 接收可靠性 |
| basic.return 数量 | exchange/queue 绑定错误 |
| redelivered 数量 | Worker 崩溃或 ack 丢失 |
| retry queue 数量 | 临时失败量 |
| DLQ 数量 | 最终失败量 |
| consumer 数量/capacity | Worker 是否在线、是否饱和 |
| memory/disk alarm | Broker 是否停止接收消息 |

### 18.3 业务指标

- webhook queued/ignored/503；
- AI P50/P95/P99；
- AI 429、超时、熔断；
- RabbitMQ redelivered 和疑似重复回复数量；
- 主动转人工数量。

立即告警：

- RabbitMQ connection/channel 不可用；
- publisher confirm 超时或 nack；
- work queue 最老消息超过阈值；
- consumer 数量为 0；
- DLQ 出现新消息；
- RabbitMQ memory/disk alarm；
- Chatwoot API 连续失败。

### 18.4 Worker 消费异常日志

Worker 捕获消费异常后，必须打印结构化 `error` 日志，并将异常日志写入持久化位置。以下异常都必须记录：

- consumer 未捕获异常或进程异常退出；
- consumer channel `error`、意外 `close` 或 `basic.cancel`；
- `ack`/`nack` 执行失败或出现 unknown delivery tag；
- retry/DLQ 发布或 publisher confirm 失败；
- 消息格式或必填字段不合法。

日志至少包含 `rabbitMessageId`、`messageId`、`conversationId`、`workerId`、队列名、`attempt`、`redelivered`、失败阶段、异常类型、异常消息和堆栈。默认输出到 Worker 的 `stderr/stdout`，同时写入 `logs/worker-error.log`；生产环境必须将该目录挂载到持久化 volume 或接入现有日志存储，避免容器重启后丢失。

查看异常时，先在 `logs/worker-error.log` 按 `rabbitMessageId` 或 `messageId` 查询，再结合 RabbitMQ Management UI 查看对应队列、unacked、redelivered 和 DLQ 状态。若已有日志平台，可将该文件采集进去，但不额外要求部署独立告警平台。

---

## 19. 推荐环境变量

```text
# RabbitMQ：密码单独传递，避免 URL 编码问题
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_VHOST=chatwoot_ai
RABBITMQ_USER=chatwoot_bridge
RABBITMQ_PASSWORD=change-me
RABBITMQ_EXCHANGE=cw.ai.exchange
RABBITMQ_WORK_QUEUE=cw.ai.work
RABBITMQ_WORK_ROUTING_KEY=work
RABBITMQ_RETRY_EXCHANGE=cw.ai.retry
RABBITMQ_RETRY_QUEUE_5S=cw.ai.retry.5s
RABBITMQ_RETRY_QUEUE_30S=cw.ai.retry.30s
RABBITMQ_RETRY_ROUTING_KEY_5S=retry.5s
RABBITMQ_RETRY_ROUTING_KEY_30S=retry.30s
RABBITMQ_DLX=cw.ai.dlx
RABBITMQ_DLQ=cw.ai.dlq
RABBITMQ_DLQ_ROUTING_KEY=dlq
RABBITMQ_DEAD_LETTER_STRATEGY=at-least-once
RABBITMQ_QUEUE_OVERFLOW=reject-publish
RABBITMQ_DELIVERY_LIMIT=10
RABBITMQ_PUBLISH_CONFIRM_MS=2000
RABBITMQ_PREFETCH=10

# Producer：小于 Chatwoot 默认 5 秒
PRODUCER_DEADLINE_MS=3000
BODY_LIMIT_BYTES=1048576
CHATWOOT_WEBHOOK_SECRET=AgentBot独立secret
WEBHOOK_SIGNATURE_TOLERANCE_SEC=300

# Worker / AI
AI_ATTEMPT_TIMEOUT_MS=180000
AI_MAX_ATTEMPTS=3
JOB_DEADLINE_MS=630000
WORKER_CONCURRENCY=10
MAX_QUEUE_WAIT_MS=300000

# Chatwoot API
CHATWOOT_BASE_URL=http://rails:3000
CHATWOOT_API_ACCESS_TOKEN=AgentBot自己的token
CHATWOOT_AGENT_BOT_ID=1
CW_TIMEOUT_MS=8000
CW_STATE_MAX_ATTEMPTS=3
CW_MESSAGE_CREATE_MAX_ATTEMPTS=1
CONTEXT_MESSAGE_LIMIT=20
CONTEXT_MAX_CHARS=12000

# Provider
AI_PROVIDER=dify
DIFY_BASE_URL=https://api.dify.ai
DIFY_API_KEY=change-me
# 或 FASTGPT_BASE_URL / FASTGPT_API_KEY / FASTGPT_APP_ID

# 熔断
CB_WINDOW_MS=30000
CB_FAILURE_THRESHOLD=0.5
CB_MIN_SAMPLES=20
CB_COOLDOWN_MS=30000

# 运行
PRODUCER_SHUTDOWN_MS=5000
WORKER_SHUTDOWN_MS=180000
METRICS_ENABLED=true
LOG_LEVEL=info
WORKER_ERROR_LOG_PATH=logs/worker-error.log
```

`RABBITMQ_PREFETCH` 和 `WORKER_CONCURRENCY` 从 10 起步，根据 provider 并发、RabbitMQ unacked、AI P95/P99 和最老消息年龄调整。

---

## 20. 分阶段落地

### 阶段 A：RabbitMQ 基础链路

| 步骤 | 改动 | 验证 |
|---|---|---|
| 1 | 部署单节点 RabbitMQ、持久 volume、管理 UI | 容器重启后 durable queue 仍存在 |
| 2 | 声明 exchange、work/retry/DLQ quorum queue，并应用 at-least-once DLX policy | routing、TTL、DLX 和 delivery-limit 正常 |
| 3 | Producer persistent publish + mandatory + confirm | 未路由、nack、超时均返回 503 |
| 4 | Worker manual ack；验证阶段先用 prefetch=1，生产从 10 起步 | Worker 崩溃后消息重新投递 |

### 阶段 B：业务可靠性

| 步骤 | 改动 | 验证 |
|---|---|---|
| 1 | Worker 从 Chatwoot 读取最近消息，无状态调用 AI 并回写 | webhook 小于 1 秒，AI 两分钟后回复 |
| 2 | 会话归属前后双检查 | 人工中途接管后的迟到答案通常在发送前被丢弃 |
| 3 | retry queue + confirm-before-ack | 重试发布失败时原消息不丢 |
| 4 | 主动转人工 + DLQ | AI 最终失败后 open 并留存 DLQ |
| 5 | 进程内熔断和并发限制 | provider 故障不形成热重试 |
| 6 | 健康检查、重复处理指标、队列监控、优雅停机 | 异常任务可重投、转人工或进入 DLQ，重复处理可观察 |

### 阶段 C：扩容和高可用

```text
单 Producer + 单 Worker + 单 RabbitMQ
  ↓
多 Producer + 多 Worker + 单 RabbitMQ
  ↓
多 Producer + 多 Worker + 3 节点 RabbitMQ quorum queues
```

先压测 provider，再增加 Worker；需要 Broker 故障容忍时再上 3 节点集群。

---

## 21. 上线验收清单

### 正常流程

- webhook 1 秒内返回；
- Chatwoot 默认 5 秒超时无需调整；
- Producer 只在 publisher confirm 后返回 200；
- 正常没有重投递时，AI 两分钟后产生回复；
- Chatwoot 后台正常发送到实际渠道。

### Producer 和 RabbitMQ

- RabbitMQ 停止后 Producer 返回 503；
- exchange 无绑定时 mandatory return 被识别；
- confirm nack/timeout 不返回假成功；
- RabbitMQ 正常重启后持久消息仍在；
- work/retry quorum queue 已启用 at-least-once dead-lettering 和 `overflow=reject-publish`；
- Worker 反复崩溃达到 `delivery-limit` 后，毒消息可靠进入 DLQ；
- DLX 目标短暂不可用时，源队列保留消息，目标恢复后继续转发；
- Producer/Worker 重启后无需恢复 Bridge 共享状态。

### Worker

- Worker 处理中被杀，未 ack 消息重新投递；
- 自动 ack 已关闭；
- prefetch 不为 0；
- Dify 和 FastGPT 均将 HTTP 非 200、3 分钟内未取得完整响应判定为调用失败；
- 正常重试链路中，首次和第 2 次调用失败后自动重试，第 3 次失败后停止，单条任务最多调用 AI 3 次；
- retry publish confirm 后才 ack 原消息；
- DLQ publish confirm 后才 ack 最终失败消息；
- consumer 异常、ack/nack 失败和 retry/DLQ confirm 失败均会打印 error 日志；
- 异常日志已写入 `logs/worker-error.log` 或生产环境配置的持久化日志位置；
- 日志可按 `rabbitMessageId` 关联到 DLQ 和 RabbitMQ 状态；
- 人工中途接管后，发送前归属检查能够丢弃大多数迟到答案；检查与创建回复之间的竞态窗口作为已知边界记录。

### 重复边界和并行处理

- 相同 webhook 或 RabbitMQ delivery 再次到达时允许重复处理；
- RabbitMQ `messageId`、`redelivered`、Worker 实例和回复结果可通过日志关联；
- Chatwoot API 响应丢失后的有限重试允许产生重复回复；
- 多 Worker 同时处理同一消息时允许产生重复 AI 调用和回复；
- 同一会话严格完成顺序不作为验收项；
- 多个 Worker 可以并行处理不同任务。

### 安全和运维

- RabbitMQ 不使用 guest 用户；
- 独立 vhost、最小权限；
- AMQP 和管理 UI 不直接暴露公网；
- RabbitMQ data volume 持久化；
- memory/disk alarm、DLQ、consumer=0 均有对应日志或状态记录；
- AgentBot 已配置独立 webhook secret，Producer 拒绝缺少或无法通过 HMAC 的请求。

---

## 22. 最终责任边界

```text
Chatwoot：保存客户消息、后台通知 Bot、保存 AI 回复、后台发往渠道
Producer：验签、过滤消息、RabbitMQ 持久发布和 confirm
RabbitMQ：保存待处理/重试/DLQ消息、未 ack 重投递
Worker：从 Chatwoot 读取上下文、无状态 AI 处理、手动 ack、重试转发、回复、失败转人工
Dify/FastGPT：生成答案
```

最终判断：

> Chatwoot webhook 在几秒内结束；RabbitMQ confirm 后才接管责任；AI 两分钟后通过官方消息 API 回写；Worker 只有在业务结果或后继消息已经可靠保存后才 ack，因此进程崩溃不会让任务静默消失。单节点 RabbitMQ 的主机/磁盘故障仍属于风险边界，需要 3 节点 quorum queue 或托管 RabbitMQ 才能提供 Broker 高可用。

---

## 23. 文件规划

### Bridge

| 文件 | 作用 |
|---|---|
| `producer.js` | webhook、校验、过滤、RabbitMQ confirm publish |
| `worker.js` | RabbitMQ manual consumer、AI 调用、ack、转人工 |
| `lib/config.js` | 环境变量和预算校验 |
| `lib/rabbitmq.js` | connection、confirm channel、consumer channel、重连 |
| `lib/topology.js` | exchange、quorum work/retry/DLQ queue 和 policy 声明 |
| `lib/retry.js` | retry queue 选择和 job 总预算 |
| `lib/circuit-breaker.js` | provider 熔断 |
| `lib/chatwoot.js` | 状态检查、创建回复、转人工 |
| `lib/providers/dify.js` | Dify 调用和超时 |
| `lib/providers/fastgpt.js` | FastGPT 调用和超时 |
| `lib/logger.js` | pino 日志 |
| `lib/metrics.js` | Prometheus 指标 |

建议 Node 依赖：

```text
amqplib
amqp-connection-manager（或等价可靠重连封装）
pino
prom-client
```

### Chatwoot 行为依据

| 文件 | 作用 |
|---|---|
| `app/listeners/agent_bot_listener.rb` | 异步创建 AgentBot webhook job |
| `app/jobs/agent_bots/webhook_job.rb` | AgentBot webhook 重试规则 |
| `lib/webhooks/trigger.rb` | HTTP 投递、5 秒默认超时、失败转人工 |
| `app/controllers/api/v1/accounts/conversations/messages_controller.rb` | Create New Message |
| `app/builders/messages/message_builder.rb` | 创建回复 |
| `app/models/message.rb` | 保存后创建 SendReplyJob |
| `app/jobs/send_reply_job.rb` | 后台发送到实际渠道 |
