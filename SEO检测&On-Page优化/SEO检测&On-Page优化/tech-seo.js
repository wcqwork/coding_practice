/* 技术 SEO 模块 — 由增长引擎主应用加载；依赖全局 state / render / toast / site / escapeHtmlStr */
(function () {
  const TECH_SEO_QUEUES = {
    tdk: {
      title: '缺少页面描述',
      sub: '将为您生成合适的摘要文案，确认后可一键写入建站系统。',
      thead: ['', '页面', '当前描述', '建议描述'],
      serp: true,
      rows: [
        { page: '羽绒服长款男款', path: '/products/down-coat-m', cur: '（空）', sug: '' },
        { page: '外贸建站服务指南', path: '/blog/b2b-site-guide', cur: '（空）', sug: '' },
        { page: '春季特惠专题', path: '/campaign/spring-sale', cur: '使用默认模板文案', sug: '' },
      ],
      aiFill(rows) {
        const t = [
          '加厚长款羽绒服，防风防水面料，多尺码可选。',
          '面向 B2B 外贸团队的建站与 SEO 实操清单。',
          '春季限时折扣，精选户外装备与服饰。',
        ];
        rows.forEach((r, i) => { r.sug = t[i] || '—'; });
      },
    },
    kw: {
      title: '缺少页面关键词',
      sub: '填写 meta keywords 有助于部分搜索引擎理解页面主题。',
      thead: ['', '页面', '当前', '建议关键词'],
      serp: false,
      rows: [
        { page: '羽绒服长款男款', path: '/products/down-coat-m', cur: '—', sug: '' },
        { page: '关于品牌', path: '/about', cur: '—', sug: '' },
      ],
      aiFill(rows) {
        rows[0].sug = '羽绒服, 男装, 户外';
        rows[1].sug = '品牌故事, 联系我们';
      },
    },
    '404': {
      title: '失效链接与跳转建议',
      thead: ['', '失效地址', '当前状态', '建议跳转至'],
      serp: false,
      rows: [
        { page: '/promo/2024-spring', path: '', cur: '404', sug: '' },
        { page: '/item/old-sku-8891', path: '', cur: '404', sug: '' },
      ],
      aiFill(rows) {
        rows[0].sug = '/campaign/spring-sale';
        rows[1].sug = '/collections/bestsellers';
      },
    },
    robots: {
      title: 'robots.txt',
      sub: '以下为当前线上文件与建议修改。写入需建站系统已连接并授权。',
      thead: ['', '片段说明', '当前', '建议'],
      serp: false,
      rows: [
        { page: 'Disallow /api/', cur: '（保持）', sug: '（保持）' },
        { page: '允许抓取商品目录', cur: '未单独声明', sug: '' },
      ],
      aiFill(rows) { rows[1].sug = 'Allow: /catalog/\nAllow: /products/'; },
    },
    sitemap: {
      title: '站点地图异常',
      thead: ['', 'URL', 'HTTP 状态', '说明'],
      serp: false,
      rows: [
        { page: '/legacy/old-page-1', cur: '404', sug: '建议从地图移除' },
        { page: '/tmp/preview', cur: '302', sug: '建议改为 200 或移除' },
      ],
      aiFill() {},
    },
    href: {
      title: '多语言指向待修复',
      thead: ['', '页面组', '问题', '涉及 URL'],
      serp: false,
      rows: [
        { page: '羽绒服商品', cur: '缺少 zh 返程', sug: '/zh/products/down-coat-m' },
        { page: '首页', cur: 'x-default 缺失', sug: '/ /en/ /zh/' },
      ],
      aiFill(rows) { rows.forEach(r => { r.sug += ''; }); },
    },
    schema: {
      title: '结构化数据待补全',
      thead: ['', '页面', '缺失字段', '建议'],
      serp: false,
      rows: [
        { page: '羽绒服长款', cur: 'availability', sug: 'InStock' },
        { page: '登山背包', cur: 'priceValidUntil', sug: '2026-12-31' },
      ],
      aiFill(rows) { rows.forEach(r => { r.sug = `${r.sug}`; }); },
    },
    img: {
      title: '图片过大或缺少说明文字',
      thead: ['', '图片', '体积 / 当前 alt', '建议'],
      serp: false,
      rows: [
        { page: '/cdn/img/hero-winter.jpg', cur: '820KB / 空', sug: '' },
      ],
      aiFill(rows) {
        rows[0].sug = 'WebP 约 210KB · alt: 雪山背景冬季户外横幅';
      },
    },
  };

  const SCHEMA_TABS = [
    {
      name: '商品',
      old: '{\n  "@type": "Product",\n  "name": "羽绒服长款男款"\n}',
      neu: '{\n  "@type": "Product",\n  "name": "羽绒服长款男款",\n  "offers": { "availability": "InStock" }\n}',
    },
    {
      name: '文章',
      old: '{\n  "@type": "BlogPosting",\n  "headline": "外贸建站指南"\n}',
      neu: '{\n  "@type": "BlogPosting",\n  "headline": "外贸建站指南",\n  "datePublished": "2026-04-01"\n}',
    },
  ];

  function queueSpec() {
    const k = state.seoQueueKey;
    return k ? TECH_SEO_QUEUES[k] : null;
  }

  function seoHintBars() {
    const bits = [];
    if (!state.seoSaasOn) {
      bits.push('<div class="seo-hint seo-hint--warn">尚未连接建站系统：无法自动写入页面，仍可查看问题并导出修改清单。</div>');
    }
    if (!state.seoGscOn) {
      bits.push('<div class="seo-hint seo-hint--warn">尚未连接 Google 搜索：无法同步搜索表现数据。</div>');
    }
    return bits.join('');
  }

  function seoConnToolbar() {
    const sa = state.seoSaasOn ? 'on' : 'off';
    const gs = state.seoGscOn ? 'on' : 'off';
    return `
    <div class="seo-toolbar">
      <span style="font-size:12px;color:var(--text-2);margin-right:4px;">连接状态</span>
      <button type="button" class="seo-conn ${sa}" onclick="seoToggleSaas()">建站系统 · ${state.seoSaasOn ? '已连接' : '未连接'}</button>
      <button type="button" class="seo-conn ${gs}" onclick="seoToggleGsc()">Google 搜索 · ${state.seoGscOn ? '已连接' : '未连接'}</button>
    </div>`;
  }

  function seoSubNav() {
    const v = state.seoView;
    const mk = (id, label) =>
      `<button type="button" class="${v === id ? 'active' : ''}" onclick="seoNav('${id}')">${label}</button>`;
    return `
    <div class="seo-subnav">
      ${mk('overview', '待办总览')}
      ${mk('audit', '站点扫描')}
      ${mk('onpage', '页面与摘要')}
      ${mk('i18n', '多语言')}
      ${mk('schema', '结构化数据')}
      ${mk('crawl', '抓取与索引')}
      ${mk('perf', '速度与体验')}
      ${mk('gsc', '搜索表现')}
      ${mk('history', '修改记录')}
    </div>`;
  }

  function pageTechSeoOverview() {
    const cards = [
      ['tdk', 56, '缺少页面描述', 'Meta Description 为空或重复'],
      ['kw', 31, '缺少页面关键词', 'meta keywords 未填写'],
      ['404', 12, '失效链接', '返回 404 / 410'],
      ['robots', 1, 'robots.txt 风险', '可能拦截重要目录'],
      ['sitemap', 3, '站点地图异常', '非 200 或重定向链过长'],
      ['href', 8, '多语言互指', 'hreflang 不完整'],
      ['schema', 24, '结构化数据不完整', '商品/文章缺字段'],
      ['img', 47, '图片优化', '体积过大或缺 alt'],
    ];
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span></div>
        <h1>待处理事项</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    ${seoHintBars()}
    <div class="seo-stats">
      <div class="seo-stat"><div class="seo-stat-v">186</div><div class="seo-stat-k">待处理项</div></div>
      <div class="seo-stat"><div class="seo-stat-v" style="color:var(--amber);">3</div><div class="seo-stat-k">紧急</div></div>
      <div class="seo-stat"><div class="seo-stat-v" style="color:var(--green);">94%</div><div class="seo-stat-k">上次扫描覆盖率</div></div>
    </div>
    <div class="seo-cards">
      ${cards.map(([k, n, t, s]) => `
        <div class="seo-card" onclick="seoOpenQueue('${k}')">
          <div class="seo-card-n">${n}</div>
          <div class="seo-card-t">${escapeHtmlStr(t)}</div>
          <div class="seo-card-s">${escapeHtmlStr(s)}</div>
        </div>`).join('')}
    </div>`;
  }

  function seoSteps() {
    const inQ = state.seoView === 'queue';
    const s1 = inQ && !state.seoAiDone;
    const s2 = inQ && state.seoAiDone && !state.seoReviewed;
    const s3 = inQ && state.seoReviewed;
    const stepClass = (n) => {
      let on = false;
      if (n === 1) on = s1 || !inQ;
      if (n === 2) on = s2;
      if (n === 3) on = s3;
      return `seo-step${on ? ' on' : ''}`;
    };
    return `
    <div class="seo-steps">
      <span class="${stepClass(1)}">1. 选择并生成方案</span>
      <span style="color:var(--text-4);">→</span>
      <span class="${stepClass(2)}">2. 预览修改</span>
      <span style="color:var(--text-4);">→</span>
      <span class="${stepClass(3)}">3. 应用到网站</span>
    </div>`;
  }

  function pageTechSeoQueue() {
    const spec = queueSpec();
    if (!spec) {
      state.seoView = 'overview';
      return pageTechSeoOverview();
    }
    const rows = spec.rows;
    const thead = spec.thead.map(h => `<th>${escapeHtmlStr(h)}</th>`).join('');
    const tbody = rows.map((r, i) => `
      <tr>
        <td><input type="checkbox" class="seo-row-chk" data-i="${i}" checked onchange="seoUpdateDock()" /></td>
        <td><div style="font-weight:600;font-size:13px;">${escapeHtmlStr(r.page)}</div>
            <div style="font-size:11px;color:var(--text-3);word-break:break-all;">${escapeHtmlStr(r.path || r.page)}</div></td>
        <td style="font-size:12px;color:var(--red);">${escapeHtmlStr(String(r.cur))}</td>
        <td style="font-size:12px;color:var(--green);">${r.sug ? escapeHtmlStr(String(r.sug)) : '<span style="color:var(--text-3);">— 点击「智能生成方案」—</span>'}</td>
      </tr>`).join('');
    const serp = spec.serp && rows[0]
      ? `<div class="seo-serp">
          <div style="font-size:12px;color:var(--green);">${escapeHtmlStr(site().domain)} › products › down-coat-m</div>
          <div style="font-size:15px;color:var(--brand);margin-top:6px;font-weight:600;">羽绒服长款男款 · ${escapeHtmlStr(site().name)}</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:6px;line-height:1.45;" id="seoSerpDesc">${rows[0].sug ? escapeHtmlStr(rows[0].sug.slice(0, 160)) : '修改描述后将在此处预览摘要展示效果。'}</div>
        </div>`
      : '';
    const robotsTa = state.seoQueueKey === 'robots'
      ? `<div class="panel-card" style="margin-bottom:12px;padding:14px;">
          <label style="font-size:12px;color:var(--text-2);">当前 robots.txt（节选）</label>
          <textarea class="form-textarea" style="margin-top:8px;min-height:120px;font-family:ui-monospace,monospace;font-size:12px;">User-agent: *\nDisallow: /api/\nDisallow: /checkout/\nSitemap: https://${escapeHtmlStr(site().domain)}/sitemap.xml</textarea>
        </div>`
      : '';
    const dockMsg = (() => {
      const n = rows.length;
      if (!state.seoAiDone) return `已选择处理队列 · 请先使用「智能生成方案」。`;
      if (!state.seoReviewed) return `请核对右侧建议列后点击「确认修改内容」。`;
      if (!state.seoSaasOn) return `当前未连接建站系统，仅可导出清单。`;
      return `已锁定修改 · 可将 ${n} 条应用到网站。`;
    })();
    const applyDis = !(state.seoAiDone && state.seoReviewed && state.seoSaasOn);
    const exportDis = !state.seoAiDone;
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>${escapeHtmlStr(spec.title)}</span></div>
        <h1>${escapeHtmlStr(spec.title)}</h1>
      </div>
      <div>
        <button type="button" class="btn-default" onclick="seoBackOverview()">← 返回待办</button>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    ${seoSteps()}
    <p style="font-size:13px;color:var(--text-2);margin-bottom:12px;">${escapeHtmlStr(spec.sub || '')}</p>
    ${serp}
    ${robotsTa}
    <div class="panel-card" style="padding:0;overflow:hidden;">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <span style="font-weight:600;">待处理列表</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn-primary" onclick="seoAiGenerate()">智能生成方案</button>
          <button type="button" class="btn-default" style="border-color:var(--green);color:var(--green);" onclick="seoConfirmReview()"${state.seoAiDone ? '' : ' disabled'}>确认修改内容</button>
          <button type="button" class="btn-default" onclick="seoSelectAll()">全选 / 取消</button>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr>${thead}</tr></thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
    </div>
    <div class="seo-dock">
      <div style="font-size:13px;color:var(--text-2);max-width:520px;">${dockMsg}</div>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn-default" onclick="seoDockExport()" ${exportDis ? 'disabled' : ''}>导出修改清单</button>
        <button type="button" class="btn-primary" onclick="seoDockApply()" ${applyDis ? 'disabled' : ''}>应用到网站</button>
      </div>
    </div>`;
  }

  function pageTechSeoAudit() {
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>站点扫描</span></div>
        <h1>站点扫描</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="panel-card" style="padding:16px;">
      <p style="font-size:13px;color:var(--text-2);margin-bottom:12px;">上次扫描：<strong>2026-04-27 09:18</strong> · 耗时 4 分 12 秒</p>
      <button type="button" class="btn-primary" onclick="seoScanStart()">开始新一轮扫描</button>
      <div id="seoScanBox" style="margin-top:14px;display:none;">
        <div style="height:8px;background:var(--surface-2);border-radius:999px;overflow:hidden;">
          <div id="seoScanBar" style="height:100%;width:0;background:var(--brand);transition:width .2s;"></div>
        </div>
        <p id="seoScanPhase" style="font-size:12px;color:var(--text-2);margin-top:8px;"></p>
      </div>
      <p id="seoScanDone" style="margin-top:12px;font-size:13px;color:var(--text-2);"></p>
    </div>
    <div class="seo-stats">
      <div class="seo-stat"><div class="seo-stat-v">412</div><div class="seo-stat-k">已分析 URL</div></div>
      <div class="seo-stat"><div class="seo-stat-v">18</div><div class="seo-stat-k">新问题</div></div>
      <div class="seo-stat"><div class="seo-stat-v">0</div><div class="seo-stat-k">致命错误</div></div>
    </div>`;
  }

  function pageTechSeoOnpage() {
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>页面与摘要</span></div>
        <h1>页面与搜索摘要</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="seo-cards">
      <div class="seo-card" onclick="seoOpenQueue('tdk')"><div class="seo-card-n">56</div><div class="seo-card-t">缺少页面描述</div><div class="seo-card-s">Meta Description 为空</div></div>
      <div class="seo-card" onclick="seoOpenQueue('kw')"><div class="seo-card-n">31</div><div class="seo-card-t">缺少页面关键词</div><div class="seo-card-s">meta keywords 未填写</div></div>
    </div>
    <div class="panel-card" style="padding:14px;font-size:13px;color:var(--text-2);line-height:1.6;">
      应用在网站前，可预览每条结果在搜索中的标题与摘要样式。
    </div>`;
  }

  function pageTechSeoI18n() {
    const rows = [
      ['羽绒服 · 中文', 'zh', '/zh/products/down-coat-m', '互指缺失', false],
      ['羽绒服 · EN', 'en', '/en/products/down-coat-m', '正常', true],
    ];
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>多语言</span></div>
        <h1>多语言</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <input type="search" class="form-input" style="max-width:280px;margin-bottom:12px;" placeholder="筛选 URL…" oninput="seoHrefFilter(this.value)" />
    <div class="panel-card" style="padding:0;overflow:hidden;">
      <table class="data-table" id="seoHrefTable">
        <thead><tr><th>页面组</th><th>语言</th><th>URL</th><th>状态</th></tr></thead>
        <tbody>
          ${rows.map(([a, b, c, d, ok]) => `
            <tr class="seo-href-row">
              <td>${escapeHtmlStr(a)}</td><td>${escapeHtmlStr(b)}</td><td style="font-size:11px;word-break:break-all;">${escapeHtmlStr(c)}</td>
              <td><span class="badge ${ok ? 'badge-green' : 'badge-gray'}" style="${ok ? '' : 'color:var(--red);'}">${escapeHtmlStr(d)}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  function pageTechSeoSchema() {
    const t = SCHEMA_TABS[state.seoSchemaTab] || SCHEMA_TABS[0];
    const tabs = SCHEMA_TABS.map((x, i) =>
      `<button type="button" class="btn-default ${state.seoSchemaTab === i ? 'active' : ''}" style="margin-right:6px;margin-bottom:6px;" onclick="seoSchemaTab(${i})">${escapeHtmlStr(x.name)}</button>`).join('');
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>结构化数据</span></div>
        <h1>结构化数据</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="seo-schema-tablist" style="margin-bottom:12px;">${tabs}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;" class="seo-schema-split">
      <div><div style="font-size:11px;color:var(--text-2);margin-bottom:6px;">当前</div><div class="seo-json">${escapeHtmlStr(t.old)}</div></div>
      <div><div style="font-size:11px;color:var(--text-2);margin-bottom:6px;">建议补充后</div><div class="seo-json">${escapeHtmlStr(t.neu)}</div></div>
    </div>
    <button type="button" class="btn-primary" style="margin-top:12px;" onclick="toast('已应用到当前页面');">应用到当前页面</button>`;
  }

  function pageTechSeoCrawl() {
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>抓取与索引</span></div>
        <h1>抓取与索引</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="panel-card" style="padding:14px;margin-bottom:12px;">
      <label style="font-size:12px;color:var(--text-2);">robots.txt 路径检测</label>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
        <input type="text" id="seoRobotPath" class="form-input" style="min-width:240px;" value="/catalog/winter" />
        <button type="button" class="btn-primary" onclick="seoSimRobots()">检测</button>
      </div>
      <p id="seoRobotSim" style="margin-top:10px;font-size:13px;color:var(--text-2);">点击「检测」查看模拟爬虫是否允许访问该路径。</p>
    </div>
    <div class="panel-card" style="padding:0;overflow:hidden;">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:600;">站点地图中的异常链接</div>
      <table class="data-table">
        <thead><tr><th>URL</th><th>返回状态</th><th>上次检测</th></tr></thead>
        <tbody>
          <tr><td style="font-size:11px;">/legacy/p1</td><td>404</td><td style="font-size:12px;color:var(--text-2);">今天 08:12</td></tr>
          <tr><td style="font-size:11px;">/tmp/preview</td><td>302</td><td style="font-size:12px;color:var(--text-2);">今天 08:12</td></tr>
        </tbody>
      </table>
    </div>`;
  }

  function pageTechSeoPerf() {
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>速度与体验</span></div>
        <h1>速度与体验</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="seo-stats">
      <div class="seo-stat"><div class="seo-stat-v">3.1s</div><div class="seo-stat-k">LCP</div></div>
      <div class="seo-stat"><div class="seo-stat-v">0.09</div><div class="seo-stat-k">CLS</div></div>
      <div class="seo-stat"><div class="seo-stat-v">187ms</div><div class="seo-stat-k">INP</div></div>
    </div>
    <div class="panel-card" style="padding:0;overflow:hidden;">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:600;">图片体积偏大</div>
      <table class="data-table">
        <thead><tr><th>资源</th><th>体积</th><th>所在页面</th><th>建议</th></tr></thead>
        <tbody>
          <tr><td style="font-size:11px;">/cdn/img/hero-winter.jpg</td><td>820 KB</td><td>/zh/</td><td>压缩并转 WebP</td></tr>
        </tbody>
      </table>
    </div>`;
  }

  function pageTechSeoGsc() {
    if (!state.seoGscOn) {
      return `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>搜索表现</span></div>
          <h1>搜索表现</h1>
        </div>
      </div>
      ${seoConnToolbar()}
      ${seoSubNav()}
      <div class="empty-state"><div class="empty-text">请先连接「Google 搜索」</div></div>`;
    }
    const weeks = ['第1周', '第2周', '第3周', '第4周'];
    const h = [45, 62, 55, 78];
    const bars = weeks.map((w, i) => `<div class="b" style="height:${h[i]}%"><span>${escapeHtmlStr(w)}</span></div>`).join('');
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>搜索表现</span></div>
        <h1>搜索表现</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="panel-card" style="padding:14px;margin-bottom:12px;">
      <div style="font-weight:600;margin-bottom:8px;">近 28 天 · 曝光趋势</div>
      <div class="seo-bar-chart">${bars}</div>
    </div>
    <div class="panel-card" style="padding:0;overflow:hidden;">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:600;">热门查询</div>
      <table class="data-table">
        <thead><tr><th>查询词</th><th>曝光</th><th>点击</th><th>点击率</th></tr></thead>
        <tbody>
          <tr><td>羽绒服 户外</td><td>12400</td><td>312</td><td>2.5%</td></tr>
          <tr><td>外贸建站</td><td>8900</td><td>156</td><td>1.8%</td></tr>
        </tbody>
      </table>
    </div>`;
  }

  function pageTechSeoHistory() {
    return `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-breadcrumb"><span>增长引擎</span><span class="sep">›</span><span>技术SEO</span><span class="sep">›</span><span>修改记录</span></div>
        <h1>修改记录</h1>
      </div>
    </div>
    ${seoConnToolbar()}
    ${seoSubNav()}
    <div class="panel-card" style="padding:0;overflow:hidden;">
      <table class="data-table">
        <thead><tr><th>时间</th><th>类型</th><th>摘要</th><th>操作者</th></tr></thead>
        <tbody>
          <tr><td style="font-size:12px;color:var(--text-2);">2026-04-28 10:02</td><td>页面元信息</td><td>批量更新 12 页描述</td><td>张伟</td></tr>
          <tr><td style="font-size:12px;color:var(--text-2);">2026-04-27 16:40</td><td>robots</td><td>更新 robots.txt</td><td>李娜</td></tr>
        </tbody>
      </table>
    </div>`;
  }

  window.pageTechSeo = function pageTechSeo() {
    switch (state.seoView) {
      case 'queue': return pageTechSeoQueue();
      case 'audit': return pageTechSeoAudit();
      case 'onpage': return pageTechSeoOnpage();
      case 'i18n': return pageTechSeoI18n();
      case 'schema': return pageTechSeoSchema();
      case 'crawl': return pageTechSeoCrawl();
      case 'perf': return pageTechSeoPerf();
      case 'gsc': return pageTechSeoGsc();
      case 'history': return pageTechSeoHistory();
      default: return pageTechSeoOverview();
    }
  };

  window.seoNav = function (v) {
    state.seoView = v;
    if (v !== 'queue') state.seoQueueKey = null;
    render();
  };
  window.seoOpenQueue = function (k) {
    state.seoView = 'queue';
    state.seoQueueKey = k;
    state.seoAiDone = false;
    state.seoReviewed = false;
    render();
  };
  window.seoBackOverview = function () {
    state.seoView = 'overview';
    state.seoQueueKey = null;
    render();
  };
  window.seoToggleSaas = function () {
    state.seoSaasOn = !state.seoSaasOn;
    render();
  };
  window.seoToggleGsc = function () {
    state.seoGscOn = !state.seoGscOn;
    render();
  };
  window.seoAiGenerate = function () {
    const spec = queueSpec();
    if (!spec || !spec.aiFill) return;
    spec.aiFill(spec.rows);
    state.seoAiDone = true;
    const el = document.getElementById('seoSerpDesc');
    if (el && spec.rows[0] && spec.rows[0].sug) el.textContent = spec.rows[0].sug.slice(0, 160);
    toast('已生成方案，请核对后确认修改');
    render();
  };
  window.seoConfirmReview = function () {
    if (!state.seoAiDone) return;
    state.seoReviewed = true;
    toast('已锁定本批次修改');
    render();
  };
  window.seoSelectAll = function () {
    const checks = document.querySelectorAll('.seo-row-chk');
    const allOn = [...checks].every(c => c.checked);
    checks.forEach(c => { c.checked = !allOn; });
  };
  window.seoUpdateDock = function () {};
  window.seoDockApply = function () {
    toast('正在写入建站系统…');
    setTimeout(() => {
      toast('已完成');
      state.seoView = 'overview';
      state.seoQueueKey = null;
      render();
    }, 600);
  };
  window.seoDockExport = function () {
    const blob = new Blob([JSON.stringify({ site: state.siteId, queue: state.seoQueueKey, at: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `seo-updates-${state.siteId}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已下载修改清单');
  };
  window.seoScanStart = function () {
    const box = document.getElementById('seoScanBox');
    const bar = document.getElementById('seoScanBar');
    const ph = document.getElementById('seoScanPhase');
    const done = document.getElementById('seoScanDone');
    if (!box || !bar) return;
    box.style.display = 'block';
    let p = 0;
    const phases = ['正在抓取页面…', '正在读取建站配置…', '正在合并搜索数据…', '正在生成待办…'];
    const tick = () => {
      p += 12;
      bar.style.width = `${Math.min(p, 100)}%`;
      if (ph) ph.textContent = phases[Math.min(Math.floor(p / 25), phases.length - 1)];
      if (p < 100) setTimeout(tick, 160);
      else if (done) done.textContent = '扫描完成：新发现 18 条问题，已加入待办。';
    };
    tick();
  };
  window.seoSimRobots = function () {
    const inp = document.getElementById('seoRobotPath');
    const out = document.getElementById('seoRobotSim');
    const p = (inp && inp.value) ? inp.value.trim() : '';
    let ok = true;
    if (p.startsWith('/api') || p.startsWith('/checkout')) ok = false;
    if (out) {
      out.innerHTML = ok
        ? `<span style="color:var(--green);">允许访问</span> · 路径 <code>${escapeHtmlStr(p)}</code>`
        : `<span style="color:var(--red);">不建议抓取</span> · 该路径与当前 Disallow 规则冲突。`;
    }
  };
  window.seoSchemaTab = function (i) {
    state.seoSchemaTab = i;
    render();
  };
  window.seoHrefFilter = function (q) {
    q = (q || '').toLowerCase();
    document.querySelectorAll('.seo-href-row').forEach(tr => {
      tr.style.display = tr.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  };
})();
