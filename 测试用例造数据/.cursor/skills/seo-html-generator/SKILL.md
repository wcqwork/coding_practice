---
name: seo-html-generator
description: >
  根据 SEO 测评场景 Excel 表和造数说明文档，自动生成符合检测要求的 HTML 测试页面。
  当用户提到 SEO 造数据、生成测试 HTML、SEO 测试用例、测评场景页面、SEO HTML、
  场景造数、生成 HTML 测试页时触发。支持 37 个 SEO 场景（M-001~M-037），
  涵盖 Title、Meta、Headings、Body、Media、URL、Code 七大维度。
  权威规则来源：data/SEO评分维度.md
---

# SEO HTML 测试页生成器

根据 Excel 场景表批量生成符合 SEO 测评要求的 HTML 文件。

> **权威规则来源**：所有评分规则以 `data/SEO评分维度.md` 为准。本文件仅摘要关键造数规则。

## 工作流程

### Step 1: 读取 Excel 场景数据

用 Python + openpyxl 读取 `data/seo_scenarios_v5.xlsx`：

```python
import openpyxl
wb = openpyxl.load_workbook('data/seo_scenarios_v5.xlsx')
ws = wb.active
for row in range(2, ws.max_row + 1):
    scene_id = ws.cell(row, 1).value       # 场景编号 (SEO-M-001 ~ SEO-M-037)
    scene_type = ws.cell(row, 2).value      # 场景类型
    requirement = ws.cell(row, 4).value      # 场景/造数要求
    keyword = ws.cell(row, 5).value          # 目标词
    dimension_score = ws.cell(row, 7).value  # 预期各维度得分
    total_score = ws.cell(row, 8).value      # 预期页面总分
    issue_count = ws.cell(row, 9).value      # 问题数预期
    if not scene_id:
        continue
```

### Step 2: 读取规则文档和参考模板

1. 读取 `data/SEO评分维度.md` 获取完整产品评分规则（**权威来源**）
2. 读取 `reference.md` 获取满分基准页 HTML 模板和各场景具体造数要点

### Step 3: 逐场景生成 HTML

对每个场景，遵循以下原则：

1. **以 M-001 满分基准页为底板**
2. **仅修改该场景"场景/造数要求"描述的字段，其他字段保持满分状态**
3. **注意前置条件联动**（详见下方规则）

### Step 4: 写入 HTML 文件

- 输出目录：`测试用例htm/`（项目根目录下）
- 文件名格式：`{场景编号}.html`（如 `SEO-M-001.html`）

## HTML 生成核心规则

### 基本原则

- 每个场景基于满分基准页修改，非必要字段不改动
- 目标词按 Excel"目标词"列配置，大多数场景使用 `cabinet hinges`
- pageType 默认为"产品详情页"（Slug 含词和正文字数均生效）

### 常见前置条件联动

修改某字段时可能连带影响其他检测项：

| 改动 | 联动影响 |
|---|---|
| 删除 `<title>` | Title/H1差异化→0分；文题一致→0分 |
| Title 为空 | 同上 |
| 删除 `<h1>` | H1长度→0分；H1目标词→0分；Title/H1差异化→0分 |
| H1 文本为空 | H1唯一性→0分；H1长度→0分；H1目标词→0分；Title/H1差异化→0分 |
| 删除 Meta Description | Meta目标词→0分；文意一致性→0分 |
| 堆砌触发 (density>8%) | 含词次数联动归0分 |

### Display Length 计算

- CJK 字符、全角符号：计 2
- ASCII 半角字符：计 1
- 示例：`cabinet hinges` = 14，`橱柜铰链` = 8

### 位置判定：positionPct（目标词位置占比）

所有含词类位置检测均以 `positionPct`（目标词首字符在字段文本中的位置占比）判档：

```
positionPct = (目标词首字符的 Display Length 位置 / 字段总 Display Length) × 100
```

各字段判档阈值：

| 字段 | 满分 | 建议 | 说明 |
|---|---|---|---|
| Title 目标词 | positionPct ∈ [0%, 30%] → 10分 | (30%, 50%] → 7分；(50%, 100%] → 5分 | 含完整词按位置判档 |
| Meta 目标词 | positionPct ∈ [0%, 50%] → 2分 | (50%, 100%] 或仅切片命中 → 1分 | 含完整词按位置判档 |
| H1 目标词 | positionPct ∈ [0%, 50%] → 5分 | (50%, 100%] → 3分 | 含完整词按位置判档 |
| 首段点题 | positionPct ≤ 10% 或前100词 → 3分 | (10%, 20%] 或(100, 200]词 → 2分；>20%且>200词 → 1分 | 正文中的位置 |

### 密度计算

```
density(%) = (Freq × 词元数) / WordCount × 100
```
- 堆砌严重红线：density > 8% 或 (Freq > 30 且 density > 5%)
- 堆砌建议档：(25 ≤ Freq ≤ 30 且 density ≤ 5%) 或 (5% < density ≤ 8% 且 Freq ≤ 30) → 1分
- `cabinet hinges` = 2 词元，Freq=3 时最小安全 WordCount = 120

### Jaccard 相似度

各字段 Jaccard 阈值不同，需按具体检测项对照：

| 检测项 | 满分 | 建议 | 严重 |
|---|---|---|---|
| 文意一致(Meta vs 正文前120词) | ≥ 0.08 → 2分 | 0.04~0.08 → 1分 | < 0.04 → 0分 |
| Title/H1差异化 | ≤ 0.5 → 3分 | 0.5~0.8 → 2分 | > 0.8 → 0分 |
| 文题一致(Title vs 正文前150词) | ≥ 0.1 且正文含目标词 → 5分 | 0.05~0.1 → 3分；0~0.05 → 1分 | == 0 或正文<20字符 → 0分 |

