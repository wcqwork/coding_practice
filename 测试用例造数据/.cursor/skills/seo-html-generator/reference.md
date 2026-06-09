# SEO HTML 测试页生成参考

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
        <h1>Premium Cabinet Hinges for Durable Furniture</h1>

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
| Title Display Length | ~43 | 30~60 ✓ |
| Title 含目标词 | "Cabinet Hinges" 在前60字符内，lastIndex=25 | ✓ |
| Meta Display Length | ~153 | 120~160 ✓ |
| Meta 含目标词 | lastIndex≈105 | ≤160 ✓ |
| Meta/Body Jaccard | 有大量共同词汇(cabinet, hinges, furniture...) | ≥0.08 ✓ |
| H1 唯一 | 1个 | ✓ |
| H1 Display Length | ~44 | ≤60 ✓ |
| H1 含目标词 | "Cabinet Hinges" | ✓ |
| Title/H1 Jaccard | 共同词少，差异化 | ≤0.5 ✓ |
| 次级标题 | 有 H2, H3 | ≥1 ✓ |
| 层级无跳级 | H1→H2→H3 | ✓ |
| 正文 WordCount | ~500+ | ≥500 ✓ |
| 含词次数 | "cabinet hinges" 出现≥3次 | ✓ |
| 关键词密度 | ~2% | ≤5% ✓ |
| 首段点题 | 目标词在首段前部 | lastIndex≤600 ✓ |
| 文题一致 Jaccard | 有共同词 | ≥0.1 ✓ |
| 主文图片 Alt | 所有图片有 Alt，含"cabinet hinges" | ✓ |
| URL HTTPS | 是 | ✓ |
| Slug 含词 | "cabinet-hinges" | ✓ |
| 同站内链 | 有，锚文本含实体词 | ✓ |
| noindex | 无 | ✓ |
| Canonical | 1条 https 绝对路径指向本页 | ✓ |
| 社媒协议 | og:title + og:description + og:image + twitter:card | ✓ |
| Hreflang | 成对互链 + x-default | ✓ |
| 结构化数据 | JSON-LD, @type=Product (白名单) | ✓ |

---

## 二、各场景造数要点（M-001 ~ M-037）

### SEO-M-001: 满分页基准

直接使用上述满分基准页模板，不需要任何修改。

---

### SEO-M-002: 综合建议（15个建议项）

在满分基准页上同时修改以下 15 处：

| # | 子项 | 修改方法 |
|---|---|---|
| 1 | Title 长度建议 | 将 title 扩写到 60 < Display Length ≤ 100，如 "Best Cabinet Hinges for Furniture Hardware Solutions and Professional Installation Guide for Modern Homes" |
| 2 | Title 目标词 lastIndex > 60 | 目标词 "cabinet hinges" 仍完整出现，但放在 title 后段使其 lastIndex > 60 |
| 3 | Meta 长度建议 | 将 meta description 调整为 Display Length 在 80~120 或 160~220 区间 |
| 4 | Meta 目标词 lastIndex > 160 | 目标词在 meta 后段出现，lastIndex > 160 |
| 5 | 文意一致性建议 | 调整 meta description 使其与正文前120词的 Jaccard 在 0.04~0.08 |
| 6 | H1 长度建议 | 将 H1 扩写到 60 < Display Length ≤ 100 |
| 7 | 堆砌告警建议 | 增加目标词出现频率使 5% < density ≤ 8%，Freq ≤ 30 |
| 8 | 文题一致建议 | 调整正文使 Title 与正文前150词 Jaccard 在 0.05~0.1 |
| 9 | Alt 非空建议 | 使部分图片（1~2张）缺少 alt 属性 |
| 10 | 主文图片含词建议 | 所有图片 Alt 均不含目标词 |
| 11 | 同站有效内链建议 | 保留同域内链但锚文本使用无意义词（如"click here"） |
| 12 | 收录规范建议 | 删除 canonical link |
| 13 | 社媒协议建议 | 保留 og:title + og:description，删除 og:image 和 twitter:card |
| 14 | Hreflang 建议 | 保留 hreflang 但缺少成对或缺少 x-default |
| 15 | 结构化数据建议 | 保留结构化标记但 @type 改为不在 Google 白名单的类型（如 "Thing"） |

---

### SEO-M-003: Headings 综合异常

- 添加第二个 `<h1>` 标签（页面出现多个 H1）
- 首个 H1 长度 60~100 Display Length
- 首个 H1 不含完整 "cabinet hinges"，但包含切片如 "Cabinet" 或 "Hinges"，切片命中率 >= 50%
- Title/H1 Jaccard 偏高（0.5~0.8）
- 存在 H1 直接跳到 H3 的跳级结构
- 至少保留一个 H2-H6 次级标题

---

### SEO-M-004: Body 建议组合

