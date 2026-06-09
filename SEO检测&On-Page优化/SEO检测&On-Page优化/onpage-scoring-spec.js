/** Auto-generated from SEO评分维度.md — do not hand-edit; re-run scripts/build-onpage-spec.js */
(function (global) {
  global.ONPAGE_SPEC_DIMENSIONS = [
  {
    "id": "title",
    "label": "Title 页面标题",
    "max": 16,
    "intro": "页面标题是吸引用户点击和搜索引擎判断主题的核心要素。请确保本页拥有一个独立标题，长度控制在 30~60 字符之间，并将核心关键词尽可能自然地放在标题最前面。"
  },
  {
    "id": "meta",
    "label": "Meta 摘要",
    "max": 8,
    "intro": "Meta 摘要直接决定了用户在搜索列表中看到您的网页时，是否愿意点击。请撰写一段 120~160 字符的简短介绍，确保它包含您的核心目标词，并且准确反映了正文开篇的真实内容。"
  },
  {
    "id": "headings",
    "label": "Headings 标题结构",
    "max": 18,
    "intro": "H 标签（H1、H2、H3 等）构成了网页的阅读大纲。请确保每一页有且仅有一个 H1 标签作为主标题，并在其中融入核心词。在长文章中，要像写书本目录一样，按顺序使用 H2、H3 进行分段落，不要越级乱用。"
  },
  {
    "id": "body",
    "label": "Body 正文内容",
    "max": 22,
    "intro": "内容是 SEO 的灵魂。不要制造只放几张图的「空壳页面」。请确保主体内容字数充沛（建议大于 500 字），在文章开篇就点明目标关键词，并自然地在上下文中重复提及。坚决避免堆砌关键词引发的惩罚。"
  },
  {
    "id": "media",
    "label": "Media 多媒体",
    "max": 5,
    "intro": "搜索引擎目前仍依赖文字来「看懂」图片。请确保网页中每张有价值的图片都添加了 Alt（替代文本）属性，并且核心商品图/首图的描述里包含您的目标关键词。"
  },
  {
    "id": "url",
    "label": "URL 链接设置",
    "max": 6,
    "intro": "好的网址不仅用户看着放心，搜索引擎也更喜欢。请保持您的网页访问是加密安全的（HTTPS 开头），并且在页面的后缀路径（Slug）中，尽量包含目标关键词的拼音或英文单词。"
  },
  {
    "id": "code",
    "label": "Code 底层代码与技术",
    "max": 25,
    "intro": "这是决定网页能否被爬虫顺利收录的地基。请保持网页拥有合理的纯净文字占比，在正文建设相关的内部网状链接，并确保 Canonical 规范标签与收录指令正确。（本期不做正文链接 HTTP 批量探测。）"
  }
];
  global.ONPAGE_SPEC_ROWS = [
  {
    "metric": "Title 长度",
    "metricMax": 6,
    "score": 6,
    "sev": "pass",
    "problem": "当前：标题「{titleText}」；长度 {length} 字符（推荐 30-60）。\n结论：标题长度合理。\n【变量】{titleText}：首个 title 纯文本；{length}：Display Length。",
    "suggestion": "建议：保持当前配置。"
  },
  {
    "metric": "Title 长度",
    "metricMax": 6,
    "score": 4,
    "sev": "advice",
    "problem": "当前：标题「{titleText}」；长度 {length} 字符（推荐 30-60）。\n结论：标题存在但长度偏离。\n【变量】{titleText}：标题文本；{length}：Display Length。",
    "suggestion": "建议：将标题收束或扩展至 30-60 字符。"
  },
  {
    "metric": "Title 长度",
    "metricMax": 6,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `<title>` 标签。\n结论：缺少 Title，搜索引擎无法识别页面标题。\n【变量】无。",
    "suggestion": "建议：在 `<head>` 内补充唯一 `<title>`，写入 30-60 字符页面标题。"
  },
  {
    "metric": "Title 长度",
    "metricMax": 6,
    "score": 0,
    "sev": "issue",
    "problem": "当前：存在 `<title>` 标签，但内容为空。\n结论：Title 标签为空，等同于无有效标题。\n【变量】无。",
    "suggestion": "建议：在 `<title>` 内写入与本页主题一致的非空标题文案。"
  },
  {
    "metric": "Title 长度",
    "metricMax": 6,
    "score": 0,
    "sev": "issue",
    "problem": "当前：标题「{titleText}」；长度 {length} 字符（推荐 30-60）。\n结论：Title 长度严重不合规。\n【变量】{titleText}；{length}：Display Length。",
    "suggestion": "建议：将标题改写为 30-60 字符的唯一页面标题。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 10,
    "sev": "pass",
    "problem": "当前：目标词「{targetKeyword}」位于标题前 {positionPct}% 区域。\n结论：关键词布局优秀。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比。",
    "suggestion": "建议：保持当前关键词布局方式。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 7,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」位于标题第 {positionPct}% 位置。\n结论：关键词位置偏中，主题权重传递一般。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比。",
    "suggestion": "建议：将目标词前移至标题前半部分。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 5,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」位于标题后 {positionPct}%。\n结论：关键词位置偏后，主题权重传递较弱。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比。",
    "suggestion": "建议：将目标词前移至标题前半部分，并保留核心卖点。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 2,
    "sev": "advice",
    "problem": "当前：标题未包含完整目标词，仅匹配部分词片段（命中率 {sliceHitRate}%）。\n结论：目标词体现不完整。\n【变量】{sliceHitRate}：目标词切片命中率。",
    "suggestion": "建议：在可读前提下将完整目标词自然写入标题。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 0,
    "sev": "issue",
    "problem": "当前：标题未包含目标词。\n结论：标题与目标主题相关性不足。",
    "suggestion": "建议：自然加入完整目标词，并保留可读性与核心卖点。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `<title>` 标签。\n结论：无法评估 Title 目标词布局。\n【变量】无。",
    "suggestion": "建议：先补充有效 Title，再写入目标词。"
  },
  {
    "metric": "Title 目标词",
    "metricMax": 10,
    "score": 0,
    "sev": "issue",
    "problem": "当前：存在 `<title>` 标签，但内容为空。\n结论：无法评估 Title 目标词布局。\n【变量】无。",
    "suggestion": "建议：在 Title 内写入含目标词的非空标题。"
  },
  {
    "metric": "Meta 长度",
    "metricMax": 4,
    "score": 4,
    "sev": "pass",
    "problem": "当前：摘要「{metaText}」；长度 {length} 字符。\n结论：描述长度合理。\n【变量】{metaText}：首个 description 的 content；{length}：Display Length。",
    "suggestion": "建议：保持当前摘要。"
  },
  {
    "metric": "Meta 长度",
    "metricMax": 4,
    "score": 2,
    "sev": "advice",
    "problem": "当前：摘要「{metaText}」；长度 {length} 字符。\n结论：摘要存在但长度偏离。\n【变量】{metaText}：摘要文本；{length}：Display Length。",
    "suggestion": "建议：调整至 120-160 字符。"
  },
  {
    "metric": "Meta 长度",
    "metricMax": 4,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `meta[name=description]` 标签。\n结论：缺少 Meta 描述，搜索结果无法展示摘要。\n【变量】无。",
    "suggestion": "建议：在 `<head>` 内补充 `<meta name=\"description\" content=\"...\">`。"
  },
  {
    "metric": "Meta 长度",
    "metricMax": 4,
    "score": 0,
    "sev": "issue",
    "problem": "当前：存在 `meta[name=description]`，但 content 为空。\n结论：描述标签为空，等同于无有效摘要。\n【变量】无。",
    "suggestion": "建议：写入 120-160 字符的非空 Meta 描述。"
  },
  {
    "metric": "Meta 长度",
    "metricMax": 4,
    "score": 0,
    "sev": "issue",
    "problem": "当前：摘要「{metaText}」；长度 {length} 字符。\n结论：描述长度严重不合规。\n【变量】{metaText}；{length}：Display Length。",
    "suggestion": "建议：将摘要改写为 120-160 字符。"
  },
  {
    "metric": "Meta 目标词",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：目标词「{targetKeyword}」位于摘要前 {positionPct}% 区域。\n结论：摘要与目标主题关联良好。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：位置占比。",
    "suggestion": "建议：保持当前关键词布局，利于提升点击率。"
  },
  {
    "metric": "Meta 目标词",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」位于摘要第 {positionPct}% 处；或未含完整词时切片命中率 {sliceHitRate}%。\n结论：完整词位置偏后，或仅部分匹配目标词。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：完整词在摘要中的位置占比；{sliceHitRate}：无完整词时的切片命中率。",
    "suggestion": "建议：将完整目标词自然写入摘要前半段。"
  },
  {
    "metric": "Meta 目标词",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：Meta 未包含目标词（完整词与切片均未命中）。\n结论：摘要与目标主题关联度不足。",
    "suggestion": "建议：自然加入目标词，提高搜索结果相关性。"
  },
  {
    "metric": "Meta 目标词",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `meta[name=description]` 标签。\n结论：无法评估 Meta 目标词。\n【变量】无。",
    "suggestion": "建议：先补充有效 Meta 描述，再写入目标词。"
  },
  {
    "metric": "Meta 目标词",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：存在 description 标签，但 content 为空。\n结论：无法评估 Meta 目标词。\n【变量】无。",
    "suggestion": "建议：写入含目标词的非空 Meta 描述。"
  },
  {
    "metric": "文意一致性",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：摘要与正文开篇 Jaccard 相似度 {jaccard}。\n结论：摘要与正文开头呼应良好。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：保持摘要与开篇内容的高相关性。"
  },
  {
    "metric": "文意一致性",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：摘要与正文开篇 Jaccard 相似度 {jaccard}。\n结论：摘要与开篇内容略脱节。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：用正文首段核心内容改写摘要。"
  },
  {
    "metric": "文意一致性",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：摘要与正文开篇 Jaccard 相似度 {jaccard}。\n结论：摘要几乎未覆盖正文开篇要点。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：丰富正文开篇内容，再基于首段重写摘要。"
  },
  {
    "metric": "文意一致性",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `meta[name=description]` 标签。\n结论：无法比对摘要与正文开篇。\n【变量】无。",
    "suggestion": "建议：先补充 Meta 描述，再对齐正文开篇。"
  },
  {
    "metric": "文意一致性",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：存在 description 标签，但 content 为空。\n结论：无法比对摘要与正文开篇。\n【变量】无。",
    "suggestion": "建议：写入与正文开篇一致的非空 Meta 描述。"
  },
  {
    "metric": "H1 唯一性",
    "metricMax": 4,
    "score": 4,
    "sev": "pass",
    "problem": "当前：检测到 {h1Count} 个 H1 标签。\n结论：主标题数量规范，主题入口清晰。\n【变量】{h1Count}：H1 数量。",
    "suggestion": "建议：保持页面仅有一个 H1 主标题。"
  },
  {
    "metric": "H1 唯一性",
    "metricMax": 4,
    "score": 2,
    "sev": "advice",
    "problem": "当前：检测到 {h1Count} 个 H1 标签。\n结论：页面主标题定义冲突，权重分散。\n【变量】{h1Count}：H1 数量。",
    "suggestion": "建议：保留唯一主 H1，其余改为 H2 或 H3。"
  },
  {
    "metric": "H1 唯一性",
    "metricMax": 4,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 H1 标签。\n结论：页面缺少明确主题入口。",
    "suggestion": "建议：添加唯一 H1 并概括页面核心主题。"
  },
  {
    "metric": "H1 长度规范",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：H1 长度 {length} 字符（推荐 ≤ 40 字符）。\n结论：主标题简练，概括性良好。\n【变量】{length}：字符长度。",
    "suggestion": "建议：保持 H1 精简概括。"
  },
  {
    "metric": "H1 长度规范",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 H1 标签。\n结论：无法评估 H1 长度。\n【变量】无。",
    "suggestion": "建议：添加唯一 H1 并写入非空主题文案。"
  },
  {
    "metric": "H1 长度规范",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：检测到 1 个 H1，但文本为空。\n结论：H1 无有效内容，长度视为 0。\n【变量】无。",
    "suggestion": "建议：在 H1 内写入概括页面主题的非空文案。"
  },
  {
    "metric": "H1 长度规范",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：H1 长度 {length} 字符（推荐 ≤ 40 字符）。\n结论：主标题略长，影响阅读与概括性。\n【变量】{length}：字符长度。",
    "suggestion": "建议：压缩 H1 至 40 字符以内，保留核心主题。"
  },
  {
    "metric": "H1 长度规范",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：H1 长度 {length} 字符（推荐 ≤ 40 字符）。\n结论：H1 过长，呈段落式表述。\n【变量】{length}：字符长度。",
    "suggestion": "建议：拆分为简短 H1 + 副标题或正文段落。"
  },
  {
    "metric": "H1 目标词",
    "metricMax": 5,
    "score": 5,
    "sev": "pass",
    "problem": "当前：目标词「{targetKeyword}」位于 H1 前 {positionPct}% 区域。\n结论：主标题主题信号清晰。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比。",
    "suggestion": "建议：保持当前 H1 关键词布局。"
  },
  {
    "metric": "H1 目标词",
    "metricMax": 5,
    "score": 3,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」位于 H1 后 {positionPct}%。\n结论：关键词位置偏后，主题信号较弱。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比。",
    "suggestion": "建议：将目标词自然前移至 H1 前半部分。"
  },
  {
    "metric": "H1 目标词",
    "metricMax": 5,
    "score": 2,
    "sev": "advice",
    "problem": "当前：H1 未包含完整目标词，仅匹配部分词片段（命中率 {sliceHitRate}%）。\n结论：目标词体现不完整。\n【变量】{sliceHitRate}：目标词切片命中率。",
    "suggestion": "建议：在可读前提下将完整目标词写入 H1。"
  },
  {
    "metric": "H1 目标词",
    "metricMax": 5,
    "score": 0,
    "sev": "issue",
    "problem": "当前：H1 未包含目标词。\n结论：主题信号较弱，与目标主题关联不足。",
    "suggestion": "建议：将目标词自然融入 H1 标题。"
  },
  {
    "metric": "H1 目标词",
    "metricMax": 5,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 H1 标签。\n结论：无法评估 H1 目标词。\n【变量】无。",
    "suggestion": "建议：添加唯一 H1 并写入目标词。"
  },
  {
    "metric": "H1 目标词",
    "metricMax": 5,
    "score": 0,
    "sev": "issue",
    "problem": "当前：存在 H1 标签，但文本为空。\n结论：无法评估 H1 目标词。\n【变量】无。",
    "suggestion": "建议：在 H1 内写入含目标词的非空文案。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：Title 与 H1 分词 Jaccard 相似度 {jaccard}。\n结论：两者差异化明显，语义覆盖互补。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：保持 Title 与 H1 的不同表述角度。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 2,
    "sev": "advice",
    "problem": "当前：Title 与 H1 分词 Jaccard 相似度 {jaccard}。\n结论：两者重复度偏高。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：H1 用更具体、更贴近正文的角度重新表述。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：Title 与 H1 分词 Jaccard 相似度 {jaccard}。\n结论：两者几乎完全重复，存在堆砌风险。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：重写 H1 为页面专属卖点句，避免照搬 Title。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `<title>`。\n结论：无法对比 Title 与 H1。\n【变量】无。",
    "suggestion": "建议：补充 Title 与 H1 后再评估差异化。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：Title 标签无有效文本。\n结论：无法对比 Title 与 H1。\n【变量】无。",
    "suggestion": "建议：写入非空 Title 与差异化 H1。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 H1。\n结论：无法对比 Title 与 H1。\n【变量】无。",
    "suggestion": "建议：补充 H1 后再与 Title 区分表述。"
  },
  {
    "metric": "Title/H1差异化",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：H1 无有效文本。\n结论：无法对比 Title 与 H1。\n【变量】无。",
    "suggestion": "建议：写入非空 H1，并与 Title 差异化表述。"
  },
  {
    "metric": "子标题含目标词",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：H2-H6 共 {subHeadingCount} 个，其中 {matchCount} 处含目标词相关表达。\n结论：副标题已承接目标词，结构合理。\n【变量】{subHeadingCount}：副标题数；{matchCount}：命中数。",
    "suggestion": "建议：继续维持章节化语义结构。"
  },
  {
    "metric": "子标题含目标词",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：H2-H6 共 {subHeadingCount} 个，均未匹配目标词。\n结论：副标题未覆盖目标主题。\n【变量】{subHeadingCount}：H2–H6 副标题数量。",
    "suggestion": "建议：在相关章节 H2 中自然加入目标词或相关短语。"
  },
  {
    "metric": "子标题含目标词",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 H2-H6 副标题。\n结论：全篇缺少层级结构，不利于阅读与主题展开。",
    "suggestion": "建议：为长文增加分节 H2/H3 副标题。"
  },
  {
    "metric": "层级无跳级",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：标题层级跳级次数 {skipCount} 次。\n结论：标题层级连贯，无断层。\n【变量】{skipCount}：标题跳级次数。",
    "suggestion": "建议：保持 H1→H2→H3 递进结构。"
  },
  {
    "metric": "层级无跳级",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：标题层级跳级次数 {skipCount} 次。\n结论：存在 1 处标题跳级，结构略断层。\n【变量】{skipCount}：标题跳级次数。",
    "suggestion": "建议：插入缺失级别标题或调整标签层级。"
  },
  {
    "metric": "层级无跳级",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：标题层级跳级次数 {skipCount} 次。\n结论：标题层级严重混乱，影响解析。\n【变量】{skipCount}：标题跳级次数。",
    "suggestion": "建议：重排为 H1→H2→H3 递进结构，消除跳级。"
  },
  {
    "metric": "正文字数",
    "metricMax": 6,
    "score": 6,
    "sev": "pass",
    "problem": "当前：正文共 {wordCount} 词（推荐 ≥ 500 词）。\n结论：内容篇幅充足，信息密度良好。\n【变量】{wordCount}：主文词数。",
    "suggestion": "建议：继续保持高质量内容输出。"
  },
  {
    "metric": "正文字数",
    "metricMax": 6,
    "score": 4,
    "sev": "advice",
    "problem": "当前：正文共 {wordCount} 词（推荐 ≥ 500 词）。\n结论：内容略少，可进一步增强主题覆盖。\n【变量】{wordCount}：主文词数。",
    "suggestion": "建议：增加案例、参数说明或相关问题解答。"
  },
  {
    "metric": "正文字数",
    "metricMax": 6,
    "score": 2,
    "sev": "advice",
    "problem": "当前：正文共 {wordCount} 词（推荐 ≥ 500 词）。\n结论：内容明显不足，难以完整覆盖主题。\n【变量】{wordCount}：主文词数。",
    "suggestion": "建议：补充产品介绍、使用场景、FAQ 等内容。"
  },
  {
    "metric": "正文字数",
    "metricMax": 6,
    "score": 0,
    "sev": "issue",
    "problem": "当前：正文共 {wordCount} 词（推荐 ≥ 500 词）。\n结论：内容极度匮乏，属于空壳页面。\n【变量】{wordCount}：主文词数。",
    "suggestion": "建议：整段重写并充实主体论证与细节信息。"
  },
  {
    "metric": "含词次数",
    "metricMax": 6,
    "score": 6,
    "sev": "pass",
    "problem": "当前：目标词「{targetKeyword}」出现 {freq} 次，密度 {density}%。\n结论：词频合理，主题强调充分。\n【变量】{targetKeyword}：本项计分所用的目标词；{freq}：目标词出现次数；{density}：目标词密度。",
    "suggestion": "建议：维持健康的词频与自然表达。"
  },
  {
    "metric": "含词次数",
    "metricMax": 6,
    "score": 4,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」出现 {freq} 次，密度 {density}%。\n结论：词频未达最优档，主题强调略弱。\n【变量】{targetKeyword}：本项计分所用的目标词；{freq}：目标词出现次数；{density}：目标词密度。",
    "suggestion": "建议：在正文相关位置自然增加至 3 次以上。"
  },
  {
    "metric": "含词次数",
    "metricMax": 6,
    "score": 2,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」出现 {freq} 次，密度 {density}%。\n结论：主题强调不足。\n【变量】{targetKeyword}：本项计分所用的目标词；{freq}：目标词出现次数；{density}：目标词密度。",
    "suggestion": "建议：在小标题或段落中自然补充目标词。"
  },
  {
    "metric": "含词次数",
    "metricMax": 6,
    "score": 0,
    "sev": "issue",
    "problem": "当前：正文未出现目标词。\n结论：正文与目标主题严重脱节。",
    "suggestion": "建议：在首段与主体各安排至少一次完整目标词。"
  },
  {
    "metric": "堆砌告警",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：目标词「{targetKeyword}」出现 {freq} 次，密度 {density}%。\n结论：词频自然，无堆砌风险。\n【变量】{targetKeyword}：本项计分所用的目标词；{freq}：目标词出现次数；{density}：目标词密度。",
    "suggestion": "建议：保持上下文流畅表达。"
  },
  {
    "metric": "堆砌告警",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」出现 {freq} 次，密度 {density}%。\n结论：词频偏高，接近堆砌边缘。\n【变量】{targetKeyword}：本项计分所用的目标词；{freq}：目标词出现次数；{density}：目标词密度。",
    "suggestion": "建议：用代词与同义词替换部分重复出现。"
  },
  {
    "metric": "堆砌告警",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：目标词「{targetKeyword}」出现 {freq} 次，密度 {density}%。\n结论：存在关键词堆砌风险，可能触发降权。\n【变量】{targetKeyword}：本项计分所用的目标词；{freq}：目标词出现次数；{density}：目标词密度。",
    "suggestion": "建议：删除无意义重复，改用代词与相关表达。"
  },
  {
    "metric": "首段点题",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：目标词「{targetKeyword}」首次出现在正文前 {positionPct}%。\n结论：开篇点题及时，主题切入清晰。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比；{wordPosition}：目标词首次出现词序。",
    "suggestion": "建议：保持首段快速切入主题。"
  },
  {
    "metric": "首段点题",
    "metricMax": 3,
    "score": 2,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」首次出现在正文前 {positionPct}%。\n结论：目标词首现偏晚，开篇切入略慢。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比；{wordPosition}：目标词首次出现词序。",
    "suggestion": "建议：将目标词前移至开篇两句内。"
  },
  {
    "metric": "首段点题",
    "metricMax": 3,
    "score": 1,
    "sev": "advice",
    "problem": "当前：目标词「{targetKeyword}」首次出现在正文 {positionPct}% 处。\n结论：开篇点题不足，主题引入滞后。\n【变量】{targetKeyword}：本项计分所用的目标词；{positionPct}：目标词在文本中的位置占比；{wordPosition}：目标词首次出现词序。",
    "suggestion": "建议：在首段首句自然纳入目标词并说明页面主题。"
  },
  {
    "metric": "首段点题",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：正文首段未出现目标词。\n结论：主题切入不明确，无法开篇点题。",
    "suggestion": "建议：先在正文中补足目标词，再在首段自然引入。"
  },
  {
    "metric": "文题一致",
    "metricMax": 5,
    "score": 5,
    "sev": "pass",
    "problem": "当前：Title 与正文开篇 Jaccard 相似度 {jaccard}。\n结论：标题与正文开头实体对齐良好。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：保持标题与开篇内容的高度切题。"
  },
  {
    "metric": "文题一致",
    "metricMax": 5,
    "score": 3,
    "sev": "advice",
    "problem": "当前：Title 与正文开篇 Jaccard 相似度 {jaccard}。\n结论：标题与开篇关联度一般。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：将 Title 中的核心名词自然复述到首段首句。"
  },
  {
    "metric": "文题一致",
    "metricMax": 5,
    "score": 1,
    "sev": "advice",
    "problem": "当前：Title 与正文开篇 Jaccard 相似度 {jaccard}。\n结论：标题与正文重叠度极低，叙述脱节。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：增加与 Title 词汇一致的同段复述，或调整标题。"
  },
  {
    "metric": "文题一致",
    "metricMax": 5,
    "score": 0,
    "sev": "issue",
    "problem": "当前：Title 与正文开篇 Jaccard 相似度 {jaccard}。\n结论：标题与正文内容严重脱节。\n【变量】{jaccard}：Jaccard 相似度。",
    "suggestion": "建议：重写首段对齐标题，或更换更贴合正文的标题。"
  },
  {
    "metric": "文题一致",
    "metricMax": 5,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到 `<title>` 标签。\n结论：无法比对标题与正文开篇。\n【变量】无。",
    "suggestion": "建议：补充 Title 后再评估文题一致。"
  },
  {
    "metric": "文题一致",
    "metricMax": 5,
    "score": 0,
    "sev": "issue",
    "problem": "当前：Title 标签无有效文本。\n结论：无法比对标题与正文开篇。\n【变量】无。",
    "suggestion": "建议：写入非空 Title 并与正文开篇对齐。"
  },
  {
    "metric": "Alt非空",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：主文区共 {imgTotal} 张图片，{altMissing} 张缺少 Alt（缺失率 {missingRate}%）。\n结论：{altConclusion}。\n【变量】{imgTotal}；{altMissing}；{missingRate}；{altConclusion}：无图跳过/Alt 完整。",
    "suggestion": "建议：维持规范的图片 Alt 管理。"
  },
  {
    "metric": "Alt非空",
    "metricMax": 3,
    "score": 1,
    "sev": "advice",
    "problem": "当前：主文区共 {imgTotal} 张图片，{altMissing} 张缺少 Alt（缺失率 {missingRate}%）。\n结论：部分图片 SEO 信息不完整。\n【变量】{imgTotal}：主文图片总数；{altMissing}：缺 Alt 的图片数；{missingRate}：Alt 缺失率。",
    "suggestion": "建议：为缺失图片补充准确、描述性的 Alt 文本。"
  },
  {
    "metric": "Alt非空",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：主文区共 {imgTotal} 张图片，{altMissing} 张缺少 Alt（缺失率 {missingRate}%）。\n结论：大量图片缺少 Alt，影响图片 SEO 与无障碍。\n【变量】{imgTotal}：主文图片总数；{altMissing}：缺 Alt 的图片数；{missingRate}：Alt 缺失率。",
    "suggestion": "建议：批量为文章图片补全说明性 Alt 文本。"
  },
  {
    "metric": "主文图片含词",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：主文区 {imgTotal} 张图片，{kwImgCount} 张 Alt 含目标词相关表达。\n结论：图片已与检索主题挂钩。\n【变量】{imgTotal}：主文图片总数；{kwImgCount}：Alt 含目标词的图片数。",
    "suggestion": "建议：保持图文并茂的优质排版。"
  },
  {
    "metric": "主文图片含词",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：主文区 {imgTotal} 张图片，均未在 Alt 中包含目标词。\n结论：图片描述与目标主题未关联。\n【变量】{imgTotal}：主文图片总数。",
    "suggestion": "建议：在任意一张关联图片的 Alt 中自然加入目标词。"
  },
  {
    "metric": "主文图片含词",
    "metricMax": 2,
    "score": 0,
    "sev": "issue",
    "problem": "当前：正文图片数量 0 张。\n结论：页面缺少视觉辅助内容。",
    "suggestion": "建议：增加与主题相关的图片、图表或产品截图。"
  },
  {
    "metric": "Slug含词",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：URL 路径为「{slug}」，本页豁免英文 Slug 含词检测。\n结论：无需检查英文路径含词。\n【变量】{slug}：URL 路径末段。",
    "suggestion": "建议：保持现状。"
  },
  {
    "metric": "Slug含词",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：URL 路径「{slug}」已包含目标词「{targetKeyword}」或别名。\n结论：路径语义与目标主题呼应良好。\n【变量】{slug}：URL 路径末段；{targetKeyword}：本项计分所用的目标词。",
    "suggestion": "建议：维持规范的 URL 命名习惯。"
  },
  {
    "metric": "Slug含词",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：URL 路径「{slug}」未包含目标词。\n结论：路径未体现目标主题，语义价值不足。\n【变量】{slug}：URL 路径末段。",
    "suggestion": "建议：新发布页面时在路径中写入目标词英文或别名。"
  },
  {
    "metric": "HTTPS加密",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：页面协议为 HTTPS。\n结论：单页访问已加密。\n【变量】{pageProtocol}：最终 URL 协议（https/http）。",
    "suggestion": "建议：保持全站 HTTPS（站点级见第二部分）。"
  },
  {
    "metric": "HTTPS加密",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：页面协议为 HTTP，未加密访问。\n结论：影响安全与 SEO 信号。\n【变量】{pageProtocol}：http。",
    "suggestion": "建议：配置全站 HTTPS 与 301 跳转（站点级见第二部分）。"
  },
  {
    "metric": "文本代码比",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：文本/代码比 {ratio}%。\n结论：可见内容占比健康。\n【变量】{ratio}：文本代码比。",
    "suggestion": "建议：保持干练的前端代码结构。"
  },
  {
    "metric": "文本代码比",
    "metricMax": 3,
    "score": 2,
    "sev": "advice",
    "problem": "当前：文本/代码比 {ratio}%。\n结论：模板代码占比偏高，有效文本偏少。\n【变量】{ratio}：文本代码比。",
    "suggestion": "建议：减少内联代码和重复的导航模块，或扩写正文。"
  },
  {
    "metric": "文本代码比",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：文本/代码比 {ratio}%。\n结论：可见文本极度匮乏。\n【变量】{ratio}：文本代码比。",
    "suggestion": "建议：修复渲染问题或移除巨量无用脚本，充实正文。"
  },
  {
    "metric": "同站有效内链",
    "metricMax": 6,
    "score": 6,
    "sev": "pass",
    "problem": "当前：正文含 {internalLinkCount} 个同域内链（eTLD+1），高相关内链 {relevantLinkCount} 个。\n结论：正文具备有效的站内关联出口。\n【变量】{internalLinkCount}：同域内链数；{relevantLinkCount}：高相关内链数。",
    "suggestion": "建议：继续保持与主题相关的站内推荐链接。"
  },
  {
    "metric": "同站有效内链",
    "metricMax": 6,
    "score": 3,
    "sev": "advice",
    "problem": "当前：正文含 {internalLinkCount} 个同域内链，但高相关内链 0 个。\n结论：内链锚文本缺乏语义描述。\n【变量】{internalLinkCount}：同域内链数。",
    "suggestion": "建议：将锚文本改为含实体关键词的描述性文字。"
  },
  {
    "metric": "同站有效内链",
    "metricMax": 6,
    "score": 0,
    "sev": "issue",
    "problem": "当前：正文同域内链 {internalLinkCount} 个。\n结论：缺少站内流转。\n【变量】{internalLinkCount}：同域内链数。",
    "suggestion": "建议：增加指向相关产品/分类/文章页的内链。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 8,
    "sev": "pass",
    "problem": "当前：{indexabilitySummary}；Canonical {canonicalUrl}。\n结论：收录信号正常。\n【变量】{indexabilitySummary}：如无 noindex、已声明规范 URL 等简述；{canonicalUrl}：本条有效 Canonical 的 href（https 绝对、同 eTLD+1 指本页）。",
    "suggestion": "建议：保持标准配置。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 5,
    "sev": "advice",
    "problem": "当前：{canonicalIssueDetail}；Canonical {canonicalUrl}（未声明时填「—」）。\n结论：建议补充规范 URL。\n【变量】{canonicalIssueDetail}：固定为「未声明 Canonical」；{canonicalUrl}：无标签时输出「—」，勿留空。",
    "suggestion": "建议：补充一条指向本页标准 URL 的 https 绝对 Canonical。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 5,
    "sev": "advice",
    "problem": "当前：{canonicalIssueDetail}；Canonical {canonicalUrl}。\n结论：建议合并为单条 Canonical。\n【变量】{canonicalIssueDetail}：固定为「多条 Canonical 且 href 相同（冗余）」；{canonicalUrl}：去重后的主要 href。",
    "suggestion": "建议：仅保留一条指向本页标准 URL 的 Canonical。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 5,
    "sev": "advice",
    "problem": "当前：{canonicalIssueDetail}；Canonical {canonicalUrl}。\n结论：建议改为 https 绝对 URL。\n【变量】{canonicalIssueDetail}：固定为「Canonical 为相对路径」；{canonicalUrl}：页面上的原始 href（相对或协议相对）。",
    "suggestion": "建议：改为指向本页标准 URL 的 https 绝对 Canonical。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 0,
    "sev": "issue",
    "problem": "当前：{canonicalIssueDetail}；Canonical {canonicalUrl}（若有则一并展示）。\n结论：页面禁止收录。\n【变量】{canonicalIssueDetail}：固定为「存在 noindex」；{canonicalUrl}：若同时存在 Canonical 则输出其 href，否则「—」。",
    "suggestion": "建议：移除误伤的 noindex；保留一条指向本页标准 URL 的 Canonical。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 0,
    "sev": "issue",
    "problem": "当前：{canonicalIssueDetail}；Canonical {canonicalUrl}。\n结论：规范 URL 指向他域。\n【变量】{canonicalIssueDetail}：固定为「Canonical 指向其他注册域」；{canonicalUrl}：指向他域的 href。",
    "suggestion": "建议：改为指向本页（同 eTLD+1）标准 URL 的单条 Canonical。"
  },
  {
    "metric": "收录规范",
    "metricMax": 8,
    "score": 0,
    "sev": "issue",
    "problem": "当前：{canonicalIssueDetail}；Canonical {canonicalUrl}（主冲突 href 或列表摘要）。\n结论：规范 URL 冲突，收录判断受阻。\n【变量】{canonicalIssueDetail}：固定为「多条 Canonical 且 href 不同（冲突）」；{canonicalUrl}：首选展示冲突 href 列表或主 href（实现可附 {canonicalUrlsList}）。",
    "suggestion": "建议：仅保留一条指向本页标准 URL 的 Canonical，删除其余冲突声明。"
  },
  {
    "metric": "社媒分享协议",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：已配置 og:title、og:description、og:image、twitter:card。\n结论：社媒分享协议配置完整。",
    "suggestion": "建议：保持 OG 与 Twitter 配置。"
  },
  {
    "metric": "社媒分享协议",
    "metricMax": 3,
    "score": 1,
    "sev": "advice",
    "problem": "当前：已配置 {ogConfigured}，缺失项 {missingOgTags}。\n结论：社媒分享配置不完整。\n【变量】{ogConfigured}：已配置项列表；{missingOgTags}：缺失项（仅本档展示）。",
    "suggestion": "建议：补齐 `property=\"og:image\"` 与 `name=\"twitter:card\"`。"
  },
  {
    "metric": "社媒分享协议",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到有效社媒分享标签（{missingOgTags}）。\n结论：分享无预览卡片。",
    "suggestion": "建议：补齐 `og:title`、`og:description`、`og:image`、`twitter:card` 四项 meta，且 content 均非空。"
  },
  {
    "metric": "Hreflang 多语言",
    "metricMax": 2,
    "score": 2,
    "sev": "pass",
    "problem": "当前：检测到 {hreflangCount} 个 hreflang 标签，含 x-default。\n结论：多语言声明完整。\n【变量】{hreflangCount}：hreflang 标签数。",
    "suggestion": "建议：保持 hreflang 配置。"
  },
  {
    "metric": "Hreflang 多语言",
    "metricMax": 2,
    "score": 1,
    "sev": "advice",
    "problem": "当前：检测到 {hreflangCount} 个 hreflang 标签，{hreflangIssue}。\n结论：多语言标签未成对或缺少默认语种兜底。\n【变量】{hreflangCount}：hreflang 标签数；{hreflangIssue}：hreflang 问题简述。",
    "suggestion": "建议：补充成对 hreflang 标签及 hreflang=\"x-default\"。"
  },
  {
    "metric": "结构化数据",
    "metricMax": 3,
    "score": 3,
    "sev": "pass",
    "problem": "当前：检测到 {schemaFormat}，类型 {schemaType}，解析成功。\n结论：结构化数据有效。\n【变量】{schemaFormat}：JSON-LD/Microdata/RDFa；{schemaType}：@type。",
    "suggestion": "建议：保持规范，争取富媒体结果。"
  },
  {
    "metric": "结构化数据",
    "metricMax": 3,
    "score": 1,
    "sev": "advice",
    "problem": "当前：检测到标记但 {schemaIssueDetail}。\n结论：无法被 Google 正确识别。\n【变量】{schemaIssueDetail}：失败原因简述。",
    "suggestion": "建议：修复语法或改用 Search Gallery 支持的类型。"
  },
  {
    "metric": "结构化数据",
    "metricMax": 3,
    "score": 0,
    "sev": "issue",
    "problem": "当前：未检测到有效结构化数据。\n结论：缺少富媒体结果线索。",
    "suggestion": "建议：按页面类型植入 Article/Product 等标准标记。"
  }
];
  global.ONPAGE_SPEC_METRIC_ORDER = {
  "title": [
    "Title 长度",
    "Title 目标词",
    "Title/H1差异化"
  ],
  "meta": [
    "Meta 长度",
    "Meta 目标词",
    "文意一致性"
  ],
  "headings": [
    "H1 唯一性",
    "H1 长度规范",
    "H1 目标词",
    "子标题含目标词",
    "层级无跳级"
  ],
  "body": [
    "正文字数",
    "含词次数",
    "堆砌告警",
    "首段点题",
    "文题一致"
  ],
  "media": [
    "Alt非空",
    "主文图片含词"
  ],
  "url": [
    "Slug含词",
    "HTTPS加密"
  ],
  "code": [
    "文本代码比",
    "同站有效内链",
    "收录规范",
    "社媒分享协议",
    "Hreflang 多语言",
    "结构化数据"
  ]
};
})(typeof window !== 'undefined' ? window : globalThis);
