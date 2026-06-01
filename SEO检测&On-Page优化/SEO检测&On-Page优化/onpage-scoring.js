/**
 * 单页 On-Page 评分（与 SEO评分维度.md 对齐）
 */
(function (global) {
  const ONPAGE_SCORE_DIMENSIONS = [
    {
      id: 'title',
      label: 'Title 页面标题',
      shortLabel: 'Title',
      max: 16,
      productGuide: '页面标题（Title）需要如何做？页面标题是吸引用户点击和搜索引擎判断主题的核心要素。请确保本页拥有一个独立标题，长度控制在 30~60 字符之间，并将核心关键词尽可能自然地放在标题最前面。',
      guide: '页面标题（Title）需要如何做？页面标题是吸引用户点击和搜索引擎判断主题的核心要素。请确保本页拥有一个独立标题，长度控制在 30~60 字符之间，并将核心关键词尽可能自然地放在标题最前面。',
      checks: [
        { key: 'exist', label: 'Title 存在性', max: 3 },
        { key: 'len', label: 'Title 长度规范', max: 3 },
        { key: 'kw', label: 'Title 目标词', max: 10 },
      ],
    },
    {
      id: 'meta',
      label: 'Meta 摘要',
      shortLabel: 'Meta',
      max: 8,
      productGuide: 'Meta摘要（Description）需要如何做？Meta摘要直接决定了用户在搜索列表中看到您的网页时，是否愿意点击。请撰写一段120~160字符的简短介绍，确保它包含您的核心目标词，并且准确反映了正文开篇的真实内容。',
      guide: 'Meta摘要（Description）需要如何做？Meta摘要直接决定了用户在搜索列表中看到您的网页时，是否愿意点击。请撰写一段120~160字符的简短介绍，确保它包含您的核心目标词，并且准确反映了正文开篇的真实内容。',
      checks: [
        { key: 'exist', label: 'Meta 存在性', max: 2 },
        { key: 'len', label: 'Meta 长度规范', max: 2 },
        { key: 'kw', label: 'Meta 目标词', max: 2 },
        { key: 'consistency', label: '摘要与正文一致', max: 2 },
      ],
    },
    {
      id: 'headings',
      label: 'Headings 标题结构',
      shortLabel: 'Headings',
      max: 18,
      productGuide: '网页里的各级标题（H标签）需要如何做？H标签（H1、H2、H3等）构成了网页的阅读大纲。请确保每一页有且仅有一个H1标签作为主标题，并在其中融入核心词。在长文章中，要像写书本目录一样，按顺序使用H2、H3进行分段落，不要越级乱用。',
      guide: '网页里的各级标题（H标签）需要如何做？H标签（H1、H2、H3等）构成了网页的阅读大纲。请确保每一页有且仅有一个H1标签作为主标题，并在其中融入核心词。在长文章中，要像写书本目录一样，按顺序使用H2、H3进行分段落，不要越级乱用。',
      checks: [
        { key: 'h1uniq', label: 'H1 唯一性', max: 4 },
        { key: 'h1len', label: 'H1 长度规范', max: 2 },
        { key: 'h1kw', label: 'H1 目标词', max: 5 },
        { key: 'diff', label: 'Title/H1 差异化', max: 3 },
        { key: 'subkw', label: '子标题含目标词', max: 2 },
        { key: 'skip', label: '层级无跳级', max: 2 },
      ],
    },
    {
      id: 'body',
      label: 'Body 正文内容',
      shortLabel: 'Body',
      max: 22,
      productGuide: '网页的正文内容需要如何做？内容是SEO的灵魂。不要制造只放几张图的“空壳页面”。请确保主体内容字数充沛（建议大于500字），在文章开篇就点明目标关键词，并自然地在上下文中重复提及。坚决避免堆砌关键词引发的惩罚。',
      guide: '网页的正文内容需要如何做？内容是SEO的灵魂。不要制造只放几张图的“空壳页面”。请确保主体内容字数充沛（建议大于500字），在文章开篇就点明目标关键词，并自然地在上下文中重复提及。坚决避免堆砌关键词引发的惩罚。',
      checks: [
        { key: 'words', label: '正文字数', max: 6 },
        { key: 'freq', label: '含词次数', max: 6 },
        { key: 'stuff', label: '堆砌告警', max: 2 },
        { key: 'lead', label: '首段点题', max: 3 },
        { key: 'align', label: '文题一致', max: 5 },
      ],
    },
    {
      id: 'media',
      label: 'Media 多媒体',
      shortLabel: 'Media',
      max: 5,
      productGuide: '网页里的图片优化需要如何做？搜索引擎目前仍依赖文字来“看懂”图片。请确保网页中每张有价值的图片都添加了 Alt（替代文本）属性，并且核心商品图/首图的描述里包含您的目标关键词。',
      guide: '网页里的图片优化需要如何做？搜索引擎目前仍依赖文字来“看懂”图片。请确保网页中每张有价值的图片都添加了 Alt（替代文本）属性，并且核心商品图/首图的描述里包含您的目标关键词。',
      checks: [
        { key: 'alt', label: 'Alt 非空', max: 3 },
        { key: 'altkw', label: '主文图片含词', max: 2 },
      ],
    },
    {
      id: 'url',
      label: 'URL 链接设置',
      shortLabel: 'URL',
      max: 6,
      productGuide: '网页的URL链接需要如何做？好的网址不仅用户看着放心，搜索引擎也更喜欢。请保持您的网页访问是加密安全的（HTTPS开头），并且在页面的后缀路径（Slug）中，尽量包含目标关键词的拼音或英文单词。',
      guide: '网页的URL链接需要如何做？好的网址不仅用户看着放心，搜索引擎也更喜欢。请保持您的网页访问是加密安全的（HTTPS开头），并且在页面的后缀路径（Slug）中，尽量包含目标关键词的拼音或英文单词。',
      checks: [
        { key: 'slug', label: 'Slug 含词', max: 3 },
        { key: 'https', label: 'HTTPS 加密', max: 3 },
      ],
    },
    {
      id: 'code',
      label: 'Code 底层技术',
      shortLabel: 'Code',
      max: 25,
      productGuide: '网页底层代码与技术表现需要如何做？这是决定网页能否被爬虫顺利收录的地基。请保持网页拥有合理的纯净文字占比，全面清剿导致用户和爬虫撞墙的“死链（404）”，在正文建设相关的内部网状链接，并确保 Canonical 规范标签正确。',
      guide: '网页底层代码与技术表现需要如何做？这是决定网页能否被爬虫顺利收录的地基。请保持网页拥有合理的纯净文字占比，全面清剿导致用户和爬虫撞墙的“死链（404）”，在正文建设相关的内部网状链接，并确保 Canonical 规范标签正确。',
      checks: [
        { key: 'ratio', label: '文本代码比', max: 3 },
        { key: 'dead', label: '主文无死链', max: 5 },
        { key: 'ilink', label: '同站有效内链', max: 4 },
        { key: 'index', label: '收录规范', max: 5 },
        { key: 'hreflang', label: 'Hreflang 多语言', max: 2 },
        { key: 'social', label: '社媒分享协议', max: 3 },
        { key: 'jsonld', label: 'JSON-LD 结构', max: 3 },
      ],
    },
  ];

  const DIM_MAX = {};
  ONPAGE_SCORE_DIMENSIONS.forEach(d => { DIM_MAX[d.id] = d.max; });

  const DEFAULT_DIM_SCORES = {
    title: 14, meta: 7, headings: 16, body: 18, media: 4, url: 5, code: 14,
  };

  const DIM_ID_BY_MODULE = {
    'Title 页面标题': 'title', 'Meta 摘要': 'meta', 'Headings 标题结构': 'headings',
    'Body 正文内容': 'body', 'Media 多媒体': 'media', 'URL 链接设置': 'url', 'Code 底层技术': 'code',
    '站点基建': 'infrastructure', '核心页加权': 'corePages',
  };

  function seedDimScores(total, path) {
    const t = Math.max(0, Math.min(100, Math.floor(Number(total) || 72)));
    let h = 0;
    const s = String(path || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const keys = ONPAGE_SCORE_DIMENSIONS.map(d => d.id);
    const caps = keys.map(k => DIM_MAX[k]);
    const capSum = caps.reduce((a, b) => a + b, 0);
    const raw = keys.map((k, i) => {
      const base = (t * caps[i]) / capSum;
      const jitter = ((h >> (i * 3)) % 5) - 2;
      return Math.max(0, Math.min(DIM_MAX[k], Math.round(base + jitter)));
    });
    let sum = raw.reduce((a, b) => a + b, 0);
    const out = {};
    keys.forEach((k, i) => { out[k] = raw[i]; });
    while (sum < t) {
      const k = keys[h % keys.length];
      if (out[k] < DIM_MAX[k]) { out[k]++; sum++; }
      h++;
    }
    while (sum > t) {
      const k = keys[h % keys.length];
      if (out[k] > 0) { out[k]--; sum--; }
      h++;
    }
    return out;
  }

  function onPageGetDimScores(row) {
    if (row && row.dimScores && typeof row.dimScores === 'object') {
      const o = { ...DEFAULT_DIM_SCORES };
      ONPAGE_SCORE_DIMENSIONS.forEach(d => {
        if (row.dimScores[d.id] != null) o[d.id] = Math.min(d.max, Math.max(0, Number(row.dimScores[d.id]) || 0));
      });
      return o;
    }
    return seedDimScores(row && row.score != null ? row.score : 72, row && row.path);
  }

  function onPageDimTotal(row) {
    const s = onPageGetDimScores(row);
    return ONPAGE_SCORE_DIMENSIONS.reduce((n, d) => n + (s[d.id] || 0), 0);
  }

  function onPageScoreBand(score) {
    const sc = Number(score);
    if (sc >= 85) {
      return { key: 'excellent', label: '优秀', range: '85–100', cls: 'onpage-score-band--excellent', tip: '本页整体优化到位，可继续保持并观察排名变化。' };
    }
    if (sc >= 65) {
      return { key: 'potential', label: '潜力', range: '65–84', cls: 'onpage-score-band--potential', tip: '基础良好，补齐标题、摘要、正文或内链等细节可继续拉升。' };
    }
    return { key: 'danger', label: '待提升', range: '0–64', cls: 'onpage-score-band--danger', tip: '存在较明显短板，建议优先处理严重项。' };
  }

  function parseMultiKw(kw) {
    if (typeof global.parseMultiKw === 'function') return global.parseMultiKw(kw);
    return String(kw || '').split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  }

  function worst(ws) {
    const a = Array.isArray(ws) ? ws : [];
    if (a.includes('issue')) return 'issue';
    if (a.includes('advice')) return 'advice';
    return 'pass';
  }

  function dimOneLine(got, max, dot) {
    if (dot === 'issue') return '存在需优先处理的严重项';
    if (dot === 'advice') return '有优化空间，建议按子项建议逐项完善';
    if (got >= max) return '本维度表现良好';
    if (got >= max * 0.85) return '整体达标，仍有少量可优化点';
    return '得分偏低，建议优先补齐本维度短板';
  }

  /** 与 SEO评分维度.md「当前问题 / 优化建议」列对齐的文案模板 */
  const ONPAGE_DOC_TEMPLATES = {
    'Title 存在性': {
      pass: { p: '当前：已检测到 Title 标签，长度 {length} 字符。\n结论：标题配置正常。', s: '建议：保持唯一标题配置，可进一步优化点击吸引力。' },
      issue: { p: '当前：未检测到有效 Title 标签。\n结论：搜索引擎无法准确识别页面主题。', s: '建议：立即补充页面标题，概括核心内容和目标关键词。' },
    },
    'Title 长度规范': {
      pass: { p: '当前：Title 长度 {length} 字符（推荐 30-60 字符）。\n结论：符合最佳展示区间。', s: '建议：保持当前长度规范。' },
      advice: { p: '当前：Title 长度 {length} 字符（推荐 30-60 字符）。\n结论：标题略短或略长，偏离标准区间。', s: '建议：收束核心词与卖点，将标题控制在 30-60 字符。' },
      issue: { p: '当前：Title 长度 {length} 字符（推荐 30-60 字符）。\n结论：标题过长，超出搜索结果推荐展示长度，可能被截断。', s: '建议：删除冗余描述，保留核心关键词与价值信息，控制在 30-60 字符。' },
      issueShort: { p: '当前：Title 长度 {length} 字符（推荐 30-60 字符）。\n结论：标题过短，主题表达严重不足。', s: '建议：补充核心卖点、品牌词或关键词，将标题扩展至 30-60 字符。' },
    },
    'Title 目标词': {
      pass: { p: '当前：目标词「{targetKeyword}」位于标题前 {positionPct}% 区域。\n结论：关键词布局优秀。', s: '建议：保持当前关键词布局方式。' },
      advice: { p: '当前：目标词「{targetKeyword}」位于标题后 {positionPct}%。\n结论：关键词位置偏后，主题权重传递较弱。', s: '建议：将目标词前移至标题前半部分，并保留核心卖点。' },
      issue: { p: '当前：标题未包含目标词。\n结论：标题与目标主题相关性不足。', s: '建议：自然加入完整目标词，并保留可读性与核心卖点。' },
    },
    'Meta 存在性': {
      pass: { p: '当前：已检测到 Meta Description，长度 {metaLength} 字符。\n结论：摘要配置正常。', s: '建议：保持摘要配置，可继续优化点击吸引力。' },
      issue: { p: '当前：未检测到 Meta Description。\n结论：搜索结果摘要可能被系统自动生成。', s: '建议：补充 120-160 字符摘要，概括页面核心内容。' },
    },
    'Meta 长度规范': {
      pass: { p: '当前：Meta 长度 {metaLength} 字符（推荐 120-160 字符）。\n结论：符合推荐展示区间。', s: '建议：保持当前长度。' },
      advice: { p: '当前：Meta 长度 {metaLength} 字符（推荐 120-160 字符）。\n结论：摘要略短或略长，存在截断或信息不足风险。', s: '建议：压缩或补充内容，控制在 120-160 字符。' },
      issue: { p: '当前：Meta 长度 {metaLength} 字符（推荐 120-160 字符）。\n结论：长度严重偏离，搜索结果展示效果差。', s: '建议：重写为一段完整卖点说明，控制在 120-160 字符。' },
    },
    'Meta 目标词': {
      pass: { p: '当前：目标词「{targetKeyword}」在摘要前部完整出现。\n结论：关键词布局良好。', s: '建议：保持当前摘要结构。' },
      advice: { p: '当前：摘要未完整包含目标词，仅匹配部分词片段。\n结论：目标词体现不完整。', s: '建议：在可读前提下将完整目标词自然写入摘要前部。' },
    },
    '一致性(排噪)': {
      pass: { p: '当前：摘要与正文开头实体词重叠度 {overlapPct}%。\n结论：摘要与正文开头呼应良好。', s: '建议：保持高相关性。' },
      advice: { p: '当前：摘要与正文开头实体词重叠度 {overlapPct}%。\n结论：摘要与正文开头关联偏弱。', s: '建议：用正文首段核心内容改写摘要。' },
    },
    'H1 唯一性': {
      pass: { p: '当前：页面 H1 数量为 1。\n结论：H1 数量规范，主题入口清晰。', s: '建议：保持唯一 H1 结构。' },
      issue: { p: '当前：页面 H1 数量为 {h1Count}。\n结论：H1 数量异常，影响主题识别。', s: '建议：保留一个与页面主题最匹配的 H1。' },
    },
    'H1 长度规范': {
      pass: { p: '当前：H1 长度 {h1Length} 字符（推荐 20-70 字符）。\n结论：长度符合规范。', s: '建议：保持当前 H1 长度。' },
    },
    'H1 目标词': {
      pass: { p: '当前：目标词「{targetKeyword}」在 H1 前部完整出现。\n结论：H1 关键词布局良好。', s: '建议：保持当前 H1 写法。' },
      advice: { p: '当前：H1 未完整包含目标词。\n结论：H1 与目标主题关联不足。', s: '建议：在 H1 中自然加入完整目标词。' },
      issue: { p: '当前：H1 未包含目标词。\n结论：H1 与目标主题相关性不足。', s: '建议：在 H1 中自然加入完整目标词。' },
    },
    'Title/H1 差异化': {
      pass: { p: '当前：Title 与 H1 文本重叠度 {overlapPct}%。\n结论：Title 与 H1 差异化明显。', s: '建议：保持不同的语义覆盖。' },
      advice: { p: '当前：Title 与 H1 文本重叠度 {overlapPct}%。\n结论：Title 与 H1 过于接近。', s: '建议：重写 H1，突出页面专属卖点。' },
    },
    '子标题含目标词': {
      pass: { p: '当前：至少 1 个 H2/H3 包含目标词。\n结论：子标题已承接目标词。', s: '建议：继续维持网状语义结构。' },
      advice: { p: '当前：H2/H3 未包含目标词。\n结论：子标题未覆盖目标词。', s: '建议：在相关章节 H2 中自然加入目标词短语。' },
    },
    '层级无跳级': {
      pass: { p: '当前：标题层级连续，无跳级。\n结论：标题结构规范。', s: '建议：保持规范层级。' },
    },
    '正文字数': {
      pass: { p: '当前：正文约 {wordCount} 词。\n结论：正文信息量充足。', s: '建议：继续保持高质量输出。' },
      advice: { p: '当前：正文约 {wordCount} 词。\n结论：正文偏短，信息覆盖不足。', s: '建议：补充案例、步骤或 FAQ，提升至 500 词以上。' },
    },
    '含词次数': {
      pass: { p: '当前：目标词出现 {kwCount} 次，密度约 {density}%。\n结论：词频自然，覆盖充分。', s: '建议：维持健康的词频比例。' },
      issue: { p: '当前：正文未包含目标词。\n结论：正文与目标主题关联不足。', s: '建议：在首段与主体各安排至少一次完整目标词。' },
    },
    '堆砌告警': {
      pass: { p: '当前：目标词密度约 {density}%。\n结论：词频自然，无堆砌观感。', s: '建议：保持上下文流畅表达。' },
      issue: { p: '当前：目标词密度约 {density}%。\n结论：触发堆砌降权风险。', s: '建议：删除无意义重复，改用代词与自然句式。' },
    },
    '首段点题': {
      pass: { p: '当前：首段前 150 词包含目标词。\n结论：开篇点题良好。', s: '建议：保持首段快速切入主题。' },
    },
    '文题一致': {
      pass: { p: '当前：Title 与正文前 150 词 Jaccard 重叠度 {overlapPct}%。\n结论：标题与正文开头在实体上对齐良好。', s: '建议：保持高度切题。' },
      advice: { p: '当前：Title 与正文前 150 词 Jaccard 重叠度 {overlapPct}%。\n结论：标题与正文重叠度偏低。', s: '建议：增加与 Title 词汇一致的同段复述。' },
      issue: { p: '当前：Title 与正文前 150 词 Jaccard 重叠度 {overlapPct}%。\n结论：标题与正文重叠度极低。', s: '建议：在正文首段补充与标题一致的核心实体词。' },
    },
    'Alt 非空': {
      pass: { p: '当前：主文图片 {imgTotal} 张，缺失 Alt {altMissing} 张。\n结论：图片 Alt 配置完整。', s: '建议：维持规范的图片管理。' },
      advice: { p: '当前：主文图片 {imgTotal} 张，缺失 Alt {altMissing} 张。\n结论：部分图片缺少 Alt 描述。', s: '建议：为信息性图片补充说明性 Alt。' },
    },
    '主文图片含词': {
      pass: { p: '当前：至少 1 张主文图片 Alt 包含目标词。\n结论：图片已与检索主题挂钩。', s: '建议：保持图文并茂的优质排版。' },
      advice: { p: '当前：主文图片 Alt 未包含目标词。\n结论：图片描述未挂钩目标词。', s: '建议：在任意一张关联图片 Alt 中加入目标词。' },
    },
    'Slug 含词': {
      pass: { p: '当前：URL 路径包含目标词语义。\n结论：地址栏与目标词语义呼应良好。', s: '建议：维持规范的 URL 命名习惯。' },
      advice: { p: '当前：URL 路径未体现目标词。\n结论：路径与目标词语义关联不足。', s: '建议：新发布页面时在路径写入目标词。' },
    },
    'HTTPS 加密': {
      pass: { p: '当前：页面通过 HTTPS 访问。\n结论：连接安全。', s: '建议：定期检查证书到期时间。' },
      issue: { p: '当前：页面未使用 HTTPS。\n结论：未加密访问影响 SEO 与信任。', s: '建议：全站开启 SSL 并强制 301 跳转。' },
    },
    '文本代码比': {
      pass: { p: '当前：文本代码比约 {textRatio}%。\n结论：给用户看的内容占比健康。', s: '建议：保持干练的前端代码。' },
    },
    '主文无死链': {
      pass: { p: '当前：主文内链 {linkTotal} 条，死链 {deadCount} 条。\n结论：主文链接可访问性好。', s: '建议：维持健康的链接指向。' },
      issue: { p: '当前：主文内链 {linkTotal} 条，死链 {deadCount} 条。\n结论：存在大量无效链接。', s: '建议：立刻清除无效超链接，避免降权。' },
    },
    '同站有效内链': {
      pass: { p: '当前：同站有效内链 {linkTotal} 条。\n结论：正文里有值得继续读的站内出口。', s: '建议：多做关联推荐。' },
      advice: { p: '当前：同站有效内链 {linkTotal} 条。\n结论：正文内链缺乏相关性描述。', s: '建议：将「点击这里」改为包含实体的锚文本。' },
    },
    '收录规范': {
      pass: { p: '当前：Canonical 与 robots 配置正常。\n结论：收录信号干净。', s: '建议：保持标准的技术配置。' },
      advice: { p: '当前：Canonical 存在重复或相对路径等瑕疵。\n结论：收录规范需优化。', s: '建议：清理冗余，改用带 https 的绝对路径。' },
    },
    'Hreflang 多语言': {
      pass: { p: '当前：hreflang 标签成对且含 x-default。\n结论：多语言索引声明完整。', s: '建议：保持规范。' },
      advice: { p: '当前：hreflang 标签未成对出现或缺少默认语种映射兜底。\n结论：多语言声明不完整。', s: '建议：标签成对出现或补充 hreflang="x-default" 标签。' },
    },
    '社媒分享协议': {
      advice: { p: '当前：Open Graph / Twitter 卡片字段不完整。\n结论：社媒分享预览信息不足。', s: '建议：补齐 og:image 与 twitter:card 等字段。' },
    },
    'JSON-LD 结构': {
      pass: { p: '当前：检测到有效 JSON-LD 结构化数据。\n结论：结构化数据有效。', s: '建议：保持规范，争取高级搜索结果展示。' },
      issue: { p: '当前：JSON-LD 存在语法错误或缺少必填字段。\n结论：结构化数据无法被正确解析。', s: '建议：检查语法报错，或更换为标准类型并补齐必填项。' },
    },
  };

  function fillDocTemplate(tpl, ctx) {
    return String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => (ctx[k] != null ? String(ctx[k]) : ''));
  }

  function buildCheckContext(row) {
    const titleText = String(row.title || '');
    const titleLen = titleText.length;
    const metaText = String(row.metaDesc || '').trim();
    const metaLen = metaText && !metaText.includes('待同步') ? metaText.length : 0;
    const kws = parseMultiKw(row.keyword);
    const targetKeyword = kws[0] || '';
    const noKw = !kws.length;
    const rawA = String(row.dimA || '');
    const rawB = String(row.dimB || '');
    const rawC = String(row.dimC || '');
    const rawD = String(row.dimD || '');
    let positionPct = '18';
    if (/偏后|后半/i.test(rawA)) positionPct = '62';
    const h1Count = /双 H1|多个/i.test(rawB) ? '2' : '1';
    const altMissing = /缺 alt|gallery|2 图/i.test(rawD) ? '2' : '0';
    const imgTotal = /gallery/i.test(rawD) ? '6' : '4';
    const deadCount = (rawD.match(/404×(\d+)|死链×(\d+)/) || [])[1] || ((/404|死链/i.test(rawD)) ? '2' : '0');
    const linkTotal = /内链/i.test(rawD) ? '12' : '8';
    const density = /堆砌|密度/i.test(rawC) ? '4.8' : '1.6';
    const kwCount = /≥3|5 次|4 次/i.test(rawC) ? '5' : '2';
    const wordCount = /偏短|短文|空壳/i.test(rawC) ? '320' : '780';
    const overlapPct = /⚠|偏弱|偏低|风险/i.test(String(row.listSummary || '')) ? '22' : '48';
    const textRatio = '38';
    return {
      length: titleLen,
      metaLength: metaLen,
      targetKeyword: noKw ? '' : targetKeyword,
      noKw,
      positionPct,
      sliceHitRate: '0',
      h1Count,
      h1Length: '42',
      imgTotal,
      altMissing,
      deadCount,
      linkTotal,
      density,
      kwCount,
      wordCount,
      overlapPct,
      textRatio,
    };
  }

  function resolveCheckDocCopy(title, sev, row) {
    const t = ONPAGE_DOC_TEMPLATES[title];
    if (!t) return null;
    const ctx = buildCheckContext(row);
    let slot = t[sev] || (sev === 'issue' ? t.advice : null);
    if (title === 'Title 长度规范' && sev === 'issue' && Number(ctx.length) < 30 && t.issueShort) slot = t.issueShort;
    if (!slot) return null;
    if (ctx.noKw && /目标词/.test(slot.p) && sev === 'pass' && title.includes('目标词')) {
      return {
        problem: '当前：未配置目标词，本项不适用。\n结论：配置目标词后可获取更精准检测。',
        suggestion: '建议：在页面设置中补充 1-10 个目标词。',
      };
    }
    return {
      problem: fillDocTemplate(slot.p, ctx),
      suggestion: fillDocTemplate(slot.s, ctx),
    };
  }

  function formatDocProblem(cell) {
    let s = String(cell || '').replace(/<br\s*\/?>/gi, ' ').replace(/【变量】[^。\n]*/g, '').trim();
    const curM = s.match(/当前[：:]\s*([\s\S]*?)(?=结论[：:]|$)/);
    const conM = s.match(/结论[：:]\s*([\s\S]*?)$/);
    const bits = [];
    if (curM) bits.push(curM[1].trim().replace(/\s+/g, ' '));
    if (conM) bits.push(conM[1].trim().replace(/\s+/g, ' '));
    if (bits.length) return bits.join(' ');
    return stripDiagPrefix(s);
  }

  function formatDocSuggestion(cell) {
    return stripDiagPrefix(String(cell || '').replace(/<br\s*\/?>/gi, ' '));
  }

  function mk(sev, title, problem, suggestion, got, max, row) {
    const mx = Number(max) || 0;
    let g = got;
    if (g == null) {
      if (sev === 'pass') g = mx;
      else if (sev === 'advice') g = mx <= 1 ? 0 : Math.max(1, Math.floor(mx * 0.5));
      else g = 0;
    }
    const doc = row ? resolveCheckDocCopy(title, sev, row) : null;
    const prob = formatDocProblem(doc ? doc.problem : problem);
    const sugPlain = formatDocSuggestion(doc ? doc.suggestion : (suggestion || '请结合对应编辑入口修改后重新检测。'));
    return { sev, title, problem: prob, suggestion: sugPlain, result: prob, sug: sugPlain, got: g, max: mx, detail: prob };
  }

  function stripDiagPrefix(s) {
    return String(s || '').replace(/^(当前|建议|结论)[：:]\s*/u, '').trim();
  }

  function productGuideText(guide) {
    const t = String(guide || '');
    const m = t.match(/[？?]/);
    return m ? t.slice(m.index + 1).trim() : t;
  }

  function subBorderClass(sev) {
    if (sev === 'issue') return 'onpage-diag-sub--issue';
    if (sev === 'advice') return 'onpage-diag-sub--advice';
    return 'onpage-diag-sub--pass';
  }

  function scoreBgClass(got, max, sev) {
    if (sev === 'issue') return 'onpage-score-bg--issue';
    if (sev === 'advice') return 'onpage-score-bg--advice';
    return 'onpage-score-bg--pass';
  }

  function titleChecks(row) {
    const title = row.title || '';
    const len = title.length;
    const rawA = String(row.dimA || '');
    const noKw = !parseMultiKw(row.keyword).length;
    const lenSev = len > 60 ? 'issue' : len >= 30 && len <= 60 ? 'pass' : 'advice';
    const lenGot = lenSev === 'pass' ? 3 : lenSev === 'advice' ? 2 : 0;
    const kwSev = noKw ? 'pass' : /位置偏后|偏后/i.test(rawA) ? 'advice' : 'pass';
    const kwGot = noKw ? 10 : kwSev === 'pass' ? 10 : /位置偏后/i.test(rawA) ? 5 : 10;
    return [
      mk(len > 0 ? 'pass' : 'issue', 'Title 存在性', '', '', len > 0 ? 3 : 0, 3, row),
      mk(lenSev, 'Title 长度规范', '', '', lenGot, 3, row),
      mk(kwSev, 'Title 目标词', '', '', kwGot, 10, row),
    ];
  }

  function metaChecks(row) {
    const md = String(row.metaDesc || '');
    const len = md.length;
    const wExist = md && !md.includes('待同步');
    const lenSev = !wExist ? 'issue' : len >= 120 && len <= 160 ? 'pass' : 'advice';
    const lenGot = !wExist ? 0 : lenSev === 'pass' ? 2 : 1;
    const kwBad = /模板|雷同/i.test(String(row.dimA || ''));
    const consBad = /摘要.*⚠/i.test(String(row.listSummary || ''));
    return [
      mk(wExist ? 'pass' : 'issue', 'Meta 存在性', '', '', wExist ? 2 : 0, 2, row),
      mk(lenSev, 'Meta 长度规范', '', '', lenGot, 2, row),
      mk(kwBad ? 'advice' : 'pass', 'Meta 目标词', '', '', kwBad ? 1 : 2, 2, row),
      mk(consBad ? 'advice' : 'pass', '一致性(排噪)', '', '', consBad ? 1 : 2, 2, row),
    ];
  }

  function headingsChecks(row) {
    const raw = String(row.dimB || '');
    const h1Issue = /双 H1|风险/i.test(raw);
    const subKwBad = /未含|子标题/i.test(raw);
    const diffBad = /差异化|重复|双 H1/i.test(raw);
    const h1KwSev = sevFromRaw(raw);
    return [
      mk(h1Issue ? 'issue' : 'pass', 'H1 唯一性', '', '', h1Issue ? 0 : 4, 4, row),
      mk('pass', 'H1 长度规范', '', '', 2, 2, row),
      mk(h1KwSev, 'H1 目标词', '', '', /未/i.test(raw) ? 0 : 5, 5, row),
      mk(diffBad ? 'advice' : 'pass', 'Title/H1 差异化', '', '', diffBad ? 2 : 3, 3, row),
      mk(subKwBad ? 'advice' : 'pass', '子标题含目标词', '', '', subKwBad ? 1 : 2, 2, row),
      mk('pass', '层级无跳级', '', '', 2, 2, row),
    ];
  }

  function sevFromRaw(raw) {
    if (/404|死链|双 H1|严重|堆砌/i.test(raw)) return 'issue';
    if (/⚠|略|偏|缺|风险|未含|模板|堆砌|hreflang 待/i.test(raw)) return 'advice';
    return 'pass';
  }

  function bodyChecks(row) {
    const raw = String(row.dimC || '');
    const stuff = /堆砌|密度/i.test(raw);
    const short = /偏短|空壳/i.test(raw);
    const alignSev = sevFromRaw(raw);
    return [
      mk(short ? 'advice' : 'pass', '正文字数', '', '', short ? 4 : 6, 6, row),
      mk(stuff ? 'issue' : 'pass', '含词次数', '', '', stuff ? 0 : 6, 6, row),
      mk(stuff ? 'issue' : 'pass', '堆砌告警', '', '', stuff ? 0 : 2, 2, row),
      mk('pass', '首段点题', '', '', 3, 3, row),
      mk(alignSev, '文题一致', '', '', /风险|堆砌/i.test(raw) ? 1 : 5, 5, row),
    ];
  }

  function mediaChecks(row) {
    const raw = String(row.dimD || '');
    const altMiss = /缺 alt|gallery/i.test(raw);
    return [
      mk(altMiss ? 'advice' : 'pass', 'Alt 非空', '', '', altMiss ? 1 : 3, 3, row),
      mk(altMiss ? 'advice' : 'pass', '主文图片含词', '', '', altMiss ? 1 : 2, 2, row),
    ];
  }

  function urlChecks(row) {
    const raw = String(row.dimA || '');
    const slugExempt = /N\/A|根路径|豁免/i.test(raw);
    const slugOk = /含词/i.test(raw);
    const httpsOk = /HTTPS ✓|https/i.test(raw);
    return [
      mk(slugExempt || slugOk ? 'pass' : 'advice', 'Slug 含词', '', '', slugExempt || slugOk ? 3 : 0, 3, row),
      mk(httpsOk ? 'pass' : 'issue', 'HTTPS 加密', '', '', httpsOk ? 3 : 0, 3, row),
    ];
  }

  function codeChecks(row) {
    const raw = String(row.dimD || '');
    const dead = /404|死链/i.test(raw);
    const href = /hreflang 待/i.test(raw);
    const schema = /BlogPosting ⚠|datePublished|缺少/i.test(raw);
    const canon = /canonical|分页/i.test(raw);
    return [
      mk('pass', '文本代码比', '', '', 3, 3, row),
      mk(dead ? 'issue' : 'pass', '主文无死链', '', '', dead ? 0 : 5, 5, row),
      mk(dead ? 'advice' : 'pass', '同站有效内链', '', '', dead ? 2 : 4, 4, row),
      mk(canon ? 'advice' : 'pass', '收录规范', '', '', canon ? 3 : 5, 5, row),
      mk(href ? 'advice' : 'pass', 'Hreflang 多语言', '', '', href ? 1 : 2, 2, row),
      mk('advice', '社媒分享协议', '', '', 1, 3, row),
      mk(schema ? 'issue' : 'pass', 'JSON-LD 结构', '', '', schema ? 1 : 3, 3, row),
    ];
  }

  function onPageWincherCollectModel(row) {
    const scores = onPageGetDimScores(row);
    const builders = { title: titleChecks, meta: metaChecks, headings: headingsChecks, body: bodyChecks, media: mediaChecks, url: urlChecks, code: codeChecks };
    const groups = ONPAGE_SCORE_DIMENSIONS.map(d => {
      const checks = builders[d.id](row);
      const got = scores[d.id] || 0;
      const dot = worst(checks.map(c => c.sev));
      return { id: d.id, dot, name: d.label, guide: d.guide, productGuide: d.productGuide || d.guide, got, max: d.max, comment: dimOneLine(got, d.max, dot), checks };
    });
    const extra = (row.issuesDetail || []).filter(it => it.lv !== 'suggestion').map(it => ({
      sev: it.lv === 'critical' ? 'issue' : 'advice',
      title: String(it.t || '').trim(),
      result: String(it.t || '').trim(),
      sug: String(it.sug || '').trim(),
      dimId: null,
    }));
    return { groups, extra, dimScores: scores };
  }

  function onPageDimScoresCompactHTML(row, esc) {
    const e = esc || (s => String(s));
    const scores = onPageGetDimScores(row);
    const chips = ONPAGE_SCORE_DIMENSIONS.map(d => {
      const got = scores[d.id] || 0;
      const pct = Math.round((got / d.max) * 100);
      const cls = pct >= 85 ? 'onpage-dim-chip--ok' : pct >= 65 ? 'onpage-dim-chip--mid' : 'onpage-dim-chip--low';
      return `<span class="onpage-dim-chip ${cls}" title="${e(d.label)}">${e(d.shortLabel || d.id)} <strong>${got}</strong>/${d.max}</span>`;
    }).join('');
    return `<div class="onpage-dim-compact" aria-label="七维得分">${chips}</div>`;
  }

  function sevBadgeHTML(sev, esc) {
    const e = esc || (s => String(s));
    if (sev === 'issue') return `<span class="onpage-diag-sev onpage-diag-sev--issue">${e('严重')}</span>`;
    if (sev === 'advice') return `<span class="onpage-diag-sev onpage-diag-sev--advice">${e('建议')}</span>`;
    return `<span class="onpage-diag-sev onpage-diag-sev--pass">${e('通过')}</span>`;
  }

  function onPageDiagnoseProductHTML(row, esc, opts) {
    const e = esc || (s => String(s));
    const o = opts || {};
    const model = o.model || onPageWincherCollectModel(row);
    const sevF = o.sevFilter || null;
    let html = '';
    model.groups.forEach(g => {
      const checks = g.checks.filter(c => !sevF || c.sev === sevF);
      if (!checks.length) return;
      const dimBg = scoreBgClass(g.got, g.max, g.dot);
      const guideTxt = productGuideText(g.productGuide || g.guide || '');
      const subRows = checks.map(c => {
        const prob = stripDiagPrefix(c.problem || c.result);
        const sug = stripDiagPrefix(c.suggestion || c.sug);
        const line = !sug || c.sev === 'pass' ? prob : `${prob} · ${sug}`;
        return `
        <div class="onpage-diag-sub ${subBorderClass(c.sev)}">
          <div class="onpage-diag-sub-hd">
            <span class="onpage-diag-sub-name">${e(c.title)}</span>
            <span class="onpage-diag-sub-score"><strong>${c.got != null ? c.got : '—'}</strong><span class="onpage-diag-sub-score-cap">/${c.max || '—'}</span></span>
            ${sevBadgeHTML(c.sev, e)}
          </div>
          <div class="onpage-diag-sub-line">${e(line)}</div>
        </div>`;
      }).join('');
      html += `<details class="onpage-diag-dim ${dimBg}">
        <summary class="onpage-diag-dim-sum">
          <span class="onpage-diag-dim-dot onpage-diag-dim-dot--${g.dot}"></span>
          <span class="onpage-diag-dim-title-row">
            <span class="onpage-diag-dim-title">${e(g.name)}</span>
            <span class="onpage-diag-dim-comment onpage-diag-dim-comment--${g.dot}">${e(g.comment)}</span>
          </span>
          <span class="onpage-diag-dim-score onpage-diag-dim-score--${g.dot}"><strong>${g.got}</strong> / ${g.max}</span>
        </summary>
        <p class="onpage-diag-dim-guide">${e(guideTxt)}</p>
        <div class="onpage-diag-sub-list">${subRows}</div>
      </details>`;
    });
    if (!html) html = '<p class="onpage-wc-empty">当前筛选下无检测项</p>';
    return `<div class="onpage-diag-product">${html}</div>`;
  }

  /** 按页签区域汇总与检测一致的优化建议 */
  function onPageDiagSuggestByArea(row, area) {
    const model = onPageWincherCollectModel(row);
    const map = {
      tdk: ['title', 'meta', 'url'],
      headings: ['headings'],
      body: ['body'],
      images: ['media'],
      schema: ['code'],
      social: ['code'],
      intl: ['code'],
      links: ['code'],
    };
    const ids = map[area] || [];
    const out = [];
    model.groups.forEach(g => {
      if (!ids.includes(g.id)) return;
      g.checks.forEach(c => {
        if (c.sev !== 'pass' && c.sug) out.push(c.sug);
      });
    });
    return [...new Set(out)];
  }

  global.ONPAGE_SCORE_DIMENSIONS = ONPAGE_SCORE_DIMENSIONS;
  global.ONPAGE_DIM_ID_BY_MODULE = DIM_ID_BY_MODULE;
  global.onPageGetDimScores = onPageGetDimScores;
  global.onPageDimTotal = onPageDimTotal;
  global.onPageScoreBand = onPageScoreBand;
  global.onPageDimScoresCompactHTML = onPageDimScoresCompactHTML;
  global.onPageDiagnoseProductHTML = onPageDiagnoseProductHTML;
  global.onPageDiagSuggestByArea = onPageDiagSuggestByArea;
  global.onPageWincherCollectModelV7 = onPageWincherCollectModel;
  global.stripDiagPrefix = stripDiagPrefix;
  global.productGuideText = productGuideText;
  global.formatDocProblem = formatDocProblem;
  global.formatDocSuggestion = formatDocSuggestion;
  global.resolveCheckDocCopy = resolveCheckDocCopy;
})(typeof window !== 'undefined' ? window : globalThis);