- 正文词数调整为 300~499 词
- 目标词仅出现 2 次
- 目标词首次完整命中的 lastIndex > 600 且 ≤ 1200（中间档）

---

### SEO-M-005: N/A 综合

- 不配置目标词（系统端留空）
- 移除主文区所有 `<img>` 标签
- pageType 设为不在正文字数和 Slug 适用列表中的类型
- 站点设为非多语言站点（删除所有 hreflang）
- 其余保持满分状态

---

### SEO-M-006: 多目标词综合

配置 3 个目标词：`drawer slide`, `cabinet hinges`, `hardware supplier`

- **A 词 (cabinet hinges)**: 在 Title、Meta、H1、正文、图片 Alt 中完美命中
- **B 词 (drawer slide)**: 仅在正文中大量重复，density > 8% 触发堆砌严重
- **C 词 (hardware supplier)**: 其余字段不含或部分含
- 其余页面结构保持满分

---

### SEO-M-007: 删除 title 标签

- 从 `<head>` 中完全删除 `<title>` 标签
- 其余保持满分

---

### SEO-M-008: Title 为空

- 保留 `<title></title>` 标签但内容为空
- 其余保持满分

---

### SEO-M-009: Title 严重组合

- Title 长度严重不合规（Display Length ≤ 10 或 > 100）
- Title 不含完整目标词
- Title 中目标词切片命中率 < 50%

---

### SEO-M-010: 删除 Meta Description

- 从 `<head>` 中完全删除 `<meta name="description">` 标签
- 其余保持满分

---

### SEO-M-011: Meta Description 为空

- 保留 `<meta name="description" content="">` 但 content 为空
- 其余保持满分

---

### SEO-M-012: Meta 严重组合

- Meta 长度严重不合规（Display Length < 80 或 > 220）
- 目标词完整词与切片均未命中
- 摘要与正文 Jaccard < 0.04

---

### SEO-M-013: 删除 H1

- 完全删除 `<h1>` 标签
- 保留 H2-H6 次级标题且不制造跳级（H2 → H3 顺序）

---

### SEO-M-014: H1 为空

- 保留 `<h1></h1>` 但文本内容为空
- 保留 H2-H6 次级标题且不制造跳级

---

### SEO-M-015: H1 严重组合

- H1 不含完整目标词且切片命中率 < 50%
- Title/H1 Jaccard > 0.8 或极低
- 移除全部 H2-H6 次级标题（不制造跳级）

---

### SEO-M-016: 正文字数空壳

**目标词改为**: `hinges`（单词元词）

- 正文 WordCount < 100（建议 60~80 词）
- "hinges" 出现 3 次，density ≈ 4.3%（安全）
- 首次出现在首 600 字符内
- Title 与正文 Jaccard ≥ 0.1

---

### SEO-M-017: 正文无目标词

- 主文区完全不出现目标词 "cabinet hinges"
- Title、Meta、H1 可正常包含目标词

---

### SEO-M-018: Body 建议组合

- 正文词数 100~299
- 目标词仅出现 1 次
- 首次出现明显滞后（lastIndex > 1200 或 positionPct > 20%）
- Title 与正文开篇 Jaccard < 0.05

---

### SEO-M-019: 堆砌严重

- 让目标词 density > 8%，或 Freq > 30 且 density > 5%
- 其余保持满分

---

### SEO-M-020: 文题一致严重

- Title 与正文开篇实体完全不重合（Jaccard < 0.04）
- 或正文开篇有效文本过少
- 其余保持满分

---

### SEO-M-021: 图片 Alt 严重

- 大量主文图片缺失 Alt 属性（缺失率 > 20%）
- 没有任何图片 Alt 包含目标词

---

### SEO-M-022: URL + Hreflang 组合

- 页面通过 HTTP 访问（URL 使用 http://）
- pageType 为 Slug 适用类型但 slug 不含目标词
- 多语言站点 Hreflang 配置不完整

---

### SEO-M-023: Code 严重综合

- 添加 `<meta name="robots" content="noindex">`
- 主文区无同域内链
- 移除全部 og:title、og:description、og:image、twitter:card

---

### SEO-M-024: Canonical 多条不同 URL

- 输出多条 canonical 标签，href 指向不同 URL
- 其余保持满分

---

### SEO-M-025: Canonical 指向他域

- 唯一 canonical 的 href 改为指向不同注册域（如 `https://other-domain.com/page`）
- 其余保持满分

---

### SEO-M-026: Canonical 相对路径

- Canonical href 改为相对路径（如 `/product/cabinet-hinges`）或非 https URL
- 其余保持满分

---

### SEO-M-027: 结构化 JSON-LD

- 仅提供 JSON-LD 格式结构化数据，@type 命中白名单（如 "Product"）
- 不提供 Microdata 和 RDFa

---

### SEO-M-028: 结构化 Microdata