### 文本代码比（Code 维度 3 分）

```
Ratio = 纯文本字节数 / HTML 源码字节数 × 100
```
- Ratio ≥ 2% → 3分（满分）
- 0.6% ≤ Ratio < 2% → 2分（建议）
- Ratio < 0.6% → 0分（严重）

满分基准页需确保文本代码比 ≥ 2%（正文应充实，HTML 结构不宜过于臃肿）。

### 收录规范（Code 维度 8 分）

| 条件 | 得分 | 严重度 |
|---|---|---|
| 无 noindex + 1 条 https 绝对 Canonical（同 eTLD+1 指向本页） | 8分 | 通过 |
| 无 Canonical（无 noindex） | 5分 | 建议 |
| 多条 Canonical 且 href 完全相同（冗余） | 5分 | 建议 |
| 恰 1 条 Canonical 但为相对路径 | 5分 | 建议 |
| 有 noindex | 0分 | 严重 |
| Canonical 指向其他注册域 | 0分 | 严重 |
| 多条 Canonical 且 href 不同 | 0分 | 严重 |

### 同站有效内链（Code 维度 6 分）

| 条件 | 得分 | 严重度 |
|---|---|---|
| 高相关内链 ≥ 1（锚文本含实体词，非无意义词） | 6分 | 通过 |
| 有同域内链但高相关 == 0（锚文本命中无意义词黑名单） | 3分 | 建议 |
| 无同域内链 | 0分 | 严重 |

无意义词黑名单种子：click here, here, read more, learn more, details 等。

### H1 唯一性规则（Headings 维度 4 分）

| 条件 | 得分 | 严重度 |
|---|---|---|
| Count(H1) == 1 | 4分 | 通过 |
| Count(H1) ≥ 2 | 2分 | 建议 |
| Count(H1) == 0 | 0分 | 严重 |

### 层级跳级规则（Headings 维度 2 分）

| 条件 | 得分 | 严重度 |
|---|---|---|
| 跳级次数 == 0 | 2分 | 通过 |
| 跳级次数 == 1 | 1分 | 建议 |
| 跳级次数 ≥ 2 | 0分 | 严重 |

## 各场景快速索引

| 场景 | 类型 | 关键修改 |
|---|---|---|
| M-001 | 满分基准 | 使用基准模板无修改 |
| M-002 | 综合建议 | 15处同时改为建议档 |
| M-003 | Headings异常 | 多H1(建议)+跳级≥2次(严重)+切片命中 |
| M-004 | Body建议 | 300~499词+2次+中间位置 |
| M-005 | N/A综合 | 无目标词+无图片+非适用pageType |
| M-006 | 多目标词 | 3个目标词验证MAX+ANY |
| M-007 | 删除Title | 移除title标签 |
| M-008 | Title空 | title内容为空 |
| M-009 | Title严重 | Length<10+无完整词+切片<50% |
| M-010 | 删除Meta | 移除meta description |
| M-011 | Meta空 | meta content为空 |
| M-012 | Meta严重 | 长度偏离+无词+Jaccard<0.04 |
| M-013 | 删除H1 | 移除h1标签 |
| M-014 | H1空 | h1文本为空 |
| M-015 | H1严重 | 无词+切片<50%+无次级标题 |
| M-016 | 空壳内容 | <100词+单词元词hinges |
| M-017 | 正文无词 | 正文不含目标词 |
| M-018 | Body建议 | 100~299词+1次+滞后 |
| M-019 | 堆砌严重 | density>8% |
| M-020 | 文题一致严重 | Jaccard==0 |
| M-021 | 图片Alt严重 | 大量缺Alt+无含词Alt |
| M-022 | URL+Hreflang | HTTP+slug无词+Hreflang不完整 |
| M-023 | Code严重 | noindex+无内链+无社媒 |
| M-024 | Canonical多不同 | 多条canonical指向不同URL |
| M-025 | Canonical他域 | canonical指向不同注册域 |
| M-026 | Canonical相对 | href为相对路径 |
| M-027 | JSON-LD专项 | 仅JSON-LD格式 |
| M-028 | Microdata专项 | 仅Microdata格式 |
| M-029 | RDFa专项 | 仅RDFa格式 |
| M-030 | 无结构化 | 移除所有结构化数据 |
| M-031 | 综合汇总 | 多维度问题混合 |
| M-032 | 低分压测 | 大量严重问题 |
| M-033 | 切片命中 | Title/Meta/H1均切片命中 |
| M-034 | 全部未命中 | Title/Meta/H1均无词+无次级标题 |
| M-035 | H1超长 | H1 Display Length>55 |
| M-036 | Slug中文N/A | 目标词=橱柜铰链 |
| M-037 | Canonical冗余 | 多条相同canonical |

## 各场景详细造数方法

详见 [reference.md](reference.md)，包含：
- 完整满分基准页 HTML 模板
- 每个场景（M-001~M-037）的具体修改要点
- Display Length、密度、Jaccard 等技术规则参考表

## 质量校验

每生成一个 HTML 文件后，应对照 `data/SEO评分维度.md` 和 Excel 的"预期各维度得分"列进行自查：

1. 检查该场景要求修改的字段是否正确
2. 检查不需要修改的字段是否保持满分状态
3. 检查 Display Length、positionPct、density 等数值是否落入目标区间
4. 检查联动影响是否符合预期
5. 检查文本代码比 ≥ 2%
