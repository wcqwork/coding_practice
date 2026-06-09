# SEO HTML 测试页生成参考

> **权威规则来源**：`data/SEO评分维度.md`。本文件为造数实操摘要。

## 一、满分基准页 HTML 模板

以下是 M-001 满分基准页的完整 HTML 模板。所有其他场景均基于此模板进行针对性修改。

**目标词**: `cabinet hinges`
**pageType**: 产品详情页
**URL**: `https://example.com/product/cabinet-hinges`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Best Cabinet Hinges for Furniture Hardware</title>
    <meta name="description" content="Discover premium cabinet hinges for your furniture projects. Our high-quality cabinet hinges offer smooth operation, durable construction, and easy installation for cabinets and drawers.">
    <meta name="pageType" content="产品详情页">
    <link rel="canonical" href="https://example.com/product/cabinet-hinges">

    <!-- Open Graph -->
    <meta property="og:title" content="Best Cabinet Hinges for Furniture Hardware">
    <meta property="og:description" content="Discover premium cabinet hinges for your furniture projects. Our high-quality cabinet hinges offer smooth operation, durable construction, and easy installation for cabinets and drawers.">
    <meta property="og:image" content="https://example.com/images/cabinet-hinges.jpg">
    <meta name="twitter:card" content="summary_large_image">

    <!-- Hreflang -->
    <link rel="alternate" hreflang="en" href="https://example.com/product/cabinet-hinges">
    <link rel="alternate" hreflang="zh" href="https://example.com/zh/product/cabinet-hinges">
    <link rel="alternate" hreflang="x-default" href="https://example.com/product/cabinet-hinges">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Premium Cabinet Hinges",
        "description": "High-quality cabinet hinges for furniture",
        "image": "https://example.com/images/cabinet-hinges.jpg",
        "brand": {
            "@type": "Brand",
            "name": "HardwarePro"
        },
        "offers": {
            "@type": "Offer",
            "price": "12.99",
            "priceCurrency": "USD"
        }
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <a href="https://example.com">Home</a>
            <a href="https://example.com/products">Products</a>
            <a href="https://example.com/products/hardware">Hardware Supplies</a>
        </nav>
    </header>

    <main>
        <h1>Cabinet Hinges Hardware Solutions</h1>

        <p>When it comes to building or renovating furniture, choosing the right cabinet hinges is essential for both functionality and longevity. Our premium selection of cabinet hinges provides reliable performance that professional woodworkers and DIY enthusiasts trust for their most important projects. Whether you are installing new kitchen cabinets or upgrading existing furniture pieces, quality hinges make all the difference in smooth door operation and long-term durability.</p>

        <img src="https://example.com/images/cabinet-hinges-main.jpg" alt="Premium cabinet hinges installed on wooden furniture">

        <h2>Types of Cabinet Hinges We Offer</h2>

        <p>We carry a comprehensive range of cabinet hinges designed for various applications. From concealed hinges that provide a clean, modern look to decorative butt hinges that add a touch of traditional elegance, our inventory covers every need. Each type of cabinet hinge in our catalog has been tested for thousands of open-close cycles to ensure lasting quality and smooth operation throughout years of daily use.</p>

        <img src="https://example.com/images/hinge-types.jpg" alt="Different types of cabinet hinges including concealed and butt hinges">

        <h2>Installation Guide</h2>

        <p>Installing cabinet hinges correctly is crucial for proper door alignment and smooth operation. Our detailed guide walks you through every step of the process, from measuring and marking to final adjustment. With the right tools and our step-by-step instructions, even first-time installers can achieve professional results. The key is precise positioning of the hinge plates on both the cabinet frame and the door, followed by careful adjustment of the tension screws for perfect closing action.</p>

        <h3>Tools Needed</h3>

        <p>For a successful cabinet hinges installation, gather a power drill, appropriate drill bits, a screwdriver set, a measuring tape, and a level. Having these tools ready before you start will make the entire process smoother and more efficient. We also recommend using a hinge jig for consistent placement across multiple doors.</p>

        <img src="https://example.com/images/installation-tools.jpg" alt="Tools needed for cabinet hinges installation including drill and screwdriver">

        <h2>Why Choose Our Hardware</h2>

        <p>Our cabinet hinges are manufactured using high-grade steel and advanced coating technology that resists corrosion and wear. Each hinge undergoes rigorous quality control testing before it reaches your hands. We source materials from certified suppliers and maintain strict manufacturing tolerances to ensure every piece performs flawlessly. Customers across the furniture industry rely on our hardware components for both residential and commercial projects, knowing that our products deliver consistent quality at competitive prices.</p>

        <p>Beyond cabinet hinges, we also offer a complete line of complementary hardware including <a href="https://example.com/products/drawer-slides">drawer slides</a>, knobs, pulls, and other furniture accessories. Our commitment to quality and customer satisfaction has made us a trusted name in the hardware supply industry for over fifteen years.</p>

        <h2>Maintenance Tips</h2>

        <p>To keep your cabinet hinges functioning properly for years, periodic maintenance is recommended. Apply a small amount of lubricant to the hinge pins annually, and check that all screws remain tight. If you notice any squeaking or stiffness, a quick adjustment of the hinge tension usually resolves the issue. With proper care, quality cabinet hinges will provide decades of reliable service in any furniture application.</p>
    </main>

    <footer>
        <p>&copy; 2024 HardwarePro. All rights reserved.</p>
        <a href="https://example.com/products/cabinet-hinges">Cabinet Hinges Collection</a>
    </footer>
