/* =============================================================
   增长引擎 Demo – app.js
   严格按照 Axure 原型结构、字段、交互实现
   ============================================================= */

/** 独立站（领动 SaaS）平台标识，用于授权管理等 UI */
const LEADONG_INDEPENDENT_SITE_LOGO = 'https://g0.leadongcdn.cn/cloud/lkBoqKSRpjnolrpkkq/jiaodianlingdongpinpaixingxiangshouce2023-v1-RGBban.png';
/** Google Search Console 品牌图（授权管理 UI） */
const GOOGLE_SEARCH_CONSOLE_LOGO = 'https://www.gstatic.com/search-console/ui/v1/sc-home.svg';

const MAX_BATCH_IMPORT_ROWS = 1000;
const MAX_REL_KEYWORDS_FIELD = 10;
const MAX_INTERNAL_LINK_LINES_FIELD = 10;
const BATCH_ARTICLE_POINTS_PER_ROW = 500;

/** 领动 SaaS 账号下可选网站（演示：授权前下拉；绑定以 leadongSiteId 为准） */
const LEADONG_SAAS_SITES_DEMO = [
  { leadongSiteId: 'LD-1001', label: '英文主站 · 与美国区', domain: 'www.leadong.com' },
  { leadongSiteId: 'LD-RH01', label: '锐华五金站', domain: 'www.rhhardware.com' },
  { leadongSiteId: 'LD-1002', label: '日文站', domain: 'jp.example.com' },
  { leadongSiteId: 'LD-1003', label: '测试站（示例：与录入域名不一致）', domain: 'dev-shop.example.net' },
];

/* ── 模拟数据 ── */
const DB = {
  sites: [
    { id: 1, name: '领动官网',  domain: 'www.leadong.com',    kws: 291, comps: 2, added: '2025-01-01', hasGSC: true, onPageSitemapDetected: true },
    { id: 2, name: '锐华五金',  domain: 'www.rhhardware.com', kws: 84,  comps: 1, added: '2025-03-15', hasGSC: false, gscAuthorized: false, onPageSitemapDetected: false },
    { id: 3, name: '领动 toys', domain: 'www.leadongtoys.com',kws: 56,  comps: 0, added: '2025-06-10', hasGSC: true, gscAuthorized: true, gscAccountBlocked: true, onPageSitemapDetected: true },
    { id: 4, name: '演示无GSC', domain: 'no-gsc-demo.example.com', kws: 0, comps: 0, added: '2025-08-01', hasGSC: false, gscAuthorized: false, onPageSitemapDetected: true },
    { id: 5, name: '演示空列表', domain: 'empty-demo.example.com', kws: 0, comps: 0, added: '2025-08-01', hasGSC: false, onPageSitemapDetected: true, onPageListEmpty: true },
  ],
  keywords: [
    { id:1, kw:'外贸建站', rank:2,  prev:5,  best:1, bestPage:'/products.html',  extraPages:1, vol:'1万-10万', comp:'中', cpc:'¥1.29-¥5.29', trend:13,  imp:12400, clk:320,  ctr:'2.6%', avgRank:3.2, groups:['☆关注','品牌词'], added:'2025-01-01', updated:'2025-09-30' },
    { id:2, kw:'网站建设', rank:7,  prev:7,  best:4, bestPage:'/services.html', extraPages:0, vol:'1千-1万',  comp:'高', cpc:'¥2.10-¥8.30', trend:1243, imp:8900,  clk:210,  ctr:'2.4%', avgRank:8.1, groups:['SEO词'],  added:'2025-01-02', updated:'2025-09-30' },
    { id:3, kw:'网站营销', rank:15, prev:12, best:9, bestPage:'/blog/marketing.html', extraPages:2, vol:'1千-1万', comp:'低', cpc:'¥0.80-¥3.20', trend:-8, imp:3200, clk:88, ctr:'2.8%', avgRank:14.3, groups:[], added:'2025-02-10', updated:'2025-09-30' },
    { id:4, kw:'外贸seo', rank:null, prev:28, best:21, bestPage:null, extraPages:0, vol:'1千-1万', comp:'中', cpc:'¥1.50-¥4.80', trend:5, imp:1800, clk:40, ctr:'2.2%', avgRank:null, groups:['SEO词'], added:'2025-03-01', updated:'2025-09-30' },
  ],
  groups: [
    { id:1, name:'☆关注', kws:18, avgRank:4.2, r1:3,  r23:6,  r410:7,  r1130:2  },
    { id:2, name:'品牌词', kws:32, avgRank:8.7, r1:4,  r23:9,  r410:12, r1130:7  },
    { id:3, name:'SEO词',  kws:21, avgRank:16.4,r1:1,  r23:3,  r410:8,  r1130:9  },
  ],
  competitors: [
    { id:1, name:'竞争对手1', domain:'www.example.com',  avgRank:6.2, r1:5, r23:11, r410:18, r1130:8  },
    { id:2, name:'竞争对手2', domain:'www.abc.com',       avgRank:9.8, r1:2, r23:6,  r410:14, r1130:15 },
  ],
  /* keyword id -> ranked landing pages (for 排名最佳网页 drill-down) */
  kwRankedPages: {
    1: [
      { path: '/products.html', rank: 2 },
      { path: '/blog/seo-guide.html', rank: 5 },
      { path: '/index.html', rank: 12 },
    ],
    2: [
      { path: '/services.html', rank: 7 },
      { path: '/case/web.html', rank: 11 },
    ],
    3: [
      { path: '/blog/marketing.html', rank: 15 },
    ],
    4: [],
  },
  exploreHistory: [
    { date:'2025-01-01 12:34:56', count:120, type:'关键词', condition:'网站建设、外贸建站' },
    { date:'2025-01-02 09:20:10', count:84,  type:'网址',   condition:'www.leadong.com'    },
  ],
  exploreResults: [
    { kw:'网站建设服务', vol:'1千-1万',  comp:'高', cpc:'¥2.10-¥8.30', trend:23  },
    { kw:'外贸建站公司', vol:'1千-1万',  comp:'中', cpc:'¥1.50-¥5.00', trend:8   },
    { kw:'网站营销推广', vol:'100-1千',  comp:'低', cpc:'¥0.60-¥2.40', trend:-5  },
    { kw:'企业官网制作', vol:'1千-1万',  comp:'高', cpc:'¥3.20-¥9.80', trend:15  },
    { kw:'响应式网站开发',vol:'100-1千', comp:'中', cpc:'¥1.20-¥4.60', trend:31  },
    { kw:'外贸独立站建设',vol:'1千-1万', comp:'中', cpc:'¥1.80-¥5.50', trend:42  },
  ],
  rankHistory: [
    { date:'2025-01-01 12:34:56', count:4, condition:'网页｜Google｜美国', overview:'2｜12｜43｜26', status:'已完成' },
    { date:'2025-01-02 09:20:10', count:4, condition:'网页｜Google｜美国', overview:'2｜0｜43｜26',  status:'查询中'  },
  ],
  kwCompare: [
    { kw:'外贸建站', vol:'1万-10万', comp:'中', cpc:'¥1.29-¥5.29', trend:13,  mine:2,  c1:5,  c2:null },
    { kw:'网站建设', vol:'1千-1万',  comp:'高', cpc:'¥2.10-¥8.30', trend:1243,mine:7,  c1:3,  c2:12   },
    { kw:'网站营销', vol:'1千-1万',  comp:'低', cpc:'¥0.80-¥3.20', trend:-8,  mine:15, c1:null,c2:8   },
  ],
  package: {
    org: '南京焦点领动云计算技术有限公司',
    plan: '进阶版',
    start: '2025-01-01',
    end: '2025-12-31',
    crawlPoints: { used: 49400, total: 50000 },
  /** 是否开通「关键词排名抓取」能力（演示开关，影响文章列表「排名」列是否可用） */
  featureKeywordRankCrawl: true,
  /** 是否开通「关键词管理」能力（演示开关；未开通时「开始写作」页隐藏「从关键词库选择」） */
  featureKeywordManagement: true,
    sites:       { used: 4, total: 5 },
    keywords:    { used: 295, total: 300 },
    competitors: { used: 5, total: 10 },
  },
  changeLog: [
    { date:'2025-09-18', type:'点数',           delta:'+50000', kind:'充值' },
    { date:'2025-09-10', type:'点数',           delta:'-891',   kind:'消耗' },
    { date:'2025-09-09', type:'点数',           delta:'-2871',  kind:'消耗' },
    { date:'2025-09-01', type:'关键词数量',      delta:'+50',    kind:'套餐增加' },
    { date:'2025-09-01', type:'可绑定网站数量',  delta:'+3',     kind:'套餐增加' },
    { date:'2025-09-01', type:'竞争对手数量',    delta:'+5',     kind:'套餐增加' },
  ],
  /** 仪表盘 · 站点模块快照（示例） */
  dashboardDimensionSnapshot: [
    { key: 'todo', label: '待办总览', summary: '18 项待处理', status: 'warn' },
    { key: 'audit', label: '站点扫描', summary: '覆盖率 94%', status: 'ok' },
    { key: 'onpage', label: '页面与摘要', summary: '12 页缺少页面摘要', status: 'warn' },
    { key: 'i18n', label: '多语言', summary: '2 组语言互链不完整', status: 'warn' },
    { key: 'schema', label: '结构化信息', summary: '博客文章缺少发布时间', status: 'warn' },
    { key: 'crawl', label: '抓取与索引', summary: '地图含 2 条异常 URL', status: 'warn' },
    { key: 'gsc', label: '搜索表现', summary: '近 28 天曝光 +6%', status: 'ok' },
    { key: 'hist', label: '修改记录', summary: '本周 6 次写入', status: 'ok' },
  ],
  /** 仪表盘 · 关键词概览统计（演示，含趋势序列供迷你图） */
  dashboardKwOverviewStats: {
    tracked: 84,
    inTop10: 26,
    avgRank: 14.2,
    momClicks: '+9%',
    trackedTrend: [68, 71, 73, 76, 78, 81, 84],
    top10Trend: [18, 20, 21, 22, 23, 25, 26],
    avgTrend: [16.2, 15.8, 15.4, 15.1, 14.8, 14.5, 14.2],
    impTrend: [12000, 12400, 11800, 13200, 12800, 13500, 14100],
  },
  /** 仪表盘 · 最近抓取完成时间（示例） */
  dashboardLastCrawlAt: '2025-09-30 14:32:08',
  /** 仪表盘 · 站点 SEO 综合得分（示例） */
  dashboardSeoSummary: {
    score: 72,
    lastScanAt: '2025-09-30',
    /** 最近一次全站检测覆盖的 sitemap URL 数（示例） */
    sitemapUrlTotal: 142,
    breakdown: {
      infrastructure: 22,
      corePages: 50,
    },
    /** 站点基建三子项（满分各 10，合计 30） */
    infraDim: { robots: 10, sitemap: 10, https: 10 },
    /** 核心页 On-Page 七维均分（示例，与 SEO评分维度.md 一致） */
    dimAvg: { title: 12, meta: 6, headings: 15, body: 17, media: 4, url: 5, code: 13 },
    issues: { issue: 1, advice: 3, pass: 2 },
    hints: [
      '博客文章结构化信息缺少发布日期，建议补齐',
      '部分分类页页面摘要内容重复，建议分别撰写',
      '核心产品页内链存在失效链接，建议修复或更新',
    ],
    /** 【模块A】站点级技术基础设施检测（对齐 SEO评分维度.md，满分各 10） */
    infraChecks: [
      {
        id: 'robots',
        label: 'Robots.txt 协议',
        issueLevel: 'pass',
        score: 10,
        maxScore: 10,
        summaryBrief: '协议正常，允许搜索引擎抓取',
        ruleDesc: '访问根目录 robots.txt，检查是否允许搜索引擎进入；若全局 Disallow: / 将阻断全站收录。',
        criteriaBiz: '网站配置了正常的爬虫协议文件，且没有拦截搜索引擎。',
        criteriaTech: '根目录存在 robots.txt，返回状态码 200 且无全局阻拦（无 Disallow: /）。',
        problem: '当前：已检测到 `/robots.txt`，HTTP 状态码 200，未发现全局 `Disallow: /` 拦截。\n结论：Robots 协议运行正常，允许搜索引擎抓取。',
        suggestion: '建议：保持当前开放抓取配置，定期确认协议未被误改。',
        fixAi: '调用接口一键生成并写入标准的 Robots 开放协议',
      },
      {
        id: 'sitemap',
        label: 'Sitemap 站点地图',
        issueLevel: 'advice',
        score: 8,
        maxScore: 10,
        summaryBrief: '地图可读，建议保持自动更新',
        ruleDesc: '检查站点是否提供可被解析的 Sitemap.xml，用于帮助搜索引擎发现与收录全站页面（含新页面）。',
        criteriaBiz: '网站拥有标准的地图文件，且能被机器顺利读懂并解析。',
        criteriaTech: '在根目录或 robots.txt 中提取到 Sitemap 链接，返回 200 且 XML 解析成功。',
        problem: '当前：已发现 Sitemap「/sitemap.xml」，HTTP 200，XML 解析成功，约含 142 条 URL。\n结论：站点地图配置规范，可被搜索引擎读取；部分新发布 URL 尚未全部纳入（示例）。',
        suggestion: '建议：保持地图自动更新，新页面发布后及时纳入 Sitemap。',
        fixAi: '调用建站平台接口自动生成 Sitemap',
      },
      {
        id: 'https',
        label: 'HTTPS 安全',
        issueLevel: 'advice',
        score: 5,
        maxScore: 10,
        summaryBrief: 'HTTPS 正常，证书即将到期',
        ruleDesc: '检查网站首页（根路径）HTTPS 与 SSL 证书是否在有效期内；未加密将严重影响排名与用户信任。',
        criteriaBiz: '网站虽然有加密，但数字证书在未来 7 天内即将过期，存在随时断供导致无法访问的风险。',
        criteriaTech: 'HTTPS 连接正常，但 SSL 证书剩余有效期 ≤ 7 天。',
        problem: '当前：HTTPS 可正常访问，SSL 证书剩余 5 天（到期日 2025-10-05，预警阈值 7 天）。\n结论：证书即将过期，存在访问中断与安全告警风险。',
        suggestion: '建议：立即联系域名商或主机商续期 SSL 证书，避免到期后全站无法访问。',
        fixAi: '基础设施提示，无需机器干预',
      },
    ],
  },
  /** 相对「页面整合优化」列表尚未纳入的新页面（示例） */
  dashboardNewPages: [
    { path: '/services/custom-odm.html', title: '定制 ODM 服务', foundAt: '2025-09-28' },
    { path: '/blog/hinge-selection-guide-2025.html', title: '铰链选型指南 2025', foundAt: '2025-09-29' },
  ],
  /** 待办：scope=site 在网站概览「站点基建」展示；scope=page 在对应页面详情展示 */
  dashboardTasks: [
    { id: 's1', scope: 'site', pri: '中', issueLevel: 'advice', dimId: 'infra', checkLabel: 'Sitemap 未提交 GSC', module: '网站技术基础', page: '', area: 'Sitemap 站点地图', problem: 'sitemap.xml 未在 Google Search Console 提交。', suggestion: '登录 GSC → 站点地图 → 提交 https://www.example.com/sitemap.xml（示例）。' },
    { id: 's2', scope: 'site', pri: '低', issueLevel: 'advice', dimId: 'infra', checkLabel: 'Robots 注释说明', module: '网站技术基础', page: '', area: 'Robots.txt 协议', problem: 'robots.txt 缺少 Sitemap 声明行。', suggestion: '在 robots.txt 末尾增加：Sitemap: https://www.example.com/sitemap.xml（示例）。' },
    { id: 1, scope: 'page', pri: '高', issueLevel: 'advice', dimId: 'meta', checkLabel: 'Meta 长度规范', module: 'Meta 摘要', page: '/', area: 'Meta 摘要' },
    { id: 2, scope: 'page', pri: '高', issueLevel: 'advice', dimId: 'headings', checkLabel: '子标题含目标词', module: 'Headings 标题结构', page: '/products/cabinet-hinges', area: 'Headings 标题结构' },
    { id: 3, scope: 'page', pri: '中', issueLevel: 'advice', dimId: 'media', checkLabel: 'Alt 非空', module: 'Media 多媒体', page: '/products.html', area: 'Media 多媒体' },
    { id: 4, scope: 'page', pri: '中', issueLevel: 'issue', dimId: 'code', checkLabel: 'JSON-LD 结构', module: 'Code 底层技术', page: '/blog/construction-hardware-trends.html', area: 'Code 底层技术' },
    { id: 5, scope: 'page', pri: '低', issueLevel: 'advice', dimId: 'code', checkLabel: 'Hreflang 多语言', module: 'Code 底层技术', page: '/de/', area: 'Code 底层技术' },
    { id: 6, scope: 'page', pri: '低', issueLevel: 'issue', dimId: 'code', checkLabel: '主文无死链', module: 'Code 底层技术', page: '/blog/construction-hardware-trends.html', area: 'Code 底层技术' },
    { id: 7, scope: 'page', pri: '低', issueLevel: 'issue', dimId: 'title', checkLabel: 'Title 长度规范', module: 'Title 页面标题', page: '/blog/construction-hardware-trends.html', area: 'Title 页面标题' },
  ],
  /** 曝光页列表：某路径下带排名的关键词明细（示例） */
  onPageRankedKwSamples: {
    '/products.html': [
      { kw: 'cabinet hinges wholesale', rank: 9, rankAt: '2025-09-28 08:15:22', engine: 'Google · 美国' },
      { kw: 'cabinet hinges wholesale', rank: 11, rankAt: '2025-09-21 09:40:00', engine: 'Google · 美国' },
      { kw: 'industrial hinges b2b', rank: 19, rankAt: '2025-09-27 11:02:18', engine: 'Google · 美国' },
      { kw: 'hinge supplier china', rank: 24, rankAt: '2025-09-25 16:44:09', engine: 'Google · 美国' },
      { kw: 'seasonal promo hinge', rank: 18, rankAt: '2025-09-16 14:20:00', engine: 'Google · 美国' },
      { kw: 'seasonal promo hinge', rank: null, rankAt: '2025-09-30 08:00:00', engine: 'Google · 美国' },
    ],
    '/Cabinet-Hinges-s/': [
      { kw: '橱柜铰链', rank: 12, rankAt: '2025-09-29 07:30:00', engine: 'Google · 美国' },
      { kw: 'cabinet hinge types', rank: 31, rankAt: '2025-09-22 13:11:45', engine: 'Google · 美国' },
    ],
    '/blog/construction-hardware-trends.html': [
      { kw: 'construction hardware trends', rank: 24, rankAt: '2025-09-30 06:00:01', engine: 'Google · 美国' },
      { kw: 'hardware export 2025', rank: 41, rankAt: '2025-09-18 19:22:33', engine: 'Google · 美国' },
    ],
    '/': [
      { kw: 'B2B hardware supplier', rank: 15, rankAt: '2025-09-30 10:05:44', engine: 'Google · 美国' },
      { kw: 'rhhardware export', rank: 22, rankAt: '2025-09-19 12:00:00', engine: 'Google · 必应 · 美国' },
    ],
  },
  /** 搜索 · On-Page SEO 页面列表（示例） */
  onPageSeoPages: [
    { path: '/', title: 'RHHardware — B2B 五金出口首页', keyword: 'B2B hardware supplier', keywordSrc: 'GSC 点击最高', score: 78, dimScores: { title: 12, meta: 7, headings: 17, body: 20, media: 5, url: 6, code: 11 }, httpStatus: 200, indexEngines: { google: true, bing: true, yandex: false }, issues: 4, issueBreakdown: { critical: 0, warning: 2, suggestion: 2 }, onPageScoreAt: '2025-09-28', pageType: 'homepage', tags: ['首页'], metaDesc: '锐华五金 — B2B 五金件出口与铰链、紧固件一站式供货。（示例 Meta）', metaKeywords: 'B2B hardware, hinges, fasteners, export', listSummary: 'Title 略长 · 七维整体良好', dimA: 'Title 略超 60 字 · HTTPS ✓', dimB: 'H1 ✓ · 子标题含词 ✓', dimC: '字数 OK · 核心词 5 次', dimD: 'Organization ✓ · 主图 alt 含词 ✓', hasGscLanding: true },
    { path: '/products.html', title: '产品目录 · 紧固件与铰链', keyword: 'cabinet hinges wholesale', keywordSrc: '用户绑定', score: 71, dimScores: { title: 11, meta: 5, headings: 10, body: 16, media: 4, url: 5, code: 20 }, httpStatus: 200, indexEngines: { google: true, bing: true, yandex: true }, issues: 7, issueBreakdown: { critical: 1, warning: 3, suggestion: 3 }, onPageScoreAt: '2025-09-27', tags: ['目录', '高优先级'], listSummary: 'Desc 模板 · 双 H1 · 正文偏短 · 死链', dimA: 'Desc 模板雷同 · URL 含词 ✓', dimB: '双 H1 风险 · 待合并', dimC: '正文偏短 · 核心词 4 次', dimD: 'ItemList ✓ · 分页 canonical 待确认 · 内链 1 死链' },
    { path: '/Cabinet-Hinges-s/', title: '橱柜铰链分类', keyword: '橱柜铰链', keywordSrc: '排名监控主词', score: 74, dimScores: { title: 13, meta: 7, headings: 14, body: 19, media: 3, url: 6, code: 12 }, httpStatus: 301, indexEngines: { google: true, bing: false, yandex: false }, issues: 5, issueBreakdown: { critical: 0, warning: 2, suggestion: 3 }, onPageScoreAt: '2025-09-26', tags: [], listSummary: 'H1 对齐 ⚠ · gallery 缺 alt', dimA: 'Meta 120–160 ✓ · Slug 含词 ✓', dimB: 'H1 与类目词对齐 ⚠', dimC: '≥500 词 ✓ · 首段曝光 ✓', dimD: 'CollectionPage ✓ ·  gallery 2 图缺 alt' },
    { path: '/about-us.html', title: '关于锐华 / 工厂与认证', keyword: 'about rhhardware', keywordSrc: '启发式', score: 82, dimScores: { title: 14, meta: 7, headings: 16, body: 17, media: 5, url: 6, code: 17 }, httpStatus: 200, indexEngines: { google: true, bing: true, yandex: false }, issues: 3, issueBreakdown: { critical: 0, warning: 1, suggestion: 2 }, onPageScoreAt: '2025-09-25', tags: ['品牌'], listSummary: '品牌页 · 短文意图 · 整体稳定', dimA: 'TDK ✓ · 根路径例外 URL 含词 N/A', dimB: '唯一 H1 ✓ · 缺营销向 H2', dimC: '字数边缘 · 核心词 3 次踩线', dimD: 'AboutPage ✓ · 内链 ✓' },
    { path: '/contact.html', title: '联系我们 · 询盘表单', keyword: '', keywordSrc: '用户绑定', score: 85, dimScores: { title: 15, meta: 8, headings: 18, body: 18, media: 5, url: 6, code: 15 }, httpStatus: 200, indexEngines: { google: true, bing: true, yandex: false }, issues: 2, issueBreakdown: { critical: 0, warning: 1, suggestion: 1 }, onPageScoreAt: '2025-09-24', tags: ['转化'], listSummary: '表单落地页 · 七维整体良好', dimA: '全 ✓', dimB: '全 ✓', dimC: '表单页短文 · 意图词覆盖 ✓', dimD: 'ContactPage ✓ · 无死链', hasGscLanding: true },
    { path: '/blog/construction-hardware-trends.html', title: '建筑五金出海趋势', keyword: 'construction hardware trends', keywordSrc: 'GSC', score: 69, dimScores: { title: 11, meta: 6, headings: 12, body: 12, media: 4, url: 5, code: 19 }, httpStatus: 200, indexEngines: { google: true, bing: false, yandex: false }, issues: 5, issueBreakdown: { critical: 2, warning: 3, suggestion: 0 }, onPageScoreAt: '2025-09-22', pageType: 'article-detail', tags: ['Blog', '待优化'], metaDesc: '梳理建筑五金出海趋势与品类机会，助力 B2B 厂商拓展海外市场。（示例）', metaKeywords: 'construction hardware, export trends, B2B', dimA: 'Title 核心词位置偏后', dimB: '子标题未含完整核心词', dimC: '堆砌风险 · 核心词 ≥3 但可读降分', dimD: 'BlogPosting ⚠ datePublished · 内链 404×2', listSummary: '摘要⚠ · 标题层级⚠ · 正文堆砌风险 · Code⚠', scoresABCD: { a: 17, b: 14, c: 12, d: 14 }, hasGscLanding: true, issuesDetail: [{ lv: 'warning', t: '页面标题超出约 60 个字符建议缩短', sug: '将标题压缩至约 60 个字符内，并把最重要的词放在前面' }, { lv: 'warning', t: '子标题未覆盖完整核心词', sug: '在第一个二级标题中自然包含完整目标短语' }, { lv: 'critical', t: '内链 2 条 404', sug: '修复失效链接或设置跳转至正确落地页' }, { lv: 'critical', t: '博客文章信息缺少发布时间', sug: '在结构化信息中补充符合规范的 ISO 日期' }, { lv: 'warning', t: '页面摘要与正文意图略有偏离', sug: '重写摘要使其覆盖搜索意图与主推卖点' }, { lv: 'suggestion', t: '正文关键词密度偏高', sug: '降低重复堆砌，改为近义词与自然句式' }, { lv: 'suggestion', t: '缺少目录跳转锚点', sug: '增加目录模块提升长尾段落可读性' }, { lv: 'suggestion', t: '图片文件名未含语义关键词', sug: '为首图与画廊图使用可读文件名' }], suggestions: ['将主关键词前移至页面标题前段', '在第一个二级标题中自然出现完整核心词', '修复正文失效内链或设置跳转'], workflowTiles: [{ label: '待办总览', summary: '4 条待确认', status: 'warn' }, { label: '结构化信息', summary: '博客文章缺发布时间', status: 'warn' }, { label: '抓取与索引', summary: '内链 404×2', status: 'warn' }] },
    { path: '/products/cabinet-hinges', title: '橱柜铰链 · 产品聚合', keyword: 'cabinet hinges', keywordSrc: '启发式', score: 73, dimScores: { title: 13, meta: 7, headings: 16, body: 18, media: 5, url: 6, code: 8 }, httpStatus: 200, indexEngines: { google: true, bing: true, yandex: false }, issues: 5, issueBreakdown: { critical: 0, warning: 2, suggestion: 3 }, onPageScoreAt: '2025-09-21', tags: ['产品'], metaDesc: '橱柜铰链规格与选型（示例）。', metaKeywords: 'cabinet hinges', dimA: 'Meta ✓ · URL 含词 ✓', dimB: 'H1 ✓', dimC: '正文 ✓', dimD: 'ItemList ✓' },
    { path: '/1JO-JIC-MALE-74-CONE-SAE-O-RING-BOSS-hexagon-adapter-pd508135.html', title: '1JO JIC MALE 74°CONE/ SAE O-RING BOSS hexagon adapter', keyword: 'JIC male 74 cone SAE O-RING BOSS adapter', keywordSrc: '启发式', score: 71, dimScores: { title: 12, meta: 6, headings: 14, body: 15, media: 4, url: 6, code: 14 }, httpStatus: 200, indexEngines: { google: true, bing: true, yandex: false }, issues: 6, issueBreakdown: { critical: 0, warning: 3, suggestion: 3 }, onPageScoreAt: '2025-09-30', pageType: 'product-detail', tags: ['产品', '液压'], metaDesc: 'JIC MALE 74°CONE/ SAE O-RING BOSS hexagon adapter. And also can customize products according to the customers requirement.', metaKeywords: 'JIC adapter, SAE O-RING BOSS, hydraulic fittings, 1JO', listSummary: '产品详情 · 规格表缺失 · FAQ 已有', dimA: 'Title 与 H1 重复度高', dimB: 'H1 ✓ · 缺规格 H2', dimC: '正文偏薄 · 核心词露出不足', dimD: 'Product schema 待补 · 询盘表单 ✓' },
    { path: '/de/', title: '德语首页（示例）', keyword: 'Scharniere B2B', keywordSrc: '启发式', score: 68, dimScores: { title: 13, meta: 6, headings: 16, body: 12, media: 5, url: 5, code: 11 }, httpStatus: 200, indexEngines: { google: false, bing: false, yandex: false }, issues: 4, issueBreakdown: { critical: 0, warning: 1, suggestion: 3 }, onPageScoreAt: '2025-09-10', tags: ['多语言'], metaDesc: 'DE 首页 Meta（示例）', metaKeywords: 'de, hardware', dimA: 'hreflang 待补', dimB: 'H1 ✓', dimC: '短文', dimD: '内链 ✓ · Hreflang 待补' },
    { path: '/features/cp-demo.html', title: 'CP 功能聚合页（示例）', keyword: '', keywordSrc: '', score: 65, dimScores: { title: 10, meta: 5, headings: 12, body: 14, media: 4, url: 5, code: 15 }, httpStatus: 200, indexEngines: { google: true, bing: false, yandex: false }, issues: 3, issueBreakdown: { critical: 0, warning: 2, suggestion: 1 }, onPageScoreAt: '2025-09-15', tags: [], metaDesc: 'CP 页（示例）', metaKeywords: 'feature, cp page', _schemaHasOther: true },
  ],
  rankedLandingPages: [
    { path: '/products.html', title: '产品目录 · 紧固件与铰链', bestKw: 'cabinet hinges wholesale', rank: 8, rankedKwCount: 14, engine: 'Google · 美国', firstSeen: '2025-09-08', lastSeen: '2025-09-28' },
    { path: '/Cabinet-Hinges-s/', title: '橱柜铰链分类', bestKw: '橱柜铰链', rank: 12, rankedKwCount: 9, engine: 'Google · 美国', firstSeen: '2025-09-12', lastSeen: '2025-09-28' },
    { path: '/blog/construction-hardware-trends.html', title: '建筑五金出海趋势', bestKw: 'construction hardware', rank: 24, rankedKwCount: 6, engine: 'Google · 美国', firstSeen: '2025-09-18', lastSeen: '2025-09-25' },
    { path: '/', title: 'RHHardware 首页', bestKw: 'B2B hardware', rank: 15, rankedKwCount: 11, engine: 'Google · 必应 · 美国', firstSeen: '2025-09-01', lastSeen: '2025-09-30' },
    { path: '/about-us.html', title: '关于锐华 / 工厂与认证', bestKw: 'about rhhardware', rank: 18, rankedKwCount: 3, engine: 'Google · 美国', firstSeen: '2025-09-05', lastSeen: '2025-09-26' },
    { path: '/contact.html', title: '联系我们 · 询盘表单', bestKw: 'contact hardware', rank: 28, rankedKwCount: 2, engine: 'Google · 美国', firstSeen: '2025-09-10', lastSeen: '2025-09-24' },
    { path: '/products/cabinet-hinges', title: '橱柜铰链 · 产品聚合', bestKw: 'cabinet hinges', rank: 11, rankedKwCount: 5, engine: 'Google · 美国', firstSeen: '2025-09-14', lastSeen: '2025-09-27' },
    { path: '/1JO-JIC-MALE-74-CONE-SAE-O-RING-BOSS-hexagon-adapter-pd508135.html', title: 'JIC MALE hexagon adapter', bestKw: 'JIC adapter', rank: 32, rankedKwCount: 2, engine: 'Google · 美国', firstSeen: '2025-09-16', lastSeen: '2025-09-22' },
    { path: '/de/', title: '德语首页（示例）', bestKw: 'Scharniere B2B', rank: 41, rankedKwCount: 1, engine: 'Google · 美国', firstSeen: '2025-09-08', lastSeen: '2025-09-20' },
  ],
  /** 曝光页数据概览 · 按「抓取任务」维度的趋势（演示；一点一任务） */
  exposurePageRankCrawlTasks: [
    { taskAt: '2025-09-08', rankedPageCount: 2, avgBestRank: 22.5 },
    { taskAt: '2025-09-15', rankedPageCount: 3, avgBestRank: 19.8 },
    { taskAt: '2025-09-22', rankedPageCount: 3, avgBestRank: 17.6 },
    { taskAt: '2025-09-28', rankedPageCount: 4, avgBestRank: 14.5 },
  ],
};

/* ── AI 写作模块数据 ── */
/** 演示：站点 2 已授权；站点 1 未授权但有同域名独立站可绑；站点 3 未授权且无匹配域名（与顶栏当前站点无关） */
DB.siteAuths = [
  { id: 10, geSiteId: 2, leadongSiteId: 'LD-RH01', name: '锐华五金', domain: 'www.rhhardware.com', type: '领动SaaS', status: 'active', addedAt: '2025-03-15' },
];
/** 演示：解除授权后再次授权原站时，用于冻结选站下拉（仅演示） */
DB.pendingReauthLeadong = null;
DB.articles = [
  { id:1, title:'How to Build a Professional Foreign Trade Website in 2025', keyword:'外贸建站', lang:'English', words:1523, status:'synced', site:'领动官网', url:'https://www.leadong.com/blog/how-to-build-foreign-trade-website', createdAt:'2025-09-20' },
  { id:2, title:'网站SEO优化完整指南：从关键词到外链建设',                  keyword:'网站建设', lang:'中文',    words:2087, status:'draft',      site:null,       url:null,                                                                        createdAt:'2025-09-22' },
  { id:3, title:'Top 10 Foreign Trade SEO Strategies for 2025',             keyword:'外贸seo',  lang:'English', words:0,    status:'generating', site:null,       url:null,                                                                        createdAt:'2025-09-25' },
];
/* URL 维度排名明细（文章已发布 URL 与关键词排名，原型数据） */
DB.urlRankDetails = {
  1: {
    best: 3,
    items: [
      { keyword: '外贸建站',         rank: 3,  crawledAt: '2025-09-28', engine: 'Google · 美国' },
      { keyword: 'foreign trade site', rank: 7,  crawledAt: '2025-09-25', engine: 'Google · 美国' },
      { keyword: 'B2B website',      rank: 12, crawledAt: '2025-09-20', engine: '必应 · 美国' },
    ],
  },
};

/* ── App state ── */
const state = {
  siteId:      2,
  primary:     'dashboard',       // dashboard | search | geo | settings | admin
  secondary:   'kw-mgmt',         // under search: kw-mgmt | kw-explore | kw-rank | competitor | page-seo
  tab:         'my-keywords',     // under kw-mgmt: my-keywords | kw-groups
  exploreMode: 'keyword',         // keyword | url
  exploreShown: false,            // false=default, true=results
  rankShown:   false,
  settingsTab: 'package',         // package | site-mgmt
  settingsSub: 'basic',           // basic | engine | crawl | auth
  compTab:     'competitors',     // competitors | compare
  modal:       null,
  wizardStep:  1,
  wizardData:  { domain:'', alias:'', keywords:'', engines:[] },
  drawer:      null,              // null or keyword id
  drawerTab:   'rank',            // rank | competitor | page
  siteDropOpen:   false,
  // ── AI 写作模块 ──
  writingTab:     'history',     // 'history' | 'workbench' | 'batch-create'
  batchArticleStep: 1,           // 1 录入 2 预览 3 确认 4 完成
  batchArticleInputRaw: '',
  /** 解析后行：{ line, title, keyword, relKws: string[], ok, err } */
  batchArticleRows: [],
  batchArticleLastCreatedCount: 0,
  batchArticleImportName: '',
  workbenchStep:  'config',      // 'config' | 'generating' | 'editor'
  editArticleId:  null,
  writingForm:    { title:'', keyword:'', lang:'English', relatedKws:[], internalLinks: [] },
  articleListQuery: '',
  articleListStatusFilter: '', // 空字符串：不按状态过滤，展示全部；非空时按状态精确筛选
  devInternalPage: null, // null | 'reseller-order' — 产研内部示意图全屏页，不在主导航入口
  logicDrawerTreeSelection: null, // null=与当前应用页同步；'reseller-feature-open'=抽屉内「3.1 功能开通」专页
  articleListPage: 1,
  articleListPageSize: 20,
  articleListSelectedIds: [],
  usageLogType:   'crawl',       // 'general' | 'crawl' — 套餐资源页两个「变更记录」入口分别打开
  usageLogFilter: 'all',         // 'all' | 'general' | 'crawl' — resource type filter in modal
  rankDetailArticleId: null,    // article id for URL rank detail modal
  kwBestPagesKwId:     null,    // keyword id for 排名网页 list modal
  dateRangePreset:     'last30',
  dateRangeStart:      '2025-09-01',
  dateRangeEnd:        '2025-09-30',
  kwTableColOrder:     null,
  kwTableColHidden:    null,
  kwFieldConfigOpen:   false,
  /** On-Page 列表：字段配置面板 */
  onPageSeoFieldOpen: false,
  onPageSeoColOrder: null,
  onPageSeoColHidden: null,
  /** 列表首列：仅隐藏标题文案，路径与菜单仍显示 */
  onPageSeoHidePageTitle: false,
  /** 重新测评演示：正在刷新的行索引 → 1 */
  onPageSeoAuditRefreshing: {},
  /** 列表「设置标签」弹窗：页面行索引 */
  onPageSeoTagsModalIdx: null,
  articleEditorViewport: 'pc',   // 'pc' | 'tablet' | 'mobile' — 编辑器内预览宽度
  writingFieldErrors: { title: '', keyword: '', relatedKws: '', internalLinks: '', points: '' },
  articleDeleteConfirmIds: [],   // 打开删除确认弹窗时待删文章 id 列表
  pendingWritingGenerate: null, // 确认生成校验通过后暂存，待「提交成功」弹窗确认再落库
  usageLogDateFrom: '',         // 变更记录弹窗：日期筛选起（含时分秒比较用字符串）
  usageLogDateTo: '',
  /** 授权管理演示：领动侧预选网站 ID（下拉 value） */
  leadongAuthPick: 'LD-1001',
  /** 从「前往授权」子弹窗返回时恢复的 modal 类型（如 site-settings） */
  leadongAuthRestoreModal: null,
  /** 授权确认弹窗内「选择独立站网站」是否冻结（重新授权至原站） */
  leadongAuthSelectFrozen: false,
  /* 技术 SEO 模块 */
  seoView: 'overview',
  seoQueueKey: null,
  seoAiDone: false,
  seoReviewed: false,
  seoSaasOn: true,
  seoGscOn: true,
  seoSchemaTab: 0,
  seoScanPhase: '',
  /** 仪表盘二级：overview=网站概览 | all-sites=全部网站 | tasks=待办任务 */
  dashboardTab: 'overview',
  /** On-Page 详情抽屉页签：diagnose | tdk | headings | images | keywords | schema */
  onPageSeoDrawerTab: 'diagnose',
  /** AI 测评结果子页签：overview | eval | gap | growth | assets */
  onPageAiResultSubTab: 'overview',
  /** SERP 预览设备：pc | mobile */
  onPageSerpDevice: 'pc',
  /** 关键词页签：rank | gsc | recommend */
  onPageKwListMode: 'rank',
  /** 「推荐」子页：点击「AI 推荐」后才展示列表（每次切到推荐页签为 false） */
  onPageKwRecommendLoaded: false,
  /** AI 测评「应用」：打开编辑弹窗时的表单预填（消费后清空） */
  onPageAiAuditEditorPrefill: null,
  /** Hreflang 子页签：hreflang | canonical */
  onPageIntlSub: 'hreflang',
  /** 结构化数据子页签键：仅 jsonld-org | jsonld-web | jsonld-blog */
  onPageSchemaSlice: 'jsonld-org',
  /** On-Page 关键词页签：排名/GSC 数据日期范围（示例） */
  onPageKwDateFrom: '2025-09-01',
  onPageKwDateTo: '2025-09-30',
  /** 图片 SEO 弹窗：编辑行索引 0–2 */
  onPageImageEditIndex: null,
  /** 结构化数据行编辑：如 org-logo */
  onPageSchemaEditKey: null,
  /** SEO 诊断：维度与程度分别筛选，交集展示 */
  onPageDiagDim: null,
  onPageDiagSev: null,
  /** Headings：H1–H6 数量条筛选，null 为不限 */
  onPageHeadingFilter: null,
  /** 图片页签：同时筛选无 ALT / 无 Title（数组，空为不限） */
  onPageImageFilters: [],
  /** 抽屉「链接」子页签：in | out */
  onPageLinkSub: 'in',
  /** 链接表 Follow 筛选：null=不限 | dofollow | nofollow（再点已选项取消筛选） */
  onPageLinkRelFilter: null,
  /** 曝光页：有排名关键词弹窗路径 */
  rankedKwModalPath: null,
  /** 有排名关键词弹窗表头排序 */
  rankedKwModalSortKey: 'kw',
  rankedKwModalSortDir: 'asc',
  /** 待办任务：按页面路径筛选 */
  dashboardTasksPageFilter: '',
  /** 待办：按问题等级（与站点得分徽章联动） */
  dashboardTasksIssueFilter: '',
  /** 待办：按问题模块筛选 */
  dashboardTasksModuleFilter: '',
  /** 仪表盘 · 最近抓取概览子页签：kw | pages */
  dashboardCrawlSub: 'kw',
  /** 仪表盘 · 最近抓取按搜索引擎筛选 */
  dashboardCrawlEngineFilter: 'all',
  /** 仪表盘 · 页面概览列表分页 */
  dashboardCrawlPagesPage: 1,
  dashboardCrawlPagesPageSize: 10,
  /** 演示：AI 点数余额 */
  aiPointsDemo: 12800,
  /** 演示：各槽位 AI 推荐是否已展开 { slot: 1 } */
  aiReveal: {},
  /** On-Page 抽屉内「优化建议」块关闭状态 { dismissKey: 1 } */
  onPageDismissSuggest: {},
  /** 待办任务行 AI 弹窗：任务 id */
  dashboardTaskAiId: null,
  /** 待办清单「忽略」：{ [taskId]: 1 }，整站重检完成或单页重检后按规则清除 */
  dashboardDismissedTaskIds: {},
  /** 待办「已完成」勾选：{ [taskId]: true } */
  dashboardTasksCompleted: {},
  /** 待办：是否展示已完成（默认 false = 隐藏） */
  dashboardTasksShowCompleted: false,
  /** 待办表头排序：sev | module */
  dashboardTasksSortKey: 'sev',
  dashboardTasksSortDir: 'asc',
  /** 仪表盘 · 全站 SEO 检测进度 0–100（演示：瞬时完成） */
  dashboardSeoScanPct: 100,
  /** 站点基建检测：idle | scanning */
  dashboardInfraScanStatus: 'idle',
  /** 当前站点已完成站点基建检测次数（≥2 后才可展示「新页面提醒」） */
  dashboardInfraScanCount: 0,
  _infraScanSiteId: null,
  /** On-Page 列表：行勾选（提交索引批量） */
  onPageSeoBulkSelected: {},
  /** 标签筛选下拉是否展开 */
  onPageSeoTagDdOpen: false,
  /** 状态筛选下拉 */
  onPageSeoStatusDdOpen: false,
  /** HTTP 状态码多选，空为不限 */
  onPageSeoStatusFilter: [],
  /** 标签下拉内搜索文案 */
  onPageSeoTagDdQuery: '',
  /** 曝光页面列表：搜索引擎筛选，all 或 engine 字符串 */
  pageRankListEngineFilter: 'all',
  /** 页面整合优化：按页面类型多选筛选 */
  onPageSeoFilterPageTypes: [],
  /** 曝光页面：路径/标题搜索 */
  pageRankListFilter: '',
  /** 曝光页面：表头排序 */
  pageRankListSortKey: 'rankedKwCount',
  pageRankListSortDir: 'desc',
  /** 曝光页面：是否展示上方数据概览 */
  pageRankListShowMetrics: true,
  /** On-Page 列表表头排序 */
  onPageSeoSortKey: '',
  onPageSeoSortDir: 'asc',
  /** On-Page 列表分页与搜索（搜索写入 state 后整表重渲染） */
  onPageSeoListPage: 1,
  onPageSeoListPageSize: 20,
  onPageSeoFilterQuery: '',
  /** 曝光页面列表：字段配置面板 */
  pageRankListFieldOpen: false,
  pageRankListColOrder: null,
  pageRankListColHidden: null,
  /** 曝光页列表「页面」列是否显示标题（false 时仅保留 URL） */
  pageRankListShowPageTitle: true,
  /** 编辑目标词弹窗：草稿词条（取消关闭时丢弃） */
  onPageKwModalDraft: null,
};

const DEMO_TODAY = new Date(2025, 8, 30);

function pad2(n) { return String(n).padStart(2, '0'); }
function formatDateYMD(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function parseYMD(s) {
  const p = s.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}
function daysInclusiveLabel(startStr, endStr) {
  const n = Math.round((parseYMD(endStr) - parseYMD(startStr)) / 864e5) + 1;
  return n;
}
function applyDatePreset(preset) {
  state.dateRangePreset = preset;
  const end = new Date(DEMO_TODAY);
  let start = new Date(DEMO_TODAY);
  if (preset === 'last7') {
    start.setDate(end.getDate() - 6);
  } else if (preset === 'last15') {
    start.setDate(end.getDate() - 14);
  } else if (preset === 'last30') {
    start.setDate(end.getDate() - 29);
  } else if (preset === 'thisMonth') {
    start = new Date(end.getFullYear(), end.getMonth(), 1);
    /* end 保持为统计日（演示为当月最后一天或今日） */
  } else if (preset === 'lastMonth') {
    const firstThis = new Date(end.getFullYear(), end.getMonth(), 1);
    const lastPrev = new Date(firstThis.getTime() - 864e5);
    start = new Date(lastPrev.getFullYear(), lastPrev.getMonth(), 1);
    end.setTime(lastPrev.getTime());
  }
  state.dateRangeStart = formatDateYMD(start);
  state.dateRangeEnd = formatDateYMD(end);
}

const ICON_SVG = {
  /* Settings / 设置（滑块调节） */
  settings: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/><circle cx="13" cy="5" r="1.8" fill="currentColor"/><circle cx="7" cy="10" r="1.8" fill="currentColor"/><circle cx="11" cy="15" r="1.8" fill="currentColor"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  /* reset / 更新排名 */
  reset: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 00-9-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74L21 16"/><path d="M21 21v-5h-5"/></svg>`,
  more: `<svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><circle cx="10" cy="4" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="10" cy="16" r="1.6"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
};

/* ── DOM helpers ── */
const $ = id => document.getElementById(id);
const site = () => DB.sites.find(s => s.id === state.siteId) || DB.sites[0];

/** 当前站点是否已授权绑定领动 SaaS 独立站（演示：见 DB.siteAuths） */
function siteLeadongSaasAuthorized() {
  const sid = state.siteId;
  return (DB.siteAuths || []).some(a => {
    if (a.geSiteId !== sid) return false;
    if (String(a.status || '').toLowerCase() !== 'active') return false;
    return !!(a.leadongSiteId || /领动/i.test(String(a.type || '')));
  });
}

function modalLeadongSaasLockBannerHTML() {
  if (siteLeadongSaasAuthorized()) return '';
  return `<div class="modal-saas-lock-banner" role="note">
    <strong>需要授权绑定独立站后才可编辑并同步到站前台</strong>
    <p>当前站点未检测到有效的独立站授权，本弹窗内字段为只读预览。可将下方 AI 推荐内容复制后，在独立站后台对应位置手动粘贴；完成授权后，保存将可按流程同步到站点。</p>
  </div>`;
}

function modalPrimarySaveBtnLockedAttrs() {
  if (siteLeadongSaasAuthorized()) return '';
  return ` disabled="disabled" title="${escapeAttr('需先完成领动 SaaS 独立站授权绑定后才可保存并同步（示例）')}" style="opacity:0.55;cursor:not-allowed;"`;
}

/** 站点是否以 HTTPS 对外提供（演示：默认 true；若站点对象含 publicHttp: true 则为纯 HTTP） */
function siteUsesHttps() {
  const s = site();
  if (s && s.publicHttp === true) return false;
  return true;
}

const HTTPS_LOCK_SVG = '<svg class="https-lock-ic" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" stroke-width="1.35" stroke-linecap="round" d="M4 7V4.25A4 4 0 0112 4.25V7"/><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.35"/></svg>';

/** 在页面 URL 展示文本前增加「小锁」图标（站点为 HTTPS 时） */
function httpsLockPrefixHTML() {
  if (!siteUsesHttps()) return '';
  return `<span class="https-lock-wrap" title="HTTPS 加密传输">${HTTPS_LOCK_SVG}</span>`;
}

/** 授权选站：独立站域名与增长引擎站点域名一致（忽略大小写、www、协议） */
function normAuthDomainHost(d) {
  let s = String(d || '').trim().toLowerCase();
  s = s.replace(/^https?:\/\//i, '').split(/[/?#]/)[0];
  return s.replace(/^www\./, '');
}
function leadongSaasSiteDomainMatchesGe(leadongDomain, geSiteDomain) {
  return normAuthDomainHost(leadongDomain) === normAuthDomainHost(geSiteDomain);
}
function leadongMatchedSitesForGe(geSite) {
  if (!geSite) return [];
  return LEADONG_SAAS_SITES_DEMO.filter(o => leadongSaasSiteDomainMatchesGe(o.domain, geSite.domain));
}

/* ── Toast ── */
function toast(msg, type = 'success') {
  const wrap = $('toastWrap');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  el.innerHTML = `<span style="font-size:16px;flex-shrink:0;">${icons[type]||'✓'}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ── Site avatar gradient colors ── */
const AVATAR_COLORS = [
  'linear-gradient(135deg,#2563eb,#7c3aed)',
  'linear-gradient(135deg,#059669,#0891b2)',
  'linear-gradient(135deg,#d97706,#dc2626)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
];
function siteAvatar(name, idx) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initial = name ? name[0].toUpperCase() : '?';
  return `<div class="site-card-favicon" style="background:${color};">${initial}</div>`;
}

function icon(name) {
  const icons = {
    dashboard: `<svg viewBox="0 0 20 20" fill="currentColor"><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/></svg>`,
    search:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="9" r="5.5"/><line x1="13.5" y1="13.5" x2="17" y2="17"/></svg>`,
    geo:       `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="7"/><ellipse cx="10" cy="10" rx="3.5" ry="7"/><line x1="3" y1="10" x2="17" y2="10"/></svg>`,
    seo:       `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h12v2H4zM4 10h12v6H4z"/><path d="M7 8v2M10 8v2M13 8v2"/></svg>`,
    settings:  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/><circle cx="13" cy="5" r="1.8" fill="currentColor"/><circle cx="7" cy="10" r="1.8" fill="currentColor"/><circle cx="11" cy="15" r="1.8" fill="currentColor"/></svg>`,
    admin:     `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="16" height="12" rx="1"/><path d="M6 5V4a4 4 0 018 0v1"/></svg>`,
    writing:   ICON_SVG.edit,
  };
  return icons[name] || '';
}

function renderNav() {
  const items = [
    { id:'dashboard', label:'仪表盘' },
    { id:'search',    label:'搜索' },
    { id:'geo',       label:'GEO' },
    { id:'writing',   label:'内容' },
    { id:'settings',  label:'设置' },
  ];
  $('sidebarNav').innerHTML = items.map(item => {
    const off = !RELEASE_SCOPE.primary.has(item.id);
    const active = !off && state.primary === item.id;
    return `<button type="button" class="nav-item${active ? ' active' : ''}${off ? ' nav-item--scope-off' : ''}" data-primary="${item.id}"${off ? ' disabled aria-disabled="true" title="本期不涉及"' : ''}>
      <span class="nav-icon">${icon(item.id === 'admin' ? 'admin' : item.id)}</span>
      <span class="nav-label">${item.label}</span>
    </button>`;
  }).join('');
  $('sidebarNav').querySelectorAll('.nav-item').forEach(btn => {
    if (btn.disabled) return;
    btn.onclick = () => {
      state.devInternalPage = null;
      state.logicDrawerTreeSelection = null;
      state.primary = btn.dataset.primary;
      if (state.primary === 'search') state.secondary = 'page-seo';
      if (state.primary === 'settings') state.settingsTab = 'package';
      if (state.primary === 'dashboard') state.dashboardTab = 'overview';
      render();
    };
  });
}

function renderTopbar() {
  const s = site();
  $('siteNameLabel').textContent   = s.name;
  $('siteDomainLabel').textContent = s.domain;

  // Site dropdown list with avatars
  $('siteDropdownList').innerHTML = DB.sites.map((si, idx) => {
    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    const initial = si.name[0].toUpperCase();
    return `
    <div class="site-dropdown-item ${si.id===state.siteId?'active':''}" data-site="${si.id}">
      <div class="item-favicon" style="background:${color};">${initial}</div>
      <div class="item-info">
        <span class="item-name">${si.name}</span>
        <span class="item-domain">${si.domain}</span>
      </div>
      <div class="site-dropdown-item-actions">
        <button type="button" class="site-dd-icon-btn" title="设置" aria-label="设置" onclick="event.stopPropagation();state.siteId=${si.id};closeDropdown();openModal('site-settings');">${ICON_SVG.settings}</button>
        <button type="button" class="site-dd-icon-btn" title="更新排名" aria-label="更新排名" onclick="event.stopPropagation();state.siteId=${si.id};closeDropdown();openModal('update-rank');">${ICON_SVG.reset}</button>
      </div>
      <div class="site-dropdown-item-check">${si.id===state.siteId ? '✓' : ''}</div>
    </div>`;
  }).join('');

  $('siteDropdownList').querySelectorAll('.site-dropdown-item').forEach(el => {
    el.onclick = e => { e.stopPropagation(); state.siteId = +el.dataset.site; closeDropdown(); render(); };
  });
  $('siteSwitcher').onclick = e => {
    e.stopPropagation();
    closeDateDropdown();
    $('siteDropdown').classList.toggle('open');
  };
  document.addEventListener('click', () => { $('siteDropdown').classList.remove('open'); }, { once: true });
  $('topAddSiteBtn').onclick = e => { e.stopPropagation(); closeDropdown(); openModal('add-site'); };

  renderTopbarDateRange();
}

function formatDateRangeDisplay() {
  const a = state.dateRangeStart.replace(/-/g, '/');
  const b = state.dateRangeEnd.replace(/-/g, '/');
  const days = daysInclusiveLabel(state.dateRangeStart, state.dateRangeEnd);
  return { label: `${a} – ${b}`, sub: `(GMT+8) (共 ${days} 天)` };
}

function renderTopbarDateRange() {
  const wrap = $('topbarDateWrap');
  if (!wrap) return;
  const showDate =
    state.primary === 'dashboard' ||
    state.primary === 'geo' ||
    (state.primary === 'search' && state.secondary !== 'page-seo');
  if (!showDate) {
    wrap.innerHTML = '';
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = '';
  const { label, sub } = formatDateRangeDisplay();
  const preset = state.dateRangePreset;
  const rankEngUniq = [...new Set((DB.rankedLandingPages || []).map(p => p.engine).filter(Boolean))];
  const showRankEngine = state.primary === 'search' && state.secondary === 'page-rank-list';
  const engSel = showRankEngine
    ? `<div class="topbar-engine-filter">
        <label class="topbar-engine-filter-lbl" for="pageRankListEngineSel">搜索引擎</label>
        <select id="pageRankListEngineSel" class="topbar-engine-select" onchange="state.pageRankListEngineFilter=this.value;render();">
          <option value="all"${state.pageRankListEngineFilter === 'all' ? ' selected' : ''}>全部</option>
          ${rankEngUniq.map(en => `<option value="${escapeAttr(en)}"${state.pageRankListEngineFilter === en ? ' selected' : ''}>${escapeHtmlStr(en)}</option>`).join('')}
        </select>
      </div>`
    : '';
  wrap.innerHTML = `${engSel}
    <div class="topbar-date-range topbar-date-trigger" id="topbarDateTrigger" role="button" tabindex="0">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="#666"><rect x="1" y="3" width="14" height="11" rx="1" ry="1" fill="none" stroke="#666" stroke-width="1.2"/><line x1="5" y1="1" x2="5" y2="5" stroke="#666" stroke-width="1.2"/><line x1="11" y1="1" x2="11" y2="5" stroke="#666" stroke-width="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="#666" stroke-width="1.2"/></svg>
      <span id="topbarDateLabel">${label}</span>
      <span class="date-sub" id="topbarDateSub">${sub}</span>
      <svg class="caret" viewBox="0 0 10 6" width="9" height="5"><path d="M0 0l5 6 5-6z" fill="#999"/></svg>
    </div>
    <div class="date-range-dropdown" id="dateRangeDropdown" style="display:none;">
      <div class="date-range-presets">
        <button type="button" class="date-range-preset ${preset==='last7'?'active':''}" data-preset="last7">近 7 天</button>
        <button type="button" class="date-range-preset ${preset==='last15'?'active':''}" data-preset="last15">近 15 天</button>
        <button type="button" class="date-range-preset ${preset==='last30'?'active':''}" data-preset="last30">近 30 天</button>
        <button type="button" class="date-range-preset ${preset==='thisMonth'?'active':''}" data-preset="thisMonth">本月</button>
        <button type="button" class="date-range-preset ${preset==='lastMonth'?'active':''}" data-preset="lastMonth">上月</button>
      </div>
      <div class="date-range-custom">
        <span class="date-range-custom-label">自定义区间</span>
        <div class="date-range-inputs">
          <input type="date" id="dateRangeStart" class="date-range-input" value="${state.dateRangeStart}"/>
          <span class="date-range-sep">–</span>
          <input type="date" id="dateRangeEnd" class="date-range-input" value="${state.dateRangeEnd}"/>
        </div>
        <button type="button" class="btn-primary btn-date-apply" id="dateRangeApplyBtn">应用</button>
      </div>
    </div>`;

  const trigger = $('topbarDateTrigger');
  const dd = $('dateRangeDropdown');
  const applyCustom = () => {
    const s = $('dateRangeStart').value;
    const e = $('dateRangeEnd').value;
    if (s && e && parseYMD(s) <= parseYMD(e)) {
      state.dateRangeStart = s;
      state.dateRangeEnd = e;
      state.dateRangePreset = 'custom';
    }
    dd.style.display = 'none';
    render();
  };
  trigger.onclick = ev => {
    ev.stopPropagation();
    closeDropdown();
    dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  };
  wrap.querySelectorAll('.date-range-preset').forEach(btn => {
    btn.onclick = ev => {
      ev.stopPropagation();
      applyDatePreset(btn.dataset.preset);
      dd.style.display = 'none';
      render();
    };
  });
  $('dateRangeApplyBtn').onclick = ev => { ev.stopPropagation(); applyCustom(); };
  wrap.onclick = e => e.stopPropagation();
  if (!window._topbarDateDdClose) {
    window._topbarDateDdClose = true;
    document.addEventListener('click', () => {
      const d = $('dateRangeDropdown');
      if (d) d.style.display = 'none';
    });
  }
}

function closeDateDropdown() {
  const d = $('dateRangeDropdown');
  if (d) d.style.display = 'none';
}

function closeAllKwOpsMenus() {
  document.querySelectorAll('.kw-ops-wrap.is-open').forEach(w => w.classList.remove('is-open'));
  const portal = $('kwOpsPortal');
  if (portal) {
    portal.innerHTML = '';
    portal.setAttribute('aria-hidden', 'true');
  }
}

function toggleKwOpsMenu(btn, kwId) {
  const wrap = btn.closest('.kw-ops-wrap');
  const willOpen = !wrap.classList.contains('is-open');
  closeAllKwOpsMenus();
  if (!willOpen) return;
  wrap.classList.add('is-open');
  const portal = $('kwOpsPortal');
  if (!portal) return;
  const r = btn.getBoundingClientRect();
  const mw = 148;
  const left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
  const top = r.bottom + 4;
  portal.setAttribute('aria-hidden', 'false');
  portal.innerHTML = `
    <div class="kw-ops-menu kw-ops-menu--portal" role="menu">
      <button type="button" class="kw-ops-item" role="menuitem" onclick="kwRowAction('explore',${kwId})">探索</button>
      <button type="button" class="kw-ops-item" role="menuitem" onclick="kwRowAction('group',${kwId})">分组</button>
      <button type="button" class="kw-ops-item kw-ops-item-primary" role="menuitem" onclick="kwRowAction('write',${kwId})">创建文章</button>
      <button type="button" class="kw-ops-item kw-ops-item-danger" role="menuitem" onclick="kwRowAction('del',${kwId})">删除</button>
    </div>`;
  const menuEl = portal.querySelector('.kw-ops-menu--portal');
  if (menuEl) {
    Object.assign(menuEl.style, {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      minWidth: `${mw}px`,
      zIndex: '10001',
      padding: '4px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      boxShadow: '0 12px 40px rgba(15, 23, 42, 0.14)',
    });
  }
}
if (!window._kwOpsGlobalBound) {
  window._kwOpsGlobalBound = true;
  window.addEventListener('scroll', () => closeAllKwOpsMenus(), true);
  window.addEventListener('resize', () => closeAllKwOpsMenus());
}
if (!window._kwOpsPortalDoc) {
  window._kwOpsPortalDoc = true;
  document.addEventListener('click', e => {
    if (e.target.closest('.kw-ops-btn')) return;
    if (e.target.closest('#kwOpsPortal')) return;
    if ($('kwOpsPortal') && $('kwOpsPortal').innerHTML) closeAllKwOpsMenus();
  });
}

const MY_KW_COL_IDS = ['check', 'kw', 'latest', 'best', 'page', 'serp', 'vol', 'comp', 'cpc', 'trend', 'imp', 'clk', 'ctr', 'groups', 'added', 'updated'];
const MY_KW_COL_LABELS = {
  check: '',
  kw: '关键词 ↕',
  latest: '最新排名 ↕',
  best: '历史最佳 ↕',
  page: '排名最佳网页',
  serp: 'SERP',
  vol: '平均月搜索量 ↕',
  comp: '竞争程度 ↕',
  cpc: 'CPC ↕',
  trend: '搜索趋势 ↕',
  imp: '展示次数 ↕',
  clk: '点击次数 ↕',
  ctr: '点击率 ↕',
  groups: '分组',
  added: '添加日期 ↕',
  updated: '更新日期 ↕',
};

function ensureKwTableState() {
  if (!state.kwTableColOrder || state.kwTableColOrder.length !== MY_KW_COL_IDS.length) {
    state.kwTableColOrder = [...MY_KW_COL_IDS];
  }
  if (!state.kwTableColHidden) state.kwTableColHidden = {};
}

function myKwVisibleColIds() {
  ensureKwTableState();
  return state.kwTableColOrder.filter(id => !state.kwTableColHidden[id]);
}

function myKwThHtml(id) {
  if (id === 'check') return '<th class="th-sticky-check"><input type="checkbox"/></th>';
  if (id === 'kw') return `<th class="th-sticky-kw">${MY_KW_COL_LABELS.kw}</th>`;
  return `<th>${MY_KW_COL_LABELS[id]}</th>`;
}

function myKwTdClass(id) {
  if (id === 'check') return 'td-sticky-check';
  if (id === 'kw') return 'td-sticky-kw';
  return '';
}

function myKwCellHtml(id, k, parts) {
  if (id === 'check') return '<input type="checkbox"/>';
  if (id === 'kw') {
    return `
                <div class="td-kw-with-ops">
                  <span class="td-kw" onclick="openDrawer(${k.id})">${k.kw}</span>
                  <div class="kw-ops-wrap">
                    <button type="button" class="kw-ops-btn" aria-label="操作" onclick="event.stopPropagation();toggleKwOpsMenu(this,${k.id})">${ICON_SVG.more}</button>
                  </div>
                </div>`;
  }
  if (id === 'latest') return parts.rankStr + parts.deltaStr;
  if (id === 'best') return String(k.best);
  if (id === 'page') return parts.pageStr;
  if (id === 'serp') return `<button class="btn-link" onclick="openModal('serp')">预览</button>`;
  if (id === 'vol') return k.vol;
  if (id === 'comp') return k.comp;
  if (id === 'cpc') return k.cpc;
  if (id === 'trend') return parts.trendStr;
  if (id === 'imp') return k.imp.toLocaleString();
  if (id === 'clk') return String(k.clk);
  if (id === 'ctr') return k.ctr;
  if (id === 'groups') return parts.groupTags || '<span style="color:var(--text-light);">-</span>';
  if (id === 'added') return k.added;
  if (id === 'updated') return k.updated;
  return '';
}

function moveKwCol(id, dir) {
  ensureKwTableState();
  const o = state.kwTableColOrder;
  const i = o.indexOf(id);
  if (i < 2) return;
  const ni = i + dir;
  if (ni < 2 || ni >= o.length) return;
  const t = o[i];
  o[i] = o[ni];
  o[ni] = t;
  render();
}

function toggleKwColVisible(id) {
  if (id === 'check' || id === 'kw') return;
  ensureKwTableState();
  state.kwTableColHidden[id] = !state.kwTableColHidden[id];
  render();
}

function toggleKwFieldPanel(ev) {
  ev.stopPropagation();
  closeDateDropdown();
  closeDropdown();
  state.kwFieldConfigOpen = !state.kwFieldConfigOpen;
  render();
}

function saveKwFieldConfig() {
  state.kwFieldConfigOpen = false;
  toast('字段配置已保存');
  render();
}

function kwFieldConfigPanelHTML() {
  ensureKwTableState();
  const movable = MY_KW_COL_IDS.filter(x => x !== 'check' && x !== 'kw');
  return `
    <div class="kw-field-config-dropdown" onclick="event.stopPropagation()">
      <div class="kw-field-config-title">显示字段与顺序</div>
      ${movable.map(id => `
        <div class="kw-field-config-row">
          <label class="kw-field-label">
            <input type="checkbox" ${state.kwTableColHidden[id] ? '' : 'checked'} onchange="toggleKwColVisible('${id}')"/>
            <span>${MY_KW_COL_LABELS[id].replace(' ↕', '')}</span>
          </label>
          <span class="kw-field-move">
            <button type="button" class="kw-field-arrow" title="上移" onclick="moveKwCol('${id}',-1)">↑</button>
            <button type="button" class="kw-field-arrow" title="下移" onclick="moveKwCol('${id}',1)">↓</button>
          </span>
        </div>`).join('')}
      <button type="button" class="btn-primary kw-field-save-btn" onclick="saveKwFieldConfig()">保存</button>
    </div>`;
}

/** 页面类型（最多 1 个，与建站 SaaS 常见类型对齐） */
const ONPAGE_PAGE_TYPES = [
  { id: 'homepage', label: '首页', systemOnly: true, hint: '站点根路径（/）由系统自动识别为首页，不可手动改选其他类型覆盖。' },
  { id: 'article-cat', label: '文章分类页', hint: '博客/资讯栏目列表，聚合多篇内容入口，宜有清晰栏目说明与内链。' },
  { id: 'product-cat', label: '产品分类页', hint: '产品系列或目录列表，导向详情与询盘，宜覆盖类目核心词。' },
  { id: 'article-detail', label: '文章详情页', hint: '单篇博客、新闻或知识正文，宜充足字数与发布时间等结构化信息。' },
  { id: 'product-detail', label: '产品详情页', hint: '单个产品展示页，宜含规格、图片 Alt、Offer 等结构化字段。' },
  { id: 'marketing-lp', label: '营销落地页', hint: '活动/渠道投放专题页，突出单一转化目标与卖点。' },
  { id: 'marketing-cv', label: '营销转化页', hint: '表单、询盘、注册等强转化页，短文也需意图明确。' },
  { id: 'case-study', label: '客户案例页', hint: '案例故事、成功实践，宜有可信细节与相关内链。' },
  { id: 'about-contact', label: '联系/关于页', hint: '公司介绍、联系方式、资质。' },
  { id: 'tag-page', label: '标签页', hint: '按标签聚合的内容列表，注意与主栏目区分避免重复收录。' },
  { id: 'resource', label: '资源页', hint: '下载、白皮书、目录等资源聚合，宜说明资源类型与获取方式。' },
];

const ONPAGE_PAGE_TYPES_MANUAL = ONPAGE_PAGE_TYPES.filter(t => !t.systemOnly);

const ONPAGE_DIAG_DRAWER_HINT = '检测Title、Meta、Headings、正文、图片 Alt、URL、结构化数据等可量化规则项。对照目标词与行业基线，标出严重问题、优化建议与已通过项，便于逐项修复。';

const ONPAGE_AI_DRAWER_HINT = '聚焦搜索意图、内容质量、主题覆盖、语义完整性、E-E-A-T、转化、内容缺口与增长机会。';

const ONPAGE_SEO_COL_IDS = ['page', 'keyword', 'pageType', 'status', 'index', 'score', 'issues'];
const ONPAGE_SEO_COL_LABELS = {
  page: '页面',
  keyword: '目标词',
  pageType: '页面类型',
  tags: '页面类型',
  status: '状态',
  index: '索引',
  score: '页面得分',
  issues: '检测问题',
};
/** On-Page 列表搜索：含 * 时对 URL 路径做通配匹配 */
const ONPAGE_SEO_SEARCH_HINT = '在路径、标题、目标词中查找。支持用 * 做模糊匹配，例如 /blog/* 只看博客目录下的页面。';
const PAGE_RANK_LIST_SEARCH_HINT = '在路径、标题、最佳关键词中查找。支持用 * 做模糊匹配，例如 /products/* 只看产品目录下的曝光页。';
/** 曝光页 / 落地页 URL 有排名关键词明细弹窗 · 表头悬停说明 */
const URL_RANK_MODAL_TH_HINTS = {
  kw: '在选择的时间段内，该页面仍保有搜索排名的监控关键词。',
  rank: '该词最近一次成功抓取到的自然搜索排名。',
  engine: '该条排名数据来自的搜索引擎与目标地区。',
  time: '上述排名最后一次成功抓取完成的时间；若有多条记录，取时间最近的一次。',
};
/** 页面标签弹窗：不可删除的系统类标签（页面类型等） */
const ONPAGE_SYSTEM_TAGS = new Set(['首页', '产品分类页', '产品详情页', '目录', '博客', 'Blog', '关于页', '联系页', '关于我们']);

function isOnPageSystemTag(tag) {
  return ONPAGE_SYSTEM_TAGS.has(String(tag || '').trim());
}

function collectOnPageSeoAllTags() {
  const s = new Set();
  (DB.onPageSeoPages || []).forEach(r => {
    (Array.isArray(r.tags) ? r.tags : []).forEach(t => {
      if (t && String(t).trim()) s.add(String(t).trim());
    });
  });
  return [...s].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

/** 单页目标词上限（编辑弹窗保存上限） */
const ONPAGE_KW_MAX = 10;
/** 列表列内最多展示的 chip 数，超出显示 +N */
const ONPAGE_KW_LIST_DISPLAY_MAX = 3;

/** 目标词字段：支持逗号/中文标点/换行分隔的多关键词 */
function parseMultiKw(raw) {
  if (raw == null || raw === '') return [];
  return String(raw)
    .split(/[\n\r,，;；、|]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function joinMultiKw(arr) {
  return (arr || []).join('\n');
}

function onPageSeoSearchInnerHTML(opts) {
  const o = opts || {};
  const inputId = o.inputId || 'onpageSeoFilter';
  const placeholder = o.placeholder || '搜索路径、标题、关键词…';
  const hint = o.hint != null ? o.hint : ONPAGE_SEO_SEARCH_HINT;
  const value = o.value != null ? String(o.value) : '';
  const oninput = o.oninput ? String(o.oninput) : 'filterOnPageSeoRows(this.value)';
  return `<div class="onpage-seo-search-inner">
    <input type="search" class="input-search onpage-seo-search-input" placeholder="${escapeAttr(placeholder)}" id="${escapeAttr(inputId)}" value="${escapeAttr(value)}" oninput="${escapeAttr(oninput)}" />
    <span class="onpage-seo-search-hint-wrap" tabindex="0">
      <button type="button" class="onpage-field-hint-btn onpage-seo-search-hint-in" aria-label="搜索说明" data-onpage-hint="${escapeAttr(hint)}">${ONPAGE_SVG_INFO_HINT}</button>
    </span>
  </div>`;
}

function onPageThHintLabelHTML(label, hintText) {
  return `<span class="onpage-th-hint-label" tabindex="0">
    <span class="onpage-th-hint-text">${escapeHtmlStr(label)}</span>
    <span class="onpage-th-hint-pop" role="tooltip">${escapeHtmlStr(hintText)}</span>
  </span>`;
}

function onPageKwSubtabLabelHTML(label, hintText) {
  return `<span class="onpage-kw-subtab-label">
    <span class="onpage-kw-subtab-text">${escapeHtmlStr(label)}</span>
    <button type="button" class="onpage-field-hint-btn onpage-kw-subtab-hint-btn" data-onpage-hint="${escapeAttr(hintText)}" aria-label="${escapeAttr(label + '说明')}" onclick="event.stopPropagation();">${ONPAGE_SVG_INFO_HINT}</button>
  </span>`;
}

function onPageGscUnauthorizedPaneHTML() {
  return `<div class="onpage-gsc-unauthorized-pane" role="status">
    <div class="onpage-gsc-unauthorized-ic" aria-hidden="true">${ONPAGE_GSC_TAB_ICON}</div>
    <h4 class="onpage-gsc-unauthorized-title">未授权 Google Search Console</h4>
    <p class="onpage-gsc-unauthorized-desc">完成授权后，可在此查看与本页相关的搜索查询，以及所选日期区间内的曝光、点击、点击率与平均排名（示例数据）。</p>
    <button type="button" class="btn-primary btn-sm" onclick="closeDrawer();state.primary='settings';state.settingsTab='site-mgmt';state.settingsSub='auth';render();">前往网站设置授权</button>
  </div>`;
}

/** 表头排序图标：未激活为双箭头，激活后高亮当前方向 */
function tableSortIconHTML(activeKey, colId, dir) {
  const on = activeKey === colId;
  const cls = on
    ? `th-sort-ic th-sort-ic--on th-sort-ic--${dir === 'desc' ? 'desc' : 'asc'}`
    : 'th-sort-ic th-sort-ic--idle';
  return `<span class="${cls}" title="点击排序" aria-hidden="true"><svg class="th-sort-ic-svg" viewBox="0 0 10 12" width="10" height="12" focusable="false"><path class="th-sort-ic-up" d="M5 1.5L8.5 6H1.5z"/><path class="th-sort-ic-down" d="M5 10.5L1.5 6h7z"/></svg></span>`;
}

function tableSortThBtnHTML(label, hint, colId, sortKey, sortDir, onclickName) {
  const labelHtml = hint ? onPageThHintLabelHTML(label, hint) : escapeHtmlStr(label);
  const icon = tableSortIconHTML(sortKey, colId, sortDir);
  return `<button type="button" class="th-sort-btn th-sort-btn--with-ic" onclick="${onclickName}('${colId}')"><span class="th-sort-btn-label">${labelHtml}</span>${icon}</button>`;
}

function collectOnPageSeoHttpStatuses(rows) {
  const s = new Set();
  (rows || []).forEach(r => {
    const c = r.httpStatus != null ? Number(r.httpStatus) : 200;
    if (!Number.isNaN(c)) s.add(c);
  });
  return [...s].sort((a, b) => a - b);
}

/** 本期索引监控仅 Google（GSC） */
const ONPAGE_INDEX_ENGINES = [
  { key: 'google', short: 'G', label: 'Google', logoUrl: 'https://www.google.com/favicon.ico' },
];

function siteHasGscConnected() {
  const si = site();
  return !!(si && (si.hasGSC || si.gscAuthorized));
}

function siteGscAccountBlocked() {
  const si = site();
  return !!(si && si.gscAccountBlocked);
}

/** 本期页面库是否已从 sitemap.xml 解析到 URL */
function siteOnPageSitemapDetected() {
  const si = site();
  return si.onPageSitemapDetected !== false;
}

/** 当前站点在「页面整合优化」列表中展示的页面行（本期仅 sitemap 来源） */
function onPageSeoPagesForCurrentSite() {
  if (!siteOnPageSitemapDetected()) return [];
  if (site().onPageListEmpty) return [];
  return DB.onPageSeoPages || [];
}

function onPageSeoListEmptyPaneHTML(kind) {
  if (kind === 'no-sitemap') {
    return `<div class="onpage-seo-list-empty" role="status">
      <h4 class="onpage-seo-list-empty-title">未检测到 Sitemap</h4>
      <p class="onpage-seo-list-empty-desc">尚未发现可解析的 <strong>sitemap.xml</strong>，无法生成页面列表。请确认站点根目录或 robots.txt 中已声明站点地图，并在「仪表盘 › 网站概览 › 站点基建」中重新检测后返回查看。</p>
      <button type="button" class="btn-primary btn-sm" onclick="state.primary='dashboard';state.secondary='overview';render();">前往网站概览</button>
    </div>`;
  }
  return `<div class="onpage-seo-list-empty" role="status">
    <h4 class="onpage-seo-list-empty-title">暂无页面</h4>
    <p class="onpage-seo-list-empty-desc">已检测到 Sitemap，但当前未解析到可展示的 URL。请检查 Sitemap 是否为空、是否被 robots 屏蔽，或等待下一次同步完成。</p>
  </div>`;
}

function onPageSeoIndexThInnerHTML() {
  const lab = ONPAGE_SEO_COL_LABELS.index;
  const hint = '该页是否已被 Google 收录。需先在「网站设置 › 授权管理」绑定 Google Search Console；完成站点地图检测后，列表会随页面库更新。本期仅展示 Google 收录状态。';
  if (siteGscAccountBlocked()) {
    const blockHint = 'Google 账号状态异常，暂无法查询收录情况。请按 Google 指引处理账号后，在「网站设置 › 授权管理」重新授权。';
    return `<div class="onpage-seo-th-inner onpage-seo-th-inner--index-warn">
      <span class="onpage-seo-th-gsc-warn" tabindex="0" title="${escapeAttr(blockHint)}">
        <span class="onpage-seo-th-gsc-warn-ic" aria-hidden="true">!</span>
        <span class="onpage-th-hint-label">
          <span class="onpage-th-hint-text">${escapeHtmlStr(lab)}</span>
          <span class="onpage-th-hint-pop" role="tooltip">${escapeHtmlStr(blockHint)}</span>
        </span>
      </span>
    </div>`;
  }
  return `<div class="onpage-seo-th-inner">${onPageThHintLabelHTML(lab, hint)}</div>`;
}

function onPageSeoIndexCellHTML(r) {
  if (siteGscAccountBlocked()) {
    return `<div class="onpage-index-cell onpage-index-cell--blocked" onclick="event.stopPropagation();" title="GSC 授权账号异常，索引功能已暂停">—</div>`;
  }
  if (!siteHasGscConnected()) {
    return `<div class="onpage-index-cell onpage-index-cell--noauth" tabindex="0">
      <span class="onpage-index-noauth-txt">未配置</span>
      <div class="onpage-index-noauth-pop" role="tooltip">
        <div class="onpage-index-noauth-pop-inner">连接 Google Search Console 后，可在此查看 Google 对该页的索引状态。</div>
        <button type="button" class="btn-link onpage-index-noauth-pop-link" onclick="event.stopPropagation();state.primary='settings';state.settingsTab='site-mgmt';state.settingsSub='auth';render();">前往授权管理</button>
      </div>
    </div>`;
  }
  const ix = r.indexEngines && typeof r.indexEngines === 'object' ? r.indexEngines : {};
  return `<div class="onpage-index-logos" onclick="event.stopPropagation();" title="Google 索引状态（示例）">${ONPAGE_INDEX_ENGINES.map(e => {
    const on = ix[e.key] ? ' onpage-index-logo--on' : '';
    const src = escapeAttr(e.logoUrl || '');
    const lab = escapeAttr(`${e.label} ${ix[e.key] ? '已索引' : '未索引'}`);
    return `<span class="onpage-index-logo onpage-index-logo--img${on}" aria-label="${lab}"><img src="${src}" alt="" width="16" height="16" loading="lazy" decoding="async" /></span>`;
  }).join('')}</div>`;
}

function onPageLinkStatusBadge(st) {
  const code = st && st.code != null ? Number(st.code) : 200;
  if (code >= 200 && code < 300) return `<span class="badge badge-green">正常 ${code}</span>`;
  if (code >= 300 && code < 400) return `<span class="badge badge-blue">跳转 ${code}</span>`;
  if (code >= 400) return `<span class="badge badge-red">异常 ${code}</span>`;
  return `<span class="badge badge-gray">未知</span>`;
}

function onPageGetLinksRows(row, sub) {
  const dom = site().domain;
  const base = `https://${dom}`;
  const p = String(row.path || '/');
  if (sub === 'in') {
    return [
      { text: '产品目录', title: '', rel: 'dofollow', url: `${base}/products.html`, status: { code: 200, label: '可访问' } },
      { text: '关于我们', title: '公司简介', rel: 'nofollow', url: `${base}/about-us.html`, status: { code: 200, label: '可访问' } },
      { text: '博客', title: '', rel: 'dofollow', url: `${base}/blog/construction-hardware-trends.html`, status: { code: 404, label: '无法访问' } },
    ];
  }
  return [
    { text: 'Google Rich Results Test', title: 'Google 富摘要检测工具', rel: 'dofollow', url: 'https://search.google.com/test/rich-results', kind: 'text', status: { code: 200, label: '可访问' } },
    { text: '产品主图（图片链接）', title: '', rel: 'dofollow', url: `${base}/media/hero-main.jpg`, kind: 'image', thumb: `https://picsum.photos/seed/${encodeURIComponent(dom)}lnkimg/40/40`, status: { code: 200, label: '可访问' } },
    { text: '示例外链', title: '', rel: 'nofollow', url: 'https://example.com/partners', kind: 'text', status: { code: 200, label: '可访问' } },
    { text: '合作伙伴门户', title: '登录', rel: 'dofollow', url: 'https://partner.example.com/login', kind: 'text', status: { code: 403, label: '拒绝访问' } },
  ];
}

function onPageLinkAnchorCellHTML(lk) {
  const isImg = lk.kind === 'image';
  const thumb = isImg && lk.thumb
    ? `<span class="onpage-link-anchor-thumb"><img src="${escapeAttr(lk.thumb)}" width="28" height="28" alt="" loading="lazy"/></span>`
    : '';
  if (isImg) {
    return `<td class="onpage-link-anchor-cell onpage-link-anchor-cell--image">${thumb}</td>`;
  }
  const raw = lk.text && String(lk.text).trim();
  const labelInner = raw ? escapeHtmlStr(raw) : '—';
  const tip = escapeAttr(raw || lk.url || '');
  return `<td class="onpage-link-anchor-cell">${thumb}<span class="onpage-link-anchor-txt" title="${tip}">${labelInner}</span></td>`;
}

function onPageSeoLinksTabHTML(row) {
  const sub = state.onPageLinkSub === 'out' ? 'out' : 'in';
  const inA = sub === 'in' ? ' active' : '';
  const outA = sub === 'out' ? ' active' : '';
  const relF = state.onPageLinkRelFilter;
  const dfA = relF === 'dofollow' ? ' active' : '';
  const nfA = relF === 'nofollow' ? ' active' : '';
  const rows = onPageGetLinksRows(row, sub).filter(lk => {
    if (relF === 'dofollow') return lk.rel === 'dofollow';
    if (relF === 'nofollow') return lk.rel === 'nofollow';
    return true;
  });
  const body = rows.length
    ? rows.map(lk => `
      <tr>
        ${onPageLinkAnchorCellHTML(lk)}
        <td class="onpage-link-title-cell" style="font-size:12px;color:var(--text-2);max-width:120px;">${lk.title ? escapeHtmlStr(lk.title) : '<span style="color:var(--text-3);">—</span>'}</td>
        <td style="white-space:nowrap;">${lk.rel === 'nofollow' ? '<span class="badge badge-gray">Nofollow</span>' : '<span class="badge badge-green">Dofollow</span>'}</td>
        <td class="onpage-link-url-cell" style="font-size:12px;">${/^https:\/\//i.test(String(lk.url || '')) ? httpsLockPrefixHTML() : ''}<code>${escapeHtmlStr(lk.url)}</code></td>
        <td style="white-space:nowrap;">${onPageLinkStatusBadge(lk.status)}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;padding:16px;color:var(--text-3);">当前筛选下无链接（示例）</td></tr>`;
  return `
    <div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--links">
      <div class="onpage-links-toolbar onpage-links-toolbar--valign">
        <div class="onpage-subtabs onpage-subtabs--intl onpage-subtabs--links">
          <button type="button" class="onpage-subtab${inA}" onclick="state.onPageLinkSub='in';renderDrawer();">站内链接</button>
          <button type="button" class="onpage-subtab${outA}" onclick="state.onPageLinkSub='out';renderDrawer();">出站链接</button>
        </div>
        <div class="onpage-img-filter-toggle onpage-link-rel-toggle" role="group" aria-label="Follow 筛选（再点已选项可取消）">
          <button type="button" class="onpage-img-filter-btn${dfA}" onclick="onPageToggleLinkRelFilter('dofollow')">Dofollow</button>
          <button type="button" class="onpage-img-filter-btn${nfA}" onclick="onPageToggleLinkRelFilter('nofollow')">Nofollow</button>
        </div>
      </div>
      <div class="onpage-links-table-wrap">
      <table class="data-table onpage-mini-table onpage-mini-table--links">
        <thead><tr>
          <th class="onpage-link-anchor-th">${onPageThHintLabelHTML('锚文本', '访客在页面上看到的可点击文字；图片链接会显示为「图片」。')}</th>
          <th>${onPageThHintLabelHTML('title', '鼠标悬停在链接上时，浏览器可能显示的一行补充说明。')}</th>
          <th style="width:100px;">${onPageThHintLabelHTML('Follow', '表示该链接是否愿意把权重传递给目标页面：Dofollow 会传递，Nofollow 一般用于广告或不可控外链。')}</th>
          <th class="onpage-link-url-th">${onPageThHintLabelHTML('URL', '点击后将要打开的目标网址。')}</th>
          <th style="width:96px;">${onPageThHintLabelHTML('状态', '检测该链接目标地址是否可正常访问（示例 HTTP 状态）。')}</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>
      </div>
    </div>`;
}

window.onPageToggleLinkRelFilter = function (mode) {
  state.onPageLinkRelFilter = state.onPageLinkRelFilter === mode ? null : mode;
  renderDrawer();
};

function getRankedLandingPagesForView() {
  const all = (DB.rankedLandingPages || []).map(enrichRankedLandingPageRow);
  if (state.primary !== 'search' || state.secondary !== 'page-rank-list') return all;
  const f = state.pageRankListEngineFilter;
  if (!f || f === 'all') return all;
  return all.filter(p => String(p.engine || '') === f);
}

const EXPOSURE_PAGE_TREND_MAX_TASKS = 15;

function getExposurePageCrawlTasksInRange() {
  const start = state.dateRangeStart;
  const end = state.dateRangeEnd;
  return (DB.exposurePageRankCrawlTasks || [])
    .filter(t => t && t.taskAt && t.taskAt >= start && t.taskAt <= end)
    .sort((a, b) => String(a.taskAt).localeCompare(String(b.taskAt)));
}

/** 曝光页概览：卡片=筛选条件下最后一次抓取任务指标；折线最多最近 15 次任务 */
function rankedLandingPagesTrendFromCrawlTasks() {
  const tasksAll = getExposurePageCrawlTasksInRange();
  const lastTask = tasksAll.length ? tasksAll[tasksAll.length - 1] : null;
  const cardCount = lastTask && lastTask.rankedPageCount != null ? lastTask.rankedPageCount : 0;
  const cardAvg = lastTask && lastTask.avgBestRank != null && !Number.isNaN(Number(lastTask.avgBestRank))
    ? Number(lastTask.avgBestRank).toFixed(1)
    : '—';
  let tasks = tasksAll;
  if (tasks.length > EXPOSURE_PAGE_TREND_MAX_TASKS) {
    tasks = tasks.slice(-EXPOSURE_PAGE_TREND_MAX_TASKS);
  }
  if (!tasks.length) {
    return { seriesCount: [], seriesAvg: [], dates: [], cardCount, cardAvg, taskTotal: 0, taskShown: 0 };
  }
  return {
    seriesCount: tasks.map(t => t.rankedPageCount),
    seriesAvg: tasks.map(t => t.avgBestRank),
    dates: tasks.map(t => t.taskAt),
    cardCount,
    cardAvg,
    taskTotal: tasksAll.length,
    taskShown: tasks.length,
  };
}

function rankedLandingPagesStatsPanelsHTML() {
  const trend = rankedLandingPagesTrendFromCrawlTasks();
  const trendUid = 'dcrawl';
  const trendPages = rankedPagesTrendSparklineHTML(trend.seriesCount, '#3b82f6', trendUid + 'pc', '有排名页面数', trend.dates);
  const trendAvg = rankedPagesTrendSparklineHTML(trend.seriesAvg, '#8b5cf6', trendUid + 'pa', '平均最佳排名', trend.dates);
  const hintRankedPages = '卡片为当前筛选下最后一次抓取任务的有排名页面数；折线最多展示最近 15 次任务。';
  const hintAvgBest = '卡片为最后一次抓取任务的平均最佳排名；折线最多展示最近 15 次任务。';
  return `<div class="site-overview-metrics dashboard-page-rank-metrics dashboard-crawl-page-metrics">
    <div class="som-panel">
      <div class="som-label" title="${escapeAttr(hintRankedPages)}">有排名页面</div>
      <div class="som-value-row"><span class="som-value">${trend.cardCount}</span></div>
      ${trendPages}
    </div>
    <div class="som-panel">
      <div class="som-label" title="${escapeAttr(hintAvgBest)}">平均最佳排名</div>
      <div class="som-value-row"><span class="som-value">${trend.cardAvg}</span></div>
      ${trendAvg}
    </div>
  </div>`;
}

function dashboardKwSpark4PanelsHTML() {
  const kwTrend = [75, 80, 78, 84, 87, 90, 92];
  const avgTrend = [18.2, 17.8, 17.1, 16.9, 17.2, 16.6, 16.4];
  const changes = [{ u: 8, d: 3 }, { u: 5, d: 4 }, { u: 7, d: 2 }, { u: 6, d: 5 }, { u: 9, d: 3 }, { u: 7, d: 4 }, { u: 6, d: 2 }];
  const dist = [
    { label: '第1名', val: 4, pct: -4.75, color: '#1d4ed8' },
    { label: '第2-3名', val: 12, pct: -4.75, color: '#2563eb' },
    { label: '第4-10名', val: 30, pct: 4.75, color: '#3b82f6' },
    { label: '第11-30名', val: 35, pct: 4.75, color: '#60a5fa' },
    { label: '>30名', val: 19, pct: 4.75, color: '#93c5fd' },
  ];
  const maxDist = Math.max(...dist.map(d => d.val), 1);
  return `<div class="site-overview-metrics dashboard-crawl-kw-metrics">
    <div class="som-panel">
      <div class="som-label">有排名关键词数</div>
      <div class="som-value-row"><span class="som-value">92</span><span class="som-badge up">↑ +8</span></div>
      <div class="som-chart">${sparklineSVG(kwTrend, '#3b82f6', 'dckw1')}</div>
    </div>
    <div class="som-panel">
      <div class="som-label">排名升降</div>
      <div class="som-value-row"><span class="som-value">+17</span><span class="som-sub">净上升&ensp;<span class="up" style="font-size:11px;font-weight:600;">↑31</span>&ensp;<span class="down" style="font-size:11px;font-weight:600;">↓14</span></span></div>
      <div class="som-chart">${rankBarChartSVG(changes, 'dckwr')}</div>
    </div>
    <div class="som-panel">
      <div class="som-label">平均排名</div>
      <div class="som-value-row"><span class="som-value">16.4</span><span class="som-badge up">↑ +1.2</span></div>
      <div class="som-chart">${sparklineSVG(avgTrend, '#3b82f6', 'dckwa')}</div>
    </div>
    <div class="som-panel">
      <div class="som-label">排名分布</div>
      <div class="som-dist">${dist.map(d => `
        <div class="som-dist-row">
          <span class="som-dist-label">${d.label}</span>
          <span class="som-dist-bar-wrap"><span class="som-dist-bar" style="width:${Math.round(d.val / maxDist * 100)}%;background:${d.color};"></span></span>
          <span class="som-dist-val">${d.val}</span>
          <span class="som-dist-pct ${d.pct >= 0 ? 'up' : 'down'}">${d.pct >= 0 ? '▲' : '▼'}${Math.abs(d.pct)}%</span>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function getDashboardCrawlPages() {
  const all = (DB.rankedLandingPages || []).map(enrichRankedLandingPageRow);
  const f = state.dashboardCrawlEngineFilter;
  if (!f || f === 'all') return all;
  return all.filter(p => String(p.engine || '') === f);
}

function getDashboardCrawlKeywords() {
  const all = DB.keywords || [];
  const f = state.dashboardCrawlEngineFilter;
  if (!f || f === 'all') return all;
  const paths = new Set(getDashboardCrawlPages().map(p => p.path));
  return all.filter(k => !k.bestPage || paths.has(k.bestPage));
}

function dashboardCrawlEngineSelectHTML() {
  const uniq = [...new Set((DB.rankedLandingPages || []).map(p => p.engine).filter(Boolean))];
  const cur = state.dashboardCrawlEngineFilter || 'all';
  return `<label class="dashboard-crawl-engine-lbl" for="dashboardCrawlEngineSel">搜索引擎</label>
    <select id="dashboardCrawlEngineSel" class="form-input dashboard-crawl-engine-select" onchange="setDashboardCrawlEngineFilter(this.value)">
      <option value="all"${cur === 'all' ? ' selected' : ''}>全部</option>
      ${uniq.map(en => `<option value="${escapeAttr(en)}"${cur === en ? ' selected' : ''}>${escapeHtmlStr(en)}</option>`).join('')}
    </select>`;
}

window.setDashboardCrawlEngineFilter = function (v) {
  state.dashboardCrawlEngineFilter = v || 'all';
  state.dashboardCrawlPagesPage = 1;
  render();
};

function dashboardCrawlPagesPagedSlice() {
  const all = getDashboardCrawlPages();
  const size = Math.min(50, Math.max(5, state.dashboardCrawlPagesPageSize || 10));
  const totalPages = Math.max(1, Math.ceil(all.length / size));
  const page = Math.min(Math.max(1, state.dashboardCrawlPagesPage || 1), totalPages);
  const start = (page - 1) * size;
  return { rows: all.slice(start, start + size), total: all.length, page, totalPages, pageSize: size };
}

function listTablePagerFooterHTML(total, page, totalPages, pageSize, pageFn, sizeFn) {
  if (total <= 0) return '';
  return `
    <div class="article-list-footer onpage-seo-list-footer dashboard-crawl-pages-footer">
      <div class="article-list-footer-left">
        <span class="article-list-footer-meta">共 ${total} 条</span>
        <span class="article-list-page-size-label">每页</span>
        <select class="article-list-page-size" onchange="${sizeFn}(+this.value)">
          <option value="10"${pageSize === 10 ? ' selected' : ''}>10</option>
          <option value="20"${pageSize === 20 ? ' selected' : ''}>20</option>
          <option value="50"${pageSize === 50 ? ' selected' : ''}>50</option>
        </select>
        <span class="article-list-page-size-label">条</span>
      </div>
      <div class="article-list-pager">
        <button type="button" class="btn-default" style="height:28px;padding:0 8px;" ${page <= 1 ? 'disabled' : ''} onclick="${pageFn}(${page - 1})">‹</button>
        <button type="button" class="btn-primary" style="height:28px;padding:0 10px;">${page}</button>
        <span style="font-size:12px;color:var(--text-3);padding:0 4px;">/ ${totalPages}</span>
        <button type="button" class="btn-default" style="height:28px;padding:0 8px;" ${page >= totalPages ? 'disabled' : ''} onclick="${pageFn}(${page + 1})">›</button>
      </div>
    </div>`;
}

window.setDashboardCrawlPagesListPageSize = function (n) {
  state.dashboardCrawlPagesPageSize = n;
  state.dashboardCrawlPagesPage = 1;
  render();
};

window.setDashboardCrawlPagesListPage = function (n) {
  state.dashboardCrawlPagesPage = n;
  render();
};

function dashboardCrawlOverviewTableFootHTML(total, maxRows, moreLabel) {
  if (total <= maxRows) return '';
  return `<p class="dashboard-crawl-table-foot">共 ${total} 条，此处展示前 ${maxRows} 条；${moreLabel}</p>`;
}

function dashboardCrawlOverviewKwTableHTML() {
  const kwsAll = getDashboardCrawlKeywords();
  const max = DASHBOARD_CRAWL_OVERVIEW_MAX_ROWS;
  const kws = kwsAll.slice(0, max);
  const rows = kws.map(k => {
    const bestCell = k.bestPage
      ? `<button type="button" class="td-link btn-td-link" onclick="event.stopPropagation();state.kwBestPagesKwId=${k.id};openModal('kw-best-pages');">${httpsLockPrefixHTML()}${escapeHtmlStr(k.bestPage)}${k.extraPages ? ` <span class="badge badge-blue">+${k.extraPages}</span>` : ''}</button>`
      : '—';
    const rk = k.rank != null ? `<span class="badge badge-blue">${k.rank}</span>` : '<span style="color:var(--text-3);">—</span>';
    return `<tr><td><span class="td-kw">${escapeHtmlStr(k.kw)}</span></td><td>${rk}</td><td style="font-size:12px;">${bestCell}</td></tr>`;
  }).join('');
  const foot = dashboardCrawlOverviewTableFootHTML(
    kwsAll.length,
    max,
    '完整列表请前往「搜索 › 我的关键词」。'
  );
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>关键词</th><th>最新排名</th><th>排名最佳网页</th></tr></thead><tbody>${rows}</tbody></table></div>${foot}`;
}

function dashboardCrawlOverviewPagesTableHTML() {
  const { rows: pages, total, page, totalPages, pageSize } = dashboardCrawlPagesPagedSlice();
  const rows = pages.map(p => {
    const cnt = p.rankedKwCount != null
      ? rankedKwCountLinkHTML(p.path, p.rankedKwCount)
      : '—';
    return `
    <tr>
      <td style="font-size:12px;">
        <div style="font-weight:600;margin-bottom:3px;line-height:1.35;">${escapeHtmlStr(p.title || '—')}</div>
        <div class="dashboard-page-path-line">${httpsLockPrefixHTML()}<code>${escapeHtmlStr(p.path)}</code></div>
      </td>
      <td style="font-size:13px;text-align:right;">${cnt}</td>
      <td><span class="td-kw">${escapeHtmlStr(p.bestKw || '—')}</span></td>
      <td>${p.rank != null ? `<span class="badge badge-blue">${p.rank}</span>` : '—'}</td>
    </tr>`;
  }).join('');
  const H = PAGE_RANK_LIST_COL_HINTS;
  return `<div class="table-wrap"><table class="data-table"><thead><tr>
    <th>${onPageThHintLabelHTML('页面', H.page)}</th>
    <th style="width:108px;text-align:right;">${onPageThHintLabelHTML('有排名关键词数', H.rankedKwCount)}</th>
    <th>${onPageThHintLabelHTML('最佳关键词', H.bestKw)}</th>
    <th style="width:88px;">${onPageThHintLabelHTML('最佳排名', H.rank)}</th>
  </tr></thead><tbody>${rows}</tbody></table></div>${listTablePagerFooterHTML(total, page, totalPages, pageSize, 'setDashboardCrawlPagesListPage', 'setDashboardCrawlPagesListPageSize')}`;
}

function dashboardCrawlOverviewSectionHTML() {
  const sub = state.dashboardCrawlSub === 'pages' ? 'pages' : 'kw';
  const lastAt = escapeHtmlStr(DB.dashboardLastCrawlAt || '—');
  const kwA = sub === 'kw' ? ' active' : '';
  const pgA = sub === 'pages' ? ' active' : '';
  const body = sub === 'pages'
    ? `${rankedLandingPagesStatsPanelsHTML()}${dashboardCrawlOverviewPagesTableHTML()}`
    : `${dashboardKwSpark4PanelsHTML()}${dashboardCrawlOverviewKwTableHTML()}`;
  return `
  <div class="panel dashboard-overview-module dashboard-crawl-overview-panel">
    <div class="dashboard-module-hd dashboard-module-hd--crawl">
      <div class="dashboard-module-hd-crawl-left">
        <span class="dashboard-module-hd-text">最近抓取</span>
        <div class="dashboard-crawl-engine-wrap">${dashboardCrawlEngineSelectHTML()}</div>
        <div class="dashboard-crawl-hd-tail">
          <button type="button" class="btn-default btn-sm dashboard-crawl-rank-btn" onclick="submitSiteRankCrawlBatch()">更新排名</button>
          <span class="dashboard-crawl-at"><span class="dashboard-crawl-at-lbl">最近更新：</span><time>${lastAt}</time></span>
        </div>
      </div>
      <div class="dashboard-crawl-subtabs" role="tablist">
        <button type="button" class="dashboard-crawl-subtab${kwA}" role="tab" aria-selected="${sub === 'kw'}" onclick="state.dashboardCrawlSub='kw';render();">关键词概览</button>
        <button type="button" class="dashboard-crawl-subtab${pgA}" role="tab" aria-selected="${sub === 'pages'}" onclick="state.dashboardCrawlSub='pages';render();">页面概览</button>
      </div>
    </div>
    ${body}
  </div>`;
}

const PAGE_RANK_LIST_COL_IDS = ['page', 'rankedKwCount', 'bestKw', 'rank', 'firstSeen', 'lastSeen'];
const PAGE_RANK_LIST_COL_LABELS = {
  page: '页面',
  rankedKwCount: '有排名关键词数',
  bestKw: '最佳关键词',
  rank: '最佳排名',
  firstSeen: '首次曝光',
  lastSeen: '最后曝光',
};
const PAGE_RANK_LIST_COL_HINTS = {
  page: '在选择的时间段和搜索引擎下，曾获得自然搜索排名的页面。',
  rankedKwCount: '该页排进搜索结果中的关键词数量（按各词在时间段内最后一次成功抓取统计）。点击数字可查看完整关键词列表。',
  bestKw: '该页排名最好的关键词词。',
  rank: '「最佳关键词」当前的搜索排名。',
  firstSeen: '该页在选择的时间段内，第一次出现有排名记录的日期。',
  lastSeen: '该页在选择的时间段内，最近一次仍保有排名记录的日期。',
};

function ensurePageRankListTableState() {
  if (!state.pageRankListColOrder || state.pageRankListColOrder.length !== PAGE_RANK_LIST_COL_IDS.length) {
    state.pageRankListColOrder = [...PAGE_RANK_LIST_COL_IDS];
  }
  let ord = state.pageRankListColOrder;
  if (!ord.includes('page')) {
    ord = ['page', ...ord.filter(x => x !== 'page')];
    state.pageRankListColOrder = ord;
  }
  const pi = state.pageRankListColOrder.indexOf('page');
  if (pi > 0) {
    state.pageRankListColOrder.splice(pi, 1);
    state.pageRankListColOrder.unshift('page');
  }
  if (!state.pageRankListColHidden || typeof state.pageRankListColHidden !== 'object') state.pageRankListColHidden = {};
  PAGE_RANK_LIST_COL_IDS.forEach(id => {
    if (id === 'page') return;
    if (state.pageRankListColHidden[id] == null) state.pageRankListColHidden[id] = false;
  });
  if (state.pageRankListShowPageTitle == null) state.pageRankListShowPageTitle = true;
}

window.setPageRankListShowPageTitle = function (show) {
  ensurePageRankListTableState();
  state.pageRankListShowPageTitle = !!show;
  render();
};

window.togglePageRankListFieldPanel = function (ev) {
  ev.stopPropagation();
  closeDateDropdown();
  closeDropdown();
  ensurePageRankListTableState();
  state.pageRankListFieldOpen = !state.pageRankListFieldOpen;
  render();
};

window.savePageRankListFieldConfig = function () {
  state.pageRankListFieldOpen = false;
  toast('字段配置已保存');
  render();
};

window.togglePageRankListColVisible = function (id) {
  ensurePageRankListTableState();
  state.pageRankListColHidden[id] = !state.pageRankListColHidden[id];
  render();
};

window.movePageRankListCol = function (id, delta) {
  ensurePageRankListTableState();
  if (id === 'page') return;
  const ord = state.pageRankListColOrder;
  const i = ord.indexOf(id);
  if (i < 0) return;
  const j = i + delta;
  if (j < 1 || j >= ord.length) return;
  const t = ord[i];
  ord[i] = ord[j];
  ord[j] = t;
  render();
};

function pageRankListFieldConfigPanelHTML() {
  ensurePageRankListTableState();
  const movable = state.pageRankListColOrder.filter(x => x !== 'page');
  return `
    <div class="kw-field-config-dropdown" onclick="event.stopPropagation()">
      <div class="kw-field-config-title">显示字段与顺序</div>
      <div class="kw-field-config-row kw-field-config-row--fixed">
        <label class="kw-field-label">
          <input type="checkbox" ${state.pageRankListShowPageTitle !== false ? 'checked' : ''} onchange="setPageRankListShowPageTitle(this.checked)"/>
          <span><strong>${PAGE_RANK_LIST_COL_LABELS.page}</strong> · 显示页面标题</span>
        </label>
        <span class="kw-field-move kw-field-move--na" title="页面列固定展示 URL">—</span>
      </div>
      <p class="kw-field-config-note">取消「显示页面标题」后，列表仍保留「页面」列与 URL，仅隐藏标题行。</p>
      ${movable.map(id => `
        <div class="kw-field-config-row">
          <label class="kw-field-label">
            <input type="checkbox" ${state.pageRankListColHidden[id] ? '' : 'checked'} onchange="togglePageRankListColVisible('${id}')"/>
            <span>${PAGE_RANK_LIST_COL_LABELS[id]}</span>
          </label>
          <span class="kw-field-move">
            <button type="button" class="kw-field-arrow" title="上移" onclick="movePageRankListCol('${id}',-1)">↑</button>
            <button type="button" class="kw-field-arrow" title="下移" onclick="movePageRankListCol('${id}',1)">↓</button>
          </span>
        </div>`).join('')}
      <button type="button" class="btn-primary kw-field-save-btn" onclick="savePageRankListFieldConfig()">保存</button>
    </div>`;
}

window.pageRankListExportDemo = function () {
  toast('已导出曝光页面列表（示例）');
};

window.togglePageRankListMetrics = function () {
  state.pageRankListShowMetrics = state.pageRankListShowMetrics === false;
  render();
};

window.filterPageRankListRows = function () {
  applyPageRankListFilters();
};

window.applyPageRankListFilters = function () {
  const el = $('pageRankListFilter');
  const raw = (el && el.value ? el.value : state.pageRankListFilter || '').trim().toLowerCase();
  state.pageRankListFilter = el && el.value != null ? el.value : state.pageRankListFilter;
  const dom = site().domain;
  document.querySelectorAll('.page-rank-list-row').forEach(tr => {
    if (!raw) {
      tr.style.display = '';
      return;
    }
    const blob = (tr.getAttribute('data-search') || '').toLowerCase();
    let ok = blob.includes(raw);
    if (!ok && raw.includes('*')) {
      const pat = raw.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
      try {
        const re = new RegExp(pat, 'i');
        const path = tr.getAttribute('data-path') || '';
        ok = re.test(path) || re.test((`https://${dom}${path}`).toLowerCase());
      } catch (e) { ok = false; }
    }
    tr.style.display = ok ? '' : 'none';
  });
};

function rankedLandingPageCellHTML(id, r) {
  if (id === 'page') {
    const pathOnly = state.pageRankListShowPageTitle === false;
    if (pathOnly) {
      return `<td>
        <div class="onpage-page-cell onpage-page-cell--path-only">
          <div class="onpage-page-path">${httpsLockPrefixHTML()}<code>${escapeHtmlStr(r.path)}</code></div>
        </div>
      </td>`;
    }
    return `<td>
        <div class="onpage-page-cell">
          <div class="onpage-page-title">${escapeHtmlStr(r.title)}</div>
          <div class="onpage-page-path">${httpsLockPrefixHTML()}<code>${escapeHtmlStr(r.path)}</code></div>
        </div>
      </td>`;
  }
  if (id === 'rankedKwCount') {
    const cnt = r.rankedKwCount != null
      ? rankedKwCountLinkHTML(r.path, r.rankedKwCount)
      : '—';
    return `<td style="font-size:13px;text-align:right;">${cnt}</td>`;
  }
  if (id === 'bestKw') return `<td><span class="td-kw">${escapeHtmlStr(r.bestKw)}</span></td>`;
  if (id === 'rank') return `<td>${r.rank != null ? `<span class="badge badge-blue">${r.rank}</span>` : '—'}</td>`;
  if (id === 'firstSeen') return `<td style="font-size:12px;color:var(--text-2);">${escapeHtmlStr(r.firstSeen || '—')}</td>`;
  if (id === 'lastSeen') return `<td style="font-size:12px;color:var(--text-2);">${escapeHtmlStr(r.lastSeen || '—')}</td>`;
  return '<td>—</td>';
}

const PAGE_RANK_LIST_SORTABLE = new Set(['rankedKwCount', 'rank', 'firstSeen', 'lastSeen']);

window.sortPageRankListCol = function (id) {
  if (!PAGE_RANK_LIST_SORTABLE.has(id)) return;
  if (state.pageRankListSortKey === id) {
    state.pageRankListSortDir = state.pageRankListSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.pageRankListSortKey = id;
    state.pageRankListSortDir = id === 'rank' ? 'asc' : 'desc';
  }
  render();
};

function sortRankedLandingPages(pages) {
  const key = state.pageRankListSortKey;
  const list = pages.slice();
  if (!key || !PAGE_RANK_LIST_SORTABLE.has(key)) {
    return list.sort((a, b) => (b.rankedKwCount || 0) - (a.rankedKwCount || 0));
  }
  const dir = state.pageRankListSortDir === 'desc' ? -1 : 1;
  return list.sort((a, b) => {
    if (key === 'rankedKwCount') return ((a.rankedKwCount || 0) - (b.rankedKwCount || 0)) * dir;
    if (key === 'rank') {
      const ar = a.rank != null ? Number(a.rank) : 99999;
      const br = b.rank != null ? Number(b.rank) : 99999;
      return (ar - br) * dir;
    }
    return String(a[key] || '').localeCompare(String(b[key] || ''), 'zh-CN') * dir;
  });
}

function rankedLandingPageThHTML(id) {
  const lab = PAGE_RANK_LIST_COL_LABELS[id];
  const hint = PAGE_RANK_LIST_COL_HINTS[id];
  let attrs = '';
  if (id === 'rankedKwCount') attrs = 'style="width:108px;text-align:right;"';
  else if (id === 'rank') attrs = 'style="width:88px;"';
  else if (id === 'firstSeen' || id === 'lastSeen') attrs = 'style="width:104px;"';
  const a = attrs ? ` ${attrs}` : '';
  if (PAGE_RANK_LIST_SORTABLE.has(id)) {
    const btn = tableSortThBtnHTML(lab, hint, id, state.pageRankListSortKey, state.pageRankListSortDir, 'sortPageRankListCol');
    const align = id === 'rankedKwCount' ? ' th-sort-th--right' : '';
    return `<th${a} class="th-sort-th${align}">${btn}</th>`;
  }
  return `<th${a}>${onPageThHintLabelHTML(lab, hint)}</th>`;
}

function rankedLandingPagesTableAndStatsHTML(opts) {
  const isSearchPage = !!(opts && opts.searchPage);
  const maxTableRows = opts && opts.maxTableRows != null ? opts.maxTableRows : null;
  const showToolbar = opts && opts.showToolbar != null ? !!opts.showToolbar : isSearchPage;
  let pages = isSearchPage ? getRankedLandingPagesForView() : (DB.rankedLandingPages || []);
  pages = sortRankedLandingPages(pages);
  const trend = rankedLandingPagesTrendFromCrawlTasks();
  const trendUid = isSearchPage ? 'prl' : 'dash';
  const trendPages = rankedPagesTrendSparklineHTML(trend.seriesCount, '#3b82f6', trendUid + 'pc', '有排名页面数', trend.dates);
  const trendAvg = rankedPagesTrendSparklineHTML(trend.seriesAvg, '#8b5cf6', trendUid + 'pa', '平均最佳排名', trend.dates);
  const hintRankedPages = '卡片为当前筛选下最后一次抓取任务的有排名页面数；折线最多展示最近 15 次任务。';
  const hintAvgBest = '卡片为最后一次抓取任务的平均最佳排名；折线最多展示最近 15 次任务。';
  ensurePageRankListTableState();
  const colIds = [
    'page',
    ...state.pageRankListColOrder.filter(id => id !== 'page' && !state.pageRankListColHidden[id]),
  ];
  const tablePages = maxTableRows != null ? pages.slice(0, maxTableRows) : pages;
  const theadRow = `<tr>${colIds.map(id => rankedLandingPageThHTML(id)).join('')}</tr>`;
  const bodyFixed = tablePages.map(r => {
    const searchBlob = `${r.title || ''} ${r.path || ''} ${r.bestKw || ''}`.replace(/\s+/g, ' ').trim();
    return `<tr class="page-rank-list-row" data-path="${escapeAttr(String(r.path || ''))}" data-search="${escapeAttr(searchBlob)}">${colIds.map(id => rankedLandingPageCellHTML(id, r)).join('')}</tr>`;
  }).join('');
  const showMetrics = state.pageRankListShowMetrics !== false;
  const metricsToggleLbl = showMetrics ? '隐藏数据概览' : '展示数据概览';
  const toolbar = showToolbar
    ? `<div class="onpage-seo-toolbar panel onpage-seo-toolbar--panel page-rank-list-toolbar" style="margin-bottom:12px;padding:12px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
    <div class="onpage-seo-search-wrap" style="display:flex;align-items:stretch;gap:10px;min-width:200px;flex:1;max-width:480px;">
      ${onPageSeoSearchInnerHTML({
        inputId: 'pageRankListFilter',
        placeholder: '搜索路径、标题、关键词…',
        hint: PAGE_RANK_LIST_SEARCH_HINT,
        value: state.pageRankListFilter || '',
        oninput: 'filterPageRankListRows()',
      })}
    </div>
    <div class="toolbar-spacer" style="flex:1;min-width:8px;"></div>
    <button type="button" class="btn-icon page-rank-metrics-toggle" title="${escapeAttr(metricsToggleLbl)}" aria-label="${escapeAttr(metricsToggleLbl)}" aria-pressed="${showMetrics ? 'true' : 'false'}" onclick="togglePageRankListMetrics()">${showMetrics ? ONPAGE_SVG_EYE : ONPAGE_SVG_EYE_OFF}</button>
    <div class="toolbar-field-wrap" onclick="event.stopPropagation()">
      <button type="button" class="btn-icon" title="显示字段与顺序" onclick="togglePageRankListFieldPanel(event)">⋮</button>
      ${state.pageRankListFieldOpen ? pageRankListFieldConfigPanelHTML() : ''}
    </div>
    <button type="button" class="btn-icon" title="导出" onclick="pageRankListExportDemo()">↓</button>
  </div>`
    : '';
  const metricsBlock = showMetrics
    ? `<div class="site-overview-metrics dashboard-page-rank-metrics">
      <div class="som-panel">
        <div class="som-label" title="${escapeAttr(hintRankedPages)}">有排名页面</div>
        <div class="som-value-row">
          <span class="som-value">${trend.cardCount}</span>
        </div>
        ${trendPages}
      </div>
      <div class="som-panel">
        <div class="som-label" title="${escapeAttr(hintAvgBest)}">平均最佳排名</div>
        <div class="som-value-row">
          <span class="som-value">${trend.cardAvg}</span>
        </div>
        ${trendAvg}
      </div>
    </div>`
    : '';
  return `
    ${metricsBlock}
    ${toolbar}
    <div class="table-wrap">
      <table class="data-table page-rank-list-table">
        <thead>
          ${theadRow}
        </thead>
        <tbody>${bodyFixed}</tbody>
      </table>
    </div>`;
}

function ensureOnPageSeoTableState() {
  if (!state.onPageSeoColOrder || state.onPageSeoColOrder.length !== ONPAGE_SEO_COL_IDS.length) {
    state.onPageSeoColOrder = [...ONPAGE_SEO_COL_IDS];
  }
  let ord = state.onPageSeoColOrder;
  if (!ord.includes('page')) {
    ord = ['page', ...ord.filter(x => x !== 'page')];
    state.onPageSeoColOrder = ord;
  }
  const pi = state.onPageSeoColOrder.indexOf('page');
  if (pi > 0) {
    state.onPageSeoColOrder.splice(pi, 1);
    state.onPageSeoColOrder.unshift('page');
  }
  if (!state.onPageSeoColHidden || typeof state.onPageSeoColHidden !== 'object') state.onPageSeoColHidden = {};
  ONPAGE_SEO_COL_IDS.forEach(id => {
    if (state.onPageSeoColHidden[id] == null) state.onPageSeoColHidden[id] = false;
  });
  state.onPageSeoColHidden.page = false;
  if (state.onPageSeoHidePageTitle == null) state.onPageSeoHidePageTitle = false;
}

window.toggleOnPageSeoFieldPanel = function (ev) {
  ev.stopPropagation();
  closeDateDropdown();
  closeDropdown();
  state.onPageSeoFieldOpen = !state.onPageSeoFieldOpen;
  render();
};

window.saveOnPageSeoFieldConfig = function () {
  state.onPageSeoFieldOpen = false;
  toast('字段配置已保存');
  render();
};

window.toggleOnPageSeoColVisible = function (id) {
  ensureOnPageSeoTableState();
  state.onPageSeoColHidden[id] = !state.onPageSeoColHidden[id];
  render();
};

window.moveOnPageSeoCol = function (id, delta) {
  ensureOnPageSeoTableState();
  if (id === 'page') return;
  const ord = state.onPageSeoColOrder;
  const i = ord.indexOf(id);
  if (i < 0) return;
  const j = i + delta;
  if (j < 1 || j >= ord.length) return;
  const t = ord[i];
  ord[i] = ord[j];
  ord[j] = t;
  render();
};

function onPageSeoFieldConfigPanelHTML() {
  ensureOnPageSeoTableState();
  const movable = state.onPageSeoColOrder.filter(x => x !== 'page');
  const pageRow = `
        <div class="kw-field-config-row kw-field-config-row--fixed">
          <label class="kw-field-label">
            <input type="checkbox" ${state.onPageSeoHidePageTitle ? '' : 'checked'} onchange="toggleOnPageSeoHidePageTitle()"/>
            <span>页面标题</span>
          </label>
          <span class="kw-field-move kw-field-move--na" title="固定在第一列">—</span>
        </div>`;
  return `
    <div class="kw-field-config-dropdown" onclick="event.stopPropagation()">
      <div class="kw-field-config-title">显示字段与顺序</div>
      ${pageRow}
      ${movable.map(id => `
        <div class="kw-field-config-row">
          <label class="kw-field-label">
            <input type="checkbox" ${state.onPageSeoColHidden[id] ? '' : 'checked'} onchange="toggleOnPageSeoColVisible('${id}')"/>
            <span>${ONPAGE_SEO_COL_LABELS[id]}</span>
          </label>
          <span class="kw-field-move">
            <button type="button" class="kw-field-arrow" title="上移" onclick="moveOnPageSeoCol('${id}',-1)">↑</button>
            <button type="button" class="kw-field-arrow" title="下移" onclick="moveOnPageSeoCol('${id}',1)">↓</button>
          </span>
        </div>`).join('')}
      <button type="button" class="btn-primary kw-field-save-btn" onclick="saveOnPageSeoFieldConfig()">保存</button>
    </div>`;
}

window.onPageSeoExportDemo = function () {
  toast('已导出 On-Page 列表（示例）');
};

function onPageSeoPageMenuHTML() {
  return '';
}

window.toggleOnPageSeoHidePageTitle = function () {
  state.onPageSeoHidePageTitle = !state.onPageSeoHidePageTitle;
  render();
};

window.toggleOnPageSeoFilterPageType = function (ptId) {
  if (ptId == null || ptId === '') return;
  state.onPageSeoFilterPageTypes = Array.isArray(state.onPageSeoFilterPageTypes) ? state.onPageSeoFilterPageTypes : [];
  const i = state.onPageSeoFilterPageTypes.indexOf(ptId);
  if (i >= 0) state.onPageSeoFilterPageTypes.splice(i, 1);
  else state.onPageSeoFilterPageTypes.push(ptId);
  state.onPageSeoTagDdOpen = true;
  state.onPageSeoListPage = 1;
  render();
};

window.setOnPageSeoTagDdQuery = function (v) {
  state.onPageSeoTagDdQuery = v;
  state.onPageSeoTagDdOpen = true;
  render();
};

window.stopOnPageSeoFilterClick = function (e) {
  e.stopPropagation();
};

window.toggleOnPageSeoTagDd = function (e) {
  if (e) e.stopPropagation();
  state.onPageSeoTagDdOpen = !state.onPageSeoTagDdOpen;
  if (state.onPageSeoTagDdOpen) state.onPageSeoStatusDdOpen = false;
  render();
};

window.toggleOnPageSeoStatusDd = function (e) {
  if (e) e.stopPropagation();
  state.onPageSeoStatusDdOpen = !state.onPageSeoStatusDdOpen;
  if (state.onPageSeoStatusDdOpen) state.onPageSeoTagDdOpen = false;
  render();
};

window.toggleOnPageSeoStatusCode = function (code) {
  state.onPageSeoStatusFilter = Array.isArray(state.onPageSeoStatusFilter) ? state.onPageSeoStatusFilter : [];
  const s = String(code);
  const ix = state.onPageSeoStatusFilter.indexOf(s);
  if (ix >= 0) state.onPageSeoStatusFilter.splice(ix, 1);
  else state.onPageSeoStatusFilter.push(s);
  state.onPageSeoStatusDdOpen = true;
  state.onPageSeoListPage = 1;
  render();
};

window.onPageSubmitIndexingRow = function (i, e) {
  if (e) e.stopPropagation();
  if (!siteHasGscConnected()) {
    toast('请先完成 Google Search Console 授权', 'error');
    return;
  }
  const row = DB.onPageSeoPages[i];
  if (!row) return;
  toast('已向搜索引擎提交收录申请（示例）：' + (row.path || ''));
};

window.onPageBulkSubmitIndexing = function () {
  if (!siteHasGscConnected()) {
    toast('请先完成 Google Search Console 授权', 'error');
    return;
  }
  const sel = state.onPageSeoBulkSelected || {};
  const ids = Object.keys(sel).map(Number).filter(j => sel[j]);
  if (!ids.length) {
    toast('请先勾选页面', 'error');
    return;
  }
  toast(`已向搜索引擎批量提交 ${ids.length} 个页面地址的收录申请（示例）`);
};

window.toggleOnPageSeoBulkRow = function (i, on, e) {
  if (e) e.stopPropagation();
  if (!state.onPageSeoBulkSelected) state.onPageSeoBulkSelected = {};
  if (on) state.onPageSeoBulkSelected[i] = 1;
  else delete state.onPageSeoBulkSelected[i];
  render();
};

window.toggleOnPageSeoBulkAll = function (on) {
  state.onPageSeoBulkSelected = {};
  if (on) {
    onPageSeoListFilteredEntries().forEach(({ i }) => { state.onPageSeoBulkSelected[i] = 1; });
  }
  render();
};

window.onPageBulkRunPageAudit = function () {
  const sel = state.onPageSeoBulkSelected || {};
  const ids = Object.keys(sel).map(Number).filter(j => sel[j]);
  if (!ids.length) {
    toast('请先勾选要检测的页面', 'error');
    return;
  }
  ids.forEach((i, n) => {
    window.setTimeout(() => {
      if (typeof onPageSeoRerunAudit === 'function') onPageSeoRerunAudit(i);
    }, n * 750);
  });
  toast(`已对 ${ids.length} 个页面开始常规检测（示例），请稍候刷新列表`);
};

function onPageSeoBulkSelectedCount() {
  return Object.keys(state.onPageSeoBulkSelected || {}).filter(k => state.onPageSeoBulkSelected[k]).length;
}

function onPageSeoBulkCheckboxThHTML() {
  const entries = onPageSeoListFilteredEntries();
  const allOn = entries.length > 0 && entries.every(({ i }) => state.onPageSeoBulkSelected && state.onPageSeoBulkSelected[i]);
  return `<th class="onpage-seo-th-check" style="width:40px;"><input type="checkbox" title="全选当前筛选结果" ${allOn ? ' checked' : ''} onclick="event.stopPropagation();toggleOnPageSeoBulkAll(this.checked)"/></th>`;
}

function onPageSeoBulkCheckboxTdHTML(i) {
  const on = state.onPageSeoBulkSelected && state.onPageSeoBulkSelected[i];
  return `<td class="onpage-seo-td-check" onclick="event.stopPropagation();"><input type="checkbox"${on ? ' checked' : ''} onclick="event.stopPropagation();toggleOnPageSeoBulkRow(${i}, this.checked, event)"/></td>`;
}

function resolveRankedKwSamplesKey(path) {
  const p = String(path || '').trim();
  const map = DB.onPageRankedKwSamples || {};
  if (map[p]) return p;
  const keys = Object.keys(map);
  const n = p.replace(/\/$/, '') || '/';
  const hit = keys.find(k => k === n || k.replace(/\/$/, '') === n);
  return hit || p;
}

window.openRankedPageKwModal = function (path) {
  const p = String(path || '').trim();
  if (!p) return;
  state.rankedKwModalSortKey = 'kw';
  state.rankedKwModalSortDir = 'asc';
  state.rankedKwModalPath = resolveRankedKwSamplesKey(p);
  openModal('ranked-page-kws');
};

window.openRankedPageKwModalFromLink = function (el) {
  if (!el || !el.getAttribute) return;
  const path = el.getAttribute('data-path') || el.getAttribute('data-rkp') || '';
  if (!path) return;
  openRankedPageKwModal(path);
};

/** 有排名关键词数 · 可点击打开明细弹窗 */
function rankedKwCountLinkHTML(path, count) {
  const p = escapeAttr(String(path || ''));
  const n = count != null ? String(count) : '0';
  return `<button type="button" class="ranked-kw-count-link" data-path="${p}" onclick="event.stopPropagation();event.preventDefault();window.openRankedPageKwModal(this.getAttribute('data-path'))">${escapeHtmlStr(n)}</button>`;
}

function installRankedKwCountLinkDelegate() {
  if (window._rankedKwCountDelegateInstalled) return;
  window._rankedKwCountDelegateInstalled = true;
  document.addEventListener('click', ev => {
    const btn = ev.target && ev.target.closest ? ev.target.closest('.ranked-kw-count-link') : null;
    if (!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    const path = btn.getAttribute('data-path') || btn.getAttribute('data-rkp') || '';
    if (path) window.openRankedPageKwModal(path);
  }, true);
}

const RANKED_KW_MODAL_SORTABLE = new Set(['kw', 'rank', 'time']);

window.sortRankedKwModalCol = function (id) {
  if (!RANKED_KW_MODAL_SORTABLE.has(id)) return;
  if (state.rankedKwModalSortKey === id) {
    state.rankedKwModalSortDir = state.rankedKwModalSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.rankedKwModalSortKey = id;
    state.rankedKwModalSortDir = id === 'rank' ? 'asc' : id === 'time' ? 'desc' : 'asc';
  }
  renderModal();
};

function sortRankedKwModalRows(rows) {
  const key = state.rankedKwModalSortKey || 'kw';
  const dir = state.rankedKwModalSortDir === 'desc' ? -1 : 1;
  return rows.slice().sort((a, b) => {
    if (key === 'kw') {
      return String(a.kw || '').localeCompare(String(b.kw || ''), 'zh-CN') * dir;
    }
    if (key === 'rank') {
      const ra = a.rank != null ? Number(a.rank) : 1e9;
      const rb = b.rank != null ? Number(b.rank) : 1e9;
      return (ra - rb) * dir;
    }
    if (key === 'time') {
      const ta = Date.parse(String(a.rankAt || '').replace(' ', 'T')) || 0;
      const tb = Date.parse(String(b.rankAt || '').replace(' ', 'T')) || 0;
      return (ta - tb) * dir;
    }
    return 0;
  });
}

function getRankedKwRowsForModal(path) {
  const key = resolveRankedKwSamplesKey(path);
  const raw = (DB.onPageRankedKwSamples && DB.onPageRankedKwSamples[key]) || [];
  const merged = getRankedKwRowsWithRankOnLastCrawl(raw);
  if (merged.length) return merged;
  const pg = enrichRankedLandingPageRow((DB.rankedLandingPages || []).find(p => {
    const pk = resolveRankedKwSamplesKey(p.path);
    return pk === key || String(p.path || '') === String(path || '');
  }));
  if (!pg) return [];
  const rows = [];
  if (pg.bestKw) {
    rows.push({
      kw: pg.bestKw,
      rank: pg.rank != null ? pg.rank : null,
      rankAt: pg.lastSeen ? `${pg.lastSeen} 12:00:00` : '—',
      engine: pg.engine || '—',
    });
  }
  const want = pg.rankedKwCount != null ? Math.max(0, Number(pg.rankedKwCount) || 0) : rows.length;
  while (rows.length < want && rows.length < 20) {
    const base = pg.bestKw || '监控词';
    rows.push({
      kw: rows.length === 0 ? base : `${base} · 变体 ${rows.length}`,
      rank: pg.rank != null ? pg.rank + rows.length : null,
      rankAt: pg.lastSeen ? `${pg.lastSeen} 10:00:00` : '—',
      engine: pg.engine || '—',
    });
  }
  return rows;
}

window.openDashboardTaskOnPageDrawerFromBtn = function (btn) {
  const p = btn && btn.getAttribute ? (btn.getAttribute('data-task-path') || '') : '';
  openDashboardTaskOnPageDrawer(p);
};

function normalizeTaskPagePath(p) {
  const s = String(p || '').trim();
  if (!s || s === '—') return '';
  return s.startsWith('/') ? s : `/${s}`;
}

function findOnPageRowIndexByPath(rawPath) {
  const needle = normalizeTaskPagePath(rawPath);
  if (!needle) return -1;
  const list = DB.onPageSeoPages || [];
  let ix = list.findIndex(r => String(r.path || '') === needle);
  if (ix < 0) {
    const n2 = needle.replace(/\/$/, '') || '/';
    ix = list.findIndex(r => String(r.path || '').replace(/\/$/, '') === n2);
  }
  return ix;
}

function dashboardStripDiag(s) {
  if (typeof window !== 'undefined' && typeof window.stripDiagPrefix === 'function') return window.stripDiagPrefix(s);
  return String(s || '').replace(/^(当前|建议|结论)[：:]\s*/u, '').trim();
}

/** 从页面检测模型解析待办的问题描述与优化建议（对齐 SEO评分维度.md 子项文案） */
function dashboardTaskCheckCopy(task) {
  if (task.problem || task.suggestion) {
    return {
      desc: dashboardStripDiag(task.problem || task.checkLabel || '—'),
      sug: dashboardStripDiag(task.suggestion || '—'),
    };
  }
  const fmtP = typeof formatDocProblem === 'function' ? formatDocProblem : dashboardStripDiag;
  const fmtS = typeof formatDocSuggestion === 'function' ? formatDocSuggestion : dashboardStripDiag;
  const rowIx = findOnPageRowIndexByPath(task.page);
  const row = rowIx >= 0 ? DB.onPageSeoPages[rowIx] : null;
  const label = task.checkLabel || task.checkKey || '';
  const sev = dashboardTaskSevKey(task);
  if (row && label && typeof resolveCheckDocCopy === 'function') {
    const doc = resolveCheckDocCopy(label, sev, row);
    if (doc) return { desc: fmtP(doc.problem), sug: fmtS(doc.suggestion) };
  }
  if (row && label && typeof onPageWincherCollectModel === 'function') {
    const model = onPageWincherCollectModel(row);
    const g = model.groups.find(x => x.id === task.dimId);
    if (g) {
      const c = g.checks.find(x => x.title === label && x.sev === sev)
        || g.checks.find(x => x.title === label && x.sev !== 'pass')
        || g.checks.find(x => x.title === label);
      if (c) return { desc: fmtP(c.problem || c.result), sug: fmtS(c.suggestion || c.sug) };
    }
  }
  const strip = dashboardStripDiag;
  return { desc: strip(task.title || label || '—'), sug: strip(task.sug || '—') };
}

function dashboardTasksSortRows(rows) {
  const key = state.dashboardTasksSortKey || 'sev';
  const dir = state.dashboardTasksSortDir === 'desc' ? -1 : 1;
  const sevOrd = { issue: 0, advice: 1, pass: 2 };
  const sorted = [...rows];
  sorted.sort((a, b) => {
    if (key === 'sev') {
      return (sevOrd[dashboardTaskSevKey(a)] - sevOrd[dashboardTaskSevKey(b)]) * dir;
    }
    if (key === 'module') {
      return String(a.module || '').localeCompare(String(b.module || ''), 'zh-CN') * dir;
    }
    return 0;
  });
  return sorted;
}

window.toggleDashboardTaskDone = function (id, checked) {
  if (!state.dashboardTasksCompleted) state.dashboardTasksCompleted = {};
  if (checked) state.dashboardTasksCompleted[id] = true;
  else delete state.dashboardTasksCompleted[id];
  render();
};

window.toggleDashboardTasksShowCompleted = function () {
  state.dashboardTasksShowCompleted = !state.dashboardTasksShowCompleted;
  render();
};

window.toggleDashboardTasksSort = function (key) {
  if (state.dashboardTasksSortKey === key) {
    state.dashboardTasksSortDir = state.dashboardTasksSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.dashboardTasksSortKey = key;
    state.dashboardTasksSortDir = key === 'sev' ? 'asc' : 'asc';
  }
  render();
};

window.openDashboardTaskOnPageDrawer = function (rawPath) {
  const ix = findOnPageRowIndexByPath(rawPath);
  if (ix < 0) {
    toast('该页面未纳入「页面整合优化」列表（示例）', 'error');
    return;
  }
  openOnPageSeoDrawer(ix);
};

/** 单页重检后：恢复该页路径下已忽略的待办 */
function clearDashboardDismissedForPage(pagePath) {
  if (!state.dashboardDismissedTaskIds) state.dashboardDismissedTaskIds = {};
  const needle = normalizeTaskPagePath(pagePath);
  if (!needle) return;
  const n2 = needle.replace(/\/$/, '') || '/';
  (DB.dashboardTasks || []).forEach(t => {
    const p = normalizeTaskPagePath(t.page);
    const p2 = p.replace(/\/$/, '') || '/';
    if (p === needle || p2 === n2) delete state.dashboardDismissedTaskIds[t.id];
  });
}

window.dismissDashboardTask = function (taskId) {
  if (taskId == null) return;
  if (!state.dashboardDismissedTaskIds) state.dashboardDismissedTaskIds = {};
  state.dashboardDismissedTaskIds[taskId] = 1;
  render();
  toast('已忽略该条待办；下次整站检测或该页面重新检测后将再次显示（示例）');
};

function runDashboardInfraScanDemo(onDone) {
  if (state.dashboardInfraScanStatus === 'scanning') return;
  state.dashboardInfraScanStatus = 'scanning';
  render();
  window.setTimeout(() => {
    const s = DB.dashboardSeoSummary;
    if (s) s.lastScanAt = formatDateYMD(DEMO_TODAY);
    state.dashboardDismissedTaskIds = {};
    (DB.dashboardTasks || []).filter(t => (t.scope || 'page') === 'site').forEach(t => {
      if (state.dashboardDismissedTaskIds) delete state.dashboardDismissedTaskIds[t.id];
    });
    state.dashboardInfraScanStatus = 'idle';
    state.dashboardInfraScanCount = (state.dashboardInfraScanCount || 0) + 1;
    if (typeof onDone === 'function') onDone();
    else {
      render();
      toast('网站技术基础检测已完成（示例），检测项已更新');
    }
  }, 2200);
}

window.dashboardRescanDemoExecute = function () {
  runDashboardInfraScanDemo();
};

window.openDashboardSeoRescanConfirm = function () {
  if (state.dashboardInfraScanStatus === 'scanning') {
    toast('站点基建检测进行中，请稍候', 'error');
    return;
  }
  openModal('dashboard-seo-rescan-confirm');
};

function modalDashboardSeoRescanConfirm() {
  return `
  <div class="modal-header">
    <span class="modal-title">确认重新检测</span>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    <p style="font-size:14px;color:var(--text-2);line-height:1.55;margin:0;">将仅对<strong>网站技术基础</strong>（Robots.txt、Sitemap、首页 HTTPS 安全）重新检测，不扫描单页内容（示例）。确定继续？</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn-default" data-close>取消</button>
    <button type="button" class="btn-primary" onclick="closeModal();dashboardRescanDemoExecute();">开始检测</button>
  </div>`;
}

window.onPageDrawerRescanCurrent = function () {
  const i = state.onPageSeoDrawerIndex;
  if (i == null) return;
  window.onPageSeoRerunAudit(i);
};

function seedOnPageTargetKwFromMetaOnFirstAudit(row) {
  if (!row || row._onPageKwSeededFromMeta) return;
  row._onPageKwSeededFromMeta = true;
  if (parseMultiKw(row.keyword).length) return;
  const raw = row.metaKeywords;
  if (!raw || raw === '—') return;
  const parts = String(raw).split(/[,，;；]/).map(s => s.trim()).filter(Boolean).slice(0, ONPAGE_KW_MAX);
  if (parts.length) row.keyword = parts.join('\n');
}

window.onPageSeoRerunAudit = function (i) {
  const r = DB.onPageSeoPages[i];
  if (!r) return;
  if (!state.onPageSeoAuditRefreshing) state.onPageSeoAuditRefreshing = {};
  if (state.onPageSeoAuditRefreshing[i]) return;
  state.onPageSeoAuditRefreshing[i] = 1;
  render();
  if (state.onPageSeoDrawerIndex === i) renderDrawer();
  window.setTimeout(() => {
    const row = DB.onPageSeoPages[i];
    if (!row) {
      delete state.onPageSeoAuditRefreshing[i];
      render();
      return;
    }
    seedOnPageTargetKwFromMetaOnFirstAudit(row);
    const base = row.score != null ? Number(row.score) : 70;
    row.score = Math.min(100, Math.max(40, base + Math.round((Math.random() - 0.35) * 10)));
    row.onPageScoreAt = formatDateYMD(DEMO_TODAY);
    row.onPageAuditedAt = `${formatDateYMD(DEMO_TODAY)} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:${String(new Date().getSeconds()).padStart(2, '0')}`;
    if (row.issueBreakdown) {
      const b = row.issueBreakdown;
      const jitter = () => Math.max(0, Math.round((Math.random() - 0.45) * 2));
      row.issueBreakdown = {
        critical: Math.max(0, (b.critical != null ? b.critical : 0) + jitter()),
        warning: Math.max(0, (b.warning != null ? b.warning : 0) + jitter()),
        suggestion: Math.max(0, (b.suggestion != null ? b.suggestion : 0) + jitter()),
      };
    }
    delete state.onPageSeoAuditRefreshing[i];
    clearDashboardDismissedForPage(row.path);
    toast('已重新测评当前页面（示例）');
    render();
    if (state.onPageSeoDrawerIndex === i) renderDrawer();
  }, 700);
};

window.onPageSeoOpenTagsModal = function (i) {
  state.onPageSeoTagsModalIdx = i;
  openModal('onpage-page-type');
};

function onPagePageTypeTagHTML(row) {
  const lab = onPagePageTypeLabel(row.pageType);
  const ix = (DB.onPageSeoPages || []).indexOf(row);
  if (!lab) return '';
  const click = ix >= 0 ? ` onclick="state.onPageSeoTagsModalIdx=${ix};openModal('onpage-page-type');" role="button" tabindex="0" title="点击修改页面类型"` : '';
  return `<span class="tag tag-gray onpage-drawer-pagetype onpage-drawer-pagetype--edit"${click}>${escapeHtmlStr(lab)}</span>`;
}

function onPageSeoListScoreHTML(r) {
  const sc = r.score != null ? Number(r.score) : 0;
  const badge = sc >= 80 ? 'badge-green' : sc >= 70 ? 'badge-blue' : 'badge-gray';
  return `<span class="onpage-list-score-wrap">
    <span class="badge ${badge} onpage-list-score-badge"><strong>${sc}</strong></span>
  </span>`;
}

function isOnPageHomePath(row) {
  const p = String(row && row.path || '').trim();
  return p === '/' || p === '';
}

/** 首页路径强制为系统类型 homepage，非首页则清除误设的 homepage */
function syncOnPagePageTypeFromPath(row) {
  if (!row) return;
  if (isOnPageHomePath(row)) row.pageType = 'homepage';
  else if (row.pageType === 'homepage') row.pageType = '';
}

function onPagePageTypeLabel(id) {
  const t = ONPAGE_PAGE_TYPES.find(x => x.id === id);
  return t ? t.label : '';
}

function onPageDrawerModuleTitleHTML(title, hintText) {
  const hint = hintText && String(hintText).trim() ? onPageFieldHintBtnHTML(hintText) : '';
  return `<div class="onpage-module-title-wrap">
    <h3 class="onpage-aitdk-section-title">${escapeHtmlStr(title)}</h3>${hint}
  </div>`;
}

function onPageAiEmptyTabLeadHTML() {
  return `<div class="onpage-ai-empty-intro">
    <p class="onpage-ai-empty-intro-note">${escapeHtmlStr(ONPAGE_AI_DRAWER_HINT)}</p>
  </div>`;
}

function onPageSeoPageTypeCellHTML(r, i) {
  const pt = r.pageType || '';
  const lab = onPagePageTypeLabel(pt);
  if (!lab) {
    return `<button type="button" class="onpage-pagetype-unset" onclick="event.stopPropagation();state.onPageSeoTagsModalIdx=${i};openModal('onpage-page-type');">未设置</button>`;
  }
  return `<button type="button" class="tag tag-gray onpage-pagetype-tag" onclick="event.stopPropagation();state.onPageSeoTagsModalIdx=${i};openModal('onpage-page-type');" title="点击修改页面类型">${escapeHtmlStr(lab)}</button>`;
}

function onPageSeoTagsCellHTML(r, i) {
  return onPageSeoPageTypeCellHTML(r, i != null ? i : 0);
}

function onPageSeoKeywordCellHTML(r, i) {
  const all = parseMultiKw(r.keyword).slice(0, ONPAGE_KW_MAX);
  const show = all.slice(0, ONPAGE_KW_LIST_DISPLAY_MAX);
  const extra = all.length - show.length;
  const openKw = `event.stopPropagation();state.onPageSeoDrawerIndex=${i};openModal('onpage-drawer-kw');`;
  let inner;
  if (!all.length) {
    inner = `<button type="button" class="onpage-kw-empty-btn" onclick="${openKw}" title="点击设置目标词">—</button>`;
  } else {
    const chips = show.map(k => `<button type="button" class="onpage-kw-chip onpage-kw-chip--btn" onclick="${openKw}" title="点击编辑目标词">${escapeHtmlStr(k)}</button>`).join('');
    const more = extra > 0
      ? `<button type="button" class="onpage-kw-chip onpage-kw-chip--more" onclick="${openKw}" title="还有 ${extra} 个目标词，点击编辑">+${extra}</button>`
      : '';
    inner = `<div class="onpage-kw-chips onpage-kw-chips--clickable">${chips}${more}</div>`;
  }
  return `<div class="onpage-kw-table-cell"><div class="onpage-kw-table-inner">${inner}</div></div>`;
}

function onPageSeoPageTitleCellHTML(r, i) {
  if (state.onPageSeoHidePageTitle) {
    return `<div class="onpage-page-cell onpage-page-cell--path-only">
    <div class="onpage-page-cell-text">
      <div class="onpage-page-title-row onpage-page-title-row--path-only">
        <div class="onpage-page-path">${httpsLockPrefixHTML()}<code>${escapeHtmlStr(r.path)}</code></div>
      </div>
    </div>
  </div>`;
  }
  return `<div class="onpage-page-cell">
    <div class="onpage-page-cell-text">
      <div class="onpage-page-title-row">
        <div class="onpage-page-title">${escapeHtmlStr(r.title)}</div>
      </div>
      <div class="onpage-page-path">${httpsLockPrefixHTML()}<code>${escapeHtmlStr(r.path)}</code></div>
    </div>
  </div>`;
}

const ONPAGE_SEO_SORTABLE = new Set(['status', 'index', 'score', 'issues']);

window.sortOnPageSeoCol = function (id) {
  if (!ONPAGE_SEO_SORTABLE.has(id)) return;
  if (state.onPageSeoSortKey === id) {
    state.onPageSeoSortDir = state.onPageSeoSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.onPageSeoSortKey = id;
    state.onPageSeoSortDir = id === 'score' ? 'desc' : 'asc';
  }
  state.onPageSeoListPage = 1;
  render();
};

window.setOnPageSeoListPageSize = setOnPageSeoListPageSize;
window.setOnPageSeoListPage = setOnPageSeoListPage;

function onPageSeoSortValue(row, id) {
  if (id === 'status') return Number(row.httpStatus) || 200;
  if (id === 'index') {
    const e = row.indexEngines || {};
    return Object.keys(e).filter(k => e[k]).length;
  }
  if (id === 'score') return row.score != null ? Number(row.score) : -1;
  if (id === 'issues') {
    const b = row.issueBreakdown || {};
    return (b.critical || 0) * 100 + (b.warning || 0) * 10 + (b.suggestion || 0);
  }
  return 0;
}

function onPageSeoRowMatchesFilters(row, raw, dom, ptF, stF) {
  const http = row.httpStatus != null ? String(Number(row.httpStatus)) : '200';
  if (stF && stF.length && !stF.includes(http)) return false;
  const rowPt = row.pageType || '';
  if (ptF && ptF.length && !ptF.includes(rowPt)) return false;
  if (!raw) return true;
  const qLower = raw.toLowerCase();
  if (raw.includes('*')) {
    const path = String(row.path || '').toLowerCase();
    const fullUrl = (`https://${dom}${row.path}`).toLowerCase();
    const pat = qLower.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    let ok = false;
    try {
      const re = new RegExp(pat, 'i');
      ok = re.test(path) || re.test(fullUrl);
    } catch (e) {
      ok = path.includes(raw.replace(/\*/g, ''));
    }
    if (!ok) {
      const plain = qLower.replace(/\*/g, '').trim();
      if (plain) {
        const kws = parseMultiKw(row.keyword).join(' ');
        const blob = `${(row.title || '')} ${kws} ${path}`.toLowerCase();
        ok = blob.includes(plain);
      }
    }
    return ok;
  }
  const kws = parseMultiKw(row.keyword).join(' ');
  const blob = `${(row.title || '')} ${kws} ${(row.path || '')}`.toLowerCase();
  return blob.includes(qLower);
}

function onPageSeoListFilteredEntries() {
  const dom = site().domain;
  const raw = (state.onPageSeoFilterQuery || '').trim();
  const ptF = state.onPageSeoFilterPageTypes && state.onPageSeoFilterPageTypes.length ? state.onPageSeoFilterPageTypes : null;
  const stF = state.onPageSeoStatusFilter && state.onPageSeoStatusFilter.length ? state.onPageSeoStatusFilter : null;
  const out = [];
  (onPageSeoPagesForCurrentSite() || []).forEach((r) => {
    const i = (DB.onPageSeoPages || []).indexOf(r);
    if (i < 0) return;
    if (!onPageSeoRowMatchesFilters(r, raw, dom, ptF, stF)) return;
    out.push({ r, i });
  });
  return sortOnPageSeoPageRows(out);
}

function sortOnPageSeoPageRows(entries) {
  const key = state.onPageSeoSortKey;
  if (!key || !ONPAGE_SEO_SORTABLE.has(key)) {
    return entries.slice().sort((a, b) => a.i - b.i);
  }
  const dir = state.onPageSeoSortDir === 'desc' ? -1 : 1;
  return entries.slice().sort((a, b) => (onPageSeoSortValue(a.r, key) - onPageSeoSortValue(b.r, key)) * dir);
}

function onPageSeoListPagedSlice() {
  const all = onPageSeoListFilteredEntries();
  const size = Math.min(100, Math.max(10, state.onPageSeoListPageSize || 20));
  const totalPages = Math.max(1, Math.ceil(all.length / size));
  const page = Math.min(Math.max(1, state.onPageSeoListPage || 1), totalPages);
  const start = (page - 1) * size;
  return { rows: all.slice(start, start + size), total: all.length, page, totalPages, pageSize: size };
}

function setOnPageSeoListPageSize(n) {
  state.onPageSeoListPageSize = n;
  state.onPageSeoListPage = 1;
  render();
}

function setOnPageSeoListPage(n) {
  state.onPageSeoListPage = n;
  render();
}

function onPageSeoThAttrs(id) {
  if (id === 'page') return { style: 'min-width:200px;', hint: '来自站点地图（sitemap）的页面地址；在「仪表盘 › 网站概览」完成站点地图检测后，列表会同步更新。' };
  if (id === 'keyword') return { style: 'min-width:140px;', hint: '为该页设定的 SEO 目标词，点击可编辑。' };
  if (id === 'pageType' || id === 'tags') return { style: 'min-width:140px;', hint: '页面类型（如首页、产品详情等），点击标签可修改。' };
  if (id === 'status') return { style: 'min-width:72px;', hint: '打开该页面网址时，服务器返回的状态码，便于发现无法访问或跳转异常。' };
  if (id === 'index') return { style: 'min-width:120px;', hint: '' };
  if (id === 'score') return { style: 'min-width:72px;', hint: '常规检测的七维规则总分，展示最近一次检测结果，打开页面详情时会自动更新。' };
  if (id === 'issues') return { style: 'min-width:100px;', hint: '常规检测待处理的问题数量：红色数字为严重问题，橙色为优化建议。' };
  return { style: 'min-width:100px;', hint: '' };
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function kwRowAction(act, id) {
  const k = DB.keywords.find(x => x.id === id);
  if (!k) return;
  closeAllKwOpsMenus();
  if (act === 'explore') {
    state.secondary = 'kw-explore';
    state.exploreShown = false;
    render();
  } else if (act === 'group') {
    openModal('set-group');
  } else if (act === 'write') {
    state.devInternalPage = null;
    state.logicDrawerTreeSelection = null;
    state.primary = 'writing';
    state.writingTab = 'workbench';
    state.workbenchStep = 'config';
    state.writingForm.keyword = String(k.kw).slice(0, 100);
    render();
  } else if (act === 'del') {
    if (confirm('确定删除关键词？删除后关键词历史数据将同步删除，不可恢复。')) {}
  }
}

function closeDropdown() {
  $('siteDropdown').classList.remove('open');
}

/* ── Secondary nav ── */
// Search and Settings now use in-content left sidebar navigation; top bar is hidden.
function renderSecondaryNav() {
  $('secondaryNav').style.display = 'none';
}

/* ── Page tabs ── */
// Tabs for search sub-sections are now rendered inside the search sidebar.
function renderPageTabs() {
  $('pageTabsBar').style.display = 'none';
}

/* ── Search page header (full-width, outside the sidebar layout) ── */
function searchPageHeader() {
  const map = {
    'kw-mgmt': {
      breadcrumb: '关键词管理',
      title:   state.tab === 'my-keywords' ? '我的关键词' : '关键词分组',
      actions: state.tab === 'my-keywords'
        ? `<button class="btn-primary" onclick="openModal('add-kw')">＋ 添加关键词</button>`
        : `<button class="btn-primary" onclick="openModal('add-group')">＋ 创建分组</button>`,
    },
    'kw-explore': { breadcrumb: '关键词探索',    title: '关键词探索',      actions: '' },
    'kw-rank':    { breadcrumb: '关键词排名抓取', title: '关键词排名查询', actions: '' },
    'competitor': {
      breadcrumb: '竞争对手分析',
      title:   state.compTab === 'competitors' ? '竞争对手' : '关键词对比',
      actions: state.compTab === 'competitors'
        ? `<button class="btn-primary" onclick="openModal('add-comp')">＋ 添加竞争对手</button>`
        : '',
    },
    'page-seo': {
      breadcrumb: '页面',
      title: '页面整合优化',
      actions: '',
    },
    'page-rank-list': {
      breadcrumb: '页面',
      title: '曝光页面',
      actions: '',
    },
  };
  const h = map[state.secondary] || map['kw-mgmt'];
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb"><span>搜索</span><span class="sep">›</span><span>${h.breadcrumb}</span></div>
      <h1>${h.title}</h1>
    </div>
    ${h.actions ? `<div class="page-header-actions">${h.actions}</div>` : ''}
  </div>`;
}

/* ── Search sidebar navigation ── */
function searchSidebarNav() {
  return `
    <div class="settings-menu-group">关键词</div>
    ${settingsMenuItemHTML('关键词管理', state.secondary === 'kw-mgmt', "state.secondary='kw-mgmt';state.tab='my-keywords';render()", false)}
    ${settingsMenuItemHTML('关键词探索', state.secondary === 'kw-explore', "state.secondary='kw-explore';render()", false)}
    ${settingsMenuItemHTML('关键词排名抓取', state.secondary === 'kw-rank', "state.secondary='kw-rank';render()", false)}
    <div class="settings-menu-group" style="margin-top:6px;">页面</div>
    ${settingsMenuItemHTML('曝光页面', state.secondary === 'page-rank-list', "state.secondary='page-rank-list';render()")}
    ${settingsMenuItemHTML('页面整合优化', state.secondary === 'page-seo', "state.secondary='page-seo';render()")}
    <div class="settings-menu-group" style="margin-top:6px;">竞争对手</div>
    ${settingsMenuItemHTML('竞争对手分析', state.secondary === 'competitor', "state.secondary='competitor';state.compTab='competitors';render()", false)}`;
}

/* Returns an inline segmented tab bar for use at the top of content areas */
function contentTabsHTML(tabs, activeId) {
  return `<div class="content-tabs">${
    tabs.map(t => `<button class="content-tab ${activeId === t.id ? 'active' : ''}"
      onclick="${t.onclick}">${t.label}</button>`).join('')
  }</div>`;
}

/* Wraps search page content: full-width header on top, then sidebar + content below */
function wrapSearchLayout(contentHTML) {
  return `
  ${searchPageHeader()}
  <div class="settings-layout">
    <aside class="settings-sidebar">
      ${searchSidebarNav()}
    </aside>
    <div class="settings-content">
      ${contentHTML}
    </div>
  </div>`;
}

/* ────────────────────────────────────────────────────────────
   Content pages
   ──────────────────────────────────────────────────────────── */

/* ── Sparkline SVG (area + line chart) ── */
function trendSparklineDateLabels(pointCount) {
  const n = Math.max(1, pointCount);
  const start = parseYMD(state.dateRangeStart);
  const end = parseYMD(state.dateRangeEnd);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const ms = start.getTime() + t * (end.getTime() - start.getTime());
    out.push(formatDateYMD(new Date(ms)));
  }
  return out;
}

function sparklineSVG(data, color, uid, opts) {
  color = color || '#3b82f6';
  opts = opts && typeof opts === 'object' ? opts : null;
  const w = 140, h = 46, pad = 4;
  if (!data || !data.length) return '';
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const dates = opts && opts.dates ? opts.dates : (opts && opts.metricLabel ? trendSparklineDateLabels(data.length) : null);
  const metricLabel = opts && opts.metricLabel ? opts.metricLabel : '';
  const formatVal = opts && opts.formatVal ? opts.formatVal : v => String(v);
  const pts = [];
  const hitNodes = [];
  data.forEach((v, i) => {
    const x = pad + (i / Math.max(1, data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / rng) * (h - pad * 3);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    if (metricLabel && dates) {
      const tip = `抓取任务：${dates[i] || '—'} · ${metricLabel}：${formatVal(v)}`;
      hitNodes.push(`<circle class="sparkline-hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="transparent" pointer-events="all"><title>${escapeHtmlStr(tip)}</title></circle>`);
    }
  });
  const poly = pts.join(' ');
  const area = `${poly} ${(w - pad).toFixed(1)},${h} ${pad},${h}`;
  const hits = hitNodes.length ? hitNodes.join('') : '';
  const cls = hits ? ' som-chart-svg--interactive' : '';
  return `<svg class="som-chart-svg${cls}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="slg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.15"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><polygon points="${area}" fill="url(#slg${uid})"/><polyline points="${poly}" stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${hits}</svg>`;
}

function rankedPagesTrendSparklineHTML(series, color, uid, metricLabel, taskDates) {
  if (!series || !series.length) return '';
  const formatVal = metricLabel === '平均最佳排名'
    ? v => (Number.isInteger(v) ? String(v) : Number(v).toFixed(1))
    : v => String(Math.round(v));
  const dates = taskDates && taskDates.length === series.length
    ? taskDates
    : trendSparklineDateLabels(series.length);
  const svg = sparklineSVG(series, color, uid, {
    metricLabel,
    formatVal,
    dates,
  });
  return `<div class="som-chart som-chart--trend" role="img" aria-label="${escapeAttr(metricLabel + '趋势')}">${svg}</div>`;
}

/* ── Rank change bars (paired up/down columns) ── */
function rankBarChartSVG(changes, uid) {
  const w = 140, h = 46, mid = h / 2;
  const n = changes.length;
  const maxV = Math.max(...changes.map(d => Math.max(d.u, d.d))) || 1;
  const pw = (w - 4) / n;
  const bw = Math.max(3, Math.floor(pw / 2) - 1);
  const bars = changes.map((d, i) => {
    const cx = 2 + i * pw + pw / 2;
    const uh = Math.round((d.u / maxV) * (mid - 5));
    const dh = Math.round((d.d / maxV) * (mid - 5));
    return `<rect x="${(cx - bw - 1).toFixed(1)}" y="${(mid - uh).toFixed(1)}" width="${bw}" height="${uh}" fill="#22c55e" rx="1.5"/><rect x="${(cx + 1).toFixed(1)}" y="${mid.toFixed(1)}" width="${bw}" height="${dh}" fill="#f87171" rx="1.5"/>`;
  }).join('');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="${mid}" x2="${w}" y2="${mid}" stroke="#e5e7eb" stroke-width="0.8"/>${bars}</svg>`;
}

/* ① 仪表盘：二级导航「网站概览 / 全部网站 / 待办任务」 */
function dashboardSidebarNav() {
  const t = state.dashboardTab;
  return `
    <div class="settings-menu-group settings-menu-group--subtitle-only">当前站点</div>
    ${settingsMenuItemHTML('网站概览', t === 'overview', "state.dashboardTab='overview';render();")}
    <div class="settings-sidebar-divider" role="separator"></div>
    <div class="settings-menu-group settings-menu-group--subtitle-only">全部站点</div>
    ${settingsMenuItemHTML('网站列表', t === 'all-sites', "state.dashboardTab='all-sites';render();", false)}`;
}

function dashboardSiteKeywordCardsHTML() {
  const SITE_STATS = [
    {
      ranked: 92, rankedDelta: 8, rankedUp: true,
      netStr: '+17', up: 31, down: 14,
      avgRank: 16.4, avgDelta: '+1.2', avgUp: true,
      dist: [
        { label:'第1名',    val: 4,  pct: -4.75, color:'#1d4ed8' },
        { label:'第2-3名',  val: 12, pct: -4.75, color:'#2563eb' },
        { label:'第4-10名', val: 30, pct:  4.75, color:'#3b82f6' },
        { label:'第11-30名',val: 35, pct:  4.75, color:'#60a5fa' },
        { label:'>30名',    val: 19, pct:  4.75, color:'#93c5fd' },
      ],
      kwTrend:  [75, 80, 78, 84, 87, 90, 92],
      avgTrend: [18.2, 17.8, 17.1, 16.9, 17.2, 16.6, 16.4],
      changes:  [{u:8,d:3},{u:5,d:4},{u:7,d:2},{u:6,d:5},{u:9,d:3},{u:7,d:4},{u:6,d:2}],
    },
    {
      ranked: 28, rankedDelta: 3, rankedUp: true,
      netStr: '+5', up: 10, down: 5,
      avgRank: 22.1, avgDelta: '-0.8', avgUp: false,
      dist: [
        { label:'第1名',    val: 1,  pct: -2.1, color:'#1d4ed8' },
        { label:'第2-3名',  val: 4,  pct: -2.1, color:'#2563eb' },
        { label:'第4-10名', val: 10, pct:  2.1, color:'#3b82f6' },
        { label:'第11-30名',val: 9,  pct:  2.1, color:'#60a5fa' },
        { label:'>30名',    val: 4,  pct:  2.1, color:'#93c5fd' },
      ],
      kwTrend:  [22, 24, 23, 26, 25, 27, 28],
      avgTrend: [24.1, 23.5, 23.2, 22.8, 22.5, 22.3, 22.1],
      changes:  [{u:5,d:2},{u:4,d:3},{u:6,d:2},{u:5,d:3},{u:4,d:2},{u:6,d:1},{u:3,d:2}],
    },
    {
      ranked: 18, rankedDelta: 2, rankedUp: true,
      netStr: '+8', up: 12, down: 4,
      avgRank: 18.7, avgDelta: '+2.1', avgUp: true,
      dist: [
        { label:'第1名',    val: 1,  pct:  1.2, color:'#1d4ed8' },
        { label:'第2-3名',  val: 3,  pct:  1.2, color:'#2563eb' },
        { label:'第4-10名', val: 6,  pct:  3.5, color:'#3b82f6' },
        { label:'第11-30名',val: 5,  pct:  3.5, color:'#60a5fa' },
        { label:'>30名',    val: 3,  pct:  3.5, color:'#93c5fd' },
      ],
      kwTrend:  [12, 14, 13, 15, 16, 17, 18],
      avgTrend: [21.5, 21.2, 20.8, 20.3, 19.9, 19.4, 18.7],
      changes:  [{u:3,d:1},{u:4,d:2},{u:5,d:1},{u:3,d:1},{u:4,d:2},{u:5,d:1},{u:6,d:2}],
    },
  ];

  return DB.sites.map((si, idx) => {
    const st = SITE_STATS[idx] || SITE_STATS[0];
    const isActive = si.id === state.siteId;
    const maxDistVal = Math.max(...st.dist.map(d => d.val));
    const uid = `s${idx}`;
    return `
    <div class="site-overview-card${isActive ? ' active' : ''}">
      <div class="site-overview-header">
        <div class="soh-identity">
          ${siteAvatar(si.name, idx)}
          <div>
            <div class="soh-name">${si.name}${isActive ? '&ensp;<span class="badge badge-blue" style="font-size:10px;vertical-align:middle;">当前</span>' : ''}</div>
            <div class="soh-domain">${si.domain}</div>
          </div>
        </div>
        <div class="soh-engine">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 7.1c0-.45-.04-.87-.11-1.28H7v2.42h3.37a2.88 2.88 0 0 1-1.25 1.89v1.57h2.02C12.47 10.51 13 8.94 13 7.1z" fill="#4285F4"/><path d="M7 13c1.69 0 3.11-.56 4.15-1.52l-2.02-1.57c-.56.38-1.28.61-2.13.61-1.63 0-3.01-1.1-3.5-2.58H1.41v1.62A6.97 6.97 0 0 0 7 13z" fill="#34A853"/><path d="M3.5 8.04c-.13-.38-.2-.8-.2-1.04s.07-.62.2-1V4.37H1.41A6.97 6.97 0 0 0 0 7c0 1.12.27 2.17.74 3.1L3.5 8.04z" fill="#FBBC05"/><path d="M7 2.78c.92 0 1.74.32 2.39.93l1.79-1.79C10.11.89 8.65 0 7 0A6.97 6.97 0 0 0 1.41 3.9L3.5 5.99C3.99 4.51 5.37 2.78 7 2.78z" fill="#EA4335"/></svg>
          <span>Google</span>
          <svg viewBox="0 0 10 6" width="9" height="5"><path d="M0 0l5 6 5-6z" fill="#94a3b8"/></svg>
        </div>
        <div class="soh-stat">
          <span class="soh-stat-num"><a class="td-link" href="#" onclick="goCompetitor();return false;">${si.comps}</a></span>
          <span>竞争对手</span>
        </div>
        <div class="soh-stat">
          <span class="soh-stat-num"><a class="td-link" href="#" onclick="goMyKeywords();return false;">${si.kws}</a></span>
          <span>关键词</span>
        </div>
        <div class="soh-header-right">
          <div class="soh-dates">
            <span>最近更新：2025-09-20</span>
            <span>下次更新：<span style="color:var(--brand);cursor:pointer;">2025-10-01</span></span>
          </div>
          <button type="button" class="btn-default soh-update-rank-btn" onclick="state.siteId=${si.id};openModal('update-rank');">更新排名</button>
        </div>
      </div>
      <div class="site-overview-metrics">
        <div class="som-panel">
          <div class="som-label">有排名关键词数</div>
          <div class="som-value-row">
            <span class="som-value">${st.ranked}</span>
            <span class="som-badge ${st.rankedUp ? 'up' : 'down'}">${st.rankedUp ? '↑' : '↓'} +${st.rankedDelta}</span>
          </div>
          <div class="som-chart">${sparklineSVG(st.kwTrend, '#3b82f6', uid + 'k')}</div>
        </div>
        <div class="som-panel">
          <div class="som-label">排名升降</div>
          <div class="som-value-row">
            <span class="som-value">${st.netStr}</span>
            <span class="som-sub">净上升&ensp;<span class="up" style="font-size:11px;font-weight:600;">↑${st.up}</span>&ensp;<span class="down" style="font-size:11px;font-weight:600;">↓${st.down}</span></span>
          </div>
          <div class="som-chart">${rankBarChartSVG(st.changes, uid + 'r')}</div>
        </div>
        <div class="som-panel">
          <div class="som-label">平均排名</div>
          <div class="som-value-row">
            <span class="som-value">${st.avgRank}</span>
            <span class="som-badge ${st.avgUp ? 'up' : 'down'}">${st.avgUp ? '↑' : '↓'} ${st.avgDelta}</span>
          </div>
          <div class="som-chart">${sparklineSVG(st.avgTrend, '#3b82f6', uid + 'a')}</div>
        </div>
        <div class="som-panel">
          <div class="som-label">排名分布</div>
          <div class="som-dist">
            ${st.dist.map(d => `
            <div class="som-dist-row">
              <span class="som-dist-label">${d.label}</span>
              <span class="som-dist-bar-wrap"><span class="som-dist-bar" style="width:${Math.round(d.val / maxDistVal * 100)}%;background:${d.color};"></span></span>
              <span class="som-dist-val">${d.val}</span>
              <span class="som-dist-pct ${d.pct >= 0 ? 'up' : 'down'}">${d.pct >= 0 ? '▲' : '▼'}${Math.abs(d.pct)}%</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

const SITE_INFRA_MODULE_A_TITLE = '网站健康度';
const SITE_INFRA_MODULE_A_LEAD = '决定网站能否被搜索引擎发现、信任并收录。';
const SITE_INFRA_MODULE_A_HINT = '这是决定网站能否被搜索引擎「发现、信任并收录」的地基。如果地基坏了，单页面的内容写得再好也无济于事。请确保网站对爬虫开放，导航地图清晰，并且拥有绝对安全的数据传输通道。';
const ONPAGE_INFRA_DIMENSIONS = [
  { id: 'robots', label: 'Robots.txt 协议健康度', shortLabel: 'Robots', max: 10 },
  { id: 'sitemap', label: 'Sitemap 站点地图', shortLabel: 'Sitemap', max: 10 },
  { id: 'https', label: 'HTTPS 安全', shortLabel: 'HTTPS', max: 10 },
];

/** 仪表盘「最近抓取」子表最多展示行数（完整数据见「我的关键词」「曝光页面」） */
const DASHBOARD_CRAWL_OVERVIEW_MAX_ROWS = 10;

const SITE_INFRA_SCANNING_HINT = '正在检测 Robots.txt、Sitemap 与首页 HTTPS，请稍候…';

function dashboardInfraSevBadgeHTML(issueLevel) {
  return onPageWincherBadgeHTML(dashboardTaskSevKey({ issueLevel }));
}

function dashboardInfraFormatLine(raw, kind) {
  const s = String(raw || '').trim();
  if (!s) return '—';
  if (kind === 'problem' && typeof formatDocProblem === 'function') return formatDocProblem(s);
  if (kind === 'suggestion' && typeof formatDocSuggestion === 'function') return formatDocSuggestion(s);
  return dashboardStripDiag(s);
}

function dashboardInfraSiteTasksForDim(dimId) {
  const dismissed = state.dashboardDismissedTaskIds || {};
  return (DB.dashboardTasks || []).filter(t => {
    if ((t.scope || 'page') !== 'site' || dismissed[t.id]) return false;
    const blob = `${t.area || ''} ${t.checkLabel || ''} ${t.module || ''}`;
    if (dimId === 'robots') return /robots/i.test(blob);
    if (dimId === 'sitemap') return /sitemap/i.test(blob);
    if (dimId === 'https') return /https|加密/i.test(blob);
    return false;
  });
}

function dashboardInfraDimDetailHTML(c) {
  const prob = c.problem
    ? `<p class="dashboard-infra-problem">${escapeHtmlStr(dashboardInfraFormatLine(c.problem, 'problem'))}</p>`
    : '';
  const sug = c.suggestion
    ? `<p class="dashboard-infra-suggestion">${escapeHtmlStr(dashboardInfraFormatLine(c.suggestion, 'suggestion'))}</p>`
    : '';
  if (!prob && !sug) {
    return '<div class="dashboard-infra-dim-detail"><p class="dashboard-infra-detail-empty">暂无待处理问题（示例）。</p></div>';
  }
  return `<div class="dashboard-infra-dim-detail">${prob}${sug}</div>`;
}

function dashboardInfraScanningPlaceholderHTML() {
  const rows = ONPAGE_INFRA_DIMENSIONS.map(def => `
    <div class="dashboard-infra-dim dashboard-infra-dim--scanning" aria-hidden="true">
      <div class="dashboard-infra-dim-sum dashboard-infra-dim-sum--static">
        <span class="dashboard-infra-dim-status"><span class="badge badge-gray">检测中</span></span>
        <strong class="dashboard-infra-dim-name">${escapeHtmlStr(def.label)}</strong>
        <span class="dashboard-infra-dim-brief dashboard-infra-dim-brief--shimmer">—</span>
      </div>
    </div>`).join('');
  return `<div class="dashboard-infra-scanning-wrap" role="status" aria-live="polite">
    <p class="dashboard-infra-scanning-msg">${escapeHtmlStr(SITE_INFRA_SCANNING_HINT)}</p>
    <div class="dashboard-infra-dim-list dashboard-infra-dim-list--scanning">${rows}</div>
  </div>`;
}

function dashboardInfraChecksHTML(summary) {
  if (state.dashboardInfraScanStatus === 'scanning') return dashboardInfraScanningPlaceholderHTML();
  const checks = (summary && summary.infraChecks) || [];
  const byId = {};
  checks.forEach(c => { if (c && c.id) byId[c.id] = c; });
  const rows = ONPAGE_INFRA_DIMENSIONS.map(def => {
    const c = byId[def.id] || { id: def.id, label: def.label, issueLevel: 'pass', problem: '', suggestion: '' };
    const sk = dashboardTaskSevKey({ issueLevel: c.issueLevel });
    const brief = c.summaryBrief || (sk === 'pass' ? '检测通过' : (sk === 'advice' ? '有优化建议' : '需立即处理'));
    return `<details class="dashboard-infra-dim dashboard-infra-dim--${sk}">
      <summary class="dashboard-infra-dim-sum">
        <span class="dashboard-infra-dim-status">${dashboardInfraSevBadgeHTML(c.issueLevel)}</span>
        <strong class="dashboard-infra-dim-name">${escapeHtmlStr(c.label || def.label)}</strong>
        <span class="dashboard-infra-dim-brief">${escapeHtmlStr(brief)}</span>
        <span class="dashboard-infra-dim-chevron" aria-hidden="true"></span>
      </summary>
      ${dashboardInfraDimDetailHTML(c)}
    </details>`;
  }).join('');
  return `<div class="dashboard-infra-dim-list" aria-label="网站技术基础检测项">${rows}</div>`;
}

const DASHBOARD_NEW_PAGES_LIST_MAX = 10;

function dashboardInfraScanCountReady() {
  const sid = state.siteId;
  if (state._infraScanSiteId !== sid) {
    state._infraScanSiteId = sid;
    const hasBaseline = !!(DB.dashboardSeoSummary && DB.dashboardSeoSummary.lastScanAt);
    state.dashboardInfraScanCount = hasBaseline ? Math.max(state.dashboardInfraScanCount || 0, 2) : 0;
  }
  return (state.dashboardInfraScanCount || 0) >= 2;
}

function dashboardNewPagesNoticeHTML() {
  if (!dashboardInfraScanCountReady()) return '';
  const pages = (DB.dashboardNewPages || []).filter(p => p && p.path);
  if (!pages.length) return '';
  const n = pages.length;
  const visible = pages.slice(0, DASHBOARD_NEW_PAGES_LIST_MAX);
  const list = visible.map(p => `
    <li class="dashboard-new-page-item">
      <div class="dashboard-new-page-main">
        ${p.title ? `<span class="dashboard-new-page-title">${escapeHtmlStr(p.title)}</span>` : ''}
        <code class="dashboard-new-page-path">${escapeHtmlStr(p.path)}</code>
      </div>
      ${p.foundAt ? `<time class="dashboard-new-page-at">${escapeHtmlStr(p.foundAt)}</time>` : ''}
    </li>`).join('');
  const scrollHint = n > visible.length
    ? `<p class="dashboard-new-pages-scroll-hint">共 ${n} 个新页面，列表内可滚动查看（最多列出 ${DASHBOARD_NEW_PAGES_LIST_MAX} 条）</p>`
    : '';
  return `
  <div class="panel dashboard-overview-module dashboard-new-pages-module">
    <div class="dashboard-module-hd"><span class="dashboard-module-hd-text">新页面提醒</span></div>
    <div class="dashboard-new-pages-inner">
      <p class="dashboard-new-pages-lead">检测到 <strong>${n}</strong> 个新页面，建议尽快完成单页常规检测与优化。</p>
      <div class="dashboard-new-pages-list-scroll" role="region" aria-label="新页面列表">
        <ul class="dashboard-new-pages-list">${list}</ul>
      </div>
      ${scrollHint}
      <p class="dashboard-seo-nudge dashboard-seo-nudge--inline">前往 <button type="button" class="btn-link dashboard-seo-nudge-link" onclick="goOnPageSeoFromDashboard()">页面整合优化</button> 查看并优化新页面。</p>
    </div>
  </div>`;
}

function dashboardSeoDimCompactHTML(dimAvg) {
  const d = dimAvg || {};
  const defs = typeof ONPAGE_SCORE_DIMENSIONS !== 'undefined' ? ONPAGE_SCORE_DIMENSIONS : [];
  const chips = defs.map(x => {
    const got = d[x.id] != null ? Number(d[x.id]) : 0;
    const pct = x.max > 0 ? (got / x.max) * 100 : 0;
    const cls = pct >= 85 ? 'onpage-dim-chip--ok' : pct >= 65 ? 'onpage-dim-chip--mid' : 'onpage-dim-chip--low';
    const lab = x.shortLabel || x.id;
    return `<button type="button" class="onpage-dim-chip dashboard-seo-dim-chip ${cls}" onclick="goDashboardTasksFromDim('${escapeAttr(x.id)}')" title="筛选 ${escapeAttr(x.label || x.id)} 相关待办">${escapeHtmlStr(lab)} <strong>${got}</strong> / ${x.max}</button>`;
  }).join('');
  return `<div class="onpage-dim-compact dashboard-seo-dim-compact" aria-label="核心页七维均分">${chips}</div>`;
}

function dashboardSeoInfraDimBtnHTML(key, label, val, max) {
  const dimMap = { infrastructure: '站点基建', corePages: '核心页加权' };
  const mod = dimMap[key] || label;
  return `<button type="button" class="dashboard-seo-dim-btn dashboard-seo-dim-btn--pair" onclick="goDashboardTasksFromModule('${escapeAttr(mod)}')" title="前往待办任务并筛选相关模块">
    <span class="k">${escapeHtmlStr(label)}</span><span class="v">${val != null ? val : '—'}<span class="dashboard-seo-dim-max">/${max}</span></span>
  </button>`;
}

function dashboardSeoOverviewSectionHTML() {
  const s = DB.dashboardSeoSummary;
  const scanning = state.dashboardInfraScanStatus === 'scanning';
  const last = scanning ? '检测中…' : (s.lastScanAt ? escapeHtmlStr(s.lastScanAt) : '—');
  const infoBtn = (hint, label) => `<span class="dashboard-seo-info-wrap" tabindex="0">
    <button type="button" class="dashboard-seo-info-btn" aria-label="${escapeAttr(label || '查看说明')}">?</button>
    <span class="dashboard-seo-info-pop" role="tooltip">${typeof hint === 'string' ? escapeHtmlStr(hint) : hint}</span>
  </span>`;
  return `
  <div class="panel dashboard-overview-module${scanning ? ' dashboard-overview-module--infra-scanning' : ''}">
    <div class="dashboard-module-hd dashboard-module-hd--with-hint">
      <span class="dashboard-module-hd-text">${SITE_INFRA_MODULE_A_TITLE}</span>
      ${infoBtn(SITE_INFRA_MODULE_A_HINT, '网站健康度说明')}
    </div>
    <div class="dashboard-seo-panel-inner">
      <p class="dashboard-seo-lead">${SITE_INFRA_MODULE_A_LEAD} </p>
      ${dashboardInfraChecksHTML(s)}
      <p class="dashboard-seo-nudge">单页 Title、正文、结构化数据等深入检测，请前往 <button type="button" class="btn-link dashboard-seo-nudge-link" onclick="goOnPageSeoFromDashboard()">页面整合优化</button>。</p>
    </div>
    <div class="dashboard-seo-foot">
      <div class="dashboard-seo-foot-primary">
        <button type="button" class="btn-default btn-sm" onclick="openDashboardSeoRescanConfirm()"${scanning ? ' disabled' : ''}>重新检测</button>
        <span class="dashboard-seo-last-scan"><span class="dashboard-seo-last-scan-lbl">${scanning ? '检测状态' : '上次检测'}</span><time class="dashboard-seo-last-scan-at" datetime="${escapeAttr(s.lastScanAt || '')}">${last}</time></span>
      </div>
    </div>
  </div>`;
}

window.goOnPageSeoFromDashboard = function () {
  state.primary = 'search';
  state.secondary = 'page-seo';
  render();
};

/** 已并入 dashboardSeoOverviewSectionHTML，保留空壳避免误用 */
function dashboardDimensionSnapshotHTML() {
  return '';
}

function dashboardSiteOverviewFullHTML() {
  return `
  <div class="dashboard-overview-layout">
    <div class="dashboard-overview-block">${dashboardSeoOverviewSectionHTML()}${dashboardNewPagesNoticeHTML()}</div>
    <div class="dashboard-overview-row2">
      <div class="dashboard-overview-block">${dashboardCrawlOverviewSectionHTML()}</div>
    </div>
  </div>`;
}

function dashboardTaskSevKey(t) {
  const v = String((t && t.issueLevel) || 'pass');
  if (v === 'issue' || v === 'advice' || v === 'pass') return v;
  if (v === 'critical') return 'issue';
  if (v === 'warning') return 'advice';
  return 'pass';
}

/** 与网页测评「问题 / 建议 / 通过」计数口径一致：由待办 issueLevel 汇总 */
function dashboardTaskSeverityCounts(scope) {
  const o = { issue: 0, advice: 0, pass: 0 };
  (DB.dashboardTasks || []).forEach(t => {
    const sc = t.scope || 'page';
    if (scope && sc !== scope) return;
    const k = dashboardTaskSevKey(t);
    o[k]++;
  });
  return o;
}

function dashboardTasksForPage(path) {
  const needle = normalizeTaskPagePath(path);
  const n2 = needle.replace(/\/$/, '') || '/';
  const dismissed = state.dashboardDismissedTaskIds || {};
  return (DB.dashboardTasks || []).filter(t => {
    if ((t.scope || 'page') !== 'page') return false;
    if (dismissed[t.id]) return false;
    const p = normalizeTaskPagePath(t.page);
    const p2 = p.replace(/\/$/, '') || '/';
    return p === needle || p2 === n2;
  });
}

function onPageDrawerPageTasksHTML(row) {
  const tasks = dashboardTasksForPage(row.path);
  if (!tasks.length) return '';
  const items = tasks.map(t => {
    const copy = dashboardTaskCheckCopy(t);
    const aiBtn = dashboardTaskSupportsEdit(t)
      ? `<button type="button" class="btn-dash-ai btn-sm" onclick="openDashboardTaskEditModal(${t.id})">${AI_REC_SVG}<span class="btn-dash-ai-lbl">去优化</span></button>`
      : '';
    return `<li class="onpage-drawer-task">
      <div class="onpage-drawer-task-hd">${dashboardSevBadgeHTML(dashboardTaskSevKey(t))}<span class="onpage-drawer-task-mod">${escapeHtmlStr(t.module || '—')}</span>${aiBtn}</div>
      <p class="onpage-drawer-task-desc">${escapeHtmlStr(copy.desc)}</p>
      <p class="onpage-drawer-task-sug">${escapeHtmlStr(copy.sug)}</p>
    </li>`;
  }).join('');
  return `<section class="onpage-drawer-tasks">
    <h4 class="onpage-drawer-tasks-hd">本页待办</h4>
    <ul class="onpage-drawer-task-list">${items}</ul>
  </section>`;
}

function dashboardSevBadgeHTML(sk) {
  if (sk === 'issue') return '<span class="badge dash-bad-c">严重</span>';
  if (sk === 'advice') return '<span class="badge dash-bad-w">建议</span>';
  return '';
}

function dashboardTasksSectionHTML() {
  const pf = (state.dashboardTasksPageFilter || '').trim();
  const ifl = (state.dashboardTasksIssueFilter || '').trim();
  const mf = (state.dashboardTasksModuleFilter || '').trim();
  const pages = [...new Set(DB.dashboardTasks.map(t => t.page).filter(Boolean))].sort();
  const modules = [...new Set(DB.dashboardTasks.map(t => t.module).filter(Boolean))].sort();
  const dismissed = state.dashboardDismissedTaskIds || {};
  const completed = state.dashboardTasksCompleted || {};
  const showDone = !!state.dashboardTasksShowCompleted;
  const sortKey = state.dashboardTasksSortKey || 'sev';
  const rows = dashboardTasksSortRows(DB.dashboardTasks.filter(t => {
    if (dismissed[t.id]) return false;
    if (dashboardTaskSevKey(t) === 'pass') return false;
    if (!showDone && completed[t.id]) return false;
    if (pf && String(t.page || '') !== pf) return false;
    if (ifl && dashboardTaskSevKey(t) !== ifl) return false;
    if (mf && String(t.module || '') !== mf) return false;
    return true;
  }));
  const pageOpts = pages.map(p => `<option value="${escapeAttr(p)}"${pf === p ? ' selected' : ''}>${escapeHtmlStr(p)}</option>`).join('');
  const modOpts = modules.map(m => `<option value="${escapeAttr(m)}"${mf === m ? ' selected' : ''}>${escapeHtmlStr(m)}</option>`).join('');
  const doneToggleTitle = showDone ? '隐藏已完成任务' : '展示已完成任务';
  const DASH_TASKS_EYE = '<svg class="dashboard-tasks-eye-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  return `
  <div class="panel dashboard-overview-module" style="overflow:hidden;">
    <div class="dashboard-module-hd"><span class="dashboard-module-hd-text">待优化清单</span></div>
    <div class="dashboard-tasks-toolbar">
      <label class="dashboard-tasks-filter-lbl" for="dashTasksIssueFilter">严重程度</label>
      <select id="dashTasksIssueFilter" class="form-input dashboard-tasks-page-select" onchange="setDashboardTasksIssueFilter(this.value)">
        <option value="">全部</option>
        <option value="issue"${ifl === 'issue' ? ' selected' : ''}>严重</option>
        <option value="advice"${ifl === 'advice' ? ' selected' : ''}>建议</option>
      </select>
      <label class="dashboard-tasks-filter-lbl" for="dashTasksModuleFilter">问题模块</label>
      <select id="dashTasksModuleFilter" class="form-input dashboard-tasks-page-select" onchange="setDashboardTasksModuleFilter(this.value)">
        <option value="">全部模块</option>
        ${modOpts}
      </select>
      <label class="dashboard-tasks-filter-lbl" for="dashTasksPageFilter">页面</label>
      <select id="dashTasksPageFilter" class="form-input dashboard-tasks-page-select" onchange="setDashboardTasksPageFilter(this.value)">
        <option value="">全部页面</option>
        ${pageOpts}
      </select>
      <div class="dashboard-tasks-toolbar-right">
        <button type="button" class="btn-icon dashboard-tasks-done-toggle" title="${escapeAttr(doneToggleTitle)}" aria-label="${escapeAttr(doneToggleTitle)}" aria-pressed="${showDone ? 'true' : 'false'}" onclick="toggleDashboardTasksShowCompleted()">${DASH_TASKS_EYE}</button>
      </div>
    </div>
    <div class="table-wrap dashboard-tasks-table-wrap">
      <table class="data-table dashboard-tasks-table">
        <thead>
          <tr>
            <th class="dashboard-tasks-th-sev"><button type="button" class="dashboard-th-sort${sortKey === 'sev' ? ' active' : ''}" onclick="toggleDashboardTasksSort('sev')"><span>严重程度</span>${tableSortIconHTML(sortKey, 'sev', state.dashboardTasksSortDir)}</button></th>
            <th class="dashboard-tasks-th-mod"><button type="button" class="dashboard-th-sort${sortKey === 'module' ? ' active' : ''}" onclick="toggleDashboardTasksSort('module')"><span>问题模块</span>${tableSortIconHTML(sortKey, 'module', state.dashboardTasksSortDir)}</button></th>
            <th class="dashboard-tasks-th-page">页面</th>
            <th class="dashboard-tasks-th-desc">问题描述</th>
            <th class="dashboard-tasks-th-sug">优化建议</th>
            <th class="dashboard-tasks-th-done" title="勾选表示本条待办已完成">完成</th>
            <th class="dashboard-tasks-th-act">操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(t => {
    const done = !!completed[t.id];
    const aiBtn = dashboardTaskSupportsEdit(t)
      ? `<button type="button" class="btn-dash-ai btn-sm" onclick="openDashboardTaskEditModal(${t.id})" title="打开对应编辑项（示例）">${AI_REC_SVG}<span class="btn-dash-ai-lbl">去优化</span></button>`
      : '';
    const dismissTitle = '忽略后本条待办将隐藏，直至下次整站检测或该页面重新检测后再显示。';
    const dismissBtn = `<button type="button" class="btn-dash-ignore btn-sm" onclick="dismissDashboardTask(${t.id})" title="${escapeAttr(dismissTitle)}" aria-label="忽略待办">忽略</button>`;
    const copy = dashboardTaskCheckCopy(t);
    const sugStack = `<div class="dashboard-task-sug-stack">
      <div class="dashboard-task-sug-txt">${escapeHtmlStr(copy.sug)}</div>
      ${aiBtn ? `<div class="dashboard-task-sug-ai">${aiBtn}</div>` : ''}
    </div>`;
    const sk = dashboardTaskSevKey(t);
    const sevBadge = dashboardSevBadgeHTML(sk);
    const pageDisp = `${httpsLockPrefixHTML()}<code>${escapeHtmlStr(t.page || '—')}</code>`;
    return `
          <tr class="dashboard-task-row${done ? ' dashboard-task-row--done' : ''}">
            <td>${sevBadge}</td>
            <td style="font-size:12px;">${escapeHtmlStr(t.module || '—')}</td>
            <td style="font-size:12px;"><button type="button" class="btn-link dashboard-task-path-link" data-task-path="${escapeAttr(String(t.page || ''))}" onclick="event.preventDefault();openDashboardTaskOnPageDrawerFromBtn(this)">${pageDisp}</button></td>
            <td style="font-size:13px;">${escapeHtmlStr(copy.desc)}</td>
            <td style="font-size:13px;vertical-align:top;">${sugStack}</td>
            <td style="text-align:center;vertical-align:middle;"><input type="checkbox" class="dashboard-task-done-cb" ${done ? 'checked' : ''} aria-label="标记为已完成" onchange="toggleDashboardTaskDone(${t.id},this.checked)" onclick="event.stopPropagation()" /></td>
            <td><div class="dashboard-task-actions">${dismissBtn}</div></td>
          </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

window.setDashboardTasksPageFilter = function (v) {
  state.dashboardTasksPageFilter = v || '';
  render();
};

window.setDashboardTasksIssueFilter = function (v) {
  state.dashboardTasksIssueFilter = v || '';
  render();
};

window.setDashboardTasksModuleFilter = function (v) {
  state.dashboardTasksModuleFilter = v || '';
  render();
};

window.goDashboardTasksFromSeoBadge = function (lv) {
  const legacy = { critical: 'issue', warning: 'advice', suggestion: 'pass' };
  const k = legacy[lv] != null ? legacy[lv] : (lv || '');
  state.dashboardTab = 'tasks';
  state.dashboardTasksIssueFilter = k;
  render();
};

window.goDashboardTasksFromDim = function (dimId) {
  const d = (typeof ONPAGE_SCORE_DIMENSIONS !== 'undefined' ? ONPAGE_SCORE_DIMENSIONS : []).find(x => x.id === dimId);
  state.dashboardTab = 'tasks';
  state.dashboardTasksModuleFilter = d ? d.label : '';
  state.dashboardTasksIssueFilter = '';
  render();
};

window.goDashboardTasksFromModule = function (mod) {
  state.dashboardTab = 'tasks';
  state.dashboardTasksModuleFilter = mod || '';
  render();
};

window.submitSiteRankCrawlBatch = function () {
  toast('已提交整站全量关键词排名抓取任务（示例），完成后将更新「最近抓取」时间', 'success');
  DB.dashboardLastCrawlAt = `${formatDateYMD(DEMO_TODAY)} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:00`;
  render();
};

function rankedKwRankAtYMD(rankAt) {
  const d = String(rankAt || '').trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '';
}

function rankedKwRowInDateRange(row, startStr, endStr) {
  const ymd = rankedKwRankAtYMD(row.rankAt || row.at);
  if (!ymd) return true;
  return ymd >= startStr && ymd <= endStr;
}

/** 每条关键词在所选日期范围内取「最后一次成功抓取」记录（仅计入有排名的抓取，按排名时间最新） */
function mergeRankedKwLastCrawlRows(raw, opts) {
  const start = (opts && opts.start) || state.dateRangeStart;
  const end = (opts && opts.end) || state.dateRangeEnd;
  const arr = Array.isArray(raw) ? raw.slice() : [];
  const map = new Map();
  arr.forEach(row => {
    if (!rankedKwRowInDateRange(row, start, end)) return;
    const eng = String(row.engine || '—');
    const kw = String(row.kw || '').trim();
    if (!kw) return;
    const at = String(row.rankAt || row.at || '');
    const rnk = row.rank != null && !Number.isNaN(Number(row.rank)) ? Number(row.rank) : null;
    if (rnk == null) return;
    const k = `${eng}||${kw}`;
    const prev = map.get(k);
    if (!prev) {
      map.set(k, { kw, rank: rnk, rankAt: at, engine: eng });
      return;
    }
    const prevAt = String(prev.rankAt || '');
    if (at > prevAt) map.set(k, { kw, rank: rnk, rankAt: at, engine: eng });
  });
  return Array.from(map.values()).sort((a, b) => String(a.kw).localeCompare(String(b.kw), 'zh-CN'));
}

function getRankedKwRowsWithRankOnLastCrawl(raw, opts) {
  return mergeRankedKwLastCrawlRows(raw, opts);
}

function computeRankedLandingPageDerived(p) {
  const key = resolveRankedKwSamplesKey(p.path);
  const raw = (DB.onPageRankedKwSamples && DB.onPageRankedKwSamples[key]) || [];
  const withRank = getRankedKwRowsWithRankOnLastCrawl(raw);
  if (!withRank.length) {
    return { ...p, rankedKwCount: 0, bestKw: p.bestKw || '', rank: p.rank };
  }
  const best = withRank.slice().sort((a, b) => {
    const dr = a.rank - b.rank;
    if (dr !== 0) return dr;
    return String(a.kw).localeCompare(String(b.kw), 'zh-CN');
  })[0];
  return {
    ...p,
    rankedKwCount: withRank.length,
    bestKw: best.kw,
    rank: best.rank,
  };
}

function enrichRankedLandingPageRow(p) {
  if (!p || !p.path) return p;
  const key = resolveRankedKwSamplesKey(p.path);
  const raw = DB.onPageRankedKwSamples && DB.onPageRankedKwSamples[key];
  if (raw && raw.length) return computeRankedLandingPageDerived(p);
  return p;
}

function dashboardTaskSupportsEdit(t) {
  const dim = String((t && t.dimId) || '');
  const label = String((t && t.checkLabel) || '');
  if (dim === 'title' || dim === 'meta') return true;
  if (dim === 'headings') return true;
  if (dim === 'media' && /Alt/i.test(label)) return true;
  if (dim === 'code' && /JSON-LD/i.test(label)) return true;
  return false;
}

function onPagePageIndexByPath(path) {
  return (DB.onPageSeoPages || []).findIndex(p => String(p.path) === String(path || ''));
}

window.openDashboardTaskEditModal = function (taskId) {
  const t = DB.dashboardTasks.find(x => x.id === taskId);
  if (!t) return;
  const ix = onPagePageIndexByPath(t.page);
  if (ix < 0) {
    toast('未找到对应页面（示例）', 'error');
    return;
  }
  state.onPageSeoDrawerIndex = ix;
  const row = DB.onPageSeoPages[ix];
  const dim = t.dimId || '';
  if (dim === 'title' || dim === 'meta' || dim === 'url') {
    state.onPageAiAuditEditorPrefill = { kind: 'tdk', title: row.title, desc: row.metaDesc || '', kw: row.metaKeywords || '', sug: t.sug };
    openModal('onpage-drawer-tdk');
    return;
  }
  if (dim === 'headings') {
    state.onPageSeoDrawerTab = 'headings';
    row._aiHeadingHint = t.sug;
    openOnPageSeoDrawer(ix);
    return;
  }
  if (dim === 'media') {
    state.onPageSeoDrawerTab = 'images';
    openOnPageSeoDrawer(ix);
    return;
  }
  if (dim === 'code') {
    const label = String(t.checkLabel || '');
    if (/JSON-LD/i.test(label)) {
      const isBlog = /\/blog\//i.test(String(row.path || ''));
      state.onPageSchemaSlice = isBlog ? 'jsonld-blog' : 'jsonld-org';
      const sch = onPageAiBuildConcreteRecommendations(row).find(b => b.key === 'schema');
      const jsonRec = sch && sch.fields && sch.fields[0] ? String(sch.fields[0].recommended || '') : '';
      state.onPageAiAuditEditorPrefill = jsonRec ? { kind: 'schema-json', json: jsonRec } : null;
      openModal('onpage-schema-json');
      return;
    }
    if (/hreflang|多语言/i.test(t.title + t.sug)) {
      state.onPageSeoDrawerTab = 'intl';
      openOnPageSeoDrawer(ix);
      return;
    }
    state.onPageSeoDrawerTab = 'links';
    openOnPageSeoDrawer(ix);
    return;
  }
  if (dim === 'body') {
    state.onPageSeoDrawerTab = 'keywords';
    openOnPageSeoDrawer(ix);
    return;
  }
  state.onPageSeoDrawerTab = 'diagnose';
  openOnPageSeoDrawer(ix);
};

window.openDashboardTaskAiModal = function (taskId) {
  openDashboardTaskEditModal(taskId);
};

function pageDashboard() {
  if (state.dashboardTab === 'tasks') state.dashboardTab = 'overview';
  const crumbMap = { overview: '网站概览', 'all-sites': '全部网站' };
  const titleMap = {
    overview: '网站概览',
    'all-sites': '全部网站（账号下全部站点）',
  };
  const crumb = crumbMap[state.dashboardTab] || '网站概览';
  const h1 = titleMap[state.dashboardTab] || titleMap.overview;
  let body = '';
  if (state.dashboardTab === 'all-sites') {
    body = `<div class="dashboard-subsection-h" style="margin-top:0;">关键词排名总览（全部站点）</div><div class="site-overview-list">${dashboardSiteKeywordCardsHTML()}</div>`;
  } else {
    body = dashboardSiteOverviewFullHTML();
  }

  const dashAdd = state.dashboardTab === 'overview' ? '' : `
    <div class="page-header-actions">
      <button class="btn-primary" onclick="openModal('add-site')">＋ 添加网站</button>
    </div>`;

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb">
        <span>增长引擎</span><span class="sep">›</span><span>仪表盘</span><span class="sep">›</span><span>${crumb}</span>
      </div>
      <h1>${h1}</h1>
    </div>
    ${dashAdd}
  </div>
  <div class="settings-layout">
    <aside class="settings-sidebar">${dashboardSidebarNav()}</aside>
    <div class="settings-content">${body}</div>
  </div>`;
}

/* ② 我的关键词 */
function pageMyKeywords() {
  const kws = DB.keywords;
  const tabs = [
    { id: 'my-keywords', label: '我的关键词', onclick: `state.tab='my-keywords';render()` },
    { id: 'kw-groups',   label: '关键词分组', onclick: `state.tab='kw-groups';render()` },
  ];
  const kwTrend  = [75, 80, 78, 84, 87, 90, 92];
  const avgTrend = [18.2, 17.8, 17.1, 16.9, 17.2, 16.6, 16.4];
  const changes  = [{u:8,d:3},{u:5,d:4},{u:7,d:2},{u:6,d:5},{u:9,d:3},{u:7,d:4},{u:6,d:2}];
  const dist = [
    { label:'第1名',    val: 4,  pct: -4.75, color:'#1d4ed8' },
    { label:'第2-3名',  val: 12, pct: -4.75, color:'#2563eb' },
    { label:'第4-10名', val: 30, pct:  4.75, color:'#3b82f6' },
    { label:'第11-30名',val: 35, pct:  4.75, color:'#60a5fa' },
    { label:'>30名',    val: 19, pct:  4.75, color:'#93c5fd' },
  ];
  const maxDist = Math.max(...dist.map(d => d.val));
  return `
  ${contentTabsHTML(tabs, state.tab)}
  <!-- Summary metrics – sparkline panels -->
  <div class="kw-metrics-panel">
    <div class="site-overview-metrics">
      <div class="som-panel">
        <div class="som-label">有排名关键词数</div>
        <div class="som-value-row">
          <span class="som-value">92</span>
          <span class="som-badge up">↑ +8</span>
        </div>
        <div class="som-chart">${sparklineSVG(kwTrend, '#3b82f6', 'myk')}</div>
      </div>
      <div class="som-panel">
        <div class="som-label">排名升降</div>
        <div class="som-value-row">
          <span class="som-value">+17</span>
          <span class="som-sub">净上升&ensp;<span class="up" style="font-size:11px;font-weight:600;">↑31</span>&ensp;<span class="down" style="font-size:11px;font-weight:600;">↓14</span></span>
        </div>
        <div class="som-chart">${rankBarChartSVG(changes, 'myr')}</div>
      </div>
      <div class="som-panel">
        <div class="som-label">平均排名</div>
        <div class="som-value-row">
          <span class="som-value">16.4</span>
          <span class="som-badge up">↑ +1.2</span>
        </div>
        <div class="som-chart">${sparklineSVG(avgTrend, '#3b82f6', 'mya')}</div>
      </div>
      <div class="som-panel">
        <div class="som-label">排名分布</div>
        <div class="som-dist">
          ${dist.map(d => `
          <div class="som-dist-row">
            <span class="som-dist-label">${d.label}</span>
            <span class="som-dist-bar-wrap"><span class="som-dist-bar" style="width:${Math.round(d.val/maxDist*100)}%;background:${d.color};"></span></span>
            <span class="som-dist-val">${d.val}</span>
            <span class="som-dist-pct ${d.pct >= 0 ? 'up' : 'down'}">${d.pct >= 0 ? '▲' : '▼'}${Math.abs(d.pct)}%</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <div class="panel" style="overflow:hidden;">

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-spacer"></div>
      <input class="input-search" type="text" placeholder="搜索关键词"/>
      <select><option>最新排名（全部）</option><option>第1名</option><option>前3名</option><option>前10名</option><option>有排名</option></select>
      <select><option>关键词分组（全部）</option>${DB.groups.map(g=>`<option>${g.name}</option>`).join('')}</select>
      <div class="toolbar-field-wrap" onclick="event.stopPropagation()">
        <button type="button" class="btn-icon" title="字段配置" onclick="toggleKwFieldPanel(event)">⋮</button>
        ${state.kwFieldConfigOpen ? kwFieldConfigPanelHTML() : ''}
      </div>
      <button class="btn-icon" title="导出">↓</button>
      <button class="btn-icon" title="高级筛选">▼</button>
    </div>

    <!-- Table -->
    <div class="table-wrap table-wrap-kw-sticky">
      <table class="data-table data-table-kw-wide">
        <thead>
          <tr>
            ${myKwVisibleColIds().map(myKwThHtml).join('')}
          </tr>
        </thead>
        <tbody>
          ${kws.map(k => {
            const rankDelta = k.rank && k.prev ? k.rank - k.prev : null;
            const rankStr = k.rank ? `<span class="td-rank">${k.rank}</span>` : '<span style="color:var(--text-light);">无排名</span>';
            const deltaStr = rankDelta !== null ? `<span class="td-rank-delta ${rankDelta<0?'up':rankDelta>0?'down':''}">${rankDelta<0?'↑'+Math.abs(rankDelta):rankDelta>0?'↓'+rankDelta:'—'}</span>` : '';
            const trendStr = k.trend > 0 ? `<span class="up">↑${k.trend}%</span>` : `<span class="down">↓${Math.abs(k.trend)}%</span>`;
            const groupTags = k.groups.map(g=>`<span class="tag tag-gray">${g}</span>`).join(' ');
            const pageStr = k.bestPage
              ? `<button type="button" class="td-link btn-td-link" onclick="event.stopPropagation();state.kwBestPagesKwId=${k.id};openModal('kw-best-pages');">${httpsLockPrefixHTML()}${escapeHtmlStr(k.bestPage)}${k.extraPages ? ` <span class="badge badge-blue">+${k.extraPages}</span>` : ''}</button>`
              : '<span style="color:var(--text-light);">无排名页面</span>';
            const parts = { rankStr, deltaStr, trendStr, groupTags, pageStr };
            const colIds = myKwVisibleColIds();
            const cells = colIds.map(id => `<td class="${myKwTdClass(id)}">${myKwCellHtml(id, k, parts)}</td>`).join('');
            return `<tr>${cells}</tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div style="padding:12px 20px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);">
      <span style="font-size:12px;color:var(--text-sub);">共 ${kws.length} 条 &nbsp; 每页显示：<select style="height:26px;font-size:12px;border:1px solid var(--border);border-radius:4px;padding:0 6px;"><option>20</option><option>50</option><option>100</option><option>200</option></select></span>
      <div style="display:flex;gap:4px;">
        <button class="btn-default" style="height:28px;padding:0 8px;">‹</button>
        <button class="btn-primary" style="height:28px;padding:0 10px;">1</button>
        <button class="btn-default" style="height:28px;padding:0 8px;">›</button>
      </div>
    </div>
  </div>`;
}

/* ③ 关键词分组 */
function pageKwGroups() {
  const tabs = [
    { id: 'my-keywords', label: '我的关键词', onclick: `state.tab='my-keywords';render()` },
    { id: 'kw-groups',   label: '关键词分组', onclick: `state.tab='kw-groups';render()` },
  ];
  // Mini multi-line chart data for each group
  const groupColors = ['#3b82f6','#22c55e','#f59e0b','#a855f7','#ef4444'];
  const groupTrends = DB.groups.map((_, i) => Array.from({length:7}, (_, j) => 5 + Math.round(Math.random()*25 + Math.sin((i+j)*0.8)*8)));
  const avgTrends   = DB.groups.map((_, i) => Array.from({length:7}, (_, j) => 8 + Math.round(Math.random()*20 + Math.cos((i+j)*0.7)*6)));

  function multiLineChart(dataArr, uid) {
    const w = 400, h = 70, pad = 6;
    const allVals = dataArr.flat();
    const minV = Math.min(...allVals), maxV = Math.max(...allVals);
    const rng = maxV - minV || 1;
    return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      ${dataArr.map((data, si) => {
        const pts = data.map((v, i) => {
          const x = pad + (i / (data.length - 1)) * (w - pad * 2);
          const y = h - pad - ((v - minV) / rng) * (h - pad * 2);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        return `<polyline points="${pts}" stroke="${groupColors[si % groupColors.length]}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
      }).join('')}
    </svg>`;
  }

  return `
  ${contentTabsHTML(tabs, state.tab)}
  <div class="comp-charts-row" style="margin-bottom:16px;">
    <div class="comp-chart-panel">
      <div class="comp-chart-title">有排名关键词数</div>
      ${multiLineChart(groupTrends, 'kg1')}
      <div class="comp-chart-legend">
        ${DB.groups.map((g, i) => `<span class="comp-legend-item"><span class="comp-legend-dot" style="background:${groupColors[i % groupColors.length]};"></span>${g.name}</span>`).join('')}
      </div>
    </div>
    <div class="comp-chart-panel">
      <div class="comp-chart-title">平均排名</div>
      ${multiLineChart(avgTrends, 'kg2')}
      <div class="comp-chart-legend">
        ${DB.groups.map((g, i) => `<span class="comp-legend-item"><span class="comp-legend-dot" style="background:${groupColors[i % groupColors.length]};"></span>${g.name}</span>`).join('')}
      </div>
    </div>
  </div>
  <div class="panel" style="overflow:hidden;">
    <div class="toolbar">
      <div class="toolbar-spacer"></div>
      <input class="input-search" type="text" placeholder="搜索分组"/>
      <select><option>平均排名（全部）</option><option>第1名</option><option>前3名</option><option>前10名</option></select>
      <button class="btn-icon" title="导出">↓</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox"/></th>
            <th>分组 ↕</th>
            <th>关键词 ↕</th>
            <th>平均排名 ↕</th>
            <th>第1名 ↕</th>
            <th>第2-3名 ↕</th>
            <th>第4-10名 ↕</th>
            <th>第11-30名 ↕</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${DB.groups.map(g=>`
          <tr>
            <td><input type="checkbox"/></td>
            <td><strong>${g.name}</strong></td>
            <td><a class="td-link" onclick="state.tab='my-keywords';render();return false;">${g.kws}</a></td>
            <td>${g.avgRank}</td>
            <td>${g.r1}</td>
            <td>${g.r23}</td>
            <td>${g.r410}</td>
            <td>${g.r1130}</td>
            <td class="ops">
              <button class="btn-link" onclick="openModal('edit-group')">编辑</button>
              <button class="btn-link" style="color:var(--red);" onclick="if(confirm('删除分组不会删除其内关键词，确认删除？')){}">删除</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ④ 关键词探索 */
function pageKwExplore() {
  if (!state.exploreShown) {
    const isKw = state.exploreMode === 'keyword';
    return `
    <div class="explore-hero">
      <div class="explore-hero-title">关键词探索</div>
      <div class="explore-hero-subtitle">分析您需要了解的有关任何关键词的所有信息，发现更具价值的新关键词机会。</div>
      <div class="explore-hero-tabs">
        <button class="explore-hero-tab ${isKw ? 'active' : ''}" onclick="state.exploreMode='keyword';render();">通过关键词</button>
        <button class="explore-hero-tab ${!isKw ? 'active' : ''}" onclick="state.exploreMode='url';render();">通过网站网址</button>
      </div>
      <div class="explore-hero-hint">${isKw ? '输入与您的业务最相关的产品或服务' : '输入您的网站网址以发现相关关键词'}</div>
      <div class="explore-hero-form">
        <input type="text" placeholder="${isKw ? '输入目标关键词' : '输入目标网站网址'}" value="${isKw ? '网站建设' : ''}"/>
        <button class="btn-explore-hero" onclick="state.exploreShown=true;render();">立即探索 &nbsp;3/10 (每日重置)</button>
      </div>
    </div>
    <div class="panel" style="overflow:hidden;">
      <div style="padding:14px 20px;font-size:13px;font-weight:600;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="var(--text-3)" stroke-width="1.2"/><line x1="8" y1="4" x2="8" y2="8" stroke="var(--text-3)" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11" r=".8" fill="var(--text-3)"/></svg>
        探索记录
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>日期</th><th>数量</th><th>类型</th><th>条件</th><th>操作</th></tr></thead>
          <tbody>
            ${DB.exploreHistory.map(h=>`
            <tr>
              <td>${h.date}</td>
              <td>${h.count}</td>
              <td><span class="badge badge-gray">${h.type}</span></td>
              <td>${h.condition}</td>
              <td>
                <button class="btn-link" onclick="state.exploreShown=true;render();">重新探索</button>
                <button class="btn-link" style="margin-left:8px;">导出</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }
  // Results view
  const condLabel = state.exploreMode === 'keyword' ? '网站建设、外贸建站' : site().domain;
  return `
  <div class="explore-results-bar">
    <div style="display:flex;align-items:center;gap:8px;">
      <select style="height:32px;border:1px solid var(--border);border-radius:var(--r-md);padding:0 28px 0 10px;font-size:13px;background:var(--surface);appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 8px center;">
        <option>${state.exploreMode === 'keyword' ? '通过关键词' : '通过网站网址'}</option>
      </select>
      <input type="text" value="${state.exploreMode === 'keyword' ? '网站建设' : site().domain}" style="height:32px;border:1px solid var(--border);border-radius:var(--r-md);padding:0 10px;width:240px;font-size:13px;"/>
      <button class="btn-primary" onclick="state.exploreShown=true;render();">立即探索</button>
    </div>
    <div class="explore-condition-label">
      <span>当前探索条件：</span>
      <svg width="12" height="12" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="1" fill="none" stroke="var(--text-3)" stroke-width="1.2"/><line x1="5" y1="5" x2="11" y2="5" stroke="var(--text-3)" stroke-width="1.2"/><line x1="5" y1="8" x2="11" y2="8" stroke="var(--text-3)" stroke-width="1.2"/><line x1="5" y1="11" x2="9" y2="11" stroke="var(--text-3)" stroke-width="1.2"/></svg>
      ${condLabel.split('、').map(c => `<span class="badge badge-gray">${c}</span>`).join('')}
    </div>
    <div style="margin-left:auto;display:flex;gap:8px;">
      <button class="btn-icon" title="导出">↓</button>
      <button class="btn-icon" title="字段">⋮</button>
    </div>
  </div>
  <div class="panel" style="overflow:hidden;">
    <div class="toolbar" style="border-radius:0;border-top:none;">
      <span style="font-size:13px;font-weight:600;color:var(--text-1);">推荐关键词</span>
      <div class="toolbar-spacer"></div>
      <button class="btn-default" onclick="openModal('add-kw')">加入关键词库</button>
      <button class="btn-default">导出</button>
      <button class="btn-link" onclick="state.exploreShown=false;render();">重新探索</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox"/></th>
            <th>关键词 ↕</th>
            <th>平均月搜索量 ↕</th>
            <th>竞争程度 ↕</th>
            <th>CPC ↕</th>
            <th>搜索趋势 ↕</th>
            <th>搜索来源</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${DB.exploreResults.map(r => {
            const trend = r.trend > 0 ? `<span class="up">↑${r.trend}%</span>` : `<span class="down">↓${Math.abs(r.trend)}%</span>`;
            return `<tr>
              <td><input type="checkbox"/></td>
              <td><span class="td-kw" style="cursor:default;">${r.kw}</span></td>
              <td>${r.vol}</td>
              <td>${r.comp}</td>
              <td>${r.cpc}</td>
              <td>${trend}</td>
              <td><span style="color:#fbbc05;font-size:13px;" title="Google Ads">▲</span></td>
              <td><button class="btn-link" onclick="openModal('add-kw')">添加</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 20px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);">
      <span style="font-size:12px;color:var(--text-sub);">共 ${DB.exploreResults.length} 条</span>
    </div>
  </div>`;
}

/* ⑤ 关键词排名 */
function pageKwRank() {
  if (!state.rankShown) {
    return `
    <div class="panel" style="overflow:hidden;">
      <div style="padding:12px 20px;font-size:14px;font-weight:600;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        查询记录
        <button class="btn-default">导出</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>日期</th><th>数量</th><th>查询条件</th><th>排名概览</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            ${DB.rankHistory.map(r=>`
            <tr>
              <td>${r.date}</td><td>${r.count}</td><td>${r.condition}</td>
              <td><span class="badge badge-blue">${r.overview}</span></td>
              <td><span class="badge ${r.status==='已完成'?'badge-green':'badge-gray'}">${r.status}</span></td>
              <td>
                <button class="btn-link" onclick="state.rankShown=true;render();">查看</button>
                <button class="btn-link" style="margin-left:8px;">导出</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }
  // Results
  return `
  <div class="rank-query-area" style="padding:12px 20px;">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <div class="kv-info">
        <span class="engine-chip selected">网页 · Google · 美国</span>
        <span style="font-size:12px;color:var(--text-sub);">共 4 个关键词</span>
      </div>
      <div class="toolbar-spacer"></div>
      <button class="btn-default" onclick="state.rankShown=false;render();">重新查询</button>
      <button class="btn-default">导出</button>
    </div>
  </div>
  <div class="panel" style="overflow:hidden;">
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>关键词</th>
            <th>排名</th>
            <th>竞争对手1 (www.example.com)</th>
            <th>竞争对手2 (www.abc.com)</th>
            <th>平均月搜索量</th>
            <th>竞争程度</th>
            <th>CPC</th>
            <th>搜索趋势</th>
            <th>SERP</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${DB.keywords.map(k=>{
            const rankStr = k.rank ? `<span class="badge badge-rank1">${k.rank}</span>` : '<span style="color:var(--text-light);">无排名</span>';
            const trend = k.trend>0?`<span class="up">↑${k.trend}%</span>`:`<span class="down">↓${Math.abs(k.trend)}%</span>`;
            return `<tr>
              <td><strong>${k.kw}</strong></td>
              <td>${rankStr}</td>
              <td><span class="badge badge-gray">5</span></td>
              <td><span style="color:var(--text-light);">&gt;30</span></td>
              <td>${k.vol}</td><td>${k.comp}</td><td>${k.cpc}</td>
              <td>${trend}</td>
              <td><button class="btn-link">预览</button></td>
              <td><button class="btn-link" onclick="openModal('rerank')">重新抓取</button></td>
            </tr>`;}).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ── Competitor charts helper ── */
function compChartsHTML() {
  const colors = ['#3b82f6', '#22c55e', '#f59e0b'];
  const labels = [site().name, ...DB.competitors.map(c => c.name)];
  const avgData = [
    [18.2, 17.8, 17.1, 16.9, 17.2, 16.6, 16.4],
    [8.4, 7.9, 7.2, 7.5, 6.8, 7.1, 6.2],
    [12.1, 11.8, 12.4, 13.1, 12.7, 11.9, 9.8],
  ];
  const distData = [
    [4, 12, 30, 35, 19],
    [5, 11, 18, 8, 2],
    [2, 6, 14, 15, 3],
  ];
  const distColors = ['#1d4ed8','#2563eb','#3b82f6','#60a5fa','#93c5fd'];

  const w = 320, h = 100, pad = 8;
  const allVals = avgData.flat();
  const minV = Math.min(...allVals), maxV = Math.max(...allVals);
  const rng = maxV - minV || 1;
  const lines = avgData.map((data, si) => {
    const pts = data.map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - minV) / rng) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `<polyline points="${pts}" stroke="${colors[si]}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${si === 0 ? 1 : 0.75}"/>`;
  }).join('');

  const avgChart = `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`;

  const barW = 36, barGap = 8, groupW = barW * 3 + barGap * 2, groups = 3;
  const bh = 80, bPad = 8;
  const distMax = Math.max(...distData.flat());
  const barSVGW = groupW * groups + bPad * (groups + 1);
  const distBars = distData.map((siteData, gi) => {
    const gx = bPad + gi * (groupW + bPad);
    return siteData.map((v, ci) => {
      const bHeight = Math.round((v / distMax) * (bh - 12));
      const bx = gx + ci * (barW + barGap);
      return `<rect x="${bx}" y="${bh - bHeight}" width="${barW}" height="${bHeight}" fill="${distColors[ci]}" rx="2" opacity="${0.55 + ci * 0.1}"/>`;
    }).join('');
  }).join('');
  const distLabels = [site().name, ...DB.competitors.map(c => c.name)].map((lbl, gi) => {
    const gx = bPad + gi * (groupW + bPad) + groupW / 2;
    return `<text x="${gx}" y="${bh + 12}" text-anchor="middle" font-size="9" fill="#6b7280">${lbl.slice(0, 4)}</text>`;
  }).join('');
  const distChart = `<svg width="100%" height="${bh + 18}" viewBox="0 0 ${barSVGW} ${bh + 18}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${distBars}${distLabels}</svg>`;

  return `
  <div class="comp-charts-row">
    <div class="comp-chart-panel">
      <div class="comp-chart-title">平均排名</div>
      ${avgChart}
      <div class="comp-chart-legend">
        ${labels.map((l, i) => `<span class="comp-legend-item"><span class="comp-legend-dot" style="background:${colors[i]};"></span>${l}</span>`).join('')}
      </div>
    </div>
    <div class="comp-chart-panel">
      <div class="comp-chart-title">排名分布</div>
      ${distChart}
      <div class="comp-chart-legend">
        ${['第1名','第2-3名','第4-10名','第11-30名','>30名'].map((l, i) => `<span class="comp-legend-item"><span class="comp-legend-dot" style="background:${distColors[i]};"></span>${l}</span>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ⑥ 竞争对手 */
function pageCompetitors() {
  return `
  ${compChartsHTML()}
  <div class="panel" style="overflow:hidden;">
    <div class="toolbar">
      <input class="input-search" type="text" placeholder="搜索关键词"/>
      <select><option>竞争对手</option></select>
      <select><option>关键词分组（全部）</option>${DB.groups.map(g=>`<option>${g.name}</option>`).join('')}</select>
      <select><option>最新排名</option></select>
      <button class="btn-default" style="gap:4px;">▼ 高级筛选</button>
      <div class="toolbar-spacer"></div>
      <button class="btn-icon" title="导出">↓</button>
      <button class="btn-icon" title="字段">⋮</button>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border);">
      <div style="display:flex;gap:0;">
        <button class="content-tab active" style="border-radius:0;height:28px;font-size:12px;" onclick="state.compTab='competitors';render()">竞争对手 ${DB.competitors.length}</button>
        <button class="content-tab" style="border-radius:0;height:28px;font-size:12px;" onclick="state.compTab='compare';render()">关键词对比 ${DB.kwCompare.length}</button>
      </div>
      <button class="btn-primary" onclick="openModal('add-comp')">＋ 添加竞争对手</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox"/></th>
            <th>竞争对手 ↕</th>
            <th>关键词 ↕</th>
            <th>平均排名 ↕</th>
            <th>第1名 ↕</th>
            <th>第2-3名 ↕</th>
            <th>第4-10名 ↕</th>
            <th>第11-30名 ↕</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:var(--surface-2);">
            <td><input type="checkbox" disabled/></td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:28px;height:28px;border-radius:var(--r-sm);background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;">${site().name[0]}</div>
                <div>
                  <div style="font-weight:600;font-size:13px;">${site().name}</div>
                  <div style="font-size:11px;color:var(--text-3);">${site().domain}</div>
                </div>
                <span style="background:var(--brand);color:#fff;padding:1px 7px;border-radius:var(--r-full);font-size:10px;font-weight:600;">我</span>
              </div>
            </td>
            <td><a class="td-link" onclick="goMyKeywords();return false;">${site().kws}</a></td>
            <td>16.4</td><td>4 <span class="td-rank-delta up">↑3</span></td><td>12 <span class="td-rank-delta up">↑3</span></td><td>30 <span class="td-rank-delta up">↑3</span></td><td>35 <span class="td-rank-delta up">↑3</span></td>
            <td>—</td>
          </tr>
          ${DB.competitors.map(c=>`
          <tr>
            <td><input type="checkbox"/></td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--text-3)" stroke-width="1.2"/><path d="M4 8h8M8 4c-1.8 2-1.8 6 0 8M8 4c1.8 2 1.8 6 0 8" stroke="var(--text-3)" stroke-width="1"/></svg>
                </div>
                <div>
                  <div style="font-weight:500;font-size:13px;">${c.name}</div>
                  <div style="font-size:11px;color:var(--text-3);">${c.domain}</div>
                </div>
              </div>
            </td>
            <td>—</td>
            <td>${c.avgRank} <span class="td-rank-delta down">↓3</span></td>
            <td>${c.r1} <span class="td-rank-delta down">↓3</span></td>
            <td>${c.r23} <span class="td-rank-delta down">↓3</span></td>
            <td>${c.r410} <span class="td-rank-delta up">↑5</span></td>
            <td>${c.r1130} <span class="td-rank-delta up">↑1</span></td>
            <td class="ops">
              <button class="btn-link" onclick="state.compTab='compare';render()">关键词对比</button>
              <button class="btn-link">编辑</button>
              <button class="btn-link" style="color:var(--red);" onclick="if(confirm('确认删除该竞争对手？')){}">删除</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ⑦ 关键词对比 */
function pageKwCompare() {
  return `
  ${compChartsHTML()}
  <div class="panel" style="overflow:hidden;">
    <div class="toolbar">
      <input class="input-search" type="text" placeholder="搜索关键词"/>
      <select><option>竞争对手</option></select>
      <select><option>关键词分组（全部）</option>${DB.groups.map(g=>`<option>${g.name}</option>`).join('')}</select>
      <select><option>最新排名</option></select>
      <button class="btn-default" style="gap:4px;">▼ 高级筛选</button>
      <div class="toolbar-spacer"></div>
      <button class="btn-icon" title="导出">↓</button>
      <button class="btn-icon" title="字段">⋮</button>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border);">
      <div style="display:flex;gap:0;">
        <button class="content-tab" style="border-radius:0;height:28px;font-size:12px;" onclick="state.compTab='competitors';render()">竞争对手 ${DB.competitors.length}</button>
        <button class="content-tab active" style="border-radius:0;height:28px;font-size:12px;" onclick="state.compTab='compare';render()">关键词对比 ${DB.kwCompare.length}</button>
      </div>
      <button class="btn-primary" onclick="openModal('add-comp')">＋ 添加竞争对手</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>关键词 ↕</th>
            <th>平均月搜索量 ↕</th>
            <th>竞争程度 ↕</th>
            <th>CPC ↕</th>
            <th>搜索趋势 ↕</th>
            <th>竞争对手 ↕</th>
            <th>${site().name} ↕</th>
            ${DB.competitors.map(c=>`<th>${c.name} ↕</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${DB.kwCompare.map(k => {
            const trend = k.trend > 0 ? `<span class="up">↑${k.trend}%</span>` : `<span class="down">↓${Math.abs(k.trend)}%</span>`;
            const myRank = k.mine ? `<span class="badge badge-rank1">${k.mine}</span>` : '<span style="color:var(--text-light);">无排名</span>';
            const c1Rank = k.c1 !== null ? `<span class="badge badge-gray">${k.c1}</span>` : `<span style="color:var(--text-light);">&gt;30</span>`;
            const c2Rank = k.c2 !== null
              ? `<span style="background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">${k.c2}</span>`
              : `<span style="color:var(--text-light);">&gt;30</span>`;
            return `<tr>
              <td><span class="td-kw" onclick="openDrawer(1)">${k.kw}</span></td>
              <td>${k.vol}</td><td>${k.comp}</td><td>${k.cpc}</td>
              <td>${trend}</td>
              <td>${DB.competitors.length}</td>
              <td>${myRank}</td><td>${c1Rank}</td><td>${c2Rank}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ⑧ 套餐资源 */
function pagePackage() {
  const pkg = DB.package;
  function resourceItem(label, usedKey, totalKey) {
    const used  = pkg[usedKey]  !== undefined ? pkg[usedKey]  : pkg[usedKey.split('.')[0]][usedKey.split('.')[1]];
    const total = pkg[totalKey] !== undefined ? pkg[totalKey] : pkg[totalKey.split('.')[0]][totalKey.split('.')[1]];
    const remaining = total - used;
    const pct = Math.round(used / total * 100);
    const low = remaining / total < 0.2;
    return `
    <div class="pkg-resource-item">
      <div class="pkg-resource-header">
        <span class="pkg-resource-label">${label}</span>
        <span class="pkg-resource-meta">剩余: ${remaining.toLocaleString()}&emsp;总: ${total.toLocaleString()}</span>
      </div>
      <div class="pkg-bar-wrap"><div class="pkg-bar${low?' warn':''}" style="width:${pct}%;"></div></div>
    </div>`;
  }
  function resourceItemDirect(label, remaining, total) {
    const pct = Math.round((1 - remaining / total) * 100);
    const low = remaining / total < 0.2;
    return `
    <div class="pkg-resource-item">
      <div class="pkg-resource-header">
        <span class="pkg-resource-label">${label}</span>
        <span class="pkg-resource-meta">剩余: ${remaining.toLocaleString()}&emsp;总: ${total.toLocaleString()}</span>
      </div>
      <div class="pkg-bar-wrap"><div class="pkg-bar${low?' warn':''}" style="width:${pct}%;"></div></div>
    </div>`;
  }
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb"><span>设置</span></div>
      <h1>套餐资源</h1>
    </div>
  </div>
  <div class="settings-layout">
    <aside class="settings-sidebar">
      <button class="settings-menu-item ${state.settingsTab==='package'?'active':''}" onclick="state.settingsTab='package';render()">套餐资源</button>
      <button class="settings-menu-item ${state.settingsTab==='site-mgmt'?'active':''}" onclick="state.settingsTab='site-mgmt';render()">网站管理</button>
    </aside>
    <div class="settings-content">
      <!-- Blue gradient banner -->
      <div class="pkg-banner">
        <div class="pkg-plan-row">
          <span class="pkg-plan-name">${pkg.plan}</span>
          <button class="pkg-upgrade-btn">↑ 升级</button>
        </div>
        <div class="pkg-org">${pkg.org}</div>
        <div class="pkg-dates">
          <span>开通时间：${pkg.start}</span>
          <span>到期时间：${pkg.end}</span>
        </div>
      </div>
      <!-- Side-by-side resource panels -->
      <div class="pkg-panels">
        <div class="pkg-panel">
          <div class="pkg-panel-header">
            <span class="pkg-panel-title">常规</span>
            <button type="button" class="btn-link" onclick="state.usageLogType='general';state.usageLogDateFrom='';state.usageLogDateTo='';openModal('usage-log')">变更记录</button>
          </div>
          ${resourceItemDirect('可绑定网站数', pkg.sites.total - pkg.sites.used, pkg.sites.total)}
          ${resourceItemDirect('关键词数量', pkg.keywords.total - pkg.keywords.used, pkg.keywords.total)}
          ${resourceItemDirect('竞争对手数量', pkg.competitors.total - pkg.competitors.used, pkg.competitors.total)}
        </div>
        <div class="pkg-panel">
          <div class="pkg-panel-header">
            <span class="pkg-panel-title">资源</span>
            <button type="button" class="btn-link" onclick="state.usageLogType='crawl';state.usageLogDateFrom='';state.usageLogDateTo='';openModal('usage-log')">变更记录</button>
          </div>
          ${resourceItemDirect('点数', pkg.crawlPoints.total - pkg.crawlPoints.used, pkg.crawlPoints.total)}
        </div>
      </div>
    </div>
  </div>`;
}

/* ⑨ 网站管理 */
function pageSiteManagement() {
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb"><span>设置</span></div>
      <h1>网站管理</h1>
    </div>
    <div class="page-header-actions">
      <button class="btn-primary" onclick="openModal('add-site')">＋ 添加网站</button>
    </div>
  </div>
  <div class="settings-layout">
    <aside class="settings-sidebar">
      <button class="settings-menu-item ${state.settingsTab==='package' ?'active':''}" onclick="state.settingsTab='package';render()">套餐资源</button>
      <button class="settings-menu-item ${state.settingsTab==='site-mgmt'?'active':''}" onclick="state.settingsTab='site-mgmt';render()">网站管理</button>
    </aside>
    <div class="settings-content">
      <div class="panel" style="overflow:hidden;">
        <div class="toolbar"><div class="toolbar-spacer"></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>网站</th><th>关键词数量 ↕</th><th>竞争对手 ↕</th><th>授权</th><th>添加日期 ↕</th><th>操作</th></tr></thead>
            <tbody>
              ${DB.sites.map((s, idx) => {
                const color   = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const initial = s.name[0].toUpperCase();
                const siteAuth = DB.siteAuths.find(a => a.geSiteId === s.id);
                const gscOn = !!(s.hasGSC || s.gscAuthorized);
                const leadOn = !!(siteAuth && /领动/i.test(siteAuth.type || ''));
                let authCell = '';
                if (!leadOn && !gscOn) {
                  authCell = '<span style="font-size:12px;color:var(--text-3);">未授权</span>';
                } else {
                  const bits = [];
                  if (leadOn) bits.push(`<span class="site-auth-chip" title="独立站（领动）已授权"><img src="${LEADONG_INDEPENDENT_SITE_LOGO}" alt="独立站" class="site-auth-chip-img"/></span>`);
                  if (gscOn) bits.push(`<span class="site-auth-chip" title="Google Search Console 已授权"><img src="${GOOGLE_SEARCH_CONSOLE_LOGO}" alt="GSC" class="site-auth-chip-img site-auth-chip-img--gsc"/></span>`);
                  authCell = `<div class="site-auth-chip-row">${bits.join('')}</div>`;
                }
                return `<tr>
                  <td><div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:32px;height:32px;border-radius:var(--r-sm);background:${color};color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${initial}</div>
                    <div><div style="font-weight:600;font-size:13px;">${s.name}</div><div style="font-size:11px;color:var(--text-3);">${s.domain}</div></div>
                  </div></td>
                  <td><a class="td-link" onclick="goMyKeywords();return false;">${s.kws}</a></td>
                  <td><a class="td-link" onclick="goCompetitor();return false;">${s.comps}</a></td>
                  <td style="white-space:nowrap;">${authCell}</td>
                  <td>${s.added}</td>
                  <td class="ops">
                    <button class="btn-link" onclick="state.siteId=${s.id};openModal('site-settings');">设置</button>
                    <button class="btn-link" style="color:var(--red);" onclick="if(confirm('确定删除该网站？删除后历史数据不可恢复。')){}">删除</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

/* ⑩ GEO（占位） */
function pageGeo() {
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>GEO</span></div>
      <h1>GEO 生成引擎优化</h1>
    </div>
  </div>
  <div class="empty-state">
    <div class="empty-icon">🌐</div>
    <div class="empty-text">GEO 模块规划中</div>
    <div class="empty-sub">生成引擎优化（Generative Engine Optimization）功能将在后续版本推出，帮助您在 ChatGPT、Gemini、Perplexity 等 AI 搜索引擎中获得更好的可见度。</div>
  </div>`;
}

/* 管理端占位 */
function pageAdmin() {
  return `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>管理端</span></div>
      <h1>管理端后台</h1>
    </div>
  </div>
  <div class="empty-state">
    <div class="empty-icon">🔧</div>
    <div class="empty-text">服务商管理系统</div>
    <div class="empty-sub">此区域为服务商专属系统，包含订单开通、套餐配置、功能入口管理等能力。</div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   AI 写作模块页面
   ════════════════════════════════════════════════════════════ */

/* ── AI 写作侧边导航 ── */
function writingSidebarNav() {
  const onHistory = state.writingTab === 'history';
  return `
    <button type="button" class="settings-menu-item ${onHistory ? 'active' : ''}" onclick="writingResetFieldErrors();resetBatchArticleFlow();state.writingTab='history';state.workbenchStep='config';render()">文章管理</button>
    <div class="settings-menu-item settings-menu-item-planned" aria-disabled="true">产品管理</div>
    <div class="settings-menu-item settings-menu-item-planned" aria-disabled="true">页面管理</div>`;
}

function wrapWritingLayout(headerHTML, contentHTML) {
  return `
  ${headerHTML}
  <div class="settings-layout">
    <aside class="settings-sidebar">${writingSidebarNav()}</aside>
    <div class="settings-content">${contentHTML}</div>
  </div>`;
}

function isArticleEditorMode() {
  return state.primary === 'writing' && state.writingTab === 'workbench' && state.workbenchStep === 'editor';
}

function saveArticleDraft() {
  const art = DB.articles.find(a => a.id === state.editArticleId);
  const titleEl = $('editorArticleTitle');
  const bodyEl = document.querySelector('.editor-rte-body');
  if (art) {
    if (titleEl) art.title = titleEl.value.trim().slice(0, 150);
    if (bodyEl) art.bodyHtml = bodyEl.innerHTML;
    if (art.status === 'synced') {
      art.status = 'synced';
      art.hasLocalEditPending = true;
    } else {
      art.status = 'draft';
      art.hasLocalEditPending = false;
    }
  }
  toast('草稿已保存');
}

function articleListFiltered() {
  const q = (state.articleListQuery || '').trim().toLowerCase();
  const st = state.articleListStatusFilter;
  const noStatus = st == null || st === '' || st === 'all';
  return DB.articles.filter(a => {
    if (!noStatus && a.status !== st) return false;
    if (!q) return true;
    const t = (a.title || '').toLowerCase();
    return t.includes(q);
  });
}

function articleListPagedSlice() {
  const all = articleListFiltered();
  const size = Math.min(100, Math.max(20, state.articleListPageSize || 20));
  const totalPages = Math.max(1, Math.ceil(all.length / size));
  const page = Math.min(Math.max(1, state.articleListPage || 1), totalPages);
  const start = (page - 1) * size;
  return { rows: all.slice(start, start + size), total: all.length, page, totalPages, pageSize: size };
}

function articleListIsSelected(id) {
  return (state.articleListSelectedIds || []).includes(id);
}

function articleListToggleRow(id, checked) {
  const set = new Set(state.articleListSelectedIds || []);
  if (checked) set.add(id);
  else set.delete(id);
  state.articleListSelectedIds = [...set];
  render();
}

function articleListToggleAllOnPage(checked) {
  const { rows } = articleListPagedSlice();
  const set = new Set(state.articleListSelectedIds || []);
  rows.forEach(a => {
    if (checked) set.add(a.id);
    else set.delete(a.id);
  });
  state.articleListSelectedIds = [...set];
  render();
}

function openArticleDeleteModal(ids) {
  const arr = (ids || []).filter(id => id != null);
  if (!arr.length) return;
  const blocked = arr.filter(id => {
    const a = DB.articles.find(x => x.id === id);
    return a && a.status === 'generating';
  });
  if (blocked.length) {
    toast('所选条目中包含「生成中」的文章，请待生成完成后再删除。', 'error');
    return;
  }
  state.articleDeleteConfirmIds = arr.slice();
  openModal('article-delete-confirm');
}

function confirmArticleDeleteExec() {
  const ids = state.articleDeleteConfirmIds || [];
  if (!ids.length) {
    closeModal();
    return;
  }
  const n = ids.length;
  DB.articles = DB.articles.filter(a => !ids.includes(a.id));
  state.articleListSelectedIds = (state.articleListSelectedIds || []).filter(x => !ids.includes(x));
  if (state.editArticleId && ids.includes(state.editArticleId)) state.editArticleId = null;
  const { totalPages } = articleListPagedSlice();
  if ((state.articleListPage || 1) > totalPages) state.articleListPage = Math.max(1, totalPages);
  closeModal();
  toast(n > 1 ? '已批量删除' : '已删除');
  render();
}

function articleListBatchDelete() {
  const ids = state.articleListSelectedIds || [];
  if (!ids.length) {
    toast('请先勾选要删除的文章', 'error');
    return;
  }
  const hasGen = ids.some(id => {
    const a = DB.articles.find(x => x.id === id);
    return a && a.status === 'generating';
  });
  if (hasGen) {
    toast('所选条目中包含「生成中」的文章，请取消勾选该类文章后再批量删除。', 'error');
    return;
  }
  openArticleDeleteModal(ids);
}

function deleteArticleRow(id) {
  openArticleDeleteModal([id]);
}

function setArticleListSearch(q) {
  state.articleListQuery = q;
  state.articleListPage = 1;
  state.articleListSelectedIds = [];
  render();
}

function setArticleListStatusFilter(v) {
  state.articleListStatusFilter = v;
  state.articleListPage = 1;
  state.articleListSelectedIds = [];
  render();
}

function articleListRowsForExport() {
  const all = articleListFiltered();
  const sel = state.articleListSelectedIds || [];
  if (sel.length) return all.filter(a => sel.includes(a.id));
  return all;
}

function csvEscapeCell(val) {
  const s = String(val == null ? '' : val);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function safeArticleExportFileName(title) {
  const raw = String(title || '未命名文章').replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80);
  return raw || 'article';
}

function buildArticleExportHtmlDoc(art) {
  const title = escapeHtmlStr(art.title || '未命名');
  const body = art.bodyHtml
    ? String(art.bodyHtml)
    : '<p style="color:#64748b;">（无正文）</p>';
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
</head>
<body>
<h1>${title}</h1>
${body}
</body>
</html>`;
}

async function articleListExportZip() {
  if (typeof JSZip === 'undefined') {
    toast('导出组件未加载，请检查网络后重试', 'error');
    return;
  }
  const rows = articleListRowsForExport();
  if (!rows.length) {
    toast('当前没有可导出的文章', 'error');
    return;
  }
  const zip = new JSZip();
  const folder = zip.folder('articles_html');
  const usedHtmlNames = new Set();
  const headers = ['文章标题', '字数', '状态', '文章URL', '排名', '创建时间'];
  const lines = [headers.map(csvEscapeCell).join(',')];
  rows.forEach(a => {
    const rankData = DB.urlRankDetails[a.id];
    const best = rankData && rankData.best != null ? String(rankData.best) : '';
    const stLabel = a.status === 'draft' ? '草稿' : a.status === 'synced' ? '已同步' : a.status === 'generating' ? '生成中' : a.status;
    lines.push([
      csvEscapeCell(a.title),
      csvEscapeCell(articleDisplayWords(a) > 0 ? articleDisplayWords(a).toLocaleString() : ''),
      csvEscapeCell(stLabel),
      csvEscapeCell(a.url),
      csvEscapeCell(best),
      csvEscapeCell(a.createdAt),
    ].join(','));
    const base = safeArticleExportFileName(a.title);
    let fn = `${base}.html`;
    let dup = 2;
    while (usedHtmlNames.has(fn)) {
      fn = `${base}_${dup}.html`;
      dup += 1;
    }
    usedHtmlNames.add(fn);
    folder.file(fn, buildArticleExportHtmlDoc(a));
  });
  zip.file('文章导出清单.csv', '\uFEFF' + lines.join('\r\n'));
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `文章导出_${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`已导出 ${rows.length} 篇文章（ZIP）`);
  } catch (e) {
    toast('导出失败，请重试', 'error');
  }
}

function setArticleListPageSize(n) {
  state.articleListPageSize = n;
  state.articleListPage = 1;
  render();
}

function setArticleListPage(n) {
  state.articleListPage = n;
  render();
}

function syncArticleListSelectAll() {
  const selAll = $('articleListSelectAll');
  if (!selAll) return;
  const { rows } = articleListPagedSlice();
  const n = rows.filter(a => articleListIsSelected(a.id)).length;
  selAll.checked = rows.length > 0 && n === rows.length;
  selAll.indeterminate = n > 0 && n < rows.length;
}

function writingErrorsHtml(field) {
  const e = (state.writingFieldErrors && state.writingFieldErrors[field]) || '';
  if (!e) return '';
  return `<div class="form-error" role="alert">${escapeHtmlStr(e)}</div>`;
}

function clearWritingFieldError(field) {
  if (!state.writingFieldErrors) return;
  state.writingFieldErrors[field] = '';
}

function writingResetFieldErrors() {
  state.writingFieldErrors = { title: '', keyword: '', relatedKws: '', internalLinks: '', points: '' };
}

function escapeHtmlStr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normHostKey(host) {
  return String(host).toLowerCase().replace(/^www\./, '');
}

/** 批量导入 / 写作表单：校验内链 URL 列表（格式与条数上限；不要求与当前站点域名一致） */
function validateInternalUrlsFormatList(urls) {
  const list = (urls || []).map(s => String(s).trim()).filter(Boolean);
  if (!list.length) return '';
  if (list.length > MAX_INTERNAL_LINK_LINES_FIELD) {
    return `内链 URL 最多 ${MAX_INTERNAL_LINK_LINES_FIELD} 条`;
  }
  const fmtErr = idx =>
    `第 ${idx + 1} 条内链格式无效，请输入有效的完整 URL（建议以 https:// 开头）。`;
  for (let idx = 0; idx < list.length; idx++) {
    let s = list[idx];
    let u;
    try {
      if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
      u = new URL(s);
    } catch {
      return fmtErr(idx);
    }
    if (!u.hostname) return fmtErr(idx);
  }
  return '';
}

/** 文章列表「字数」：与功能逻辑说明一致——CJK 逐字；拉丁连续字母为 1 词；连续数字为 1 串；空格与标点各计 1 */
function articleHtmlToPlainText(html) {
  const div = document.createElement('div');
  div.innerHTML = String(html || '');
  return (div.textContent || '').replace(/\u200b/g, '');
}

function countArticleDisplayWords(plain) {
  const s = String(plain || '');
  let i = 0;
  let n = 0;
  const isLatin = c => /[A-Za-z]/.test(c);
  const isCJK = c => /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af]/.test(c);
  while (i < s.length) {
    const c = s[i];
    if (isLatin(c)) {
      while (i < s.length && isLatin(s[i])) i += 1;
      n += 1;
      continue;
    }
    if (isCJK(c)) {
      n += 1;
      i += 1;
      continue;
    }
    i += 1;
  }
  return n;
}

function articleDisplayWords(art) {
  if (art && art.bodyHtml) {
    const c = countArticleDisplayWords(articleHtmlToPlainText(art.bodyHtml));
    if (c > 0) return c;
  }
  return art && art.words ? art.words : 0;
}

function addWritingRelatedKw(ev) {
  if (ev.key !== 'Enter') return;
  const el = ev.target;
  if (!el || !el.value) return;
  ev.preventDefault();
  saveTitleBeforeModal();
  const v = el.value.trim().slice(0, 100);
  if (!v) return;
  const arr = state.writingForm.relatedKws || [];
  if (arr.length >= MAX_REL_KEYWORDS_FIELD) {
    state.writingFieldErrors.relatedKws = `相关关键词最多添加 ${MAX_REL_KEYWORDS_FIELD} 个`;
    render();
    return;
  }
  if (!arr.includes(v)) {
    clearWritingFieldError('relatedKws');
    state.writingForm.relatedKws = [...arr, v];
  }
  el.value = '';
  render();
}

function relatedKwPickToggle(checkbox, encodedKw) {
  saveTitleBeforeModal();
  let kw;
  try {
    kw = decodeURIComponent(encodedKw).trim().slice(0, 100);
  } catch {
    return;
  }
  const arr = state.writingForm.relatedKws || [];
  if (checkbox.checked) {
    if (arr.length >= MAX_REL_KEYWORDS_FIELD) {
      checkbox.checked = false;
      state.writingFieldErrors.relatedKws = `相关关键词最多选择 ${MAX_REL_KEYWORDS_FIELD} 个`;
      render();
      renderModal();
      return;
    }
    clearWritingFieldError('relatedKws');
    if (!arr.includes(kw)) state.writingForm.relatedKws = [...arr, kw];
  } else {
    state.writingForm.relatedKws = arr.filter(k => k !== kw);
  }
}

/* ── 产研：近期改动页面（功能逻辑说明入口与抽屉内跳转） ── */
const LOGIC_SPEC_SHEET_URL = 'https://doc.weixin.qq.com/sheet/e3_ACIACgbkAL8CNQlK4J88yRJ6SRZ89?scode=ADEAhgd4AAg02zkiNGAHUAbAYSAL8&tab=mxiezk';
/** 与 index.html 同目录，供「常规检测」逻辑说明引用 */
const LOGIC_ONPAGE_DIAG_SPEC_URL = 'SEO测评维度.html';

/** 仅在说明 AI 提示词、测评维度时于句末追加 */
function logicHelpSpecDocRef() {
  return `（详见<a href="${LOGIC_SPEC_SHEET_URL}" target="_blank" rel="noopener noreferrer">SEO / AI 规范表</a>）`;
}

/** 常规检测规则与字段细则（本地规范页） */
function logicHelpOnPageDiagSpecRef() {
  return `（详见<a href="${LOGIC_ONPAGE_DIAG_SPEC_URL}" target="_blank" rel="noopener noreferrer">SEO测评维度</a>）`;
}

/** 本期交付范围（功能逻辑说明与可跳转页面） */
const RELEASE_SCOPE = {
  primary: new Set(['dashboard', 'search', 'settings']),
  searchSecondary: new Set(['page-rank-list', 'page-seo']),
  dashboardTab: new Set(['overview']),
};

function enforceReleaseScopeRoute() {
  if (!RELEASE_SCOPE.primary.has(state.primary)) {
    state.primary = 'dashboard';
    state.dashboardTab = 'overview';
  }
  if (state.primary === 'dashboard' && !RELEASE_SCOPE.dashboardTab.has(state.dashboardTab)) {
    state.dashboardTab = 'overview';
  }
  if (state.dashboardTab === 'tasks') state.dashboardTab = 'overview';
  if (state.primary === 'search' && !RELEASE_SCOPE.searchSecondary.has(state.secondary)) {
    state.secondary = 'page-seo';
  }
}

function settingsMenuItemHTML(label, active, onclick, enabled) {
  if (enabled === false) {
    return `<div class="settings-menu-item settings-menu-item-planned" aria-disabled="true" title="本期不涉及">${escapeHtmlStr(label)}</div>`;
  }
  return `<button type="button" class="settings-menu-item${active ? ' active' : ''}" onclick="${onclick}">${escapeHtmlStr(label)}</button>`;
}

const LOGIC_DRAWER_ACTIVE_DEFS = [
  {
    id: 'dashboard-overview',
    label: '仪表盘 · 网站概览',
    navSection: '仪表盘',
    navLabel: '网站概览',
    navSort: 10,
    match() {
      return state.primary === 'dashboard' && state.dashboardTab === 'overview';
    },
    navigate() {
      state.primary = 'dashboard';
      state.dashboardTab = 'overview';
    },
  },
  {
    id: 'search-page-rank-list',
    label: '搜索 · 曝光页面',
    navSection: '搜索',
    navLabel: '曝光页面',
    navSort: 20,
    match() {
      return state.primary === 'search' && state.secondary === 'page-rank-list';
    },
    navigate() {
      state.primary = 'search';
      state.secondary = 'page-rank-list';
    },
  },
  {
    id: 'search-page-seo',
    label: '搜索 · 页面整合优化',
    navSection: '搜索',
    navLabel: '页面整合优化',
    navSort: 21,
    match() {
      return state.primary === 'search' && state.secondary === 'page-seo';
    },
    navigate() {
      state.primary = 'search';
      state.secondary = 'page-seo';
    },
  },
  {
    id: 'settings-package-points',
    label: '设置 · 点数变更记录',
    navSection: '设置',
    navLabel: '点数变更记录',
    navSort: 30,
    match() {
      return state.primary === 'settings' && state.settingsTab === 'package'
        || (state.modal === 'usage-log' && state.usageLogType !== 'general');
    },
    navigate() {
      state.primary = 'settings';
      state.settingsTab = 'package';
      state.usageLogType = 'crawl';
      state.usageLogDateFrom = '';
      state.usageLogDateTo = '';
      render();
      openModal('usage-log');
    },
  },
  {
    id: 'settings-auth-gsc',
    label: '设置 · 授权管理（GSC）',
    navSection: '设置',
    navLabel: '授权管理',
    navSort: 31,
    match() {
      return state.modal === 'site-settings' && state.settingsSub === 'auth';
    },
    navigate() {
      state.primary = 'settings';
      state.settingsTab = 'site-mgmt';
      if (!state.siteId && DB.sites[0]) state.siteId = DB.sites[0].id;
      state.settingsSub = 'auth';
      render();
      openModal('site-settings');
    },
  },
];

const LOGIC_CHANGE_PAGE_DEFS = LOGIC_DRAWER_ACTIVE_DEFS;

/** 页面整合优化 · 页面详情抽屉各页签（三级目录；列表逻辑在二级「页面整合优化」） */
const LOGIC_DRAWER_PAGE_SEO_CHILDREN = [
  { id: 'search-page-seo--drawer', navLabel: '页面详情（顶栏）', navSort: 211 },
  { id: 'search-page-seo--diag', navLabel: '常规检测', navSort: 212 },
  { id: 'search-page-seo--ai', navLabel: 'AI 测评', navSort: 213 },
  { id: 'search-page-seo--kw', navLabel: '关键词', navSort: 214 },
  { id: 'search-page-seo--tdk', navLabel: 'TDK', navSort: 215 },
  { id: 'search-page-seo--schema', navLabel: '结构化数据', navSort: 216 },
];

const LOGIC_DRAWER_PAGE_SEO_CHILD_IDS = new Set(LOGIC_DRAWER_PAGE_SEO_CHILDREN.map(c => c.id));

function isLogicDrawerPageSeoChildId(pageId) {
  return LOGIC_DRAWER_PAGE_SEO_CHILD_IDS.has(pageId);
}

function dismissModalForLogicDrawerNav() {
  if (!state.modal) return;
  closeModal();
}

function getCurrentLogicChangePageId() {
  const d = LOGIC_CHANGE_PAGE_DEFS.find(x => x.match());
  return d ? d.id : null;
}

function getCurrentLogicDrawerNavId() {
  if (state.logicDrawerTreeSelection) return state.logicDrawerTreeSelection;
  return getCurrentLogicChangePageId();
}

function navigateLogicChangePage(pageId) {
  state.devInternalPage = null;
  dismissModalForLogicDrawerNav();

  if (pageId === 'provider-feature-enable') {
    state.logicDrawerTreeSelection = pageId;
    render();
    return;
  }

  if (pageId === 'search-page-seo' || isLogicDrawerPageSeoChildId(pageId)) {
    state.logicDrawerTreeSelection = isLogicDrawerPageSeoChildId(pageId) ? pageId : 'search-page-seo';
    state.primary = 'search';
    state.secondary = 'page-seo';
    render();
    return;
  }

  const d = LOGIC_DRAWER_ACTIVE_DEFS.find(x => x.id === pageId);
  if (!d) return;
  state.logicDrawerTreeSelection = pageId;
  d.navigate();
}

function closeDevInternalPage() {
  state.devInternalPage = null;
  render();
}

function openDevResellerOrderDemoFromLogic() {
  closeLogicDrawer();
  state.logicDrawerTreeSelection = null;
  state.devInternalPage = 'reseller-order';
  render();
}

function logicResellerOrderDemoHTML() {
  return `
  <div class="logic-reseller-demo" aria-label="服务商订购界面（示例）">
    <div class="logic-reseller-demo__crumb">服务管理 <span class="logic-reseller-demo__crumb-sep">›</span> 独立功能 <span class="logic-reseller-demo__crumb-sep">›</span> 增长引擎 <span class="logic-reseller-demo__crumb-sep">›</span> 下单开通</div>
    <div class="logic-reseller-demo__title-row">
      <h3 class="logic-reseller-demo__h">增长引擎 · 独立功能订购</h3>
      <span class="logic-reseller-demo__badge">示例</span>
    </div>
    <p class="logic-reseller-demo__sub">以下为服务商侧订购能力示意，实际字段名称与页面布局以您所使用的系统为准。</p>

    <div class="logic-reseller-demo__card">
      <div class="logic-reseller-demo__card-h">客户与站点</div>
      <div class="logic-reseller-demo__grid2">
        <label class="logic-reseller-demo__field"><span>客户名称</span><input type="text" readonly value="示例科技有限公司"/></label>
        <label class="logic-reseller-demo__field"><span>站点域名</span><input type="text" readonly value="www.leadong.com"/></label>
      </div>
    </div>

    <div class="logic-reseller-demo__card logic-reseller-demo__card--accent">
      <div class="logic-reseller-demo__card-h">产品功能 <span class="logic-reseller-demo__hint">（勾选后对客户站点生效）</span></div>
      <ul class="logic-reseller-demo__feat-list">
        <li><label><input type="checkbox" checked disabled/> 网站总览与数据看板</label></li>
        <li><label><input type="checkbox" checked disabled/> 关键词管理（列表、分组、排名监控）</label></li>
        <li><label><input type="checkbox" checked disabled/> 关键词探索</label></li>
        <li><label><input type="checkbox" checked disabled/> 关键词排名抓取</label></li>
        <li><label><input type="checkbox" checked disabled/> 竞争对手分析</label></li>
        <li class="logic-reseller-demo__feat-ai"><label><input type="checkbox" checked/> <strong>页面整合优化</strong> <span class="logic-reseller-demo__new-tag">新增</span></label>
          <p class="logic-reseller-demo__feat-desc">开通后，客户侧展示<strong>搜索 › 页面整合优化</strong>入口及单页检测、AI 测评、TDK/结构化数据等能力；未勾选则隐藏或不可用对应入口。</p>
        </li>
        <li class="logic-reseller-demo__feat-ai"><label><input type="checkbox" checked/> <strong>AI 文章</strong></label>
          <p class="logic-reseller-demo__feat-desc">开通后，客户「增长引擎」内展示<strong>内容</strong>模块、关键词行内<strong>生成文章</strong>入口，并可使用 AI 推荐与文章管理能力。</p>
        </li>
      </ul>
    </div>

    <div class="logic-reseller-demo__card">
      <div class="logic-reseller-demo__card-h">计费与周期（示意）</div>
      <div class="logic-reseller-demo__grid2">
        <label class="logic-reseller-demo__field"><span>订购时长</span><select disabled><option>12 个月</option></select></label>
        <label class="logic-reseller-demo__field"><span>订单金额（含税）</span><input type="text" readonly value="¥ 0.00（示例）"/></label>
      </div>
    </div>

    <div class="logic-reseller-demo__actions">
      <button type="button" class="btn-default logic-reseller-demo__btn" disabled>取消</button>
      <button type="button" class="btn-primary logic-reseller-demo__btn" disabled>提交订单</button>
    </div>
  </div>`;
}

function getLogicHelpResellerFeatureOpenHTML() {
  return `<p class="logic-help-p"><strong>功能开通（产品变更）</strong><br/>在现有<strong>增长引擎功能开通</strong>界面中，于<strong>「产品功能」</strong>模块下增加可勾选项「<strong>AI 文章</strong>」：勾选后对客户站点开通 AI 文章相关能力；未勾选则客户侧隐藏或不可用对应入口（细则以合同/配置为准）。</p>`;
}

function pageDevResellerOrder() {
  return `
  <div class="dev-reseller-order-page">
    <header class="dev-reseller-order-header">
      <button type="button" class="btn-default" onclick="closeDevInternalPage()">返回产品主页</button>
        <div class="dev-reseller-order-caption">
        <strong>服务商订购示意</strong>（面向服务商伙伴）：与使用说明中「4.1 功能开通」为同一场景示意；字段与流程以实际上线为准，下方可叠放对照截图。
      </div>
    </header>
    <div class="dev-reseller-order-body dev-reseller-order-body--stack">
      ${logicResellerOrderDemoHTML()}
      <div class="dev-reseller-order-shot">
        <div class="dev-reseller-order-shot-label">对照截图（可选）</div>
        <img class="dev-reseller-order-img" src="AI文章生成/功能开通/下单.png" alt="服务商系统内增长引擎独立功能下单界面"
          onerror="this.style.display='none';var fb=this.nextElementSibling;if(fb)fb.style.display='flex';"/>
        <div class="dev-reseller-order-fallback" style="display:none;">
          <p>未找到示意图文件（路径：<strong>AI文章生成/功能开通/下单.png</strong>）。可将真实截图放入该路径以便对照。</p>
        </div>
      </div>
    </div>
  </div>`;
}

function logicDrawerApplySavedWidth() {
  const panel = $('logicDrawerPanel');
  if (!panel) return;
  let w = Math.round(window.innerWidth * 0.5);
  try {
    const saved = sessionStorage.getItem('logicDrawerWidth');
    if (saved) {
      const n = parseInt(saved, 10);
      if (!Number.isNaN(n)) w = n;
    }
  } catch (e) {}
  w = Math.min(Math.max(w, 340), window.innerWidth - 48);
  panel.style.width = `${w}px`;
}

function buildLogicDrawerTreeNodes() {
  const sorted = LOGIC_DRAWER_ACTIVE_DEFS.slice().sort((a, b) => (a.navSort || 0) - (b.navSort || 0));
  const nodes = [];
  let lastSec = null;
  let secNo = 0;
  let itemNo = 0;
  let seoChildNo = 0;
  sorted.forEach(d => {
    if (d.navSection !== lastSec) {
      lastSec = d.navSection;
      secNo += 1;
      itemNo = 0;
      seoChildNo = 0;
      nodes.push({ type: 'head', text: d.navSection, num: String(secNo) });
    }
    if (d.id === 'search-page-seo') {
      itemNo += 1;
      const parentNum = `${secNo}.${itemNo}`;
      nodes.push({ type: 'page', def: d, depth: 2, num: parentNum });
      LOGIC_DRAWER_PAGE_SEO_CHILDREN.forEach(c => {
        seoChildNo += 1;
        nodes.push({ type: 'page', def: c, depth: 3, num: `${parentNum}.${seoChildNo}` });
      });
      return;
    }
    itemNo += 1;
    nodes.push({ type: 'page', def: d, depth: 2, num: `${secNo}.${itemNo}` });
  });
  const providerSec = secNo + 1;
  nodes.push({ type: 'head', text: '服务商系统', num: String(providerSec) });
  nodes.push({
    type: 'page',
    def: { id: 'provider-feature-enable', navLabel: '功能开通' },
    depth: 2,
    num: `${providerSec}.1`,
  });
  return nodes;
}

function logicDrawerTreeItemLabelHTML(num, label) {
  return `<span class="logic-drawer-tree-num" aria-hidden="true">${escapeHtmlStr(num)}</span><span class="logic-drawer-tree-lbl">${escapeHtmlStr(label)}</span>`;
}

function populateLogicDrawerSideNav() {
  const tree = $('logicDrawerTree');
  if (!tree) return;
  const cur = getCurrentLogicDrawerNavId();
  tree.innerHTML = buildLogicDrawerTreeNodes().map(node => {
    if (node.type === 'head') {
      return `<div class="logic-drawer-tree-section" role="presentation"><span class="logic-drawer-tree-num" aria-hidden="true">${escapeHtmlStr(node.num)}</span>${escapeHtmlStr(node.text)}</div>`;
    }
    const d = node.def;
    const label = d.navLabel || (d.label || '').replace(/^.+·\s*/, '');
    const active = cur === d.id
      || (d.id === 'search-page-seo' && isLogicDrawerPageSeoChildId(cur));
    const depthCls = node.depth === 3 ? ' logic-drawer-tree-item--depth3' : ' logic-drawer-tree-item--nested';
    return `<button type="button" class="logic-drawer-tree-item${depthCls}${active ? ' logic-drawer-tree-item--active' : ''}" data-page-id="${escapeAttr(d.id)}" role="treeitem" aria-selected="${active ? 'true' : 'false'}">${logicDrawerTreeItemLabelHTML(node.num, label)}</button>`;
  }).join('');
}


function refreshLogicDrawerIfOpen() {
  const ov = $('logicDrawerOverlay');
  const body = $('logicDrawerBody');
  if (!ov || !body || !ov.classList.contains('open')) return;
  body.innerHTML = `<div class="logic-help-body">${getLogicHelpHTML()}</div>`;
  populateLogicDrawerSideNav();
}

function bindLogicDrawerResize() {
  const panel = $('logicDrawerPanel');
  const handle = $('logicDrawerResize');
  if (!panel || !handle || handle.dataset.resizeBound) return;
  handle.dataset.resizeBound = '1';
  handle.addEventListener('mousedown', ev => {
    ev.preventDefault();
    const startX = ev.clientX;
    const startW = panel.offsetWidth;
    panel.style.transition = 'none';
    const onMove = ev2 => {
      const dx = startX - ev2.clientX;
      let nw = Math.min(Math.max(startW + dx, 280), window.innerWidth - 48);
      panel.style.width = `${nw}px`;
    };
    const onUp = () => {
      panel.style.transition = '';
      try {
        sessionStorage.setItem('logicDrawerWidth', String(panel.offsetWidth));
      } catch (e) {}
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function setArticleEditorViewport(mode) {
  if (!['pc', 'tablet', 'mobile'].includes(mode)) return;
  state.articleEditorViewport = mode;
  const layout = document.querySelector('.article-editor-layout');
  if (layout) {
    layout.classList.remove('editor-viewport-pc', 'editor-viewport-tablet', 'editor-viewport-mobile');
    layout.classList.add(`editor-viewport-${mode}`);
  }
  document.querySelectorAll('.article-editor-subtoolbar .editor-viewport-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-viewport') === mode);
  });
}

function editorUndo() {
  const el = document.querySelector('.editor-rte-body');
  if (!el) return;
  el.focus();
  try {
    document.execCommand('undo', false, null);
  } catch (e) {
    toast('当前环境不支持撤销', 'error');
  }
}

function editorRedo() {
  const el = document.querySelector('.editor-rte-body');
  if (!el) return;
  el.focus();
  try {
    document.execCommand('redo', false, null);
  } catch (e) {
    toast('当前环境不支持重做', 'error');
  }
}

function editorExportHtml() {
  const el = document.querySelector('.editor-rte-body');
  if (!el) return;
  const inner = el.innerHTML;
  const art = DB.articles.find(a => a.id === state.editArticleId);
  const rawTitle = (art && art.title) ? art.title : 'article-export';
  const safeFile = rawTitle.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim() || 'article-export';
  const pageTitle = escapeHtmlStr(rawTitle);
  const doc = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
</head>
<body>
${inner}
</body>
</html>`;
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${safeFile}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('已导出为 HTML 文件');
}

function editorRteHideFloat() {
  const fl = $('editorRteFloat');
  if (fl) {
    fl.style.display = 'none';
    fl.innerHTML = '';
    fl.dataset.mode = '';
  }
}

function editorRteExec(cmd, val) {
  const body = document.querySelector('.editor-rte-body');
  if (!body) return;
  body.focus();
  try {
    document.execCommand(cmd, false, val || null);
  } catch (e) {}
  editorRteHideFloat();
}

function editorRteInsertBlock(tag) {
  const body = document.querySelector('.editor-rte-body');
  if (!body) return;
  body.focus();
  const t = (tag || 'p').toLowerCase();
  if (['p', 'h2', 'h3', 'blockquote'].includes(t)) {
    try {
      document.execCommand('formatBlock', false, `<${t}>`);
    } catch (e) {
      try {
        document.execCommand('formatBlock', false, t);
      } catch (e2) {}
    }
  } else if (t === 'ul') {
    document.execCommand('insertUnorderedList', false, null);
  } else if (t === 'ol') {
    document.execCommand('insertOrderedList', false, null);
  } else if (t === 'hr') {
    document.execCommand('insertHorizontalRule', false, null);
  }
  editorRteHideFloat();
}

function editorRteLinkPrompt() {
  const u = window.prompt('链接 URL', 'https://');
  if (u) editorRteExec('createLink', u);
  else editorRteHideFloat();
}

function editorRteInsertImageDemo() {
  const u = window.prompt('图片地址（示例）', 'https://');
  if (u) editorRteExec('insertImage', u);
  else editorRteHideFloat();
}

function editorRteInsertTableDemo() {
  const body = document.querySelector('.editor-rte-body');
  if (!body) return;
  body.focus();
  const html = '<table class="editor-demo-table" border="1" style="border-collapse:collapse;width:100%;max-width:560px;"><tr><td style="padding:8px;"> </td><td style="padding:8px;"> </td></tr><tr><td style="padding:8px;"> </td><td style="padding:8px;"> </td></tr></table><p><br></p>';
  try {
    document.execCommand('insertHTML', false, html);
  } catch (e) {}
  editorRteHideFloat();
}

function initArticleEditor() {
  const body = document.querySelector('.editor-rte-body');
  const list = document.getElementById('editorOutlineList');
  const wrap = document.querySelector('.editor-rte-body-wrap');
  if (!body || !list || !wrap) return;

  function updateWordCount() {
    const wc = $('editorRteWordcount');
    if (!wc) return;
    const t = (body.innerText || '').trim();
    const n = t ? t.split(/\s+/).filter(Boolean).length : 0;
    wc.textContent = `约 ${n.toLocaleString()} 词`;
  }

  function blockFromNode(n) {
    let el = n.nodeType === 3 ? n.parentElement : n;
    while (el && el !== body) {
      const tag = el.tagName;
      if (/^(P|H1|H2|H3|H4|H5|H6|LI|BLOCKQUOTE|DIV|FIGURE|TABLE)$/i.test(tag)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function isEmptyishBlock(el) {
    if (!el) return false;
    const tag = el.tagName.toUpperCase();
    if (!/^(P|DIV|LI)$/i.test(tag)) return false;
    const t = (el.textContent || '').replace(/\u200b/g, '').replace(/\n/g, '').trim();
    if (t.length) return false;
    return true;
  }

  function floatHtmlAdd() {
    return `
    <div class="editor-float-card" role="menu">
      <div class="editor-float-title">添加组件</div>
      <div class="editor-float-grid">
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('p')">正文</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('h2')">小标题</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('h3')">副标题</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('ul')">无序列表</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('ol')">有序列表</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertImageDemo()">图片</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertTableDemo()">表格</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('blockquote')">引用</button>
        <button type="button" class="editor-float-tile" onclick="editorRteInsertBlock('hr')">分割线</button>
      </div>
    </div>`;
  }

  function floatHtmlStyle() {
    return `
    <div class="editor-float-card editor-float-card--style" role="toolbar" aria-label="文本样式">
      <div class="editor-float-title">样式</div>
      <div class="editor-float-style-row">
        <button type="button" class="editor-rte-btn" onclick="editorRteExec('bold')" title="加粗"><strong>B</strong></button>
        <button type="button" class="editor-rte-btn" onclick="editorRteExec('italic')" title="斜体"><em>I</em></button>
        <button type="button" class="editor-rte-btn" onclick="editorRteExec('underline')" title="下划线"><u>U</u></button>
        <button type="button" class="editor-rte-btn" onclick="editorRteExec('strikeThrough')" title="删除线"><s>S</s></button>
      </div>
      <div class="editor-float-style-row">
        <button type="button" class="editor-rte-btn editor-rte-btn-text" onclick="editorRteExec('justifyLeft')" title="左对齐">左</button>
        <button type="button" class="editor-rte-btn editor-rte-btn-text" onclick="editorRteExec('justifyCenter')" title="居中">中</button>
        <button type="button" class="editor-rte-btn" onclick="editorRteExec('insertUnorderedList')" title="无序列表">•</button>
        <button type="button" class="editor-rte-btn" onclick="editorRteExec('insertOrderedList')" title="有序列表">1.</button>
        <button type="button" class="editor-rte-btn" onclick="editorRteLinkPrompt()" title="链接">🔗</button>
      </div>
    </div>`;
  }

  function positionFloat(el, range) {
    const wr = wrap.getBoundingClientRect();
    let r;
    try {
      r = range.getBoundingClientRect();
    } catch (e) {
      r = { left: wr.left, bottom: wr.top + 40, width: 0 };
    }
    const top = Math.max(8, r.bottom - wr.top + wrap.scrollTop + 4);
    const maxLeft = wrap.clientWidth - Math.min(320, wrap.clientWidth - 16);
    const left = Math.max(8, Math.min(r.left - wr.left + wrap.scrollLeft, maxLeft));
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  }

  function onBodyInteraction() {
    clearTimeout(body._floatT);
    body._floatT = setTimeout(() => {
      const fl = $('editorRteFloat');
      if (!fl) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !sel.anchorNode || !body.contains(sel.anchorNode)) return;
      const range = sel.getRangeAt(0);
      const collapsed = sel.isCollapsed;
      const blk = blockFromNode(sel.anchorNode);
      const emptyLine = collapsed && isEmptyishBlock(blk);
      const showStyle = !collapsed || (blk && !emptyLine && (blk.textContent || '').trim().length > 0);
      if (emptyLine) {
        fl.dataset.mode = 'add';
        fl.innerHTML = floatHtmlAdd();
        fl.style.display = 'block';
        positionFloat(fl, range);
      } else if (showStyle) {
        fl.dataset.mode = 'style';
        fl.innerHTML = floatHtmlStyle();
        fl.style.display = 'block';
        positionFloat(fl, range);
      } else {
        editorRteHideFloat();
      }
    }, 10);
  }

  if (!window._editorRteFloatDocBound) {
    window._editorRteFloatDocBound = true;
    document.addEventListener('mousedown', ev => {
      const fl = $('editorRteFloat');
      if (!fl || fl.style.display === 'none') return;
      const bd = document.querySelector('.editor-rte-body');
      if (fl.contains(ev.target) || (bd && bd.contains(ev.target))) return;
      editorRteHideFloat();
    });
  }

  if (!body.dataset.rteFloatBound) {
    body.dataset.rteFloatBound = '1';
    ['mouseup', 'keyup'].forEach(evt => body.addEventListener(evt, onBodyInteraction));
  }

  function syncOutline() {
    const headings = body.querySelectorAll('h2, h3, h4, h5, h6');
    if (!headings.length) {
      list.innerHTML = '<div class="editor-outline-empty">暂无标题结构<br/><span class="editor-outline-hint">在正文中使用 H2–H6 标题即可生成大纲（文章标题在上方单独填写）</span></div>';
      return;
    }
    list.innerHTML = '';
    headings.forEach((el, i) => {
      if (!el.id) el.id = `ed-h-${state.editArticleId || 'x'}-${i}`;
      const level = parseInt(el.tagName.slice(1), 10);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `editor-outline-item editor-outline-h${level}`;
      const text = (el.textContent || '').trim();
      btn.textContent = text || '(空标题)';
      btn.title = text;
      btn.addEventListener('click', () => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const sel = window.getSelection();
        const r = document.createRange();
        r.selectNodeContents(el);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      });
      list.appendChild(btn);
    });
  }

  syncOutline();
  updateWordCount();
  const onChange = () => {
    clearTimeout(body._outlineT);
    body._outlineT = setTimeout(() => {
      syncOutline();
      updateWordCount();
    }, 120);
  };
  body.addEventListener('input', () => {
    onChange();
    editorRteHideFloat();
  });
  const mo = new MutationObserver(onChange);
  mo.observe(body, { childList: true, subtree: true, characterData: true });
}

/* ⑪ 文章撰写工作台 */
function pageWritingWorkbench() {
  const isGenerating = state.workbenchStep === 'generating';
  const header = `
  <div class="page-header">
    <div class="page-header-left">
      <h1>${isGenerating ? '异步生成中' : '创建文章'}</h1>
    </div>
  </div>`;

  if (isGenerating) {
    const jobId = 'job_' + Math.random().toString(36).slice(2, 10);
    return wrapWritingLayout(header, `
      <div class="ai-async-generating">
      <div class="ai-progress-ring" aria-hidden="true"><div class="ai-progress-ring-inner">65%</div></div>
      <div class="ai-generating-title">正在通过智能工作流生成文章…</div>
      <p class="ai-async-job-line">任务 ID：<code class="ai-job-code">${jobId}</code> · 预计约 <strong>2–4 分钟</strong>（具体以后端为准）</p>
      <p class="ai-generating-sub">您可关闭本页或切换菜单；完成后将收到通知。</p>
      <div class="ai-async-steps">
        <span class="ai-async-step">校验点数</span>
        <span class="ai-async-step on">调用工作流</span>
        <span class="ai-async-step">落库草稿</span>
        <span class="ai-async-step">扣费确认</span>
      </div>
      <div class="ai-generating-meta">
        <span class="badge badge-gray">${escapeHtmlStr(state.writingForm.title)}</span>
        <span class="badge badge-gray">${escapeHtmlStr(state.writingForm.lang)}</span>
        <span class="badge badge-gray">us（美国）</span>
      </div>
      <button type="button" class="btn-default" style="margin-top:16px;" onclick="state.writingTab='history';render()">返回文章管理</button>
    </div>`);
  }

  if (state.workbenchStep === 'editor') {
    return articleEditorPageHTML();
  }

  const remaining = DB.package.crawlPoints.total - DB.package.crawlPoints.used;
  const kwMgmtOn = DB.package.featureKeywordManagement === true;
  const relKwCount = (state.writingForm.relatedKws || []).length;
  const relKwTags = (state.writingForm.relatedKws || []).map((kw, idx) =>
    `<span class="kw-tag kw-tag--infield">${escapeHtmlStr(kw)}<button type="button" class="kw-tag-del" onclick="event.stopPropagation();removeWritingRelatedKw(${idx})">×</button></span>`
  ).join('');
  const titleLen = (state.writingForm.title || '').length;
  const kwLen = (state.writingForm.keyword || '').length;

  return wrapWritingLayout(header, `
  <div class="panel writing-config-panel">
      <div class="writing-config-intro">
        <div class="writing-config-intro-title">开始写作</div>
      </div>

      <div class="form-group">
        <div class="form-group__head">
          <label class="form-label"><span class="required">*</span> 文章标题</label>
        </div>
        <div class="form-input-meter-wrap">
          <input id="wbTitle" class="form-input form-field-full" type="text" maxlength="150" placeholder="示例：B2B website content strategy"
            value="${escapeAttr(state.writingForm.title)}" oninput="updateWritingTitleMeter()"/>
          <span id="wbTitleMeter" class="form-input-meter" aria-hidden="true">${titleLen}/150</span>
        </div>
        <div class="form-hint">建议包含核心关键词。</div>
        ${writingErrorsHtml('title')}
      </div>

      <div class="form-group form-group--corner">
        <div class="form-group__head">
          <label class="form-label"><span class="required">*</span> 核心关键词</label>
          <div class="form-corner-actions">
            ${kwMgmtOn ? `<button type="button" class="btn-default" onclick="saveTitleBeforeModal();openModal('kw-picker')">从关键词库选择</button>` : ''}
          </div>
        </div>
        <div class="form-input-meter-wrap">
          <input id="wbKeyword" class="form-input form-field-full" type="text" maxlength="100" placeholder="示例：industrial parts sourcing"
            value="${escapeAttr(state.writingForm.keyword)}" oninput="updateWritingKeywordMeter()"/>
          <span id="wbKeywordMeter" class="form-input-meter" aria-hidden="true">${kwLen}/100</span>
        </div>
        <div class="form-hint">核心关键词应与文章标题主题一致，以利于检索与内容聚合。</div>
        ${writingErrorsHtml('keyword')}
      </div>

      <div class="form-group form-group--corner">
        <div class="form-group__head form-group__head--relkw">
          <div class="form-group__head-labelrow">
            <label class="form-label">相关关键词 <span style="font-size:11px;font-weight:400;color:var(--text-3);">（选填）</span></label>
            <span class="writing-kw-counter" aria-live="polite">${relKwCount}/${MAX_REL_KEYWORDS_FIELD}</span>
          </div>
        </div>
        <div class="writing-relkw-chips-input form-field-full" role="group" aria-label="相关关键词">
          <div class="writing-relkw-chips-input__chips">${relKwTags}</div>
          <input id="wbRelKw" class="writing-relkw-chips-input__field" type="text" maxlength="100" placeholder="输入后按 Enter 添加" onkeydown="addWritingRelatedKw(event)" oninput="clearWritingFieldError('relatedKws')"/>
        </div>
        <div class="form-hint writing-relkw-below-hint">须与标题、核心关键词主题一致，用于拓展语义与长尾覆盖；选填，最多 ${MAX_REL_KEYWORDS_FIELD} 个。</div>
        ${writingErrorsHtml('relatedKws')}
      </div>

      <div class="form-group">
        <label class="form-label">内链URL <span style="font-size:11px;font-weight:400;color:var(--text-3);">（选填）</span></label>
        <div class="form-hint writing-internal-hint">添加的内链将在生成文章时写入正文，用于在内容中插入指向当前站点域下页面的链接（每行一条完整 URL，最多 ${MAX_INTERNAL_LINK_LINES_FIELD} 条）。</div>
        <textarea id="wbInternal" class="form-textarea form-field-full" rows="4" style="min-height:96px;resize:vertical;margin-top:8px;" placeholder="每行一条完整 URL，最多 ${MAX_INTERNAL_LINK_LINES_FIELD} 条" oninput="clearWritingFieldError('internalLinks')">${escapeHtmlStr((state.writingForm.internalLinks || []).join('\n'))}</textarea>
        ${writingErrorsHtml('internalLinks')}
      </div>

      <div class="writing-config-row writing-config-row--two writing-config-row-disabled" title="即将开放，敬请期待">
        <div class="form-group">
          <label class="form-label" style="color:var(--text-3);">目标语言</label>
          <select id="wbLang" class="form-select" disabled>
            <option value="English" ${state.writingForm.lang==='English'?'selected':''}>English（英文）</option>
            <option value="中文"    ${state.writingForm.lang==='中文'   ?'selected':''}>中文</option>
            <option value="Spanish">Español（西班牙语）</option>
            <option value="French">Français（法语）</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" style="color:var(--text-3);">目标国家</label>
          <input type="text" class="form-input" value="us（美国）" disabled readonly style="background:#fafafa;color:var(--text-sub);cursor:not-allowed;"/>
        </div>
      </div>

      <div class="ai-cost-row">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="var(--text-3)" stroke-width="1.2"/><line x1="8" y1="4.5" x2="8" y2="8.5" stroke="var(--text-3)" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11" r=".8" fill="var(--text-3)"/></svg>
        <span>本次预计 <strong style="color:var(--brand);">500 点</strong> · 当前剩余
          <strong style="color:${remaining<2000?'var(--red)':'var(--text-1)'};">${remaining.toLocaleString()} 点</strong>
        </span>
        ${remaining < 500 ? '<span class="ai-points-warn">余额不足，请联系管理员充值</span>' : ''}
      </div>
      ${writingErrorsHtml('points')}

      <div class="writing-config-actions">
        <button type="button" class="btn-primary writing-generate-btn" onclick="triggerGenerate()">确认生成</button>
        <span class="writing-config-hint">提交后可离开本页，任务在后台继续处理</span>
      </div>
  </div>`);
}

function removeWritingRelatedKw(idx) {
  saveTitleBeforeModal();
  clearWritingFieldError('relatedKws');
  state.writingForm.relatedKws = (state.writingForm.relatedKws || []).filter((_, j) => j !== idx);
  render();
}

function updateWritingTitleMeter() {
  clearWritingFieldError('title');
  const el = $('wbTitle');
  const m = $('wbTitleMeter');
  if (el && m) m.textContent = `${el.value.length}/150`;
}

function updateWritingKeywordMeter() {
  clearWritingFieldError('keyword');
  const el = $('wbKeyword');
  const m = $('wbKeywordMeter');
  if (el && m) m.textContent = `${el.value.length}/100`;
}

function saveTitleBeforeModal() {
  const t = document.getElementById('wbTitle');
  const k = document.getElementById('wbKeyword');
  const i = document.getElementById('wbInternal');
  if (t) state.writingForm.title = t.value.slice(0, 150);
  if (k) state.writingForm.keyword = k.value.slice(0, 100);
  updateWritingTitleMeter();
  updateWritingKeywordMeter();
  if (i && i.tagName === 'TEXTAREA') {
    state.writingForm.internalLinks = i.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, MAX_INTERNAL_LINK_LINES_FIELD);
  }
}

function validateWritingGenerateForm() {
  const g = id => document.getElementById(id);
  const val = id => (g(id) ? String(g(id).value) : '').trim();
  const title = (val('wbTitle') || state.writingForm.title || '').trim();
  const keyword = (val('wbKeyword') || state.writingForm.keyword || '').trim();
  const internalEl = g('wbInternal');
  const rawLines = internalEl ? String(internalEl.value).split(/\r?\n/) : [];
  const nonEmptyLines = rawLines.map(l => l.trim()).filter(Boolean);
  const internalLinks = nonEmptyLines.slice(0, MAX_INTERNAL_LINK_LINES_FIELD);
  const relatedKws = (state.writingForm.relatedKws || []).map(k => String(k).trim()).filter(Boolean).slice(0, MAX_REL_KEYWORDS_FIELD);
  const err = { title: '', keyword: '', relatedKws: '', internalLinks: '', points: '' };

  if (!title) err.title = '请输入文章标题';
  else if (title.length > 150) err.title = '文章标题不能超过 150 个字符';

  if (!keyword) err.keyword = '请输入核心关键词';
  else if (keyword.length > 100) err.keyword = '核心关键词不能超过 100 个字符';

  if (relatedKws.length > MAX_REL_KEYWORDS_FIELD) err.relatedKws = `相关关键词最多 ${MAX_REL_KEYWORDS_FIELD} 个`;
  else {
    const badLen = relatedKws.find(k => k.length > 100);
    if (badLen) err.relatedKws = '每条相关关键词长度不能超过 100 个字符';
  }

  if (nonEmptyLines.length > MAX_INTERNAL_LINK_LINES_FIELD) err.internalLinks = `内链 URL 最多填写 ${MAX_INTERNAL_LINK_LINES_FIELD} 条，请删除多余行后再试`;
  else {
    const iuErr = validateInternalUrlsFormatList(internalLinks);
    if (iuErr) err.internalLinks = iuErr;
  }

  const remaining = DB.package.crawlPoints.total - DB.package.crawlPoints.used;
  if (remaining < 500) {
    err.points = `点数不足：当前剩余 ${remaining.toLocaleString()} 点，每次生成至少需要 500 点。请前往套餐资源充值或联系管理员。`;
  }

  const lang = (g('wbLang') ? g('wbLang').value : state.writingForm.lang);
  return {
    err,
    title: title.slice(0, 150),
    keyword: keyword.slice(0, 100),
    relatedKws,
    internalLinks,
    lang,
    remaining,
  };
}

function triggerGenerate() {
  saveTitleBeforeModal();
  const { err, title, keyword, relatedKws, internalLinks, lang } = validateWritingGenerateForm();
  state.writingFieldErrors = { ...err };
  if (err.title || err.keyword || err.relatedKws || err.internalLinks || err.points) {
    render();
    return;
  }

  state.writingForm = { title, keyword, lang, relatedKws, internalLinks };
  writingResetFieldErrors();
  state.pendingWritingGenerate = { title, keyword, lang, relatedKws, internalLinks };
  render();
  openModal('writing-submit-success');
}

function modalWritingSubmitSuccess() {
  return `
  <div class="modal-header">
    <span class="modal-title">提交成功</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    <p style="font-size:14px;color:var(--text-1);line-height:1.65;margin:0;">生成任务已提交，系统将在后台处理。您可在<strong>文章管理</strong>中查看任务状态。</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn-primary" onclick="confirmWritingSubmitSuccess()">确定</button>
  </div>`;
}

function confirmWritingSubmitSuccess() {
  const p = state.pendingWritingGenerate;
  if (!p) {
    closeModal();
    return;
  }
  const words = 1500;
  const newId = Date.now();
  DB.package.crawlPoints.used = Math.min(DB.package.crawlPoints.total, DB.package.crawlPoints.used + 500);
  DB.articles.unshift({
    id: newId,
    title: p.title,
    keyword: p.keyword,
    lang: p.lang,
    words: parseInt(String(words), 10),
    status: 'generating',
    site: null,
    url: null,
    createdAt: new Date().toISOString().slice(0, 10),
    bodyHtml: null,
    hasLocalEditPending: false,
  });
  state.pendingWritingGenerate = null;
  state.writingTab = 'history';
  state.workbenchStep = 'config';
  state.editArticleId = null;
  closeModal();
  render();
  toast('已返回文章管理');
}

/** 从功能逻辑说明跳转至「网站设置 › 授权管理」示意（默认「锐华五金」未授权站点，便于演示授权） */
function openAuthMgmtFromLogicHelp() {
  closeLogicDrawer();
  state.primary = 'settings';
  state.settingsTab = 'site-mgmt';
  const s1 = DB.sites.find(x => x.id === 1);
  if (s1) state.siteId = s1.id;
  else if (DB.sites[0]) state.siteId = DB.sites[0].id;
  state.settingsSub = 'auth';
  render();
  setTimeout(() => openModal('site-settings'), 0);
}

/* ── Article Editor（全宽：无顶栏、无内容区左侧二级导航）── */
function articleEditorPageHTML() {
  const art = DB.articles.find(a => a.id === state.editArticleId) || DB.articles[0];
  const vp = state.articleEditorViewport || 'pc';
  const vpActive = m => (vp === m ? ' active' : '');
  return `
  <div class="article-editor-page">
    <header class="article-editor-chrome">
      <div class="article-editor-chrome-left">
        <button type="button" class="btn-default" onclick="state.writingTab='history';state.workbenchStep='config';render()">返回</button>
      </div>
      <div class="article-editor-chrome-actions">
        <button type="button" class="btn-default editor-chrome-export-btn" onclick="editorExportHtml()" title="导出为 HTML">
          <svg class="editor-chrome-export-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出
        </button>
        <button type="button" class="btn-default" onclick="saveArticleDraft()">保存草稿</button>
        <button type="button" class="btn-primary" onclick="openModal('publish-article')">${art && art.status === 'synced' ? '更新发布' : '发布'}</button>
      </div>
    </header>
    <div class="article-editor-title-field">
      <label class="form-label" for="editorArticleTitle"><span class="required">*</span> 文章标题</label>
      <input id="editorArticleTitle" class="form-input" type="text" maxlength="150" placeholder="请输入文章标题"
        value="${escapeAttr(art ? art.title : '')}"/>
    </div>
    <div class="article-editor-subtoolbar">
      <div class="article-editor-subtoolbar-left">
        <span class="editor-rte-wordcount-badge" id="editorRteWordcount">约 0 词</span>
      </div>
      <div class="article-editor-subtoolbar-center" role="toolbar" aria-label="正文预览宽度">
        <div class="editor-viewport-switch">
          <button type="button" class="editor-viewport-btn${vpActive('pc')}" data-viewport="pc" onclick="setArticleEditorViewport('pc')" title="PC 端" aria-label="PC 端预览">
            <svg class="editor-viewport-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
          </button>
          <button type="button" class="editor-viewport-btn${vpActive('tablet')}" data-viewport="tablet" onclick="setArticleEditorViewport('tablet')" title="平板端" aria-label="平板端预览">
            <svg class="editor-viewport-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>
          </button>
          <button type="button" class="editor-viewport-btn${vpActive('mobile')}" data-viewport="mobile" onclick="setArticleEditorViewport('mobile')" title="手机端" aria-label="手机端预览">
            <svg class="editor-viewport-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
      </div>
      <div class="article-editor-subtoolbar-right" role="toolbar" aria-label="撤销与重做">
        <button type="button" class="btn-icon" onclick="editorUndo()" title="撤销 (Ctrl+Z)" aria-label="撤销">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
        </button>
        <button type="button" class="btn-icon" onclick="editorRedo()" title="重做 (Ctrl+Shift+Z)" aria-label="重做">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
        </button>
      </div>
    </div>
    ${articleEditorHTML()}
  </div>`;
}

function articleEditorHTML() {
  const art = DB.articles.find(a => a.id === state.editArticleId) || DB.articles[0];
  const kw = art ? art.keyword : '外贸建站';
  const defaultBody = `<p>In today's competitive global marketplace, having a professional <strong>foreign trade website</strong> is essential for reaching international buyers. Your website is your 24/7 digital storefront.</p>
<h2>1. Choose the Right Platform</h2>
<p>The foundation of any successful <strong>${kw}</strong> strategy starts with the right platform: SEO, multilingual support, and secure checkout for cross-border trade.</p>
<h2>2. Optimize for International SEO</h2>
<p>Implement hreflang, localized content, and keyword research aligned with buyer search intent in each target market.</p>
<h2>3. Performance & Trust</h2>
<p>Use a CDN for global speed; display certifications and social proof to build trust with overseas buyers.</p>`;
  const bodyHtml = art && art.bodyHtml ? art.bodyHtml : defaultBody;

  const vp = state.articleEditorViewport || 'pc';
  return `
  <div class="article-editor-layout editor-viewport-${vp}">
    <aside class="editor-outline-panel" aria-label="文章大纲">
      <div class="editor-outline-head">大纲</div>
      <div class="editor-outline-list" id="editorOutlineList"></div>
    </aside>
    <div class="editor-main editor-rte-shell">
      <div class="editor-rte-body-wrap">
        <div id="editorRteFloat" class="editor-rte-float" style="display:none;" aria-hidden="true"></div>
        <div class="editor-body editor-rte-body" contenteditable="true">${bodyHtml}</div>
      </div>
    </div>
  </div>`;
}

function parseSimpleCsvFields(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (!q && c === ',') {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function splitBatchImportLine(line) {
  if (line.includes('\t')) {
    const p = line.split('\t').map(x => x.trim());
    if (p.length >= 2) return p;
  }
  return parseSimpleCsvFields(line);
}

function normalizeBatchSheetLines(text) {
  const t = String(text || '').replace(/^\ufeff/, '');
  const raw = t.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!raw.length) return [];
  if (raw.length && /文章标题/.test(raw[0]) && /核心关键词/.test(raw[0])) raw.shift();
  return raw;
}

function escapeCsvCell(v) {
  const s = String(v ?? '');
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadBatchArticleTemplate() {
  const bom = '\ufeff';
  const header = '*文章标题,*核心关键词,相关关键词,内链URL';
  const ex = '"示例：春季新品页","spring products","新品;spring","https://www.leadong.com/a;https://www.leadong.com/b"';
  const csv = `${bom}${header}\r\n${ex}\r\n`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '批量创建文章模板.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function batchArticleHandleFile(ev) {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  state.batchArticleImportName = f.name;
  const reader = new FileReader();
  reader.onload = () => {
    state.batchArticleInputRaw = String(reader.result || '');
    render();
  };
  reader.readAsText(f, 'UTF-8');
}

function resetBatchArticleFlow() {
  state.batchArticleStep = 1;
  state.batchArticleInputRaw = '';
  state.batchArticleRows = [];
  state.batchArticleLastCreatedCount = 0;
  state.batchArticleImportName = '';
}

function batchArticleParseAndGoPreview() {
  const raw = state.batchArticleInputRaw || '';
  if (!raw.trim()) {
    toast('请先下载模板填写后，上传 CSV 文件（可由 Excel 另存为 CSV）', 'error');
    return;
  }
  const lines = normalizeBatchSheetLines(raw);
  if (!lines.length) {
    toast('文件中没有有效数据行', 'error');
    return;
  }
  if (lines.length > MAX_BATCH_IMPORT_ROWS) {
    toast(`单次批量最多 ${MAX_BATCH_IMPORT_ROWS} 条，当前 ${lines.length} 条请删减后重试`, 'error');
    return;
  }
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = splitBatchImportLine(line);
    const title = (parts[0] || '').trim().slice(0, 150);
    const keyword = (parts[1] || '').trim().slice(0, 100);
    let relKws = [];
    if (parts[2] != null && String(parts[2]).trim()) {
      const relRaw = String(parts[2])
        .split(/[;；]/)
        .map(s => s.trim())
        .filter(Boolean);
      relKws = relRaw.map(s => s.slice(0, 100));
    }
    let internalUrls = [];
    if (parts[3] != null && String(parts[3]).trim()) {
      internalUrls = String(parts[3])
        .split(/[;；]/)
        .map(s => s.trim())
        .filter(Boolean);
    }
    const row = {
      line,
      lineNo: i + 1,
      title,
      keyword,
      relKws,
      internalUrls,
      ok: true,
      err: '',
    };
    if (!title) {
      row.ok = false;
      row.err = '标题不能为空';
    } else if (!keyword) {
      row.ok = false;
      row.err = '核心关键词不能为空';
    } else if (relKws.length > MAX_REL_KEYWORDS_FIELD) {
      row.ok = false;
      row.err = `相关关键词最多 ${MAX_REL_KEYWORDS_FIELD} 个（请用分号分隔，勿超过上限）`;
    } else {
      const badLen = relKws.find(k => k.length > 100);
      if (badLen) {
        row.err = '单个相关词超过 100 字';
        row.ok = false;
      }
    }
    if (row.ok) {
      const iuErr = validateInternalUrlsFormatList(internalUrls);
      if (iuErr) {
        row.ok = false;
        row.err = iuErr;
      }
    }
    rows.push(row);
  }
  state.batchArticleRows = rows;
  state.batchArticleStep = 2;
  render();
}

function batchArticleRemoveFailedRows() {
  const okOnly = state.batchArticleRows.filter(r => r.ok);
  if (!okOnly.length) {
    toast('没有校验通过的行可保留', 'error');
    return;
  }
  state.batchArticleRows = okOnly.map((r, idx) => ({ ...r, lineNo: idx + 1 }));
  state.batchArticleInputRaw = okOnly
    .map(r =>
      [r.title, r.keyword, r.relKws.join(';'), (r.internalUrls || []).join(';')].map(escapeCsvCell).join(','))
    .join('\r\n');
  toast(`已移除失败行，剩余 ${okOnly.length} 条`, 'info');
  render();
}

function batchArticleGoStep(n) {
  state.batchArticleStep = n;
  render();
}

function batchArticleConfirmCreate() {
  const okRows = state.batchArticleRows.filter(r => r.ok);
  const n = okRows.length;
  if (!n) {
    toast('没有可创建的文章', 'error');
    return;
  }
  const cost = n * BATCH_ARTICLE_POINTS_PER_ROW;
  const rem = DB.package.crawlPoints.total - DB.package.crawlPoints.used;
  if (rem < cost) {
    toast(`点数不足：批量创建需 ${cost} 点，当前剩余 ${rem.toLocaleString()} 点`, 'error');
    return;
  }
  DB.package.crawlPoints.used = Math.min(DB.package.crawlPoints.total, DB.package.crawlPoints.used + cost);
  const today = new Date().toISOString().slice(0, 10);
  okRows.forEach((r, idx) => {
    const id = Date.now() + idx;
    const links = r.internalUrls && r.internalUrls.length ? r.internalUrls.slice(0, MAX_INTERNAL_LINK_LINES_FIELD) : [];
    DB.articles.unshift({
      id,
      title: r.title,
      keyword: r.keyword,
      lang: 'English',
      words: 0,
      status: 'draft',
      site: null,
      url: null,
      createdAt: today,
      bodyHtml: null,
      internalLinks: links.length ? links : undefined,
    });
  });
  state.batchArticleLastCreatedCount = n;
  state.batchArticleStep = 4;
  render();
  toast(`已批量创建 ${n} 篇草稿`);
}

/* ⑫-1 批量创建文章（多步流程） */
function pageBatchArticleCreate() {
  const step = state.batchArticleStep || 1;
  const stepsBar = `
    <div class="batch-article-steps">
      ${[1, 2, 3, 4].map(n => `
        <div class="batch-article-step ${step >= n ? 'on' : ''}${step === n ? ' current' : ''}">
          <span class="batch-article-step-num">${n}</span>
          <span class="batch-article-step-label">${['录入数据', '校验预览', '确认提交', '完成'][n - 1]}</span>
        </div>`).join('')}
    </div>`;

  const header = `
  <div class="page-header">
    <div class="page-header-left">
      <div class="page-breadcrumb"><span>内容</span><span class="sep">›</span><span>文章管理</span><span class="sep">›</span><span>批量创建</span></div>
      <h1>批量创建文章</h1>
    </div>
  </div>`;

  if (step === 1) {
    const lineCount = normalizeBatchSheetLines(state.batchArticleInputRaw || '').length;
    const imp = state.batchArticleImportName ? `<span style="color:var(--brand);">${escapeHtmlStr(state.batchArticleImportName)}</span>` : '';
    const body = `
    ${stepsBar}
    <div class="panel batch-article-panel">
      <p style="font-size:13px;color:var(--text-2);line-height:1.65;margin:0 0 12px;">
        请下载 Excel 批量模板（CSV），按模板说明填写后上传。
      </p>
      <ul style="margin:0 0 14px 18px;padding:0;font-size:12px;color:var(--text-3);line-height:1.65;">
        <li>请按模板中的说明填写；<strong>表头字段标了「*」的为必填字段，请务必填写。</strong></li>
        <li>单次最多 <strong>${MAX_BATCH_IMPORT_ROWS.toLocaleString()}</strong> 条，超出请分批导入。</li>
        <li>第 <strong>C</strong>、<strong>D</strong> 列中若填写多个值，须用英文分号 <code>;</code> 或中文分号 <code>；</code> 分隔；相关关键词最多 ${MAX_REL_KEYWORDS_FIELD} 个，内链最多 ${MAX_INTERNAL_LINK_LINES_FIELD} 条，每条须为有效 URL。</li>
      </ul>
      <div class="batch-import-toolbar">
        <button type="button" class="btn-default" onclick="downloadBatchArticleTemplate()">下载 Excel 批量模板（.csv）</button>
        <label class="batch-file-label btn-primary" style="cursor:pointer;margin:0;">
          <input type="file" id="batchArticleFileInput" accept=".csv,text/csv,application/vnd.ms-excel" style="display:none;" onchange="batchArticleHandleFile(event)"/>
          上传文件
        </label>
      </div>
      ${imp ? `<p style="font-size:13px;margin:14px 0 6px;color:var(--text-2);">已选择文件： ${imp}${lineCount ? ` · 解析到 <strong>${lineCount}</strong> 条数据行（不含表头）` : ''}</p>` : '<p style="font-size:12px;color:var(--text-3);margin:12px 0 6px;">尚未上传文件。</p>'}
      <div class="batch-article-actions">
        <button type="button" class="btn-default" onclick="resetBatchArticleFlow();state.writingTab='history';render()">取消</button>
        <button type="button" class="btn-primary" onclick="batchArticleParseAndGoPreview()" ${lineCount ? '' : 'disabled'} ${lineCount ? '' : 'style="opacity:0.5;cursor:not-allowed;"'}">下一步</button>
      </div>
    </div>`;
    return wrapWritingLayout(header, body);
  }

  if (step === 2) {
    const rows = state.batchArticleRows || [];
    const allOk = rows.length && rows.every(r => r.ok);
    const rowHtml = rows.map(r => `
      <tr class="${r.ok ? '' : 'batch-article-row-err'}">
        <td>${r.lineNo}</td>
        <td><span class="td-kw" title="${escapeAttr(r.title)}">${escapeHtmlStr(r.title)}</span></td>
        <td>${escapeHtmlStr(r.keyword)}</td>
        <td style="font-size:12px;color:var(--text-2);max-width:140px;">${escapeHtmlStr(r.relKws.length ? r.relKws.join('；') : '—')}</td>
        <td style="font-size:11px;color:var(--text-2);max-width:180px;word-break:break-all;">${escapeHtmlStr((r.internalUrls || []).length ? (r.internalUrls || []).join('；') : '—')}</td>
        <td>${r.ok ? '<span class="badge badge-green">通过</span>' : `<span class="badge badge-gray" style="color:var(--red);border-color:var(--red);">${escapeHtmlStr(r.err)}</span>`}</td>
      </tr>`).join('');
    const body = `
    ${stepsBar}
    <div class="panel batch-article-panel">
      <p style="font-size:13px;color:var(--text-2);margin:0 0 12px;">共 <strong>${rows.length}</strong> 行；校验通过 <strong>${rows.filter(r => r.ok).length}</strong> 行。可通过「移除失败行」剔除错误行后继续。</p>
      <div class="table-wrap" style="max-height:360px;overflow:auto;">
        <table class="data-table">
          <thead><tr><th style="width:44px;">行号</th><th>文章标题</th><th>核心关键词</th><th>相关关键词</th><th>内链 URL</th><th style="width:140px;">校验</th></tr></thead>
          <tbody>${rowHtml}</tbody>
        </table>
      </div>
      <div class="batch-article-actions">
        <button type="button" class="btn-default" onclick="batchArticleGoStep(1)">上一步</button>
        <button type="button" class="btn-default" onclick="batchArticleRemoveFailedRows()">移除校验失败行</button>
        <button type="button" class="btn-primary" onclick="batchArticleGoStep(3)" ${allOk ? '' : 'disabled'} ${allOk ? '' : 'style="opacity:0.5;cursor:not-allowed;"'}">下一步</button>
      </div>
    </div>`;
    return wrapWritingLayout(header, body);
  }

  if (step === 3) {
    const okRows = state.batchArticleRows.filter(r => r.ok);
    const n = okRows.length;
    const cost = n * BATCH_ARTICLE_POINTS_PER_ROW;
    const rem = DB.package.crawlPoints.total - DB.package.crawlPoints.used;
    const okPoints = rem >= cost;
    const body = `
    ${stepsBar}
    <div class="panel batch-article-panel">
      <p style="font-size:14px;color:var(--text-1);margin:0 0 10px;">即将创建 <strong>${n}</strong> 篇草稿，预计消耗 <strong>${cost}</strong> 点；单次批量最多 <strong>${MAX_BATCH_IMPORT_ROWS.toLocaleString()}</strong> 条。</p>
      <p style="font-size:13px;color:var(--text-2);margin:0 0 14px;">当前点数剩余：<strong style="color:${okPoints ? 'var(--text-1)' : 'var(--red)'};">${rem.toLocaleString()}</strong> 点。</p>
      ${okPoints ? '' : `<div class="form-error" style="margin-bottom:12px;">点数不足，无法提交。请减少行数或充值后重试。</div>`}
      <ul style="margin:0 0 16px 18px;padding:0;font-size:12px;color:var(--text-3);line-height:1.65;">
        <li>提交后每篇在列表中为「草稿」，可再进入单篇编辑或后续接入「批量生成正文」任务。</li>
      </ul>
      <div class="batch-article-actions">
        <button type="button" class="btn-default" onclick="batchArticleGoStep(2)">上一步</button>
        <button type="button" class="btn-primary" onclick="batchArticleConfirmCreate()" ${okPoints ? '' : 'disabled'} ${okPoints ? '' : 'style="opacity:0.5;cursor:not-allowed;"'}>确认批量创建</button>
      </div>
    </div>`;
    return wrapWritingLayout(header, body);
  }

  /* step 4 完成 */
  const n = state.batchArticleLastCreatedCount || 0;
  const body = `
  ${stepsBar}
  <div class="panel batch-article-panel batch-article-done">
    <div style="font-size:48px;line-height:1;margin-bottom:12px;" aria-hidden="true">✓</div>
    <h2 style="margin:0 0 8px;font-size:18px;color:var(--text-1);">批量创建已提交</h2>
    <p style="font-size:14px;color:var(--text-2);margin:0 0 20px;">已创建 <strong>${n}</strong> 篇草稿，您可在「文章管理」中查看与编辑。</p>
    <div class="batch-article-actions">
      <button type="button" class="btn-primary" onclick="resetBatchArticleFlow();state.writingTab='history';state.articleListPage=1;render()">返回文章管理</button>
      <button type="button" class="btn-default" onclick="resetBatchArticleFlow();render()">继续批量创建</button>
    </div>
  </div>`;
  return wrapWritingLayout(header, body);
}

/* ⑫ 历史文章 */
function pageArticleHistory() {
  const header = `
  <div class="page-header">
    <div class="page-header-left">
      <h1>文章管理</h1>
    </div>
    <div class="page-header-actions">
      <button type="button" class="btn-default" onclick="resetBatchArticleFlow();state.writingTab='batch-create';render()">批量创建</button>
      <button class="btn-primary" onclick="writingResetFieldErrors();state.writingTab='workbench';state.workbenchStep='config';render()">+ 创建文章</button>
    </div>
  </div>`;

  const statusBadge = s => ({
    draft:      '<span class="badge badge-gray">草稿</span>',
    synced:     '<span class="badge badge-green">已同步</span>',
    generating: '<span class="badge badge-blue">生成中</span>',
  }[s] || s);

  const { rows, total, page, totalPages, pageSize } = articleListPagedSlice();
  const selIds = state.articleListSelectedIds || [];
  const batchOn = selIds.length > 0;
  const st = state.articleListStatusFilter || '';
  const qVal = escapeAttr(state.articleListQuery || '');

  return wrapWritingLayout(header, `
  <div class="panel" style="overflow:hidden;">
    <div class="toolbar">
      ${batchOn ? `<button type="button" class="btn-default article-batch-del" onclick="articleListBatchDelete()">批量删除（${selIds.length}）</button>` : ''}
      <div class="toolbar-spacer"></div>
      <input class="input-search" type="text" placeholder="搜索文章标题" value="${qVal}"
        oninput="setArticleListSearch(this.value)"/>
      <select onchange="setArticleListStatusFilter(this.value)">
        <option value=""${st === '' ? ' selected' : ''}>状态筛选</option>
        <option value="synced"${st === 'synced' ? ' selected' : ''}>已同步</option>
        <option value="draft"${st === 'draft' ? ' selected' : ''}>草稿</option>
        <option value="generating"${st === 'generating' ? ' selected' : ''}>生成中</option>
      </select>
      <button class="btn-icon" title="导出" onclick="articleListExportZip()">↓</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          <th style="width:36px;"><input type="checkbox" id="articleListSelectAll" onclick="articleListToggleAllOnPage(this.checked)"/></th>
          <th>文章标题 ↕</th>
          <th>字数 ↕</th>
          <th>状态</th>
          <th>文章 URL</th>
          <th>排名</th>
          <th>创建时间 ↕</th>
          <th>操作</th>
        </tr></thead>
        <tbody>
          ${rows.length ? rows.map(a => {
            const rankData = DB.urlRankDetails[a.id];
            const rankOn = DB.package.featureKeywordRankCrawl;
            const rankCell = !rankOn
              ? '<span style="color:var(--text-light);">—</span>'
              : (!a.url || !rankData)
                ? '<span style="color:var(--text-light);">—</span>'
                : `<button type="button" class="btn-link article-rank-cell" style="font-weight:600;padding:0;" onclick="state.rankDetailArticleId=${a.id};openModal('article-url-ranks');">${rankData.best}</button>`;
            const checked = selIds.includes(a.id) ? ' checked' : '';
            const dispW = articleDisplayWords(a);
            const updDot = a.status === 'synced' && a.hasLocalEditPending
              ? '<span class="article-update-dot" title="存在未发布的修改，建议更新"></span>'
              : '';
            return `
          <tr>
            <td><input type="checkbox"${checked} onchange="articleListToggleRow(${a.id}, this.checked)"/></td>
            <td><span class="td-kw td-kw-tip" data-tip="${escapeAttr(a.title)}">${escapeHtmlStr(a.title)}</span></td>
            <td>${dispW > 0 ? dispW.toLocaleString() : '—'}</td>
            <td>${statusBadge(a.status)}</td>
            <td>${a.url ? `<a class="td-link" href="${escapeAttr(a.url)}" target="_blank" style="font-size:11px;max-width:150px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeAttr(a.url)}">${escapeHtmlStr(a.url)}</a>` : '<span style="color:var(--text-light);">—</span>'}</td>
            <td style="white-space:nowrap;">${rankCell}</td>
            <td style="font-size:12px;color:var(--text-sub);">${escapeHtmlStr(a.createdAt)}</td>
            <td class="ops">
              <div class="article-list-ops">
              ${a.status !== 'generating' ? `<button type="button" class="btn-link" onclick="state.editArticleId=${a.id};state.writingTab='workbench';state.workbenchStep='editor';render()">编辑</button>` : ''}
              ${a.status === 'draft'  ? `<button type="button" class="btn-link" onclick="state.editArticleId=${a.id};openModal('publish-article')">发布</button>` : ''}
              ${a.status === 'synced' ? `<span class="article-ops-update-wrap"><button type="button" class="btn-link article-ops-update-btn" onclick="state.editArticleId=${a.id};openModal('publish-article')">更新</button>${updDot}</span>` : ''}
              ${a.status === 'generating'
                ? `<button type="button" class="btn-link article-del-disabled" disabled title="文章生成中，暂不可删除；请待生成完成后再操作。" style="color:var(--text-3);cursor:not-allowed;opacity:0.65;">删除</button>`
                : `<button type="button" class="btn-link article-ops-del" style="color:var(--red);" onclick="deleteArticleRow(${a.id})">删除</button>`}
              </div>
            </td>
          </tr>`;
          }).join('')
          : `<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-3);">暂无数据</td></tr>`}
        </tbody>
      </table>
    </div>
    <div class="article-list-footer">
      <div class="article-list-footer-left">
        <span class="article-list-footer-meta">共 ${total} 条</span>
        <span class="article-list-page-size-label">每页</span>
        <select class="article-list-page-size" onchange="setArticleListPageSize(+this.value)">
          <option value="20"${pageSize === 20 ? ' selected' : ''}>20</option>
          <option value="50"${pageSize === 50 ? ' selected' : ''}>50</option>
          <option value="100"${pageSize === 100 ? ' selected' : ''}>100</option>
        </select>
        <span class="article-list-page-size-label">条</span>
      </div>
      <div class="article-list-pager">
        <button type="button" class="btn-default" style="height:28px;padding:0 8px;" ${page <= 1 ? 'disabled' : ''} onclick="setArticleListPage(${page - 1})">‹</button>
        <button type="button" class="btn-primary" style="height:28px;padding:0 10px;">${page}</button>
        <button type="button" class="btn-default" style="height:28px;padding:0 8px;" ${page >= totalPages ? 'disabled' : ''} onclick="setArticleListPage(${page + 1})">›</button>
      </div>
    </div>
  </div>`);
}

/* 话题推荐（Vibe Coding） */
function modalTopicRecommend() {
  const kw = state.writingForm.keyword || '外贸建站';
  const topics = [
    { title:`How to Build a High-Converting ${kw} Website in 2025`, heat:'高', reason:'搜索量大，竞争中等，SEO 价值高' },
    { title:`Top 10 ${kw} Mistakes to Avoid`, heat:'中', reason:'问题导向标题，用户搜索意图强' },
    { title:`The Ultimate ${kw} Guide for B2B Exporters`, heat:'高', reason:'长尾词覆盖广，适合深度内容' },
    { title:`Why Your ${kw} Strategy Needs an Upgrade in 2025`, heat:'中', reason:'对比型标题，点击率高' },
    { title:`${kw} vs Traditional Marketing: Which Drives More Export Sales?`, heat:'低', reason:'差异化角度，蓝海内容机会' },
  ];
  const heatColor = h => h==='高'?'badge-green':h==='中'?'badge-blue':'badge-gray';
  return `
  <div class="modal-header">
    <span class="modal-title">话题推荐</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    <div style="margin-bottom:14px;font-size:13px;color:var(--text-2);">
      基于关键词 <strong>「${kw}」</strong> 推荐以下 5 个优质话题，点击「选用」将填入文章标题：
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${topics.map((t,i) => `
      <div style="border:1px solid var(--border);border-radius:8px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;transition:border-color .15s;"
           onmouseover="this.style.borderColor='var(--brand)'" onmouseout="this.style.borderColor='var(--border)'">
        <span style="width:22px;height:22px;border-radius:50%;background:var(--brand-light);color:var(--brand);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--text-1);margin-bottom:4px;">${t.title}</div>
          <div style="font-size:11px;color:var(--text-3);">${t.reason} &nbsp;<span class="badge ${heatColor(t.heat)}" style="font-size:10px;">${t.heat}热度</span></div>
        </div>
        <button class="btn-primary" style="height:28px;padding:0 14px;font-size:12px;flex-shrink:0;"
          onclick="state.writingForm.title=${JSON.stringify((t.title || '').slice(0, 150))};closeModal();render();">选用</button>
      </div>`).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-default" onclick="toast('重新生成中…')">重新生成</button>
  </div>`;
}

/* 关键词库单选 */
function modalKwPicker() {
  const kws = DB.keywords;
  return `
  <div class="modal-header">
    <span class="modal-title">从关键词库选择</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body" style="padding:0;">
    <div style="padding:12px 20px;border-bottom:1px solid var(--border);">
      <input class="form-input" id="kwPickerSearch" type="text" placeholder="搜索关键词…" oninput="
        const q=this.value.toLowerCase();
        document.querySelectorAll('.kw-pick-row').forEach(r=>{r.style.display=r.dataset.kw.toLowerCase().includes(q)?'':'none';});
      "/>
    </div>
    <div style="max-height:340px;overflow-y:auto;">
      <table class="data-table">
        <thead><tr><th></th><th>关键词</th><th>当前排名</th><th>月搜索量</th><th>竞争度</th></tr></thead>
        <tbody>
          ${kws.map(k => `
          <tr class="kw-pick-row" data-kw="${escapeAttr(k.kw)}" style="cursor:pointer;" onclick="
            state.writingForm.keyword=${JSON.stringify(String(k.kw).slice(0, 100))};
            closeModal();render();">
            <td><input type="radio" name="kwPick" ${state.writingForm.keyword===k.kw?'checked':''}/></td>
            <td><span class="td-kw">${k.kw}</span></td>
            <td>${k.rank ? `<span class="td-rank">${k.rank}</span>` : '<span style="color:var(--text-3)">—</span>'}</td>
            <td>${k.vol}</td>
            <td>${k.comp}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
  </div>`;
}

/* 相关关键词多选推荐 */
function modalRelatedKwPicker() {
  const core = state.writingForm.keyword || '外贸建站';
  const recommendations = [
    { kw:`${core} 教程`, vol:'1.2K', reason:'用户搜索如何操作，意图明确' },
    { kw:`${core} 费用`,  vol:'880',  reason:'高转化词，采购决策阶段' },
    { kw:`${core} 案例`,  vol:'720',  reason:'信任背书，内容深度加分' },
    { kw:`best ${core}`,  vol:'2.1K', reason:'英文长尾词，国际流量入口' },
    { kw:`${core} 平台`,  vol:'1.5K', reason:'产品对比型词，竞争中等' },
    { kw:`${core} 优化`,  vol:'640',  reason:'配合核心词的延伸搜索词' },
    { kw:`${core} 模板`,  vol:'530',  reason:'工具型需求，附加流量' },
    { kw:`专业${core}`,   vol:'410',  reason:'专业化定位词，精准客群' },
  ].filter(r => !(state.writingForm.relatedKws||[]).includes(r.kw));

  return `
  <div class="modal-header">
    <span class="modal-title">AI 推荐相关关键词</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-2);">
      基于核心关键词 <strong>「${core}」</strong> 推荐，勾选后加入文章生成参数（可多选）：
    </div>
    ${(state.writingForm.relatedKws||[]).length > 0 ? `
    <div style="margin-bottom:12px;padding:10px 12px;background:var(--brand-light);border-radius:6px;font-size:12px;">
      已选：${(state.writingForm.relatedKws||[]).map(k=>`<span class="kw-tag" style="margin:0 4px 0 0;">${k}</span>`).join('')}
    </div>` : ''}
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${recommendations.map(r => {
        const checked = (state.writingForm.relatedKws||[]).includes(r.kw);
        return `
        <label style="display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color .15s;"
          onmouseover="this.style.borderColor='var(--brand)'" onmouseout="this.style.borderColor='var(--border)'">
          <input type="checkbox" ${checked?'checked':''} onchange="relatedKwPickToggle(this,'${encodeURIComponent(r.kw)}')"/>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:600;">${r.kw}</div>
            <div style="font-size:11px;color:var(--text-3);">月搜索 ~${r.vol} · ${r.reason}</div>
          </div>
        </label>`;
      }).join('')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="toast('已添加相关关键词');closeModal();render();">确认添加</button>
  </div>`;
}

/* ── Modal: 删除文章确认 ── */
function modalArticleDeleteConfirm() {
  const ids = state.articleDeleteConfirmIds || [];
  const articles = ids.map(id => DB.articles.find(a => a.id === id)).filter(Boolean);
  const isBatch = ids.length > 1;
  const titleList = articles.slice(0, 5).map(a => escapeHtmlStr(a.title || '（无标题）')).join('、');

  return `
  <div class="modal-header">
    <span class="modal-title">${isBatch ? '确认批量删除文章' : '确认删除文章'}</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    <p style="font-size:14px;color:var(--text-1);line-height:1.65;margin:0 0 14px;">
      ${isBatch
        ? `您确定要删除已选中的 <strong>${ids.length}</strong> 篇文章吗？此操作<strong style="color:var(--red);">不可恢复</strong>，请谨慎确认。`
        : '您确定要删除该文章吗？此操作<strong style="color:var(--red);">不可恢复</strong>，请谨慎确认。'}
    </p>
    <ul style="margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.75;">
      <li>若文章已发布至外部独立站，本系统<strong>不会</strong>自动删除或下线线上页面；如需处理残留页面，请在对应站点后台自行操作。</li>
      ${isBatch ? '<li>批量删除将同时作用于上述所有已选条目，请再次核对后再确认。</li>' : ''}
    </ul>
    ${articles.length ? `<p style="margin:14px 0 0;font-size:12px;color:var(--text-3);line-height:1.5;">涉及文章：${titleList}${articles.length > 5 ? ` 等共 ${articles.length} 篇` : ''}</p>` : ''}
  </div>
  <div class="modal-footer">
    <button type="button" class="btn-default" data-close>取消</button>
    <button type="button" class="btn-danger-solid" onclick="confirmArticleDeleteExec()">${isBatch ? '确认删除所选' : '确认删除'}</button>
  </div>`;
}

/* ── Modal: 同步发布 ── */
function modalPublishArticle() {
  const s = site();
  const authRows = DB.siteAuths.length
    ? DB.siteAuths.map((sa, idx) => {
        const useLogo = /领动/i.test(sa.type || '');
        const logoInner = useLogo
          ? `<img class="engine-select-logo-img" src="${LEADONG_INDEPENDENT_SITE_LOGO}" alt=""/>`
          : `<span class="engine-select-logo-fallback">${escapeHtmlStr((sa.name || '?').slice(0, 1))}</span>`;
        return `
      <label class="engine-select-row checked" style="margin-bottom:8px;cursor:pointer;">
        <input type="radio" name="pubSite" value="${sa.id}" ${idx === 0 ? 'checked' : ''} style="width:15px;height:15px;accent-color:var(--brand);cursor:pointer;"/>
        <div class="engine-select-logo">${logoInner}</div>
        <div class="engine-select-info">
          <div class="engine-select-name">${escapeHtmlStr(sa.type || '独立站')}</div>
          <div class="engine-select-detail"><span>${escapeHtmlStr(s.name)}</span><span>${escapeHtmlStr(s.domain)}</span></div>
        </div>
        <span class="badge badge-green">已授权</span>
      </label>`;
      }).join('')
    : '';

  return `
  <div class="modal-header"><span class="modal-title">同步发布文章</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <div class="form-group">
      <label class="form-label">发布到</label>
      ${authRows || '<div style="color:var(--red);font-size:13px;">暂无已授权站点。请在 <strong>设置 › 网站管理</strong> 中打开对应网站的「设置」，在「授权管理」中完成独立站授权后再发布。</div>'}
    </div>
    <div style="padding:12px 16px;background:#f8fafc;border:1px solid var(--border);border-radius:8px;font-size:12px;color:var(--text-sub);">
      将按正式生效流程立即发布至所选目标；成功后文章访问 URL 将回显至「文章管理」列表。
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="
      const art = DB.articles.find(a=>a.id===state.editArticleId) || DB.articles.find(a=>a.status==='draft');
      if(art){
        art.status='synced';
        art.site=site().name;
        art.url='https://www.leadong.com/blog/'+art.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g,'-').slice(0,50);
        art.hasLocalEditPending = false;
      }
      toast('文章已成功同步发布！URL 已回显至文章管理列表');
      closeModal();
      state.writingTab='history';
      render();">确认发布</button>
  </div>`;
}

/* ⑬ 站点授权内容区（嵌入 网站管理 页面使用） */
function siteAuthContent() {
  const cards = DB.siteAuths.map((s, idx) => {
    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    return `
    <div class="auth-site-card">
      <div class="auth-site-header">
        <div style="width:38px;height:38px;border-radius:9px;background:${color};color:#fff;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${s.name[0]}</div>
        <div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:13px;">${s.name}</div><div style="font-size:11px;color:var(--text-3);">${s.domain}</div></div>
        <span class="badge badge-green">已授权</span>
      </div>
      <div class="auth-site-body">
        <div class="auth-site-row"><span>独立站网站 ID</span><span style="font-family:ui-monospace,monospace;font-size:12px;">${escapeHtmlStr(s.leadongSiteId || '—')}</span></div>
        <div class="auth-site-row"><span>平台类型</span><span><span class="badge badge-blue">${s.type}</span></span></div>
        <div class="auth-site-row"><span>绑定时间</span><span>${s.addedAt}</span></div>
        <div class="auth-site-row"><span>Token 状态</span><span style="color:var(--green);">● 有效</span></div>
      </div>
      <div class="auth-site-footer">
        <button class="btn-default" style="height:28px;font-size:12px;" onclick="toast('连接测试成功！Token 有效')">测试连接</button>
        <button class="btn-link" style="color:var(--red);font-size:12px;" onclick="demoUnbindLeadongFromSiteMgmt(${s.id})">解除授权</button>
      </div>
    </div>`;
  }).join('');
  return `
  <div style="margin-bottom:14px;padding:11px 14px;background:var(--amber-light);border:1px solid var(--amber-mid);border-radius:8px;font-size:13px;color:#92400e;">
    独立站授权当前支持领动 SaaS；更多平台将陆续开放。
  </div>
  <div class="auth-site-grid">
    ${cards}
    <div class="auth-site-card auth-site-placeholder" onclick="state.settingsSub='auth';openModal('site-settings');" style="cursor:pointer;" title="在网站设置 › 授权管理中绑定">
      <div style="text-align:center;padding:20px 0;color:var(--text-3);">
        <div style="font-size:26px;margin-bottom:8px;">＋</div>
        <div style="font-size:13px;font-weight:600;color:var(--text-2);">授权管理</div>
        <div style="font-size:11px;margin-top:4px;">在网站「设置 › 授权管理」中操作</div>
      </div>
    </div>
  </div>`;
}

/** 搜索 › 曝光页面（按 URL 维度汇总关键词排名，与关键词管理互补） */
function pageRankedPages() {
  return `
  <div class="panel dashboard-overview-module" style="overflow:hidden;">
    ${rankedLandingPagesTableAndStatsHTML({ searchPage: true })}
  </div>`;
}

/** SVG：行内「编辑」图标 */
const ONPAGE_SVG_EDIT = '<svg class="onpage-svg-edit" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
const ONPAGE_SVG_PC = '<svg class="onpage-dev-icon onpage-dev-icon--stroke" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8" stroke-linecap="round"/></svg>';
const ONPAGE_SVG_PHONE = '<svg class="onpage-dev-icon onpage-dev-icon--stroke" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M12 18h.01" stroke-linecap="round"/></svg>';
const ONPAGE_SVG_LIST = '<svg class="onpage-dev-icon onpage-dev-icon--stroke" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/></svg>';
const ONPAGE_GSC_TAB_ICON = `<img class="onpage-gsc-tab-logo" src="${GOOGLE_SEARCH_CONSOLE_LOGO}" width="18" height="18" alt="" aria-hidden="true" loading="lazy" />`;
const ONPAGE_SVG_INFO_HINT = '<svg class="onpage-hint-ic" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v4.5M10 6.2h.01" stroke-linecap="round"/></svg>';
const ONPAGE_SVG_EYE = '<svg class="onpage-eye-ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
const ONPAGE_SVG_EYE_OFF = '<svg class="onpage-eye-ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-10-7-10-7a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 7 10 7a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

const ONPAGE_KW_MODE_HINTS = {
  rank: '展示排名监测抓取到的关键词、名次、搜索引擎、排名日期与页面内关键词密度。',
  gsc: '展示 Google Search Console 中与当前页相关的查询词，及所选日期区间内的曝光、点击、CTR 与平均排名（须已完成 GSC 授权）。',
  recommend: '由 AI 结合当前页内容与目标词，推荐可纳入监控的关键词，并给出意图、类型、相关度与推荐理由。',
};
const ONPAGE_SVG_ALT_WARN = '<svg class="onpage-alt-warn-ic" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="#ea580c" stroke-width="1.7"><path d="M10 3.5L17.5 16h-15L10 3.5z" stroke-linejoin="round"/><path d="M10 8v3.5M10 13.2h.01" stroke="#ea580c" stroke-linecap="round"/></svg>';
const ONPAGE_SVG_KEBAB = '<svg class="onpage-kebab-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="6" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="18" r="2" fill="currentColor"/></svg>';

function onPageKwMatchScore(seed) {
  let h = 0;
  const s = String(seed || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 62 + (h % 39);
}

function onPageKwCorpusForDensity(row) {
  if (!row) return '';
  const bits = [row.title, row.metaDesc, row.metaKeywords, row.listSummary, row.dimA, row.dimB, row.dimC, row.dimD, row.path, row.keyword];
  return bits.filter(Boolean).map(String).join(' ').replace(/\s+/g, ' ').trim();
}

/** 关键词在「可解析页面文本」中的近似密度（演示：基于标题/摘要/维度摘要等拼接语料） */
function onPageKwDensityPercent(kw, row) {
  const phrase = String(kw || '').trim();
  if (!phrase) return '—';
  const corpus = onPageKwCorpusForDensity(row);
  if (!corpus) return '—';
  const words = corpus.split(/\s+/).filter(Boolean);
  const wn = words.length;
  if (!wn) return '—';
  const pad = s => ` ${String(s).replace(/\s+/g, ' ').trim()} `;
  const hay = pad(corpus.toLowerCase());
  const needle = pad(phrase.toLowerCase());
  let cnt = 0;
  let start = 0;
  while (true) {
    const i = hay.indexOf(needle, start);
    if (i < 0) break;
    cnt += 1;
    start = i + Math.max(1, needle.length - 2);
  }
  const phraseWords = phrase.split(/\s+/).filter(Boolean).length || 1;
  let pct = (cnt * phraseWords / wn) * 100;
  if (!Number.isFinite(pct) || pct < 0) pct = 0;
  pct = Math.min(99.99, Math.round(pct * 100) / 100);
  return `${pct}%`;
}

function onPageDimLooksOk(text) {
  const t = String(text || '');
  if (/全\s*✓|^全 ✓$/.test(t.trim())) return true;
  if (t.includes('⚠') || t.includes('缺少') || t.includes('风险') || t.includes('404') || t.includes('偏后') || t.includes('堆砌')) return false;
  return t.includes('✓') && !t.includes('略');
}

/** 将维度原始文案转为一句完整诊断表述（不出现 ✓ 符号） */
function onPageHumanizeDimProblem(dimKey, raw, row) {
  const t = String(raw || '').trim();
  const clean = s => String(s || '').replace(/\s*✓\s*/g, '').replace(/\s*·\s*/g, '，').replace(/，+$/g, '').trim();
  if (dimKey === 'A') {
    if (/略超\s*60|Title 略超/i.test(t)) return '当前页面标题长度略超过搜索引擎普遍建议的约 60 个字符上限，需在保留核心词的前提下适当精简。';
    if (/HTTPS/i.test(t) && /略超|偏后/i.test(t)) return '站点已启用安全访问（HTTPS）；与此同时页面标题长度仍略超出理想区间，建议一并优化以改善在搜索结果中的展示。';
    if (/Desc 模板|模板雷同/i.test(t)) return '列表或聚合页的页面摘要存在模板化雷同，可能导致摘要同质化并削弱点击率。';
    if (/TDK ✓|全 ✓|^全 ✓$/i.test(t) || /^全 ✓/.test(t)) return '页面标题、摘要与网址规范化相关设置整体完整，未发现明显冲突。';
    if (/Title 核心词位置偏后/i.test(t)) return '标题中核心关键词出现位置偏后，不利于在搜索结果中获得更强的相关性展示。';
    if (/根路径|N\/A/i.test(t)) return '该页面为品牌或泛意图落地页，网址中的关键词包含度可按策略放宽，但仍需保证页面摘要与正文意图一致。';
    return `针对页面标题、摘要与收录相关设置：${clean(t)}。`;
  }
  if (dimKey === 'B') {
    if (/双 H1/i.test(t)) return '页面结构检测到可能存在多个 H1 或并列主标题的情况，不利于搜索引擎理解页面唯一主题。';
    if (/H1 ✓|唯一 H1|子标题含词/i.test(t) && !/⚠|风险|未/i.test(t)) return '页面具备唯一且语义清晰的 H1，副标题层级能够覆盖相关长尾意图。';
    if (/对齐 ⚠|H1 与类目/i.test(t)) return '页面主标题（H1）与类目或检索意图的对齐度仍有优化空间，建议统一措辞与关键词焦点。';
    if (/未含完整核心词/i.test(t)) return '副标题尚未完整覆盖目标关键词短语，可能影响长尾查询下的语义相关性。';
    return `针对标题层级与语义覆盖：${clean(t)}。`;
  }
  if (dimKey === 'C') {
    if (/堆砌|密度偏高/i.test(t)) return '正文存在关键词堆砌或可读性下降的迹象，需在自然语气与排名信号之间重新平衡。';
    if (/偏短/i.test(t)) return '正文信息量偏短，可能不足以支撑目标查询的商业或信息意图。';
    if (/字数 OK|≥500|意图覆盖 ✓/i.test(t) && !/风险|堆砌/i.test(t)) return '正文长度与关键词意图总体匹配，段落结构能够支撑当前落地场景。';
    if (/字数边缘|踩线/i.test(t)) return '正文长度处于建议区间的边缘，可通过补充案例、FAQ 等板块增强完整度。';
    return `针对正文与关键词意图：${clean(t)}。`;
  }
  if (dimKey === 'D') {
    if (/404|死链|缺少 datePublished|BlogPosting ⚠/i.test(t)) return '结构化信息或站内链接存在需要优先处理的问题（例如失效链接、必填发布时间未填写），可能影响富摘要展示与抓取效率。';
    if (/gallery.*alt|缺 alt/i.test(t)) return '媒体资源中存在缺少替代文本的图片，不利于无障碍与图片搜索流量。';
    if (/Organization ✓|ContactPage ✓|ItemList ✓|CollectionPage ✓|AboutPage ✓/i.test(t) && !/⚠|缺|404/i.test(t)) return '结构化信息类型与页面内容匹配良好，主要字段齐全。';
    if (/canonical|分页/i.test(t)) return '分页或规范化标签仍需与站点模板策略对齐，以避免索引分散或重复收录。';
    return `针对结构化信息、图片与内链：${clean(t)}。`;
  }
  return clean(t) || '—';
}

function onPageDimDefaultSuggestion(dimKey) {
  const map = {
    A: '优先在「标题与摘要」页签调整标题长度、统一页面摘要与网址相关信号，并在发布后复查收录状态。',
    B: '在「标题层级」页签确认主标题唯一，并理顺各级小标题的主题层次，避免重复主主张。',
    C: '结合关键词页签校验意图词分布与自然可读性，必要时扩展段落信息架构。',
    D: '补齐结构化信息中的必填项与图片说明文字，修复失效内链并完成一次校验。',
  };
  return map[dimKey] || '请结合对应页签逐项修复后重新检测。';
}

/** Wincher 风格：问题(红) / 建议(橙) / 通过(绿)；维度分组参考 wincher.com 页面得分 */
function onPageWincherLvFromRaw(raw) {
  const t = String(raw || '');
  if (/404|死链|双 H1|缺少 datePublished|BlogPosting ⚠|严重|critical/i.test(t)) return 'issue';
  if (/^全 ✓$/i.test(t.trim()) || /^TDK ✓/i.test(t)) return 'pass';
  if (/✓/i.test(t) && !/⚠|略|偏|缺|模板|风险|待|BlogPosting|堆砌/i.test(t)) return 'pass';
  if (/⚠|略|偏|缺|模板|风险|待|BlogPosting|堆砌|404/i.test(t)) return 'advice';
  return 'advice';
}

function onPageWincherLvFromIssueLv(lv) {
  if (lv === 'critical') return 'issue';
  if (lv === 'warning') return 'advice';
  return 'pass';
}

function onPageWincherWorst(ws) {
  const a = Array.isArray(ws) ? ws : [];
  if (a.includes('issue')) return 'issue';
  if (a.includes('advice')) return 'advice';
  return 'pass';
}

function onPageWincherBadgeHTML(w) {
  const map = {
    issue: ['严重', 'onpage-wc-badge onpage-wc-badge--issue'],
    advice: ['建议', 'onpage-wc-badge onpage-wc-badge--advice'],
    pass: ['通过', 'onpage-wc-badge onpage-wc-badge--pass'],
  };
  const x = map[w] || map.advice;
  return `<span class="${x[1]}">${x[0]}</span>`;
}

function onPageWincherCheckHTML(w, title, detail) {
  const rowCls = w === 'issue' ? 'onpage-wc-row onpage-wc-row--issue' : w === 'advice' ? 'onpage-wc-row onpage-wc-row--advice' : 'onpage-wc-row onpage-wc-row--pass';
  const ic = w === 'issue' ? '✕' : w === 'advice' ? '!' : '✓';
  return `<div class="${rowCls}"><span class="onpage-wc-ic" aria-hidden="true">${ic}</span><div class="onpage-wc-row-main"><div class="onpage-wc-row-title">${escapeHtmlStr(title)}</div><div class="onpage-wc-row-detail">${escapeHtmlStr(detail)}</div></div>${onPageWincherBadgeHTML(w)}</div>`;
}

function onPageWincherGroupHTML(dot, name, subtitle, checksHtml) {
  return `<details class="onpage-wc-group" open><summary class="onpage-wc-sum"><span class="onpage-wc-sum-inner"><span class="onpage-wc-dot onpage-wc-dot--${dot}"></span><span class="onpage-wc-sum-txt"><strong>${escapeHtmlStr(name)}</strong><span class="onpage-wc-sum-sub">${escapeHtmlStr(subtitle)}</span></span></span><button type="button" class="onpage-wc-sum-vis" title="展示或隐藏该维度检测项" aria-expanded="true" onmousedown="event.preventDefault();" onclick="onPageToggleWcGroupFromBtn(event,this)"><svg class="onpage-wc-sum-vis-svg" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M5 7.5L10 12.5L15 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></summary><div class="onpage-wc-gr-body">${checksHtml}</div></details>`;
}

window.onPageToggleWcGroupFromBtn = function (e, btn) {
  e.preventDefault();
  e.stopPropagation();
  const det = btn.closest('details');
  if (det) {
    det.open = !det.open;
    btn.setAttribute('aria-expanded', det.open ? 'true' : 'false');
  }
};

window.onPageSetDiagSev = function (s) {
  state.onPageDiagSev = state.onPageDiagSev === s ? null : s;
  renderDrawer();
};

function onPageWincherCollectModel(row) {
  if (typeof onPageWincherCollectModelV7 === 'function') return onPageWincherCollectModelV7(row);
  return { groups: [], extra: [] };
}

/** 将 AI 测评结果合并进 Wincher 规则行：在相关常规项上加重程度并附 AI 摘要（不单独展示 AI 子分数） */
function onPageWincherModelMergedWithAiAudit(baseModel, row) {
  const d = row && row._onPageAiAuditDemo;
  const groups = baseModel.groups.map(g => ({
    ...g,
    checks: g.checks.map(c => ({ ...c })),
  }));
  const extra = baseModel.extra.map(c => ({ ...c }));
  if (!d || !Array.isArray(d.modules)) return { groups, extra };
  const mod = k => (d.modules || []).find(x => x.applyKey === k);
  const bump = (gid, titleExact, aiMod) => {
    if (!aiMod || aiMod.aiScore == null) return;
    const sc = Number(aiMod.aiScore);
    if (sc >= 72) return;
    const g = groups.find(x => x.id === gid);
    if (!g) return;
    const hard = sc < 55;
    const target = hard ? 'issue' : 'advice';
    g.checks.forEach(c => {
      if (c.title !== titleExact) return;
      c.sev = onPageWincherWorst([c.sev, target]);
      const rawAi = String(aiMod.aiText || '').trim();
      const shortAi = rawAi.slice(0, 56);
      const suf = rawAi ? `（AI 复核：${shortAi}${rawAi.length > 56 ? '…' : ''}）` : '（AI 复核：待优化）';
      if (!String(c.detail).includes('（AI 复核')) c.detail = `${c.detail}${suf}`;
    });
    g.dot = onPageWincherWorst(g.checks.map(ch => ch.sev));
  };
  bump('title', 'Title 目标词', mod('tdk'));
  bump('meta', 'Meta 目标词', mod('tdk'));
  bump('headings', 'H1 目标词', mod('headings'));
  bump('body', '文题一致', mod('body'));
  bump('media', 'Alt非空', mod('images'));
  const sch = mod('schema');
  const soc = mod('social');
  let techMod = null;
  if (sch && sch.aiScore != null && soc && soc.aiScore != null) {
    techMod = Number(sch.aiScore) <= Number(soc.aiScore) ? sch : soc;
  } else techMod = sch || soc;
  bump('code', '结构化数据', techMod);
  return { groups, extra };
}

function onPageWincherStatsByDim(model) {
  const dims = ['title', 'meta', 'headings', 'body', 'media', 'url', 'code', 'detail'];
  const z = () => ({ issue: 0, advice: 0, pass: 0 });
  const m = {};
  dims.forEach(d => { m[d] = z(); });
  model.groups.forEach(g => {
    g.checks.forEach(c => { m[g.id][c.sev]++; });
  });
  model.extra.forEach(c => { m.detail[c.sev]++; });
  return m;
}

function onPageWincherDiagFiltersHTML(model) {
  const st = onPageWincherStatsByDim(model);
  const dimOrder = ['title', 'meta', 'headings', 'body', 'media', 'url', 'code', 'detail'];
  const icons = {
    issue: '<span class="onpage-diag-sev-ic onpage-diag-sev-ic--issue" aria-hidden="true">✕</span>',
    advice: '<span class="onpage-diag-sev-ic onpage-diag-sev-ic--advice" aria-hidden="true">!</span>',
    pass: '<span class="onpage-diag-sev-ic onpage-diag-sev-ic--pass" aria-hidden="true">✓</span>',
  };
  const sevBtns = ['issue', 'advice', 'pass'].map(id => {
    let n = 0;
    dimOrder.forEach(d => { n += st[d][id]; });
    const act = state.onPageDiagSev === id ? ' active' : '';
    const lab = id === 'issue' ? '严重' : id === 'advice' ? '建议' : '通过';
    if (id === 'pass' && n === 0) return '';
    return `<button type="button" class="onpage-img-filter-btn onpage-diag-sev-filt-btn onpage-diag-sev-filt-btn--${id}${act}" onclick="onPageSetDiagSev('${id}')" title="${escapeAttr(lab + '（' + n + '），点击筛选；再次点击取消')}">${icons[id]}<span class="onpage-diag-sev-count">${n}</span></button>`;
  }).join('');
  return `<div class="onpage-diag-filters onpage-diag-filters--sev-only">
    <div class="onpage-img-filter-toggle onpage-diag-sev-toggle" role="group" aria-label="按程度筛选">${sevBtns}</div>
  </div>`;
}

function matchesOnPageDiag(dSpec, sev, dimFilter, sevFilter) {
  if (dimFilter && dimFilter !== dSpec) return false;
  if (sevFilter && sevFilter !== sev) return false;
  return true;
}

function onPageWincherDiagnoseFilteredHTML(model, row) {
  const sevF = state.onPageDiagSev;
  const banner = sevF
    ? `<div class="onpage-wc-filter-banner">当前筛选：<strong>${sevF === 'issue' ? '严重' : sevF === 'advice' ? '建议' : '通过'}</strong></div>`
    : '';
  const body = typeof onPageDiagnoseProductHTML === 'function'
    ? onPageDiagnoseProductHTML(row, escapeHtmlStr, { model, sevFilter: sevF })
    : '<p class="onpage-wc-empty">检测模块未加载</p>';
  return `<div class="onpage-wc-root">${banner}${body}</div>`;
}

function onPageOptSuggestFromDiag(row, area, dismissKey) {
  const items = typeof onPageDiagSuggestByArea === 'function' ? onPageDiagSuggestByArea(row, area) : [];
  if (!items.length) return '';
  return onPageOptSuggestHTML('优化建议', items, dismissKey || `suggest-${area}`);
}

function onPageAiAuditSummaryStripHTML(row) {
  const d = row && row._onPageAiAuditDemo;
  if (!d) return '';
  return `<div class="onpage-ai-audit-strip" role="status">
    <span class="onpage-ai-audit-strip-ic" aria-hidden="true">${AI_REC_SVG}</span>
    <span class="onpage-ai-audit-strip-lbl">AI 测评</span>
    <span class="badge badge-blue onpage-ai-audit-strip-score"><strong>${escapeHtmlStr(String(d.score))}</strong> 分</span>
    <time class="onpage-ai-audit-strip-at">${escapeHtmlStr(d.at)}</time>
    <span class="onpage-ai-audit-strip-sum">${escapeHtmlStr(d.summary)}</span>
  </div>`;
}

function onPageAiAuditModulesForGroup(row, groupId) {
  const d = row && row._onPageAiAuditDemo;
  if (!d || !Array.isArray(d.modules)) return [];
  const map = { title: ['tdk'], meta: ['tdk'], headings: ['headings'], body: ['body'], media: ['images'], url: ['tdk'], code: ['schema', 'social'] };
  const keys = map[groupId] || [];
  return d.modules.filter(m => keys.includes(m.applyKey));
}

function onPageAiAuditSingleModuleHTML(m) {
  const applied = m.applied ? '<span class="onpage-wc-badge onpage-wc-badge--pass">已应用</span>' : '';
  const titleHtml = `<span class="onpage-wc-ai-mark">AI</span><span class="onpage-wc-ai-mod-name">${escapeHtmlStr(m.title)}</span>`;
  const insight = `<div class="onpage-wc-row onpage-wc-row--ai-rec onpage-wc-row--ai-soft">
    <span class="onpage-wc-ic onpage-wc-ic--ai" aria-hidden="true">✦</span>
    <div class="onpage-wc-row-main">
      <div class="onpage-wc-row-title">${titleHtml}</div>
      <div class="onpage-wc-row-detail">${escapeHtmlStr(m.aiText || '—')}</div>
    </div>
    ${applied ? `<div class="onpage-wc-ai-applied-wrap">${applied}</div>` : ''}
  </div>`;
  const recBlock = m.needApply && m.applyKey && !m.applied
    ? `<div class="onpage-wc-row onpage-wc-row--advice onpage-wc-row--ai-rec onpage-wc-row--ai-rec-value">
    <span class="onpage-wc-ic" aria-hidden="true">!</span>
    <div class="onpage-wc-row-main">
      <div class="onpage-wc-row-title">推荐值</div>
      <div class="onpage-wc-row-detail">${escapeHtmlStr(m.recPreview || '—')}</div>
    </div>
    <button type="button" class="btn-primary btn-sm" onclick='onPageAiAuditApplyOpenEditor(${JSON.stringify(String(m.applyKey || ''))})'>应用</button>
  </div>`
    : '';
  return insight + recBlock;
}

function onPageAiAuditBlocksForWcGroupHTML(row, groupId) {
  const mods = onPageAiAuditModulesForGroup(row, groupId);
  if (!mods.length) return '';
  return `<div class="onpage-wc-ai-wrap">${mods.map(onPageAiAuditSingleModuleHTML).join('')}</div>`;
}

function onPageWincherDiagnoseHintsHTML(row) {
  const hints = [];
  if ((row.title || '').length > 60) hints.push('页面标题偏长：建议压缩到 30–60 个字符内，并把最重要的词放在前面。');
  const md = row.metaDesc || '';
  if (!md || md.includes('待同步')) hints.push('页面摘要建议单独撰写约 120–160 个字，清楚说明本页提供什么、适合谁。');
  if (row.issuesDetail && row.issuesDetail.length) hints.push(`下方共有 ${row.issuesDetail.length} 条详细说明，可先按上方「问题 / 建议 / 通过」筛选后逐项处理。`);
  if (!hints.length) return '';
  return onPageOptSuggestHTML('优化建议', hints, 'suggest-diag');
}

function onPageDiagToolbarHTML(row, model) {
  const displayScore = typeof onPageDimTotal === 'function' ? onPageDimTotal(row) : (row.score != null ? row.score : '—');
  const filt = onPageWincherDiagFiltersHTML(model);
  const scoreBox = `<div class="onpage-diag-score-hero" aria-label="页面得分">
    <span class="onpage-diag-score-hero-lbl">页面得分</span>
    <div class="onpage-diag-score-hero-num"><strong>${displayScore}</strong><span class="onpage-diag-score-hero-cap">/ 100</span></div>
  </div>`;
  return `<div class="onpage-diag-toolbar-row onpage-diag-toolbar-row--full onpage-diag-toolbar--minimal">
    ${scoreBox}
    <div class="onpage-diag-toolbar-filters">${filt}</div>
  </div>`;
}

function onPageWincherDiagnoseHTML(row) {
  const idx = (DB.onPageSeoPages || []).indexOf(row);
  const scanning = idx >= 0 && state.onPageSeoAuditRefreshing && state.onPageSeoAuditRefreshing[idx];
  if (scanning) {
    return `<div class="onpage-audit-scanning" role="status" aria-live="polite">
      <div class="onpage-audit-scanning-ring" aria-hidden="true"></div>
      <p class="onpage-audit-scanning-txt">正在检测当前页面…</p>
      <p class="onpage-audit-scanning-sub">检测频率以技术评估为准，演示约 0.7 秒</p>
    </div>`;
  }
  const base = onPageWincherCollectModel(row);
  const model = onPageWincherModelMergedWithAiAudit(base, row);
  return onPageDiagToolbarHTML(row, model) + onPageWincherDiagnoseFilteredHTML(model, row);
}

/** 提示词规定的页面类型 / 搜索意图（JSON 值使用中文枚举） */
const ONPAGE_AI_PROMPT_PAGE_TYPES = [
  '首页', '文章分类页', '产品分类页', '文章详情页', '产品详情页', '营销落地页', '营销转化页', '客户案例页', '联系/关于页', '标签页', '资源页',
];
const ONPAGE_AI_PROMPT_INTENTS = ['信息性', '商业性', '交易性', '导航性'];
const ONPAGE_AI_PAGE_TYPE_ZH_BY_ID = {
  homepage: '首页',
  'article-cat': '文章分类页',
  'product-cat': '产品分类页',
  'article-detail': '文章详情页',
  'product-detail': '产品详情页',
  'marketing-lp': '营销落地页',
  'marketing-cv': '营销转化页',
  'case-study': '客户案例页',
  'about-contact': '联系/关于页',
  'tag-page': '标签页',
  resource: '资源页',
};

/** AI 测评维度（对齐新版提示词 JSON，非规则 SEO） */
const ONPAGE_AI_DIMENSIONS = [
  { id: 'pageIntent', title: '搜索意图匹配' },
  { id: 'quality', title: '内容质量' },
  { id: 'coverage', title: '主题覆盖度' },
  { id: 'eeat', title: 'E-E-A-T' },
  { id: 'conversion', title: '转化优化' },
  { id: 'gap', title: '语义完整性 / 内容缺口' },
];

const ONPAGE_AI_INTENT_MATCH_HINT = '意图匹配度（0–100%）：90–100 高度满足；70–89 基本满足；50–69 部分满足；0–49 意图错配。为匹配百分比，不同于综合得分及各维度百分制评分。';

const ONPAGE_AI_DIM_HINTS = {
  pageIntent: '识别页面类型（中文枚举）与主搜索意图（信息性/商业性/交易性/导航性），评估可见内容与意图的一致性。',
  quality: '信息深度、完整性、专业性、原创性、可读性（各 20 分，合计 100）。不评估 Title 长度、Meta 是否存在等规则项。',
  coverage: '核心实体、使用场景、用户问题、解决方案四类覆盖（各 25 分）。下列清单为已覆盖/待补充主题。',
  eeat: 'Experience / Expertise / Authority / Trust 各 25 分。仅标注页面可见内容中缺失的信任信号，不虚构。',
  conversion: '价值主张、CTA 清晰度、信任建设、行动阻力各 25 分；含 CTA 位置/目的结构化分析（非规则检测）。',
};

const ONPAGE_AI_INTRO_PAGE_TYPES = new Set(['产品详情页', '文章详情页', '营销落地页', '营销转化页', '客户案例页']);
const ONPAGE_AI_H2_PAGE_TYPES = new Set(['文章详情页', '产品详情页', '营销落地页', '营销转化页']);
const ONPAGE_AI_CTA_PAGE_TYPES = new Set(['产品详情页', '营销落地页', '营销转化页', '客户案例页']);

const ONPAGE_AI_RESULT_SUB_TABS = [
  { id: 'overview', label: '总览' },
  { id: 'eval', label: '维度评估' },
  { id: 'gap', label: '内容缺口' },
  { id: 'growth', label: '增长机会' },
  { id: 'assets', label: 'SEO优化推荐' },
];

/** www.rhhardware.com 首页 · 提示词输出结构演示（assessment_summary + detailed_evaluations + growth + generated_assets） */
const RH_HARDWARE_HOME_AI_AUDIT = {
  assessment_summary: {
    page_type: '首页',
    search_intent: '商业性',
    intent_match_score: 76,
    overall_ai_score: 74,
    executive_summary: '首页 B2B 出口定位清晰，商业性意图下规格对比与 FAQ 覆盖不足，拉低主题与语义完整度。转化与 E-E-A-T 尚可；CTA 有基础询盘路径但首屏价值主张偏弱。建议优先应用英文 TDK/H1，补齐内容缺口模块与 FAQ，并在首屏强化报价类 CTA 位置（见转化分析）。',
  },
  detailed_evaluations: {
    content_quality: {
      score: 72,
      strengths: [
        '首页清晰传达 B2B 橱柜五金、铰链与紧固件出口定位',
        '产品分类入口完整（铰链、滑轨、拉手等），便于采购商快速分流',
        '多语言/多市场线索与工厂能力描述增强专业感',
      ],
      weaknesses: [
        '部分模块文案偏模板化，信息密度在「优势—规格—应用」链路上不够连贯',
        '缺少可验证的一手数据（产能、质检通过率、典型客户行业分布）',
        '首屏价值主张与下方产品网格的叙事衔接偏弱',
      ],
    },
    topic_coverage: {
      score: 68,
      covered_topics: [
        '橱柜铰链与五金出口',
        '批量定制与 MOQ',
        '材质与表面处理（不锈钢/镀锌等）',
        '应用场景（橱柜、家具、工程项目）',
      ],
      missing_topics: [
        '安装与维护指南（Installation & Maintenance）',
        '行业标准与认证详解（ISO、SGS、CE 等可验证说明）',
        '竞品/替代方案对比（软关闭 vs 普通铰链等）',
        '交期、物流与售后 SLA 的集中说明',
        '工程案例或 OEM/ODM 流程拆解',
      ],
    },
    eeat: {
      score: 71,
      missing_signals: [
        '缺少署名专家或技术负责人背书（Experience / Expertise）',
        '客户案例、第三方评测或可追溯的订单/合作证明展示不足',
        '「关于我们」与首页信任要素未形成闭环（年限、产线、认证应首屏可见）',
        '内容更新日期或「最后核验规格」类信号不明显',
      ],
    },
    conversion_optimization: {
      score: 79,
      barriers: [
        '主 CTA「询盘/联系」与产品浏览路径并行，首屏未重复 MOQ/交期承诺',
        '表单或联系入口分散在页脚，中段缺少轻量「索取规格表」触点',
        '信任徽章（认证、合作品牌）未紧邻 CTA 区域',
      ],
      actionable_fixes: [
        '首屏强化 Request Quotation 类 CTA，旁注响应时效与 MOQ 区间',
        '产品分类区上方增加规格 PDF 次级转化触点',
        'CTA 邻近区域集中展示可见的认证与客户行业标签',
      ],
    },
    cta_analysis: {
      existing_cta_strength: '页脚与导航存在联系/询盘入口，但首屏 Above the Fold 未突出报价价值与 MOQ 承诺。',
      missing_positions: [
        'Hero Section — 主报价 CTA',
        'After Benefits Section — 规格表下载',
        'Before FAQ — 轻量询价入口',
      ],
      recommendation: '首页属商业性意图：建议在 Hero 放置「Get a Free Quote」类 CTA（目的地类型 Quote Form），分类列表上方增加 Download Resource 次级按钮；不虚构 URL，仅标注位置与目的。',
    },
  },
  content_gap_analysis: {
    missing_entities: [
      '软关闭铰链（soft-close hinge）作为独立实体模块',
      '出口包装与打托（export packaging）说明',
      '典型承重等级（load rating）对照',
    ],
    missing_use_cases: [
      '工程批量采购 vs 经销商补货的场景分流',
      '潮湿环境/沿海项目的材质选型说明',
    ],
    missing_faq_topics: [
      'MOQ 与交期组合询价',
      '认证文件获取路径',
      '非标定制流程',
    ],
    missing_trust_signals: [
      '首屏可见的产线/质检流程摘要',
      '可下载的合规文件入口紧邻 CTA',
      '客户行业标签（家具/橱柜/工程）',
    ],
  },
  growth_opportunities: [
    {
      priority: 'high',
      insight: '商业性意图下，采购商在「对比规格—确认 MOQ—询价」链路易流失；首页缺少结构化对比与 FAQ。',
      actionable_recommendation: '在首页增加「选型对照」内容模块（材质×承重×开启角度），并内链至核心产品分类页。',
    },
    {
      priority: 'high',
      insight: 'soft close hinge wholesale、cabinet hinge supplier 等与首页主题高度相关，但正文语义实体露出不足。',
      actionable_recommendation: '在分类入口与模块标题中自然嵌入核心短语；FAQ 落地后为 JSON-LD 增加 FAQPage。',
    },
    {
      priority: 'medium',
      insight: 'E-E-A-T 信号分散在 About 与页脚，首页未承接「工厂是否可靠」的决策问题。',
      actionable_recommendation: '首屏下增加「工厂实景 + 质检流程」折叠区，仅链向已有认证 PDF（不虚构数据）。',
    },
  ],
  generated_assets: {
    optimized_title: 'Cabinet Hinges & Hardware Supplier - RHHardware',
    optimized_meta_description: 'Source stainless cabinet hinges, slides and fasteners in bulk from RHHardware. Export-ready specs, flexible MOQ and fast B2B quotation. Request a quote today.',
    recommended_meta_keywords: [
      'cabinet hinges supplier',
      'soft close hinge wholesale',
      'furniture hardware export',
      'stainless hinge MOQ',
      'drawer slide manufacturer',
      'B2B cabinet hardware',
    ],
    optimized_h1: 'Precision Cabinet Hardware for Global B2B Buyers',
    optimized_intro_paragraph: null,
    recommended_h2_sections: [],
    recommended_cta_copy: [],
    recommended_faqs: [
      {
        question: 'What is the typical MOQ for cabinet hinges?',
        answer: 'MOQ varies by series and finish; submit your SKU list for an exact MOQ and lead time quote.',
      },
      {
        question: 'Do you provide specification sheets for bulk orders?',
        answer: 'Yes—product pages include spec summaries; contact sales for a consolidated catalog PDF.',
      },
      {
        question: 'Which certifications apply to your hardware lines?',
        answer: 'Scope depends on product line and market—see category documentation or ask your account manager.',
      },
    ],
    json_ld_schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'RHHardware',
          url: 'https://www.rhhardware.com',
          description: 'B2B manufacturer and exporter of cabinet hinges, slides and furniture hardware.',
        },
        {
          '@type': 'WebSite',
          name: 'RHHardware',
          url: 'https://www.rhhardware.com',
          publisher: { '@type': 'Organization', name: 'RHHardware' },
        },
      ],
    },
  },
};

/** www.rhhardware.com · 1JO JIC 液压适配器产品详情页（提示词 JSON 演示） */
const RH_HARDWARE_PRODUCT_JIC_AI_AUDIT = {
  assessment_summary: {
    page_type: '产品详情页',
    search_intent: '交易性',
    intent_match_score: 68,
    overall_ai_score: 71,
    executive_summary: '该页为 1JO JIC Male 74° Cone / SAE O-Ring Boss 六角适配器产品详情，交易性意图明确：可见询盘表单、品牌 RH、型号 Code 1JO 与「100% testing before delivery」质量承诺。但主文仅重复标题与一句定制说明，缺少压力等级、螺纹尺寸、材质/表面处理、标准对照表等采购决策信息；H1 与 Title 语义几乎相同，主题覆盖与语义完整度偏弱。页内已有 5 条 FAQ（安装安全、定制、快换选型、标准兼容、维护），可支撑 FAQPage；建议优先补充规格模块、英文 TDK/H1 差异化，并在 Hero 强化 Quote 类 CTA。',
  },
  detailed_evaluations: {
    search_intent_analysis: {
      score: 68,
      primary_user_goal: '确认 1JO JIC×SAE O-Ring Boss 适配器规格是否匹配现有液压回路，并发起批量询价或 OEM 定制。',
      current_content_focus: '产品名称、品牌 Code、一句定制能力与包装说明，以及通用 FAQ 与询盘表单。',
      intent_gap: '交易阶段用户需要的可核对技术参数（螺纹、密封面、压力、材质）未在首屏与正文集中呈现。',
      missing_information: [
        '公制/英制螺纹尺寸与 74° cone、O-Ring Boss 密封面对照',
        '工作压力/温度范围或适用介质说明',
        '碳钢/不锈钢等材质与表面处理选项',
        '与 SAE/ISO/DIN 标准的对照或兼容性列表',
      ],
      recommendation: '在标题下方增加「Specifications」表格：列出 Thread、Seal Type、Material、Working Pressure、Standard；首段用 80–100 词说明适配场景（SAE 法兰至 JIC 硬管），并链至同系列 Related Products。',
    },
    content_quality: {
      score: 64,
      strengths: [
        'H1 与 URL 清晰包含 JIC Male 74° Cone、SAE O-Ring Boss、hexagon adapter 等核心实体',
        '可见「100% testing before delivery」与包装方式（thread cap + carton + pallet）体现质检与出口包装意识',
        '页面底部 FAQ 覆盖安全安装、定制、标准兼容与维护，有助于降低采购商疑虑',
      ],
      weaknesses: [
        '主产品描述仅重复标题并加一句「可定制」，信息深度不足以支撑 B2B 比价',
        '「5 0 Reviews」展示为占位，无真实评价内容，对信任无实质帮助',
        'Hot Keywords 区块堆砌内链词，稀释主产品语义焦点',
      ],
      recommendation: '将首屏下主文扩写为：应用场景（SAE 泵/阀至 JIC 硬管）、材质与检测流程、MOQ/交期询价路径；移除或下沉无数据的 Reviews 占位。',
    },
    topic_coverage: {
      score: 62,
      covered_topics: [
        'JIC Male 74° Cone 液压适配器',
        'SAE O-Ring Boss 接口',
        '六角（hexagon）扳手面结构',
        'OEM/定制能力（customers requirement）',
        '出口包装与发货前全检',
      ],
      missing_topics: [
        {
          topic: '技术规格表（压力/温度/螺纹）',
          importance: 'high',
          reason: '交易性检索用户需先核对是否匹配现有回路，缺表导致跳出至竞品。',
          recommendation: '新增 Specifications 表：Thread size、Seal、Material、Max working pressure、Standard reference（SAE J514 等仅在有页面依据时列出）。',
        },
        {
          topic: '材质与表面处理选项',
          importance: 'high',
          reason: '液压件采购常按 45# 钢、镀锌或不锈钢筛选，当前正文未说明。',
          recommendation: '在规格区增加 Material / Finish 行，并链至工厂「45# Steel Hydraulic Adapters」类新闻作内部佐证（不虚构认证）。',
        },
        {
          topic: '安装扭矩与密封注意事项',
          importance: 'medium',
          reason: 'FAQ 虽提及安全与泄漏，但未与本 SKU 的安装步骤关联。',
          recommendation: '在 FAQ 首条补充本型号拧紧步骤与 O-Ring 检查要点，并配示意图（使用站内已有产品图）。',
        },
      ],
      topic_depth_assessment: '核心产品名覆盖充分，但子主题（规格、材质、标准对照、安装）深度不足，难以满足交易型长尾检索。',
      recommendation: '按「规格 → 应用 → 质检包装 → 询价」顺序重组正文模块，并内链至 SAE Standard Hydraulic Adapters 分类页。',
    },
    semantic_completeness: {
      score: 60,
      covered_entities: ['1JO', 'JIC Male', '74° Cone', 'SAE O-Ring Boss', 'hexagon adapter', 'RHHardware / RH brand'],
      missing_entities: ['具体螺纹规格（如 7/16-20 等，页面未给出）', '密封件材质（NBR/FKM）', '工作压力等级'],
      covered_attributes: ['Brand: RH', 'Code: 1JO', 'Customization', '100% testing', 'Export packing'],
      missing_attributes: ['Dimensions', 'Weight', 'Pressure rating', 'Temperature range', 'Compatible hose/tube size'],
      covered_use_cases: ['液压管路转接（概括性）', '出口批发包装'],
      missing_use_cases: ['SAE 法兰至 JIC 硬管过渡', '工程机械/农机液压维护更换', 'OEM 小批量试制'],
      recommendation: '在正文中显式写出 2–3 个典型 use case 段落，并与 Related Products（1JG9、1JB-WD 等）建立语义关联。',
    },
    eeat: {
      score: 66,
      experience_signals: ['工厂新闻与产品类目显示长期从事液压管件（站内可见）'],
      expertise_signals: ['FAQ 提及压力测试、扭矩与 ISO/SAE/DIN 标准兼容（通用表述）'],
      authority_signals: ['Yuyao Ruihua Hardware Factory 联系信息与地址在页脚可见'],
      trust_signals: ['100% testing before delivery', '询盘表单与电话/邮箱', 'FAQ 解答定制与标准兼容'],
      missing_signals: [
        '本 SKU 可下载的规格 PDF 或数据表',
        '针对 1JO 系列的第三方检测/标准文件链接（页面未展示）',
        '可验证的客户案例或应用行业标签紧邻产品区',
      ],
      recommendation: '在 CTA 旁增加「Request Spec Sheet」入口；将 Contact Us 中的工厂地址与质检承诺摘要复制到产品区（不新增虚构认证）。',
    },
    conversion_optimization: {
      score: 74,
      value_proposition_clarity: '「可定制」与全检包装有提及，但 MOQ、交期、响应时效未与主产品绑定。',
      trust_level: '中等：有 FAQ 与工厂联系方式，但评价区为空、规格不透明削弱信任。',
      cta_effectiveness: 'Send Inquiry 表单完整，但 Hero 产品图下缺少主报价按钮，用户需滚动至表单。',
      friction_points: [
        '规格信息缺失导致用户不敢提交询盘',
        'Subject/Content 必填但无预填 SKU（1JO / pd508135）',
        'Related Products 在表单之后，分流注意力',
      ],
      lost_conversion_opportunities: [
        '未在 Above the Fold 提供 Quote CTA',
        '未提供规格表下载以降低首次询盘门槛',
      ],
      actionable_fixes: [
        'Hero 增加「Get a Free Quote」主按钮，跳转或锚点至询盘表单并预填 Product: 1JO',
        '表单上方增加 SKU/Code 只读字段与 MOQ 提示',
        '在 FAQ 后增加次要 CTA「Talk to an Expert」',
      ],
    },
    competitor_gap_estimation: {
      likely_competitor_topics: ['完整规格 PDF', '材质与压力对照表', '安装扭矩表', '同系列交叉参考图'],
      missing_competitor_elements: ['可筛选的 Thread size 参数', 'Stock/Availability 具体说明（当前仅 Availability 空表）'],
      estimated_disadvantage: '采购商在比价阶段更倾向信息完整的 SKU 页，当前页易被视为「目录占位」。',
      recommendation: '优先补齐规格表与 Availability/MOQ 说明，再扩展 FAQ 至本型号安装细节。',
    },
    cta_analysis: {
      existing_cta_strength: '页内「Send Inquiry」表单字段齐全，但位于内容区中后部，首屏无明确报价行动。',
      missing_positions: [
        'Hero Section — Get a Free Quote',
        'After Introduction — Download Spec Sheet',
        'Before FAQ — Product Inquiry',
      ],
      recommendation: '产品详情页属交易性：Hero 使用 Quote Form；规格区后增加 Download Resource；FAQ 前重复轻量询价入口。',
    },
  },
  content_gap_analysis: {
    missing_entities: [
      { item: 'Thread size（英制/公制）', importance: 'high', reason: '页面未列出具体螺纹尺寸，无法完成选型。', recommendation: '在 Specifications 表首列补充 Thread 参数。' },
      { item: 'Seal / O-Ring material', importance: 'high', reason: 'SAE O-Ring Boss 依赖密封件材质信息。', recommendation: '增加 Seal type 与可选 FKM/NBR 说明（仅在有依据时）。' },
      { item: 'Working pressure rating', importance: 'high', reason: '液压采购核心决策因子缺失。', recommendation: '标注 Max working pressure 与测试标准引用。' },
    ],
    missing_subtopics: [
      { item: 'SAE 至 JIC 过渡应用场景', importance: 'medium', reason: '标题暗示转接用途，正文未展开。', recommendation: '增加 Application 小节并配示意图。' },
      { item: '安装扭矩与泄漏排查', importance: 'medium', reason: 'FAQ 为全站通用，未绑定 1JO。', recommendation: '改写 FAQ 首条并指向本型号。' },
    ],
    missing_use_cases: [
      { item: '工程机械液压管路维修更换', importance: 'medium', reason: '交易型用户常按设备维护场景检索。', recommendation: '在 Intro 中增加 1–2 句典型设备维护场景。' },
      { item: 'OEM 小批量试制', importance: 'low', reason: '页面虽提定制，但未说明打样流程。', recommendation: '在定制说明中补充 sampling/MOQ 询价步骤。' },
    ],
    missing_faq_topics: [
      { item: '1JO 与 1JG/1JB 系列选型差异', importance: 'medium', reason: 'Related Products 已列相似型号，但无对比说明。', recommendation: '新增 FAQ：何时选用 1JO vs 1JG9。' },
    ],
    missing_trust_signals: [
      { item: '可下载规格表', importance: 'high', reason: 'B2B 买家习惯先下载再询盘。', recommendation: '提供 Spec PDF 下载（可用现有产品图+参数表生成）。' },
      { item: '质检流程图示', importance: 'medium', reason: '「100% testing」缺少过程说明。', recommendation: '链至站内 Quality Matters 新闻或工厂页。' },
    ],
  },
  growth_opportunities: [
    {
      priority: 'high',
      opportunity_type: 'content_gap',
      expected_seo_impact: 'high',
      expected_conversion_impact: 'high',
      insight: 'URL 与 H1 已覆盖「JIC male 74 cone SAE O-RING BOSS adapter」长尾，但正文过薄导致排名与转化双损。',
      why_it_matters: '交易性查询用户需要可核对参数；薄内容页难以获得稳定排名，也难促成询盘。',
      actionable_recommendation: '新增 Specifications + Application 两模块，并在首段自然嵌入主词与 Code 1JO。',
    },
    {
      priority: 'high',
      opportunity_type: 'conversion_optimization',
      expected_seo_impact: 'medium',
      expected_conversion_impact: 'high',
      insight: '询盘表单存在但 Hero 无报价 CTA，且 Availability 表为空。',
      why_it_matters: '采购商常在首屏 10 秒内决定留弃；空库存表降低专业感。',
      actionable_recommendation: 'Hero 增加 Get a Free Quote；Availability 改为「Inquiry for stock」并预填 SKU。',
    },
    {
      priority: 'medium',
      opportunity_type: 'faq_expansion',
      expected_seo_impact: 'medium',
      expected_conversion_impact: 'medium',
      insight: '现有 5 条 FAQ 偏品牌级，未覆盖 1JO 安装与选型。',
      why_it_matters: 'FAQ 可捕获问题型长尾并支撑 FAQPage 富结果。',
      actionable_recommendation: '新增 2 条 SKU 级 FAQ，并输出 FAQPage JSON-LD（仅用可见问答）。',
    },
    {
      priority: 'medium',
      opportunity_type: 'internal_linking',
      expected_seo_impact: 'medium',
      expected_conversion_impact: 'low',
      insight: 'Related Products 与分类链接丰富，但 Hot Keywords 堆砌干扰主题。',
      why_it_matters: '内链应强化液压适配器主题集群，而非分散权重。',
      actionable_recommendation: '精简 Hot Keywords 为 3–4 个相关类目链接，其余移至页脚。',
    },
  ],
  generated_assets: {
    optimized_title: '1JO JIC Male 74° Cone SAE O-Ring Boss Adapter - RHHardware',
    optimized_meta_description: '1JO JIC male 74° cone to SAE O-ring boss hex adapter for hydraulic systems. RH code 1JO, 100% tested, export packing. Request a quote for MOQ and lead time.',
    recommended_meta_keywords: [
      'JIC male 74 cone adapter',
      'SAE O-ring boss fitting',
      '1JO hydraulic adapter',
      'hexagon hydraulic adapter',
      'JIC to SAE adapter',
      'hydraulic fittings manufacturer',
      'bulk hydraulic adapters',
    ],
    optimized_h1: '1JO JIC Male 74° Cone to SAE O-Ring Boss Hex Hydraulic Adapter',
    optimized_intro_paragraph: 'The 1JO adapter connects SAE O-ring boss ports to JIC male 74° cone assemblies for mobile and industrial hydraulic lines. RH supplies this hex body fitting with thread protection, carton-and-pallet export packing, and 100% pre-delivery testing. Share your thread size and quantity to confirm MOQ, lead time, and customization options.',
    recommended_h2_sections: [
      'Technical Specifications (Thread, Seal, Material, Pressure)',
      'SAE O-Ring Boss to JIC 74° Cone Applications',
      'Quality Testing & Export Packaging',
      'Customization & MOQ Inquiry',
      'Related 1J Series Hydraulic Adapters',
      'Installation & Maintenance Tips',
    ],
    recommended_cta_copy: [
      {
        cta_text: 'Get a Free Quote',
        recommended_position: 'Hero Section',
        destination_type: 'Quote Form',
        purpose: 'Product Inquiry',
        reason: 'Transactional intent: expose MOQ/lead time next to product image.',
      },
      {
        cta_text: 'Download Spec Sheet',
        recommended_position: 'After Benefits Section',
        destination_type: 'Download Resource',
        purpose: 'Resource Download',
        reason: 'Reduces friction before first inquiry; aligns with missing spec table.',
      },
      {
        cta_text: 'Send Inquiry',
        recommended_position: 'Before FAQ',
        destination_type: 'Quote Form',
        purpose: 'Lead Generation',
        reason: 'Captures users after reading FAQ trust content.',
      },
    ],
    recommended_faqs: [
      {
        question: 'What thread sizes are available for the 1JO JIC male 74° cone / SAE O-ring boss adapter?',
        answer: 'Submit your required thread and port details with quantity; RH will confirm available sizes and lead time for this 1JO series.',
      },
      {
        question: 'Is the 1JO adapter compatible with SAE and ISO hydraulic standards?',
        answer: 'RHHardware manufactures adapters to international standards (SAE, ISO, DIN). Confirm your port type and pressure rating when requesting a quote.',
      },
    ],
    json_ld_schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: '1JO JIC Male 74° Cone / SAE O-Ring Boss Hexagon Adapter',
      sku: '1JO',
      brand: { '@type': 'Brand', name: 'RH' },
      description: 'JIC male 74° cone to SAE O-ring boss hexagon hydraulic adapter. Customization available. 100% testing before delivery.',
      url: 'https://www.rhhardware.com/1JO-JIC-MALE-74-CONE-SAE-O-RING-BOSS-hexagon-adapter-pd508135.html',
      manufacturer: { '@type': 'Organization', name: 'Yuyao Ruihua Hardware Factory' },
    },
  },
};

function onPageAiSearchIntentLabel(v) {
  const map = {
    Informational: '信息性',
    Navigational: '导航性',
    'Commercial Investigation': '商业性',
    Commercial: '商业性',
    Transactional: '交易性',
    信息性: '信息性',
    商业性: '商业性',
    交易性: '交易性',
    导航性: '导航性',
  };
  const k = String(v || '').trim();
  return map[k] || (ONPAGE_AI_PROMPT_INTENTS.includes(k) ? k : k || '—');
}

/** 从行数据推断提示词要求的页面类型（中文） */
function onPageAiPageTypeZhFromRow(row) {
  syncOnPagePageTypeFromPath(row);
  const pt = row && row.pageType;
  if (pt && ONPAGE_AI_PAGE_TYPE_ZH_BY_ID[pt]) return ONPAGE_AI_PAGE_TYPE_ZH_BY_ID[pt];
  const p = String(row && row.path || '');
  if (p === '/' || p === '') return '首页';
  if (/\/blog\//i.test(p)) return '文章详情页';
  if (/\/products?\/[^/]+\.(html?|php)$/i.test(p) || /\/product\//i.test(p) || /-pd\d+\.html$/i.test(p) || /adapter-pd\d+\.html$/i.test(p)) return '产品详情页';
  if (/\/products?/i.test(p)) return '产品分类页';
  if (/\/contact|\/about/i.test(p)) return '联系/关于页';
  if (/\/case|\/cases/i.test(p)) return '客户案例页';
  if (/\/tag\//i.test(p)) return '标签页';
  if (/\/resource|\/download/i.test(p)) return '资源页';
  return '营销落地页';
}

function onPageAiPageTypeDisplayLabel(raw) {
  const k = String(raw || '').trim();
  const legacy = {
    Homepage: '首页',
    'Blog Article': '文章详情页',
    'Landing Page': '营销落地页',
    'Product Page': '产品详情页',
    'Category Page': '产品分类页',
    'Feature Page': '营销落地页',
  };
  if (legacy[k]) return legacy[k];
  if (ONPAGE_AI_PROMPT_PAGE_TYPES.includes(k)) return k;
  return k || '—';
}

function onPageAiInferSearchIntentZh(row, pageTypeZh) {
  const pt = pageTypeZh || onPageAiPageTypeZhFromRow(row);
  if (pt === '产品详情页' || pt === '营销转化页') return '交易性';
  if (pt === '文章详情页' || pt === '资源页') return '信息性';
  if (pt === '联系/关于页') return '导航性';
  if (pt === '首页' || pt === '产品分类页' || pt === '营销落地页' || pt === '客户案例页') return '商业性';
  return '商业性';
}

function onPageAiPageContentLocale(row) {
  const sample = `${row.title || ''} ${row.metaDesc || ''}`;
  return /[\u4e00-\u9fff]/.test(sample) ? 'zh' : 'en';
}

function onPageAiJsonLdForPageType(pageTypeZh, row, brandName) {
  const dom = typeof site === 'function' ? site().domain : 'www.example.com';
  const url = `https://${dom}${row.path || '/'}`;
  const base = { '@context': 'https://schema.org' };
  if (pageTypeZh === '首页') {
    const root = `https://${dom}/`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: brandName,
          url: root,
          description: row.metaDesc && !row.metaDesc.includes('待同步') ? row.metaDesc : `${brandName} corporate website`,
        },
        { '@type': 'WebSite', name: brandName, url: root, publisher: { '@type': 'Organization', name: brandName } },
      ],
    };
  }
  if (pageTypeZh === '产品详情页') {
    return { ...base, '@type': 'Product', name: row.title || brandName, url };
  }
  if (pageTypeZh === '文章详情页') {
    return {
      ...base,
      '@type': 'Article',
      headline: row.title || '',
      url,
      author: { '@type': 'Organization', name: brandName },
    };
  }
  return { ...base, '@type': 'WebPage', name: row.title || brandName, url };
}

function onPageAiInferPageTypeLabel(row) {
  return onPageAiPageTypeZhFromRow(row);
}

function onPageAiImpactClass(impactOrPriority) {
  const k = String(impactOrPriority || 'medium').toLowerCase();
  if (k === 'high') return 'high';
  if (k === 'low') return 'low';
  return 'medium';
}

function onPageAiPriorityLabel(priority) {
  const k = String(priority || 'medium').toLowerCase();
  if (k === 'high') return '高';
  if (k === 'low') return '低';
  return '中';
}

function onPageAiScoreLevel(score) {
  const s = Number(score) || 0;
  if (s >= 90) return { key: 'high', label: '优秀', hint: '90–100' };
  if (s >= 70) return { key: 'mid', label: '良好', hint: '70–89' };
  if (s >= 50) return { key: 'low', label: '待加强', hint: '50–69' };
  return { key: 'bad', label: '需优先处理', hint: '<50' };
}

function onPageAiNormalizeCtaItems(ctas) {
  if (!ctas || !ctas.length) return [];
  return ctas.map(c => {
    if (typeof c === 'string') {
      return {
        cta_text: c,
        recommended_position: '—',
        destination_type: '—',
        purpose: '—',
        reason: '—',
      };
    }
    return c;
  });
}

function onPageAiFormatCtaItemText(c) {
  return [
    `文案：${c.cta_text || '—'}`,
    `推荐位置：${c.recommended_position || '—'}`,
    `跳转类型：${c.destination_type || '—'}`,
    `目的：${c.purpose || '—'}`,
    `原因：${c.reason || '—'}`,
  ].join('\n');
}

function onPageAiRecommendationsFromAssets(assets, row) {
  if (!assets) return [];
  const blocks = [];
  const curTitle = row.title || '—';
  const curMeta = (row.metaDesc && !row.metaDesc.includes('待同步')) ? row.metaDesc : '—';
  const curH1 = curTitle.split(/[|｜—–-]/)[0].trim() || curTitle;
  const curMkw = row.metaKeywords && row.metaKeywords !== '—' ? row.metaKeywords : '—';
  const tdkFields = [];
  if (assets.optimized_title) {
    tdkFields.push({ label: 'SEO Title（30–60 字符）', current: curTitle, recommended: assets.optimized_title });
  }
  if (assets.optimized_meta_description) {
    tdkFields.push({ label: 'Meta Description（120–160 字符）', current: curMeta, recommended: assets.optimized_meta_description });
  }
  const mkw = assets.recommended_meta_keywords;
  if (mkw && mkw.length) {
    const rec = Array.isArray(mkw) ? mkw.join(', ') : String(mkw);
    tdkFields.push({ label: 'Meta Keywords（5–10 个）', current: curMkw, recommended: rec });
  }
  if (tdkFields.length) blocks.push({ key: 'tdk', title: 'TDK', fields: tdkFields });
  const headingFields = [];
  if (assets.optimized_h1) {
    headingFields.push({ label: 'H1（与 Title 语义区分）', current: curH1, recommended: assets.optimized_h1 });
  }
  const h2s = assets.recommended_h2_sections;
  if (h2s && h2s.length) {
    headingFields.push({
      label: 'H2 模块建议',
      current: '—',
      recommended: h2s.map((h, i) => `${i + 1}. ${h}`).join('\n'),
      preWrap: true,
    });
  }
  if (headingFields.length) {
    blocks.push({ key: 'headings', title: '标题结构（H1 / H2）', fields: headingFields });
  }
  if (assets.optimized_intro_paragraph) {
    blocks.push({
      key: 'intro',
      title: '开篇段落',
      fields: [{ label: 'Intro（60–120 词）', current: '（见线上正文首段）', recommended: assets.optimized_intro_paragraph }],
    });
  }
  const ctas = onPageAiNormalizeCtaItems(assets.recommended_cta_copy);
  if (ctas.length) {
    blocks.push({
      key: 'cta',
      title: 'CTA 推荐',
      fields: ctas.map((c, i) => ({
        label: `CTA ${i + 1}`,
        current: '—',
        recommended: onPageAiFormatCtaItemText(c),
        preWrap: true,
      })),
    });
  }
  if (assets.recommended_faqs && assets.recommended_faqs.length) {
    const faqText = assets.recommended_faqs
      .map((f, i) => `Q${i + 1}：${f.question}\n\nA：${f.answer}`)
      .join('\n\n');
    blocks.push({
      key: 'faq',
      title: '推荐 FAQ',
      fields: [{ recommendOnly: true, recommended: faqText, preWrap: true }],
    });
  }
  if (assets.json_ld_schema && Object.keys(assets.json_ld_schema).length) {
    blocks.push({
      key: 'schema',
      title: '结构化数据',
      fields: [{ label: 'JSON-LD', current: '—', recommended: JSON.stringify(assets.json_ld_schema, null, 2) }],
    });
  }
  return blocks;
}

function onPageAiBuildAuditSummaryText(json) {
  const s = json.assessment_summary;
  if (s.executive_summary && String(s.executive_summary).trim()) {
    return String(s.executive_summary).trim();
  }
  const ev = json.detailed_evaluations;
  const intent = onPageAiSearchIntentLabel(s.search_intent);
  const weak = [];
  if (ev.content_quality.score < 70) weak.push('内容质量');
  if (ev.topic_coverage.score < 70) weak.push('主题覆盖');
  if (ev.eeat.score < 70) weak.push('E-E-A-T');
  if (ev.conversion_optimization.score < 70) weak.push('转化优化');
  const weakTxt = weak.length ? `建议优先处理：${weak.join('、')}。` : '四项内容评估整体较均衡，可优先落地生成资产与增长机会。';
  const ptLbl = onPageAiPageTypeDisplayLabel(s.page_type);
  return `综合得分 ${s.overall_ai_score}/100。页面类型为 ${ptLbl}，主搜索意图为「${intent}」，意图匹配度 ${s.intent_match_score}%。${weakTxt} 本测评聚焦搜索意图、内容质量、主题覆盖、E-E-A-T 与转化；不包含 Title 长度、canonical 等规则项。`;
}

function onPageAiNormalizeListItems(items) {
  if (!items || !items.length) return [];
  return items.map(x => {
    if (x == null) return '';
    if (typeof x === 'string') return x;
    const head = x.item || x.topic || x.entity || '';
    const imp = x.importance ? `（${x.importance}）` : '';
    const tail = [x.reason, x.recommendation].filter(Boolean).join(' ');
    return [head + imp, tail].filter(Boolean).join(' — ');
  }).filter(Boolean);
}

function onPageAiAuditJsonToDimensions(json) {
  const s = json.assessment_summary;
  const ev = json.detailed_evaluations;
  const intentLbl = onPageAiSearchIntentLabel(s.search_intent);
  const missingTopics = onPageAiNormalizeListItems(ev.topic_coverage && ev.topic_coverage.missing_topics);
  return [
    {
      id: 'pageIntent',
      title: '搜索意图匹配',
      weight: 0,
      tier: 'P0',
      score: s.intent_match_score,
      summaryConclusion: `识别为「${onPageAiPageTypeDisplayLabel(s.page_type)}」，主意图「${intentLbl}」。`,
      reason: ONPAGE_AI_DIM_HINTS.pageIntent,
      lists: [
        { label: '页面类型', items: [onPageAiPageTypeDisplayLabel(s.page_type)] },
        { label: '搜索意图', items: [intentLbl] },
        { label: '意图匹配度', items: [`${s.intent_match_score}%`] },
      ],
      actions: [],
    },
    {
      id: 'quality',
      title: '内容质量',
      weight: 25,
      tier: 'P0',
      score: ev.content_quality.score,
      reason: ONPAGE_AI_DIM_HINTS.quality,
      lists: [
        { label: '优势', items: ev.content_quality.strengths || [] },
        { label: '不足', items: ev.content_quality.weaknesses || [] },
      ],
      actions: [],
    },
    {
      id: 'coverage',
      title: '主题覆盖度',
      weight: 20,
      tier: 'P0',
      score: ev.topic_coverage.score,
      reason: ONPAGE_AI_DIM_HINTS.coverage,
      lists: [
        { label: '已覆盖主题', items: ev.topic_coverage.covered_topics || [] },
        { label: '待补充主题', items: missingTopics },
      ],
      actions: [],
    },
    {
      id: 'eeat',
      title: 'E-E-A-T',
      weight: 20,
      tier: 'P0',
      score: ev.eeat.score,
      reason: ONPAGE_AI_DIM_HINTS.eeat,
      lists: [{ label: '缺失信号', items: ev.eeat.missing_signals || [] }],
      actions: [],
    },
    {
      id: 'conversion',
      title: '转化优化',
      weight: 20,
      tier: 'P0',
      score: ev.conversion_optimization.score,
      reason: ONPAGE_AI_DIM_HINTS.conversion,
      lists: (() => {
        const lists = [
          { label: '转化阻力', items: ev.conversion_optimization.barriers || [] },
          { label: '可执行修复', items: ev.conversion_optimization.actionable_fixes || [] },
        ];
        const ctaA = ev.cta_analysis;
        if (ctaA) {
          if (ctaA.existing_cta_strength) {
            lists.unshift({ label: '现有 CTA 表现', items: [ctaA.existing_cta_strength] });
          }
          if (ctaA.missing_positions && ctaA.missing_positions.length) {
            lists.push({ label: '建议补充位置', items: ctaA.missing_positions });
          }
          if (ctaA.recommendation) {
            lists.push({ label: 'CTA 策略建议', items: [ctaA.recommendation] });
          }
        }
        return lists;
      })(),
      actions: [],
    },
  ];
}

function buildOnPageAiAuditFromPromptJson(json, row) {
  const s = json.assessment_summary;
  const dims = onPageAiAuditJsonToDimensions(json);
  dims.forEach(d => {
    if (!d.summaryConclusion) {
      const lv = onPageAiScoreLevel(d.score);
      d.summaryConclusion = `${d.title}：${lv.label}`;
    }
  });
  return {
    at: `${formatDateYMD(DEMO_TODAY)} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
    score: s.overall_ai_score,
    summary: onPageAiBuildAuditSummaryText(json),
    assessment: s,
    pageType: { page_type: s.page_type, search_intent: s.search_intent, intent_match_score: s.intent_match_score },
    dimensions: dims,
    growthOpportunities: json.growth_opportunities || [],
    contentGapAnalysis: json.content_gap_analysis || null,
    ctaAnalysis: json.detailed_evaluations && json.detailed_evaluations.cta_analysis
      ? json.detailed_evaluations.cta_analysis
      : null,
    generatedAssets: json.generated_assets || null,
    recommendations: onPageAiRecommendationsFromAssets(json.generated_assets, row),
    modules: [],
  };
}

function buildOnPageAiAuditGenericJson(row) {
  const kw = parseMultiKw(row.keyword)[0] || 'cabinet hinges supplier';
  const pageTypeZh = onPageAiPageTypeZhFromRow(row);
  const searchIntent = onPageAiInferSearchIntentZh(row, pageTypeZh);
  const brand = typeof site === 'function' ? site().name : 'Brand';
  const locale = onPageAiPageContentLocale(row);
  const base = row.score != null ? Number(row.score) : 70;
  const intentScore = Math.max(55, Math.min(88, base + 2));
  const q = Math.max(50, Math.min(85, base - 4));
  const c = Math.max(52, Math.min(82, base - 6));
  const e = Math.max(58, Math.min(80, base - 2));
  const cro = Math.max(60, Math.min(86, base + 4));
  const overall = Math.round((intentScore * 0.25 + q * 0.25 + c * 0.2 + e * 0.15 + cro * 0.15));
  const intentLbl = onPageAiSearchIntentLabel(searchIntent);
  const executive = `综合得分 ${overall}/100：页面识别为「${pageTypeZh}」，主意图「${intentLbl}」。内容质量 ${q}、主题覆盖 ${c}，E-E-A-T ${e}、转化 ${cro}；建议优先补齐缺失主题与信任信号，并应用下方生成的 SEO 资产。`;
  const introAllowed = ONPAGE_AI_INTRO_PAGE_TYPES.has(pageTypeZh);
  const h2Allowed = ONPAGE_AI_H2_PAGE_TYPES.has(pageTypeZh);
  const ctaAllowed = ONPAGE_AI_CTA_PAGE_TYPES.has(pageTypeZh);
  const assetsEn = {
    optimized_title: `${kw} - ${brand}`.slice(0, 60),
    optimized_meta_description: `Bulk ${kw} for B2B buyers: specs, MOQ and export support from ${brand}. Request a quote today.`,
    recommended_meta_keywords: [kw, `${kw} wholesale`, 'B2B export', 'MOQ supplier', 'cabinet hardware'],
    optimized_h1: `Export-Ready ${kw} for Your Next Project`,
    optimized_intro_paragraph: introAllowed
      ? `${brand} supplies ${kw} for distributors and furniture brands with export-ready specs and flexible MOQ. Request a quotation to align lead time with your project.`
      : null,
    recommended_h2_sections: h2Allowed
      ? ['Specifications & MOQ', 'Applications & Industries', 'Quality & Compliance']
      : [],
    recommended_cta_copy: ctaAllowed
      ? [
        {
          cta_text: 'Get a Free Quote',
          recommended_position: 'Hero Section',
          destination_type: 'Quote Form',
          purpose: 'Lead Generation',
          reason: 'Commercial intent: surface MOQ and lead time at first screen.',
        },
        {
          cta_text: 'Download Spec Sheet',
          recommended_position: 'After Benefits Section',
          destination_type: 'Download Resource',
          purpose: 'Resource Download',
          reason: 'Supports comparison stage before inquiry.',
        },
      ]
      : [],
    recommended_faqs: [
      { question: `What is the MOQ for ${kw}?`, answer: 'MOQ depends on series; share your SKU list for an exact quote.' },
    ],
  };
  const assetsZh = {
    optimized_title: `${kw} - ${brand}`.slice(0, 60),
    optimized_meta_description: `${brand} 提供 ${kw} 批量供货：规格、MOQ 与出口支持。立即索取报价单。`,
    recommended_meta_keywords: [kw, `${kw} 批发`, 'B2B 出口', 'MOQ', '五金供货'],
    optimized_h1: `专业 ${kw} 供货伙伴`,
    optimized_intro_paragraph: introAllowed
      ? `${brand} 面向渠道商提供 ${kw}，支持批量出口与灵活 MOQ。提交询盘获取交期与报价。`
      : null,
    recommended_h2_sections: h2Allowed ? ['产品规格与 MOQ', '应用场景', '质量与认证'] : [],
    recommended_cta_copy: ctaAllowed
      ? [
        {
          cta_text: '索取报价单',
          recommended_position: 'Hero Section',
          destination_type: 'Quote Form',
          purpose: 'Lead Generation',
          reason: '商业性意图：首屏明确 MOQ 与交期价值。',
        },
      ]
      : [],
    recommended_faqs: [
      { question: `${kw} 的起订量是多少？`, answer: '因系列不同 MOQ 有差异，请提供 SKU 清单报价。' },
    ],
  };
  const assets = locale === 'zh' ? assetsZh : assetsEn;
  return {
    assessment_summary: {
      page_type: pageTypeZh,
      search_intent: searchIntent,
      intent_match_score: intentScore,
      overall_ai_score: overall,
      executive_summary: executive,
    },
    detailed_evaluations: {
      content_quality: {
        score: q,
        strengths: ['结构可读，核心卖点露出较清楚', '产品与场景描述具备基本语义深度'],
        weaknesses: ['部分段落偏模板化，信息密度可再提升', '缺少可验证的数据或案例支撑论点'],
      },
      topic_coverage: {
        score: c,
        covered_topics: [kw, '批量出口与 MOQ', '产品规格与应用场景'],
        missing_topics: ['安装与维护说明', '认证与合规详解', 'FAQ 长尾问答', '竞品/替代方案对比'],
      },
      eeat: {
        score: e,
        missing_signals: ['专家或技术负责人背书', '可追溯客户案例', '内容更新或规格核验日期'],
      },
      conversion_optimization: {
        score: cro,
        barriers: ['主 CTA 不够具体，未强调 MOQ/交期', '信任徽章未紧邻转化按钮'],
        actionable_fixes: ['将主 CTA 改为「索取报价单」并旁注响应时效', '在 CTA 上方集中展示认证与客户行业标签'],
      },
      cta_analysis: ctaAllowed
        ? {
          existing_cta_strength: '存在基础联系入口，首屏 CTA 价值主张偏弱。',
          missing_positions: ['Hero Section', 'After Benefits Section'],
          recommendation: '建议在 Hero 使用 Quote Form 类 CTA，并匹配商业/交易意图文案。',
        }
        : {
          existing_cta_strength: '页面以信息浏览为主，转化 CTA 非本页核心（按页面类型可不生成资产级 CTA）。',
          missing_positions: [],
          recommendation: '若需提升转化，可参考「转化优化」中的阻力与修复项；结构化 CTA 资产仅对产品/落地/案例类页面生成。',
        },
    },
    content_gap_analysis: {
      missing_entities: [kw, 'MOQ 与交期组合说明'].slice(0, 3),
      missing_use_cases: ['工程采购场景', '经销商补货场景'],
      missing_faq_topics: ['MOQ 询价', '规格书下载'],
      missing_trust_signals: ['专家背书', '可验证案例摘要'],
    },
    growth_opportunities: [
      {
        priority: 'high',
        insight: `「${intentLbl}」意图下，用户常在对比规格与 MOQ 阶段流失；缺少结构化 FAQ 与对照内容。`,
        actionable_recommendation: '新增 2–3 条 FAQ 并链向核心 SKU 或规格下载。',
      },
      {
        priority: 'medium',
        insight: 'E-E-A-T 信号分散，决策阶段难以快速建立信任。',
        actionable_recommendation: '在 CTA 附近增加可验证的认证与客户案例摘要（不虚构）。',
      },
    ],
    generated_assets: {
      ...assets,
      json_ld_schema: onPageAiJsonLdForPageType(pageTypeZh, row, brand),
    },
  };
}

function onPageAiResolvePromptJson(row) {
  const dom = typeof site === 'function' ? site().domain : '';
  const p = String(row && row.path || '');
  const isRh = /rhhardware\.com/i.test(dom);
  if (isRh && (p === '/' || p === '')) return RH_HARDWARE_HOME_AI_AUDIT;
  if (isRh && (/1JO-JIC-MALE-74-CONE/i.test(p) || /pd508135\.html$/i.test(p))) return RH_HARDWARE_PRODUCT_JIC_AI_AUDIT;
  return buildOnPageAiAuditGenericJson(row);
}

function buildOnPageAiAuditDemo(row) {
  return buildOnPageAiAuditFromPromptJson(onPageAiResolvePromptJson(row), row);
}

function onPageAiDimListHTML(lists) {
  if (!lists || !lists.length) return '';
  return lists.map(block => `
    <div class="onpage-ai-dim-list-block">
      <span class="onpage-ai-dim-list-lbl">${escapeHtmlStr(block.label)}</span>
      <ul class="onpage-ai-dim-ul">${(block.items || []).map(it => `<li>${escapeHtmlStr(it)}</li>`).join('')}</ul>
    </div>`).join('');
}

function onPageAiGrowthOppsHTML(opps) {
  if (!opps || !opps.length) return '';
  return `<div class="onpage-ai-growth-opps">${opps.map(o => {
    const pri = o.priority || o.impact || 'medium';
    const ic = onPageAiImpactClass(pri);
    const priLbl = onPageAiPriorityLabel(pri);
    if (o.insight != null || o.actionable_recommendation != null) {
      const typeLbl = o.opportunity_type ? `<span class="onpage-ai-growth-type">${escapeHtmlStr(o.opportunity_type)}</span>` : '';
      const impact = (o.expected_seo_impact || o.expected_conversion_impact)
        ? `<span class="onpage-ai-growth-impact-hint">SEO ${escapeHtmlStr(o.expected_seo_impact || '—')} · 转化 ${escapeHtmlStr(o.expected_conversion_impact || '—')}</span>`
        : '';
      const why = o.why_it_matters
        ? `<p class="onpage-ai-growth-why"><span class="onpage-ai-growth-lbl">原因</span>${escapeHtmlStr(o.why_it_matters)}</p>`
        : '';
      return `<div class="onpage-ai-growth-item onpage-ai-growth-item--${escapeAttr(ic)}">
      <div class="onpage-ai-growth-hd"><span class="onpage-ai-impact badge badge-gray">${escapeHtmlStr(priLbl)}优先级</span>${typeLbl}</div>
      ${impact}
      <p class="onpage-ai-growth-insight"><span class="onpage-ai-growth-lbl">洞察</span>${escapeHtmlStr(o.insight || '')}</p>
      ${why}
      <p class="onpage-ai-growth-act"><span class="onpage-ai-growth-lbl">建议</span>${escapeHtmlStr(o.actionable_recommendation || '')}</p>
    </div>`;
    }
    return `<div class="onpage-ai-growth-item onpage-ai-growth-item--${escapeAttr(ic)}">
      <div class="onpage-ai-growth-hd"><strong>${escapeHtmlStr(o.opportunity)}</strong><span class="onpage-ai-impact badge badge-gray">${escapeHtmlStr(priLbl)}</span></div>
      <p class="onpage-ai-growth-act">${escapeHtmlStr(o.action)}</p>
      <p class="onpage-ai-growth-exp">${escapeHtmlStr(o.expected_result)}</p>
    </div>`;
  }).join('')}</div>`;
}

function onPageAiContentGapSectionHTML(gap) {
  if (!gap) return '';
  const blocks = [
    { label: '缺失实体', items: onPageAiNormalizeListItems(gap.missing_entities) },
    { label: '缺失子主题', items: onPageAiNormalizeListItems(gap.missing_subtopics) },
    { label: '缺失使用场景', items: onPageAiNormalizeListItems(gap.missing_use_cases) },
    { label: '缺失 FAQ 选题', items: onPageAiNormalizeListItems(gap.missing_faq_topics) },
    { label: '缺失信任信号', items: onPageAiNormalizeListItems(gap.missing_trust_signals) },
  ].filter(b => b.items && b.items.length);
  if (!blocks.length) return '';
  const body = blocks.map(b => onPageAiDimListHTML([b])).join('');
  return `<div class="onpage-ai-content-gap">${body}</div>`;
}

function onPageAiGrowthSectionHTML(d) {
  const opps = d && d.growthOpportunities;
  if (!opps || !opps.length) return '';
  return `<section class="onpage-ai-panel onpage-ai-panel--growth" aria-labelledby="onpage-ai-growth-hd">
    <h3 class="onpage-ai-panel-hd" id="onpage-ai-growth-hd">增长机会</h3>
    <p class="onpage-ai-panel-lead">高影响、可执行的流量与转化策略建议。</p>
    <div class="onpage-ai-panel-body">${onPageAiGrowthOppsHTML(opps)}</div>
  </section>`;
}

function onPageAiDimTitleHTML(dim) {
  const hint = dim.reason || ONPAGE_AI_DIM_HINTS[dim.id] || '';
  const hintBtn = hint ? onPageFieldHintBtnHTML(hint) : '';
  return `<span class="onpage-ai-dim-title-wrap"><span class="onpage-ai-dim-title">${escapeHtmlStr(dim.title)}</span>${hintBtn}</span>`;
}

function onPageAiDimScoreHTML(dim, lv) {
  if (dim.id === 'pageIntent') {
    return `<span class="onpage-ai-dim-score onpage-ai-dim-score--${lv.key} onpage-ai-dim-score--pct"><strong>${dim.score}</strong><span class="onpage-ai-dim-score-cap">%</span></span>`;
  }
  return `<span class="onpage-ai-dim-score onpage-ai-dim-score--${lv.key}"><strong>${dim.score}</strong><span class="onpage-ai-dim-score-cap">/100</span></span>`;
}

function onPageAiDimCardHTML(dim) {
  const lv = onPageAiScoreLevel(dim.score);
  const lists = onPageAiDimListHTML(dim.lists);
  const actions = (dim.actions || []).length
    ? `<ul class="onpage-ai-dim-actions">${dim.actions.map(a => `<li>${escapeHtmlStr(a)}</li>`).join('')}</ul>`
    : '';
  const sumLine = dim.summaryConclusion
    ? `<p class="onpage-ai-dim-summary-line">${escapeHtmlStr(dim.summaryConclusion)}</p>`
    : '';
  return `<details class="onpage-ai-dim-card onpage-ai-dim-card--${lv.key}">
    <summary class="onpage-ai-dim-sum">
      ${onPageAiDimTitleHTML(dim)}
      <span class="onpage-ai-dim-meta">
        ${onPageAiDimScoreHTML(dim, lv)}
        <span class="onpage-ai-dim-lv">${escapeHtmlStr(lv.label)}</span>
      </span>
    </summary>
    <div class="onpage-ai-dim-body">
      ${sumLine}
      ${lists}
      ${actions}
    </div>
  </details>`;
}

function onPageDimHasIssue(row, dimId) {
  if (typeof onPageWincherCollectModel !== 'function') return true;
  const g = onPageWincherCollectModel(row).groups.find(x => x.id === dimId);
  return !!(g && g.checks.some(c => c.sev !== 'pass'));
}

/** 基于规则检测 + 页面数据生成带「当前 / 推荐」具体值的优化建议（示例） */
function onPageAiBuildConcreteRecommendations(row) {
  const kw = parseMultiKw(row.keyword)[0] || 'B2B hardware supplier';
  const recKws = [kw, `${kw} wholesale`, 'cabinet hinges MOQ', 'stainless hinge supplier'].join('、');
  const titleCur = row.title || '—';
  const titleRec = `${String(titleCur).replace(/\s*[|｜].*$/, '').trim().slice(0, 38)} | ${kw}`.slice(0, 58);
  const metaCur = (row.metaDesc && !row.metaDesc.includes('待同步')) ? row.metaDesc : '未配置';
  const metaRec = `面向海外采购商的一站式 ${kw} 供货：规格、MOQ、交期与认证资质一览，支持批量出口与定制包装（示例文案，建议 120–160 字符）。`;
  const mkwCur = row.metaKeywords && row.metaKeywords !== '—' ? row.metaKeywords : '—';
  const mkwRec = `${kw}, cabinet hinges wholesale, B2B hardware export, stainless hinge MOQ`;
  const h2Rec = '选型指南：材质、规格、安装方式与 MOQ 对照';
  const imgRows = typeof onPageGetImageRows === 'function' ? onPageGetImageRows(row) : [];
  const altCur = (imgRows[0] && imgRows[0].alt) ? imgRows[0].alt : '—';
  const altRec = `Stainless steel cabinet hinge for commercial doors, ${kw}, bulk export（示例）`;
  const pageTypeCur = onPagePageTypeLabel(row.pageType) || '未设置';
  const inferId = /\/blog\//i.test(String(row.path || '')) ? 'article-detail' : /\/products?/i.test(String(row.path || '')) ? 'product-detail' : 'marketing-lp';
  const recPtLbl = onPagePageTypeLabel(row.pageType || inferId);
  const sd = typeof onPageSocialDisplay === 'function' ? onPageSocialDisplay(row, row.metaDesc || '') : {};
  const dom = typeof site === 'function' ? site().domain : 'www.example.com';
  const blocks = [];

  if (!parseMultiKw(row.keyword).length || onPageDimHasIssue(row, 'title') || onPageDimHasIssue(row, 'meta')) {
    blocks.push({
      key: 'keyword',
      title: '目标词',
      fields: [{ label: '建议监控词（主词 + 长尾）', current: parseMultiKw(row.keyword).join('、') || '未设置', recommended: recKws }],
    });
  }

  if (!row.pageType || pageTypeCur === '未设置') {
    blocks.push({
      key: 'pageType',
      title: '页面类型',
      fields: [{ label: '页面类型', current: pageTypeCur, recommended: `${recPtLbl}（${onPageAiInferPageTypeLabel(row)}）` }],
    });
  }

  const tdkFields = [];
  if (onPageDimHasIssue(row, 'title') || (row.title || '').length > 60) {
    tdkFields.push({ label: '页面标题 Title', current: titleCur, recommended: titleRec });
  }
  if (onPageDimHasIssue(row, 'meta') || metaCur === '未配置') {
    tdkFields.push({ label: 'Meta Description', current: metaCur, recommended: metaRec });
    tdkFields.push({ label: 'Meta Keywords', current: mkwCur, recommended: mkwRec });
  }
  if (tdkFields.length) blocks.push({ key: 'tdk', title: 'TDK', fields: tdkFields });

  if (onPageDimHasIssue(row, 'headings')) {
    blocks.push({
      key: 'headings',
      title: 'H 标题',
      fields: [{ label: '首个 H2 建议文案', current: row._aiHeadingHint || '（见页面首个 H2）', recommended: h2Rec }],
    });
  }

  if (onPageDimHasIssue(row, 'body')) {
    blocks.push({
      key: 'body',
      title: '正文内容',
      fields: [{
        label: '首段参考写法',
        current: '（见线上正文首段）',
        recommended: `作为专注 ${kw} 的出口供应商，我们提供全系列橱柜铰链与五金配件，支持 MOQ 定制、快速交期与第三方认证，欢迎索取规格表与报价单。`,
      }],
    });
  }

  if (onPageDimHasIssue(row, 'media')) {
    blocks.push({
      key: 'images',
      title: '图片',
      fields: [{ label: '首图 Alt 文本', current: altCur, recommended: altRec }],
    });
  }

  if (onPageDimHasIssue(row, 'url')) {
    const slugRec = String(row.path || '/').replace(/^\//, '').replace(/\.html$/i, '') || 'page';
    blocks.push({
      key: 'url',
      title: '网址',
      fields: [{ label: 'URL 路径（Slug）', current: row.path || '—', recommended: `/${slugRec}-supplier` }],
    });
  }

  if (onPageDimHasIssue(row, 'code')) {
    const rawD = String(row.dimD || '');
    if (/404|死链/i.test(rawD)) {
      blocks.push({
        key: 'links',
        title: '链接',
        fields: [{ label: '失效内链处理', current: '主文含 404 链接（规则检测）', recommended: '将 /old-catalog.html 改为 /products.html，或配置 301 至现行分类页' }],
      });
    }
    if (/BlogPosting|datePublished|JSON|结构/i.test(rawD)) {
      const schemaRec = `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${titleRec.replace(/"/g, '\\"')}",
  "datePublished": "2025-09-22T08:00:00+08:00",
  "author": { "@type": "Organization", "name": "RHHardware" }
}`.trim();
      blocks.push({
        key: 'schema',
        title: '结构化数据',
        fields: [{ label: 'JSON-LD 示例', current: '缺少 datePublished 或字段不完整', recommended: schemaRec }],
      });
    }
    if (/hreflang/i.test(rawD)) {
      blocks.push({
        key: 'intl',
        title: '语言与网址',
        fields: [{
          label: 'hreflang 标签',
          current: '未成对或缺少 x-default',
          recommended: `<link rel="alternate" hreflang="en" href="https://${dom}/" />\n<link rel="alternate" hreflang="x-default" href="https://${dom}/" />`,
        }],
      });
    }
    if (/社媒|og|模板/i.test(rawD) || onPageDimHasIssue(row, 'meta')) {
      blocks.push({
        key: 'social',
        title: '社媒分享',
        fields: [
          { label: 'og:title', current: sd.ogTitle || '—', recommended: titleRec },
          { label: 'og:description', current: sd.ogDesc || '—', recommended: metaRec.slice(0, 155) },
          { label: 'og:image', current: sd.ogImg || '—', recommended: 'https://cdn.example.com/og/hinge-1200x630.jpg' },
          { label: 'twitter:card', current: sd.twitterCard || '—', recommended: 'summary_large_image' },
        ],
      });
    }
  }

  const order = ['keyword', 'pageType', 'tdk', 'headings', 'body', 'images', 'links', 'schema', 'social', 'intl', 'url'];
  return blocks.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}

/** AI 生成资产中支持一键回填弹窗的模块（仅 TDK、结构化数据） */
function onPageAiRecBlockApplyable(key) {
  return ['tdk', 'schema'].includes(String(key || ''));
}

function onPageAiRecApplyBtnHTML(blockKey) {
  if (!onPageAiRecBlockApplyable(blockKey)) return '';
  return `<button type="button" class="btn-primary btn-sm onpage-ai-rec-apply" data-onpage-ai-apply="${escapeAttr(String(blockKey))}" onclick="event.preventDefault();event.stopPropagation();">应用</button>`;
}

function onPageAiRecFindBlock(row, blockKey) {
  const d = row && row._onPageAiAuditDemo;
  const blocks = (d && d.recommendations && d.recommendations.length)
    ? d.recommendations
    : onPageAiBuildConcreteRecommendations(row);
  return blocks.find(b => b.key === blockKey) || null;
}

window.onPageAiRecApply = function (blockKey) {
  const k = String(blockKey || '');
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  if (!row || !onPageAiRecBlockApplyable(k)) {
    toast('该建议项暂不支持一键应用（示例）', 'error');
    return;
  }
  const block = onPageAiRecFindBlock(row, k);
  if (!block || !(block.fields || []).length) {
    toast('暂无可应用的推荐内容（示例）', 'error');
    return;
  }
  const fieldBy = (re) => (block.fields || []).find(f => re.test(String(f.label || '')));
  state.onPageAiAuditEditorPrefill = null;
  if (k === 'tdk') {
    const titleF = fieldBy(/Title|标题|SEO Title/i);
    const descF = fieldBy(/Description|摘要|Meta Description/i);
    const h1F = fieldBy(/^H1/i);
    const kwF = fieldBy(/Keywords|关键词/i);
    state.onPageAiAuditEditorPrefill = {
      kind: 'tdk',
      title: titleF ? String(titleF.recommended) : row.title,
      desc: descF ? String(descF.recommended) : (row.metaDesc || ''),
      kw: kwF ? String(kwF.recommended) : (row.metaKeywords || ''),
      h1: h1F ? String(h1F.recommended) : undefined,
    };
    openModal('onpage-drawer-tdk');
    return;
  }
  if (k === 'schema') {
    const jsonF = fieldBy(/JSON|结构化/i) || block.fields[0];
    const json = String(jsonF.recommended || '').trim();
    const isBlog = /\/blog\//i.test(String(row.path || '')) || /@type":\s*"BlogPosting"/i.test(json);
    const isProduct = /@type":\s*"Product"/i.test(json) || onPageAiPageTypeZhFromRow(row) === '产品详情页';
    state.onPageSchemaSlice = isBlog ? 'jsonld-blog' : 'jsonld-org';
    state.onPageAiAuditEditorPrefill = { kind: 'schema-json', json, schemaKind: isProduct ? 'product' : isBlog ? 'blog' : 'org' };
    openModal('onpage-schema-json');
    return;
  }
  toast('未识别的建议模块（示例）', 'error');
};

function onPageAiOptimRecFieldHTML(f) {
  const rec = f.recommended != null ? String(f.recommended) : '—';
  const isCode = /[{[\]<>]|@context|hreflang/i.test(rec);
  const preWrap = !!(f.preWrap || (/\n/.test(rec) && !isCode));
  const escRec = isCode
    ? `<pre class="onpage-ai-rec-pre onpage-ai-rec-pre--rec">${escapeHtmlStr(rec)}</pre>`
    : preWrap
      ? `<div class="onpage-ai-rec-val onpage-ai-rec-val--rec onpage-ai-rec-val--pre">${escapeHtmlStr(rec)}</div>`
      : escapeHtmlStr(rec);
  if (f.recommendOnly) {
    const lbl = f.label ? `<div class="onpage-ai-rec-field-lbl">${escapeHtmlStr(f.label)}</div>` : '';
    return `<div class="onpage-ai-rec-field onpage-ai-rec-field--rec-only">${lbl}${escRec}</div>`;
  }
  const cur = f.current != null ? String(f.current) : '—';
  const escCur = isCode ? `<pre class="onpage-ai-rec-pre">${escapeHtmlStr(cur)}</pre>` : escapeHtmlStr(cur);
  return `<div class="onpage-ai-rec-field">
    <div class="onpage-ai-rec-field-lbl">${escapeHtmlStr(f.label)}</div>
    <div class="onpage-ai-rec-row"><span class="onpage-ai-rec-tag">当前</span><div class="onpage-ai-rec-val onpage-ai-rec-val--cur">${escCur}</div></div>
    <div class="onpage-ai-rec-row"><span class="onpage-ai-rec-tag onpage-ai-rec-tag--rec">推荐</span><div class="onpage-ai-rec-val onpage-ai-rec-val--rec">${escRec}</div></div>
  </div>`;
}

function onPageAiOptimRecBlocksHTML(row) {
  const d = row && row._onPageAiAuditDemo;
  const blocks = (d && d.recommendations && d.recommendations.length)
    ? d.recommendations
    : onPageAiBuildConcreteRecommendations(row);
  if (!blocks.length) {
    return '<p class="onpage-ai-subtab-empty">当前页面类型暂无生成的 SEO 资产（详见「维度评估」中转化优化的 CTA 分析）。</p>';
  }
  return `<div class="onpage-ai-rec-blocks">${blocks.map(b => `
    <details class="onpage-ai-rec-block">
      <summary class="onpage-ai-rec-block-sum">
        <span class="onpage-ai-rec-block-hd">${escapeHtmlStr(b.title)}</span>
        ${onPageAiRecApplyBtnHTML(b.key)}
      </summary>
      <div class="onpage-ai-rec-fields">${(b.fields || []).map(onPageAiOptimRecFieldHTML).join('')}</div>
    </details>`).join('')}</div>`;
}

function onPageAiOptimRecsHTML(row) {
  return `<section class="onpage-ai-panel onpage-ai-panel--assets" aria-labelledby="onpage-ai-assets-hd">
    <h3 class="onpage-ai-panel-hd" id="onpage-ai-assets-hd">SEO优化推荐</h3>
    <div class="onpage-ai-panel-body">${onPageAiOptimRecBlocksHTML(row)}</div>
  </section>`;
}

window.onPageAiSetResultSubTab = function (tabId) {
  const ok = ONPAGE_AI_RESULT_SUB_TABS.some(t => t.id === tabId);
  if (!ok) return;
  state.onPageAiResultSubTab = tabId;
  renderDrawer();
};

function onPageAiResultSubTabsHTML(activeId) {
  const btns = ONPAGE_AI_RESULT_SUB_TABS.map(t => {
    const act = activeId === t.id ? ' active' : '';
    return `<button type="button" class="onpage-ai-subtab${act}" onclick="onPageAiSetResultSubTab('${t.id}')">${escapeHtmlStr(t.label)}</button>`;
  }).join('');
  return `<div class="onpage-ai-subtabs" role="tablist" aria-label="AI 测评结果分区">${btns}</div>`;
}

function onPageAiResultHeroHTML(d) {
  const lv = onPageAiScoreLevel(d.score);
  const pt = d.pageType || {};
  const asm = d.assessment || {};
  const intentLbl = onPageAiSearchIntentLabel(pt.search_intent || asm.search_intent);
  const intentScore = pt.intent_match_score != null ? pt.intent_match_score : asm.intent_match_score;
  const pageTypeLbl = onPageAiPageTypeDisplayLabel(pt.page_type || asm.page_type);
  return `<div class="onpage-ai-hero onpage-ai-hero--${lv.key}">
    <div class="onpage-ai-hero-card onpage-ai-hero-card--score">
      <span class="onpage-ai-hero-lbl">综合得分</span>
      <div class="onpage-ai-hero-num"><strong>${escapeHtmlStr(String(d.score))}</strong><span>/100</span></div>
      <span class="onpage-ai-hero-band">${escapeHtmlStr(lv.label)}<span class="onpage-ai-hero-band-range">${escapeHtmlStr(lv.hint)}</span></span>
    </div>
    <div class="onpage-ai-hero-card onpage-ai-hero-card--type">
      <span class="onpage-ai-hero-type-lbl">页面类型</span>
      <strong class="onpage-ai-hero-val">${escapeHtmlStr(pageTypeLbl)}</strong>
    </div>
    <div class="onpage-ai-hero-card onpage-ai-hero-card--intent">
      <span class="onpage-ai-hero-intent-lbl">搜索意图</span>
      <strong class="onpage-ai-hero-val">${escapeHtmlStr(intentLbl)}</strong>
      <span class="onpage-ai-hero-intent-match">
        <span class="onpage-ai-hero-intent-match-lbl">意图匹配 ${onPageFieldHintBtnHTML(ONPAGE_AI_INTENT_MATCH_HINT)}</span>
        <strong class="onpage-ai-hero-intent-pct">${intentScore != null ? `${escapeHtmlStr(String(intentScore))}%` : '—'}</strong>
      </span>
    </div>
    <time class="onpage-ai-hero-at">${escapeHtmlStr(d.at)}</time>
  </div>`;
}

function onPageAiResultSubTabPanesHTML(row, d) {
  const sub = state.onPageAiResultSubTab || 'overview';
  const dimCards = (d.dimensions || []).map(onPageAiDimCardHTML).join('');
  const gapInner = onPageAiContentGapSectionHTML(d.contentGapAnalysis);
  const growthInner = onPageAiGrowthOppsHTML(d.growthOpportunities);
  const panes = [
    {
      id: 'overview',
      body: `${onPageAiResultHeroHTML(d)}
        <div class="onpage-ai-conclusion-box">
          <div class="onpage-ai-conclusion-hd">${AI_REC_SVG}<span>测评摘要</span></div>
          <p class="onpage-ai-conclusion-txt">${escapeHtmlStr(d.summary)}</p>
        </div>`,
    },
    {
      id: 'eval',
      body: `<div class="onpage-ai-tab-dims">${dimCards}</div>`,
    },
    {
      id: 'gap',
      body: gapInner
        ? gapInner
        : '<p class="onpage-ai-subtab-empty">未识别到显著内容缺口，或可见正文已覆盖主要语义实体。</p>',
    },
    {
      id: 'growth',
      body: growthInner
        ? growthInner
        : '<p class="onpage-ai-subtab-empty">暂无额外增长机会建议。</p>',
    },
    {
      id: 'assets',
      body: onPageAiOptimRecBlocksHTML(row),
    },
  ];
  return panes.map(p => {
    const hiddenAttr = sub === p.id ? '' : ' hidden';
    return `<div class="onpage-ai-subtab-pane" role="tabpanel"${hiddenAttr} data-onpage-ai-subtab="${escapeAttr(p.id)}">${p.body}</div>`;
  }).join('');
}

function onPageAiTabHeadHTML(row) {
  const d = row && row._onPageAiAuditDemo;
  const title = onPageDrawerModuleTitleHTML('AI 测评', '');
  const inner = d
    ? `<div class="onpage-aitdk-title-actions">
        ${title}
        <button type="button" class="btn-default btn-sm" onclick="onPageDrawerAiAudit()">重新检测</button>
        <span class="onpage-audit-at">最后测评：<time>${escapeHtmlStr(d.at || '—')}</time></span>
      </div>`
    : title;
  return `<div class="onpage-aitdk-section-head onpage-aitdk-section-head--row onpage-aitdk-section-head--ai onpage-aitdk-section-head--ai-tab">${inner}</div>`;
}

function onPageAiAuditTabHTML(row) {
  const d = row && row._onPageAiAuditDemo;
  const aiHead = onPageAiTabHeadHTML(row);
  if (!d) {
    const dimPreview = ONPAGE_AI_DIMENSIONS.map(x => `
      <div class="onpage-ai-dim-preview">
        <span class="onpage-ai-dim-preview-title">${escapeHtmlStr(x.title)}</span>
      </div>`).join('');
    return `<div class="onpage-ai-tab-empty onpage-ai-tab-empty--refined">
      ${aiHead}
      <div class="onpage-ai-empty-card">
        ${onPageAiEmptyTabLeadHTML()}
        <div class="onpage-ai-dim-preview-grid" aria-label="测评维度">${dimPreview}</div>
      </div>
      <div class="onpage-ai-tab-cta-wrap">
        <button type="button" class="btn-dash-ai btn-dash-ai--hero" onclick="onPageDrawerAiAudit()">${AI_REC_SVG}<span class="btn-dash-ai-lbl">开始 AI 测评</span><span class="ai-rec-pill">消耗 18 点</span></button>
      </div>
    </div>`;
  }
  const sub = state.onPageAiResultSubTab || 'overview';
  if (!ONPAGE_AI_RESULT_SUB_TABS.some(t => t.id === sub)) state.onPageAiResultSubTab = 'overview';
  return `<div class="onpage-ai-tab-result onpage-ai-tab-result--refined">
    ${aiHead}
    <div class="onpage-ai-result-shell">
      ${onPageAiResultSubTabsHTML(state.onPageAiResultSubTab)}
      <div class="onpage-ai-subtab-body">${onPageAiResultSubTabPanesHTML(row, d)}</div>
    </div>
  </div>`;
}

window.onPageDrawerAiAudit = function () {
  const i = state.onPageSeoDrawerIndex;
  if (i == null) return;
  const row = DB.onPageSeoPages[i];
  if (!row) return;
  const cost = 18;
  const bal = state.aiPointsDemo != null ? state.aiPointsDemo : 0;
  if (bal < cost) {
    toast('点数不足，无法执行 AI 测评（示例）', 'error');
    return;
  }
  state.aiPointsDemo = bal - cost;
  try {
    row._onPageAiAuditDemo = buildOnPageAiAuditDemo(row);
  } catch (err) {
    console.error('onPageDrawerAiAudit', err);
    state.aiPointsDemo = bal;
    toast('AI 测评生成失败，请刷新后重试（示例）', 'error');
    return;
  }
  state.onPageSeoDrawerTab = 'ai';
  state.onPageAiResultSubTab = 'overview';
  renderDrawer();
  toast(`已扣减 ${cost} 点：AI 语义化测评已完成（示例）`);
};

window.onPageAiAuditApplyOpenEditor = function (key) {
  const k = String(key || '');
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const d = row && row._onPageAiAuditDemo;
  const mod = d && Array.isArray(d.modules) ? d.modules.find(x => x.applyKey === k) : null;
  if (!row || !mod || !mod.payload) {
    toast('暂无可应用的 AI 推荐（示例）', 'error');
    return;
  }
  const p = mod.payload;
  state.onPageAiAuditEditorPrefill = null;
  if (k === 'tdk') {
    state.onPageAiAuditEditorPrefill = { kind: 'tdk', title: p.title, desc: p.desc, kw: p.kw };
    openModal('onpage-drawer-tdk');
    return;
  }
  if (k === 'headings') {
    state.onPageSeoDrawerTab = 'headings';
    if (p.h2) row._aiHeadingHint = String(p.h2);
    renderDrawer();
    toast('已切换到「H标题」页签并填入建议文案（示例），请核对后自行落版。');
    return;
  }
  if (k === 'body') {
    row.onPageSchemaNotes = row.onPageSchemaNotes && typeof row.onPageSchemaNotes === 'object' ? row.onPageSchemaNotes : {};
    state.onPageAiAuditEditorPrefill = { kind: 'schema-row', note: p.note != null ? String(p.note) : '' };
    state.onPageSchemaEditKey = 'body-audit';
    openModal('onpage-drawer-schema-row');
    return;
  }
  if (k === 'images') {
    state.onPageImageEditIndex = 0;
    state.onPageAiAuditEditorPrefill = { kind: 'image', alt: p.alt != null ? String(p.alt) : '' };
    openModal('onpage-drawer-image');
    return;
  }
  if (k === 'schema') {
    if (p.json != null && String(p.json).trim()) {
      const isBlog = /\/blog\//i.test(String((DB.onPageSeoPages[state.onPageSeoDrawerIndex] || {}).path || '')) || /@type":\s*"BlogPosting"/i.test(String(p.json));
      state.onPageSchemaSlice = isBlog ? 'jsonld-blog' : 'jsonld-org';
      state.onPageAiAuditEditorPrefill = { kind: 'schema-json', json: String(p.json) };
      openModal('onpage-schema-json');
      return;
    }
    state.onPageAiAuditEditorPrefill = { kind: 'schema-row', note: p.note != null ? String(p.note) : '' };
    state.onPageSchemaEditKey = 'ai-audit';
    openModal('onpage-drawer-schema-row');
    return;
  }
  if (k === 'social') {
    state.onPageAiAuditEditorPrefill = { kind: 'social', ogTitle: p.ogTitle, ogDesc: p.ogDesc, ogImg: p.ogImg, twitterCard: p.twitterCard };
    openModal('onpage-drawer-social');
    return;
  }
  toast('未识别的测评项（示例）', 'error');
};

window.onPageKwRecommendFetch = function () {
  state.onPageKwRecommendLoaded = true;
  renderDrawer();
  toast('已加载 AI 推荐词（示例）');
};

function onPageFieldHintBtnHTML(hintText) {
  return `<button type="button" class="onpage-field-hint-btn" data-onpage-hint="${escapeAttr(hintText)}" aria-label="字段说明">${ONPAGE_SVG_INFO_HINT}</button>`;
}

function onPageThWithHint(label, hintText, attrs) {
  const a = attrs ? ` ${attrs}` : '';
  return `<th${a}>${onPageThHintLabelHTML(label, hintText)}</th>`;
}

function onPageTabLeadHTML(tab, position) {
  const pos = position || 'top';
  const map = {
    schema: '在此查看或调整本页提供给搜索引擎的结构化数据，便于展示更丰富的搜索结果。',
    social: '设置分享到微信、Facebook 等社交平台时显示的标题、摘要与配图，建议与页面标题和摘要含义一致。',
  };
  const t = map[tab];
  if (!t) return '';
  const cls = pos === 'bottom' ? 'onpage-tab-lead onpage-tab-lead--bottom' : 'onpage-tab-lead';
  return `<p class="${cls}">${escapeHtmlStr(t)}</p>`;
}

function onPageIntlLeadHTML(sub) {
  const href = '列出各语言版本页面之间的对应关系，发布前请确认互相指向正确，并为主要市场设置默认语言页。';
  const canon = '用于指定搜索引擎优先收录的网址版本；多语言站点请与语言对应关系一起核对，避免出现多个重复地址。';
  const txt = sub === 'canonical' ? canon : href;
  return `<p class="onpage-tab-lead onpage-tab-lead--bottom">${escapeHtmlStr(txt)}</p>`;
}

window.dismissOnPageSuggest = function (key) {
  if (!key) return;
  if (!state.onPageDismissSuggest) state.onPageDismissSuggest = {};
  state.onPageDismissSuggest[String(key)] = 1;
  renderDrawer();
};

function onPageOptSuggestHTML(title, items, dismissKey) {
  if (!items || !items.length) return '';
  const dk = dismissKey != null && dismissKey !== '' ? String(dismissKey) : '';
  if (dk) {
    if (!state.onPageDismissSuggest) state.onPageDismissSuggest = {};
    if (state.onPageDismissSuggest[dk]) return '';
  }
  const closeBtn = dk
    ? `<button type="button" class="onpage-opt-suggest-close" onclick="dismissOnPageSuggest('${escapeAttr(dk)}')" aria-label="关闭建议" title="关闭后直至下次页面检测前不再展示本条建议">×</button>`
    : '';
  return `<div class="onpage-opt-suggest" data-onpage-suggest="${escapeAttr(dk || 'default')}"><div class="onpage-opt-suggest-hd"><span class="onpage-opt-suggest-hd-txt">${escapeHtmlStr(title)}</span>${closeBtn}</div><ul class="onpage-opt-suggest-list">${items.map(t => `<li>${escapeHtmlStr(t)}</li>`).join('')}</ul></div>`;
}

function onPageSchemaGapsBlockHTML(row, isBlog) {
  return '';
}

const ONPAGE_SCHEMA_TYPE_HELP = {
  'jsonld-org': {
    title: '机构信息',
    text: '用于向搜索引擎说明公司或组织是谁、官网在哪里、如何联系您，有助于在搜索结果中展示更清晰的品牌信息。',
    img: 'https://developers.google.com/static/search/docs/images/organization-rich-result.png',
  },
  'jsonld-web': {
    title: '网站信息',
    text: '用于说明网站整体信息与首页入口；如配置了站内搜索，也有助于用户在搜索结果中直接找到站内搜索框。',
    img: 'https://developers.google.com/static/search/docs/images/sitelinks-searchbox01.png',
  },
  'jsonld-blog': {
    title: '博客文章',
    text: '适用于博客或新闻类文章，帮助搜索引擎理解标题、作者、发布时间等信息，更容易展示富摘要。',
    img: 'https://developers.google.com/static/search/docs/images/articles01.png',
  },
  'jsonld-product': {
    title: '产品信息',
    text: '适用于产品详情页，标注名称、图片、价格区间等，便于商品类富摘要。',
    img: 'https://developers.google.com/static/search/docs/images/product-rich-result.png',
  },
  'jsonld-other': {
    title: '其他',
    text: '页面存在未纳入白名单的 Schema 类型时归入此类，便于研发核对与补全映射。',
    img: '',
  },
};

/** 结构化类型白名单（与 SEO / AI 规范表一致，演示子集） */
const ONPAGE_SCHEMA_SLICE_DEFS = [
  { slice: 'jsonld-org', label: '机构信息', types: ['Organization'] },
  { slice: 'jsonld-web', label: '网站信息', types: ['WebSite'] },
  { slice: 'jsonld-blog', label: '博客文章', types: ['BlogPosting', 'Article', 'NewsArticle'] },
  { slice: 'jsonld-product', label: '产品信息', types: ['Product'] },
  { slice: 'jsonld-other', label: '其他', types: [] },
];

function resolveOnPageSchemaTabs(row) {
  const slices = new Set(['jsonld-org', 'jsonld-web']);
  if (/\/blog\//i.test(String(row.path || ''))) slices.add('jsonld-blog');
  if (row.pageType === 'product-detail' || /-pd\d+\.html$/i.test(String(row.path || ''))) slices.add('jsonld-product');
  if (row._schemaHasOther || /\/features\//i.test(String(row.path || ''))) slices.add('jsonld-other');
  return ONPAGE_SCHEMA_SLICE_DEFS.filter(d => slices.has(d.slice));
}

function getOnPageSchemaSnippetsForSlice(row, slice, dom) {
  row.onPageSchemaJsonOverride = row.onPageSchemaJsonOverride && typeof row.onPageSchemaJsonOverride === 'object' ? row.onPageSchemaJsonOverride : {};
  const key = slice;
  if (row.onPageSchemaJsonOverride[key + '__multi']) {
    try {
      const arr = JSON.parse(row.onPageSchemaJsonOverride[key + '__multi']);
      if (Array.isArray(arr)) return arr.map(String);
    } catch (e) { /* fall through */ }
  }
  return [getOnPageSchemaJsonText(row, slice, dom)];
}

function buildOnPageAllSchemaEditText(row, dom) {
  if (row.onPageSchemaAllOverride) return row.onPageSchemaAllOverride;
  const tabs = resolveOnPageSchemaTabs(row);
  const blocks = [];
  tabs.forEach(t => {
    const snippets = getOnPageSchemaSnippetsForSlice(row, t.slice, dom);
    snippets.forEach((json, idx) => {
      const suffix = snippets.length > 1 ? ` #${idx + 1}` : '';
      blocks.push({
        label: t.label + suffix,
        slice: t.slice,
        json: typeof json === 'string' ? json : JSON.stringify(json, null, 2),
      });
    });
  });
  return JSON.stringify(blocks, null, 2);
}

function getOnPageSchemaSliceDefaultJson(row, slice, dom) {
  const siteName = String(site().name || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const headline = String(row.title || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (slice === 'jsonld-org') {
    return `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${siteName}",\n  "url": "https://${dom}/"\n}`;
  }
  if (slice === 'jsonld-web') {
    return `{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${siteName}",\n  "url": "https://${dom}/"\n}`;
  }
  if (slice === 'jsonld-product') {
    return `{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "${headline}"\n}`;
  }
  if (slice === 'jsonld-other') {
    return `{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "${headline}"\n}`;
  }
  return `{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "${headline}",\n  "datePublished": ""\n}`;
}

function getOnPageSchemaJsonText(row, slice, dom) {
  row.onPageSchemaJsonOverride = row.onPageSchemaJsonOverride && typeof row.onPageSchemaJsonOverride === 'object' ? row.onPageSchemaJsonOverride : {};
  if (row.onPageSchemaJsonOverride[slice]) return row.onPageSchemaJsonOverride[slice];
  return getOnPageSchemaSliceDefaultJson(row, slice, dom);
}

function onPageSchemaSliceLabelZh(slice) {
  const d = ONPAGE_SCHEMA_SLICE_DEFS.find(x => x.slice === slice);
  return d ? d.label : '结构化信息';
}

function onPageSchemaSubtabWithInfoHTML(slice, label, isActive) {
  const h = ONPAGE_SCHEMA_TYPE_HELP[slice];
  const act = isActive ? ' active' : '';
  const hint = h
    ? `<div class="onpage-schema-tab-hint-wrap"><button type="button" class="onpage-field-hint-btn onpage-schema-tab-hint" data-onpage-hint="${escapeAttr(h.title + '：' + h.text)}" aria-label="${escapeAttr(h.title + ' 说明')}">${ONPAGE_SVG_INFO_HINT}</button></div>`
    : '';
  return `<div class="onpage-schema-tab-pill${act}">
    <button type="button" class="onpage-subtab onpage-subtab--schema-pill${act}" onclick="state.onPageSchemaSlice='${slice}';renderDrawer();">${escapeHtmlStr(label)}</button>${hint}
  </div>`;
}

window.saveOnPageSchemaJsonFromModal = function () {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可保存至领动 SaaS 后台（示例）', 'error');
    return;
  }
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const el = $('modalOnPageSchemaJson');
  if (!row || !el) return;
  const raw = String(el.value || '').trim();
  let blocks;
  try {
    blocks = JSON.parse(raw);
    if (!Array.isArray(blocks)) throw new Error('not array');
    blocks.forEach(b => {
      if (b && b.json != null) JSON.parse(typeof b.json === 'string' ? b.json : JSON.stringify(b.json));
    });
  } catch (e) {
    toast('内容格式有误：须为 JSON 数组，每项含 label、slice、json 字段', 'error');
    return;
  }
  row.onPageSchemaAllOverride = raw;
  row.onPageSchemaJsonOverride = row.onPageSchemaJsonOverride && typeof row.onPageSchemaJsonOverride === 'object' ? row.onPageSchemaJsonOverride : {};
  const bySlice = {};
  blocks.forEach(b => {
    const sl = b.slice || 'jsonld-other';
    if (!bySlice[sl]) bySlice[sl] = [];
    const j = typeof b.json === 'string' ? b.json : JSON.stringify(b.json, null, 2);
    bySlice[sl].push(j);
  });
  Object.keys(bySlice).forEach(sl => {
    const arr = bySlice[sl];
    if (arr.length === 1) row.onPageSchemaJsonOverride[sl] = arr[0];
    else row.onPageSchemaJsonOverride[sl + '__multi'] = JSON.stringify(arr);
  });
  closeModal();
  toast('已保存本页全部结构化数据并同步至领动 SaaS 后台（示例）');
  render();
  renderDrawer();
};

function onPageIntlSuggestHTML(sub, row) {
  return '';
}

function onPageSocialDisplay(row, metaDesc) {
  const base = {
    ogTitle: row.title,
    ogDesc: metaDesc,
    ogImg: `https://picsum.photos/seed/${encodeURIComponent(row.path)}og/1200/630`,
    twitterCard: 'summary_large_image（示例）',
  };
  const o = row.onPageSocial && typeof row.onPageSocial === 'object' ? row.onPageSocial : {};
  return { ...base, ...o };
}

function modalOnPageDrawerSocial() {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const metaDesc = row ? (row.metaDesc || '（待同步：最近一次抓取或建站系统中的页面摘要）') : '';
  if (!row) {
    return `<div class="modal-header"><span class="modal-title">编辑社交分享</span><button class="modal-close" data-close>×</button></div><div class="modal-body"><p style="font-size:13px;color:var(--text-2);">无法加载页面数据。</p></div><div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  const d0 = onPageSocialDisplay(row, metaDesc);
  const pfSoc = state.onPageAiAuditEditorPrefill;
  const d = pfSoc && pfSoc.kind === 'social'
    ? {
        ...d0,
        ogTitle: pfSoc.ogTitle != null ? String(pfSoc.ogTitle) : d0.ogTitle,
        ogDesc: pfSoc.ogDesc != null ? String(pfSoc.ogDesc) : d0.ogDesc,
        ogImg: pfSoc.ogImg != null ? String(pfSoc.ogImg) : d0.ogImg,
        twitterCard: pfSoc.twitterCard != null ? String(pfSoc.twitterCard) : d0.twitterCard,
      }
    : d0;
  const saasLocked = !siteLeadongSaasAuthorized();
  const ro = saasLocked ? ' readonly' : '';
  const ic = saasLocked ? ' form-input--saas-readonly' : '';
  const tc = saasLocked ? ' form-textarea--saas-readonly' : '';
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">编辑社交分享</span>
      ${aiRecoTriggerInlineHTML('social-modal', 3)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${modalLeadongSaasLockBannerHTML()}
    <div class="form-group"><label class="form-label">og:title</label><input type="text" id="modalOnPageSocTitle" class="form-input${ic}" value="${escapeAttr(d.ogTitle)}"${ro} />${aiRecoFieldPreviewHTML('social-ai-title', 'modalOnPageSocTitle', 'og:title')}</div>
    <div class="form-group"><label class="form-label">og:description</label><textarea id="modalOnPageSocDesc" class="form-textarea${tc}" rows="3"${ro}>${escapeHtmlStr(d.ogDesc)}</textarea>${aiRecoFieldPreviewHTML('social-ai-desc', 'modalOnPageSocDesc', 'og:description')}</div>
    <div class="form-group"><label class="form-label">og:image URL</label><input type="text" id="modalOnPageSocImg" class="form-input${ic}" value="${escapeAttr(d.ogImg)}"${ro} />${aiRecoFieldPreviewHTML('social-ai-img', 'modalOnPageSocImg', 'og:image')}</div>
    <div class="form-group"><label class="form-label">twitter:card</label><input type="text" id="modalOnPageSocTw" class="form-input${ic}" value="${escapeAttr(d.twitterCard)}"${ro} />${aiRecoFieldPreviewHTML('social-ai-tw', 'modalOnPageSocTw', 'twitter:card')}</div>
  </div>
  <div class="modal-footer"><button class="btn-default" data-close>取消</button><button class="btn-primary" onclick="saveOnPageSocialFromModal()"${modalPrimarySaveBtnLockedAttrs()}>保存</button></div>`;
}

function ensureOnPageHintTipEl() {
  let el = $('onPageHintTip');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'onPageHintTip';
  el.className = 'onpage-hint-tip';
  el.setAttribute('role', 'tooltip');
  el.style.display = 'none';
  document.body.appendChild(el);
  return el;
}

function ensureAiRecReasonTipEl() {
  let el = $('aiRecReasonTip');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'aiRecReasonTip';
  el.className = 'ai-rec-reason-tip';
  el.setAttribute('role', 'tooltip');
  el.style.cssText = 'display:none;position:fixed;z-index:10060;max-width:min(360px,calc(100vw - 24px));padding:10px 12px;font-size:12px;line-height:1.5;color:var(--text-1);background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.12);pointer-events:none;white-space:normal;word-break:break-word;';
  document.body.appendChild(el);
  return el;
}

function positionAiRecReasonTip(anchor, tip) {
  const r = anchor.getBoundingClientRect();
  const margin = 8;
  const tw = 280;
  let left = r.right + margin;
  if (left + tw > window.innerWidth - margin) left = Math.max(margin, r.left - tw - margin);
  let top = r.top + r.height / 2 - 18;
  const h = 80;
  top = Math.max(margin, Math.min(window.innerHeight - margin - h, top));
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
  tip.style.maxWidth = `${tw}px`;
}

function bindAiRecPreviewInteractions(root) {
  if (!root) return;
  const tip = ensureAiRecReasonTipEl();
  root.querySelectorAll('[data-ai-reason-tip]').forEach(el => {
    if (el.dataset.aiRecReasonTipBound) return;
    el.dataset.aiRecReasonTipBound = '1';
    const show = () => {
      const txt = el.getAttribute('data-ai-reason-tip');
      if (!txt) return;
      tip.textContent = txt;
      tip.style.display = 'block';
      positionAiRecReasonTip(el, tip);
    };
    const hide = () => { tip.style.display = 'none'; };
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', show);
    el.addEventListener('blur', hide);
  });
}

function bindOnPageDrawerHints(root) {
  const base = root || $('drawer');
  if (!base) return;
  const aiHeroBtn = base.querySelector('.onpage-ai-tab-empty .btn-dash-ai--hero');
  if (aiHeroBtn && !aiHeroBtn.dataset.onpageAiAuditBound) {
    aiHeroBtn.dataset.onpageAiAuditBound = '1';
    aiHeroBtn.addEventListener('click', e => {
      e.preventDefault();
      if (typeof window.onPageDrawerAiAudit === 'function') window.onPageDrawerAiAudit();
    });
  }
  base.querySelectorAll('.onpage-field-hint-btn').forEach(btn => {
    if (btn.dataset.onpageHintBound) return;
    btn.dataset.onpageHintBound = '1';
    btn.addEventListener('mouseenter', onPageHintShow);
    btn.addEventListener('mouseleave', onPageHintHide);
    btn.addEventListener('focus', onPageHintShow);
    btn.addEventListener('blur', onPageHintHide);
  });
  base.querySelectorAll('.onpage-ai-rec-apply[data-onpage-ai-apply]').forEach(btn => {
    if (btn.dataset.onpageAiApplyBound) return;
    btn.dataset.onpageAiApplyBound = '1';
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.onPageAiRecApply === 'function') {
        window.onPageAiRecApply(btn.getAttribute('data-onpage-ai-apply'));
      }
    });
  });
}

window.onPageHintShow = function (e) {
  const btn = e.currentTarget;
  const text = btn.getAttribute('data-onpage-hint');
  if (!text) return;
  const tip = ensureOnPageHintTipEl();
  tip.textContent = text;
  tip.style.position = 'fixed';
  tip.style.zIndex = '10050';
  tip.style.display = 'block';
  const r = btn.getBoundingClientRect();
  const tw = 260;
  tip.style.maxWidth = `${tw}px`;
  tip.style.whiteSpace = 'normal';
  tip.style.wordBreak = 'break-word';
  tip.style.left = `${Math.min(window.innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2))}px`;
  tip.style.top = `${r.bottom + 6}px`;
};

window.onPageHintHide = function () {
  const tip = $('onPageHintTip');
  if (tip) tip.style.display = 'none';
};

function onPageDefaultImageRows(row) {
  const dom = site().domain;
  const p = String(row.path || '/').replace(/\/$/, '') || '';
  const slug = encodeURIComponent((p || '/').replace(/\//g, '_'));
  return [
    { alt: 'cabinet hinge stainless（示例）', title: 'Hero product — hinge series', url: `https://${dom}${p || ''}/media/hero-${slug}.jpg` },
    { alt: '', title: 'Gallery image 2', url: `https://${dom}${p || ''}/media/gallery-02-${slug}.jpg` },
    { alt: '', title: '', url: `https://${dom}${p || ''}/media/gallery-03-${slug}.jpg` },
  ];
}

function onPageGetImageRows(row) {
  const def = onPageDefaultImageRows(row);
  const cur = row.onPageImages;
  if (!cur || !Array.isArray(cur) || cur.length < 3) return def.map(d => ({ ...d }));
  return [0, 1, 2].map(i => ({ ...def[i], ...(cur[i] || {}) }));
}

function modalOnPageDrawerImage() {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const ii = state.onPageImageEditIndex;
  if (!row || ii == null || ii < 0 || ii > 2) {
    return `<div class="modal-header"><span class="modal-title">编辑图片 SEO</span><button class="modal-close" data-close>×</button></div><div class="modal-body"><p style="font-size:13px;color:var(--text-2);">无法加载图片行。</p></div><div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  const im = onPageGetImageRows(row)[ii];
  const pfImg = state.onPageAiAuditEditorPrefill;
  const altVal = pfImg && pfImg.kind === 'image' && pfImg.alt != null ? String(pfImg.alt) : String(im.alt || '');
  const saasLocked = !siteLeadongSaasAuthorized();
  const ro = ' readonly';
  const ic = ' form-input--saas-readonly';
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">编辑图片 SEO（第 ${ii + 1} 张）</span>
      ${aiRecoTriggerInlineHTML('image-modal', 3)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${modalLeadongSaasLockBannerHTML()}
    <div class="form-group"><label class="form-label">ALT 替代文本</label><input type="text" id="modalOnPageImgAlt" class="form-input${ic}" value="${escapeAttr(altVal)}" placeholder="简要描述画面与语义关键词"${ro} />${aiRecoFieldPreviewHTML('image-ai-alt', 'modalOnPageImgAlt', 'ALT 替代文本')}</div>
    <div class="form-group"><label class="form-label">Title 属性</label><input type="text" id="modalOnPageImgTitle" class="form-input${ic}" value="${escapeAttr(im.title || '')}"${ro} /></div>
    <p class="form-hint">图片地址由建站系统托管，此处仅维护展示给访客与搜索引擎的文字信息（示例）。</p>
  </div>
  <div class="modal-footer"><button class="btn-default" data-close>取消</button><button class="btn-primary" onclick="saveOnPageImageFromModal()"${modalPrimarySaveBtnLockedAttrs()}>保存</button></div>`;
}

function modalOnPageDrawerSchemaRow() {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const k = state.onPageSchemaEditKey || 'org-logo';
  const labels = {
    'org-logo': 'Organization · logo',
    'org-same': 'Organization · sameAs',
    'ai-audit': 'AI 测评 · 结构化待办',
    'body-audit': 'AI 测评 · 正文与意图',
  };
  const lab = labels[k] || k;
  if (!row) {
    return `<div class="modal-header"><span class="modal-title">编辑结构化字段</span><button class="modal-close" data-close>×</button></div><div class="modal-body"><p style="font-size:13px;color:var(--text-2);">无法加载页面。</p></div><div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  row.onPageSchemaNotes = row.onPageSchemaNotes && typeof row.onPageSchemaNotes === 'object' ? row.onPageSchemaNotes : {};
  let v = row.onPageSchemaNotes[k] != null ? String(row.onPageSchemaNotes[k]) : '';
  const pfSch = state.onPageAiAuditEditorPrefill;
  if (pfSch && pfSch.kind === 'schema-row' && pfSch.note != null) v = String(pfSch.note);
  const saasLocked = !siteLeadongSaasAuthorized();
  const ro = saasLocked ? ' readonly' : '';
  const tc = saasLocked ? ' form-textarea--saas-readonly' : '';
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">编辑 · ${escapeHtmlStr(lab)}</span>
      ${aiRecoTriggerInlineHTML('schema-row', 4)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${modalLeadongSaasLockBannerHTML()}
    <div class="form-group"><label class="form-label">备注 / 片段（示例）</label><textarea id="modalOnPageSchNote" class="form-textarea${tc}" rows="5" placeholder="记录待办或粘贴 JSON 片段…"${ro}>${escapeHtmlStr(v)}</textarea></div>
    ${aiRecoPreviewOnlyHTML('schema-row')}
  </div>
  <div class="modal-footer"><button class="btn-default" data-close>取消</button><button class="btn-primary" onclick="saveOnPageSchemaRowFromModal()"${modalPrimarySaveBtnLockedAttrs()}>保存</button></div>`;
}

window.saveOnPageImageFromModal = function () {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可保存（示例）', 'error');
    return;
  }
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const ii = state.onPageImageEditIndex;
  const a = $('modalOnPageImgAlt');
  const b = $('modalOnPageImgTitle');
  if (!row || ii == null || ii < 0 || ii > 2 || !a || !b) return;
  const all = onPageGetImageRows(row);
  all[ii] = { ...all[ii], alt: (a.value || '').trim(), title: (b.value || '').trim() };
  row.onPageImages = all;
  closeModal();
  toast('已保存图片 ALT / Title');
  renderDrawer();
};

window.saveOnPageSchemaRowFromModal = function () {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可保存（示例）', 'error');
    return;
  }
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const k = state.onPageSchemaEditKey;
  const el = $('modalOnPageSchNote');
  if (!row || !k || !el) return;
  row.onPageSchemaNotes = row.onPageSchemaNotes && typeof row.onPageSchemaNotes === 'object' ? row.onPageSchemaNotes : {};
  row.onPageSchemaNotes[k] = (el.value || '').trim();
  closeModal();
  toast('已保存结构化备注（示例）');
  renderDrawer();
};

window.saveOnPageSocialFromModal = function () {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可保存（示例）', 'error');
    return;
  }
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  if (!row) return;
  const a = $('modalOnPageSocTitle');
  const b = $('modalOnPageSocDesc');
  const c = $('modalOnPageSocImg');
  const d = $('modalOnPageSocTw');
  if (!a || !b || !c || !d) return;
  row.onPageSocial = {
    ogTitle: (a.value || '').trim(),
    ogDesc: (b.value || '').trim(),
    ogImg: (c.value || '').trim(),
    twitterCard: (d.value || '').trim(),
  };
  closeModal();
  toast('已保存社交分享信息');
  render();
  renderDrawer();
};

/** 参考 AITDK：字段旁「当前长度/建议上限」徽章 */
function onPageTdkCharBadgeHTML(len, max) {
  const n = Math.max(0, Math.floor(Number(len) || 0));
  const m = Math.max(1, Math.floor(Number(max) || 1));
  const over = n > m;
  const cls = over ? 'onpage-tdk-count onpage-tdk-count--warn' : 'onpage-tdk-count onpage-tdk-count--ok';
  return `<span class="${cls}">${n}/${m}</span>`;
}

function onPageTdkHintsHTML(row) {
  return '';
}

function onPageDiagnoseRows(row) {
  const lvLabel = { critical: '严重', warning: '警告', suggestion: '建议' };
  const lvCls = { critical: 'onpage-sev-c', warning: 'onpage-sev-w', suggestion: 'onpage-sev-s' };
  let items = [];
  if (row.issuesDetail && row.issuesDetail.length) {
    items = row.issuesDetail.map((it, i) => ({
      lv: it.lv,
      desc: it.t,
      sug: it.sug || (row.suggestions && row.suggestions[i]) || '请对照相关维度页签修复后复检',
    }));
  } else {
    items = [
      { lv: 'warning', desc: row.dimA, sug: '在「标题与摘要」页签调整标题长度、页面摘要与网址相关设置，并复查收录情况' },
      { lv: 'warning', desc: row.dimB, sug: '在「标题层级」页签梳理主标题唯一性与各级小标题的层次' },
      { lv: 'suggestion', desc: row.dimC, sug: '结合关键词页签平衡词频与可读性' },
      { lv: 'suggestion', desc: row.dimD, sug: '完善图片说明与结构化信息，并修复失效链接后复检' },
    ];
  }
  return items.map(it => `
    <tr>
      <td style="white-space:normal;font-size:13px;line-height:1.45;">${escapeHtmlStr(it.desc)}</td>
      <td style="white-space:nowrap;vertical-align:top;"><span class="onpage-sev-badge ${lvCls[it.lv] || 'onpage-sev-s'}">${escapeHtmlStr(lvLabel[it.lv] || '建议')}</span></td>
      <td style="white-space:normal;font-size:13px;color:var(--text-2);line-height:1.45;">${escapeHtmlStr(it.sug)}</td>
    </tr>`).join('');
}

function onPageSerpPreviewBlock(row, metaDesc) {
  const device = state.onPageSerpDevice || 'pc';
  const dom = site().domain;
  const url = `https://${dom}${row.path}`;
  const desc = metaDesc || '—';
  const pcActive = device === 'pc' ? ' active' : '';
  const moActive = device === 'mobile' ? ' active' : '';
  const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(dom)}`;
  const brand = escapeHtmlStr(site().name || dom.split('.')[0]);
  const titleEsc = escapeHtmlStr(row.title);
  const urlEsc = escapeHtmlStr(url);
  const descEsc = escapeHtmlStr(desc);
  const showPc = device === 'pc';
  const showMo = device === 'mobile';
  return `
    <div class="onpage-serp-toolbar">
      <span class="onpage-serp-toolbar-label">Google 搜索结果预览</span>
      <div class="onpage-serp-device-toggle" role="group" aria-label="预览设备">
        <button type="button" class="onpage-serp-dev-btn${pcActive}" onclick="state.onPageSerpDevice='pc';renderDrawer();" aria-label="桌面端预览">${ONPAGE_SVG_PC}</button>
        <button type="button" class="onpage-serp-dev-btn${moActive}" onclick="state.onPageSerpDevice='mobile';renderDrawer();" aria-label="移动端预览">${ONPAGE_SVG_PHONE}</button>
      </div>
    </div>
    <div class="onpage-serp-stage">
      <div class="onpage-google-serp ${showPc ? '' : 'onpage-google-serp--hidden'}">
        <div class="g-serp-pc">
          <div class="g-serp-url-line">
            <img class="g-serp-fav" src="${favicon}" width="26" height="26" alt="" />
            <div class="g-serp-site-block">
              <div class="g-serp-brand">${brand}</div>
              <div class="g-serp-url">${siteUsesHttps() ? httpsLockPrefixHTML() : ''}${urlEsc}</div>
            </div>
          </div>
          <a class="g-serp-title-link" href="#" onclick="return false;"><h3 class="g-serp-title">${titleEsc}</h3></a>
          <div class="g-serp-desc">${descEsc}</div>
        </div>
      </div>
      <div class="onpage-google-serp onpage-google-serp--mo ${showMo ? '' : 'onpage-google-serp--hidden'}">
        <div class="g-serp-mo">
          <div class="g-serp-mo-top">
            <img class="g-serp-fav g-serp-fav--sm" src="${favicon}" width="18" height="18" alt="" />
            <span class="g-serp-mo-brand">${brand}</span>
            <span class="g-serp-mo-dim">▼</span>
          </div>
          <a class="g-serp-title-link g-serp-title-link--mo" href="#" onclick="return false;"><h3 class="g-serp-title g-serp-title--mo">${titleEsc}</h3></a>
          <div class="g-serp-url g-serp-url--mo">${siteUsesHttps() ? httpsLockPrefixHTML() : ''}${urlEsc}</div>
          <div class="g-serp-desc g-serp-desc--mo">${descEsc}</div>
          <div class="g-serp-mo-note">移动端标题更易折行，摘要行数略少（示意）</div>
        </div>
      </div>
    </div>`;
}

/** 列表「分级问题」列：问题 / 建议 / 通过 分色（示例数据拆分展示） */
function onPageIssueCellHTML(r) {
  if (r.issueBreakdown) {
    const b = r.issueBreakdown;
    const i = b.critical != null ? b.critical : 0;
    const a = b.warning != null ? b.warning : 0;
    return `<span class="onpage-issue-split" title="严重 ${i} · 建议 ${a}">
      <span class="onpage-issue-pill onpage-issue-pill--issue"><span class="onpage-issue-n">${i}</span></span>
      <span class="onpage-issue-sep">/</span>
      <span class="onpage-issue-pill onpage-issue-pill--advice"><span class="onpage-issue-n">${a}</span></span>
    </span>`;
  }
  return escapeHtmlStr(String(r.issues));
}

function isKwInMyLibrary(kw) {
  if (!kw || !Array.isArray(DB.myKeywords)) return false;
  const k = String(kw).trim().toLowerCase();
  return DB.myKeywords.some((x) => String(x.word || x).trim().toLowerCase() === k);
}

function onPageKwKebabHTML(listId, rowIdx, kw, inLibrary) {
  const id = `okw-${listId}-${rowIdx}`;
  const kwAttr = escapeAttr(kw);
  const libLine = inLibrary
    ? `<button type="button" class="onpage-dd-item" disabled>已在词库</button>`
    : `<button type="button" class="onpage-dd-item" onclick="addPageKwToLibraryFromStr('${kwAttr}');onPageCloseKwDd();">加入词库</button>`;
  return `<div class="onpage-kebab-wrap">
    <button type="button" class="onpage-icon-btn onpage-kebab-btn" aria-label="更多操作" onclick="onPageToggleKwDd(event,'${id}')">${ONPAGE_SVG_KEBAB}</button>
    <div class="onpage-actions-dd" id="${id}" role="menu">${libLine}
      <button type="button" class="onpage-dd-item" onclick="setPageTargetKwFromStr('${kwAttr}');onPageCloseKwDd();">设为目标词</button>
    </div>
  </div>`;
}

function onPageSchemaKebabHTML(key) {
  const id = `sch-${key}`;
  return `<div class="onpage-kebab-wrap">
    <button type="button" class="onpage-icon-btn onpage-kebab-btn" aria-label="更多操作" onclick="onPageToggleKwDd(event,'${id}')">${ONPAGE_SVG_KEBAB}</button>
    <div class="onpage-actions-dd" id="${id}" role="menu">
      <button type="button" class="onpage-dd-item" onclick="state.onPageSchemaEditKey='${key}';openModal('onpage-drawer-schema-row');onPageCloseKwDd();">编辑</button>
      <button type="button" class="onpage-dd-item" onclick="toast('已复制 JSON 片段（示例）');onPageCloseKwDd();">复制片段</button>
      <button type="button" class="onpage-dd-item" onclick="toast('Schema 校验通过（示例）');onPageCloseKwDd();">校验</button>
    </div>
  </div>`;
}

function onPageSeoDrawerKwRowHTML(row) {
  const kws = parseMultiKw(row.keyword).slice(0, ONPAGE_KW_MAX);
  let disp;
  if (kws.length) {
    disp = kws.map((k, i) => {
      const pill = `<span class="onpage-drawer-kw-pill">${escapeHtmlStr(k)}</span>`;
      return i === kws.length - 1
        ? `${pill}<span class="onpage-drawer-kw-inline-edit" aria-hidden="true">${ONPAGE_SVG_EDIT}</span>`
        : pill;
    }).join('');
  } else {
    disp = '<span class="onpage-drawer-kw-muted">未设置</span><span class="onpage-drawer-kw-inline-edit" aria-hidden="true">' + ONPAGE_SVG_EDIT + '</span>';
  }
  return `<div class="onpage-drawer-kw">
      <div class="onpage-drawer-kw-main onpage-drawer-kw-main--inline" role="button" tabindex="0" onclick="openModal('onpage-drawer-kw')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal('onpage-drawer-kw');}" title="点击编辑目标词" aria-label="编辑目标词">
        <span class="onpage-drawer-kw-muted">目标词</span>
        <div class="onpage-drawer-kw-pills-wrap">${disp}</div>
      </div>
    </div>`;
}

function formatYmdSlash(ymd) {
  return String(ymd || '').trim().replace(/-/g, '/');
}

function onPageKwRangeDisplay() {
  return `${formatYmdSlash(state.onPageKwDateFrom)} – ${formatYmdSlash(state.onPageKwDateTo)}`;
}

window.applyOnPageKwRangeFromInput = function () {
  const el = $('onPageKwRangeInput');
  if (!el) return;
  const raw = String(el.value || '').trim();
  const parts = raw.split(/\s*[–—]\s*|\s+-\s+/);
  if (parts.length >= 2) {
    const a = parts[0].trim().replace(/\//g, '-');
    const b = parts[1].trim().replace(/\//g, '-');
    if (/^\d{4}-\d{2}-\d{2}$/.test(a) && /^\d{4}-\d{2}-\d{2}$/.test(b)) {
      state.onPageKwDateFrom = a;
      state.onPageKwDateTo = b;
    }
  }
  renderDrawer();
};

window.onPageToggleImageFilter = function (v) {
  if (!Array.isArray(state.onPageImageFilters)) state.onPageImageFilters = [];
  const i = state.onPageImageFilters.indexOf(v);
  if (i >= 0) state.onPageImageFilters.splice(i, 1);
  else state.onPageImageFilters.push(v);
  renderDrawer();
};

window.onPageToggleHeadingFilter = function (tag) {
  state.onPageHeadingFilter = state.onPageHeadingFilter === tag ? null : tag;
  renderDrawer();
};

window.demoAuthorizeGSCFromSettings = function () {
  const s = site();
  if (!s) return;
  s.gscAuthorized = true;
  toast('已授权 Google Search Console（示例）');
  $('modalBox').innerHTML = modalSiteSettings();
  bindSiteSettingsTabs();
};

window.demoRevokeGSCFromSettings = function () {
  const s = site();
  if (!s) return;
  s.gscAuthorized = false;
  toast('已解除 Google Search Console 授权（示例）');
  $('modalBox').innerHTML = modalSiteSettings();
  bindSiteSettingsTabs();
  render();
};

function onPageHeadingsHintsHTML(row) {
  return '';
}

function onPageImagesHintsHTML(row) {
  return '';
}

function onPageSeoDrawerTabBody(row) {
  const tab = state.onPageSeoDrawerTab || 'diagnose';
  const dom = site().domain;
  const metaDesc = row.metaDesc || '（待同步：最近一次抓取或建站系统中的页面摘要）';
  const metaKw = row.metaKeywords || '—';

  if (tab === 'diagnose') {
    const auditedAt = row.onPageAuditedAt || (row.onPageScoreAt ? `${row.onPageScoreAt} 18:22:06` : '—');
    return `
    <div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--diag">
      <div class="onpage-aitdk-section-head onpage-aitdk-section-head--row onpage-aitdk-section-head--diag">
        <div class="onpage-aitdk-title-actions">
          ${onPageDrawerModuleTitleHTML('常规检测', ONPAGE_DIAG_DRAWER_HINT)}
          <button type="button" class="btn-default btn-sm" onclick="onPageDrawerRescanCurrent()">重新检测</button>
          <span class="onpage-audit-at">最后测评：<time>${escapeHtmlStr(auditedAt)}</time></span>
        </div>
      </div>
      ${onPageWincherDiagnoseHTML(row)}
    </div>`;
  }

  if (tab === 'ai') {
    return `<div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--ai">${onPageAiAuditTabHTML(row)}</div>`;
  }

  if (tab === 'tdk') {
    const titleLen = (row.title || '').length;
    const descLen = (metaDesc || '').length;
    const kwPlain = metaKw === '—' ? '' : String(metaKw || '');
    const kwLen = kwPlain.length;
    return `
    <div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--tdk">
      ${onPageTdkHintsHTML(row)}
      <div class="onpage-aitdk-section-head onpage-aitdk-section-head--row">
        <h3 class="onpage-aitdk-section-title">TDK</h3>
        <button type="button" class="btn-primary btn-sm" onclick="openModal('onpage-drawer-tdk')">编辑</button>
      </div>
      <table class="data-table onpage-mini-table onpage-tdk-table">
        <thead><tr><th style="min-width:100px;">字段</th><th>内容</th><th class="onpage-tdk-th-count" style="width:96px;text-align:right;">参考字数</th></tr></thead>
        <tbody>
          <tr><td class="onpage-tdk-field-label">页面标题</td><td style="white-space:normal;font-size:13px;line-height:1.45;">${escapeHtmlStr(row.title)}</td><td style="text-align:right;vertical-align:top;">${onPageTdkCharBadgeHTML(titleLen, 60)}</td></tr>
          <tr><td class="onpage-tdk-field-label">页面摘要</td><td style="white-space:normal;font-size:13px;line-height:1.45;color:var(--text-2);">${escapeHtmlStr(metaDesc)}</td><td style="text-align:right;vertical-align:top;">${onPageTdkCharBadgeHTML(descLen, 160)}</td></tr>
          <tr><td class="onpage-tdk-field-label">关键词</td><td style="white-space:normal;font-size:13px;line-height:1.45;color:var(--text-2);">${escapeHtmlStr(metaKw)}</td><td style="text-align:right;vertical-align:top;">${onPageTdkCharBadgeHTML(kwLen, 100)}</td></tr>
        </tbody>
      </table>
      ${onPageSerpPreviewBlock(row, metaDesc)}
    </div>`;
  }

  if (tab === 'headings') {
    const h1Plain = row.title.split(/[—–-]/)[0].trim() || row.title;
    const h1Text = escapeHtmlStr(h1Plain);
    const counts = [1, 9, 6, 0, 0, 0];
    const filt = state.onPageHeadingFilter;
    const countRow = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((tag, i) => {
      const act = filt === tag ? ' onpage-h-aitdk-count--active' : '';
      return `<button type="button" class="onpage-h-aitdk-count${act}" onclick="onPageToggleHeadingFilter('${tag}')" aria-pressed="${filt === tag ? 'true' : 'false'}"><span class="onpage-h-aitdk-lv">${tag}</span><strong>${counts[i]}</strong></button>`;
    }).join('');
    const hLv = { H1: 1, H2: 2, H3: 3, H4: 4, H5: 5, H6: 6 };
    const flatNodes = [
      { lv: 1, text: h1Plain },
      { lv: 2, text: '类目推荐与典型应用场景（示例文案）' },
      { lv: 3, text: '规格参数与选型说明（示例文案）' },
      { lv: 2, text: '资质认证与交付能力（示例文案）' },
    ];
    const filteredRows = filt
      ? flatNodes.filter(n => n.lv === hLv[filt]).map(n => {
        const lv = n.lv;
        const tag = `H${lv}`;
        return `<div class="onpage-h-aitdk-row onpage-h-aitdk-row--lv${lv}">
          <span class="onpage-h-aitdk-tag onpage-h-aitdk-tag--h${lv}">${tag}</span>
          <span class="onpage-h-aitdk-connector" aria-hidden="true"></span>
          <span class="onpage-h-aitdk-text">${escapeHtmlStr(n.text)}</span>
        </div>`;
      }).join('')
      : '';
    const treeBlock = !filt
      ? `<div class="onpage-h-tree onpage-h-tree--aitdk" role="tree" aria-label="页面标题层级">
        <div class="onpage-h-aitdk-nest onpage-h-aitdk-nest--rootless">
          <div class="onpage-h-aitdk-row onpage-h-aitdk-row--lv1">
            <span class="onpage-h-aitdk-tag onpage-h-aitdk-tag--h1">H1</span>
            <span class="onpage-h-aitdk-connector" aria-hidden="true"></span>
            <span class="onpage-h-aitdk-text">${h1Text}</span>
          </div>
          <div class="onpage-h-aitdk-nest">
            <div class="onpage-h-aitdk-row onpage-h-aitdk-row--lv2">
              <span class="onpage-h-aitdk-tag onpage-h-aitdk-tag--h2">H2</span>
              <span class="onpage-h-aitdk-connector" aria-hidden="true"></span>
              <span class="onpage-h-aitdk-text">${escapeHtmlStr(row._aiHeadingHint || '类目推荐与典型应用场景（示例文案）')}</span>
            </div>${headingsAiRecoAfterFirstH2HTML()}
            <div class="onpage-h-aitdk-nest onpage-h-aitdk-nest--deep">
              <div class="onpage-h-aitdk-row onpage-h-aitdk-row--lv3">
                <span class="onpage-h-aitdk-tag onpage-h-aitdk-tag--h3">H3</span>
                <span class="onpage-h-aitdk-connector" aria-hidden="true"></span>
                <span class="onpage-h-aitdk-text">规格参数与选型说明（示例文案）</span>
              </div>
            </div>
            <div class="onpage-h-aitdk-row onpage-h-aitdk-row--lv2" style="margin-top:8px;">
              <span class="onpage-h-aitdk-tag onpage-h-aitdk-tag--h2">H2</span>
              <span class="onpage-h-aitdk-connector" aria-hidden="true"></span>
              <span class="onpage-h-aitdk-text">资质认证与交付能力（示例文案）</span>
            </div>
          </div>
        </div>
      </div>`
      : `<div class="onpage-h-tree onpage-h-tree--aitdk onpage-h-tree--aitdk-filtered" role="tree" aria-label="筛选后的标题">${filteredRows || '<p class="onpage-wc-empty">该层级暂无标题（示例）</p>'}</div>`;
    return `
    <div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--headings">
      ${onPageHeadingsHintsHTML(row)}
      <div class="onpage-aitdk-section-head onpage-aitdk-section-head--row onpage-aitdk-section-head--with-ai">
        <div class="onpage-aitdk-title-actions">
          <h3 class="onpage-aitdk-section-title">H标题</h3>
          ${aiRecoTriggerInlineHTML('headings', 6)}
        </div>
      </div>
      <div class="onpage-h-aitdk-counts" aria-label="各级标题数量（示例）">${countRow}</div>
      ${treeBlock}
    </div>`;
  }

  if (tab === 'images') {
    const seed = encodeURIComponent(row.path.replace(/\//g, '_') || 'page');
    const rows = onPageGetImageRows(row);
    const flt = Array.isArray(state.onPageImageFilters) ? state.onPageImageFilters : [];
    const fna = flt.includes('no-alt') ? ' active' : '';
    const fnt = flt.includes('no-title') ? ' active' : '';
    const filtered = rows.map((im, i) => ({ im, i, n: String(i + 1) })).filter(o => {
      const noAlt = !o.im.alt || !String(o.im.alt).trim();
      const noTitle = !o.im.title || !String(o.im.title).trim();
      if (!flt.length) return true;
      let ok = true;
      if (flt.includes('no-alt')) ok = ok && noAlt;
      if (flt.includes('no-title')) ok = ok && noTitle;
      return ok;
    });
    const imgRow = (n, im, i) => {
      const altMissing = !im.alt || !String(im.alt).trim();
      const altCell = altMissing
        ? `<span class="onpage-img-alt-warn">${ONPAGE_SVG_ALT_WARN}<span class="onpage-img-alt-empty">（空）</span></span>`
        : escapeHtmlStr(im.alt);
      const urlStr = im.url || `https://${dom}${row.path.replace(/\/?$/, '')}/media/img-${n}.jpg`;
      return `
          <tr>
            <td class="onpage-img-col-thumb" style="width:72px;"><img class="onpage-img-thumb" src="https://picsum.photos/seed/${seed}${n}/56/56" width="56" height="56" alt="" /></td>
            <td class="onpage-img-url-cell">${/^https:\/\//i.test(String(urlStr)) ? httpsLockPrefixHTML() : ''}<code>${escapeHtmlStr(urlStr)}</code></td>
            <td style="font-size:12px;white-space:normal;">${altCell}</td>
            <td style="font-size:12px;white-space:normal;color:var(--text-2);">${im.title && String(im.title).trim() ? escapeHtmlStr(im.title) : '<span style="color:var(--text-3);">（空）</span>'}</td>
            <td class="onpage-actions-td onpage-img-col-act"><button type="button" class="onpage-icon-btn" onclick="event.stopPropagation();state.onPageImageEditIndex=${i};openModal('onpage-drawer-image');" aria-label="编辑">${ONPAGE_SVG_EDIT}</button></td>
          </tr>`;
    };
    const tbody = filtered.length
      ? filtered.map(o => imgRow(o.n, o.im, o.i)).join('')
      : `<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-3);">当前筛选下无图片</td></tr>`;
    return `
    <div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--images">
      ${onPageImagesHintsHTML(row)}
      <div class="onpage-aitdk-section-head">
        <h3 class="onpage-aitdk-section-title">图片</h3>
      </div>
      <div class="onpage-img-filter-bar onpage-img-filter-bar--minimal">
        <div class="onpage-img-filter-toggle" role="group" aria-label="图片筛选">
          <button type="button" class="onpage-img-filter-btn${fna}" onclick="onPageToggleImageFilter('no-alt')">无 ALT</button>
          <button type="button" class="onpage-img-filter-btn${fnt}" onclick="onPageToggleImageFilter('no-title')">无 Title</button>
        </div>
      </div>
      <table class="data-table onpage-mini-table onpage-mini-table--images">
        <thead><tr><th class="onpage-img-col-thumb" style="width:80px;">图片</th>${onPageThWithHint('URL', '这张图片在网站里的存放地址，方便您对照是否用对了文件。', 'class="onpage-img-url-th" style="min-width:160px;max-width:220px;"')}${onPageThWithHint('ALT', '给搜索引擎和读屏用户的一句话说明：图片里是什么、和页面主题有什么关系。')}${onPageThWithHint('Title', '鼠标悬停在图片上时，可能出现的一行补充提示（可选）。')}<th class="onpage-img-col-act" style="width:52px;text-align:right;">操作</th></tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>`;
  }

  if (tab === 'keywords') {
    const mode = state.onPageKwListMode || 'rank';
    const si = site();
    const hasGsc = !!si.hasGSC || !!si.gscAuthorized || !!row.hasGscLanding;
    const rangeVal = escapeAttr(onPageKwRangeDisplay());
    const primaryKw = parseMultiKw(row.keyword)[0] || '';
    const rankRows = row.path.indexOf('blog') >= 0
      ? [
          { kw: 'construction hardware trends', rank: 24, rankDate: '2025-09-25', engine: 'Google · 美国', inLibrary: false },
          { kw: 'hardware export 2025', rank: 41, rankDate: '2025-09-20', engine: 'Google · 美国', inLibrary: false },
        ]
      : [
          { kw: primaryKw || 'B2B hardware supplier', rank: 14, rankDate: '2025-09-28', engine: 'Google · 美国', inLibrary: true },
          { kw: 'hardware export china', rank: 28, rankDate: '2025-09-26', engine: 'Google · 美国', inLibrary: false },
        ];
    const gscRows = [
      { kw: 'cabinet hinges wholesale', imp: 4200, clk: 96, ctr: '2.3%', rank: 9 },
      { kw: 'industrial fasteners b2b', imp: 1800, clk: 21, ctr: '1.2%', rank: 42 },
    ];
    const rankActive = mode === 'rank' ? ' active' : '';
    const gscActive = mode === 'gsc' ? ' active' : '';
    const recActive = mode === 'recommend' ? ' active' : '';
    const rankBody = rankRows.map((rn, ri) => {
      const dens = onPageKwDensityPercent(rn.kw, row);
      const densTitle = escapeAttr(`基于当前页可解析文本（标题、摘要、各维度摘要等）估算的「${rn.kw}」出现占比（示例）。`);
      return `<tr>
        <td style="font-size:13px;"><span class="td-kw">${escapeHtmlStr(rn.kw)}</span></td>
        <td>${rn.rank != null ? `<span class="badge badge-blue">${rn.rank}</span>` : '—'}</td>
        <td style="font-size:12px;color:var(--text-2);">${escapeHtmlStr(rn.engine)}</td>
        <td style="font-size:12px;color:var(--text-2);">${escapeHtmlStr(rn.rankDate)}</td>
        <td style="font-size:12px;" title="${densTitle}">${escapeHtmlStr(dens)}</td>
        <td class="onpage-actions-td">${onPageKwKebabHTML('rank', ri, rn.kw, rn.inLibrary || isKwInMyLibrary(rn.kw))}</td>
      </tr>`;
    }).join('');
    const gscBody = gscRows.map((g, gi) => {
      const dens = onPageKwDensityPercent(g.kw, row);
      const densTitle = escapeAttr(`基于当前页可解析文本估算的「${g.kw}」关键词密度（示例）。`);
      return `<tr>
        <td style="font-size:13px;"><span class="td-kw">${escapeHtmlStr(g.kw)}</span></td>
        <td style="font-size:12px;">${g.imp.toLocaleString()}</td>
        <td style="font-size:12px;">${g.clk}</td>
        <td style="font-size:12px;">${escapeHtmlStr(g.ctr)}</td>
        <td>${g.rank != null ? `<span class="badge badge-gray">${g.rank}</span>` : '—'}</td>
        <td style="font-size:12px;" title="${densTitle}">${escapeHtmlStr(dens)}</td>
        <td class="onpage-actions-td">${onPageKwKebabHTML('gsc', gi, g.kw, isKwInMyLibrary(g.kw))}</td>
      </tr>`;
    }).join('');
    const rankBlock = `
      <table class="data-table onpage-mini-table">
        <thead><tr>${onPageThWithHint('关键词', '与当前页面一起被监测的搜索词。', '')}${onPageThWithHint('排名', '该词在搜索结果中的位置。', 'style="width:72px;"')}${onPageThWithHint('搜索引擎', '这条排名数据来自哪个搜索引擎及地区。', 'style="width:120px;"')}${onPageThWithHint('排名日期', '最近一次抓到该排名的时间。', 'style="width:104px;"')}${onPageThWithHint('密度', '该词在当前页可解析文本中的近似出现占比，用于判断露出是否过低或偏高。', 'style="width:72px;"')}<th style="width:52px;text-align:right;">操作</th></tr></thead>
        <tbody>${rankBody}</tbody>
      </table>`;
    const gscTable = `
      <table class="data-table onpage-mini-table">
        <thead><tr>${onPageThWithHint('关键词', '用户在所选日期区间内、通过 Google 搜索看到您这条链接时使用的查询词。', '')}${onPageThWithHint('曝光', '所选日期区间内，此页面链接在搜索结果中的展示总次数。', 'style="width:72px;"')}${onPageThWithHint('点击', '所选日期区间内，用户从搜索结果点击进入您网站的总次数。', 'style="width:56px;"')}${onPageThWithHint('CTR', '所选日期区间内，点击次数占曝光次数的比例。', 'style="width:56px;"')}${onPageThWithHint('排名', '所选日期区间内，该查询下您的链接平均排名。', 'style="width:72px;"')}${onPageThWithHint('密度', '该查询词在当前页可解析文本中的近似占比。', 'style="width:72px;"')}<th style="width:52px;text-align:right;">操作</th></tr></thead>
        <tbody>${gscBody}</tbody>
      </table>`;
    const gscBlock = hasGsc ? gscTable : onPageGscUnauthorizedPaneHTML();
    const recReasonDefault = escapeAttr('结合当前页标题、摘要、正文维度摘要与主目标词扩展的可监控词建议（示例，非实时大模型）。');
    const recRows = [
      { kw: primaryKw ? `${primaryKw} bulk export` : 'B2B hardware bulk export', intent: '交易性', kwType: '长尾关键词', relevance: 92, reason: '与当前主目标词同簇，适合作为长尾监控词并写入落地段落小标题。' },
      { kw: row.path.indexOf('blog') >= 0 ? 'construction hardware market 2025' : 'stainless cabinet hinges supplier', intent: '信息性', kwType: '次关键词', relevance: 86, reason: '覆盖信息检索意图，便于拓展内容集群与内链锚文本。' },
      { kw: 'soft close hinge wholesale MOQ', intent: '商业性', kwType: '商业关键词', relevance: 78, reason: '补充采购决策阶段常用修饰语，利于 B2B 询盘型检索。' },
      { kw: row.path.indexOf('blog') >= 0 ? 'how to choose cabinet hinges' : `${primaryKw || 'B2B hardware'} supplier`, intent: '信息性', kwType: '问题关键词', relevance: 74, reason: '问题型查询与当前页主题相关，可支撑 FAQ 或指南段落。' },
      { kw: primaryKw || 'cabinet hinges wholesale', intent: '导航性', kwType: '主关键词', relevance: 95, reason: '与页面核心主题高度一致，建议纳入主监控词库。' },
    ];
    const recBody = recRows.map((rn, rj) => {
      const rt = escapeAttr(rn.reason);
      const rel = rn.relevance != null ? `${rn.relevance}%` : '—';
      const inLib = isKwInMyLibrary(rn.kw) || parseMultiKw(row.keyword).some(k => String(k).toLowerCase() === String(rn.kw).toLowerCase());
      return `<tr>
        <td style="font-size:13px;"><span class="td-kw" title="${rt}">${escapeHtmlStr(rn.kw)}</span></td>
        <td style="font-size:12px;white-space:nowrap;">${escapeHtmlStr(rn.intent || '—')}</td>
        <td style="font-size:12px;white-space:nowrap;">${escapeHtmlStr(rn.kwType || '—')}</td>
        <td style="font-size:12px;font-weight:600;color:var(--brand);">${escapeHtmlStr(rel)}</td>
        <td style="font-size:12px;color:var(--text-2);white-space:normal;line-height:1.45;" title="${rt}">${escapeHtmlStr(rn.reason)}</td>
        <td class="onpage-actions-td">${onPageKwKebabHTML('recommend', rj, rn.kw, inLib)}</td>
      </tr>`;
    }).join('');
    const recommendTable = `
      <table class="data-table onpage-mini-table onpage-mini-table--kw-rec">
        <thead><tr>
          <th style="min-width:140px;">推荐关键词</th>
          <th style="width:88px;">${onPageThHintLabelHTML('意图', '检索意图分类：信息性、商业性、交易性、导航性。')}</th>
          <th style="width:120px;">${onPageThHintLabelHTML('关键词类型', '主关键词、次关键词、长尾关键词、商业关键词、信息性关键词、问题关键词。')}</th>
          <th style="width:72px;">${onPageThHintLabelHTML('相关度', '该推荐词与当前页主题的相关程度（0–100%）。')}</th>
          <th style="min-width:200px;">${onPageThHintLabelHTML('推荐理由', 'AI 结合页面主题与检索意图给出的说明。')}</th>
          <th style="width:52px;text-align:right;">操作</th>
        </tr></thead>
        <tbody>${recBody}</tbody>
      </table>
      <p class="onpage-kw-rec-foot" title="${recReasonDefault}">以上为 AI 结合当前页内容给出的关键词拓展示例；正式环境将接入实时数据与模型策略。</p>`;
    const recommendEmpty = `<div class="onpage-kw-rec-empty">
      <p class="onpage-kw-rec-empty-txt">点击下方 <strong>AI 推荐</strong>，由 AI 结合当前页内容与上方统计区间生成可监控关键词。</p>
      <button type="button" class="btn-dash-ai btn-sm" onclick="onPageKwRecommendFetch()" title="${recReasonDefault}">${AI_REC_SVG}<span class="btn-dash-ai-lbl">AI 推荐</span></button>
    </div>`;
    const recommendBlock = state.onPageKwRecommendLoaded ? recommendTable : recommendEmpty;
    const kwMain = mode === 'recommend'
      ? recommendBlock
      : (mode === 'rank' ? rankBlock : gscBlock);
    return `
    <div class="onpage-drawer-tab-pane onpage-drawer-tab-pane--keywords">
      <div class="onpage-kw-toolbar onpage-kw-toolbar--plain onpage-kw-toolbar--kwvalign">
        <div class="onpage-kw-toolbar-mid">
          <div class="onpage-subtabs onpage-subtabs--intl onpage-subtabs--kwmode" role="group" aria-label="数据来源">
            <button type="button" class="onpage-subtab${rankActive}" onclick="state.onPageKwListMode='rank';renderDrawer();" aria-pressed="${mode === 'rank' ? 'true' : 'false'}">${ONPAGE_SVG_LIST}${onPageKwSubtabLabelHTML('排名词', ONPAGE_KW_MODE_HINTS.rank)}</button>
            <button type="button" class="onpage-subtab${gscActive}" onclick="state.onPageKwListMode='gsc';renderDrawer();" aria-pressed="${mode === 'gsc' ? 'true' : 'false'}">${ONPAGE_GSC_TAB_ICON}${onPageKwSubtabLabelHTML('GSC', ONPAGE_KW_MODE_HINTS.gsc)}</button>
            <button type="button" class="onpage-subtab onpage-subtab--ai${recActive}" onclick="state.onPageKwListMode='recommend';state.onPageKwRecommendLoaded=false;renderDrawer();" aria-pressed="${mode === 'recommend' ? 'true' : 'false'}">${AI_REC_SVG}${onPageKwSubtabLabelHTML('推荐', ONPAGE_KW_MODE_HINTS.recommend)}</button>
          </div>
          <div class="onpage-kw-toolbar-spacer" aria-hidden="true"></div>
          <div class="onpage-kw-dates onpage-kw-dates--textlike onpage-kw-dates--inline">
            <input type="text" id="onPageKwRangeInput" class="onpage-kw-range-input" value="${rangeVal}" onchange="applyOnPageKwRangeFromInput()" aria-label="关键词统计日期区间" />
          </div>
        </div>
      </div>
      ${kwMain}
    </div>`;
  }

  if (tab === 'links') {
    return onPageSeoLinksTabHTML(row);
  }

  if (tab === 'schema') {
    const tabs = resolveOnPageSchemaTabs(row);
    let slice = state.onPageSchemaSlice || 'jsonld-org';
    if (!tabs.some(t => t.slice === slice)) {
      slice = tabs[0] ? tabs[0].slice : 'jsonld-org';
      state.onPageSchemaSlice = slice;
    }
    const subTabs = tabs.map(t => onPageSchemaSubtabWithInfoHTML(t.slice, t.label, slice === t.slice)).join('');
    const snippets = getOnPageSchemaSnippetsForSlice(row, slice, dom);
    const pane = snippets.length
      ? `<div class="onpage-schema-snippet-group">${snippets.map(j => `<pre class="onpage-schema-snippet">${escapeHtmlStr(j)}</pre>`).join('')}</div>`
      : `<p class="onpage-schema-empty">当前类型下暂无可展示的结构化片段（示例）。</p>`;
    return `
    <div class="onpage-drawer-tab-pane">
      <div class="onpage-aitdk-section-head onpage-aitdk-section-head--row" style="margin-bottom:10px;">
        <h3 class="onpage-aitdk-section-title" style="margin:0;">结构化数据</h3>
        <button type="button" class="btn-primary btn-sm" onclick="openModal('onpage-schema-json')">编辑本页全部</button>
      </div>
      <div class="onpage-subtabs onpage-subtabs--schema">${subTabs}</div>
      ${pane}
    </div>`;
  }

  if (tab === 'social') {
    const sd = onPageSocialDisplay(row, metaDesc);
    return `
    <div class="onpage-drawer-tab-pane">
      <div class="onpage-aitdk-section-head onpage-aitdk-section-head--row" style="margin-bottom:12px;">
        <h3 class="onpage-aitdk-section-title" style="margin:0;">社交分享</h3>
      </div>
      <table class="data-table onpage-mini-table">
        <thead><tr><th style="width:140px;">标签</th><th>内容</th></tr></thead>
        <tbody>
          <tr><td>og:title</td><td style="white-space:normal;font-size:13px;">${escapeHtmlStr(sd.ogTitle)}</td></tr>
          <tr><td>og:description</td><td style="white-space:normal;font-size:13px;color:var(--text-2);">${escapeHtmlStr(sd.ogDesc)}</td></tr>
          <tr><td>og:image</td><td style="white-space:normal;"><span style="font-size:12px;color:var(--text-3);word-break:break-all;">${escapeHtmlStr(sd.ogImg)}</span></td></tr>
          <tr><td>twitter:card</td><td style="font-size:13px;">${escapeHtmlStr(sd.twitterCard)}</td></tr>
        </tbody>
      </table>
      ${onPageTabLeadHTML('social', 'bottom')}
    </div>`;
  }

  if (tab === 'intl') {
    const canonical = `https://${dom}${row.path}`;
    const hrefRows = [
      { lang: 'en-US', url: canonical },
      { lang: 'zh-CN', url: `https://${dom}/zh${row.path}` },
      { lang: 'x-default', url: canonical },
    ];
    const hrefBody = hrefRows.map(h => `
      <tr>
        <td style="font-size:13px;">${escapeHtmlStr(h.lang)}</td>
        <td style="font-size:12px;word-break:break-all;">${httpsLockPrefixHTML()}<code>${escapeHtmlStr(h.url)}</code></td>
      </tr>`).join('');
    const sub = state.onPageIntlSub || 'hreflang';
    const ha = sub === 'hreflang' ? ' active' : '';
    const ca = sub === 'canonical' ? ' active' : '';
    const paneHref = `
      <table class="data-table onpage-mini-table">
        <thead><tr><th style="width:100px;">语言/区域</th><th>URL</th></tr></thead>
        <tbody>${hrefBody}</tbody>
      </table>
      <pre class="onpage-intl-snippet">&lt;link rel="alternate" hreflang="en-US" href="${escapeHtmlStr(canonical)}" /&gt;\n&lt;link rel="alternate" hreflang="zh-CN" href="https://${escapeHtmlStr(dom)}/zh${escapeHtmlStr(row.path)}" /&gt;\n&lt;link rel="alternate" hreflang="x-default" href="${escapeHtmlStr(canonical)}" /&gt;</pre>
      ${onPageIntlLeadHTML('hreflang')}`;
    const paneCanon = `
      <div class="onpage-canonical-box"><span class="onpage-canonical-lbl">规范网址</span>${httpsLockPrefixHTML()}<code>${escapeHtmlStr(canonical)}</code></div>
      ${onPageIntlLeadHTML('canonical')}`;
    return `
    <div class="onpage-drawer-tab-pane">
      <div class="onpage-subtabs onpage-subtabs--intl">
        <button type="button" class="onpage-subtab${ha}" onclick="state.onPageIntlSub='hreflang';renderDrawer();">语言版本</button>
        <button type="button" class="onpage-subtab${ca}" onclick="state.onPageIntlSub='canonical';renderDrawer();">规范网址</button>
      </div>
      ${sub === 'hreflang' ? paneHref : paneCanon}
    </div>`;
  }

  return `<div class="onpage-drawer-tab-pane"><p class="onpage-drawer-lead">请选择上方页签。</p></div>`;
}

/** 与关键词详情抽屉一致：横向页签（条目较多时用横向滚动容纳） */
const ONPAGE_DRAWER_TABS_HIDDEN = new Set(['headings', 'images', 'links', 'social', 'intl']);

function onPageSeoDrawerTabsRow(activeTab, row) {
  const defs = [
    ['diagnose', '常规检测'],
    ['ai', 'AI 测评'],
    ['keywords', '关键词'],
    ['tdk', 'TDK'],
    ['headings', 'H标题'],
    ['images', '图片'],
    ['links', '链接'],
    ['schema', '结构化数据'],
    ['social', '社媒'],
    ['intl', '语言与网址'],
  ].filter(([id]) => !ONPAGE_DRAWER_TABS_HIDDEN.has(id));
  const btns = defs.map(([id, label]) => {
    const aiBadge = id === 'ai' ? `<span class="drawer-tab-ai-ic" aria-hidden="true">${AI_REC_SVG}</span>` : '';
    return `<button type="button" class="drawer-tab drawer-tab--${id}${activeTab === id ? ' active' : ''}" onclick="state.onPageSeoDrawerTab='${id}';renderDrawer();">${escapeHtmlStr(label)}${aiBadge}</button>`;
  }).join('');
  return `<div class="drawer-tabs drawer-tabs--scroll drawer-tabs--onpage">${btns}</div>`;
}

function onPageSeoDrawerHTML(row) {
  const tab = state.onPageSeoDrawerTab || 'diagnose';
  const dom = site().domain;
  const pageUrl = `https://${dom}${row.path}`;
  const pageUrlAttr = escapeAttr(pageUrl);
  const ptTag = onPagePageTypeTagHTML(row);
  return `
  <div class="drawer-header onpage-drawer-head">
    <div class="onpage-drawer-head-main">
      <div class="onpage-drawer-product-title">页面详情</div>
      <div class="onpage-drawer-page-line">${escapeHtmlStr(row.title)}${ptTag ? ` ${ptTag}` : ''}</div>
      <div class="onpage-drawer-path-wrap">
        <a class="onpage-drawer-path-link" href="${pageUrlAttr}" target="_blank" rel="noopener noreferrer" aria-label="在新窗口打开完整页面链接">${httpsLockPrefixHTML()}<code class="onpage-drawer-path-code">${escapeHtmlStr(pageUrl)}</code></a>
      </div>
      ${onPageSeoDrawerKwRowHTML(row)}
    </div>
    <div class="onpage-drawer-head-aside">
      <button type="button" class="modal-close" onclick="closeDrawer()">×</button>
    </div>
  </div>
  ${onPageSeoDrawerTabsRow(tab, row)}
  <div class="drawer-body onpage-drawer-body">${onPageSeoDrawerTabBody(row)}</div>`;
}

window.saveOnPageKwFromModal = function () {
  const idx = state.onPageSeoDrawerIndex;
  if (idx == null || !DB.onPageSeoPages[idx]) return;
  const kws = Array.isArray(state.onPageKwModalDraft) ? state.onPageKwModalDraft.filter(Boolean).slice(0, ONPAGE_KW_MAX) : [];
  if (!kws.length) {
    toast('请至少添加一个目标词', 'error');
    return;
  }
  DB.onPageSeoPages[idx].keyword = kws.join('\n');
  closeModal();
  toast('已保存目标词');
  render();
  renderDrawer();
};

window.onPageKwModalAddOne = function () {
  const el = $('modalOnPageKwInput');
  const raw = (el && el.value ? el.value : '').trim();
  if (!raw) {
    toast('请输入关键词', 'error');
    return;
  }
  if (!Array.isArray(state.onPageKwModalDraft)) state.onPageKwModalDraft = [];
  if (state.onPageKwModalDraft.length >= ONPAGE_KW_MAX) {
    toast(`每页最多 ${ONPAGE_KW_MAX} 个目标词`, 'error');
    return;
  }
  const parts = parseMultiKw(raw);
  let added = 0;
  parts.forEach(p => {
    if (!p) return;
    if (state.onPageKwModalDraft.length >= ONPAGE_KW_MAX) return;
    if (state.onPageKwModalDraft.includes(p)) return;
    state.onPageKwModalDraft.push(p);
    added += 1;
  });
  if (!added) {
    toast('该词已在列表中', 'error');
    return;
  }
  if (el) el.value = '';
  toast('已添加');
  state.modal = 'onpage-drawer-kw';
  renderModal();
};

window.onPageKwModalRemoveChip = function (i) {
  if (!Array.isArray(state.onPageKwModalDraft)) return;
  state.onPageKwModalDraft.splice(i, 1);
  state.modal = 'onpage-drawer-kw';
  renderModal();
};

window.saveOnPageTdkFromModal = function () {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可保存（示例）', 'error');
    return;
  }
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  if (!row) return;
  const t = $('modalOnPageTdkTitle');
  const d = $('modalOnPageTdkDesc');
  const k = $('modalOnPageTdkKw');
  if (!t || !d || !k) return;
  row.title = (t.value || '').trim() || row.title;
  row.metaDesc = (d.value || '').trim();
  row.metaKeywords = (k.value || '').trim() || '—';
  closeModal();
  toast('已保存标题与摘要');
  render();
  renderDrawer();
};

window.onPageToggleKwDd = function (e, id) {
  e.stopPropagation();
  const el = document.getElementById(id);
  document.querySelectorAll('.onpage-actions-dd.is-open').forEach(x => {
    if (x.id !== id) x.classList.remove('is-open');
  });
  if (el) el.classList.toggle('is-open');
};

window.onPageCloseKwDd = function () {
  document.querySelectorAll('.onpage-actions-dd.is-open').forEach(el => el.classList.remove('is-open'));
};

window.onPageCloseTabsMore = function () {
  const det = document.querySelector('#drawer details.drawer-tabs-more');
  if (det) det.open = false;
};

window.addPageKwToLibraryFromStr = function (kw) {
  if (!kw) return;
  if (!Array.isArray(DB.myKeywords)) DB.myKeywords = [];
  if (DB.myKeywords.some((k) => (k.word || k) === kw)) {
    toast('该词已在关键词库中', 'error');
    return;
  }
  DB.myKeywords.push({ word: kw, source: 'onpage-ranked' });
  toast('已加入我的关键词库：' + kw);
};

window.setPageTargetKwFromStr = function (kw) {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  if (!kw || !row) return;
  const existing = parseMultiKw(row.keyword);
  if (existing.includes(kw)) {
    toast('该词已在当前页目标词中', 'error');
    return;
  }
  if (existing.length >= ONPAGE_KW_MAX) {
    toast(`每页最多 ${ONPAGE_KW_MAX} 个目标词，请先删除后再添加`, 'error');
    return;
  }
  row.keyword = existing.length ? joinMultiKw([...existing, kw]) : kw;
  toast('已设为当前页目标词');
  render();
  renderDrawer();
};

window.addPageKwToLibraryFromDrawer = function (btn) {
  const kw = btn.getAttribute('data-kw');
  if (!kw) return;
  addPageKwToLibraryFromStr(kw);
};

window.setPageTargetKwFromDrawer = function (btn) {
  const kw = btn.getAttribute('data-kw');
  if (!kw) return;
  setPageTargetKwFromStr(kw);
};

window.openOnPageSeoDrawer = function (idx) {
  state.drawer = null;
  state.onPageSeoDrawerIndex = idx;
  const pgSync = DB.onPageSeoPages[idx];
  if (pgSync) syncOnPagePageTypeFromPath(pgSync);
  state.onPageSeoDrawerTab = 'diagnose';
  state.onPageSerpDevice = 'pc';
  state.onPageKwListMode = 'rank';
  state.onPageKwRecommendLoaded = false;
  state.onPageIntlSub = 'hreflang';
  state.onPageImageEditIndex = null;
  state.onPageSchemaEditKey = null;
  state.onPageDiagDim = null;
  state.onPageDiagSev = null;
  state.onPageHeadingFilter = null;
  state.onPageImageFilters = [];
  state.onPageLinkSub = 'in';
  state.onPageLinkRelFilter = null;
  const pg = DB.onPageSeoPages[idx];
  const schemaTabs = pg ? resolveOnPageSchemaTabs(pg) : [];
  let sl = state.onPageSchemaSlice;
  if (!schemaTabs.some(t => t.slice === sl) || sl === 'gaps' || sl === 'preview') {
    sl = schemaTabs[0] ? schemaTabs[0].slice : 'jsonld-org';
  }
  state.onPageSchemaSlice = sl;
  $('drawerOverlay').style.display = 'block';
  renderDrawer();
  if (!state.onPageSeoAuditRefreshing[idx]) onPageSeoRerunAudit(idx);
};

/** 列表 HTTP 状态徽章（示例） */
function onPageHttpStatusBadge(r) {
  const c = r.httpStatus != null ? Number(r.httpStatus) : 200;
  let cls = 'badge-gray';
  if (c === 200) cls = 'badge-green';
  else if (c === 301 || c === 302) cls = 'badge-blue';
  else if (c >= 400) cls = 'badge-red';
  return `<span class="badge ${cls}" title="页面能否正常打开的状态码，200 表示正常">${c}</span>`;
}

/** On-Page 列表工具条：标签 / HTTP 状态下拉多选 */
function onPageSeoToolbarFilterDdHTML(statusCodes) {
  const ptF = state.onPageSeoFilterPageTypes || [];
  const stF = state.onPageSeoStatusFilter || [];
  const tagOpen = state.onPageSeoTagDdOpen ? ' open' : '';
  const stOpen = state.onPageSeoStatusDdOpen ? ' open' : '';
  const q = (state.onPageSeoTagDdQuery || '').trim().toLowerCase();
  const ptOpts = ONPAGE_PAGE_TYPES.map(t => ({ id: t.id, label: t.label }));
  const ptFiltered = ptOpts.filter(t => !q || String(t.label).toLowerCase().includes(q) || String(t.id).toLowerCase().includes(q));
  const ptSummary = ptF.length ? `已选 ${ptF.length}` : '全部';
  const stSummary = stF.length ? `已选 ${stF.length}` : '全部';
  const tagPanel = `<div class="onpage-seo-filter-dd toolbar-field-wrap${tagOpen}" onclick="stopOnPageSeoFilterClick(event)">
        <button type="button" class="onpage-seo-filter-dd-btn" onclick="toggleOnPageSeoTagDd(event)">
          <span>页面类型</span><span class="onpage-seo-filter-dd-sum">${escapeHtmlStr(ptSummary)}</span><span class="onpage-seo-filter-dd-caret" aria-hidden="true">▾</span>
        </button>
        <div class="onpage-seo-filter-dd-panel" role="group" aria-label="页面类型筛选">
          <input type="search" class="onpage-seo-filter-dd-search" placeholder="搜索页面类型…" value="${escapeAttr(state.onPageSeoTagDdQuery || '')}" oninput="setOnPageSeoTagDdQuery(this.value)" onclick="stopOnPageSeoFilterClick(event)" />
          <div class="onpage-seo-filter-dd-list">${ptFiltered.length ? ptFiltered.map(t => {
    const on = ptF.includes(t.id) ? ' checked' : '';
    return `<label class="onpage-seo-filter-dd-item"><input type="checkbox"${on} onchange='toggleOnPageSeoFilterPageType(${JSON.stringify(t.id)})'/><span>${escapeHtmlStr(t.label)}</span></label>`;
  }).join('') : '<div class="onpage-seo-filter-dd-empty">无匹配类型</div>'}</div>
        </div>
      </div>`;
  const stPanel = `<div class="onpage-seo-filter-dd toolbar-field-wrap${stOpen}" onclick="stopOnPageSeoFilterClick(event)">
        <button type="button" class="onpage-seo-filter-dd-btn" onclick="toggleOnPageSeoStatusDd(event)">
          <span>状态</span><span class="onpage-seo-filter-dd-sum">${escapeHtmlStr(stSummary)}</span><span class="onpage-seo-filter-dd-caret" aria-hidden="true">▾</span>
        </button>
        <div class="onpage-seo-filter-dd-panel" role="group" aria-label="HTTP 状态筛选">
          ${(statusCodes.length ? statusCodes : [200]).map(c => {
    const cs = String(c);
    const on = stF.includes(cs) ? ' checked' : '';
    return `<label class="onpage-seo-filter-dd-item"><input type="checkbox"${on} onchange="toggleOnPageSeoStatusCode(${JSON.stringify(cs)})"/><span>${escapeHtmlStr(cs)}</span></label>`;
  }).join('')}
        </div>
      </div>`;
  return `${tagPanel}${stPanel}`;
}

/** 搜索 › On-Page SEO */
function pageOnPageSEO() {
  ensureOnPageSeoTableState();
  const sitemapOk = siteOnPageSitemapDetected();
  const pages = onPageSeoPagesForCurrentSite();
  const colIds = state.onPageSeoColOrder.filter(id => !state.onPageSeoColHidden[id]);
  const statusCodes = collectOnPageSeoHttpStatuses(pages);
  const { rows: pagedRows, total, page, totalPages, pageSize } = onPageSeoListPagedSlice();
  const bulkN = onPageSeoBulkSelectedCount();
  const thRow = onPageSeoBulkCheckboxThHTML() + colIds.map((id) => {
    const a = onPageSeoThAttrs(id);
    const lab = ONPAGE_SEO_COL_LABELS[id];
    if (id === 'index') {
      return `<th style="${a.style}">${onPageSeoIndexThInnerHTML()}</th>`;
    }
    if (ONPAGE_SEO_SORTABLE.has(id)) {
      const btn = tableSortThBtnHTML(lab, a.hint, id, state.onPageSeoSortKey, state.onPageSeoSortDir, 'sortOnPageSeoCol');
      return `<th style="${a.style}" class="th-sort-th"><div class="onpage-seo-th-inner onpage-seo-th-inner--sort">${btn}</div></th>`;
    }
    const hint = a.hint ? onPageThHintLabelHTML(lab, a.hint) : escapeHtmlStr(lab);
    return `<th style="${a.style}"><div class="onpage-seo-th-inner">${hint}</div></th>`;
  }).join('');

  if (!sitemapOk) {
    return `
  <div class="panel onpage-seo-table-panel onpage-seo-table-panel--empty" style="overflow:visible;">
    ${onPageSeoListEmptyPaneHTML('no-sitemap')}
  </div>`;
  }
  if (!pages.length) {
    return `
  <div class="panel onpage-seo-table-panel onpage-seo-table-panel--empty" style="overflow:visible;">
    ${onPageSeoListEmptyPaneHTML('no-pages')}
  </div>`;
  }

  const rowHtml = pagedRows.length ? pagedRows.map(({ r, i }) => {
    const rt = Array.isArray(r.tags) ? r.tags : [];
    const http = r.httpStatus != null ? Number(r.httpStatus) : 200;
    const cells = onPageSeoBulkCheckboxTdHTML(i) + colIds.map(id => {
      let c = '';
      if (id === 'page') c = onPageSeoPageTitleCellHTML(r, i);
      else if (id === 'keyword') c = onPageSeoKeywordCellHTML(r, i);
      else if (id === 'pageType' || id === 'tags') c = onPageSeoTagsCellHTML(r, i);
      else if (id === 'status') c = onPageHttpStatusBadge(r);
      else if (id === 'index') c = onPageSeoIndexCellHTML(r);
      else if (id === 'score') c = onPageSeoListScoreHTML(r);
      else if (id === 'issues') c = onPageIssueCellHTML(r);
      return `<td data-onpage-col="${id}" style="vertical-align:middle;">${c}</td>`;
    }).join('');
    const rowBusy = state.onPageSeoAuditRefreshing && state.onPageSeoAuditRefreshing[i] ? ' onpage-seo-row--audit-refresh' : '';
    const tagsPipe = rt.map(t => String(t).replace(/\|/g, '｜')).join('|');
    const pt = r.pageType || '';
    return `
          <tr class="onpage-seo-row onpage-seo-row--click${rowBusy}" data-i="${i}" data-http="${http}" data-page-type="${escapeAttr(pt)}" data-tags="${escapeAttr(tagsPipe)}" onclick="openOnPageSeoDrawer(${i})">
            ${cells}
          </tr>`;
  }).join('')
    : `<tr><td colspan="${colIds.length + 1}" style="text-align:center;padding:28px;color:var(--text-3);">无匹配页面，请调整搜索或筛选条件</td></tr>`;
  const footer = total > 0 ? `
    <div class="article-list-footer onpage-seo-list-footer">
      <div class="article-list-footer-left">
        <span class="article-list-footer-meta">共 ${total} 条</span>
        <span class="article-list-page-size-label">每页</span>
        <select class="article-list-page-size" onchange="setOnPageSeoListPageSize(+this.value)">
          <option value="20"${pageSize === 20 ? ' selected' : ''}>20</option>
          <option value="50"${pageSize === 50 ? ' selected' : ''}>50</option>
          <option value="100"${pageSize === 100 ? ' selected' : ''}>100</option>
        </select>
        <span class="article-list-page-size-label">条</span>
      </div>
      <div class="article-list-pager">
        <button type="button" class="btn-default" style="height:28px;padding:0 8px;" ${page <= 1 ? 'disabled' : ''} onclick="setOnPageSeoListPage(${page - 1})">‹</button>
        <button type="button" class="btn-primary" style="height:28px;padding:0 10px;">${page}</button>
        <span style="font-size:12px;color:var(--text-3);padding:0 4px;">/ ${totalPages}</span>
        <button type="button" class="btn-default" style="height:28px;padding:0 8px;" ${page >= totalPages ? 'disabled' : ''} onclick="setOnPageSeoListPage(${page + 1})">›</button>
      </div>
    </div>` : '';
  return `
  <div class="onpage-seo-toolbar panel onpage-seo-toolbar--panel" style="margin-bottom:12px;padding:12px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
    <div class="onpage-seo-search-wrap" style="display:flex;align-items:stretch;gap:10px;min-width:200px;flex:1;max-width:480px;">
      ${onPageSeoSearchInnerHTML({ inputId: 'onpageSeoFilter', value: state.onPageSeoFilterQuery || '', oninput: 'filterOnPageSeoRows(this.value)' })}
    </div>
    ${onPageSeoToolbarFilterDdHTML(statusCodes)}
    ${bulkN ? `<button type="button" class="btn-default btn-sm onpage-bulk-audit-btn" onclick="onPageBulkRunPageAudit()">页面检测</button><span class="onpage-bulk-sel-meta">已选 ${bulkN} 项</span>` : ''}
    <div class="toolbar-spacer" style="flex:1;min-width:8px;"></div>
    <div class="toolbar-field-wrap" onclick="event.stopPropagation()">
      <button type="button" class="btn-icon" title="显示字段与顺序" onclick="toggleOnPageSeoFieldPanel(event)">⋮</button>
      ${state.onPageSeoFieldOpen ? onPageSeoFieldConfigPanelHTML() : ''}
    </div>
    <button type="button" class="btn-icon" title="导出" onclick="onPageSeoExportDemo()">↓</button>
  </div>
  <div class="panel onpage-seo-table-panel" style="overflow:hidden;">
    <div class="table-wrap" style="overflow-x:auto;">
      <table class="data-table onpage-seo-table onpage-seo-table--compact">
        <thead>
          <tr>
            ${thRow}
          </tr>
        </thead>
        <tbody id="onpageSeoTbody">${rowHtml}</tbody>
      </table>
    </div>
    ${footer}
  </div>`;
}

window.filterOnPageSeoRows = function (val) {
  const elIn = $('onpageSeoFilter');
  state.onPageSeoFilterQuery = val != null ? String(val) : (elIn && elIn.value != null ? elIn.value : '');
  state.onPageSeoListPage = 1;
  render();
};

/** 兼容旧调用：筛选已在 render → pageOnPageSEO 中按 state 完成，勿再触发 render */
window.applyOnPageSeoListFilters = function () {};

/* ── Route to content page ── */
function getPageHTML() {
  if (state.devInternalPage === 'reseller-order') return pageDevResellerOrder();
  if (state.primary === 'dashboard') return pageDashboard();
  if (state.primary === 'geo')       return pageGeo();
  if (state.primary === 'admin')     return pageAdmin();
  if (state.primary === 'writing') {
    switch (state.writingTab) {
      case 'workbench': return pageWritingWorkbench();
      case 'batch-create': return pageBatchArticleCreate();
      case 'history': return pageArticleHistory();
      default:        return pageArticleHistory();
    }
  }
  if (state.primary === 'settings') {
    return state.settingsTab === 'package' ? pagePackage() : pageSiteManagement();
  }
  if (state.primary === 'search') {
    let content;
    switch (state.secondary) {
      case 'kw-mgmt':    content = state.tab === 'my-keywords' ? pageMyKeywords() : pageKwGroups(); break;
      case 'kw-explore': content = pageKwExplore(); break;
      case 'kw-rank':    content = pageKwRank(); break;
      case 'competitor': content = state.compTab === 'competitors' ? pageCompetitors() : pageKwCompare(); break;
      case 'page-seo':   content = pageOnPageSEO(); break;
      case 'page-rank-list': content = pageRankedPages(); break;
      default:           content = pageMyKeywords();
    }
    return wrapSearchLayout(content);
  }
  return '';
}

const AI_REC_SVG = '<svg class="ai-rec-ic" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M12 2l1.4 4.8L18 8l-4.6 1.2L12 14l-1.4-4.8L6 8l4.6-1.2L12 2zm7 10l.9 3.1L23 16l-3.1.9L19 20l-.9-3.1L15 16l3.1-.9L19 12zM3 13l1.1 2.7L7 17l-2.9 1.3L3 21l-1.1-2.7-2.9-1.3 2.9-1.3L3 13z"/></svg>';

/** Schema JSON 弹窗：空内容时的 placeholder（展示填写范围与格式示例） */
const SCHEMA_JSON_INPUT_PLACEHOLDER = '在此粘贴符合 Schema.org 的 JSON-LD 片段（须为合法 JSON 文本）。\n\n填写范围：对应当前子类型的 <script type="application/ld+json"> 中的对象，通常包含 "@context": "https://schema.org"、"@type" 以及业务字段。\n\n示例：\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "您的公司名",\n  "url": "https://www.example.com/",\n  "logo": "https://www.example.com/logo.png"\n}';

const AI_REVEAL_REASONS = {
  _default: '基于当前页面可解析内容给出的优化表述（示例，非实时大模型）。',
  'tdk-ai-title': '结合页面正文与主关键词、品牌信息生成，用于提升搜索结果标题吸引力与相关性（示例）。',
  'tdk-ai-desc': '在控制字数的前提下概括页面价值点与行动号召，便于摘要展示与点击率（示例）。',
  'tdk-ai-kw': '从正文与产品维度抽取可监控的英文/中文关键词组合（示例）。',
  'social-ai-title': '与页面标题语义对齐并适合社交截断展示的分享标题（示例）。',
  'social-ai-desc': '适合卡片预览的短摘要，与 og:description 场景一致（示例）。',
  'social-ai-img': '建议选用 1200×630 左右、主体清晰的横版配图 URL（示例）。',
  'social-ai-tw': '与分享图尺寸匹配的 Twitter 卡片类型（示例）。',
  'image-ai-alt': '兼顾画面描述与检索词的自然语句，避免堆砌（示例）。',
  'schema-json': '在合法 JSON-LD 前提下补充 Organization 等常用字段，便于富摘要（示例）。',
  headings: '结合当前 H 标题层级与正文主题，建议在首个 H2 增加一节可读性更强的小标题（示例）。',
  'kw-modal': '从页面主题扩展的可监控目标词候选（示例）。',
  'tdk-modal': '一次性生成标题、摘要与监控词草稿，综合页面主题与主关键词（示例）。',
  'social-modal': '生成适合社交卡片展示的标题、摘要、配图与 Twitter 卡类型（示例）。',
  'image-modal': '依据图片在页内的位置与产品词生成 ALT 等文字信息（示例）。',
  'schema-row': '为结构化备注字段生成可粘贴的说明草稿（示例）。',
};

function aiRecoReasonForSlot(slot) {
  const s = String(slot || '');
  if (AI_REVEAL_REASONS[s]) return AI_REVEAL_REASONS[s];
  if (s.indexOf('task-ai-') === 0) return '结合本条待办的问题类型与受影响模块给出的说明草稿（示例）。';
  return AI_REVEAL_REASONS._default;
}

function aiRecoReasonForRevealKey(revealKey) {
  const k = String(revealKey || '');
  if (AI_REVEAL_REASONS[k]) return AI_REVEAL_REASONS[k];
  if (k.indexOf('task-ai-') === 0) return '结合本条待办的问题类型与受影响模块给出的说明草稿（示例）。';
  if (k.indexOf('social-ai-') === 0) return AI_REVEAL_REASONS['social-ai-title'];
  return AI_REVEAL_REASONS._default;
}

function aiRecoLockApplyButtons(applyHtml) {
  const raw = String(applyHtml || '');
  if (siteLeadongSaasAuthorized()) return raw;
  const lockTip = escapeAttr('需先完成独立站授权绑定后才可应用并同步到独立站');
  return raw.replace(/<button(\s[^>]*)>([\s\S]*?)<\/button>/gi, (full, attrs, inner) => {
    if (/\bdisabled\b/i.test(attrs)) return full;
    return `<span class="ai-rec-apply-hint-wrap" data-ai-reason-tip="${lockTip}"><button${attrs} disabled="disabled">${inner}</button></span>`;
  });
}

function aiRecoRowBarHTML({ revealKey, text, applyHtml }) {
  const reasonPlain = aiRecoReasonForRevealKey(revealKey);
  const reasonTip = escapeAttr(reasonPlain);
  const rk = escapeAttr(String(revealKey));
  const applyFinal = aiRecoLockApplyButtons(applyHtml);
  return `<div class="ai-rec-preview ai-rec-preview--field ai-rec-preview--row" data-ai-rec-row="${rk}">
    <span class="ai-rec-preview-spark" aria-hidden="true">${AI_REC_SVG}</span>
    <p class="ai-rec-preview-txt">${escapeHtmlStr(text)}</p>
    <button type="button" class="ai-rec-preview-info" aria-label="查看推荐理由" data-ai-reason-tip="${reasonTip}">${ONPAGE_SVG_INFO_HINT}</button>
    <div class="ai-rec-preview-actions">${applyFinal}</div>
  </div>`;
}

function headingsAiRecoAfterFirstH2HTML() {
  const t = state.aiReveal && state.aiReveal.headings;
  if (!t) return '';
  const raw = String(t);
  const lvM = raw.match(/首个\s*(H[1-6])|^(H[1-6])\b/i);
  const lv = lvM ? (lvM[1] || lvM[2] || 'H2').toUpperCase() : 'H2';
  const content = raw
    .replace(/^推荐在首个\s*H[1-6]\s*使用[：:]\s*/i, '')
    .replace(/^[「『"']|[」』"']$/g, '')
    .trim();
  return `<div class="onpage-h-ai-rec onpage-h-ai-rec--readonly">
    <span class="onpage-h-ai-rec-lbl">AI 推荐</span>
    <span class="onpage-h-ai-rec-lv">${escapeHtmlStr(lv)}</span>
    <span class="onpage-h-ai-rec-txt">${escapeHtmlStr(content || raw)}</span>
  </div>`;
}

function aiRecoFieldPreviewHTML(revealKey, inputId, _labelUnused) {
  if (!state.aiReveal) state.aiReveal = {};
  const txt = state.aiReveal[revealKey];
  if (txt == null || String(txt) === '') return '';
  const hideApply = revealKey === 'image-ai-alt';
  const rk = escapeAttr(String(revealKey));
  const iid = escapeAttr(String(inputId));
  const reasonTip = escapeAttr(aiRecoReasonForRevealKey(revealKey));
  const apply = hideApply ? '' : aiRecoLockApplyButtons(`<button type="button" class="btn-primary btn-sm" onclick="applyAiRevealField('${rk}','${iid}')">应用</button>`);
  return `<div class="ai-rec-field-below ai-rec-field-below--inline${hideApply ? ' ai-rec-field-below--no-apply' : ''}">
    <p class="ai-rec-below-txt">${escapeHtmlStr(String(txt))}</p>
    ${hideApply ? '' : `<div class="ai-rec-below-foot">
      <button type="button" class="ai-rec-preview-info" aria-label="查看推荐理由" data-ai-reason-tip="${reasonTip}">${ONPAGE_SVG_INFO_HINT}</button>
      ${apply}
    </div>`}
  </div>`;
}

function aiRecoPreviewOnlyHTML(slot) {
  if (!state.aiReveal) state.aiReveal = {};
  const txt = state.aiReveal[slot];
  if (!txt) return '';
  const sa = escapeAttr(String(slot));
  const apply = `<button type="button" class="btn-primary btn-sm" data-ai-slot="${sa}" onclick="applyAiSlotBtn(this)">应用</button>`;
  return aiRecoRowBarHTML({ revealKey: String(slot), text: String(txt), applyHtml: apply });
}

function aiRecoTriggerInlineHTML(slot, cost) {
  const sa = escapeAttr(String(slot));
  const genTitle = escapeAttr(aiRecoReasonForSlot(slot));
  return `<div class="ai-rec-inline">
    <button type="button" class="btn-ai-gen btn-sm" data-ai-slot="${sa}" data-ai-cost="${cost}" onclick="runAiSlotBtn(this)" title="${genTitle}">
      ${AI_REC_SVG}<span class="btn-ai-gen-lbl">AI 推荐</span><span class="ai-rec-pill">−${cost} 点</span>
    </button>
  </div>`;
}

const AI_MOCK_TEXT = {
  'kw-modal': '橱柜铰链批发 · B2B 出口（建议作为首条主目标词）',
  headings: '推荐在首个 H2 使用：「选型指南：材质与规格对照」',
  'image-modal': '不锈钢铰链特写，展厅灯光下近景，用于商用柜门场景。',
  'schema-json': '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "RHHardware",\n  "logo": "https://cdn.example.com/brand-logo.png"\n}',
  'schema-row': '建议在富片段中同步公司电话与地址，与页脚信息一致。',
};

window.runAiSlotBtn = function (btn) {
  const slot = btn && btn.getAttribute ? btn.getAttribute('data-ai-slot') : '';
  const cost = btn && btn.getAttribute ? +btn.getAttribute('data-ai-cost') : 0;
  if (slot) window.runAiSlot(slot, cost);
};

window.applyAiSlotBtn = function (btn) {
  const slot = btn && btn.getAttribute ? btn.getAttribute('data-ai-slot') : '';
  if (slot) window.applyAiSlot(slot);
};

window.applyAiRevealField = function (revealKey, inputId) {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可应用 AI 建议（示例）', 'error');
    return;
  }
  if (!state.aiReveal || !revealKey || !inputId) return;
  const txt = state.aiReveal[revealKey];
  const el = $(inputId);
  if (txt == null || !el) return;
  el.value = String(txt);
  delete state.aiReveal[revealKey];
  if (state.modal) renderModal();
  if ($('drawerOverlay') && $('drawerOverlay').style.display === 'block') renderDrawer();
  toast('已应用 AI 建议到当前字段（示例）');
};

window.runAiSlot = function (slot, cost) {
  const bal = state.aiPointsDemo != null ? state.aiPointsDemo : 0;
  if (bal < cost) {
    toast('点数不足，请先充值或联系顾问（示例）', 'error');
    return;
  }
  state.aiPointsDemo = bal - cost;
  if (!state.aiReveal) state.aiReveal = {};
  if (slot === 'tdk-modal') {
    state.aiReveal['tdk-ai-title'] = '橱柜铰链批发｜RHHardware 出口目录';
    state.aiReveal['tdk-ai-desc'] = '覆盖工业柜门铰链、快装阻尼款与批量规格。支持打样与海外交付。';
    state.aiReveal['tdk-ai-kw'] = 'cabinet hinges wholesale, B2B hardware';
    delete state.aiReveal['tdk-modal'];
  } else if (slot === 'social-modal') {
    state.aiReveal['social-ai-title'] = '锐华五金｜B2B 柜门铰链出口';
    state.aiReveal['social-ai-desc'] = '不锈钢阻尼铰链与快装款，支持海外批量交付与打样。';
    state.aiReveal['social-ai-img'] = 'https://cdn.example.com/og/hinge-share-1200.jpg';
    state.aiReveal['social-ai-tw'] = 'summary_large_image';
    delete state.aiReveal['social-modal'];
  } else if (slot === 'image-modal') {
    state.aiReveal['image-ai-alt'] = AI_MOCK_TEXT['image-modal'] || '（示例）';
    delete state.aiReveal['image-modal'];
  } else if (slot === 'schema-json') {
    const nm = String(site().name || 'Organization').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const dom = site().domain;
    state.aiReveal['schema-json'] = `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${nm}",\n  "url": "https://${dom}/",\n  "logo": "https://cdn.example.com/brand-logo.png",\n  "sameAs": [\n    "https://www.linkedin.com/company/example"\n  ]\n}`;
  } else if (String(slot).startsWith('task-ai-')) {
    const tid = +String(slot).slice(8);
    const task = DB.dashboardTasks.find(x => x.id === tid);
    const ttext = task ? `【AI 草稿】优先处理「${task.title}」：建议先完善 ${task.area || '相关模块'}，再核对前台展示与搜索结果摘要。（示例）` : '（示例）';
    state.aiReveal[slot] = ttext;
  } else {
    let text = AI_MOCK_TEXT[slot];
    state.aiReveal[slot] = text || '（示例）暂无可用建议';
  }
  if (state.modal) renderModal();
  if ($('drawerOverlay') && $('drawerOverlay').style.display === 'block') renderDrawer();
  render();
  toast(`已生成 AI 建议并扣除 ${cost} 点（示例）`);
};

window.onPageClearAiAuditDemo = function () {
  const ix = state.onPageSeoDrawerIndex;
  if (ix != null && DB.onPageSeoPages[ix]) DB.onPageSeoPages[ix]._onPageAiAuditDemo = null;
  state.onPageAiResultSubTab = 'overview';
  renderDrawer();
};

window.applyAiSlot = function (slot) {
  if (!siteLeadongSaasAuthorized()) {
    toast('需先完成领动 SaaS 独立站授权绑定后才可应用 AI 建议（示例）', 'error');
    return;
  }
  const txt = state.aiReveal && state.aiReveal[slot];
  if (!txt) return;
  if (slot === 'kw-modal') {
    if (!Array.isArray(state.onPageKwModalDraft)) state.onPageKwModalDraft = [];
    if (!state.onPageKwModalDraft.includes(txt)) state.onPageKwModalDraft.unshift(txt);
    const inp = $('modalOnPageKwInput');
    if (inp) inp.value = '';
  } else if (slot === 'schema-json') {
    const a = $('modalOnPageSchemaJson');
    if (a) a.value = String(txt).trim();
  } else if (slot === 'schema-row') {
    const a = $('modalOnPageSchNote');
    if (a) a.value = txt;
  } else if (slot === 'headings') {
    const ix = state.onPageSeoDrawerIndex;
    const row = ix != null ? DB.onPageSeoPages[ix] : null;
    if (row) row._aiHeadingHint = txt;
    renderDrawer();
  } else if (String(slot).startsWith('task-ai-')) {
    const tid = +String(slot).slice(8);
    const task = DB.dashboardTasks.find(x => x.id === tid);
    if (task) task.sug = txt;
    render();
  }
  delete state.aiReveal[slot];
  if (state.modal) renderModal();
  if ($('drawerOverlay') && $('drawerOverlay').style.display === 'block') renderDrawer();
  toast('已应用 AI 建议到当前字段（示例）');
};

function modalDashboardTaskAi() {
  const t = DB.dashboardTasks.find(x => x.id === state.dashboardTaskAiId);
  if (!t) {
    return `<div class="modal-header"><span class="modal-title">AI 推荐</span><button class="modal-close" data-close>×</button></div><div class="modal-body"><p>未找到任务。</p></div><div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  const slot = `task-ai-${t.id}`;
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">AI 推荐 · ${escapeHtmlStr(t.title)}</span>
      ${aiRecoTriggerInlineHTML(slot, 4)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${modalLeadongSaasLockBannerHTML()}
    <p style="font-size:12px;color:var(--text-3);margin:0 0 12px;line-height:1.45;">以下为根据待办生成的文字稿，请核对后应用到「待优化清单」中的优化建议；未授权独立站时仅可复制内容，手动粘贴到建站后台（示例）。</p>
    ${aiRecoPreviewOnlyHTML(slot)}
  </div>
  <div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
}

function modalOnPageDrawerKw() {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const draft = Array.isArray(state.onPageKwModalDraft) ? state.onPageKwModalDraft : [];
  const atMax = draft.length >= ONPAGE_KW_MAX;
  const chips = draft.map((k, ki) => {
    const xBtn = `<button type="button" class="onpage-tag-x" onclick="onPageKwModalRemoveChip(${ki})" aria-label="删除">×</button>`;
    return `<span class="tag tag-gray onpage-kw-modal-chip">${escapeHtmlStr(k)}${xBtn}</span>`;
  }).join('');
  const addDis = atMax ? ' disabled="disabled" style="opacity:0.55;cursor:not-allowed;"' : '';
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">编辑目标词</span>
      ${aiRecoTriggerInlineHTML('kw-modal', 2)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${row ? `<p style="font-size:12px;color:var(--text-3);margin:0 0 12px;line-height:1.45;">${escapeHtmlStr(row.title)}</p>` : ''}
    <div class="onpage-kw-modal-chips">${chips || '<span style="color:var(--text-3);font-size:13px;">暂无目标词，请在下方输入并添加</span>'}</div>
    <div class="form-group" style="margin-top:14px;">
      <label class="form-label">添加关键词</label>
      <div style="display:flex;gap:8px;align-items:stretch;">
        <input type="text" id="modalOnPageKwInput" class="form-input" placeholder="输入后点击添加，或按 Enter" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();onPageKwModalAddOne();}"${atMax ? ' readonly' : ''} />
        <button type="button" class="btn-default" onclick="onPageKwModalAddOne()"${addDis}>添加</button>
      </div>
      <div class="form-hint">每页最多 ${ONPAGE_KW_MAX} 个目标词；首条通常作为主目标词。保存后写入当前页的 SEO 目标词字段。</div>
      ${aiRecoPreviewOnlyHTML('kw-modal')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="saveOnPageKwFromModal()">保存</button>
  </div>`;
}

function modalOnPagePageType() {
  const i = state.onPageSeoTagsModalIdx;
  const row = i != null ? DB.onPageSeoPages[i] : null;
  if (!row) {
    return `<div class="modal-header"><span class="modal-title">页面类型</span><button class="modal-close" data-close>×</button></div><div class="modal-body"><p style="font-size:13px;color:var(--text-2);">无法加载页面。</p></div><div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  syncOnPagePageTypeFromPath(row);
  const isHome = isOnPageHomePath(row);
  const cur = row.pageType || '';
  const pagetypeHintBtn = t => `<span class="onpage-pagetype-hint-wrap"><button type="button" class="onpage-field-hint-btn" aria-label="${escapeAttr(t.label + '说明')}" data-onpage-hint="${escapeAttr(t.hint)}">${ONPAGE_SVG_INFO_HINT}</button></span>`;
  let opts;
  if (isHome) {
    const homeType = ONPAGE_PAGE_TYPES.find(t => t.id === 'homepage');
    opts = homeType
      ? `<label class="onpage-pagetype-opt onpage-pagetype-opt--locked"><input type="radio" name="onpagePageType" value="homepage" checked disabled/><span class="onpage-pagetype-opt-lbl">${escapeHtmlStr(homeType.label)}</span>${pagetypeHintBtn(homeType)}</label>`
      : '';
  } else {
    opts = ONPAGE_PAGE_TYPES_MANUAL.map(t => {
      const checked = cur === t.id ? ' checked' : '';
      return `<label class="onpage-pagetype-opt"><input type="radio" name="onpagePageType" value="${escapeAttr(t.id)}"${checked}/><span class="onpage-pagetype-opt-lbl">${escapeHtmlStr(t.label)}</span>${pagetypeHintBtn(t)}</label>`;
    }).join('');
  }
  const homeNote = isHome
    ? '<p class="onpage-pagetype-home-note">当前为站点首页（路径 /），系统已识别为「首页」，页面类型不可修改。</p>'
    : '';
  const modalFoot = isHome
    ? '<div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>'
    : '<div class="modal-footer"><button class="btn-default" data-close>取消</button><button class="btn-primary" onclick="saveOnPagePageTypeFromModal()">保存</button></div>';
  return `
  <div class="modal-header"><span class="modal-title">页面类型</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <p class="modal-pagetype-page-title">${escapeHtmlStr(row.title)}</p>
    <p style="font-size:12px;color:var(--text-3);margin:0 0 12px;line-height:1.45;">每页最多选择 1 项页面类型，用于检测豁免与优化提示。悬停 ℹ 查看说明。</p>
    ${homeNote}
    <div class="onpage-pagetype-list">${opts}</div>
    ${isHome ? '' : '<button type="button" class="btn-link" style="margin-top:10px;font-size:12px;" onclick="onPagePageTypeClear()">清除类型</button>'}
  </div>
  ${modalFoot}`;
}

function modalOnPageSeoTags() {
  return modalOnPagePageType();
}

window.saveOnPagePageTypeFromModal = function () {
  const i = state.onPageSeoTagsModalIdx;
  const row = i != null ? DB.onPageSeoPages[i] : null;
  if (!row) return;
  if (isOnPageHomePath(row)) {
    row.pageType = 'homepage';
  } else {
    const picked = document.querySelector('input[name="onpagePageType"]:checked');
    row.pageType = picked && picked.value !== 'homepage' ? picked.value : '';
  }
  closeModal();
  toast('已保存页面类型');
  render();
  renderDrawer();
};

window.onPagePageTypeClear = function () {
  const i = state.onPageSeoTagsModalIdx;
  const row = i != null ? DB.onPageSeoPages[i] : null;
  if (row && isOnPageHomePath(row)) return;
  document.querySelectorAll('input[name="onpagePageType"]').forEach(el => { el.checked = false; });
};

window.onPageSeoTagAddFromModal = function () {
  const i = state.onPageSeoTagsModalIdx;
  const row = DB.onPageSeoPages[i];
  const el = $('modalOnPageTagInput');
  if (!row || !el) return;
  const v = (el.value || '').trim();
  if (!v) return;
  row.tags = Array.isArray(row.tags) ? row.tags : [];
  if (!row.tags.includes(v)) row.tags.push(v);
  el.value = '';
  state.modal = 'onpage-seo-tags';
  renderModal();
  render();
};

window.onPageSeoTagRemoveFromModal = function (ti) {
  const i = state.onPageSeoTagsModalIdx;
  const row = DB.onPageSeoPages[i];
  if (!row || !Array.isArray(row.tags)) return;
  const t = row.tags[ti];
  if (isOnPageSystemTag(t)) {
    toast('系统页面类型标签不可删除', 'error');
    return;
  }
  row.tags.splice(ti, 1);
  state.modal = 'onpage-seo-tags';
  renderModal();
  render();
};

function modalOnPageSchemaJson() {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  const dom = site().domain;
  if (!row) {
    return `<div class="modal-header"><span class="modal-title">编辑本页结构化数据</span><button class="modal-close" data-close>×</button></div><div class="modal-body"><p style="font-size:13px;color:var(--text-2);">无法加载页面。</p></div><div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  const pfSch = state.onPageAiAuditEditorPrefill;
  let raw;
  if (pfSch && pfSch.kind === 'schema-json' && pfSch.json != null) {
    raw = JSON.stringify([{ label: 'AI 推荐', slice: state.onPageSchemaSlice || 'jsonld-org', json: String(pfSch.json) }], null, 2);
  } else {
    raw = buildOnPageAllSchemaEditText(row, dom);
  }
  const saasLocked = !siteLeadongSaasAuthorized();
  const ro = saasLocked ? ' readonly' : '';
  const tc = saasLocked ? ' form-textarea--saas-readonly' : '';
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">编辑本页结构化数据</span>
      ${aiRecoTriggerInlineHTML('schema-json', 4)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${modalLeadongSaasLockBannerHTML()}
    <p class="form-hint form-hint--schema-sync">统一编辑当前页面<strong>全部</strong> JSON-LD 片段。保存后<strong>同步写入独立站后台</strong>对应页面字段。</p>
    <textarea id="modalOnPageSchemaJson" class="form-textarea form-textarea--schema-json${tc}" style="min-height:280px;font-family:ui-monospace,monospace;font-size:12px;" placeholder="JSON 数组：每项含 label、slice、json 字段"${ro}>${escapeHtmlStr(String(raw || ''))}</textarea>
    <div class="form-hint">已授权的独立站仅部分页面类型支持后台单独编辑结构化数据；不支持编辑的页面类型弹窗为只读。</div>
    ${aiRecoPreviewOnlyHTML('schema-json')}
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="saveOnPageSchemaJsonFromModal()"${modalPrimarySaveBtnLockedAttrs()}>保存</button>
  </div>`;
}

function modalOnPageDrawerTdk() {
  const idx = state.onPageSeoDrawerIndex;
  const row = idx != null ? DB.onPageSeoPages[idx] : null;
  if (!row) {
    return `
  <div class="modal-header">
    <span class="modal-title">编辑标题与摘要</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body"><p style="font-size:13px;color:var(--text-2);">无法加载页面数据。</p></div>
  <div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
  }
  const metaKw = row.metaKeywords === '—' ? '' : (row.metaKeywords || '');
  const pfTdk = state.onPageAiAuditEditorPrefill;
  const isTdkPf = pfTdk && pfTdk.kind === 'tdk';
  const dispTitle = isTdkPf && pfTdk.title != null ? String(pfTdk.title) : String(row.title || '');
  const dispDesc = isTdkPf && pfTdk.desc != null ? String(pfTdk.desc) : String(row.metaDesc || '');
  const dispKw = isTdkPf && pfTdk.kw != null ? String(pfTdk.kw) : metaKw;
  const titleLen = dispTitle.length;
  const descLen = dispDesc.length;
  const kwLen = dispKw.length;
  const saasLocked = !siteLeadongSaasAuthorized();
  const ro = saasLocked ? ' readonly' : '';
  const ic = saasLocked ? ' form-input--saas-readonly' : '';
  const tc = saasLocked ? ' form-textarea--saas-readonly' : '';
  return `
  <div class="modal-header modal-header--split">
    <div class="modal-header-main">
      <span class="modal-title">编辑标题与摘要</span>
      ${aiRecoTriggerInlineHTML('tdk-modal', 5)}
    </div>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${modalLeadongSaasLockBannerHTML()}
    <div class="form-group">
      <label class="form-label form-label--inline-badge">页面标题 ${onPageTdkCharBadgeHTML(titleLen, 60)}</label>
      <input type="text" id="modalOnPageTdkTitle" class="form-input${ic}" value="${escapeAttr(dispTitle)}"${ro} />
      ${aiRecoFieldPreviewHTML('tdk-ai-title', 'modalOnPageTdkTitle', '页面标题')}
    </div>
    <div class="form-group">
      <label class="form-label form-label--inline-badge">页面摘要 ${onPageTdkCharBadgeHTML(descLen, 160)}</label>
      <textarea id="modalOnPageTdkDesc" class="form-textarea${tc}" rows="4"${ro}>${escapeHtmlStr(dispDesc)}</textarea>
      ${aiRecoFieldPreviewHTML('tdk-ai-desc', 'modalOnPageTdkDesc', '页面摘要')}
    </div>
    <div class="form-group">
      <label class="form-label form-label--inline-badge">关键词 ${onPageTdkCharBadgeHTML(kwLen, 100)}</label>
      <input type="text" id="modalOnPageTdkKw" class="form-input${ic}" placeholder="逗号分隔" value="${escapeAttr(dispKw)}"${ro} />
      ${aiRecoFieldPreviewHTML('tdk-ai-kw', 'modalOnPageTdkKw', '关键词')}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="saveOnPageTdkFromModal()"${modalPrimarySaveBtnLockedAttrs()}>保存</button>
  </div>`;
}

function modalRankedPageKws() {
  const p = state.rankedKwModalPath;
  const merged = sortRankedKwModalRows(getRankedKwRowsForModal(p));
  const title = p ? `有排名关键词 · ${escapeHtmlStr(p)}` : '有排名关键词';
  const H = URL_RANK_MODAL_TH_HINTS;
  const sk = state.rankedKwModalSortKey || 'kw';
  const sd = state.rankedKwModalSortDir || 'asc';
  const thKw = tableSortThBtnHTML('关键词', H.kw, 'kw', sk, sd, 'sortRankedKwModalCol');
  const thRank = tableSortThBtnHTML('最新排名', H.rank, 'rank', sk, sd, 'sortRankedKwModalCol');
  const thTime = tableSortThBtnHTML('排名时间', H.time, 'time', sk, sd, 'sortRankedKwModalCol');
  const body = merged.length
    ? `<table class="data-table"><thead><tr>
        <th class="th-sort-th">${thKw}</th>
        <th class="th-sort-th" style="width:88px;">${thRank}</th>
        <th class="th-sort-th" style="width:180px;">${thTime}</th>
      </tr></thead><tbody>${merged.map(x => `
      <tr><td><span class="td-kw">${escapeHtmlStr(x.kw)}</span></td><td>${x.rank != null ? `<span class="badge badge-blue">${x.rank}</span>` : '—'}</td><td style="font-size:12px;color:var(--text-3);">${escapeHtmlStr(x.rankAt || '—')}</td></tr>`).join('')}</tbody></table>`
    : '<p style="font-size:13px;color:var(--text-2);">当前没有可展示的数据。</p>';
  return `
  <div class="modal-header">
    <span class="modal-title">${title}</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">${body}</div>
  <div class="modal-footer"><button class="btn-default" data-close>关闭</button></div>`;
}

/* ────────────────────────────────────────────────────────────
   Modals
   ──────────────────────────────────────────────────────────── */
function openModal(type) {
  if (type === 'onpage-drawer-kw') state.onPageKwModalDraft = null;
  state.modal = type;
  const ov = $('modalOverlay');
  const box = $('modalBox');
  if (!ov || !box) return;
  renderModal();
  ov.style.display = 'flex';
}
function closeModal() {
  if (state.modal === 'leadong-auth-pre') {
    cancelLeadongAuthPre();
    return;
  }
  state.modal = null;
  state.onPageKwModalDraft = null;
  state.rankDetailArticleId = null;
  state.kwBestPagesKwId = null;
  state.rankedKwModalPath = null;
  state.articleDeleteConfirmIds = [];
  state.pendingWritingGenerate = null;
  state.dashboardTaskAiId = null;
  state.onPageAiAuditEditorPrefill = null;
  const aiTip = $('aiRecReasonTip');
  if (aiTip) aiTip.style.display = 'none';
  $('modalOverlay').style.display = 'none';
}
$('modalOverlay').addEventListener('click', e => {
  if (e.target === $('modalOverlay')) closeModal();
});

function renderModal() {
  const M = state.modal;
  const box = $('modalBox');
  if (M === 'dashboard-seo-rescan-confirm') { box.className = 'modal-box'; box.innerHTML = modalDashboardSeoRescanConfirm(); }
  if (M === 'add-site')      { box.className='modal-box modal-wide'; box.innerHTML = modalAddSite(); bindWizard(); return; }
  if (M === 'update-rank')   { box.className='modal-box'; box.innerHTML = modalUpdateRank(); }
  if (M === 'add-kw')        { box.className='modal-box'; box.innerHTML = modalAddKw(); }
  if (M === 'add-group')     { box.className='modal-box'; box.innerHTML = modalAddGroup(); }
  if (M === 'edit-group')    { box.className='modal-box'; box.innerHTML = modalEditGroup(); }
  if (M === 'add-comp')      { box.className='modal-box'; box.innerHTML = modalAddComp(); }
  if (M === 'set-group')     { box.className='modal-box'; box.innerHTML = modalSetGroup(); }
  if (M === 'site-settings')   { box.className='modal-box modal-wide'; box.innerHTML = modalSiteSettings(); bindSiteSettingsTabs(); return; }
  if (M === 'leadong-auth-pre') { box.className='modal-box modal-wide'; box.innerHTML = modalLeadongAuthPre(); bindLeadongAuthPre(); return; }
  if (M === 'kw-best-pages')   { box.className='modal-box modal-wide'; box.innerHTML = modalKwBestPages(); }
  if (M === 'usage-log')       { box.className='modal-box modal-wide modal-usage-log-shell'; box.innerHTML = modalUsageLog(); }
  if (M === 'serp')            { box.className='modal-box modal-wide'; box.innerHTML = modalSerp(); }
  if (M === 'topic-recommend')    { box.className='modal-box modal-wide'; box.innerHTML = modalTopicRecommend(); }
  if (M === 'kw-picker')          { box.className='modal-box modal-wide'; box.innerHTML = modalKwPicker(); }
  if (M === 'related-kw-picker')  { box.className='modal-box modal-wide'; box.innerHTML = modalRelatedKwPicker(); }
  if (M === 'publish-article')    { box.className='modal-box'; box.innerHTML = modalPublishArticle(); }
  if (M === 'article-url-ranks')   { box.className='modal-box modal-wide'; box.innerHTML = modalArticleUrlRanks(); }
  if (M === 'article-delete-confirm') { box.className='modal-box'; box.innerHTML = modalArticleDeleteConfirm(); }
  if (M === 'writing-submit-success') { box.className='modal-box'; box.innerHTML = modalWritingSubmitSuccess(); }
  if (M === 'onpage-drawer-kw') {
    box.className = 'modal-box';
    if (!Array.isArray(state.onPageKwModalDraft)) {
      const idx = state.onPageSeoDrawerIndex;
      const row = idx != null ? DB.onPageSeoPages[idx] : null;
      state.onPageKwModalDraft = row ? parseMultiKw(row.keyword).slice(0, ONPAGE_KW_MAX) : [];
    }
    box.innerHTML = modalOnPageDrawerKw();
  }
  if (M === 'onpage-drawer-tdk') {
    box.className = 'modal-box modal-wide';
    box.innerHTML = modalOnPageDrawerTdk();
    if (state.onPageAiAuditEditorPrefill && state.onPageAiAuditEditorPrefill.kind === 'tdk') state.onPageAiAuditEditorPrefill = null;
  }
  if (M === 'onpage-drawer-social') {
    box.className = 'modal-box modal-wide';
    box.innerHTML = modalOnPageDrawerSocial();
    if (state.onPageAiAuditEditorPrefill && state.onPageAiAuditEditorPrefill.kind === 'social') state.onPageAiAuditEditorPrefill = null;
  }
  if (M === 'onpage-drawer-image') {
    box.className = 'modal-box';
    box.innerHTML = modalOnPageDrawerImage();
    if (state.onPageAiAuditEditorPrefill && state.onPageAiAuditEditorPrefill.kind === 'image') state.onPageAiAuditEditorPrefill = null;
  }
  if (M === 'onpage-drawer-schema-row') {
    box.className = 'modal-box modal-wide';
    box.innerHTML = modalOnPageDrawerSchemaRow();
    if (state.onPageAiAuditEditorPrefill && state.onPageAiAuditEditorPrefill.kind === 'schema-row') state.onPageAiAuditEditorPrefill = null;
  }
  if (M === 'onpage-seo-tags' || M === 'onpage-page-type') {
    box.className = 'modal-box';
    box.innerHTML = modalOnPagePageType();
    bindOnPageDrawerHints(box);
    box.querySelectorAll('[data-close]').forEach(el => { el.onclick = closeModal; });
    return;
  }
  if (M === 'onpage-schema-json') {
    box.className = 'modal-box modal-wide';
    box.innerHTML = modalOnPageSchemaJson();
    if (state.onPageAiAuditEditorPrefill && state.onPageAiAuditEditorPrefill.kind === 'schema-json') state.onPageAiAuditEditorPrefill = null;
  }
  if (M === 'dashboard-task-ai') { box.className='modal-box modal-wide'; box.innerHTML = modalDashboardTaskAi(); }
  if (M === 'ranked-page-kws') { box.className='modal-box modal-wide'; box.innerHTML = modalRankedPageKws(); }
  box.querySelectorAll('[data-close]').forEach(el => el.onclick = closeModal);
  bindAiRecPreviewInteractions(box);
}

/* 添加网站 wizard */
function modalAddSite() {
  const step = state.wizardStep;
  const stepLabels = ['添加网站', '添加关键词', '搜索引擎配置'];
  return `
  <div class="modal-header">
    <span class="modal-title">添加网站</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${wizardStepBody(step)}
  </div>
  <div class="modal-footer">
    ${step > 1 ? `<button class="btn-default" id="wizPrev">上一步</button>` : ''}
    <button class="btn-default" data-close>取消</button>
    ${step === 2 ? `<button class="btn-default" id="wizSkip">跳过</button>` : ''}
    ${step < 3 ? `<button class="btn-primary" id="wizNext">下一步</button>` : `<button class="btn-primary" id="wizSave">保存</button>`}
  </div>`;
}

function wizardStepBody(step) {
  if (step === 1) return `
    <div class="form-group">
      <label class="form-label"><span class="required">*</span> 网站域名</label>
      <input id="wDomain" class="form-input" type="text" placeholder="输入您需要监控的网站域名" value="${state.wizardData.domain}"/>
      <div class="form-hint">支持裸域（如 domain.com）或子域名（如 www.domain.com）</div>
    </div>
    <div class="form-group">
      <label class="form-label">网站简称</label>
      <input id="wAlias" class="form-input" type="text" placeholder="设置网站简称用于系统内部展示" value="${state.wizardData.alias}"/>
    </div>`;
  if (step === 2) return `
    <div class="form-group">
      <label class="form-label"><span class="required">*</span> 关键词</label>
      <div style="font-size:12px;color:var(--text-sub);margin-bottom:4px;">最多可添加 120 个关键词，已添加 0 个</div>
      <textarea id="wKeywords" class="form-textarea" rows="8" placeholder="多个关键词用回车、换行分隔，不要输入标点符号">${state.wizardData.keywords}</textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn-default">本地导入</button>
        <span style="font-size:12px;color:var(--text-light);line-height:32px;">支持 .xls 格式</span>
      </div>
    </div>`;
  // step 3
  return `
    <div class="form-group">
      <label class="form-label"><span class="required">*</span> 搜索引擎配置</label>
      <div style="font-size:12px;color:var(--text-sub);margin-bottom:10px;">设置搜索引擎类型，系统会按照设置的搜索引擎信息进行关键词排名数据的抓取</div>
      <div class="engine-row">
        <span class="engine-name">Google</span>
        <span class="engine-meta">PC端 · 美国 · 英语 · 常规搜索 · www.google.com</span>
        <div class="engine-ops">
          <button class="btn-link">编辑</button>
        </div>
      </div>
      <button class="btn-default" style="margin-top:8px;" onclick="openModal('add-engine-inner')">+ 添加搜索引擎</button>
      <div style="font-size:12px;color:var(--text-sub);margin-top:6px;">已添加 1 / 10 个搜索引擎</div>
    </div>`;
}

function bindWizard() {
  const next = document.getElementById('wizNext');
  const prev = document.getElementById('wizPrev');
  const skip = document.getElementById('wizSkip');
  const save = document.getElementById('wizSave');

  if (next) next.onclick = () => {
    if (state.wizardStep === 1) {
      const d = document.getElementById('wDomain');
      if (!d || !d.value.trim()) { toast('请输入网站域名', 'error'); return; }
      state.wizardData.domain = d.value.trim();
      const a = document.getElementById('wAlias');
      if (a) state.wizardData.alias = a.value.trim();
    }
    if (state.wizardStep === 2) {
      const kw = document.getElementById('wKeywords');
      if (kw) state.wizardData.keywords = kw.value.trim();
    }
    state.wizardStep++;
    $('modalBox').innerHTML = modalAddSite();
    bindWizard();
  };
  if (prev) prev.onclick = () => {
    state.wizardStep--;
    $('modalBox').innerHTML = modalAddSite();
    bindWizard();
  };
  if (skip) skip.onclick = () => {
    state.wizardStep++;
    $('modalBox').innerHTML = modalAddSite();
    bindWizard();
  };
  if (save) save.onclick = () => {
    const newId = DB.sites.length + 1;
    DB.sites.push({
      id: newId,
      name: state.wizardData.alias || state.wizardData.domain,
      domain: state.wizardData.domain.replace(/^https?:\/\//,'').replace(/\/.*$/,''),
      kws: 0, comps: 0,
      added: new Date().toISOString().slice(0,10),
      hasGSC: false,
    });
    state.siteId = newId;
    state.wizardStep = 1;
    state.wizardData = { domain:'', alias:'', keywords:'', engines:[] };
    closeModal();
    state.primary = 'dashboard';
    state.dashboardTab = 'overview';
    render();
    toast('网站添加成功，正在执行首次站点基建检测…');
    runDashboardInfraScanDemo(() => {
      render();
      toast('首次站点基建检测已完成（示例）');
    });
  };
  $('modalBox').querySelectorAll('[data-close]').forEach(el => el.onclick = closeModal);
}

/* 更新排名 */
function modalUpdateRank() {
  const s = site();
  const est = s.kws * 1;
  const remaining = DB.package.crawlPoints.total - DB.package.crawlPoints.used;
  const idx = DB.sites.findIndex(si => si.id === s.id);
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const engines = [
    {
      id: 'google', checked: true,
      logo: `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
      name: 'Google',
      detail: ['□ PC端', '@ 美国', '® 英语', '常规搜索']
    },
    {
      id: 'yandex', checked: true,
      logo: `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#FF0000"/><text x="7" y="16" font-family="Arial" font-size="11" font-weight="bold" fill="white">Я</text></svg>`,
      name: 'Yandex',
      detail: ['□ PC端', '@ 美国', '® 英语', '图片']
    },
    {
      id: 'bing', checked: false,
      logo: `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 3l3.5 1.5v12.5l4-2.5-4-1.5V5.5l8.5 3.5L11 14l-2 1.2V21l-3-1.5V3z" fill="#0078D4"/></svg>`,
      name: 'Bing',
      detail: ['□ 手机端', '@ 美国', '® 英语']
    },
  ];
  return `
  <div class="modal-header"><span class="modal-title">更新网站排名</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <p style="font-size:13px;color:var(--text-2);margin-bottom:18px;line-height:1.6;">立刻更新网站在搜索引擎的排名数据，以知晓您网站在搜索引擎的表现情况。</p>

    <!-- Target site -->
    <div class="form-group">
      <label class="form-label">目标网站</label>
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-md);">
        <div style="width:32px;height:32px;border-radius:var(--r-sm);background:${color};color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${s.name[0]}</div>
        <div>
          <div style="font-weight:600;font-size:13px;">${s.name}</div>
          <div style="font-size:11px;color:var(--text-3);">${s.domain}</div>
        </div>
        <div style="margin-left:auto;font-size:12px;color:var(--text-3);">当前关键词数：<strong style="color:var(--text-1);">${s.kws}</strong></div>
      </div>
    </div>

    <!-- Engine selection -->
    <div class="form-group">
      <label class="form-label">搜索引擎</label>
      ${engines.map(e => `
      <div class="engine-select-row ${e.checked ? 'checked' : ''}" onclick="this.classList.toggle('checked')">
        <input type="checkbox" ${e.checked ? 'checked' : ''} onclick="event.stopPropagation();this.closest('.engine-select-row').classList.toggle('checked')" style="width:15px;height:15px;accent-color:var(--brand);cursor:pointer;"/>
        <div class="engine-select-logo">${e.logo}</div>
        <div class="engine-select-info">
          <div class="engine-select-name">${e.name}</div>
          <div class="engine-select-detail">
            ${e.detail.map(d => `<span>${d}</span>`).join('')}
          </div>
        </div>
      </div>`).join('')}
    </div>

    <!-- Cost estimate -->
    <div class="engine-cost-row">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="var(--text-3)" stroke-width="1.2"/><line x1="8" y1="4.5" x2="8" y2="8.5" stroke="var(--text-3)" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11" r=".8" fill="var(--text-3)"/></svg>
      <span style="color:var(--text-2);">本次排名更新预计消耗</span>
      <span class="engine-cost-num">${est}</span>
      <span style="color:var(--text-2);">点数</span>
      <span style="color:var(--text-3);margin-left:4px;">（当前剩余 <strong style="color:var(--text-1);">${remaining.toLocaleString()}</strong> 点）</span>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="toast('排名更新任务已加入队列，完成后将通知您。');closeModal();">开始更新</button>
  </div>`;
}

/* 添加关键词 */
function modalAddKw() {
  return `
  <div class="modal-header"><span class="modal-title">添加关键词</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <div class="form-group">
      <label class="form-label"><span class="required">*</span> 关键词</label>
      <div style="font-size:12px;color:var(--text-sub);margin-bottom:4px;">0 / 120 个（剩余可添加）</div>
      <textarea class="form-textarea" rows="8" placeholder="多个关键词用回车、换行分隔，不要输入标点符号"></textarea>
      <button class="btn-default" style="margin-top:8px;">本地导入</button>
    </div>
    <div class="form-group">
      <label class="form-label">添加到分组</label>
      <select class="form-select">
        <option value="">不添加到分组</option>
        ${DB.groups.map(g=>`<option>${g.name}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="toast('关键词添加成功！');closeModal();">保存</button>
  </div>`;
}

/* 创建分组 */
function modalAddGroup() {
  return `
  <div class="modal-header"><span class="modal-title">添加分组</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <div class="form-group">
      <label class="form-label"><span class="required">*</span> 分组名称</label>
      <input class="form-input" type="text" placeholder="输入新分组的名称，不可重复"/>
    </div>
    <div class="form-group">
      <label class="form-label">选择关键词</label>
      <input class="form-input" type="text" placeholder="搜索并选择要包含的关键词"/>
      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">
        ${DB.keywords.map(k=>`<label style="display:flex;align-items:center;gap:4px;font-size:13px;"><input type="checkbox" style="margin:0;"/>${k.kw}</label>`).join('')}
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="toast('分组创建成功！');closeModal();">保存</button>
  </div>`;
}

/* 编辑分组 */
function modalEditGroup() {
  return modalAddGroup().replace('添加分组','编辑分组');
}

/* 添加竞争对手 */
function modalAddComp() {
  return `
  <div class="modal-header"><span class="modal-title">添加竞争对手</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <div class="form-group">
      <label class="form-label"><span class="required">*</span> 网站域名</label>
      <input class="form-input" type="text" placeholder="输入您需要监控的网站域名"/>
      <div class="form-hint">支持裸域或子域名</div>
    </div>
    <div class="form-group">
      <label class="form-label">网站简称</label>
      <input class="form-input" type="text" placeholder="设置网站简称用于系统内部展示"/>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="toast('竞争对手添加成功！');closeModal();">保存</button>
  </div>`;
}

/* 设置分组 */
function modalSetGroup() {
  return `
  <div class="modal-header"><span class="modal-title">设置分组</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <div style="font-size:12px;color:var(--text-sub);margin-bottom:10px;">为已选关键词添加或移除分组</div>
    ${DB.groups.map(g=>`<label style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f0f0f0;"><input type="checkbox" style="margin:0;"/><span>${g.name}</span></label>`).join('')}
    <div style="margin-top:10px;"><button class="btn-link">+ 新建分组</button></div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="closeModal();">保存</button>
  </div>`;
}

/** 演示：解除授权时记录原独立站网站，供「重新授权」弹窗冻结选站 */
function applyPendingReauthLeadongSnapshot(authRow) {
  if (!authRow || authRow.geSiteId == null || !authRow.leadongSiteId) return;
  DB.pendingReauthLeadong = {
    geSiteId: authRow.geSiteId,
    leadongSiteId: authRow.leadongSiteId,
    domain: authRow.domain || '',
  };
}

function clearPendingReauthLeadongIfMatch(geSiteId) {
  if (DB.pendingReauthLeadong && DB.pendingReauthLeadong.geSiteId === geSiteId) {
    DB.pendingReauthLeadong = null;
  }
}

function demoUnbindLeadongFromSettings(authId) {
  if (!confirm('解除授权后将无法向该站点发布文章；可再次绑定同一独立站网站。确认解除？')) return;
  const row = DB.siteAuths.find(a => a.id === authId);
  if (row) applyPendingReauthLeadongSnapshot(row);
  DB.siteAuths = DB.siteAuths.filter(a => a.id !== authId);
  toast('已解除授权');
  document.getElementById('modalBox').innerHTML = modalSiteSettings();
  bindSiteSettingsTabs();
  render();
}

function demoUnbindLeadongFromSiteMgmt(authId) {
  if (!confirm('解除授权后将无法向该站点发布文章；可再次绑定同一独立站网站。确认？')) return;
  const row = DB.siteAuths.find(a => a.id === authId);
  if (row) applyPendingReauthLeadongSnapshot(row);
  DB.siteAuths = DB.siteAuths.filter(a => a.id !== authId);
  toast('已解除授权');
  render();
}

/** 下拉展示用：网站 ID 对应文案（含解除授权快照回退） */
function leadongDemoPickLabel(leadongSiteId) {
  const o = LEADONG_SAAS_SITES_DEMO.find(x => x.leadongSiteId === leadongSiteId);
  if (o) return `${o.label} — ${o.domain}`;
  const p = DB.pendingReauthLeadong;
  if (p && p.leadongSiteId === leadongSiteId && p.domain) return `${p.leadongSiteId} — ${p.domain}`;
  return leadongSiteId;
}

/** 从「前往授权 · 确认」弹窗返回网站设置（不关闭遮罩） */
function cancelLeadongAuthPre() {
  state.leadongAuthSelectFrozen = false;
  state.modal = state.leadongAuthRestoreModal || 'site-settings';
  state.leadongAuthRestoreModal = null;
  renderModal();
}

/** 打开「前往授权」第二步：绑定规则、选站、录入域名说明（由授权管理 Tab 触发） */
function openLeadongAuthPreModal() {
  state.leadongAuthRestoreModal = 'site-settings';
  const geSite = site();
  const ge = geSite.id;
  const pend = DB.pendingReauthLeadong;
  if (pend && pend.geSiteId === ge && pend.leadongSiteId) {
    state.leadongAuthPick = pend.leadongSiteId;
    state.leadongAuthSelectFrozen = true;
  } else {
    state.leadongAuthSelectFrozen = false;
    const matched = leadongMatchedSitesForGe(geSite);
    if (matched.length && !matched.some(m => m.leadongSiteId === state.leadongAuthPick)) {
      state.leadongAuthPick = matched[0].leadongSiteId;
    }
  }
  state.modal = 'leadong-auth-pre';
  renderModal();
}

function modalLeadongAuthPre() {
  const s = site();
  const frozen = !!state.leadongAuthSelectFrozen;
  const matched = leadongMatchedSitesForGe(s);
  const selectRows = frozen
    ? `<select id="leadongSiteSelect" class="form-input" disabled style="opacity:1;background:#f8fafc;color:var(--text-2);cursor:not-allowed;">
        <option value="${escapeHtmlStr(state.leadongAuthPick)}">${escapeHtmlStr(leadongDemoPickLabel(state.leadongAuthPick))}</option>
      </select>
      <div class="form-hint">重新授权至解除授权前的同一独立站网站；目标网站与域名已固定，不可更改。</div>`
    : matched.length
      ? `<select id="leadongSiteSelect" class="form-input">
        ${matched.map(o => `<option value="${escapeHtmlStr(o.leadongSiteId)}"${state.leadongAuthPick === o.leadongSiteId ? ' selected' : ''}>${escapeHtmlStr(o.label)} — ${escapeHtmlStr(o.domain)}</option>`).join('')}
      </select>
      <div class="form-hint">仅展示与<strong>当前增长引擎站点录入域名</strong>（${escapeHtmlStr(s.domain)}）一致的独立站网站；其它语种/站点不会在列表中出现。</div>`
      : `<div class="form-input" style="height:auto;min-height:40px;padding:10px 12px;background:#fff7ed;border:1px solid #fdba74;color:#9a3412;font-size:13px;line-height:1.55;">
        当前账号下<strong>没有</strong>与增长引擎站点「<strong>${escapeHtmlStr(s.name)}</strong> · ${escapeHtmlStr(s.domain)}」域名一致的领动独立站网站，无法继续授权。<br/>
        请先在领动 SaaS 中创建同域名的站点，或在增长引擎「网站管理」中核对/修改录入域名后再试。
      </div>
      <select id="leadongSiteSelect" class="form-input" style="display:none;" aria-hidden="true"><option value=""></option></select>`;
  return `
  <div class="modal-header">
    <span class="modal-title">授权确认</span>
    <button type="button" class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    <div style="margin-bottom:12px;padding:10px 12px;background:#f8fafc;border:1px solid var(--border);border-radius:8px;font-size:12px;color:var(--text-2);line-height:1.6;">
      <strong style="color:var(--text);">绑定规则</strong><br/>
      · 绑定关系以<strong>独立站网站 ID</strong>为准；每个增长引擎站点<strong>终身仅可绑定一个</strong>该 ID，<strong>不支持换绑其他网站 ID</strong>。解除授权后可再次绑定<strong>同一</strong>网站。<br/>
      · 若需绑定其他独立站网站，请先在网站管理中<strong>删除</strong>本站点并重新添加后再授权。<br/>
    </div>
    <div class="form-group" style="margin-bottom:12px;">
      <label class="form-label">选择要授权的独立站网站${frozen ? '（已固定）' : ''}</label>
      ${selectRows}
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close type="button">取消</button>
    <button class="btn-primary" type="button" id="leadongAuthContinue">继续前往授权</button>
  </div>`;
}

function bindLeadongAuthPre() {
  const box = $('modalBox');
  const s = site();
  const matched = leadongMatchedSitesForGe(s);
  const sel = box.querySelector('#leadongSiteSelect');
  if (sel && !state.leadongAuthSelectFrozen) sel.onchange = () => { state.leadongAuthPick = sel.value; };
  box.querySelectorAll('[data-close]').forEach(el => { el.onclick = () => cancelLeadongAuthPre(); });
  const go = box.querySelector('#leadongAuthContinue');
  if (go) {
    const canGo = state.leadongAuthSelectFrozen || matched.length > 0;
    go.disabled = !canGo;
    go.style.opacity = canGo ? '' : '0.5';
    go.style.cursor = canGo ? '' : 'not-allowed';
    go.onclick = () => { if (canGo) demoLeadongAuthorize(); };
  }
}

/** 演示：领动独立站 OAuth（在「前往授权 · 确认」弹窗内点击继续后执行） */
function demoLeadongAuthorize() {
  const s = site();
  const sel = document.getElementById('leadongSiteSelect');
  if (sel && sel.value) state.leadongAuthPick = sel.value;
  const matched = leadongMatchedSitesForGe(s);
  let pick = matched.find(x => x.leadongSiteId === state.leadongAuthPick);
  if (!pick && state.leadongAuthSelectFrozen && DB.pendingReauthLeadong
    && DB.pendingReauthLeadong.leadongSiteId === state.leadongAuthPick) {
    const p = DB.pendingReauthLeadong;
    pick = {
      leadongSiteId: p.leadongSiteId,
      label: '（重新授权）',
      domain: p.domain || s.domain,
    };
  }
  if (!pick) {
    toast('请选择与当前增长引擎站点域名一致的独立站网站', 'error');
    return;
  }
  toast('正在跳转至领动 SaaS 授权页面…');
  setTimeout(() => {
    const idx = DB.siteAuths.findIndex(a => a.geSiteId === s.id);
    if (idx >= 0) DB.siteAuths.splice(idx, 1);
    DB.siteAuths.push({
      id: Date.now(),
      geSiteId: s.id,
      leadongSiteId: pick.leadongSiteId,
      name: s.name,
      domain: pick.domain,
      type: '领动SaaS',
      status: 'active',
      addedAt: new Date().toISOString().slice(0, 10),
    });
    toast('授权成功！');
    clearPendingReauthLeadongIfMatch(s.id);
    state.leadongAuthSelectFrozen = false;
    state.leadongAuthRestoreModal = null;
    state.settingsSub = 'auth';
    state.modal = 'site-settings';
    renderModal();
    render();
  }, 1500);
}

/* 网站设置 */
function modalSiteSettings() {
  const s = site();
  const sub = state.settingsSub;
  return `
  <div class="modal-header">
    <span class="modal-title">设置</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div style="display:flex;border-bottom:1px solid var(--border);">
    ${['basic','engine','crawl','auth'].map((t,i)=>{
      const labels = ['基本信息','搜索引擎','抓取设置','授权管理'];
      return `<button class="sec-nav-item ${sub===t?'active':''}" data-sub="${t}">${labels[i]}</button>`;
    }).join('')}
  </div>
  <div class="modal-body">
    ${sub==='basic' ? `
      <div class="form-group">
        <label class="form-label">网站域名</label>
        <input class="form-input" type="text" value="${s.domain}" disabled style="background:#fafafa;color:var(--text-sub);"/>
      </div>
      <div class="form-group">
        <label class="form-label">网站简称</label>
        <input class="form-input" type="text" value="${s.name}"/>
        <div class="form-hint">设置网站简称用于系统内部展示</div>
      </div>` : ''}
    ${sub==='engine' ? `
      <p class="form-hint" style="margin-bottom:12px;">设置搜索引擎类型，系统会按照设置的搜索引擎信息进行关键词排名数据的抓取</p>
      <div class="engine-row">
        <span class="engine-name">Google</span>
        <span class="engine-meta">PC端 · 美国 · 英语 · 常规搜索 · www.google.com</span>
        <div class="engine-ops"><button class="btn-link">编辑</button></div>
      </div>
      <div class="engine-row">
        <span class="engine-name">Yandex</span>
        <span class="engine-meta">PC端 · 美国 · 英语 · 图片</span>
        <div class="engine-ops"><button class="btn-link">编辑</button><button class="btn-link" style="color:var(--red);">删除</button></div>
      </div>
      <div class="engine-row">
        <span class="engine-name">Bing</span>
        <span class="engine-meta">手机端 · 美国 · 英语 · 常规搜索</span>
        <div class="engine-ops"><button class="btn-link">编辑</button><button class="btn-link" style="color:var(--red);">删除</button></div>
      </div>
      <button class="btn-default" style="margin-top:10px;">+ 添加搜索引擎</button>
      <div style="font-size:12px;color:var(--text-sub);margin-top:6px;">已配置 3 / 10 个搜索引擎</div>` : ''}
    ${sub==='crawl' ? `
      <p class="form-hint" style="margin-bottom:12px;">设置网站关键词在搜索引擎中排名情况的抓取规则</p>
      <div class="form-group">
        <label class="form-label">检索深度（1-10页）</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <input class="form-input" type="number" value="1" min="1" max="10" style="width:80px;"/>
          <span style="font-size:13px;color:var(--text-sub);">页 · 当前关键词数：${s.kws}</span>
        </div>
        <div class="form-hint">页面数越大，消耗的点数越多</div>
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:8px;">
          定期抓取
          <input type="checkbox" id="crawlSwitch"/>
        </label>
        <div style="font-size:13px;color:var(--text-sub);">每 <input type="number" value="3" min="1" max="14" style="width:50px;height:28px;border:1px solid var(--border);border-radius:4px;padding:0 6px;text-align:center;"/> 天自动抓取一次</div>
        <div class="form-hint">系统会按照设置频率，定期抓取所有关键词排名数据</div>
      </div>` : ''}
    ${sub==='auth' ? `
      <p class="form-hint" style="margin-bottom:16px;">为当前网站配置数据与发布相关授权。</p>

      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">独立站</div>
        ${(()=>{
          const existing = DB.siteAuths.find(a => a.geSiteId === s.id);
          if (existing) {
            return `
            <div style="border:1px solid var(--green);border-radius:8px;padding:14px;background:#f0fdf4;">
              <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;">
                <img src="${LEADONG_INDEPENDENT_SITE_LOGO}" alt="领动" width="120" height="40" style="height:40px;width:auto;max-width:140px;object-fit:contain;flex-shrink:0;border-radius:6px;background:#fff;"/>
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                    <span style="font-size:13px;font-weight:700;">${escapeHtmlStr(existing.type || '独立站')}</span>
                    <span class="badge badge-green">已授权</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-3);margin-bottom:8px;">绑定于 ${escapeHtmlStr(existing.addedAt)}</div>
                  <div style="font-size:12px;color:var(--text-2);">状态：<span style="color:var(--green);font-weight:600;">● 有效</span></div>
                  <div style="font-size:11px;color:var(--text-3);margin-top:8px;line-height:1.5;">独立站若更新域名，增长引擎将同步更新<strong>本站点的录入域名</strong>。</div>
                </div>
              </div>
              <div style="margin-top:10px;display:flex;gap:8px;">
                <button class="btn-default" style="height:28px;font-size:12px;" onclick="toast('连接测试成功！Token 有效')">测试连接</button>
                <button class="btn-link" style="color:var(--red);font-size:12px;" onclick="demoUnbindLeadongFromSettings(${existing.id})">解除授权</button>
              </div>
            </div>`;
          } else {
            return `
            <div class="auth-bind-tip auth-bind-tip--section">
              <span class="auth-bind-tip__icon" aria-hidden="true">ⓘ</span>
              <span>完成独立站授权后，可解锁更多能力（例如向站点<strong>发布文章</strong>、同步内容等）。</span>
            </div>
            <div class="auth-bind-card-only">
              <div class="auth-platform-card auth-platform-card--available auth-platform-card--solo">
                <div class="auth-platform-card__body">
                  <img class="auth-platform-card__brand" src="${LEADONG_INDEPENDENT_SITE_LOGO}" alt="" width="120" height="40"/>
                  <div class="auth-platform-card__info">
                    <div class="auth-platform-card__title">领动 SaaS</div>
                    <p class="auth-platform-card__desc">跳转领动 SaaS 完成 OAuth；将与所选网站的 ID 及域名建立绑定。</p>
                  </div>
                </div>
                <button type="button" class="btn-primary auth-platform-card__cta" onclick="openLeadongAuthPreModal()">前往授权</button>
              </div>
            </div>`;
          }
        })()}
      </div>
      <div style="margin-top:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">搜索引擎</div>
        ${(() => {
          if (s.gscAuthorized) {
            return `
            <div style="border:1px solid var(--green);border-radius:8px;padding:14px;background:#f0fdf4;">
              <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;">
                <img src="${GOOGLE_SEARCH_CONSOLE_LOGO}" alt="Google Search Console" width="120" height="40" style="height:40px;width:auto;max-width:140px;object-fit:contain;flex-shrink:0;border-radius:6px;background:#fff;"/>
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                    <span style="font-size:13px;font-weight:700;">Google Search Console</span>
                    <span class="badge badge-green">已授权</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-2);">可在相关功能模块查看与本域名一致的自然搜索数据。</div>
                </div>
              </div>
              <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn-link" style="color:var(--red);font-size:12px;" onclick="demoRevokeGSCFromSettings()">解除授权</button>
              </div>
            </div>`;
          }
          return `
            <div class="auth-bind-tip auth-bind-tip--section">
              <span class="auth-bind-tip__icon" aria-hidden="true">ⓘ</span>
              <span>完成搜索引擎授权后，可获取更多搜索引擎的数据，进行更全面的数据分析与展示。</span>
            </div>
            <div class="auth-bind-card-only">
              <div class="auth-platform-card auth-platform-card--available auth-platform-card--solo">
                <div class="auth-platform-card__body">
                  <img class="auth-platform-card__brand" src="${GOOGLE_SEARCH_CONSOLE_LOGO}" alt="" width="120" height="40" style="object-fit:contain;"/>
                  <div class="auth-platform-card__info">
                    <div class="auth-platform-card__title">Google Search Console</div>
                    <p class="auth-platform-card__desc">授权当前站点后，可在相关功能模块查看与本域名一致的自然搜索数据。</p>
                  </div>
                </div>
                <button type="button" class="btn-primary auth-platform-card__cta" onclick="demoAuthorizeGSCFromSettings()">前往授权</button>
              </div>
            </div>`;
        })()}
      </div>` : ''}
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>取消</button>
    <button class="btn-primary" onclick="toast('保存成功');closeModal();">保存</button>
  </div>`;
}

function bindSiteSettingsTabs() {
  $('modalBox').querySelectorAll('[data-sub]').forEach(btn => {
    btn.onclick = () => { state.settingsSub = btn.dataset.sub; $('modalBox').innerHTML = modalSiteSettings(); bindSiteSettingsTabs(); };
  });
  $('modalBox').querySelectorAll('[data-close]').forEach(el => el.onclick = closeModal);
  const leadSel = $('modalBox').querySelector('#leadongSiteSelect');
  if (leadSel) {
    leadSel.onchange = () => { state.leadongAuthPick = leadSel.value; };
  }
}

function modalKwBestPages() {
  const kw = DB.keywords.find(x => x.id === state.kwBestPagesKwId);
  const pages = (kw && DB.kwRankedPages[kw.id]) ? DB.kwRankedPages[kw.id] : [];
  const rows = pages.length
    ? pages.map(p => `
      <tr>
        <td style="font-size:13px;"><span class="td-link">${httpsLockPrefixHTML()}${escapeHtmlStr(p.path)}</span></td>
        <td style="white-space:nowrap;"><span class="badge badge-rank1">${p.rank}</span></td>
      </tr>`).join('')
    : `<tr><td colspan="2" style="text-align:center;color:var(--text-3);padding:24px;">暂无网页排名数据</td></tr>`;

  return `
  <div class="modal-header">
    <span class="modal-title">关键词排名网页</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body">
    ${kw ? `<p style="font-size:13px;color:var(--text-2);margin:0 0 14px;">关键词：<strong>${kw.kw}</strong></p>` : ''}
    <p style="font-size:12px;color:var(--text-3);margin:0 0 14px;">以下为该关键词下各落地页及对应排名。</p>
    <table class="data-table">
      <thead><tr><th>网页</th><th>排名</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>关闭</button>
  </div>`;
}

/* 变更记录：常规 / 点数分两入口；弹窗内仅对应一类流水，支持按自然日区间筛选 */
function modalUsageLog() {
  let type = state.usageLogType === 'general' ? 'general' : 'crawl';
  if (state.usageLogType === 'all' || state.usageLogType === 'ai') type = 'crawl';
  const fromDay = (state.usageLogDateFrom || '').trim();
  const toDay = (state.usageLogDateTo || '').trim();

  const generalLogs = [
    { date:'2025-09-05 09:18:22', resType:'常规资源', kind:'消耗', item:'添加网站', change:'-1 网站名额', balance:'2/3', op:'张三' },
    { date:'2025-09-01 10:00:00', resType:'常规资源', kind:'充值', item:'套餐开通', change:'+100 网站名额', balance:'100/100', op:'系统' },
    { date:'2025-09-01 10:00:03', resType:'常规资源', kind:'充值', item:'套餐开通', change:'+500 关键词名额', balance:'500/500', op:'系统' },
  ];
  const crawlLogs = [
    { date:'2025-09-27 10:15:33', resType:'点数', kind:'消耗', item:'页面整合优化 · /products.html · Title 优化', change:'-20 点', balance:'1477', op:'张三' },
    { date:'2025-09-27 09:02:18', resType:'点数', kind:'消耗', item:'页面整合优化 · /blog/construction-hardware-trends.html · 结构化数据', change:'-30 点', balance:'1497', op:'张三' },
    { date:'2025-09-26 14:22:01', resType:'点数', kind:'消耗', item:'AI文章生成 · 《How to Build a Professional Foreign Trade Website in 2025》', change:'-500 点', balance:'1527', op:'张三' },
    { date:'2025-09-26 11:05:44', resType:'点数', kind:'消耗', item:'AI文章生成 · 《网站SEO优化完整指南：从关键词到外链建设》', change:'-500 点', balance:'1997', op:'李四' },
    { date:'2025-09-25 23:59:01', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-3 点', balance:'2497', op:'系统' },
    { date:'2025-09-25 23:42:18', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-5 点', balance:'2500', op:'系统' },
    { date:'2025-09-25 22:10:55', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-12 点', balance:'2505', op:'系统' },
    { date:'2025-09-25 18:03:40', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-100 点', balance:'2517', op:'系统' },
    { date:'2025-09-22 16:28:09', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-40 点', balance:'2617', op:'系统' },
    { date:'2025-09-22 11:05:33', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-45 点', balance:'2657', op:'系统' },
    { date:'2025-09-15 08:00:00', resType:'点数', kind:'消耗', item:'关键词排名抓取 · www.leadong.com', change:'-200 点', balance:'2702', op:'系统' },
    { date:'2025-09-10 14:22:01', resType:'点数', kind:'充值', item:'点数充值', change:'+100 点', balance:'2902', op:'管理员' },
    { date:'2025-09-01 09:30:00', resType:'点数', kind:'充值', item:'套餐开通', change:'+5000 点', balance:'5000', op:'系统' },
  ];

  const dayKey = d => (d && d.length >= 10 ? d.slice(0, 10) : d);
  const merged = (type === 'general' ? generalLogs : crawlLogs).slice().sort((a, b) => b.date.localeCompare(a.date));
  const filtered = merged.filter(l => {
    const dk = dayKey(l.date);
    if (fromDay && dk < fromDay) return false;
    if (toDay && dk > toDay) return false;
    return true;
  });

  const rows = filtered.map(l => `
  <tr>
    <td class="usage-log-col-date" title="${escapeAttr(l.date)}">${escapeHtmlStr(l.date)}</td>
    <td style="font-size:12px;color:var(--text-2);">${l.resType || '—'}</td>
    <td><span class="badge ${l.kind==='充值'?'badge-green':'badge-gray'}">${l.kind}</span></td>
    <td class="usage-log-item-cell" title="${escapeAttr(l.item)}">${escapeHtmlStr(l.item)}</td>
    <td style="font-size:13px;font-weight:600;color:${l.kind==='充值'?'var(--green)':'var(--text-1)'};">${escapeHtmlStr(l.change)}</td>
    <td style="font-size:12px;color:var(--text-2);">${escapeHtmlStr(l.balance)}</td>
    <td style="font-size:12px;color:var(--text-3);">${escapeHtmlStr(l.op)}</td>
  </tr>`).join('');

  const title = type === 'general' ? '常规资源变更记录' : '点数变更记录';
  const fromVal = escapeAttr(fromDay);
  const toVal = escapeAttr(toDay);

  return `
  <div class="modal-header">
    <span class="modal-title">${title}</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body modal-usage-log-body">
    <div class="usage-log-toolbar">
      <label class="usage-log-filter-label usage-log-date-range">
        <span class="usage-log-date-range-label">日期</span>
        <input type="date" class="usage-log-filter-select usage-log-date-input" value="${fromVal}"
          onchange="state.usageLogDateFrom=this.value||'';renderModal();"/>
        <span class="usage-log-date-sep">至</span>
        <input type="date" class="usage-log-filter-select usage-log-date-input" value="${toVal}"
          onchange="state.usageLogDateTo=this.value||'';renderModal();"/>
      </label>
      <select class="usage-log-filter-select">
        <option>变动类型 · 全部</option><option>充值</option><option>消耗</option>
      </select>
    </div>
    <div class="usage-log-table-scroll usage-log-table-scroll--wide">
      <table class="data-table usage-log-data-table usage-log-data-table--split">
        <thead><tr>
          <th>日期时间</th><th>资源类型</th><th>变动类型</th><th>事项</th><th>变动</th><th>余量</th><th>操作人</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="usage-log-summary">共 ${filtered.length} 条记录</div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>关闭</button>
  </div>`;
}

/* SERP preview */
function modalSerp() {
  return `
  <div class="modal-header"><span class="modal-title">SERP 预览 - "外贸建站"</span><button class="modal-close" data-close>×</button></div>
  <div class="modal-body">
    <div style="display:flex;gap:16px;margin-bottom:12px;font-size:12px;color:var(--text-sub);">
      <span>抓取日期：2025-09-30</span>
      <span>我的排名：<strong style="color:var(--blue);">2</strong></span>
      <span>有排名竞争对手：<strong>1</strong></span>
    </div>
    ${[
      { rank:1, url:'https://www.amazon.com/', title:'Amazon.com. Spend less. Smile more.' },
      { rank:2, url:'https://www.leadong.com/products.html', title:'外贸建站专家 – 领动', mine:true },
      { rank:3, url:'https://www.shopify.com/', title:'Shopify – Your ecommerce website platform' },
      { rank:4, url:'https://www.example.com/build-site', title:'专业外贸网站搭建', comp:true },
      { rank:5, url:'https://nothingbutleds.com/', title:'Website Builder – nothingbutleds.com' },
    ].map(r=>`
    <div style="padding:10px 12px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:10px;${r.mine?'background:#f0f8ff;':''}${r.comp?'background:#fff8f0;':''}">
      <span style="width:20px;text-align:center;font-size:13px;font-weight:700;color:${r.mine?'var(--blue)':r.comp?'var(--red)':'var(--text-sub)'};">${r.rank}</span>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:500;color:var(--blue);">${r.title}</div>
        <div style="font-size:11px;color:var(--text-light);">${r.url}</div>
      </div>
      ${r.mine ? `<span class="badge badge-blue">我</span>` : ''}
      ${r.comp ? `<span class="badge badge-red">竞争对手</span>` : ''}
      ${!r.mine&&!r.comp ? `<button class="btn-link" style="font-size:11px;" onclick="openModal('add-comp')">+ 添加竞争对手</button>` : ''}
    </div>`).join('')}
  </div>`;
}

/* ────────────────────────────────────────────────────────────
   Keyword detail drawer
   ──────────────────────────────────────────────────────────── */
function openDrawer(kwId) {
  state.onPageSeoDrawerIndex = null;
  state.onPageSeoDrawerTab = 'diagnose';
  state.drawer = kwId;
  state.drawerTab = 'rank';
  renderDrawer();
  $('drawerOverlay').style.display = 'block';
}
function closeDrawer() {
  state.drawer = null;
  state.onPageSeoDrawerIndex = null;
  state.onPageSeoDrawerTab = 'diagnose';
  onPageCloseKwDd();
  onPageCloseTabsMore();
  $('drawerOverlay').style.display = 'none';
}
$('drawerOverlay').addEventListener('click', e => {
  if (e.target === $('drawerOverlay')) closeDrawer();
});

function renderDrawer() {
  const drawerEl = $('drawer');
  if (!drawerEl) return;
  if (state.onPageSeoDrawerIndex != null) {
    const row = DB.onPageSeoPages[state.onPageSeoDrawerIndex];
    if (row) {
      drawerEl.classList.add('drawer--onpage');
      drawerEl.innerHTML = onPageSeoDrawerHTML(row);
      bindOnPageDrawerHints(drawerEl);
      bindAiRecPreviewInteractions(drawerEl);
      return;
    }
  }
  drawerEl.classList.remove('drawer--onpage');
  const kw = DB.keywords.find(k => k.id === state.drawer);
  if (!kw) return;
  drawerEl.innerHTML = `
  <div class="drawer-header">
    <div>
      <div class="drawer-title">${kw.kw}</div>
      <div style="font-size:12px;color:var(--text-sub);margin-top:2px;">最后更新：${kw.updated} &nbsp;·&nbsp; 历史最佳排名：<strong>${kw.best}</strong></div>
    </div>
    <button class="modal-close" onclick="closeDrawer()">×</button>
  </div>
  <div class="drawer-tabs">
    <button class="drawer-tab ${state.drawerTab==='rank'?'active':''}" onclick="state.drawerTab='rank';renderDrawer();">排名</button>
    <button class="drawer-tab ${state.drawerTab==='competitor'?'active':''}" onclick="state.drawerTab='competitor';renderDrawer();">竞争对手</button>
    <button class="drawer-tab ${state.drawerTab==='page'?'active':''}" onclick="state.drawerTab='page';renderDrawer();">页面</button>
  </div>
  <div class="drawer-body">
    ${drawerTabContent(kw)}
  </div>`;
}

function drawerTabContent(kw) {
  if (state.drawerTab === 'rank') {
    return `
    <div style="margin-bottom:12px;display:flex;gap:8px;align-items:center;">
      <select style="height:30px;border:1px solid var(--border);border-radius:4px;padding:0 8px;font-size:12px;">
        <option>Google · PC端 · 美国</option>
      </select>
      <input type="text" value="2025/09/01 – 2025/09/30" style="height:30px;border:1px solid var(--border);border-radius:4px;padding:0 8px;font-size:12px;width:180px;"/>
    </div>
    <table class="data-table">
      <thead><tr><th>抓取日期</th><th>排名</th><th>SERP</th><th>排名最佳网页</th></tr></thead>
      <tbody>
        <tr><td>2025-09-30</td><td><span class="badge badge-rank1">2</span></td><td><button class="btn-link" onclick="openModal('serp')">查看</button></td><td><a class="td-link">/products.html</a></td></tr>
        <tr><td>2025-09-27</td><td>5</td><td><button class="btn-link">查看</button></td><td><a class="td-link">/products.html</a></td></tr>
        <tr><td>2025-09-24</td><td>8</td><td><button class="btn-link">查看</button></td><td><a class="td-link">/index.html</a></td></tr>
        <tr><td>2025-09-21</td><td>12</td><td><button class="btn-link">查看</button></td><td><a class="td-link">/products.html</a></td></tr>
        <tr><td>2025-09-18</td><td>6</td><td><button class="btn-link">查看</button></td><td><a class="td-link">/products.html</a></td></tr>
      </tbody>
    </table>`;
  }
  if (state.drawerTab === 'competitor') {
    return `
    <table class="data-table">
      <thead><tr><th>抓取日期</th><th>有排名竞争对手数</th><th>${site().name}（我）</th>${DB.competitors.map(c=>`<th>${c.name}</th>`).join('')}</tr></thead>
      <tbody>
        <tr><td>2025-09-30</td><td>1</td><td><span class="badge badge-rank1">2</span></td><td>5</td><td>—</td></tr>
        <tr><td>2025-09-27</td><td>2</td><td>5</td><td>3</td><td>11</td></tr>
        <tr><td>2025-09-24</td><td>2</td><td>8</td><td>4</td><td>15</td></tr>
      </tbody>
    </table>`;
  }
  // page tab
  return `
  <table class="data-table">
    <thead><tr><th>页面URL</th><th>排名</th><th>本排名日期</th><th>首次排名日期</th></tr></thead>
    <tbody>
      <tr><td><a class="td-link">/products.html</a></td><td><span class="badge badge-rank1">2</span></td><td>2025-09-30</td><td>2025-01-15</td></tr>
      <tr><td><a class="td-link">/index.html</a></td><td>8</td><td>2025-09-24</td><td>2025-03-01</td></tr>
    </tbody>
  </table>`;
}

/* ── Navigation helpers ── */
function goMyKeywords() { state.primary='search';state.secondary='kw-mgmt';state.tab='my-keywords';render(); }
function goCompetitor()  { state.primary='search';state.secondary='competitor';state.compTab='competitors';render(); }

function logicHelpColLabelsText(ids, labelsMap) {
  return ids.map(id => labelsMap[id] || id).join('、');
}

function logicHelpOnPageSortableColsText() {
  return logicHelpColLabelsText([...ONPAGE_SEO_SORTABLE], ONPAGE_SEO_COL_LABELS);
}

function logicHelpOnPageConfigurableColsText() {
  return logicHelpColLabelsText(ONPAGE_SEO_COL_IDS, ONPAGE_SEO_COL_LABELS);
}

function logicHelpOnPagePageTypesText() {
  return ONPAGE_PAGE_TYPES.map(t => t.label).join('、');
}

function logicHelpPageRankSortableColsText() {
  return logicHelpColLabelsText([...PAGE_RANK_LIST_SORTABLE], PAGE_RANK_LIST_COL_LABELS);
}

function logicHelpPageRankConfigurableColsText() {
  return logicHelpColLabelsText(PAGE_RANK_LIST_COL_IDS, PAGE_RANK_LIST_COL_LABELS);
}

/** 功能逻辑说明 · 功能权限段落（产品表述，不含研发字段名） */
function logicHelpPermHTML(requirements) {
  const lines = Array.isArray(requirements) ? requirements : [requirements];
  const items = lines.map(t => `<li>${t}</li>`).join('');
  return `<p class="logic-help-p"><strong>功能权限</strong></p><ul class="logic-help-ul">${items}</ul>`;
}

function logicHelpPointsConsumeListHTML() {
  return `<ul class="logic-help-ul">
        <li><strong>页面整合优化 › AI 测评</strong>（开始 / 重新检测）：18 点/ 次（待定）</li>
        <li><strong>页面整合优化 › AI 推荐</strong>（关键词、TDK、结构化数据等字段 AI 推荐）：按场景计费（待定）</li>
      </ul>`;
}

function logicHelpDashboardOverviewHTML() {
  const spec = logicHelpOnPageDiagSpecRef();
  const infraHint = SITE_INFRA_MODULE_A_HINT;
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>仪表盘 › 网站概览（按顶栏当前站点展示；切换站点后整页数据同步切换）。</p>
      <p class="logic-help-p logic-help-p--note"><strong>导航调整说明</strong>：原「网站总览」已改名为「网站列表」，并移至侧栏「全部站点」下级；本「网站概览」为用户登录后的默认着陆页。</p>
      ${logicHelpPermHTML('本页整体：无额外功能权限要求（登录后可访问）。各子板块权限见下。')}
      <p class="logic-help-p"><strong>一、网站健康度（站点基建）</strong></p>
      ${logicHelpPermHTML('须当前账号已开通「页面整合优化」功能；未开通时本板块不展示。')}
      <ul class="logic-help-ul">
        <li><strong>检测范围</strong>：仅三项站点级基础设施——Robots.txt 协议、Sitemap 站点地图、HTTPS 安全（仅检测网站首页/根路径的 HTTPS 与证书，非逐页扫描）。（站点基建判定口径与单页规则评分细则${spec}）</li>
        <li><strong>列表行</strong>：状态徽章仅展示「通过」「建议」「严重」之一；检测项名称固定三项；摘要一行为折叠态结论。</li>
        <li><strong>展开详情</strong>：按规范表${spec}所列场景，在详情区展示「当前问题」「优化建议」两列对应正文。</li>
        <li><strong>自动检测</strong>：本期<strong>不</strong>按固定周期自动重检；<strong>首次添加网站</strong>成功后立即执行<strong>一次</strong>站点基建检测。</li>
        <li><strong>重新检测</strong>：用户手动点击「重新检测」并经二次确认后触发；检测过程中展示「检测中」状态、占位骨架与提示文案，期间禁用重复点击；完成后更新各项状态与「上次检测」时间；不触发单页整合优化扫描。</li>
        <li><strong>板块说明</strong>：标题旁「?」悬停展示以下文案：${infraHint}</li>
        <li><strong>引导</strong>：底部链至「页面整合优化」，处理单页规则项。</li>
      </ul>
      <p class="logic-help-p"><strong>二、新页面提醒</strong></p>
      ${logicHelpPermHTML('须当前账号已开通「页面整合优化」功能；未开通时本板块不展示。')}
      <ul class="logic-help-ul">
        <li><strong>新页面定义</strong>：对比<strong>上一次站点基建检测</strong>时解析到的站点地图 URL 集合，本次检测中<strong>新增</strong>且尚未纳入「页面整合优化」页面库的地址计为新页面。</li>
        <li><strong>展示条件</strong>：须已完成<strong>至少两次</strong>站点基建检测（首次检测仅建立站点地图基线，<strong>不展示</strong>本板块，避免将整站 URL 误判为新页面）；且存在至少 1 个新页面时展示；无新页面时<strong>整板块隐藏</strong>（不占位）。</li>
        <li><strong>自动隐藏</strong>：执行<strong>站点基建「重新检测」</strong>后，以最新一次站点地图对比结果<strong>整体覆盖</strong>提醒列表。</li>
        <li><strong>列表</strong>：最多列出 10 条；每条为标题 → 路径 → 右侧发现时间（自然日）。列表区域<strong>固定高度</strong>（约可见 2 条），超出部分在板块内<strong>纵向滚动</strong>查看。</li>
        <li><strong>操作</strong>：「前往页面整合优化」跳转至搜索 › 页面整合优化列表，不自动打开单页抽屉。</li>
      </ul>
      <p class="logic-help-p"><strong>三、最近抓取（关键词概览 / 页面概览）</strong></p>
      ${logicHelpPermHTML(['须当前账号已开通「关键词管理」与「关键词排名抓取」功能；缺一未开通则本板块不展示。'])}
      <ul class="logic-help-ul">
        <li><strong>板块定位</strong>：展示当前站点、当前所选搜索引擎下，<strong>最近一次排名抓取任务</strong>完成后的汇总与明细入口；顶部可切换搜索引擎、点击「更新排名」发起抓取，并显示「最近更新」时间。</li>
        <li><strong>数据量</strong>：仪表盘内表格<strong>不展示全部</strong>监控词/曝光页，默认最多展示前 10 条并注明总数；完整数据须前往「搜索 › 我的关键词」或「搜索 › 曝光页面」。</li>
        <li><strong>关键词概览</strong>：展示本站点「我的关键词」中、与当前筛选搜索引擎相关的监控词（表格列：关键词、最新排名、排名最佳网页）。统计卡片与「我的关键词」在同一抓取周期、同一引擎口径下汇总。</li>
        <li><strong>页面概览</strong>：展示本站点在「曝光页面」规则下、该引擎内有排名曝光的落地页（表格列：页面、有排名关键词数、最佳关键词、最佳排名；页面列已含标题与路径，不再单独展示「排名最佳网页」列）。有排名关键词数可点击打开「有排名关键词」明细弹窗。统计卡片与曝光页列表同源。</li>
      </ul>`;
}

function logicHelpRankedKwModalHTML() {
  return `
      <p class="logic-help-p"><strong>四、「有排名关键词」弹窗</strong></p>
      <ul class="logic-help-ul">
        <li><strong>入口</strong>：列表或仪表盘「页面概览」中点击「有排名关键词数」打开；标题为「有排名关键词 · {页面路径}」。</li>
        <li><strong>数据范围</strong>：与列表「有排名关键词数」一致——按各监控词在<strong>所选日期范围内、该词最后一次成功抓取</strong>的结果，筛选该页仍有排名的词（按词去重列出）。</li>
        <li><strong>列表列</strong>：关键词、最新排名、排名时间（与表头悬停说明一致）。</li>
        <li><strong>最新排名</strong>：即该词<strong>最后一次成功抓取</strong>的自然搜索名次（正整数，1 为最好）。</li>
        <li><strong>排名时间</strong>：取得该「最新排名」的抓取完成时间（自然日 + 时分秒）；若同一词存在多条相同名次记录，取<strong>时间最近</strong>的一次。</li>
        <li><strong>排序</strong>：表头「关键词」「最新排名」「排名时间」可点击切换升/降序；首次打开默认按关键词升序。不同搜索引擎下的同名关键词分别展示。</li>
      </ul>`;
}

function logicHelpPageRankListHTML() {
  const sortCols = logicHelpPageRankSortableColsText();
  const cfgCols = logicHelpPageRankConfigurableColsText();
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>搜索 › 曝光页面（与顶栏当前站点、所选搜索引擎、顶栏日期筛选联动）。</p>
      ${logicHelpPermHTML(['须当前账号已开通「关键词管理」与「关键词排名抓取」功能。'])}
      <p class="logic-help-p"><strong>一、数据概览</strong></p>
      <ul class="logic-help-ul">
        <li><strong>有排名页面</strong>（卡片主数字）：当前顶栏<strong>日期筛选</strong>与<strong>搜索引擎</strong>口径下，<strong>最后一次抓取任务</strong>完成时的有排名独立 URL 数量（该次任务中至少有一个监控词在该页获得排名）。<strong>趋势折线</strong>：横轴为所选日期范围内的抓取任务（一点一任务，按完成时间先后）；纵坐标为各次任务完成时的有排名页面数；<strong>最多展示最近 15 次</strong>任务，更早任务不绘制。</li>
        <li><strong>平均最佳排名</strong>（卡片主数字）：同上筛选条件下，<strong>最后一次抓取任务</strong>完成时，各有排名页面「最佳排名」的算术平均，数字越小越靠前。<strong>趋势折线</strong>：横轴与展示条数规则同上；纵坐标为各次任务完成时的平均最佳排名（注意纵坐标越往上数值越小，即排名靠前的点在上、排名靠后的点在下）。</li>
        <li><strong>趋势图</strong>：左右两图分别对应上述两指标。<strong>鼠标悬停</strong>数据点展示该次「抓取任务」完成日期（自然日）及当次指标值；折线最右侧一点与卡片主数字一致（均为最后一次任务结果，演示）。</li>
        <li><strong>显示切换</strong>：工具栏「眼睛」图标控制本数据概览区（含指标数字与趋势折线图）显示/隐藏，规则见下文。</li>
      </ul>
      <p class="logic-help-p"><strong>二、工具栏（从左到右）</strong></p>
      <ul class="logic-help-ul">
        <li><strong>搜索框</strong>：在路径、页面标题、最佳关键词中匹配；默认子串、不区分大小写；支持星号通配（规则同页面整合优化列表）。</li>
        <li><strong>搜索说明 ℹ</strong>：悬停说明通配用法。</li>
        <li><strong>眼睛图标</strong>（与「我的关键词」列表的展示/隐藏数据概览一致）：点击在「隐藏数据概览 / 展示数据概览」间切换；隐藏时收起上方指标卡片与趋势折线图，仅保留搜索与表格。</li>
        <li><strong>字段配置 ⋮</strong>（同「我的关键词」）：打开列配置面板；可勾选显示列、拖拽调整列顺序，保存后生效。可选列——${cfgCols}。「页面」列<strong>固定首列</strong>且不可排序；可取消勾选「显示页面标题」，此时仅隐藏标题、<strong>仍保留 URL</strong>，不隐藏整列。</li>
        <li><strong>导出 ↓</strong>（同「我的关键词」）：导出当前筛选结果下、按字段配置显示的列表数据。</li>
      </ul>
      <p class="logic-help-p"><strong>三、表格列取值</strong></p>
      <ul class="logic-help-ul">
        <li><strong>页面</strong>：默认展示标题 + 路径；字段配置中可关闭标题，仅保留路径。</li>
        <li><strong>有排名关键词数</strong>：在所选日期范围内，按<strong>每个监控词各自最后一次成功抓取</strong>的排名结果统计——看该次抓取中该页是否仍有排名后计数；<strong>不是</strong>取「最后一次抓取任务」里各词当次的排名（任务失败或最后一次任务未抓取该词时，不覆盖该词已有成功记录）。为可点击数字，点击打开「有排名关键词」弹窗（细则见第四节）。<br/><em>例</em>：范围 9 月 1–30 日。词 A 于 9 月 20 日单独抓取成功且在本页排名第 12；9 月 30 日抓取任务中该词抓取失败（或抓取任务不包含该词）。统计仍以该词在范围内的<strong>最后一次成功抓取</strong>（9 月 20 日、第 12 名）为准并计入；不因 9 月 30 日任务失败（或未抓取）而排除或记为无排名。</li>
        <li><strong>最佳关键词</strong>：在所选日期范围内，上述「有排名关键词」中<strong>排名最好（数字最小）</strong>的词；若多名次相同，按关键词字符顺序排序后取<strong>第一个</strong>。</li>
        <li><strong>最佳排名</strong>：上述「最佳关键词」对应的排名；正整数，1 为最好，与「最佳关键词」成对展示。</li>
        <li><strong>首次曝光 / 最后曝光</strong>：该页在统计周期内首次/末次仍保留排名的日期（自然日）。</li>
        <li><strong>默认排序</strong>：进入页面时默认按「有排名关键词数」<strong>降序</strong>（数量多的在前）。</li>
        <li><strong>表头排序</strong>：可排序列——${sortCols}。首次点「最佳排名」默认升序；首次点其它可排序列默认降序；再点同列反转。</li>
      </ul>
      ${logicHelpRankedKwModalHTML()}`;
}

function logicHelpPageSeoListHTML() {
  const sortCols = logicHelpOnPageSortableColsText();
  const cfgCols = logicHelpOnPageConfigurableColsText();
  const pageTypes = logicHelpOnPagePageTypesText();
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>搜索 › 页面整合优化（按顶栏当前站点展示页面库）。</p>
      ${logicHelpPermHTML('须当前账号已开通「页面整合优化」功能（本期新增权限，由服务商在「增长引擎」独立功能中勾选开通）。')}
      <p class="logic-help-p"><strong>一、工具栏（从左到右）</strong></p>
      <ul class="logic-help-ul">
        <li><strong>搜索</strong>：匹配标题、路径、目标词；子串不区分大小写；支持星号通配路径。</li>
        <li><strong>页面类型筛选</strong>：多选，选项为 ${pageTypes}。</li>
        <li><strong>HTTP 状态筛选</strong>：多选；选项为当前列表中出现过的状态码。</li>
        <li><strong>字段配置 ⋮</strong>（规则同「我的关键词」「曝光页面」）：打开列配置面板；可勾选显示列、拖拽调整列顺序，点击「保存」后生效。可选列——${cfgCols}。表格<strong>最左侧复选框列</strong>固定，不参与字段配置；「页面」列固定且不可隐藏；可取消「显示页面标题」时仅隐藏标题行、保留 URL。</li>
        <li><strong>导出 ↓</strong>（规则同「我的关键词」「曝光页面」）：导出<strong>当前列表筛选结果</strong>下、且按字段配置<strong>当前可见列</strong>组成的表格数据（通常为 CSV/Excel，以实际上线格式为准）；不包含抽屉内未展开的明细。演示原型为导出成功提示。</li>
      </ul>
      <p class="logic-help-p"><strong>二、列表数据与空态</strong></p>
      <ul class="logic-help-ul">
        <li><strong>页面来源（本期）</strong>：仅展示当前站点 <strong>sitemap.xml</strong> 中解析到的 URL；在「页面」列表头悬停 ℹ 可查看简要说明。（站点爬虫抓取、建站SaaS数据同步等渠道本期暂不纳入。）</li>
        <li><strong>未检测到 Sitemap</strong>：不展示表格，提示先配置/暴露 sitemap 并在站点基建中检测通过后刷新。</li>
        <li><strong>暂无页面</strong>：已检测到 Sitemap 但解析结果为空时展示空态说明。</li>
        <li><strong>分页</strong>：底部分页，默认每页 20 条，可选 50 / 100；搜索与筛选作用于<strong>全量结果</strong>后再分页；导出范围为当前筛选结果（非仅当前页）。</li>
        <li><strong>默认排序</strong>：未点击表头时，按当前站点 <strong>sitemap.xml</strong> 中 URL 的解析顺序展示（与地图内顺序一致）。点击可排序列表头后按所选列排序。</li>
        <li><strong>批量操作</strong>：表格首列为复选框；勾选至少 1 行后工具栏才出现「页面检测」与已选计数，对所选页面执行常规检测（演示为依次触发）。</li>
      </ul>
      <p class="logic-help-p"><strong>三、表格列取值</strong></p>
      <ul class="logic-help-ul">
        <li><strong>页面</strong>：Sitemap 中的 URL；标题为页面前台 Title（若有）；路径为站内路径（HTTPS 显示小锁）。列表头悬停说明 Sitemap 更新规则。</li>
        <li><strong>目标词</strong>：每页最多 <strong>10</strong> 个；列表最多展示 <strong>3</strong> 个<strong>关键词标签</strong>，超出显示「+N」。无词为「—」。点击标签、「+N」或「—」打开编辑弹窗。<strong>首次常规检测</strong>后若仍为空，按页面前台 Meta Keywords（逗号分隔）按顺序预填，最多 10 个。</li>
        <li><strong>页面类型</strong>：中文标签；未设置或已设置均可点击修改，规则见「六、页面类型规则」。</li>
        <li><strong>状态</strong>：该 URL 最近一次 HTTP 状态码徽章；入库或重检时更新。</li>
        <li><strong>索引</strong>：<strong>本期仅 Google</strong>，依赖 GSC 授权。已授权且账号正常显示 Google 是否已索引；未授权为「未配置」。按日对 Sitemap URL 批量查询（约 <strong>2000 次/天</strong>）。授权账号异常时<strong>整列暂停</strong>，表头警示并引导解封后重新授权。</li>
        <li><strong>页面得分</strong>：常规检测七维总分 0–100${logicHelpOnPageDiagSpecRef()}。展示最近一次结果；打开抽屉时自动检测当前页；可批量「页面检测」。</li>
        <li><strong>检测问题</strong>：常规检测「严重 / 建议」条数的<strong>色标数字</strong>（红/橙），与抽屉筛选一致。</li>
        <li><strong>排序</strong>：可排序列——${sortCols}。</li>
      </ul>
      <p class="logic-help-p"><strong>四、行交互</strong></p>
      <ul class="logic-help-ul">
        <li>点击行（复选框、目标词标签区域除外）打开抽屉，默认「常规检测」并触发该页检测。</li>
      </ul>
      <p class="logic-help-p"><strong>五、页面类型规则</strong></p>
      <ul class="logic-help-ul">
        <li>每页最多 1 项，选项：${pageTypes}；根路径强制「首页」且只读。</li>
      </ul>
      <p class="logic-help-p"><strong>六、抽屉默认页签</strong></p>
      <ul class="logic-help-ul">
        <li>展示：常规检测、AI 测评、关键词、TDK、结构化数据。</li>
        <li>本期隐藏：H 标题、图片、链接、社媒、语言与网址。</li>
      </ul>`;
}

function logicHelpPageSeoDrawerHeadHTML() {
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>页面整合优化 › 点击行 › 右侧抽屉顶部「页面详情」区域（各页签共用）。</p>
      ${logicHelpPermHTML('同「页面整合优化」功能权限。')}
      <p class="logic-help-p"><strong>一、字段说明</strong></p>
      <ul class="logic-help-ul">
        <li><strong>页面详情</strong>：固定标题，表示当前正在查看的单页。</li>
        <li><strong>主标题行</strong>：页面前台 Title；右侧为「页面类型」标签（可点击修改，规则见列表说明）。</li>
        <li><strong>完整 URL</strong>：当前站点域名 + 路径，HTTPS 显示小锁；点击新窗口打开。</li>
        <li><strong>目标词</strong>：与列表「目标词」字段同源；以标签展示，点击可打开编辑弹窗（与列表规则一致）；展示最多 3 个标签，保存上限 10 个。</li>
        <li><strong>AI 推荐（编辑目标词弹窗）</strong>：弹窗标题栏「AI 推荐」每次成功消耗 <strong>2 点</strong>；根据当前页主题生成可监控目标词候选，鼠标悬停信息按钮展示AI推荐的理由，用户点「应用」写入弹窗草稿（须再点保存落库）。余额不足中止；消耗记入点数变更记录。</li>
      </ul>
      <p class="logic-help-p"><strong>二、交互</strong></p>
      <ul class="logic-help-ul">
        <li>切换下方页签不改变顶栏字段；关闭抽屉后再次打开仍展示该页最新数据。</li>
      </ul>`;
}

function logicHelpPageSeoDiagHTML() {
  const spec = logicHelpOnPageDiagSpecRef();
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>页面整合优化 › 点击行 › 抽屉 › 常规检测。</p>
      ${logicHelpPermHTML('同「页面整合优化」功能权限。')}
      <p class="logic-help-p"><strong>一、检测范围</strong></p>
      <ul class="logic-help-ul">
        <li>七维可量化规则（标题、摘要、标题层级、正文、图片 Alt、URL、结构化数据等）；严重/建议/通过判定、检查项命名与量化区间${spec}。</li>
      </ul>
      <p class="logic-help-p"><strong>二、界面字段与规范表对应</strong>${spec}</p>
      <ul class="logic-help-ul">
        <li><strong>页面得分</strong>：七维子项得分之和（满分 100），对应规范表中各维度「满分」列汇总展示。</li>
        <li><strong>严重 / 建议 / 通过</strong>：按子检查项判定结果聚合计数；与列表「检测问题」列红/橙色标数字一致。</li>
        <li><strong>七维折叠块</strong>（Title / Meta / Headings / Body / Media / URL / Code）：块标题与规范表「维度」列一致；块内每一行对应表中「检测指标」列，展示子项得分、严重/建议/通过徽章、问题描述与优化建议。</li>
        <li>各子项说明文案以规范表「当前问题」「优化建议」列拼接展示；演示原型为示例句。</li>
        <li><strong>具体版式、折叠默认态、按钮位置以设计稿为准。</strong></li>
      </ul>
      <p class="logic-help-p"><strong>三、筛选条</strong></p>
      <ul class="logic-help-ul">
        <li>「严重 / 建议 / 通过」三个<strong>筛选标签</strong>，点击筛选下方问题列表；与列表「检测问题」列色标一致。</li>
      </ul>
      <p class="logic-help-p"><strong>四、检测触发与状态</strong></p>
      <ul class="logic-help-ul">
        <li><strong>打开抽屉</strong>：自动对当前页执行一次常规检测（若未在检测中）；检测中展示加载动画，期间不可重复触发。（技术可评估单页耗时与队列策略后，再确定具体自动更新的规则。）</li>
        <li><strong>重新检测</strong>：用户手动点击；完成后更新页面得分、问题条数、「最后测评」时间，并刷新列表行。</li>
      </ul>
      <p class="logic-help-p"><strong>五、标题行</strong></p>
      <ul class="logic-help-ul">
        <li>展示「最后测评」时间。</li>
      </ul>`;
}

function logicHelpPageSeoAiHTML() {
  const spec = logicHelpSpecDocRef();
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>页面整合优化 › 行抽屉 › AI 测评（结果关闭抽屉后仍保留，重新测评覆盖）。</p>
      ${logicHelpPermHTML('同「页面整合优化」功能权限。')}
      <p class="logic-help-p"><strong>一、职责边界</strong></p>
      <ul class="logic-help-ul">
        <li>评估：搜索意图、内容质量、主题覆盖、E-E-A-T、转化、内容缺口、增长机会等语义项。</li>
        <li>具体判定与输出格式<strong>以提示词为准</strong>${logicHelpSpecDocRef()}。</li>
      </ul>
      <p class="logic-help-p"><strong>二、触发与计费</strong></p>
      <ul class="logic-help-ul">
        <li>「开始 AI 测评 / 重新检测」：每次成功消耗 <strong>18 点（待定）</strong>；余额不足提示「点数不足」并中止。</li>
        <li>成功后默认打开「总览」子页签；消耗记入设置 › 点数变更记录，事项格式见该说明。</li>
      </ul>
      <p class="logic-help-p"><strong>三、子页签</strong>（无顶部说明段；各子页签展示与打分<strong>以提示词为准</strong>${logicHelpSpecDocRef()}）</p>
      <ul class="logic-help-ul">
        <li><strong>总览</strong>：综合分与档位、页面类型、搜索意图、意图匹配度、测评摘要。</li>
        <li><strong>维度评估</strong>：各语义维度得分与说明（与规则分无关）。</li>
        <li><strong>内容缺口</strong>：缺失实体、场景、FAQ 选题、信任信号等。</li>
        <li><strong>增长机会</strong>：按优先级列机会与可执行建议。</li>
        <li><strong>SEO 优化推荐</strong>：按模块折叠的生成资产；FAQ 仅展示推荐问答。</li>
      </ul>
      <p class="logic-help-p"><strong>四、应用</strong></p>
      <ul class="logic-help-ul">
        <li>仅「TDK」「结构化数据」模块提供「应用」：预填对应编辑弹窗，用户确认后保存。</li>
        <li>须已授权<strong>领动 SaaS 独立站</strong>方可写入（授权其他建站平台暂不确定支持写回）。未满足授权时弹窗只读。</li>
      </ul>
      <p class="logic-help-p logic-help-p--note">AI 提示词与打分细则${spec}。</p>`;
}

function logicHelpPageSeoKwHTML() {
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>页面整合优化 › 行抽屉 › 关键词（排名词 / GSC / 推荐）。</p>
      ${logicHelpPermHTML('同「页面整合优化」功能权限。')}
      <p class="logic-help-p"><strong>一、工具栏</strong></p>
      <ul class="logic-help-ul">
        <li>三个子页签：排名词、GSC、推荐；标签旁 ℹ 为字段说明浮层。</li>
        <li>右侧统计日期区间：影响 GSC 与排名数据的统计范围。</li>
      </ul>
      <p class="logic-help-p"><strong>二、GSC 授权</strong></p>
      <ul class="logic-help-ul">
        <li>未授权：GSC 子页签全屏空态，引导前往网站设置 › 授权管理。</li>
        <li>已授权：展示与该页相关的查询及曝光、点击、点击率、排名；解除授权后恢复空态。</li>
      </ul>
      <p class="logic-help-p"><strong>三、排名词</strong></p>
      <ul class="logic-help-ul">
        <li><strong>列表范围</strong>：展示「我的关键词」中、抓取后<strong>当前页 URL</strong>为有排名落地页的监控词；且在该词于<strong>所选日期区间内最后一次被成功抓取</strong>的记录里，该页仍有自然搜索排名（无排名或抓取失败的不展示）。按词去重，默认按排名数字升序。</li>
        <li>列：关键词、排名、搜索引擎、排名日期、密度、操作。</li>
        <li>密度：基于页面可解析文本的近似占比（计算逻辑同常规检测中的关键词密度）。</li>
        <li><strong>加入词库</strong>：将该词加入「我的关键词」；已在库中则按钮禁用并提示「已在词库」。</li>
        <li><strong>设为目标词</strong>：写入当前页目标词字段；若已满 10 个则按钮禁用，鼠标悬停按钮提示已满10个无法添加；已存在则按钮禁用并提示「已为目标词」。</li>
      </ul>
      <p class="logic-help-p"><strong>四、GSC</strong></p>
      <ul class="logic-help-ul">
        <li>须已授权 GSC；未授权时本子页签为空态引导授权。</li>
        <li>数据为所选日期区间内、<strong>与该页 URL 完全匹配</strong>的 Search Console 查询汇总（演示数据）。</li>
        <li>列：关键词、曝光、点击、CTR、平均排名、密度、操作（规则同排名词）。</li>
        <li>按曝光或点击降序展示；切换日期区间后重新拉取。</li>
      </ul>
      <p class="logic-help-p"><strong>五、推荐</strong></p>
      <ul class="logic-help-ul">
        <li>切换至「推荐」时清空上次结果；须点击「AI 推荐」加载表格。</li>
        <li>列：推荐关键词、意图、关键词类型、相关度、推荐理由、操作。</li>
      </ul>`;
}

function logicHelpPageSeoTdkHTML() {
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>页面整合优化 › 行抽屉 › TDK。</p>
      ${logicHelpPermHTML('同「页面整合优化」功能权限；保存还须领动 SaaS 独立站授权。')}
      <p class="logic-help-p"><strong>一、展示与编辑</strong></p>
      <ul class="logic-help-ul">
        <li><strong>打开抽屉</strong>时自动拉取页面前台 TDK（Title、Meta Description、Meta Keywords），与常规检测抓取口径一致。</li>
        <li>只读表展示上述三项；旁显示字数/建议上限（标题 60、摘要 160、关键词 100），超出仅警告不阻断保存。</li>
        <li>未授权领动 SaaS：编辑弹窗只读，保存禁用，可复制后至建站后台粘贴。</li>
        <li>已授权：保存后<strong>同步写入领动 SaaS 后台</strong>该页面对应 TDK 字段（自定义页、多数系统页、产品/文章详情与分类等支持；关键词聚合页等部分类型不支持编辑，弹窗只读或技术可提供可行方案）。</li>
        <li><strong>AI 推荐（编辑标题与摘要弹窗）</strong>：弹窗标题栏「AI 推荐」每次成功消耗 <strong>5 点</strong>；一次性生成标题、摘要、Meta Keywords 草稿，分别展示在对应输入框下方预览区，鼠标悬停信息按钮展示AI推荐的理由，用户可按字段「应用」后须再点「保存」。余额不足中止。</li>
      </ul>
      <p class="logic-help-p"><strong>二、AI 测评应用</strong></p>
      <ul class="logic-help-ul">
        <li>从 AI 测评「SEO 优化推荐」应用 TDK 时预填本弹窗，用户确认后须再点保存。</li>
      </ul>`;
}

function logicHelpPageSeoSchemaHTML() {
  const spec = logicHelpSpecDocRef();
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>页面整合优化 › 行抽屉 › 结构化数据。</p>
      ${logicHelpPermHTML('同「页面整合优化」功能权限；保存还须领动 SaaS 独立站授权。')}
      <p class="logic-help-p"><strong>一、数据拉取与子页签</strong></p>
      <ul class="logic-help-ul">
        <li><strong>打开抽屉</strong>时自动拉取页面前台全部 JSON-LD，与常规检测一致。</li>
        <li>子页签按页面实际出现的 Schema 类型动态展示，中文名称与类型白名单见${spec}（如机构信息、网站信息、博客文章、产品信息等）。</li>
        <li>检测到的类型不在白名单内时，归入<strong>「其他」</strong>子页签。</li>
        <li>各子页签下展示该类型的一个或多个 JSON 代码片段（同类型多段则分段展示）。</li>
      </ul>
      <p class="logic-help-p"><strong>二、统一编辑与保存</strong></p>
      <ul class="logic-help-ul">
        <li>「编辑本页全部」：在弹窗中<strong>统一编辑当前页所有结构化片段</strong>（非单条类型）；保存前须为合法 JSON。</li>
        <li><strong>AI 推荐（编辑本页结构化数据弹窗）</strong>：弹窗标题栏「AI 推荐」每次成功消耗 <strong>4 点</strong>；生成符合当前页类型的 JSON-LD 草稿填入编辑区，鼠标悬停信息按钮展示AI推荐的理由，用户确认后须再点「保存」。余额不足中止；未授权领动 SaaS 时只读不可保存。</li>
        <li>须已授权<strong>领动 SaaS 独立站</strong>；未授权只读。保存为<strong>同步逻辑</strong>：写入独立站后台存储，与增长引擎、前台须为同一套数据，非仅前台插件渲染时读取。</li>
        <li>领动 SaaS 目前仅部分页面类型支持后台单独编辑结构化数据；产品/文章/图册/视频等分类与详情等<strong>暂不支持</strong>（需技术方案）。不支持类型页面为只读。</li>
      </ul>
      <p class="logic-help-p"><strong>三、AI 测评应用</strong></p>
      <ul class="logic-help-ul">
        <li>从 AI 测评应用推荐时预填「编辑本页全部」弹窗，用户确认后保存。</li>
      </ul>`;
}

function logicHelpSettingsPackagePointsHTML() {
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>设置 › 套餐资源 › 资源 ›「变更记录」→ 点数流水弹窗。</p>
      <p class="logic-help-p"><strong>一、弹窗范围</strong></p>
      <ul class="logic-help-ul">
        <li>仅展示点数变动；列含日期时间、资源类型、变动类型、事项、变动、变动后余量、操作人。</li>
        <li>可按起止日期（自然日闭区间）筛选。</li>
      </ul>
      <p class="logic-help-p"><strong>二、新增消耗资源点数的功能（成功后入账）</strong></p>
      ${logicHelpPointsConsumeListHTML()}
      <p class="logic-help-p"><strong>三、事项文案格式（页面整合优化相关）</strong></p>
      <ul class="logic-help-ul">
        <li>格式：<strong>功能名称 · 页面 URL · 具体操作</strong>（本期具体操作为：AI测评 / 关键词推荐 / TDK推荐 / 结构化数据推荐）。示例：<em>页面整合优化 · /products.html · TDK推荐</em>；<em>页面整合优化 · /products.html · AI 测评</em>。</li>
        <li>余额不足时不执行、不入账。</li>
      </ul>`;
}

function logicHelpSettingsAuthGscHTML() {
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>设置 › 网站管理 › 站点「设置」› 授权管理（独立站 + 搜索引擎）。</p>
      ${logicHelpPermHTML('授权管理本身无单独售卖权限；下列能力受绑定状态影响。')}
      <p class="logic-help-p"><strong>一、领动 SaaS 独立站</strong></p>
      <ul class="logic-help-ul">
        <li><strong>授权后增加同步字段</strong>：用户在增长引擎内保存的<strong>页面 TDK、结构化数据</strong>可<strong>同步至领动独立站前台</strong>；未授权时仅可本地预览或复制，不能落库到站外。</li>
      </ul>
      <p class="logic-help-p"><strong>二、Google Search Console</strong></p>
      <ul class="logic-help-ul">
        <li><strong>授权流程</strong>：用户点击「前往授权」→ 跳转 Google 账号授权页 → 用户选择/确认与增长引擎当前站点域名一致的 Search Console 资源 → 返回后系统保存授权关系 → 界面展示「已授权」，并开始拉取/展示搜索数据。</li>
        <li><strong>未授权</strong>：列表「索引」为未配置；关键词抽屉「GSC」为全屏引导。</li>
        <li><strong>已授权</strong>：展示收录与各搜索引擎状态；可查看 GSC 查询、曝光等指标（域名须与 GSC 资源一致）。</li>
        <li><strong>解除授权</strong>：用户确认后解除与 Google Search Console 的绑定。历史已入库的搜索指标保留只读；或<strong>不再拉取</strong>新数据（以实际技术策略为准，看是否会存储GSC数据）；界面上依赖该授权的模块恢复「未授权」态——索引列显示未配置、搜索关键词子页签为空态引导。用户可再次授权以重新建立连接。</li>
      </ul>
      <p class="logic-help-p"><strong>三、二者关系</strong></p>
      <ul class="logic-help-ul">
        <li>独立站授权管「写回页面字段与同步建站」；GSC 授权管「搜索数据与收录相关读数」；可只开其一或同时开通。</li>
      </ul>`;
}

function logicHelpProviderFeatureEnableHTML() {
  return `
      <p class="logic-help-lead"><strong>入口</strong><br/>服务商系统 › 服务管理 › 独立功能 › 增长引擎 › 产品功能勾选。</p>
      <p class="logic-help-p"><strong>一、本期新增</strong></p>
      <ul class="logic-help-ul">
        <li>在「增长引擎」模块的<strong>产品功能</strong>列表中增加可勾选项：<strong>页面整合优化</strong>（与既有「关键词管理」「关键词排名抓取」「AI 文章」等并列）。</li>
        <li><strong>勾选</strong>：对客户对应站点开通「搜索 › 页面整合优化」入口及单页检测、AI 测评、TDK/结构化数据等能力。</li>
        <li><strong>未勾选</strong>：客户侧隐藏该入口，或进入后提示未开通（以服务商配置策略为准）。</li>
      </ul>`;
}

function getLogicHelpStandardFooter() {
  return '';
}

function isLogicDrawerScopeRoute() {
  return getCurrentLogicChangePageId() != null;
}

function getLogicHelpHTML() {
  const pageId = getCurrentLogicDrawerNavId();
  const wrap = inner => `<div class="logic-help-prose">${inner}</div>`;

  const byPage = {
    'dashboard-overview': logicHelpDashboardOverviewHTML,
    'search-page-rank-list': logicHelpPageRankListHTML,
    'search-page-seo': logicHelpPageSeoListHTML,
    'search-page-seo--drawer': logicHelpPageSeoDrawerHeadHTML,
    'search-page-seo--diag': logicHelpPageSeoDiagHTML,
    'search-page-seo--ai': logicHelpPageSeoAiHTML,
    'search-page-seo--kw': logicHelpPageSeoKwHTML,
    'search-page-seo--tdk': logicHelpPageSeoTdkHTML,
    'search-page-seo--schema': logicHelpPageSeoSchemaHTML,
    'settings-package-points': logicHelpSettingsPackagePointsHTML,
    'settings-auth-gsc': logicHelpSettingsAuthGscHTML,
    'provider-feature-enable': logicHelpProviderFeatureEnableHTML,
  };

  if (pageId && byPage[pageId]) return wrap(byPage[pageId]());
  return wrap('<p class="logic-help-p">请从左侧选择本期功能条目查看说明。</p>');
}

function modalArticleUrlRanks() {
  const aid = state.rankDetailArticleId;
  const art = DB.articles.find(a => a.id === aid);
  const detail = aid != null ? DB.urlRankDetails[aid] : null;
  const items = (detail && detail.items) ? detail.items : [];
  const H = URL_RANK_MODAL_TH_HINTS;
  const rows = items.length
    ? items.map(it => `
      <tr>
        <td style="font-size:13px;">${escapeHtmlStr(it.keyword)}</td>
        <td><span class="badge badge-rank1">${it.rank}</span></td>
        <td style="font-size:12px;color:var(--text-sub);white-space:nowrap;">${escapeHtmlStr(it.crawledAt)}</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="text-align:center;color:var(--text-3);padding:20px;">暂无排名数据</td></tr>`;

  const sub = art && art.url
    ? `<p class="url-rank-modal-url">${art.url}</p>`
    : '';

  return `
  <div class="modal-header">
    <span class="modal-title">URL 排名明细</span>
    <button class="modal-close" data-close>×</button>
  </div>
  <div class="modal-body url-rank-modal-body">
    ${art ? `<div class="url-rank-modal-head"><div class="url-rank-modal-title">${art.title}</div>${sub}</div>` : ''}
    <p class="url-rank-modal-intro">以下为该 URL 在各关键词下的排名与最近抓取时间（仅显示有排名的关键词）。</p>
    <div style="overflow-x:auto;">
      <table class="data-table" style="min-width:420px;">
        <thead><tr>
          <th title="${escapeAttr(H.kw)}">关键词</th>
          <th style="width:88px;" title="${escapeAttr(H.rank)}">最新排名</th>
          <th style="width:120px;" title="${escapeAttr(H.time)}">排名时间</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-default" data-close>关闭</button>
  </div>`;
}

function syncLogicDrawerBodyClass(active) {
  document.body.classList.toggle('logic-drawer-active', !!active);
}

function openLogicDrawer() {
  const ov = $('logicDrawerOverlay');
  const body = $('logicDrawerBody');
  const titleEl = $('logicDrawerTitle');
  if (!ov || !body) return;
  if (!state.logicDrawerTreeSelection) state.logicDrawerTreeSelection = getCurrentLogicChangePageId();
  if (titleEl) titleEl.textContent = '功能逻辑说明';
  logicDrawerApplySavedWidth();
  populateLogicDrawerSideNav();
  try {
    body.innerHTML = `<div class="logic-help-body">${getLogicHelpHTML()}</div>`;
  } catch (err) {
    console.error('[功能逻辑说明]', err);
    body.innerHTML = '<div class="logic-help-prose"><p class="logic-help-p">说明内容加载失败，请刷新页面后重试。</p></div>';
  }
  ov.style.display = 'block';
  ov.setAttribute('aria-hidden', 'false');
  syncLogicDrawerBodyClass(true);
  requestAnimationFrame(() => ov.classList.add('open'));
  bindLogicDrawer();
}

window.openLogicDrawer = openLogicDrawer;
window.closeLogicDrawer = closeLogicDrawer;

function closeLogicDrawer() {
  const ov = $('logicDrawerOverlay');
  if (!ov) return;
  ov.classList.remove('open');
  ov.setAttribute('aria-hidden', 'true');
  syncLogicDrawerBodyClass(false);
  setTimeout(() => {
    if (!ov.classList.contains('open')) ov.style.display = 'none';
  }, 300);
}

function bindLogicDrawer() {
  const ov = $('logicDrawerOverlay');
  if (!ov || ov.dataset.bound) return;
  ov.dataset.bound = '1';
  $('logicDrawerBackdrop').onclick = () => closeLogicDrawer();
  $('logicDrawerClose').onclick = () => closeLogicDrawer();
  const side = $('logicDrawerSide');
  if (side && !side.dataset.treeNavBound) {
    side.dataset.treeNavBound = '1';
    side.addEventListener('click', e => {
      const b = e.target.closest('.logic-drawer-tree-item[data-page-id]');
      if (!b) return;
      navigateLogicChangePage(b.getAttribute('data-page-id'));
      render();
      refreshLogicDrawerIfOpen();
    });
  }
  bindLogicDrawerResize();
}

function renderDevLogicBar() {
  const el = document.getElementById('devLogicBar');
  if (!el) return;
  el.innerHTML = `<button type="button" class="dev-logic-help-btn" id="devLogicHelpBtn" title="查看本期功能逻辑说明">功能逻辑说明</button>`;
  const btn = document.getElementById('devLogicHelpBtn');
  if (btn && !btn.dataset.logicBound) {
    btn.dataset.logicBound = '1';
    btn.addEventListener('click', () => openLogicDrawer());
  }
}

let _appRouteSnapshot = '';
function render() {
  if (state.primary === 'seo') {
    state.primary = 'dashboard';
    state.dashboardTab = 'overview';
  }
  enforceReleaseScopeRoute();
  if (state.primary !== 'search' || state.secondary !== 'page-seo') {
    state.onPageSeoDrawerIndex = null;
  }
  const routeSnap = `${state.primary}|${state.secondary}|${state.tab}|${state.writingTab}|${state.workbenchStep}|${state.settingsTab}|${state.settingsSub}|${state.seoView}|${state.dashboardTab}`;
  if (_appRouteSnapshot && routeSnap !== _appRouteSnapshot) {
    state.devInternalPage = null;
    state.logicDrawerTreeSelection = null;
  }
  _appRouteSnapshot = routeSnap;

  renderNav();
  renderDevLogicBar();
  renderTopbar();
  renderSecondaryNav();
  renderPageTabs();
  $('content').innerHTML = getPageHTML();
  if (state.primary === 'search' && state.secondary === 'page-seo') {
    requestAnimationFrame(() => bindOnPageDrawerHints($('content')));
  }
  installRankedKwCountLinkDelegate();
  if (state.primary === 'search' && state.secondary === 'page-rank-list') {
    requestAnimationFrame(() => {
      bindOnPageDrawerHints($('content'));
      if (typeof applyPageRankListFilters === 'function') applyPageRankListFilters();
    });
  }
  const appEl = $('app');
  if (appEl) {
    appEl.classList.toggle('app-mode-article-editor', isArticleEditorMode());
    appEl.classList.toggle('app--internal-reseller-demo', state.devInternalPage === 'reseller-order');
  }
  if (isArticleEditorMode()) requestAnimationFrame(() => initArticleEditor());
  if (state.primary === 'writing' && state.writingTab === 'history') {
    requestAnimationFrame(() => syncArticleListSelectAll());
  }
  bindLogicDrawer();
  refreshLogicDrawerIfOpen();
  requestAnimationFrame(() => {
    const ov = $('drawerOverlay');
    if (!ov) return;
    if (state.onPageSeoDrawerIndex != null && state.primary === 'search' && state.secondary === 'page-seo') {
      renderDrawer();
      ov.style.display = 'block';
    } else if (state.drawer != null) {
      renderDrawer();
      ov.style.display = 'block';
    } else {
      ov.style.display = 'none';
    }
  });
  if (!window._kwFieldDocClose) {
    window._kwFieldDocClose = true;
    document.addEventListener('click', ev => {
      let need = false;
      if (state.kwFieldConfigOpen) {
        state.kwFieldConfigOpen = false;
        need = true;
      }
      if (state.pageRankListFieldOpen) {
        state.pageRankListFieldOpen = false;
        need = true;
      }
      if (state.onPageSeoTagDdOpen || state.onPageSeoStatusDdOpen) {
        const t = ev.target;
        if (!t.closest || !t.closest('.onpage-seo-filter-dd')) {
          state.onPageSeoTagDdOpen = false;
          state.onPageSeoStatusDdOpen = false;
          need = true;
        }
      }
      if (need) render();
    });
  }
  if (!window._onPageDrawerUiClose) {
    window._onPageDrawerUiClose = true;
    document.addEventListener('click', e => {
      if (typeof onPageCloseKwDd === 'function') onPageCloseKwDd();
      /* 勿在点击「⋯」区域时收起，否则会与 <details> 展开同一 tick 冲突导致无法打开 */
      const inTabsMore = e.target && e.target.closest && e.target.closest('.drawer-tabs-more');
      if (!inTabsMore && typeof onPageCloseTabsMore === 'function') onPageCloseTabsMore();
    });
  }
}

installRankedKwCountLinkDelegate();
render();