- 仅提供 Microdata 格式，itemtype 命中白名单
- 不提供 JSON-LD 和 RDFa

```html
<div itemscope itemtype="https://schema.org/Product">
    <span itemprop="name">Premium Cabinet Hinges</span>
    <span itemprop="description">High-quality cabinet hinges</span>
</div>
```

---

### SEO-M-029: 结构化 RDFa

- 仅提供 RDFa 格式，typeof 命中白名单
- 不提供 JSON-LD 和 Microdata

```html
<div vocab="https://schema.org/" typeof="Product">
    <span property="name">Premium Cabinet Hinges</span>
    <span property="description">High-quality cabinet hinges</span>
</div>
```

---

### SEO-M-030: 结构化数据完全缺失

- 移除所有 JSON-LD、Microdata、RDFa 结构化数据
- 其余保持满分

---

### SEO-M-031: 综合汇总

- Title 不含目标词
- Meta 长度偏离
- 存在多个 H1
- 正文略短（300~499 词）
- 部分 Alt 缺失
- HTTP 访问
- 未声明 Canonical

---

### SEO-M-032: 低分综合压测

- 缺 Title
- 缺 Meta Description
- 缺 H1
- 正文无目标词
- HTTP 访问
- 有 noindex
- 结构化数据完全缺失

---

### SEO-M-033: 切片命中组合

- Title、Meta、H1 均不含完整 "cabinet hinges"
- 但分别包含切片（如 Title 含 "Cabinet"，Meta 含 "Hinges"，H1 含 "cabinet hardware" 等）
- 覆盖切片命中得分档

---

### SEO-M-034: 严重组合 - 全部未命中

- Title、Meta、H1 均不含完整目标词或有效切片
- 移除全部 H2-H6 次级标题
- 正文仍自然包含目标词

---

### SEO-M-035: H1 超长严重

- 保留唯一非空 H1
- H1 文本扩写至 Display Length > 100
- 目标词仍完整包含在 H1 中
- 其余保持满分

---

### SEO-M-036: Slug 中文 N/A

**目标词改为**: `橱柜铰链`

- pageType 属于 Slug 适用列表（如产品详情页）
- 目标词为非 ASCII 且无英文别名
- Slug 含词检测按 N/A 满分
- 其余保持满分

---

### SEO-M-037: Canonical 多条相同

- 输出 2 条以上 canonical，href 完全一致
- 无 noindex
- 其余保持满分

```html
<link rel="canonical" href="https://example.com/product/cabinet-hinges">
<link rel="canonical" href="https://example.com/product/cabinet-hinges">
```

---

## 三、技术规则参考

### Display Length 计算规则

| 字符类型 | 计数 |
|---|---|
| CJK 统一表意文字（中文等） | 计 2 |
| 全角符号 | 计 2 |
| ASCII 半角字母、数字、常见标点 | 计 1 |

**示例**:
- `cabinet hinges` (14个ASCII) → Display Length = 14
- `橱柜铰链` (4个CJK) → Display Length = 8
- `Hinges铰链` (6ASCII + 2CJK) → Display Length = 10

### lastIndex 位置判定

所有位置检测以目标词**最后一个字符的位置**（lastIndex）为准：
1. 从第 1 个 Display Length 字符开始计数
2. 找到目标词首次完整出现的位置
3. `firstIndex` = 目标词首字符的 Display Length 位置
4. `lastIndex` = firstIndex + 目标词 Display Length - 1

### 关键词密度计算

```
density(%) = (Freq × 目标词词元数) / WordCount × 100
```

| 目标词 | 词元数 | Freq=3 最小安全 WordCount |
|---|---|---|
| hinges | 1 | 60 |
| cabinet hinges | 2 | 120 |

**堆砌红线**: density > 8% 或 (Freq > 30 且 density > 5%)

### N/A 触发条件速查

| N/A 条件 | 涉及子项 |
|---|---|
| 未配置目标词 | Title目标词、Meta目标词、H1目标词、含词次数、堆砌告警、首段点题 |
| 主文区无图片 | Alt非空、主文图片含词 |
| pageType 不在适用列表 | 正文字数 / Slug含词 |
| 非多语言站点 | Hreflang多语言 |
| 目标词为非 ASCII 且无英文别名 | Slug含词 |

### 各字段长度阈值

| 字段 | 严重 | 建议 | 满分 |
|---|---|---|---|
| Title Display Length | ≤10 或 >100 | >60 且 ≤100 | 30~60 |
| Meta Display Length | <80 或 >220 | 80~120 或 >160~220 | 120~160 |
| H1 Display Length | >100 | >60 且 ≤100 | ≤60 |

### Jaccard 相似度参考

| 阈值 | 含义 |
|---|---|
| ≥ 0.1 | 两段文本有明显共同词汇 |
| 0.04~0.08 | 轻微偏离 |
| < 0.04 | 几乎没有共同词汇 |