</body>
</html>
```

### 满分基准页参数校验

| 检测项 | 值 | 是否满分 |
|---|---|---|
| Title Display Length | ~44 | 30~60 ✓ |
| Title 含目标词 | "cabinet hinges" positionPct ≈ 14% | [0%, 30%] → 10分 ✓ |
| Meta Display Length | ~153 | 120~160 ✓ |
| Meta 含目标词 | positionPct ≈ 前部 | [0%, 50%] → 2分 ✓ |
| Meta/Body Jaccard | 有大量共同词汇 | ≥0.08 ✓ |
| H1 唯一 | 1个 | 4分 ✓ |
| H1 Display Length | ~34 | ≤40 → 2分 ✓ |
| H1 含目标词 | "Cabinet Hinges" positionPct ≈ 0% | [0%, 50%] → 5分 ✓ |
| Title/H1 Jaccard | 差异化表述 | ≤0.5 → 3分 ✓ |
| 子标题含目标词 | H2 含完整词 | 2分 ✓ |
| 层级无跳级 | H1→H2→H3 | 2分 ✓ |
| 正文 WordCount | ~500+ | ≥500 → 6分 ✓ |
| 含词次数 | ≥3次 | 6分 ✓ |
| 关键词密度 | ~2% | ≤5% → 2分 ✓ |
| 首段点题 | 首段前部出现 | ≤10% 或前100词 → 3分 ✓ |
| 文题一致 Jaccard | 有共同词 | ≥0.1 → 5分 ✓ |
| 主文图片 Alt | 全部有 Alt，含目标词 | 3+2分 ✓ |
| URL HTTPS | 是 | 3分 ✓ |
| Slug 含词 | "cabinet-hinges" | 3分 ✓ |
| 同站内链 | 锚文本含实体词 drawer slides | 6分 ✓ |
| 收录规范 | 1条 https canonical 指向本页 | 8分 ✓ |
| 社媒协议 | og:title + og:description + og:image + twitter:card | 3分 ✓ |
| Hreflang | 成对互链 + x-default | 2分 ✓ |
| 结构化数据 | JSON-LD, @type=Product | 3分 ✓ |
| 文本代码比 | 正文充实 | ≥2% → 3分 ✓ |

---

## 二、各场景造数要点（M-001 ~ M-037）

### SEO-M-001: 满分页基准

直接使用上述满分基准页模板，不需要任何修改。

---

### SEO-M-002: 综合建议（15个建议项）

在满分基准页上同时修改以下 15 处：

| # | 子项 | 修改方法 |
|---|---|---|
| 1 | Title 长度建议 | 扩写到 `60 < Display Length ≤ 100` |
| 2 | Title 目标词建议 | 完整词存在，但 `positionPct > 30%`（腰部或后段） |
| 3 | Meta 长度建议 | Meta Display Length 在 `80~120` 或 `160~220` |
| 4 | Meta 目标词建议 | 完整词在 `(50%, 100%]` 或仅切片命中 |
| 5 | 文意一致性建议 | Meta 与正文前120词 Jaccard 在 `0.04~0.08` |
| 6 | H1 长度建议 | `40 < Display Length ≤ 55` |
| 7 | 堆砌告警建议 | `5% < density ≤ 8%` 且 `Freq ≤ 30` |
| 8 | 文题一致建议 | Title 与正文前150词 Jaccard 在 `0.05~0.1` |
| 9 | Alt 非空建议 | 1~2 张图片缺少 alt |
| 10 | 主文图片含词建议 | 所有图片 Alt 均不含目标词 |
| 11 | 同站有效内链建议 | 保留同域内链，锚文本用无意义词如 "click here" → 3分建议 |
| 12 | 收录规范建议 | 删除 canonical → 5分建议 |
| 13 | 社媒协议建议 | 保留 og:title + og:description，删除 og:image 和 twitter:card |
| 14 | Hreflang 建议 | 保留 hreflang 但缺少 x-default 或未成对 |
| 15 | 结构化数据建议 | @type 改为 "Thing"（不在白名单） |

---

### SEO-M-003: Headings 综合异常

- 添加第二个 `<h1>`（H1 唯一性 → 2分建议，非严重）
- 首个 H1：`40 < Display Length ≤ 55`（H1 长度建议）或不含完整词但切片 ≥50%
- Title/H1 Jaccard 在 `0.5~0.8`（差异化建议）
- **跳级 ≥ 2 次**（如 H1→H3 且 H2→H4）以触发层级无跳级 0分严重；仅 1 次跳级为 1分建议
- 保留 H2-H6 次级标题

---

### SEO-M-004: Body 建议组合

- 正文词数 `300~499`
- 目标词出现 `2` 次
- 首段点题中间档：`positionPct` 在 `(10%, 20%]` 或词序在 `(100, 200]` 词

---

### SEO-M-005: N/A 综合

- 系统端不配置目标词
- 移除主文区所有 `<img>`
- pageType 设为不适用类型（如「其他页面」）
- 删除所有 hreflang
- 其余保持满分

---

### SEO-M-006: 多目标词综合

配置 3 个目标词：`drawer slide`, `cabinet hinges`, `hardware supplier`

- **A 词**：Title、Meta、H1、正文、Alt 完美命中
- **B 词**：正文 density > 8% 触发堆砌严重（ANY）
- **C 词**：其余字段不含或部分含

---

### SEO-M-007 ~ M-011: Title/Meta 单点严重

| 场景 | 修改 |
|---|---|
| M-007 | 删除 `<title>` |
| M-008 | `<title></title>` 为空 |
| M-009 | Title `Length < 10`（如 "HW"），无完整词，切片 <50% |
| M-010 | 删除 `<meta name="description">` |
| M-011 | `<meta name="description" content="">` |

---

### SEO-M-012: Meta 严重组合

- Meta `Length < 80` 或 `> 220`
- 无完整词且无切片
- Meta/正文 Jaccard < 0.04

---

### SEO-M-013 ~ M-015: H1 单点/组合

| 场景 | 修改 |
|---|---|
| M-013 | 删除 `<h1>`，保留 H2→H3 |
| M-014 | `<h1></h1>` 为空 |
| M-015 | H1 无完整词且切片 <50%；移除全部 H2-H6 |

---

### SEO-M-016: 正文字数空壳

**目标词**: `hinges`（单词元）

- 正文 `WordCount < 100`（约 60~80 词）
- hinges 出现 3 次，density 安全
- 首段点题、文题一致保持满分

---

### SEO-M-017 ~ M-020: Body 单点

| 场景 | 修改 |
|---|---|
| M-017 | 正文不含 "cabinet hinges" |
| M-018 | 100~299 词，Freq=1，首段滞后 `>20%` 且 `>200` 词，文题 Jaccard <0.05 |
| M-019 | density > 8% |
| M-020 | 正文开篇与 Title Jaccard == 0（如开篇讲旅游） |

---

### SEO-M-021: 图片 Alt 严重

- Alt 缺失率 > 20%
- 无任何 Alt 含目标词

---

### SEO-M-022: URL + Hreflang

- HTTP 访问
- slug 不含目标词（如 general-hardware）
- Hreflang 缺 x-default

---

### SEO-M-023: Code 严重综合

- `<meta name="robots" content="noindex">`
- 主文无同域内链
- 移除全部 OG/Twitter

---

### SEO-M-024 ~ M-037: Canonical / 结构化 / 综合

| 场景 | 修改 |
|---|---|
| M-024 | 多条 canonical，href 不同 → 0分严重 |
| M-025 | canonical 指向他域 → 0分严重 |
| M-026 | canonical 相对路径 → 5分建议 |
| M-027 | 仅 JSON-LD，@type=Product |
| M-028 | 仅 Microdata |
| M-029 | 仅 RDFa |
| M-030 | 移除所有结构化数据 |
| M-031 | Title无词、Meta偏离、多H1、正文略短、Alt缺失、HTTP、无Canonical |
| M-032 | 缺 Title/Meta/H1、正文无词、HTTP、noindex、无结构化 |
| M-033 | Title/Meta/H1 均切片命中、无完整词 |
| M-034 | Title/Meta/H1 均无词无切片，无 H2-H6 |
| M-035 | 唯一 H1，`Display Length > 55`（严重），仍含完整目标词 |
| M-036 | 目标词 `橱柜铰链`，Slug N/A |
| M-037 | 2+ 条相同 canonical，无 noindex → 5分建议 |

---

## 三、技术规则参考

### Display Length

| 字符类型 | 计数 |
|---|---|
| CJK、全角符号 | 2 |
| ASCII 半角 | 1 |

### positionPct 位置判定

```
positionPct = (目标词首字符 Display Length 位置 / 字段总 Display Length) × 100
```

| 字段 | 满分 | 建议 | 严重 |
|---|---|---|---|
| Title 目标词 | [0%, 30%] | (30%, 50%]、(50%, 100%]、切片≥50% | 切片<50% |
| Meta 目标词 | [0%, 50%] | (50%, 100%]、仅切片 | 无词无切片 |
| H1 目标词 | [0%, 50%] | (50%, 100%]、切片≥50% | 切片<50% |
| 首段点题 | ≤10% 或前100词 | (10%,20%]、(100,200]词 | >20%且>200词 |

### 关键词密度

```
density(%) = (Freq × 词元数) / WordCount × 100
```

| 目标词 | 词元数 | Freq=3 最小安全 WordCount |
|---|---|---|
| hinges | 1 | 60 |
| cabinet hinges | 2 | 120 |

**堆砌**：严重 `density>8%` 或 `(Freq>30 且 density>5%)`；建议 `(5%,8%]` 且 Freq≤30

### 各字段长度阈值

| 字段 | 满分 | 建议 | 严重 |
|---|---|---|---|
| Title | 30~60 | 10~30 或 60~100 | <10 或 >100 |
| Meta | 120~160 | 80~120 或 160~220 | <80 或 >220 |
| H1 | ≤40 | 40~55 | >55 |

### H1 唯一性 / 层级跳级

| 检测项 | 满分 | 建议 | 严重 |
|---|---|---|---|
| H1 唯一性 | Count==1 | Count≥2 | Count==0 |
| 层级无跳级 | 跳级==0 | 跳级==1 | 跳级≥2 |

### N/A 触发条件

| 条件 | 涉及子项 |
|---|---|
| 未配置目标词 | Title/Meta/H1目标词、含词次数、堆砌、首段点题 |
| 主文区无图片 | Alt非空、主文图片含词 |
| pageType 不适用 | 正文字数、Slug含词 |
| 非多语言站点 | Hreflang |
| 中文目标词无英文别名 | Slug含词 |

### Jaccard 阈值速查

| 检测项 | 满分 | 建议 | 严重 |
|---|---|---|---|
| 文意一致(Meta vs 正文) | ≥0.08 | 0.04~0.08 | <0.04 |
| Title/H1差异化 | ≤0.5 | 0.5~0.8 | >0.8 |
| 文题一致 | ≥0.1 | 0.05~0.1、0~0.05 | ==0 |
