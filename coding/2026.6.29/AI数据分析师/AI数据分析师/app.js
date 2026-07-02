const DEMO = {
  dates: ['06-04', '06-05', '06-06', '06-07', '06-08', '06-09', '06-10'],
  dateFull: ['2026-06-04', '2026-06-05', '2026-06-06', '2026-06-07', '2026-06-08', '2026-06-09', '2026-06-10'],
  channels: ['直接访问', '自然搜索', '自然社交', '外部引荐', '视频网站', '付费搜索', '付费社交', '其他'],
  channelData: [
    { name: '直接访问', pv: 43938, uv: 12287, time: '00:01:01', opp: 41, orders: 0, rate: '0.33%' },
    { name: '自然搜索', pv: 0, uv: 0, time: '00:00:00', opp: 0, orders: 0, rate: '0%' },
    { name: '自然社交', pv: 0, uv: 0, time: '00:00:00', opp: 0, orders: 0, rate: '0%' },
    { name: '外部引荐', pv: 5474, uv: 1853, time: '00:01:20', opp: 12, orders: 0, rate: '0.65%' },
    { name: '视频网站', pv: 0, uv: 0, time: '00:00:00', opp: 0, orders: 0, rate: '0%' },
    { name: '付费搜索', pv: 0, uv: 0, time: '00:00:00', opp: 0, orders: 0, rate: '0%' },
    { name: '付费社交', pv: 0, uv: 0, time: '00:00:00', opp: 0, orders: 0, rate: '0%' },
    { name: '其他', pv: 0, uv: 0, time: '00:00:00', opp: 0, orders: 0, rate: '0%' }
  ],
  geoData: [
    { country: '中国', pv: 43775, uv: 11737, time: '00:01:02', opp: 40, orders: 0, rate: '0.34%' },
    { country: '美国', pv: 3907, uv: 1314, time: '00:01:00', opp: 2, orders: 0, rate: '0.15%' },
    { country: '新加坡', pv: 620, uv: 184, time: '00:01:22', opp: 4, orders: 0, rate: '2.17%' },
    { country: '英国', pv: 312, uv: 98, time: '00:00:58', opp: 1, orders: 0, rate: '1.02%' },
    { country: '印度', pv: 256, uv: 87, time: '00:01:05', opp: 0, orders: 0, rate: '0%' }
  ],
  pages: [
    { url: '/', type: 'gold', pv: 13569, uv: 8540, time: '00:00:56', opp: 1, orders: 0, rate: '0.01%' },
    { url: '/website.html', type: 'gold', pv: 18313, uv: 8842, time: '00:01:15', opp: 7, orders: 0, rate: '0.08%' },
    { url: '/peixunyuyue.html', type: 'gold', pv: 277, uv: 222, time: '00:00:52', opp: 73, orders: 0, rate: '32.88%' },
    { url: '/login.html', type: 'gray', pv: 1520, uv: 980, time: '00:00:45', opp: 0, orders: 0, rate: '0%' },
    { url: '/shouquanma.html', type: 'gold', pv: 890, uv: 620, time: '00:01:10', opp: 15, orders: 0, rate: '2.42%' },
    { url: '/about.html', type: 'gray', pv: 456, uv: 320, time: '00:00:38', opp: 0, orders: 0, rate: '0%' }
  ],
  landingPages: [
    { url: '/', sessions: 8540, pages: 2.8, time: '00:01:02', opp: 35, orders: 0 },
    { url: '/website.html', sessions: 6200, pages: 2.4, time: '00:01:15', opp: 28, orders: 0 },
    { url: '/login.html', sessions: 1850, pages: 1.8, time: '00:00:45', opp: 5, orders: 0 },
    { url: '/peixunyuyue.html', sessions: 980, pages: 3.2, time: '00:01:30', opp: 18, orders: 0 },
    { url: '/shouquanma.html', sessions: 620, pages: 2.1, time: '00:01:08', opp: 4, orders: 0 }
  ],
  interactions: [
    { title: '来自IP:36.152.143.174的提交表单', landing: '/shouquanma.html', page: '/shouquanma.html', country: '中国 (36.152.143.174)', source: '直接访问', method: '提交表单', date: '2026-06-10 16:37:23' },
    { title: '来自IP:182.54.119.170的发起咨询', landing: '/website.html', page: '/website.html', country: '中国 (182.54.119.170)', source: '直接访问', method: '发起咨询', date: '2026-06-10 15:22:10' },
    { title: '来自IP:45.32.231.244的社交关注', landing: '/about.html', page: '/about.html', country: '美国 (45.32.231.244)', source: '外部引荐', method: '社交关注', date: '2026-06-09 11:05:33' },
    { title: '来自IP:103.28.56.88的提交表单', landing: '/peixunyuyue.html', page: '/peixunyuyue.html', country: '新加坡 (103.28.56.88)', source: '直接访问', method: '提交表单', date: '2026-06-09 09:18:45' }
  ],
  opportunities: [
    { title: '来自IP:36.152.143.174的提交表单', landing: '/shouquanma.html', page: '/shouquanma.html', country: '中国 (36.152.143.174)', source: '直接访问', method: '表单询盘', date: '2026-06-10 16:37:23' },
    { title: '来自IP:182.54.119.170的发起咨询', landing: '/website.html', page: '/website.html', country: '中国 (182.54.119.170)', source: '直接访问', method: '发起咨询', date: '2026-06-10 15:22:10' },
    { title: '来自IP:45.32.231.244的表单询盘', landing: '/peixunyuyue.html', page: '/peixunyuyue.html', country: '美国 (45.32.231.244)', source: '直接访问', method: '表单询盘', date: '2026-06-09 14:08:12' }
  ],
  orders: [
    { no: 'SC20260610001', source: '-', touch: '-', page: '/product.html', landing: '/product.html', country: '中国 (36.152.143.174)', conv: '直接访问', date: '2026-06-10 19:37:20', amount: '5500.00' },
    { no: 'SC20260609002', source: '-', touch: '-', page: '/service.html', landing: '/service.html', country: '中国 (182.54.119.170)', conv: '直接访问', date: '2026-06-09 16:22:15', amount: '3200.00' },
    { no: 'SC20260608003', source: '-', touch: '-', page: '/vip.html', landing: '/vip.html', country: '新加坡 (103.28.56.88)', conv: '外部引荐', date: '2026-06-08 11:05:08', amount: '8800.00' }
  ],
  products: [
    { name: 'water', page: '/pd555172468.html', views: 1, inquiry: 0, orders: 0, publisher: 'chengzhengjie@leadong.com', date: '2024-07-11' },
    { name: 'SEO专业测评工具', page: '/seo-ceping.html', views: 8, inquiry: 0, orders: 0, publisher: 'leadong-leilimei', date: '2020-10-24' }
  ],
  articles: [
    { title: '2025年独立站搭建要多少钱？', page: '/b2bseopromotion.html', views: 65, publisher: 'zhoujin1012@leadong.com', date: '2025-03-15' },
    { title: '外贸企业如何做好SEO优化', page: '/seo-guide.html', views: 56, publisher: 'leadong-demo@leadong.com', date: '2025-02-20' },
    { title: 'B2B独立站运营策略分享', page: '/b2b-strategy.html', views: 43, publisher: 'songchunyan@leadong.com', date: '2025-01-10' },
    { title: '谷歌广告投放入门指南', page: '/google-ads.html', views: 38, publisher: 'yangxianghui@leadong.com', date: '2024-12-05' }
  ],
  hotlinks: [
    { domain: 'www.pellett.xyz', origin: 'www.leadong.com', count: 1, time: '2026-06-10 15:28:08', status: '已封堵' },
    { domain: 'biocenter24.com', origin: 'www.leadong.com', count: 36, time: '2026-06-06 10:15:22', status: '已封堵' },
    { domain: 'www.biocenter24.com', origin: 'www.leadong.com', count: 31, time: '2026-06-06 09:42:18', status: '已封堵' },
    { domain: 'yeaglz.com', origin: 'www.leadong.com', count: 26, time: '2026-06-05 14:20:05', status: '已封堵' },
    { domain: 'sharpboots.com', origin: 'www.leadong.com', count: 18, time: '2026-06-04 16:33:41', status: '已封堵' }
  ],
  hotlinkRank: [
    { site: 'biocenter24.com', count: 36 },
    { site: 'www.biocenter24.com', count: 31 },
    { site: 'yeaglz.com', count: 26 },
    { site: 'sharpboots.com', count: 18 },
    { site: 'www.pellett.xyz', count: 1 }
  ],
  customReports: [
    { gen: '2026-06-02 10:22:53', period: '2026-05-26 ~ 2026-06-01' },
    { gen: '2026-05-26 09:15:30', period: '2026-05-19 ~ 2026-05-25' },
    { gen: '2026-05-19 14:08:12', period: '2026-05-12 ~ 2026-05-18' },
    { gen: '2025-07-01 11:30:00', period: '2025-06-24 ~ 2025-06-30' }
  ],
  behaviorSessions: [
    { landing: '/website.html', channel: '直接访问', link: '-', country: '中国 (182.54.119.170)', pages: 5, duration: '00:03:25', start: '2026-06-10 23:58:02' },
    { landing: '/', channel: '直接访问', link: '-', country: '中国 (36.152.143.174)', pages: 3, duration: '00:02:10', start: '2026-06-10 22:15:33' },
    { landing: '/login.html', channel: '外部引荐', link: 'https://google.com', country: '美国 (45.32.231.244)', pages: 2, duration: '00:01:05', start: '2026-06-10 20:42:18' }
  ],
  sessionPath: [
    { page: '/website.html', visitTime: '2026-06-10 11:51:22', duration: '00:06:41', interact: '/', convert: '/' },
    { page: '/security.html', visitTime: '2026-06-10 11:58:03', duration: '00:01:12', interact: '/', convert: '/' },
    { page: '/about.html', visitTime: '2026-06-10 11:59:15', duration: '00:00:48', interact: '/', convert: '/' },
    { page: '/product-list.html', visitTime: '2026-06-10 12:00:03', duration: '00:02:05', interact: '/', convert: '/' },
    { page: '/case-study.html', visitTime: '2026-06-10 12:02:08', duration: '00:01:33', interact: '/', convert: '/' },
    { page: '/customer-info.html', visitTime: '2026-06-10 12:03:41', duration: '00:03:22', interact: '提交表单(1)', convert: '表单询盘(1)' },
    { page: '/contact.html?from=customer-info&utm_source=direct', visitTime: '2026-06-10 12:07:03', duration: '00:00:55', interact: '/', convert: '/' },
    { page: '/pricing.html', visitTime: '2026-06-10 12:07:58', duration: '00:01:40', interact: '/', convert: '/' },
    { page: '/faq.html', visitTime: '2026-06-10 12:09:38', duration: '00:00:36', interact: '/', convert: '/' },
    { page: '/blog.html', visitTime: '2026-06-10 12:10:14', duration: '00:02:18', interact: '/', convert: '/' },
    { page: '/website.html', visitTime: '2026-06-10 12:12:32', duration: '00:01:05', interact: '/', convert: '/' }
  ]
};

const SESSION_SOURCES = {
  interaction: { returnPage: 'website-interaction', breadcrumb: '网站分析 / 网站互动', list: () => DEMO.interactions },
  sales: { returnPage: 'sales-opportunity', breadcrumb: '转化分析 / 销售机会', list: () => DEMO.opportunities },
  inquiry: { returnPage: 'inquiry-stats', breadcrumb: '转化分析 / 询盘统计', list: () => DEMO.opportunities },
  order: { returnPage: 'transaction-orders', breadcrumb: '转化分析 / 交易订单', list: () => DEMO.orders }
};

let sessionReturn = { page: 'sales-opportunity', breadcrumb: '转化分析 / 销售机会' };

function sessionDetailLink(index, source) {
  return `<a class="link session-detail-link" href="#" data-session-index="${index}" data-session-source="${source}">查看详情</a>`;
}

function extractIp(text) {
  if (!text) return '45.32.231.244';
  const m = text.match(/IP:([\d.]+)/) || text.match(/\(([\d.]+)\)/) || text.match(/([\d.]+)/);
  return m ? m[1] : '45.32.231.244';
}

function buildSessionPath(row, sourceKey) {
  const path = DEMO.sessionPath.map(p => ({ ...p }));
  const landing = row.landing || row.page || '/website.html';
  const method = row.method || '';
  const convPage = row.page || landing;
  path[0].page = landing;
  path[0].visitTime = row.date || path[0].visitTime;
  const convIdx = path.findIndex(p => p.page.includes('customer-info') || p.interact !== '/');
  const idx = convIdx >= 0 ? convIdx : 5;
  path[idx].page = convPage;
  if (method.includes('表单') || method.includes('询盘')) {
    path[idx].interact = '提交表单(1)';
    path[idx].convert = '表单询盘(1)';
  } else if (method.includes('咨询')) {
    path[idx].interact = '发起咨询(1)';
    path[idx].convert = '发起咨询(1)';
  } else if (sourceKey === 'order') {
    path[idx].interact = '/';
    path[idx].convert = '交易订单(1)';
  }
  return path;
}

function renderInfoList(elId, items) {
  document.getElementById(elId).innerHTML = items.map(([label, value]) =>
    `<dt>${label}</dt><dd>${value}</dd>`
  ).join('');
}

function renderSessionDetail(row, sourceKey) {
  const ip = extractIp(row.title || row.country || row.no || '');
  const visitTime = row.date || '2026-06-10 11:51:22';
  const source = row.source || row.conv || '直接访问';
  const isUS = (row.country || '').includes('美国') || ip.startsWith('45.');

  renderInfoList('session-device-info', [
    ['访问终端', '计算机'],
    ['操作系统', isUS ? 'Windows 10' : 'Windows 10'],
    ['屏幕分辨率', '1280×672'],
    ['浏览器', 'Chrome 13'],
    ['语言', isUS ? 'en-US' : 'zh-CN']
  ]);

  renderInfoList('session-visitor-info', [
    ['访客类型', '新用户'],
    ['访问时间', visitTime],
    ['来源渠道', source],
    ['来源链接', '-'],
    ['IP地址', ip],
    ['上次访问时间', '暂无']
  ]);

  const path = buildSessionPath(row, sourceKey);
  document.getElementById('session-path-table').innerHTML = renderTable(path, [
    { label: '序号', key: (_, i) => i + 1 },
    { label: '访问页面', render: r => `<span class="link">${r.page}</span>` },
    { label: '访问时间', key: 'visitTime' },
    { label: '页面停留时间', key: 'duration' },
    { label: '互动事件', key: 'interact' },
    { label: '转化事件', key: 'convert' }
  ], { pagination: false });
}

function openSessionDetail(index, sourceKey) {
  const src = SESSION_SOURCES[sourceKey];
  if (!src) return;
  const row = src.list()[index];
  if (!row) return;
  sessionReturn = { page: src.returnPage, breadcrumb: src.breadcrumb };
  renderSessionDetail(row, sourceKey);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-session-detail').classList.add('active');
  document.getElementById('breadcrumb').textContent = src.breadcrumb + ' / 会话详情';
  window.scrollTo(0, 0);
}

function goBackFromSession() {
  navigate(sessionReturn.page, sessionReturn.breadcrumb);
}

function renderTable(rows, cols, opts = {}) {
  const thead = cols.map(c => {
    const cls = c.className ? ` class="${c.className}"` : '';
    return `<th${cls}>${c.label}${c.tip ? ' <span title="说明">ⓘ</span>' : ''}</th>`;
  }).join('');
  const tbody = rows.map((row, i) => {
    const cells = cols.map(c => {
      let v = typeof c.key === 'function' ? c.key(row, i) : row[c.key];
      if (c.render) v = c.render(row, i);
      const cls = c.className ? ` class="${c.className}"` : '';
      return `<td${cls}>${v ?? '-'}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  const total = opts.total || rows.length;
  const pag = opts.pagination !== false ? `
    <div class="pagination">
      <span>共${total}条记录</span>
      <div class="pagination-pages">
        <span>‹</span><span class="active">1</span><span>2</span><span>3</span><span>›</span>
        <span style="border:none;margin-left:8px">前往 <input type="text" style="width:40px;border:1px solid #d9d9d9;border-radius:4px;padding:2px 4px;text-align:center" value="1"> 页</span>
      </div>
    </div>` : '';
  return `<table class="data-table"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>${pag}`;
}

function filterBar(opts = {}) {
  const { showCompare = false, showGranularity = true } = opts;
  return `<div class="filter-bar">
    <select><option>最近7天</option><option>最近30天</option><option>最近90天</option></select>
    <input type="date" value="2026-06-04"> ~ <input type="date" value="2026-06-10">
    ${showCompare ? '<label><input type="checkbox"> 对比</label>' : ''}
    ${showGranularity ? `<div class="btn-group"><button class="active">按日</button><button>按周</button><button>按月</button></div>` : ''}
  </div>`;
}

function pageIcon(type) {
  if (type === 'gold') return '<span class="icon-gold">●</span>';
  if (type === 'diamond') return '<span class="icon-diamond">◆</span>';
  return '<span class="icon-gray">○</span>';
}
const charts = {};
const COLORS = ['#1565e8', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0d9488', '#db2777', '#7a8494'];

function initChart(id, option) {
  const el = document.getElementById(id);
  if (!el) return;
  if (charts[id]) charts[id].dispose();
  charts[id] = echarts.init(el);
  charts[id].setOption(option);
}

function lineChart(id, series, dates, opts = {}) {
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: series.map(s => s.name) },
    grid: { left: 50, right: opts.dual ? 50 : 20, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: dates || DEMO.dateFull, boundaryGap: false },
    yAxis: opts.dual ? [
      { type: 'value', name: opts.yLeft || '' },
      { type: 'value', name: opts.yRight || '', axisLabel: { formatter: '{value}%' }, max: 100 }
    ] : { type: 'value' },
    series: series.map((s, i) => ({
      name: s.name, type: 'line', smooth: true, data: s.data,
      yAxisIndex: s.yAxisIndex || 0,
      itemStyle: { color: s.color || COLORS[i % COLORS.length] },
      areaStyle: s.area ? { opacity: 0.15 } : undefined
    }))
  });
}

function barChart(id, categories, series) {
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 20, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: series.map((s, i) => ({
      name: s.name, type: 'bar', data: s.data,
      itemStyle: { color: s.color || COLORS[i] }
    }))
  });
}

function pieChart(id, data) {
  initChart(id, {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0, type: 'scroll' },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      data: data.map((d, i) => ({ ...d, itemStyle: { color: COLORS[i % COLORS.length] } })),
      label: { formatter: '{b}\n{d}%' }
    }]
  });
}

function donutChart(id, data, centerText) {
  initChart(id, {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, type: 'scroll' },
    graphic: centerText ? [{
      type: 'text', left: 'center', top: '38%',
      style: { text: centerText, textAlign: 'center', fill: '#666', fontSize: 13 }
    }, {
      type: 'text', left: 'center', top: '46%',
      style: { text: '14759', textAlign: 'center', fill: '#333', fontSize: 24, fontWeight: 'bold' }
    }] : undefined,
    series: [{
      type: 'pie', radius: ['50%', '70%'], center: ['50%', '45%'],
      data: data.map((d, i) => ({ ...d, itemStyle: { color: COLORS[i % COLORS.length] } })),
      label: { show: false }
    }]
  });
}

function stackedArea(id, dates) {
  const sources = ['直接访问', '自然搜索', '自然社交', '外部引荐', '视频网站', '付费搜索', '付费社交', '其他'];
  const base = [42000, 38000, 35000, 40000, 36000, 45000, 48000, 44000];
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, type: 'scroll' },
    grid: { left: 50, right: 20, top: 20, bottom: 60 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: sources.map((name, i) => ({
      name, type: 'line', stack: 'total', areaStyle: {},
      data: base.map((b, j) => Math.round(b * (i === 0 ? 0.85 : 0.02 * (i + 1)) * (0.9 + j * 0.02))),
      itemStyle: { color: COLORS[i] }
    }))
  });
}

function funnelChart(id) {
  initChart(id, {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'funnel', left: '10%', width: '80%', top: 20, bottom: 20,
      sort: 'descending', gap: 4,
      label: { show: true, position: 'inside', formatter: '{b}\n{c}' },
      data: [
        { value: 13642, name: '访客量', itemStyle: { color: '#1565e8' } },
        { value: 185, name: '网站互动', itemStyle: { color: '#16a34a' } },
        { value: 124, name: '转化', itemStyle: { color: '#d97706' } }
      ]
    }]
  });
}

function behaviorSankeyChart(id) {
  const nodes = [
    { name: '直接访问' },
    { name: '外部引荐' },
    { name: '着陆页 /' },
    { name: '着陆页 /website.html' },
    { name: '第1次查看 /about.html' },
    { name: '第1次查看 /product.html' },
    { name: '第2次查看 /contact.html' },
    { name: '流失' }
  ];
  const links = [
    { source: '直接访问', target: '着陆页 /', value: 7000 },
    { source: '直接访问', target: '着陆页 /website.html', value: 5287 },
    { source: '外部引荐', target: '着陆页 /', value: 1540 },
    { source: '外部引荐', target: '着陆页 /website.html', value: 313 },
    { source: '着陆页 /', target: '流失', value: 3200 },
    { source: '着陆页 /website.html', target: '流失', value: 2400 },
    { source: '着陆页 /', target: '第1次查看 /about.html', value: 1800 },
    { source: '着陆页 /', target: '第1次查看 /product.html', value: 1540 },
    { source: '着陆页 /website.html', target: '第1次查看 /about.html', value: 1400 },
    { source: '着陆页 /website.html', target: '第1次查看 /product.html', value: 1260 },
    { source: '第1次查看 /about.html', target: '流失', value: 2500 },
    { source: '第1次查看 /product.html', target: '流失', value: 2100 },
    { source: '第1次查看 /about.html', target: '第2次查看 /contact.html', value: 700 },
    { source: '第1次查看 /product.html', target: '第2次查看 /contact.html', value: 500 }
  ];
  initChart(id, {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: p => {
        if (p.dataType === 'edge') {
          return `${p.data.source} → ${p.data.target}<br/>会话数：<b>${p.data.value}</b>`;
        }
        return `${p.name}`;
      }
    },
    series: [{
      type: 'sankey',
      left: '2%',
      right: '8%',
      top: 24,
      bottom: 16,
      nodeWidth: 14,
      nodeGap: 14,
      layoutIterations: 32,
      emphasis: { focus: 'adjacency' },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 },
      label: {
        fontSize: 12,
        color: '#4b5565',
        formatter: p => {
          const n = p.name;
          if (n.startsWith('着陆页 ')) return n.replace('着陆页 ', '');
          if (n.startsWith('第1次查看 ')) return n.replace('第1次查看 ', '');
          if (n.startsWith('第2次查看 ')) return n.replace('第2次查看 ', '');
          return n;
        }
      },
      levels: [
        { depth: 0, itemStyle: { color: '#b8d4f8' }, label: { fontWeight: 500 } },
        { depth: 1, itemStyle: { color: '#c8e6c9' } },
        { depth: 2, itemStyle: { color: '#dcedc8' } },
        { depth: 3, itemStyle: { color: '#e8f5e9' } },
        { depth: 4, itemStyle: { color: '#eceff1' } }
      ],
      data: nodes,
      links
    }]
  });
}

function geoMap(id) {
  initChart(id, {
    tooltip: { trigger: 'item' },
    visualMap: {
      min: 0, max: 43780, left: 20, bottom: 20,
      inRange: { color: ['#e8f1fd', '#b8d4f8', '#6ba3ef', '#1565e8', '#0f4ec2'] },
      text: ['高', '低']
    },
    series: [{
      type: 'map', map: 'world', roam: true,
      emphasis: { label: { show: false } },
      data: [
        { name: 'China', value: 43775 },
        { name: 'United States', value: 3907 },
        { name: 'Singapore', value: 620 },
        { name: 'United Kingdom', value: 312 },
        { name: 'India', value: 256 }
      ]
    }]
  });
}

function initPageCharts(pageId) {
  const d = DEMO;
  switch (pageId) {
    case 'overview':
      lineChart('chart-traffic', [
        { name: 'PV', data: [8200, 7500, 6800, 7200, 8500, 11200, 9800] },
        { name: 'UV', data: [2100, 1950, 1800, 1900, 2200, 2800, 2400] },
        { name: 'IP', data: [1800, 1700, 1600, 1650, 1900, 2400, 2100] },
        { name: '网站互动', data: [25, 22, 20, 28, 30, 45, 35] },
        { name: '销售机会', data: [15, 12, 10, 18, 20, 35, 28] },
        { name: '订单量', data: [30, 28, 25, 32, 35, 42, 38] }
      ], d.dateFull);
      stackedArea('chart-conversion-area', d.dateFull);
      break;
    case 'source-channel':
      barChart('chart-channel-bar', d.channels, [
        { name: '浏览量', data: [43938, 0, 0, 5474, 0, 0, 0, 0], color: '#1565e8' },
        { name: '渠道访客数', data: [12287, 0, 0, 1853, 0, 0, 0, 0], color: '#16a34a' }
      ]);
      donutChart('chart-channel-pie', [
        { value: 12287, name: '直接访问' },
        { value: 1853, name: '外部引荐' },
        { value: 619, name: '其他' }
      ], '渠道访客总数');
      break;
    case 'geo-distribution':
      if (typeof echarts !== 'undefined' && echarts.getMap('world')) geoMap('chart-geo-map');
      else initChart('chart-geo-map', {
        title: { text: '世界地图（演示数据）', left: 'center', top: 'middle', textStyle: { color: '#999', fontSize: 14 } }
      });
      break;
    case 'behavior-flow':
      behaviorSankeyChart('chart-behavior-sankey');
      break;
    case 'website-pages':
      lineChart('chart-pages-trend', [{ name: '页面总数', data: [6711, 6711, 6711, 6711, 6711, 6711, 6711], color: '#1565e8' }], d.dateFull);
      break;
    case 'website-interaction':
      lineChart('chart-interaction', [
        { name: '提交表单数', data: [12, 15, 10, 18, 20, 55, 28] },
        { name: '发起咨询数', data: [3, 4, 2, 5, 4, 8, 6] },
        { name: '社交分享数', data: [8, 6, 7, 9, 10, 12, 8] }
      ], d.dateFull);
      break;
    case 'landing-page':
      lineChart('chart-landing', [{ name: '会话数', data: [2800, 2600, 2400, 2500, 2900, 3500, 3200], color: '#1565e8' }], d.dateFull);
      break;
    case 'conversion-stats':
      lineChart('chart-conv-trend', [
        { name: '转化', data: [12, 15, 10, 18, 20, 62, 28], yAxisIndex: 0 },
        { name: '转化率', data: [0.5, 0.6, 0.4, 0.7, 0.8, 2.5, 1.2], yAxisIndex: 1, color: '#16a34a' }
      ], d.dateFull, { dual: true, yLeft: '转化', yRight: '转化率' });
      funnelChart('chart-conv-funnel');
      pieChart('chart-conv-method', [
        { value: 77.42, name: '表单询盘' }, { value: 21.77, name: '发起咨询' }, { value: 0.81, name: '发起邮件' }
      ]);
      pieChart('chart-conv-channel', [
        { value: 87.9, name: '直接访问' }, { value: 9.68, name: '外部引荐' }, { value: 2.42, name: '自然搜索' }
      ]);
      pieChart('chart-conv-geo', [
        { value: 87.9, name: '中国' }, { value: 6.45, name: '尼泊尔' }, { value: 3.23, name: '新加坡' },
        { value: 1.61, name: '英国' }, { value: 0.81, name: '印度' }
      ]);
      break;
    case 'sales-opportunity':
      lineChart('chart-sales', [
        { name: '发起咨询数', data: [3, 4, 2, 5, 4, 8, 6] },
        { name: '表单询盘数', data: [10, 12, 8, 15, 18, 55, 28] },
        { name: '会员注册数', data: [0, 0, 0, 0, 0, 0, 0] },
        { name: '发起邮件数', data: [0, 0, 1, 0, 0, 0, 0] }
      ], d.dateFull);
      break;
    case 'inquiry-stats':
      lineChart('chart-inquiry', [{ name: '表单询盘数', data: [10, 12, 8, 15, 18, 58, 25], color: '#16a34a' }], d.dateFull);
      break;
    case 'transaction-orders':
      lineChart('chart-orders', [
        { name: '总订单金额', data: [12000, 15000, 8000, 18000, 22000, 2800000, 35000] },
        { name: '已支付订单金额', data: [10000, 14000, 7500, 17000, 20000, 2700000, 32000] },
        { name: '总订单数', data: [30, 35, 28, 38, 42, 55, 48] },
        { name: '已支付订单数', data: [28, 32, 25, 35, 40, 52, 45] }
      ], d.dateFull);
      break;
    case 'products':
      lineChart('chart-product', [
        { name: '产品浏览量', data: [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0] },
        { name: '产品询盘量', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: '产品订单量', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
      ], ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);
      break;
    case 'articles':
      lineChart('chart-article', [{ name: '浏览量', data: [220, 250, 280, 260, 290, 310, 222], color: '#1565e8' }], d.dateFull);
      break;
    case 'hotlink-warning':
      lineChart('chart-hotlink', [{ name: '盗链次数', data: [62, 12, 35, 5, 2, 1, 0], color: '#1565e8' }], d.dates);
      break;
  }
  Object.values(charts).forEach(c => c && c.resize());
}

function navigate(pageId, breadcrumb) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const menuItem = document.querySelector(`[data-page="${pageId}"]`);
  if (menuItem) {
    menuItem.classList.add('active');
    const subParent = menuItem.closest('.menu-sub-children');
    if (subParent) {
      subParent.classList.add('open');
      const subNav = subParent.previousElementSibling;
      if (subNav && subNav.classList.contains('menu-sub-parent')) subNav.classList.add('open');
    }
    const parent = menuItem.closest('.menu-children');
    if (parent) {
      parent.classList.add('open');
      const p = parent.previousElementSibling;
      if (p) p.classList.add('open');
    }
  }
  const bc = document.getElementById('breadcrumb');
  if (bc && breadcrumb) bc.textContent = breadcrumb;
  setTimeout(() => {
    initPageCharts(pageId);
    if (pageId === 'system-settings') renderChannelRuleSets();
    if (pageId === 'ai-analyst') renderAiAnalystPage();
    if (pageId === 'ai-scene-detail' && AI_ANALYST.activeScene) {
      renderAiSceneDetail(AI_ANALYST.activeScene);
    }
  }, 100);
}

function toggleMenu(el) {
  el.classList.toggle('open');
  const children = el.nextElementSibling;
  if (children) children.classList.toggle('open');
}

function showModal(id) {
  document.getElementById(id).classList.add('show');
}

function hideModal(id) {
  document.getElementById(id).classList.remove('show');
}

function switchModalTab(modalId, tab) {
  const modal = document.getElementById(modalId);
  modal.querySelectorAll('.modal-side-item').forEach((t, i) => {
    t.classList.toggle('active', i === tab);
  });
  modal.querySelectorAll('.modal-tab-content').forEach((c, i) => {
    c.style.display = i === tab ? 'block' : 'none';
  });
}

function switchReportTab(tab) {
  document.querySelectorAll('#page-reports .tab').forEach((t, i) => {
    t.classList.toggle('active', i === tab);
  });
  document.getElementById('report-regular').style.display = tab === 0 ? 'block' : 'none';
  document.getElementById('report-custom').style.display = tab === 1 ? 'block' : 'none';
}

function initTables() {
  const convCols = (source) => [
    { label: '序号', key: (_, i) => i + 1 },
    { label: '机会标题', key: 'title' },
    { label: '来源链接', key: () => '-' },
    { label: '着陆页', render: r => `<span class="link">${r.landing}</span>` },
    { label: '转化页面', render: r => `<span class="link">${r.page}</span>` },
    { label: '国家/地区', key: 'country' },
    { label: '转化来源', key: 'source' },
    { label: '转化方式', key: 'method' },
    { label: '转化日期', key: 'date' },
    { label: '操作', render: (_, i) => sessionDetailLink(i, source), className: 'col-action' }
  ];

  document.getElementById('table-source-channel').innerHTML = renderTable(DEMO.channelData, [
    { label: '序号', key: (_, i) => i + 1 }, { label: '来源渠道', key: 'name' },
    { label: '浏览量', key: 'pv' }, { label: '访客量', key: 'uv' },
    { label: '平均页面停留时间', key: 'time' }, { label: '销售机会', key: 'opp' },
    { label: '订单量', key: 'orders' }, { label: '转化率', key: 'rate' }
  ], { total: 8 });

  document.getElementById('table-geo').innerHTML = renderTable(DEMO.geoData, [
    { label: '序号', key: (_, i) => i + 1 }, { label: '国家/地区', key: 'country' },
    { label: '浏览量', key: 'pv', tip: true }, { label: '访客量', key: 'uv', tip: true },
    { label: '平均页面停留时间', key: 'time' }, { label: '销售机会', key: 'opp' },
    { label: '订单量', key: 'orders' }, { label: '转化率', key: 'rate' }
  ], { total: 52 });

  document.getElementById('table-behavior').innerHTML = renderTable(DEMO.behaviorSessions, [
    { label: '序号', key: (_, i) => i + 1 },
    { label: '着陆页', render: r => `<span class="link">${r.landing}</span>` },
    { label: '来源渠道', key: 'channel' }, { label: '来源链接', key: 'link' },
    { label: '国家/地区', key: 'country' }, { label: '访问页数', key: 'pages' },
    { label: '访问时长', key: 'duration' }, { label: '访问开始时间', key: 'start' }
  ], { total: 1000 });

  document.getElementById('table-pages').innerHTML = renderTable(DEMO.pages, [
    { label: '序号', key: (_, i) => i + 1 },
    { label: '访问页面', render: r => `${pageIcon(r.type)} <span class="link">${r.url}</span>` },
    { label: '浏览量', key: 'pv' }, { label: '访客量', key: 'uv' },
    { label: '平均页面停留时间', key: 'time' }, { label: '销售机会', key: 'opp' },
    { label: '订单量', key: 'orders' }, { label: '转化率', key: 'rate' }
  ], { total: 1374 });

  document.getElementById('table-interaction').innerHTML =
    '<div class="table-toolbar"><span>互动来源：<select><option>全部</option></select></span><button class="btn">⬇ 下载</button></div>' +
    renderTable(DEMO.interactions, [
      { label: '序号', key: (_, i) => i + 1 }, { label: '互动标题', key: 'title' },
      { label: '落地页', render: r => `<span class="link">${r.landing}</span>` },
      { label: '互动页面', render: r => `<span class="link">${r.page}</span>` },
      { label: '来源链接', key: () => '-' }, { label: '国家/地区', key: 'country' },
      { label: '互动来源', key: 'source' }, { label: '互动方式', key: 'method' },
      { label: '互动日期', key: 'date' },
      { label: '操作', render: (_, i) => sessionDetailLink(i, 'interaction'), className: 'col-action' }
    ], { total: 185 });

  document.getElementById('table-landing').innerHTML = renderTable(DEMO.landingPages, [
    { label: '序号', key: (_, i) => i + 1 },
    { label: '着陆页', render: r => `<span class="link">${r.url}</span>` },
    { label: '会话数', key: 'sessions' }, { label: '每次会话浏览页数', key: 'pages' },
    { label: '平均页面停留时间', key: 'time' }, { label: '销售机会', key: 'opp' }, { label: '订单量', key: 'orders' }
  ], { total: 577 });

  document.getElementById('table-sales').innerHTML =
    '<div class="table-toolbar"><span>转化类型：<select><option>全部</option></select></span><button class="btn">⬇ 下载</button></div>' +
    renderTable(DEMO.opportunities, convCols('sales'), { total: 124 });

  document.getElementById('table-inquiry').innerHTML =
    '<div class="table-toolbar"><span>转化来源：<select><option>全部</option></select></span><button class="btn">⬇ 下载</button></div>' +
    renderTable(DEMO.opportunities, convCols('inquiry'), { total: 96 });

  document.getElementById('table-orders').innerHTML =
    '<div class="table-toolbar"><span>转化渠道：<select><option>全部</option></select></span><button class="btn">⬇ 下载</button></div>' +
    renderTable(DEMO.orders, [
      { label: '序号', key: (_, i) => i + 1 }, { label: '订单号', key: 'no' },
      { label: '来源层级', key: 'source' }, { label: '触点项', key: 'touch' },
      { label: '转化页面', key: 'page' }, { label: '国家/地区', key: 'country' },
      { label: '转化来源', key: 'conv' }, { label: '转化日期', key: 'date' },
      { label: '订单金额', key: 'amount' },
      { label: '操作', render: (_, i) => sessionDetailLink(i, 'order'), className: 'col-action' }
    ], { total: 235 });

  document.getElementById('table-products').innerHTML =
    '<div class="table-toolbar"><span>发布人：<select><option>请选择</option></select></span><button class="btn">⬇ 下载</button></div>' +
    renderTable(DEMO.products, [
      { label: '序号', key: (_, i) => i + 1 }, { label: '产品名称', key: 'name' },
      { label: '产品页面', render: r => `<span class="link">${r.page}</span>` },
      { label: '产品浏览量', key: 'views' }, { label: '产品询盘量', key: 'inquiry' },
      { label: '产品订单量', key: 'orders' }, { label: '发布人', key: 'publisher' }, { label: '发布日期', key: 'date' }
    ], { total: 2, pagination: false });

  document.getElementById('table-articles').innerHTML =
    '<div class="table-toolbar"><span>发布人：<select><option>请选择</option></select></span><button class="btn">⬇ 下载</button></div>' +
    renderTable(DEMO.articles, [
      { label: '序号', key: (_, i) => i + 1 },
      { label: '文章标题', render: r => `<span class="link">${r.title}</span>` },
      { label: '文章页面', render: r => `<span class="link">${r.page}</span>` },
      { label: '文章浏览量', key: 'views' }, { label: '发布人', key: 'publisher' }, { label: '发布日期', key: 'date' }
    ], { total: 581 });

  document.getElementById('hotlink-rank').innerHTML = DEMO.hotlinkRank.map(r =>
    `<tr><td>${r.site}</td><td>${r.count}</td></tr>`).join('');

  document.getElementById('table-hotlink').innerHTML = renderTable(DEMO.hotlinks, [
    { label: '序号', key: (_, i) => i + 1 }, { label: '盗链网站域名', key: 'domain' },
    { label: '原站域名', key: 'origin' }, { label: '盗链次数', key: 'count' },
    { label: '盗用时间', key: 'time' }, { label: '状态', render: r => `<span class="status-ok">${r.status}</span>` }
  ], { total: 11, pagination: false });

  document.getElementById('table-custom-reports').innerHTML = renderTable(DEMO.customReports, [
    { label: '生成日期', key: 'gen' }, { label: '统计时段', key: 'period' },
    { label: '操作', render: () => '<a class="link">下载</a> | <a class="link" style="color:#ff4d4f">删除</a>' }
  ], { pagination: false });
}

const CHANNEL_FIELDS = {
  utm_source: 'UTM Source',
  utm_medium: 'UTM Medium',
  utm_campaign: 'UTM Campaign',
  referrer: 'Referrer',
  landing_url: 'Landing Page URL'
};

const CHANNEL_FIELD_HINTS = {
  utm_source: '填写 URL 查询参数 utm_source 的值，如 google、facebook、newsletter',
  utm_medium: '填写 utm_medium 的值，如 cpc、email、qr_code、social',
  utm_campaign: '填写 utm_campaign 的活动名称，如 spring_sale、canton_fair',
  referrer: '填写来源页完整域名或 URL 片段，如 google.com、linkedin.com',
  landing_url: '填写访客首次进入的着陆页 URL 或路径片段，如 /product.html、gclid='
};

const CHANNEL_OPERATORS = {
  contains: '包含',
  not_contains: '不包含',
  exact: '完全等于',
  not_exact: '不等于',
  regex: '正则表达式',
  starts_with: '开头是',
  not_starts_with: '开头不是'
};

const CHANNEL_FALLBACK = {
  id: 'system-fallback',
  name: '系统默认归因',
  description: '以上规则均未命中时执行',
  locked: true,
  groups: []
};

const MAX_CUSTOM_RULE_SETS = 5;

function cloneRules(rules) {
  return rules.map(r => ({
    ...r,
    groups: r.groups.map(g => ({ conditions: g.conditions.map(c => ({ ...c })) }))
  }));
}

function getSystemDefaultRules() {
  return [
    {
      id: 'sys-paid-search', name: '付费搜索 · Google Ads', description: '识别含 gclid 的 Google 付费广告流量',
      locked: true,
      groups: [{ conditions: [{ field: 'landing_url', operator: 'contains', value: 'gclid=' }] }]
    },
    {
      id: 'sys-direct', name: '直接访问', description: 'Referrer 为空时归为直接访问',
      locked: true,
      groups: [{ conditions: [{ field: 'referrer', operator: 'exact', value: '' }] }]
    }
  ];
}

function getDefaultRuleSets() {
  return [{
    id: 'set-system-default',
    name: '系统默认方案',
    description: '领动预置的标准来源渠道归因规则，不可编辑或删除',
    type: 'system',
    locked: true,
    enabled: true,
    rules: getSystemDefaultRules()
  }];
}

let channelRuleSets = getDefaultRuleSets();
let activeRuleSetId = 'set-system-default';
let pendingEnableSetId = null;
let editingRuleId = null;
let dragRuleId = null;
let ruleSetModalMode = 'create';

function getActiveRuleSet() {
  return channelRuleSets.find(s => s.id === activeRuleSetId) || channelRuleSets[0];
}

function getActiveRules() {
  return getActiveRuleSet().rules;
}

function customRuleSetCount() {
  return channelRuleSets.filter(s => s.type !== 'system').length;
}

function formatRuleGroups(rule) {
  if (!rule.groups?.length) return '系统内置匹配逻辑';
  return rule.groups.map((g, gi) => {
    const inner = g.conditions.map((c, ci) => {
      const prefix = ci === 0 ? '' : ' <span class="badge-or">或</span> ';
      return `${prefix}<code>${CHANNEL_FIELDS[c.field]}</code> ${CHANNEL_OPERATORS[c.operator]} 「${c.value || '(空)'}」`;
    }).join('');
    const groupPrefix = gi === 0 ? 'IF ' : ' <span class="badge-and">且</span> ';
    return `${groupPrefix}( ${inner} )`;
  }).join('');
}

function getEnabledRuleSet() {
  return channelRuleSets.find(s => s.enabled) || channelRuleSets[0];
}

function renderRuleSetDropdown() {
  const trigger = document.getElementById('rule-set-trigger-label');
  const panel = document.getElementById('rule-set-panel');
  const desc = document.getElementById('rule-set-desc');
  const addRuleBtn = document.getElementById('btn-add-channel-rule');
  if (!panel) return;

  const active = getActiveRuleSet();
  const enabled = getEnabledRuleSet();
  if (trigger) {
    trigger.textContent = `${active.name}${active.id === enabled.id ? ' · 已启用' : ''}`;
  }
  if (desc) desc.textContent = active.description || '';
  if (addRuleBtn) addRuleBtn.style.display = active.locked ? 'none' : 'inline-flex';

  panel.innerHTML = channelRuleSets.map(s => `
    <div class="rule-set-option${s.id === activeRuleSetId ? ' active' : ''}" data-set-id="${s.id}">
      <div class="rule-set-option-head">
        <span class="name">${s.name}${s.type === 'system' ? '（系统）' : ''}</span>
        ${s.enabled
          ? '<span class="badge-enabled">已启用</span>'
          : `<button type="button" class="btn-enable-set" data-enable-id="${s.id}">启用</button>`}
      </div>
      <div class="rule-set-option-desc">${s.description || '—'}</div>
      <div class="rule-set-option-actions">
        ${s.locked ? '' : '<button type="button" data-action="settings">设置</button>'}
        <button type="button" data-action="copy">复制</button>
        ${s.locked ? '' : '<button type="button" data-action="delete" class="act-delete">删除</button>'}
      </div>
    </div>`).join('');

  panel.querySelectorAll('.rule-set-option').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.rule-set-option-actions') || e.target.closest('.btn-enable-set')) return;
      activeRuleSetId = el.dataset.setId;
      closeRuleSetDropdown();
      renderChannelRuleSets();
    });
  });
  panel.querySelectorAll('[data-action="settings"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      activeRuleSetId = btn.closest('.rule-set-option').dataset.setId;
      closeRuleSetDropdown();
      renderChannelRuleSets();
      openRuleSetModal('edit');
    });
  });
  panel.querySelectorAll('[data-action="copy"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      activeRuleSetId = btn.closest('.rule-set-option').dataset.setId;
      closeRuleSetDropdown();
      renderChannelRuleSets();
      openRuleSetModal('copy');
    });
  });
  panel.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      activeRuleSetId = btn.closest('.rule-set-option').dataset.setId;
      closeRuleSetDropdown();
      renderChannelRuleSets();
      deleteRuleSet();
    });
  });
  panel.querySelectorAll('.btn-enable-set').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      promptEnableRuleSet(btn.dataset.enableId);
    });
  });
}

function toggleRuleSetDropdown() {
  const panel = document.getElementById('rule-set-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
}

function closeRuleSetDropdown() {
  const panel = document.getElementById('rule-set-panel');
  if (panel) panel.hidden = true;
}

function promptEnableRuleSet(setId) {
  const target = channelRuleSets.find(s => s.id === setId);
  if (!target || target.enabled) return;
  pendingEnableSetId = setId;
  document.getElementById('enable-rule-set-text').innerHTML =
    `确定启用方案「<strong>${target.name}</strong>」吗？`;
  closeRuleSetDropdown();
  showModal('modal-enable-rule-set');
}

function confirmEnableRuleSet() {
  if (!pendingEnableSetId) return;
  channelRuleSets.forEach(s => { s.enabled = s.id === pendingEnableSetId; });
  activeRuleSetId = pendingEnableSetId;
  pendingEnableSetId = null;
  hideModal('modal-enable-rule-set');
  renderChannelRuleSets();
}

function renderChannelRuleSets() {
  renderRuleSetDropdown();
  renderChannelRules();
}

function renderChannelRules() {
  const list = document.getElementById('channel-rule-list');
  const fallback = document.getElementById('channel-rule-fallback');
  if (!list) return;

  const active = getActiveRuleSet();
  const rules = active.rules;

  list.innerHTML = rules.map((rule, index) => {
    const typeBadge = rule.locked
      ? '<span class="badge-system">系统规则</span>'
      : '<span class="badge-custom">自定义</span>';
    const dragHandle = rule.locked || active.locked
      ? '<span class="channel-rule-drag" title="不可拖拽">🔒</span>'
      : `<span class="channel-rule-drag" draggable="true" data-drag-id="${rule.id}">⠿</span>`;
    const actions = (rule.locked || active.locked) ? '' : `
      <div class="channel-rule-actions">
        <button class="btn-link" type="button" data-edit-rule="${rule.id}">编辑</button>
        <button class="btn-link" style="color:#ff4d4f" type="button" data-delete-rule="${rule.id}">删除</button>
      </div>`;
    return `
      <li class="channel-rule-item${rule.locked ? ' system-rule' : ''}" data-rule-id="${rule.id}" data-index="${index}">
        ${dragHandle}
        <div class="channel-rule-body">
          <div class="channel-rule-name">
            <span>${rule.name}</span>${typeBadge}
          </div>
          ${rule.description ? `<div class="channel-rule-desc-text">${rule.description}</div>` : ''}
          <div class="channel-rule-meta">${formatRuleGroups(rule)}</div>
        </div>
        ${actions}
      </li>`;
  }).join('');

  fallback.innerHTML = active.locked
    ? ''
    : `<strong>兜底规则（不可修改）：</strong>如果以上规则均不满足 → ${CHANNEL_FALLBACK.name}`;
  fallback.style.display = active.locked ? 'none' : '';

  list.querySelectorAll('[data-edit-rule]').forEach(btn => {
    btn.addEventListener('click', () => openChannelRuleModal(btn.dataset.editRule));
  });
  list.querySelectorAll('[data-delete-rule]').forEach(btn => {
    btn.addEventListener('click', () => deleteChannelRule(btn.dataset.deleteRule));
  });
  if (!active.locked) initChannelRuleDrag(list);
}

function initChannelRuleDrag(list) {
  list.querySelectorAll('[draggable="true"]').forEach(handle => {
    handle.addEventListener('dragstart', e => {
      dragRuleId = handle.dataset.dragId;
      handle.closest('.channel-rule-item')?.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    handle.addEventListener('dragend', () => {
      list.querySelectorAll('.channel-rule-item').forEach(el => el.classList.remove('dragging'));
      dragRuleId = null;
    });
  });
  list.querySelectorAll('.channel-rule-item:not(.system-rule)').forEach(item => {
    item.addEventListener('dragover', e => { if (dragRuleId) e.preventDefault(); });
    item.addEventListener('drop', e => {
      e.preventDefault();
      const rules = getActiveRules();
      const fromIdx = rules.findIndex(r => r.id === dragRuleId);
      const toIdx = rules.findIndex(r => r.id === item.dataset.ruleId);
      if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;
      if (rules[fromIdx].locked) return;
      const [moved] = rules.splice(fromIdx, 1);
      rules.splice(toIdx, 0, moved);
      renderChannelRules();
    });
  });
}

function parseTrafficContext(urlStr, referrerStr) {
  let landing = urlStr.trim();
  let referrer = referrerStr.trim();
  if (landing && !/^https?:\/\//i.test(landing)) landing = 'https://' + landing;
  let params = {};
  try {
    const u = new URL(landing || 'https://example.com/');
    u.searchParams.forEach((v, k) => { params[k.toLowerCase()] = v; });
    landing = u.href;
  } catch { params = {}; }
  return { landing, referrer, params };
}

function getFieldValue(field, ctx) {
  if (field === 'referrer') return ctx.referrer || '';
  if (field === 'landing_url') return ctx.landing || '';
  return ctx.params[field] || '';
}

function matchCondition(cond, ctx) {
  const val = getFieldValue(cond.field, ctx);
  const target = cond.value || '';
  switch (cond.operator) {
    case 'contains': return val.includes(target);
    case 'not_contains': return !val.includes(target);
    case 'exact': return val === target;
    case 'not_exact': return val !== target;
    case 'starts_with': return val.startsWith(target);
    case 'not_starts_with': return !val.startsWith(target);
    case 'regex':
      try { return new RegExp(target, 'i').test(val); } catch { return false; }
    default: return false;
  }
}

function matchRuleGroups(groups, ctx) {
  if (!groups?.length) return false;
  return groups.every(g => g.conditions.some(c => matchCondition(c, ctx)));
}

function evaluateChannelRules(ctx, rules) {
  for (const rule of rules) {
    if (matchRuleGroups(rule.groups, ctx)) {
      return { rule, name: rule.name };
    }
  }
  return { rule: CHANNEL_FALLBACK, name: CHANNEL_FALLBACK.name };
}

function runSandboxTest() {
  const url = document.getElementById('sandbox-test-url').value;
  const ref = document.getElementById('sandbox-test-referrer').value;
  const box = document.getElementById('sandbox-result');
  if (!url.trim()) {
    box.className = 'sandbox-result warn';
    box.innerHTML = '请先输入测试着陆页 URL';
    return;
  }
  const ctx = parseTrafficContext(url, ref);
  const result = evaluateChannelRules(ctx, getActiveRules());
  const isFallback = result.rule.id === CHANNEL_FALLBACK.id;
  box.className = 'sandbox-result success';
  box.innerHTML = `
    <div><strong>归因结果（${getActiveRuleSet().name}）：</strong>${result.name}</div>
    <div style="margin-top:8px;font-size:12px;color:${isFallback ? '#92400e' : '#166534'}">
      ${isFallback ? '未命中任何规则，已走系统默认归因。' : `命中规则：${result.rule.name}`}
    </div>`;
}

function defaultCondition() {
  return { field: 'utm_medium', operator: 'contains', value: '' };
}

function defaultGroup() {
  return { conditions: [defaultCondition()] };
}

function renderConditionGroups(groups) {
  const wrap = document.getElementById('rule-condition-groups');
  const data = groups?.length ? groups : [defaultGroup()];
  wrap.innerHTML = data.map((g, gi) => `
    <div class="condition-group" data-group-index="${gi}">
      <div class="condition-group-head">
        <span>条件组 ${gi + 1} <span class="badge-and">${gi === 0 ? 'IF' : '且'}</span></span>
        ${gi > 0 ? `<button type="button" class="btn-link condition-group-remove" data-gi="${gi}" style="color:#ff4d4f">删除组</button>` : ''}
      </div>
      <div class="condition-group-body">
        ${g.conditions.map((c, ci) => renderConditionSubRow(c, gi, ci)).join('')}
      </div>
      <button type="button" class="btn btn-ghost btn-add-or-cond" data-gi="${gi}" style="margin-top:8px">+ 添加「或」条件</button>
    </div>`).join('');

  wrap.querySelectorAll('.condition-group-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const gs = collectConditionGroups();
      gs.splice(+btn.dataset.gi, 1);
      renderConditionGroups(gs);
      updateGclidWarning();
    });
  });
  wrap.querySelectorAll('.btn-add-or-cond').forEach(btn => {
    btn.addEventListener('click', () => {
      const gs = collectConditionGroups();
      gs[+btn.dataset.gi].conditions.push(defaultCondition());
      renderConditionGroups(gs);
    });
  });
  wrap.querySelectorAll('.condition-sub-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const gs = collectConditionGroups();
      const gi = +btn.dataset.gi;
      const ci = +btn.dataset.ci;
      gs[gi].conditions.splice(ci, 1);
      if (!gs[gi].conditions.length) gs[gi].conditions.push(defaultCondition());
      renderConditionGroups(gs);
      updateGclidWarning();
    });
  });
  wrap.querySelectorAll('.cond-field').forEach(sel => {
    sel.addEventListener('change', e => updateFieldHint(e.target));
    updateFieldHint(sel);
  });
  wrap.querySelectorAll('select, input').forEach(el => {
    el.addEventListener('change', updateGclidWarning);
    el.addEventListener('input', updateGclidWarning);
  });
}

function renderConditionSubRow(c, gi, ci) {
  const orLabel = ci > 0 ? '<div class="condition-or-label">或</div>' : '';
  return `${orLabel}
    <div class="condition-sub-row" data-gi="${gi}" data-ci="${ci}">
      <select class="cond-field">${Object.entries(CHANNEL_FIELDS).map(([k, v]) =>
        `<option value="${k}"${c.field === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
      <select class="cond-operator">${Object.entries(CHANNEL_OPERATORS).map(([k, v]) =>
        `<option value="${k}"${c.operator === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
      <input type="text" class="cond-value" value="${c.value || ''}" placeholder="匹配值">
      ${ci > 0 ? `<button type="button" class="condition-remove condition-sub-remove" data-gi="${gi}" data-ci="${ci}">×</button>` : '<span></span>'}
      <div class="condition-field-hint"></div>
    </div>`;
}

function updateFieldHint(fieldSelect) {
  const row = fieldSelect.closest('.condition-sub-row');
  if (!row) return;
  const hint = row.querySelector('.condition-field-hint');
  if (hint) hint.textContent = CHANNEL_FIELD_HINTS[fieldSelect.value] || '';
}

function collectConditionGroups() {
  return [...document.querySelectorAll('#rule-condition-groups .condition-group')].map(gEl => ({
    conditions: [...gEl.querySelectorAll('.condition-sub-row')].map(row => ({
      field: row.querySelector('.cond-field').value,
      operator: row.querySelector('.cond-operator').value,
      value: row.querySelector('.cond-value').value
    }))
  }));
}

function updateGclidWarning() {
  const flat = collectConditionGroups().flatMap(g => g.conditions);
  const warn = flat.some(c =>
    (c.field === 'landing_url' && /gclid/i.test(c.value)) ||
    (c.operator === 'regex' && /gclid/i.test(c.value))
  );
  const el = document.getElementById('rule-gclid-warning');
  if (el) el.style.display = warn ? 'block' : 'none';
}

function openChannelRuleModal(ruleId) {
  if (getActiveRuleSet().locked) return;
  editingRuleId = ruleId || null;
  const rule = ruleId ? getActiveRules().find(r => r.id === ruleId) : null;
  document.getElementById('modal-channel-rule-title').textContent = rule ? '编辑归因规则' : '新建归因规则';
  document.getElementById('rule-name').value = rule ? rule.name : '';
  document.getElementById('rule-description').value = rule ? (rule.description || '') : '';
  renderConditionGroups(rule ? rule.groups.map(g => ({ conditions: g.conditions.map(c => ({ ...c })) })) : null);
  updateGclidWarning();
  showModal('modal-channel-rule');
}

function saveChannelRule() {
  const name = document.getElementById('rule-name').value.trim();
  const description = document.getElementById('rule-description').value.trim();
  const groups = collectConditionGroups();
  if (!name) { alert('请填写自定义名称'); return; }
  const invalid = groups.some(g => g.conditions.some(c => c.field !== 'referrer' && !c.value && !['exact', 'not_exact'].includes(c.operator)));
  if (invalid) { alert('请完善匹配条件'); return; }

  const payload = {
    id: editingRuleId || 'custom-' + Date.now(),
    name,
    description,
    locked: false,
    groups
  };

  const rules = getActiveRules();
  if (editingRuleId) {
    const idx = rules.findIndex(r => r.id === editingRuleId);
    if (idx >= 0) rules[idx] = payload;
  } else {
    rules.push(payload);
  }

  hideModal('modal-channel-rule');
  renderChannelRules();
  showModal('modal-channel-save-notice');
  editingRuleId = null;
}

function deleteChannelRule(id) {
  const active = getActiveRuleSet();
  if (active.locked) return;
  const rule = active.rules.find(r => r.id === id);
  if (!rule || rule.locked) return;
  if (!confirm(`确定删除规则「${rule.name}」吗？`)) return;
  active.rules = active.rules.filter(r => r.id !== id);
  renderChannelRules();
}

function openRuleSetModal(mode) {
  ruleSetModalMode = mode;
  const title = document.getElementById('modal-rule-set-title');
  const copyWrap = document.getElementById('rule-set-copy-wrap');
  const copySel = document.getElementById('rule-set-copy-from');
  const active = getActiveRuleSet();

  if (mode === 'edit') {
    title.textContent = '方案设置';
    document.getElementById('rule-set-name').value = active.name;
    document.getElementById('rule-set-description').value = active.description || '';
    copyWrap.style.display = 'none';
    showModal('modal-rule-set');
    return;
  }

  title.textContent = mode === 'copy' ? '复制来源渠道方案' : '新建来源渠道方案';
  document.getElementById('rule-set-name').value = mode === 'copy' ? active.name + '（副本）' : '';
  document.getElementById('rule-set-description').value = active.description || '';
  copySel.innerHTML = channelRuleSets.map(s =>
    `<option value="${s.id}"${s.id === activeRuleSetId ? ' selected' : ''}>${s.name}</option>`
  ).join('');
  copyWrap.style.display = 'block';
  if (mode === 'create' && customRuleSetCount() >= MAX_CUSTOM_RULE_SETS) {
    alert(`自定义方案最多 ${MAX_CUSTOM_RULE_SETS} 套`);
    return;
  }
  if (mode === 'copy' && customRuleSetCount() >= MAX_CUSTOM_RULE_SETS) {
    alert(`自定义方案最多 ${MAX_CUSTOM_RULE_SETS} 套`);
    return;
  }
  showModal('modal-rule-set');
}

function saveRuleSet() {
  const name = document.getElementById('rule-set-name').value.trim();
  const description = document.getElementById('rule-set-description').value.trim();

  if (ruleSetModalMode === 'edit') {
    const active = getActiveRuleSet();
    if (active.locked) return;
    if (!name) { alert('请填写方案名称'); return; }
    active.name = name;
    active.description = description;
    hideModal('modal-rule-set');
    renderChannelRuleSets();
    return;
  }

  const copyFromId = document.getElementById('rule-set-copy-from').value;
  if (!name) { alert('请填写方案名称'); return; }
  if (customRuleSetCount() >= MAX_CUSTOM_RULE_SETS) {
    alert(`自定义方案最多 ${MAX_CUSTOM_RULE_SETS} 套`); return;
  }
  const source = channelRuleSets.find(s => s.id === copyFromId) || getActiveRuleSet();
  const newSet = {
    id: 'set-' + Date.now(),
    name,
    description,
    type: 'custom',
    locked: false,
    enabled: false,
    rules: cloneRules(source.rules).map(r => ({ ...r, id: 'custom-' + Math.random().toString(36).slice(2, 9), locked: false }))
  };
  channelRuleSets.push(newSet);
  activeRuleSetId = newSet.id;
  hideModal('modal-rule-set');
  renderChannelRuleSets();
}

function deleteRuleSet() {
  const active = getActiveRuleSet();
  if (active.locked) return;
  if (!confirm(`确定删除方案「${active.name}」吗？`)) return;
  const wasEnabled = active.enabled;
  channelRuleSets = channelRuleSets.filter(s => s.id !== active.id);
  activeRuleSetId = 'set-system-default';
  if (wasEnabled) {
    channelRuleSets.forEach(s => { s.enabled = s.id === 'set-system-default'; });
  }
  renderChannelRuleSets();
}

function initChannelRulesPage() {
  document.getElementById('rule-set-trigger')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleRuleSetDropdown();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#rule-set-dropdown')) closeRuleSetDropdown();
  });
  document.getElementById('btn-confirm-enable-rule-set')?.addEventListener('click', confirmEnableRuleSet);
  document.getElementById('btn-new-rule-set')?.addEventListener('click', () => openRuleSetModal('create'));
  document.getElementById('btn-save-rule-set')?.addEventListener('click', saveRuleSet);
  document.getElementById('btn-add-channel-rule')?.addEventListener('click', () => openChannelRuleModal());
  document.getElementById('btn-sandbox-test')?.addEventListener('click', runSandboxTest);
  document.getElementById('btn-save-channel-rule')?.addEventListener('click', saveChannelRule);
  document.getElementById('btn-add-condition-group')?.addEventListener('click', () => {
    renderConditionGroups([...collectConditionGroups(), defaultGroup()]);
  });
}

/* ── AI数据分析师 V2.1 ── */
const AI_ANALYST = {
  product: 'AI数据分析师',
  billing: 'MoliAI',
  logo: 'moliai-logo.png',
  source: 'smartdata',
  accountId: 'demo@leadong.com',
  cache: {},
  reportHistory: [],
  taskStream: [],
  isPipelineRunning: false,
  activeScene: null,
  pendingSceneId: null,
  pipelineOnDateConfirm: null,
  sceneDateRange: null,
  freeQuestion: null,
  inputSubmitTimes: [],
  freeAskMode: false,
  fallbackReason: null,
  chatMessages: [],
  chatContext: null,
  simulateDelay: 1800,
  failRate: 0,
  pointCost: 1
};

const AI_PIPELINE_STEPS = [
  '分析意图',
  '获取数据',
  '绘制图表',
  '数据分析',
  '生成优化建议',
  '完成'
];

const AI_REPLY = {
  unmatched: '未能匹配到可执行的分析场景，无法绘制看板。',
  fallback: '服务暂不可用，请稍后再试。'
};

const AI_INPUT_LIMITS = {
  maxCharsPerMessage: 200,
  maxMessagesPerMinute: 10,
  maxContextChars: 10000
};

const AI_SCENE_APIS = {
  smartdata_global_7d: ['查询综合流量数据', '查询互动转化数据'],
  smartdata_channel: ['查询来源渠道数据'],
  smartdata_inquiry: ['查询询盘转化数据', '查询会话详情数据']
};

const AI_DEMO_FAIL_QUESTION = '近7日综合分析';

function getSceneApiTitles(sceneId) {
  return AI_SCENE_APIS[sceneId] || ['查询业务数据'];
}

function formatApiProgressLabel(title, status) {
  if (status === 'running') return `正在${title}`;
  if (status === 'done') return `已${title}`;
  return title;
}

function formatMissingParamsReply(sceneName, missingLabels) {
  const missing = missingLabels.join('、');
  const example = `近7日${sceneName}`;
  return `已识别您想进行「${sceneName}」，还缺少 ${missing} 信息，请在下方快捷选择，或在底部输入框补充完整需求（如：${example}）。`;
}

function formatLaunchReply(taskLabel) {
  return `已为您发起「${taskLabel}」，正在生成报告…`;
}

function getConversationUserInputs() {
  return AI_ANALYST.chatMessages
    .filter(m => m.role === 'user')
    .map(m => m.raw || String(m.content).replace(/<[^>]+>/g, ''));
}

function formatConversationQuestionDisplay() {
  const inputs = getConversationUserInputs();
  return inputs.length ? inputs.join(' → ') : '';
}

function formatConversationSummary(text) {
  const full = text || formatConversationQuestionDisplay();
  return { summary: full, full };
}

function bindUserQuestionDetailButton() {
  const textEl = document.getElementById('ai-report-user-question-text');
  const btn = document.getElementById('btn-user-question-detail');
  if (!textEl || !btn) return;
  requestAnimationFrame(() => {
    btn.hidden = textEl.scrollWidth <= textEl.clientWidth;
  });
}

function checkAiInputLimits(text) {
  if (text.length > AI_INPUT_LIMITS.maxCharsPerMessage) {
    return {
      ok: false,
      message: `输入内容过长，单次最多 ${AI_INPUT_LIMITS.maxCharsPerMessage} 个字符，请精简后重试。`
    };
  }
  const now = Date.now();
  AI_ANALYST.inputSubmitTimes = (AI_ANALYST.inputSubmitTimes || []).filter(t => now - t < 60000);
  if (AI_ANALYST.inputSubmitTimes.length >= AI_INPUT_LIMITS.maxMessagesPerMinute) {
    return {
      ok: false,
      message: `发送过于频繁，每分钟最多 ${AI_INPUT_LIMITS.maxMessagesPerMinute} 次，请稍后再试。`
    };
  }
  return { ok: true };
}

function recordAiInputSubmit() {
  AI_ANALYST.inputSubmitTimes = AI_ANALYST.inputSubmitTimes || [];
  AI_ANALYST.inputSubmitTimes.push(Date.now());
}

function showComposerInputHint(message) {
  const hint = document.getElementById('ai-composer-input-hint');
  if (!hint) return;
  hint.textContent = message;
  hint.hidden = false;
  clearTimeout(hint._hideTimer);
  hint._hideTimer = setTimeout(() => { hint.hidden = true; }, 4000);
}

async function runPipelineStepLoop(taskId, sceneId, { stopBeforeComplete = false } = {}) {
  const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
  if (!task) return;

  updateTaskStep(taskId, 0, 'running');
  await delay(300);

  const apis = getSceneApiTitles(sceneId || task.sceneId);
  task.apiProgress = apis.map(title => ({ title, status: 'pending' }));
  updateTaskStep(taskId, 1, 'running');
  for (let j = 0; j < apis.length; j++) {
    task.apiProgress[j].status = 'running';
    renderTaskStream();
    await delay(420);
    task.apiProgress[j].status = 'done';
    renderTaskStream();
    await delay(160);
  }

  if (stopBeforeComplete) return;

  task.llmBatchActive = true;
  task.step = 2;
  renderTaskStream();
  await delay(1400);
  task.llmBatchActive = false;
  task.step = 5;
  renderTaskStream();
  await delay(280);
}

function getPipelineStepState(i, currentStep, allDone, task) {
  if (allDone) return 'done';
  if (task?.llmBatchActive) {
    if (i >= 2 && i <= 4) return 'active';
    if (i < 2) return 'done';
    return 'pending';
  }
  if (i >= 2 && i <= 4 && currentStep >= 5) return 'done';
  if (i < currentStep) return 'done';
  if (i === currentStep) return 'active';
  return 'pending';
}

function createHistoryRecord({ sceneId, sceneName, question, start, end, status = 'running' }) {
  const id = 'rh_' + Date.now();
  const entry = {
    id,
    sceneId,
    sceneName: sceneName || '数据分析',
    question,
    start,
    end,
    cacheKey: sceneId ? aiCacheKey(sceneId) : '',
    generatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    status,
    account: AI_ANALYST.accountId
  };
  AI_ANALYST.reportHistory.unshift(entry);
  renderReportHistory();
  return id;
}

function updateHistoryRecord(id, patch) {
  const item = AI_ANALYST.reportHistory.find(h => h.id === id);
  if (!item) return;
  Object.assign(item, patch);
  renderReportHistory();
}

const AI_ICON_SVGS = {
  macro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16V9M12 16V5M17 16v-6"/></svg>',
  channel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  leads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  radar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-10"/><path d="M14 5h7v7"/></svg>',
  funnel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>'
};

function aiIconSvg(key, size) {
  const svg = AI_ICON_SVGS[key] || AI_ICON_SVGS.spark;
  const cls = size === 'lg' ? 'ai-icon-svg ai-icon-svg--lg' : size === 'cat' ? 'ai-icon-svg ai-icon-svg--cat' : 'ai-icon-svg';
  return `<span class="${cls}" aria-hidden="true">${svg}</span>`;
}

const AI_SCENE_CATALOG = [
  {
    id: 'macro', name: '宏观大盘类', iconKey: 'macro',
    scenes: [
      {
        id: 'smartdata_global_7d', name: '综合流量分析', iconKey: 'trend',
        description: '自选时段内的流量、互动、询盘全链路复盘，掌握业务健康度',
        active: true, timeType: 'selectable', systems: ['智慧数据']
      },
      {
        id: 'smartdata_global_yesterday', name: '昨日流量与转化日报', iconKey: 'macro',
        description: '每日晨会速览：昨日 PV/UV、询盘与销售机会表现',
        comingSoon: true, timeType: 'fixed', systems: ['智慧数据']
      }
    ]
  },
  {
    id: 'channel', name: '渠道与营销类', iconKey: 'channel',
    scenes: [
      {
        id: 'smartdata_channel', name: '来源渠道分析', iconKey: 'channel',
        description: '各渠道流量、互动率与询盘转化对比，识别优质渠道与虚荣流量',
        active: true, timeType: 'selectable', systems: ['智慧数据']
      },
      {
        id: 'smartdata_ad_anomaly', name: '付费广告异常流量排查', iconKey: 'alert',
        description: '聚焦付费搜索/社交，排查高流量零转化的预算浪费',
        comingSoon: true, timeType: 'selectable', systems: ['智慧数据', '广告智投']
      },
      {
        id: 'smartdata_geo', name: '全球地域分布洞察', iconKey: 'globe',
        description: '国家/地区流量与转化热力分析，发现高潜市场',
        comingSoon: true, timeType: 'selectable', systems: ['智慧数据']
      }
    ]
  },
  {
    id: 'leads', name: '转化与线索类', iconKey: 'leads',
    scenes: [
      {
        id: 'smartdata_inquiry', name: '询盘转化分析', iconKey: 'funnel',
        description: '表单询盘趋势、高峰日、来源渠道与着陆页贡献拆解',
        active: true, timeType: 'selectable', systems: ['智慧数据']
      },
      {
        id: 'smartdata_sales', name: '销售机会质量诊断', iconKey: 'target',
        description: '线索类型结构、高意向特征识别与销售跟进优先级',
        comingSoon: true, timeType: 'selectable', systems: ['智慧数据']
      },
      {
        id: 'smartdata_landing', name: '着陆页转化漏斗分析', iconKey: 'funnel',
        description: '高流量着陆页跳出与留资漏斗，定位转化断点',
        comingSoon: true, timeType: 'selectable', systems: ['智慧数据']
      }
    ]
  },
  {
    id: 'future', name: '潜客雷达类', iconKey: 'radar', badge: '即将接入',
    scenes: [
      {
        id: 'visitor_radar_leads', name: '高价值 B2B 潜客挖掘策略', iconKey: 'radar',
        description: '接入访客雷达后，自动识别高意向访客并生成跟进策略',
        comingSoon: true, timeType: 'selectable', systems: ['访客雷达']
      },
      {
        id: 'visitor_radar_intent', name: '访客意向评分与触达建议', iconKey: 'spark',
        description: '基于浏览深度与互动行为的潜客评分模型',
        comingSoon: true, timeType: 'selectable', systems: ['访客雷达', '智慧数据']
      }
    ]
  }
];

const AI_SCENES = AI_SCENE_CATALOG.flatMap(c => c.scenes);

function getAiScene(sceneId) {
  return AI_SCENES.find(s => s.id === sceneId);
}

function sceneMetaTags(scene) {
  const sys = (scene.systems || ['智慧数据']).map(s => `<span class="ai-scene-sys-tag">${s}</span>`).join('');
  const dateTag = scene.timeType === 'selectable'
    ? '<span class="ai-scene-time-tag">支持自定义日期</span>'
    : '<span class="ai-scene-time-tag ai-scene-time-tag--fixed">固定分析时段</span>';
  return `${sys}${dateTag}`;
}

function aiCacheKey(sceneId, range) {
  const r = range || getSceneDateRange();
  if (r.fixed) return `${AI_ANALYST.accountId}:${AI_ANALYST.source}:${sceneId}:${r.key}`;
  return `${AI_ANALYST.accountId}:${AI_ANALYST.source}:${sceneId}:${r.start}:${r.end}`;
}

function getSceneDateRange() {
  const scene = getAiScene(AI_ANALYST.activeScene);
  if (!scene) return { start: '2026-06-04', end: '2026-06-10', fixed: false };
  if (scene.timeType === 'fixed') {
    const key = scene.id === 'smartdata_global_yesterday' ? 'yesterday' : 'last_7d';
    return { fixed: true, key, label: scene.timeLabel || '固定时段' };
  }
  if (AI_ANALYST.sceneDateRange) {
    return { ...AI_ANALYST.sceneDateRange, fixed: false };
  }
  return { start: '2026-06-04', end: '2026-06-10', fixed: false };
}

function getActiveAiScenes() {
  return AI_SCENES.filter(s => s.active && !s.comingSoon);
}

function buildSceneQuickCardsInner(compact = false) {
  const scenes = getActiveAiScenes();
  if (compact) {
    return scenes.map(s => `
      <button type="button" class="ai-supplement-chip ai-recommend-scene-chip" data-scene-id="${s.id}">${s.name}</button>`).join('');
  }
  return scenes.map(s => `
    <button type="button" class="ai-scene-quick-card" data-scene-id="${s.id}">
      ${aiIconSvg(s.iconKey)}
      <span class="ai-scene-quick-card-body">
        <span class="ai-scene-quick-card-name">${s.name}</span>
        <span class="ai-scene-quick-card-desc">${s.description}</span>
      </span>
      <span class="ai-scene-quick-card-arrow" aria-hidden="true">›</span>
    </button>`).join('');
}

function buildSceneQuickCardsHtml() {
  return `<div class="ai-scene-quick-grid">${buildSceneQuickCardsInner(false)}</div>`;
}

function bindSceneQuickCards(root) {
  root?.querySelectorAll('.ai-scene-quick-card, .ai-recommend-scene-chip').forEach(btn => {
    btn.addEventListener('click', () => onQuickSceneClick(btn.dataset.sceneId));
  });
}

function buildSupportedScenesBlock(leadText, compact = false) {
  const label = leadText || '当前已支持的分析场景，可直接选择：';
  const items = buildSceneQuickCardsInner(compact);
  const listHtml = compact
    ? `<div class="ai-supplement-chips ai-recommend-scene-chips">${items}</div>`
    : `<div class="ai-scene-quick-grid">${items}</div>`;
  return `<div class="ai-supported-scenes-block">
    <p class="ai-supported-scenes-label">${label}</p>
    ${listHtml}
  </div>`;
}

function buildAiAvatarHtml(working) {
  const cls = working ? ' ai-scene-picker-avatar--working' : '';
  return `<div class="ai-scene-picker-avatar${cls}" aria-hidden="true">
    <img src="moliai-logo.png" alt="" width="40" height="40">
    <span class="ai-scene-picker-avatar-glow"></span>
    <span class="ai-scene-picker-avatar-ring"></span>
    ${working ? '<span class="ai-scene-picker-avatar-pulse"></span>' : ''}
  </div>`;
}

function isAiPipelineActive() {
  return AI_ANALYST.taskStream.some(t => t.status === 'running');
}

function getLastAnalysisTask() {
  const analysisTasks = AI_ANALYST.taskStream.filter(t => t.type === 'analysis');
  return analysisTasks.length ? analysisTasks[analysisTasks.length - 1] : null;
}

function buildComposerRunningPanelHtml() {
  return `
    <div class="ai-composer-running-panel ai-composer-running-panel--compact">
      <span class="ai-composer-border-glow" aria-hidden="true"></span>
      ${buildAiAvatarHtml(true)}
      <div class="ai-composer-running-body">
        <h3 class="ai-composer-running-title">任务执行中</h3>
        <p class="ai-composer-running-step">AI数据分析师 正在分析数据并撰写报告…</p>
      </div>
    </div>`;
}

function getComposerSessionState() {
  if (isAiPipelineActive()) return 'running';
  const lastAnalysis = getLastAnalysisTask();
  if (lastAnalysis?.status === 'done' || lastAnalysis?.status === 'failed') return 'hidden';
  return 'input';
}

function startNewAiConversation() {
  AI_ANALYST.taskStream = [];
  AI_ANALYST.chatMessages = [];
  AI_ANALYST.isPipelineRunning = false;
  AI_ANALYST.freeQuestion = null;
  AI_ANALYST.freeAskMode = false;
  AI_ANALYST.chatContext = null;
  AI_ANALYST.sceneDateRange = null;
  hideAiFreeAskSuggest();
  const input = document.getElementById('ai-free-question');
  if (input) input.value = '';
  renderTaskStream();
  renderComposerDock();
  renderWorkspaceHeaderActions();
}

function renderWorkspaceHeaderActions() {
  const newChatBtn = document.getElementById('btn-ai-new-chat');
  if (!newChatBtn) return;
  const show = AI_ANALYST.taskStream.length > 0 && !isAiPipelineActive();
  newChatBtn.hidden = !show;
}

function renderComposerDock() {
  const dock = document.getElementById('ai-composer-dock');
  const inputPanel = document.getElementById('ai-composer-input-panel');
  const runningPanel = document.getElementById('ai-composer-running-panel');
  const workspaceBody = document.querySelector('#page-ai-analyst .ai-workspace-body');
  if (!dock || !inputPanel) return;

  const state = getComposerSessionState();
  const showInput = state === 'input';
  const showRunning = state === 'running';

  dock.hidden = !showInput && !showRunning;
  inputPanel.hidden = !showInput;
  inputPanel.classList.toggle('is-composer-hidden', !showInput);
  dock.classList.toggle('ai-composer-dock--running-only', showRunning);
  dock.classList.toggle('ai-composer-dock--input-only', showInput);

  if (runningPanel) {
    runningPanel.hidden = !showRunning;
    runningPanel.classList.toggle('is-composer-hidden', !showRunning);
    if (showRunning) {
      runningPanel.innerHTML = buildComposerRunningPanelHtml();
    } else {
      runningPanel.innerHTML = '';
    }
  }

  dock.classList.toggle('ai-composer-dock--running', showRunning);
  workspaceBody?.classList.toggle('ai-workspace-body--composer-input', showInput || showRunning);
  workspaceBody?.classList.toggle('ai-workspace-body--composer-none', state === 'hidden');

  if (!showInput) hideAiFreeAskSuggest();
  renderWorkspaceHeaderActions();
}

function syncAiWorkspaceUiState() {
  const workspace = document.querySelector('#page-ai-analyst .ai-workspace');
  workspace?.classList.toggle('ai-workspace--running', isAiPipelineActive());
  renderComposerDock();
}

function renderScenePickerPanel() {
  const panel = document.getElementById('ai-scene-picker-panel');
  if (!panel) return;
  const hasTasks = AI_ANALYST.taskStream.length > 0;

  if (hasTasks) {
    panel.hidden = true;
    panel.innerHTML = '';
    syncAiWorkspaceUiState();
    return;
  }

  panel.hidden = false;
  const sceneCount = getActiveAiScenes().length;
  panel.innerHTML = `
    <div class="ai-scene-picker-hero">
      ${buildAiAvatarHtml(false)}
      <div class="ai-scene-picker-welcome">
        <h3 class="ai-scene-picker-greeting">你好，我是您的数据分析师</h3>
        <p class="ai-scene-picker-lead">有什么我可以帮你的吗？你可以在下方 <strong>${sceneCount} 个场景</strong> 中快捷选择，或者在下方输入框里发送你想要分析的 <strong>数据类型与日期</strong>。</p>
      </div>
    </div>
    ${buildSceneQuickCardsHtml()}`;
  bindSceneQuickCards(panel);
  syncAiWorkspaceUiState();
}

function renderAiAnalystPage() {
  renderTaskStream();
  renderReportHistory();
  initHistoryModal();
  syncAiWorkspaceUiState();
  renderWorkspaceHeaderActions();
}

function formatTaskTime(dateStr) {
  if (!dateStr) return '刚刚';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(d);
}

function scrollWorkspaceToEnd() {
  const scroller = document.querySelector('#page-ai-analyst .ai-workspace-body');
  if (!scroller) return;
  requestAnimationFrame(() => {
    scroller.scrollTop = scroller.scrollHeight;
  });
}

function renderTaskStream() {
  const box = document.getElementById('ai-task-stream');
  if (!box) return;

  if (!AI_ANALYST.taskStream.length) {
    box.innerHTML = '';
    renderScenePickerPanel();
    renderComposerDock();
    return;
  }

  renderScenePickerPanel();

  box.innerHTML = AI_ANALYST.taskStream.map(task => {
    const statusLabel = task.status === 'running' ? '执行中'
      : task.status === 'awaiting' ? '待补充'
      : task.status === 'done' ? '已完成' : '生成失败';
    const statusCls = `ai-task-card-status--${task.status}`;
    const cardCls = task.status === 'running' ? ' ai-task-card--running' : '';

    let body = '';
    if (task.type === 'insight') {
      body = `<div class="ai-task-card-body ai-task-reply"><div class="ai-task-reply-inner">${task.resultContent || ''}</div></div>`;
    } else if (task.status === 'running') {
      const launchLine = task.launchMessage
        ? `<p class="ai-task-launch-msg">${escapeHtml(task.launchMessage)}</p>` : '';
      body = `<div class="ai-task-card-body ai-task-reply ai-task-reply--running">
        <div class="ai-pipeline-card">
          <div class="ai-pipeline-title"><span class="ai-pipeline-spinner"></span>AI数据分析师 正在分析数据并撰写报告…</div>
          ${launchLine}
          <div class="ai-pipeline-steps">${renderPipelineStepsHtml(task.step, false, task)}</div>
        </div>
      </div>`;
    } else if (task.status === 'awaiting' && task.supplementHint) {
      body = `<div class="ai-task-card-body ai-task-reply"><div class="ai-task-reply-inner">${escapeHtml(task.supplementHint)}</div></div>`;
    } else if (task.resultContent) {
      body = `<div class="ai-task-card-body ai-task-reply"><div class="ai-task-reply-inner">${task.resultContent}</div></div>`;
    }

    const pipelineFold = task.type === 'analysis' && task.status === 'done'
      ? `<div class="ai-task-pipeline-fold">
          <button type="button" class="ai-task-pipeline-toggle" data-task-id="${task.id}" aria-expanded="${!task.pipelineCollapsed}">
            ${task.pipelineCollapsed ? '展开执行过程' : '收起执行过程'}
          </button>
          <div class="ai-task-pipeline-body" ${task.pipelineCollapsed ? 'hidden' : ''}>
            <div class="ai-pipeline-steps">${renderPipelineStepsHtml(AI_PIPELINE_STEPS.length - 1, true, task)}</div>
          </div>
        </div>`
      : '';

    const supplement = task.status === 'awaiting' && task.supplementOptions?.length
      ? `<div class="ai-task-recommend ai-task-recommend--chips">
          <div class="ai-task-recommend-label">系统推荐</div>
          <div class="ai-supplement-chips">
            ${task.supplementOptions.map(opt => `
              <button type="button" class="ai-supplement-chip" data-task-id="${task.id}" data-value="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`).join('')}
          </div>
        </div>`
      : '';

    const scenesCompact = !!task.showSupportedScenes;
    const supportedScenes = task.showSupportedScenes
      ? (scenesCompact
        ? `<div class="ai-task-recommend ai-task-recommend--chips">
            <div class="ai-task-recommend-label">系统推荐</div>
            <div class="ai-supplement-chips">
              ${buildSceneQuickCardsInner(true)}
            </div>
          </div>`
        : `<div class="ai-task-recommend ai-task-recommend--scenes">
            <div class="ai-task-recommend-label">系统推荐</div>
            ${buildSupportedScenesBlock(task.supportedScenesLead, false)}
          </div>`)
      : '';

    const failedActions = task.status === 'failed'
      ? `<div class="ai-task-actions">
          <button type="button" class="btn-ai-entry btn-task-regenerate" data-task-id="${task.id}">重新生成</button>
        </div>`
      : '';

    const actions = task.status === 'done' && task.sceneId
      ? `<div class="ai-task-actions">
          <button type="button" class="btn-ai-entry btn-task-open-report" data-task-id="${task.id}">查看完整分析报告</button>
          <button type="button" class="btn-ai-task-new-chat">开启新对话</button>
        </div>`
      : '';

    return `<article class="ai-task-card${cardCls}" data-task-id="${task.id}">
      <div class="ai-task-card-head">
        <div class="ai-task-card-icon">${aiIconSvg(task.iconKey || 'spark')}</div>
        <div class="ai-task-card-meta">
          <div class="ai-task-card-label">${task.type === 'insight' ? '补充说明' : '分析任务'}</div>
          <div class="ai-task-card-query">${escapeHtml(task.question)}</div>
        </div>
        <span class="ai-task-card-status ${statusCls}">${statusLabel}</span>
        <span class="ai-task-card-time">${formatTaskTime(task.createdAt)}</span>
      </div>
      ${body}
      ${pipelineFold}
      ${supplement}
      ${supportedScenes}
      ${actions}
      ${failedActions}
    </article>`;
  }).join('');

  box.querySelectorAll('.btn-task-regenerate').forEach(btn => {
    btn.addEventListener('click', () => {
      const task = AI_ANALYST.taskStream.find(t => t.id === btn.dataset.taskId);
      regenerateFromTask(task);
    });
  });
  box.querySelectorAll('.btn-task-open-report').forEach(btn => {
    btn.addEventListener('click', () => openReportFromTask(btn.dataset.taskId));
  });
  box.querySelectorAll('.btn-ai-task-new-chat').forEach(btn => {
    btn.addEventListener('click', startNewAiConversation);
  });
  box.querySelectorAll('.ai-task-pipeline-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const task = AI_ANALYST.taskStream.find(t => t.id === btn.dataset.taskId);
      if (!task) return;
      task.pipelineCollapsed = !task.pipelineCollapsed;
      renderTaskStream();
    });
  });
  box.querySelectorAll('.ai-supplement-chip:not(.ai-recommend-scene-chip)').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('ai-free-question');
      if (input) input.value = btn.dataset.value;
      submitFreeQuestion();
    });
  });
  bindSceneQuickCards(box);
  scrollWorkspaceToEnd();
  renderComposerDock();
}

function openReportFromTask(taskId) {
  const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
  if (!task?.sceneId) return;
  AI_ANALYST.freeQuestion = task.conversationQuestion || formatConversationQuestionDisplay() || task.question;
  AI_ANALYST.freeAskMode = true;
  if (task.dateRange) AI_ANALYST.sceneDateRange = task.dateRange;
  openAiScene(task.sceneId);
}

function openReportFromMessage(msgIdx, sceneId) {
  openReportFromTask(AI_ANALYST.taskStream.find(t => t.sceneId === sceneId && t.status === 'done')?.id);
}

function initHistoryModal() {
  const openBtn = document.getElementById('btn-ai-history-open');
  if (!openBtn || openBtn.dataset.bound) return;
  openBtn.dataset.bound = '1';
  openBtn.addEventListener('click', () => {
    renderReportHistory();
    showModal('modal-ai-report-history');
  });
}

function renderPipelineStepsHtml(currentStep, allDone, task) {
  return AI_PIPELINE_STEPS.map((label, i) => {
    const state = getPipelineStepState(i, currentStep, allDone, task);
    const icon = state === 'done' ? '✓' : state === 'active' ? '…' : (i + 1);
    const subSteps = (i === 1 && task?.apiProgress?.length)
      ? `<div class="ai-pipeline-substeps">${task.apiProgress.map(api => {
          const subState = api.status === 'done' ? 'done' : api.status === 'running' ? 'active' : 'pending';
          const subIcon = api.status === 'done' ? '✓' : api.status === 'running' ? '…' : '·';
          return `<div class="ai-pipeline-substep ai-pipeline-substep--${subState}">
            <span class="ai-pipeline-substep-icon">${subIcon}</span>
            <span>${formatApiProgressLabel(api.title, api.status)}</span>
          </div>`;
        }).join('')}</div>`
      : '';
    return `<div class="ai-pipeline-step ai-pipeline-step--${state}">
      <span class="ai-pipeline-step-icon">${icon}</span>
      <span>${label}</span>
      ${subSteps}
    </div>`;
  }).join('');
}

function hasDateInQuestion(text) {
  return /近\s*\d+\s*日|上周|本月|上月|上季度|\d{4}-\d{2}-\d{2}/.test(text || '');
}

function isNewAnalysisRequest(text) {
  if (hasDateInQuestion(text)) return true;
  if (/综合分析|综合流量|来源渠道|询盘转化|渠道分析|时段综合/.test(text)) return true;
  return classifyFreeQuestion(text).supported;
}

function buildDateSupplementOptions(sceneId) {
  const scene = getAiScene(sceneId);
  const name = scene?.name || '数据分析';
  const presets = ['近7日', '近30日', '上周', '本月', '上月', '上季度'];
  if (sceneId === 'smartdata_channel') return presets.map(p => `${p}来源渠道分析`);
  if (sceneId === 'smartdata_inquiry') return presets.map(p => `${p}询盘转化分析`);
  return presets.map(p => `${p}${name}`);
}

function buildSceneSupplementOptions() {
  return getActiveAiScenes().flatMap(s => {
    if (s.id === 'smartdata_channel') return ['近7日来源渠道分析', '近30日来源渠道分析'];
    if (s.id === 'smartdata_inquiry') return ['近7日询盘转化分析', '近30日询盘转化分析'];
    return ['近7日综合分析', '近30日综合分析'];
  });
}

function validateAnalysisIntent(question) {
  const text = (question || '').trim();
  if (!text) return { ok: false, reason: 'empty' };

  for (const rule of AI_FREE_ASK_UNSUPPORTED) {
    if (rule.pattern.test(text)) {
      return { ok: false, type: 'out_of_scope', label: rule.label };
    }
  }

  const classified = classifyFreeQuestion(text);
  const hasDate = hasDateInQuestion(text);

  if (classified.supported && !hasDate) {
    return {
      ok: false,
      type: 'need_date',
      sceneId: classified.sceneId,
      sceneName: getAiScene(classified.sceneId)?.name,
      question: text,
      options: buildDateSupplementOptions(classified.sceneId)
    };
  }

  if (hasDate && !classified.supported) {
    return {
      ok: false,
      type: 'need_scene',
      question: text,
      options: buildSceneSupplementOptions()
    };
  }

  if (!classified.supported) {
    return { ok: false, type: 'no_match', question: text };
  }

  return { ok: true, classified };
}

function renderConversationFeed() {
  renderTaskStream();
}

function updateTaskStep(taskId, step, status) {
  const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
  if (task) {
    task.step = step;
    if (status) task.status = status;
  }
  renderTaskStream();
}

function openReportFromHistory(historyId) {
  const item = AI_ANALYST.reportHistory.find(h => h.id === historyId);
  if (!item) return;
  AI_ANALYST.sceneDateRange = { start: item.start, end: item.end };
  AI_ANALYST.freeQuestion = item.question;
  AI_ANALYST.freeAskMode = true;
  AI_ANALYST.chatMessages = item.question
    ? [{ role: 'user', content: escapeHtml(item.question), raw: item.question, at: item.generatedAt }]
    : [];
  AI_ANALYST.activeScene = item.sceneId;
  openAiScene(item.sceneId);
}

function exportReportFromHistory(historyId) {
  hideModal('modal-ai-report-history');
  AI_ANALYST.pendingHistoryExport = historyId;
  openReportFromHistory(historyId);
}

function maybeTriggerPendingHistoryExport() {
  const historyId = AI_ANALYST.pendingHistoryExport;
  if (!historyId) return;
  AI_ANALYST.pendingHistoryExport = null;
  setTimeout(() => exportAiReportPdf(), 450);
}

function formatHistoryStatus(status) {
  const map = { done: '已完成', running: '生成中', failed: '生成失败' };
  return map[status] || '已完成';
}

function historyStatusClass(status) {
  if (status === 'running') return 'ai-history-status--running';
  if (status === 'failed') return 'ai-history-status--failed';
  return 'ai-history-status--done';
}

function addReportToHistory(entry) {
  const full = {
    status: 'done',
    account: AI_ANALYST.accountId,
    ...entry
  };
  const exists = AI_ANALYST.reportHistory.find(h => h.cacheKey === full.cacheKey);
  if (exists) {
    exists.generatedAt = full.generatedAt;
    exists.status = full.status || exists.status;
    renderReportHistory();
    return exists;
  }
  AI_ANALYST.reportHistory.unshift(full);
  renderReportHistory();
  return full;
}

function renderReportHistory() {
  const list = document.getElementById('ai-report-history-list');
  const badge = document.getElementById('ai-history-badge');
  if (!list) return;
  const count = AI_ANALYST.reportHistory.length;
  if (badge) {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }
  if (!count) {
    list.innerHTML = '<div class="ai-history-modal-empty"><span class="ai-history-empty-icon" aria-hidden="true">📋</span><p>暂无分析记录，完成首次分析后将显示在这里</p></div>';
    return;
  }
  list.innerHTML = `
    <table class="ai-history-table">
      <thead>
        <tr>
          <th>任务名称</th>
          <th>状态</th>
          <th>分析日期</th>
          <th>提交账号</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${AI_ANALYST.reportHistory.map(h => `
          <tr data-history-id="${h.id}">
            <td>
              <div class="ai-history-task-name">${escapeHtml(h.sceneName)}</div>
              <div class="ai-history-task-range">${h.start} ~ ${h.end}</div>
            </td>
            <td><span class="ai-history-status ${historyStatusClass(h.status)}">${formatHistoryStatus(h.status)}</span></td>
            <td class="ai-history-date">${formatMetaDate(h.generatedAt)}</td>
            <td class="ai-history-account">${escapeHtml(h.account || AI_ANALYST.accountId)}</td>
            <td>
              <div class="ai-history-actions">
                ${h.status === 'failed' ? `
                  <button type="button" class="ai-history-action-btn ai-history-action-btn--primary" data-action="regenerate" data-history-id="${h.id}">重新生成</button>
                ` : h.status === 'running' ? `
                  <button type="button" class="ai-history-action-btn" data-action="view" data-history-id="${h.id}">查看进度</button>
                ` : `
                  <button type="button" class="ai-history-action-btn ai-history-action-btn--primary" data-action="view" data-history-id="${h.id}">查看报告</button>
                  <button type="button" class="ai-history-action-btn" data-action="export" data-history-id="${h.id}">导出 PDF</button>
                  <button type="button" class="ai-history-action-btn" data-action="regenerate" data-history-id="${h.id}">重新生成</button>
                `}
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  list.querySelectorAll('[data-action="regenerate"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = AI_ANALYST.reportHistory.find(h => h.id === btn.dataset.historyId);
      regenerateFromHistory(item);
    });
  });
  list.querySelectorAll('[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      hideModal('modal-ai-report-history');
      openReportFromHistory(btn.dataset.historyId);
    });
  });
  list.querySelectorAll('[data-action="export"]').forEach(btn => {
    btn.addEventListener('click', () => exportReportFromHistory(btn.dataset.historyId));
  });
}

function regenerateFromHistory(item) {
  if (!item) return;
  hideModal('modal-ai-report-history');
  if (document.getElementById('page-ai-scene-detail')?.classList.contains('active')) {
    goBackToAiScenes();
  }
  navigate('ai-analyst', 'AI数据分析师');
  AI_ANALYST.sceneDateRange = { start: item.start, end: item.end };
  AI_ANALYST.freeQuestion = item.question;
  AI_ANALYST.freeAskMode = true;
  AI_ANALYST.taskStream = [];
  AI_ANALYST.isPipelineRunning = false;
  AI_ANALYST.chatMessages = item.question
    ? [{ role: 'user', content: escapeHtml(item.question), raw: item.question, at: new Date().toISOString() }]
    : [];
  renderTaskStream();
  renderComposerDock();
  runAnalysisPipeline({
    question: item.question,
    sceneId: item.sceneId,
    keepDateRange: true,
    forceRegenerate: item.status === 'done',
    reuseHistoryId: item.status === 'failed' ? item.id : undefined
  });
}

function regenerateFromTask(task) {
  if (!task) return;
  AI_ANALYST.taskStream = AI_ANALYST.taskStream.filter(t => t.id !== task.id);
  if (task.dateRange) AI_ANALYST.sceneDateRange = { ...task.dateRange };
  runAnalysisPipeline({
    question: task.question,
    sceneId: task.sceneId || null,
    keepDateRange: !!task.dateRange,
    reuseHistoryId: task.historyId && task.status === 'failed' ? task.historyId : undefined
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updatePipelineMessage(taskId, step, status) {
  updateTaskStep(taskId, step, status);
}

async function runDemoFailedAnalysis(question) {
  AI_ANALYST.isPipelineRunning = true;
  const taskId = 'task_' + Date.now();
  const scene = getAiScene('smartdata_global_7d');
  AI_ANALYST.sceneDateRange = getAiDatePresets()['近7日'];
  AI_ANALYST.taskStream.push({
    id: taskId,
    type: 'analysis',
    question,
    sceneId: 'smartdata_global_7d',
    iconKey: scene?.iconKey || 'spark',
    step: 0,
    status: 'running',
    pipelineCollapsed: false,
    launchMessage: formatLaunchReply(question),
    dateRange: { ...AI_ANALYST.sceneDateRange },
    createdAt: new Date().toISOString()
  });
  AI_ANALYST.chatMessages.push({ role: 'user', content: escapeHtml(question), raw: question, at: new Date().toISOString() });
  const historyId = createHistoryRecord({
    sceneId: 'smartdata_global_7d',
    sceneName: '综合流量分析',
    question,
    start: AI_ANALYST.sceneDateRange.start,
    end: AI_ANALYST.sceneDateRange.end,
    status: 'running'
  });
  renderTaskStream();
  try {
    await runPipelineStepLoop(taskId, 'smartdata_global_7d', { stopBeforeComplete: true });
    const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
    if (!task) return;
    task.status = 'failed';
    task.pipelineCollapsed = true;
    task.resultContent = `<p>${AI_REPLY.fallback}</p>`;
    updateHistoryRecord(historyId, { status: 'failed' });
    renderTaskStream();
  } finally {
    AI_ANALYST.isPipelineRunning = false;
    renderScenePickerPanel();
    syncAiWorkspaceUiState();
  }
}

async function runAnalysisPipeline({ question, sceneId: forcedSceneId, keepDateRange, forceRegenerate, reuseHistoryId }) {
  if (AI_ANALYST.isPipelineRunning) return;

  const trimmed = (question || '').trim();
  if (!forcedSceneId && trimmed === AI_DEMO_FAIL_QUESTION) {
    await runDemoFailedAnalysis(trimmed);
    return;
  }

  if (!forcedSceneId) {
    const followUp = tryChatFollowUp(question, AI_ANALYST.chatMessages);
    const lastAnalysis = getLastAnalysisTask();
    const canFollowUp = followUp && lastAnalysis?.status === 'done';
    if (canFollowUp) {
      AI_ANALYST.taskStream.push({
        id: 'ins_' + Date.now(),
        type: 'insight',
        question,
        status: 'done',
        resultContent: followUp.content,
        createdAt: new Date().toISOString()
      });
      AI_ANALYST.chatMessages.push({ role: 'user', content: escapeHtml(question), raw: question });
      AI_ANALYST.chatMessages.push(followUp);
      renderTaskStream();
      return;
    }
  }

  if (!forcedSceneId) {
    const validation = validateAnalysisIntent(question);
    if (!validation.ok) {
      const taskId = 'task_' + Date.now();
      let hint = '';
      let options = [];
      if (validation.type === 'need_date') {
        hint = formatMissingParamsReply(validation.sceneName, ['分析时段']);
        options = validation.options;
      } else if (validation.type === 'need_scene') {
        hint = AI_REPLY.unmatched;
        options = validation.options;
        AI_ANALYST.taskStream.push({
          id: taskId,
          type: 'analysis',
          question,
          status: 'awaiting',
          iconKey: 'spark',
          supplementHint: hint,
          supplementOptions: options,
          showSupportedScenes: true,
          supportedScenesLead: '系统推荐',
          createdAt: new Date().toISOString()
        });
        AI_ANALYST.chatMessages.push({ role: 'user', content: escapeHtml(question), raw: question, at: new Date().toISOString() });
        renderTaskStream();
        return;
      } else if (validation.type === 'out_of_scope' || validation.type === 'no_match') {
        AI_ANALYST.taskStream.push({
          id: taskId,
          type: 'analysis',
          question,
          status: 'awaiting',
          iconKey: 'alert',
          supplementHint: AI_REPLY.unmatched,
          showSupportedScenes: true,
          supportedScenesLead: '系统推荐',
          createdAt: new Date().toISOString()
        });
        AI_ANALYST.chatMessages.push({ role: 'user', content: escapeHtml(question), raw: question, at: new Date().toISOString() });
        renderTaskStream();
        return;
      }
      AI_ANALYST.taskStream.push({
        id: taskId,
        type: 'analysis',
        question,
        status: 'awaiting',
        iconKey: 'spark',
        supplementHint: hint,
        supplementOptions: options,
        sceneId: validation.sceneId || null,
        createdAt: new Date().toISOString()
      });
      AI_ANALYST.chatMessages.push({ role: 'user', content: escapeHtml(question), raw: question, at: new Date().toISOString() });
      renderTaskStream();
      return;
    }
  }

  AI_ANALYST.isPipelineRunning = true;
  const taskId = 'task_' + Date.now();
  const scene = forcedSceneId ? getAiScene(forcedSceneId) : null;
  if (!keepDateRange) {
    AI_ANALYST.sceneDateRange = parseSceneDateRangeFromQuestion(question);
  }

  const taskLabel = scene
    ? `${scene.name}（${AI_ANALYST.sceneDateRange?.start || ''} ~ ${AI_ANALYST.sceneDateRange?.end || ''}）`
    : question;

  AI_ANALYST.taskStream.push({
    id: taskId,
    type: 'analysis',
    question,
    sceneId: forcedSceneId || null,
    iconKey: scene?.iconKey || 'spark',
    step: 0,
    status: 'running',
    pipelineCollapsed: false,
    launchMessage: formatLaunchReply(taskLabel),
    dateRange: AI_ANALYST.sceneDateRange ? { ...AI_ANALYST.sceneDateRange } : null,
    createdAt: new Date().toISOString()
  });
  AI_ANALYST.chatMessages.push({ role: 'user', content: escapeHtml(question), raw: question, at: new Date().toISOString() });
  renderTaskStream();

  const provisionalSceneId = forcedSceneId || classifyFreeQuestion(question).sceneId;
  const provisionalScene = provisionalSceneId ? getAiScene(provisionalSceneId) : null;
  let historyId;
  if (reuseHistoryId) {
    historyId = reuseHistoryId;
    updateHistoryRecord(historyId, {
      status: 'running',
      generatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
    });
  } else {
    historyId = createHistoryRecord({
      sceneId: provisionalSceneId || '',
      sceneName: provisionalScene?.name || taskLabel,
      question,
      start: AI_ANALYST.sceneDateRange?.start || '',
      end: AI_ANALYST.sceneDateRange?.end || '',
      status: 'running'
    });
  }
  const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
  if (task) task.historyId = historyId;

  try {
    await runPipelineStepLoop(taskId, provisionalSceneId || forcedSceneId);

    const result = forcedSceneId
      ? { supported: true, sceneId: forcedSceneId, question }
      : classifyFreeQuestion(question);

    const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
    if (!task) return;

    if (!result.supported) {
      task.status = 'awaiting';
      task.supplementHint = AI_REPLY.unmatched;
      task.showSupportedScenes = true;
      task.supportedScenesLead = '系统推荐';
      delete task.launchMessage;
      updateHistoryRecord(historyId, { status: 'failed' });
      renderTaskStream();
      return;
    }

    const matchedScene = getAiScene(result.sceneId);
    if (!keepDateRange && !task.dateRange) {
      AI_ANALYST.sceneDateRange = parseSceneDateRangeFromQuestion(question);
      task.dateRange = { ...AI_ANALYST.sceneDateRange };
    }
    task.sceneId = result.sceneId;
    task.iconKey = matchedScene?.iconKey || 'spark';
    AI_ANALYST.activeScene = result.sceneId;
    AI_ANALYST.chatContext = { sceneId: result.sceneId, sceneName: matchedScene?.name };
    AI_ANALYST.freeAskMode = true;
    AI_ANALYST.freeQuestion = question;

    const cacheKey = aiCacheKey(result.sceneId);
    if (forceRegenerate) delete AI_ANALYST.cache[cacheKey];
    await aiRequest(result.sceneId, !!forceRegenerate, cacheKey);

    updateHistoryRecord(historyId, {
      status: 'done',
      sceneId: result.sceneId,
      sceneName: matchedScene?.name || '数据分析',
      question: formatConversationQuestionDisplay() || question,
      start: task.dateRange?.start || AI_ANALYST.sceneDateRange.start,
      end: task.dateRange?.end || AI_ANALYST.sceneDateRange.end,
      cacheKey,
      generatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
    });

    task.status = 'done';
    task.step = AI_PIPELINE_STEPS.length - 1;
    task.pipelineCollapsed = true;
    task.conversationQuestion = formatConversationQuestionDisplay() || question;
    AI_ANALYST.freeQuestion = task.conversationQuestion;
    task.resultContent = buildChatSupportedReply(result.sceneId, task.conversationQuestion);
    AI_ANALYST.chatMessages.push({
      role: 'assistant',
      type: 'supported',
      sceneId: result.sceneId,
      content: task.resultContent
    });
    renderTaskStream();
  } catch {
    const task = AI_ANALYST.taskStream.find(t => t.id === taskId);
    if (task) {
      task.status = 'failed';
      task.pipelineCollapsed = true;
      task.resultContent = `<p>${AI_REPLY.fallback}</p>`;
      if (task.historyId) updateHistoryRecord(task.historyId, { status: 'failed' });
      renderTaskStream();
    }
  } finally {
    AI_ANALYST.isPipelineRunning = false;
    renderScenePickerPanel();
    syncAiWorkspaceUiState();
  }
}

function onQuickSceneClick(sceneId) {
  const scene = getAiScene(sceneId);
  if (!scene || !scene.active) return;
  AI_ANALYST.pendingSceneId = sceneId;
  AI_ANALYST.pipelineOnDateConfirm = ({ start, end }) => {
    AI_ANALYST.sceneDateRange = { start, end };
    runAnalysisPipeline({
      question: `${scene.name}（${start} ~ ${end}）`,
      sceneId,
      keepDateRange: true
    });
  };
  showAiSceneDateModal(sceneId);
}

function renderAiSceneList() {
  renderAiAnalystPage();
}

const AI_FREE_ASK_UNSUPPORTED = [
  { pattern: /竞品|竞争对手|同行网站/i, label: '竞品对比分析' },
  { pattern: /预测|预估|明年|下季度|forecast/i, label: '趋势预测' },
  { pattern: /收录|索引量|seo\s*排名|关键词排名|搜索排名/i, label: 'SEO 收录与排名' },
  { pattern: /订单金额|成交额|gmv|营收|客单价/i, label: '交易与营收数据' },
  { pattern: /广告\s*roi|投放回报|广告智投/i, label: '广告 ROI 分析' },
  { pattern: /访客雷达|潜客雷达|高意向访客/i, label: '访客雷达数据' },
  { pattern: /热链|盗链/i, label: '热链防盗数据' }
];

const AI_FREE_ASK_SCENE_KEYWORDS = {
  smartdata_global_7d: [/近\s*7\s*日|近\s*30\s*日|最近一周|周度|本周|时段|流量走势|整体表现|大盘|pv|uv|访客数|会话|销售机会|网站互动|综合分析/i],
  smartdata_channel: [/渠道|来源渠道|来源|引荐|直访|自然搜索|付费搜索|付费社交|utm|投放|流量结构/i],
  smartdata_inquiry: [/询盘|表单|留资|转化分析|转化漏斗|高峰日|着陆页|表单提交/i]
};

const AI_FREE_ASK_SUGGESTIONS = [
  '近7日综合分析',
  '近30日综合分析',
  '近30日来源渠道分析',
  '近30日询盘转化分析'
];

function parseSceneDateRangeFromQuestion(text) {
  if (/近\s*7\s*日/.test(text)) return getAiDatePresets()['近7日'];
  if (/近\s*30\s*日/.test(text)) return getAiDatePresets()['近30日'];
  if (/上周/.test(text)) return getAiDatePresets()['上周'];
  if (/本月/.test(text)) return getAiDatePresets()['本月'];
  if (/上月/.test(text)) return getAiDatePresets()['上月'];
  if (/上季度/.test(text)) return getAiDatePresets()['上季度'];
  return { start: '2026-06-04', end: '2026-06-10' };
}

function renderAiFreeAskSuggestions() {
  const sceneList = document.getElementById('ai-free-ask-suggest-list');
  const presetList = document.getElementById('ai-free-ask-suggest-presets');
  if (!sceneList) return;
  sceneList.innerHTML = getActiveAiScenes().map(s => `
    <li>
      <button type="button" class="ai-free-ask-suggest-item ai-free-ask-suggest-item--scene" role="option" data-scene-id="${s.id}">
        <span class="ai-free-ask-suggest-scene-icon">${aiIconSvg(s.iconKey)}</span>
        <span class="ai-free-ask-suggest-scene-name">${escapeHtml(s.name)}</span>
      </button>
    </li>`).join('');
  if (presetList) {
    presetList.innerHTML = AI_FREE_ASK_SUGGESTIONS.map(label => `
      <li>
        <button type="button" class="ai-free-ask-suggest-item" role="option" data-value="${escapeHtml(label)}">${escapeHtml(label)}</button>
      </li>`).join('');
  }
}

function showAiFreeAskSuggest() {
  const panel = document.getElementById('ai-free-ask-suggest');
  const input = document.getElementById('ai-free-question');
  if (!panel || !input) return;
  panel.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

function hideAiFreeAskSuggest() {
  const panel = document.getElementById('ai-free-ask-suggest');
  const input = document.getElementById('ai-free-question');
  if (!panel || !input) return;
  panel.hidden = true;
  input.setAttribute('aria-expanded', 'false');
}

function initAiFreeAskEntry() {
  renderAiFreeAskSuggestions();
  const input = document.getElementById('ai-free-question');
  const panel = document.getElementById('ai-free-ask-suggest');
  if (!input || !panel) return;

  let hideTimer;
  input.addEventListener('focus', () => {
    clearTimeout(hideTimer);
    renderAiFreeAskSuggestions();
    showAiFreeAskSuggest();
  });
  input.addEventListener('blur', () => {
    hideTimer = setTimeout(hideAiFreeAskSuggest, 150);
  });
  panel.addEventListener('mousedown', e => e.preventDefault());
  panel.addEventListener('click', e => {
    const sceneBtn = e.target.closest('[data-scene-id]');
    if (sceneBtn) {
      hideAiFreeAskSuggest();
      input.blur();
      onQuickSceneClick(sceneBtn.dataset.sceneId);
      return;
    }
    const btn = e.target.closest('.ai-free-ask-suggest-item');
    if (!btn) return;
    input.value = btn.dataset.value;
    hideAiFreeAskSuggest();
    submitFreeQuestion();
  });
}

function classifyFreeQuestion(question) {
  const text = (question || '').trim();
  if (!text) return { supported: false, reason: 'empty', question: text };

  for (const rule of AI_FREE_ASK_UNSUPPORTED) {
    if (rule.pattern.test(text)) {
      return { supported: false, reason: 'out_of_scope', label: rule.label, question: text };
    }
  }

  const scores = Object.fromEntries(
    Object.entries(AI_FREE_ASK_SCENE_KEYWORDS).map(([id, patterns]) => [
      id,
      patterns.reduce((s, p) => s + (p.test(text) ? 1 : 0), 0)
    ])
  );
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [sceneId, score] = ranked[0];
  if (!score) {
    return { supported: false, reason: 'no_match', question: text };
  }
  return { supported: true, sceneId, question: text };
}

function startFreeChat(initialMessage) {
  navigate('ai-analyst', 'AI数据分析师');
  renderAiAnalystPage();
  const text = (initialMessage || '').trim();
  if (text) runAnalysisPipeline({ question: text });
  else renderAiAnalystPage();
  window.scrollTo(0, 0);
}

function submitFreeQuestion() {
  const input = document.getElementById('ai-free-question');
  const question = input?.value?.trim() || '';
  if (!question) return;
  if (getComposerSessionState() !== 'input') return;
  const limitCheck = checkAiInputLimits(question);
  if (!limitCheck.ok) {
    showComposerInputHint(limitCheck.message);
    return;
  }
  recordAiInputSubmit();
  if (input) input.value = '';
  hideAiFreeAskSuggest();
  const hint = document.getElementById('ai-composer-input-hint');
  if (hint) hint.hidden = true;
  runAnalysisPipeline({ question });
}

function renderAiFreeChat() {
  renderAiAnalystPage();
}

function renderChatMessages() {
  if (document.getElementById('ai-conversation-feed')) {
    renderConversationFeed();
    return;
  }
  const box = document.getElementById('ai-chat-messages');
  if (!box) return;
  renderConversationFeed();
}

function processChatMessage(text) {
  const question = text.trim();
  if (!question) return;
  runAnalysisPipeline({ question });
}

function tryChatFollowUp(question, messages) {
  const text = question.trim();
  if (isNewAnalysisRequest(text)) return null;
  const ctx = AI_ANALYST.chatContext;
  if (!ctx?.sceneId && !messages.some(m => m.sceneId)) return null;

  if (/为什么|为何|什么原因|怎么回事|怎么解释/.test(text)) {
    if (/06-09|6月9|九日|尖峰|高峰/.test(text) || ctx?.sceneId === 'smartdata_inquiry' || ctx?.sceneId === 'smartdata_global_7d') {
      return {
        role: 'assistant',
        type: 'text',
        content: `<p>关于 06-09 尖峰：<strong>当日询盘 58 条</strong>，占全周 96 条的 60.4%；PV 11,200、UV 2,800 均为周内最高。询盘增幅明显大于流量增幅，说明当日除流量因素外，<strong>落地页/活动配置</strong>对转化也有显著拉动。建议对照当日推广动作与表单页变更做复盘。</p>`
      };
    }
  }
  if (/渠道|来源|引荐|直访/.test(text) && !/分析|看板|报告/.test(text)) {
    return {
      role: 'assistant',
      type: 'text',
      content: `<p>渠道方面：直接访问 UV 12,287（约 87%），外部引荐 1,853（约 13%）。外部引荐转化率 0.65% 约为直接访问 0.33% 的 2 倍，但流量规模较小。自然搜索、付费渠道本周无有效记录。</p>`
    };
  }
  if (/建议|怎么办|如何优化|接下来/.test(text)) {
    const tips = ctx?.sceneId === 'smartdata_channel'
      ? '加大外部引荐投入、为零 UV 渠道补齐 UTM、将高转化页设为外链落地页'
      : ctx?.sceneId === 'smartdata_inquiry'
        ? '复盘 06-09 表单明细、复制高转化页布局、建立高峰日跟进台账'
        : '复盘尖峰日动作、高流量页面向 /peixunyuyue.html 导流、恢复多渠道监测';
    return {
      role: 'assistant',
      type: 'text',
      content: `<p>结合当前对话，建议优先：<strong>${tips}</strong>。如需图表与完整报告，可点击上方「查看完整分析报告」。</p>`
    };
  }
  if (/还有|另外|再问|补充/.test(text) && ctx?.sceneId) {
    return {
      role: 'assistant',
      type: 'text',
      content: `<p>您可以继续围绕「${ctx.sceneName}」追问，例如：「06-09 为什么高？」「渠道表现如何？」「有什么优化建议？」。也可以直接描述新的分析问题。</p>`
    };
  }
  return null;
}

function buildChatSupportedReply(sceneId, question) {
  const scene = getAiScene(sceneId);
  const name = scene?.name || '数据分析';
  const intros = {
    smartdata_global_7d: '所选时段内网站整体温和增长：PV +14.8%、UV +5.8%、询盘 96 条（+9.1%）。人均浏览深度上升，06-09 为流量与询盘双重尖峰日。',
    smartdata_channel: '共 8 个监测渠道中 2 个有效。直接访问占主导，外部引荐转化率更高但流量较少，存在「量大低效、量小高效」的结构特征。',
    smartdata_inquiry: '全周询盘 96 条，06-09 峰值 58 条（60.4%）。/peixunyuyue.html 贡献约 60% 询盘，转化高度集中于单页。'
  };
  return `<p>报告已生成。分析诉求：「${escapeHtml(question)}」</p>
    <p>场景：<strong>${name}</strong>。${intros[sceneId] || ''}</p>
    <p>点击下方按钮可查看<strong>数据看板 + AI 深度诊断报告</strong>。</p>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function onScenarioCardClick(sceneId) {
  const scene = getAiScene(sceneId);
  if (!scene || scene.comingSoon || !scene.active) return;
  showAiSceneDateModal(sceneId);
}

const DEMO_TODAY = new Date('2026-06-10');

function padDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getAiDatePresets() {
  const today = new Date(DEMO_TODAY);
  const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };
  const q = Math.floor(today.getMonth() / 3);
  const prevQ = q === 0 ? 3 : q - 1;
  const prevQYear = q === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const prevQStart = new Date(prevQYear, prevQ * 3, 1);
  const prevQEnd = new Date(prevQYear, prevQ * 3 + 3, 0);
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? 6 : dow - 1;
  const lastMonday = addDays(today, -mondayOffset - 7);
  const lastSunday = addDays(lastMonday, 6);
  return {
    '近7日': { start: padDateStr(addDays(today, -6)), end: padDateStr(today) },
    '近30日': { start: padDateStr(addDays(today, -29)), end: padDateStr(today) },
    '上周': { start: padDateStr(lastMonday), end: padDateStr(lastSunday) },
    '本月': { start: padDateStr(new Date(today.getFullYear(), today.getMonth(), 1)), end: padDateStr(today) },
    '上月': {
      start: padDateStr(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
      end: padDateStr(new Date(today.getFullYear(), today.getMonth(), 0))
    },
    '上季度': { start: padDateStr(prevQStart), end: padDateStr(prevQEnd) }
  };
}

function applyAiDatePreset(presetKey) {
  const preset = getAiDatePresets()[presetKey];
  const startEl = document.getElementById('ai-scene-date-start');
  const endEl = document.getElementById('ai-scene-date-end');
  if (!preset || !startEl || !endEl) return;
  startEl.value = preset.start;
  endEl.value = preset.end;
  document.querySelectorAll('.ai-date-preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === presetKey);
  });
  updateAiSceneDateModalHint();
}

function clearAiDatePresetActive() {
  document.querySelectorAll('.ai-date-preset-btn').forEach(btn => btn.classList.remove('active'));
}

function showAiSceneDateModal(sceneId) {
  const scene = getAiScene(sceneId);
  if (!scene || scene.comingSoon || !scene.active) return;
  AI_ANALYST.pendingSceneId = sceneId;
  const title = document.getElementById('ai-scene-date-modal-title');
  if (title) title.textContent = scene.name;
  applyAiDatePreset('近7日');
  showModal('modal-ai-scene-date');
  setTimeout(() => document.getElementById('ai-scene-date-start')?.focus(), 80);
}

function updateAiSceneDateModalHint() {
  const startEl = document.getElementById('ai-scene-date-start');
  const endEl = document.getElementById('ai-scene-date-end');
  const hint = document.getElementById('ai-scene-date-hint');
  const btn = document.getElementById('btn-ai-scene-date-confirm');
  if (!startEl || !endEl || !hint || !btn || !AI_ANALYST.pendingSceneId) return;

  const start = startEl.value;
  const end = endEl.value;
  if (!isValidDateRange(start, end)) {
    hint.textContent = '请选择有效的起止日期';
    btn.disabled = true;
    return;
  }

  btn.disabled = false;
  const cached = !!AI_ANALYST.cache[aiCacheKey(AI_ANALYST.pendingSceneId, { start, end, fixed: false })];
  hint.textContent = cached
    ? `该时段已有分析缓存，进入后将直接展示（${start} ~ ${end}）`
    : `该时段首次分析将消耗 1 点（${start} ~ ${end}）`;
  btn.textContent = cached ? '查看' : '开始分析';
}

function confirmAiSceneDateModal() {
  const start = document.getElementById('ai-scene-date-start')?.value;
  const end = document.getElementById('ai-scene-date-end')?.value;
  const sceneId = AI_ANALYST.pendingSceneId;
  if (!sceneId || !isValidDateRange(start, end)) return;
  AI_ANALYST.sceneDateRange = { start, end };
  const onConfirm = AI_ANALYST.pipelineOnDateConfirm;
  AI_ANALYST.pipelineOnDateConfirm = null;
  AI_ANALYST.pendingSceneId = null;
  hideModal('modal-ai-scene-date');
  if (onConfirm) {
    onConfirm({ start, end, sceneId });
    return;
  }
  openAiScene(sceneId);
}

function renderScenarioCard(scene) {
  const meta = sceneMetaTags(scene);
  if (scene.comingSoon) {
    return `
      <div class="ai-scene-card ai-scene-card--disabled" aria-disabled="true">
        ${aiIconSvg(scene.iconKey, 'lg')}
        <div class="ai-scene-card-body">
          <div class="ai-scene-card-name">${scene.name}</div>
          <div class="ai-scene-card-desc">${scene.description}</div>
          <div class="ai-scene-card-meta">${meta}<span class="ai-scene-soon-tag">待上线</span></div>
        </div>
      </div>`;
  }
  return `
    <button type="button" class="ai-scene-card" data-scene-id="${scene.id}">
      ${aiIconSvg(scene.iconKey, 'lg')}
      <div class="ai-scene-card-body">
        <div class="ai-scene-card-name">${scene.name}</div>
        <div class="ai-scene-card-desc">${scene.description}</div>
        <div class="ai-scene-card-meta">${meta}</div>
      </div>
      <span class="ai-scene-card-arrow" aria-hidden="true">›</span>
    </button>`;
}

function openAiScene(sceneId) {
  const scene = getAiScene(sceneId);
  if (!scene || scene.comingSoon || !scene.active) return;
  if (scene.timeType === 'selectable' && !AI_ANALYST.sceneDateRange && !AI_ANALYST.freeAskMode) {
    showAiSceneDateModal(sceneId);
    return;
  }
  AI_ANALYST.activeScene = sceneId;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.getElementById('page-ai-scene-detail')?.classList.add('active');
  document.querySelector('.menu-item-ai')?.classList.add('active');
  const bcSuffix = AI_ANALYST.freeAskMode ? '自由对话' : scene.name;
  document.getElementById('breadcrumb').textContent = `AI数据分析师 / ${bcSuffix}`;
  renderAiSceneDetail(sceneId);
  window.scrollTo(0, 0);
}

function renderAiSceneDetail(sceneId) {
  const scene = getAiScene(sceneId);
  const root = document.getElementById('ai-scene-detail-root');
  if (!scene || !root) return;

  const range = AI_ANALYST.sceneDateRange;
  const rangeText = range ? `${range.start} ~ ${range.end}` : '';
  const convo = formatConversationSummary(AI_ANALYST.freeQuestion);
  const userQuestionBanner = AI_ANALYST.freeAskMode && convo.full
    ? `<div class="ai-report-user-question card">
        <span class="ai-report-user-question-label">分析诉求</span>
        <p class="ai-report-user-question-text" id="ai-report-user-question-text">${escapeHtml(convo.full)}</p>
        <button type="button" class="ai-report-user-question-detail" id="btn-user-question-detail" hidden>详情</button>
      </div>`
    : '';

  root.innerHTML = `
    ${userQuestionBanner}
    <div class="ai-report-toolbar card" id="ai-report-toolbar">
      <div class="ai-report-feedback" id="ai-report-feedback" role="group" aria-label="报告反馈">
        <button type="button" class="ai-feedback-btn" data-feedback="up" aria-label="有帮助" title="有帮助">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14" aria-hidden="true"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
          <span>赞</span>
        </button>
        <button type="button" class="ai-feedback-btn" data-feedback="down" aria-label="没有帮助" title="没有帮助">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14" aria-hidden="true"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>
          <span>踩</span>
        </button>
      </div>
      <button type="button" class="btn-ai-back" id="btn-ai-back">← 返回工作台</button>
      <div class="ai-report-toolbar-main">
        <div class="ai-report-toolbar-info">
          ${aiIconSvg(scene.iconKey, 'lg')}
          <div class="ai-report-toolbar-text">
            <h2 class="ai-scene-detail-title">${escapeHtml(scene.name)}</h2>
            ${rangeText ? `<p class="ai-report-toolbar-range">${rangeText}</p>` : ''}
          </div>
        </div>
        <button type="button" class="btn-ai-export" id="btn-ai-export" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          导出 PDF
        </button>
      </div>
    </div>

    <div id="ai-export-root">
      <div class="ai-dashboard card" id="ai-dashboard-panel">
        <div class="ai-module-head">
          <span class="ai-module-label">模块 A</span>
          <h3 class="ai-module-title">数据看板</h3>
        </div>
        <div class="ai-dashboard-placeholder" id="ai-dashboard-placeholder">
          <p>正在加载看板数据…</p>
        </div>
        <div id="ai-dashboard-widgets" class="ai-dashboard-body" hidden></div>
      </div>

      <div class="ai-insight-panel card" id="ai-insight-panel">
        <div class="ai-module-head">
          <span class="ai-module-label ai-module-label--ai">模块 B</span>
          <h3 class="ai-module-title">AI 深度诊断</h3>
        </div>
        <div class="ai-insight-body" id="ai-insight-body">
          <div class="ai-insight-empty" id="ai-insight-empty">
            <p>AI 诊断报告生成中…</p>
          </div>
          <div class="ai-report-loading" id="ai-insight-loading" hidden>
            <span class="ai-pulse"></span> AI数据分析师 正在分析数据并撰写报告…
          </div>
          <div class="ai-report-content" id="ai-insight-content" hidden></div>
          <div class="ai-report-fallback" id="ai-insight-fallback" hidden>
            服务暂不可用，请稍后再试。
          </div>
        </div>
      </div>
    </div>
    <div class="ai-report-meta" id="ai-insight-meta"></div>
  `;

  document.getElementById('btn-user-question-detail')?.addEventListener('click', showUserQuestionDetailModal);
  bindUserQuestionDetailButton();

  document.getElementById('btn-ai-back')?.addEventListener('click', goBackToAiScenes);
  document.getElementById('btn-ai-export')?.addEventListener('click', exportAiReportPdf);
  initReportFeedback(sceneId, range);
  generateAiReport(false);
}

function getReportFeedbackKey(sceneId, range) {
  const start = range?.start || '';
  const end = range?.end || '';
  return `ai-report-feedback:${sceneId}:${start}:${end}`;
}

function initReportFeedback(sceneId, range) {
  const group = document.getElementById('ai-report-feedback');
  if (!group) return;

  const storageKey = getReportFeedbackKey(sceneId, range);
  const saved = localStorage.getItem(storageKey);

  group.querySelectorAll('.ai-feedback-btn').forEach(btn => {
    if (saved === btn.dataset.feedback) btn.classList.add('is-active');

    btn.addEventListener('click', () => {
      const { feedback } = btn.dataset;
      const isActive = btn.classList.contains('is-active');

      group.querySelectorAll('.ai-feedback-btn').forEach(b => b.classList.remove('is-active'));

      if (isActive) {
        localStorage.removeItem(storageKey);
        return;
      }

      btn.classList.add('is-active');
      localStorage.setItem(storageKey, feedback);
    });
  });
}

function showUserQuestionDetailModal() {
  const userMsgs = AI_ANALYST.chatMessages.filter(m => m.role === 'user');
  const body = userMsgs.length
    ? userMsgs.map((m, i) => {
        const time = m.at ? new Date(m.at).toLocaleString('zh-CN', { hour12: false }) : '';
        const text = m.raw || String(m.content).replace(/<[^>]+>/g, '');
        return `<div class="ai-question-detail-item">
          <div class="ai-question-detail-time">${time || `第 ${i + 1} 轮`}</div>
          <div class="ai-question-detail-text">${escapeHtml(text)}</div>
        </div>`;
      }).join('')
    : `<p>${escapeHtml(AI_ANALYST.freeQuestion || '')}</p>`;
  const detailBody = document.getElementById('ai-question-detail-body');
  if (!detailBody) return;
  detailBody.innerHTML = body;
  showModal('modal-ai-question-detail');
}

function getExportPdfFilename(scene) {
  const range = AI_ANALYST.sceneDateRange;
  const name = scene?.name || '数据分析';
  if (range?.start && range?.end) return `${name}_${range.start}_${range.end}.pdf`;
  return `${name}.pdf`;
}

function goBackToAiScenes() {
  AI_ANALYST.activeScene = null;
  navigate('ai-analyst', 'AI数据分析师');
}

function isValidDateRange(start, end) {
  if (!start || !end) return false;
  return new Date(start) <= new Date(end);
}

function generateAiReport(forceRefresh) {
  const sceneId = AI_ANALYST.activeScene;
  if (!sceneId) return;

  const loading = document.getElementById('ai-insight-loading');
  const content = document.getElementById('ai-insight-content');
  const empty = document.getElementById('ai-insight-empty');
  const fallback = document.getElementById('ai-insight-fallback');
  const meta = document.getElementById('ai-insight-meta');
  if (!loading) return;

  const cacheKey = aiCacheKey(sceneId);
  if (forceRefresh) delete AI_ANALYST.cache[cacheKey];

  if (!forceRefresh && AI_ANALYST.cache[cacheKey]) {
    restoreSceneAiCache(sceneId);
    return;
  }

  showDashboard(sceneId);

  loading.hidden = false;
  if (content) content.hidden = true;
  if (empty) empty.hidden = true;
  if (fallback) fallback.hidden = true;

  aiRequest(sceneId, forceRefresh, cacheKey)
    .then(result => {
      loading.hidden = true;
      if (content) { content.hidden = false; content.innerHTML = result.html; }
      if (meta) meta.innerHTML = renderAiMetaHtml(result, result.fromCache);
      document.getElementById('btn-ai-export')?.removeAttribute('disabled');
      maybeTriggerPendingHistoryExport();
    })
    .catch(() => {
      loading.hidden = true;
      if (fallback) fallback.hidden = false;
      if (meta) meta.innerHTML = '';
    });
}

function exportAiReportPdf() {
  const scene = getAiScene(AI_ANALYST.activeScene);
  const root = document.getElementById('ai-export-root');
  const btn = document.getElementById('btn-ai-export');
  if (!root || !scene || btn?.hasAttribute('disabled')) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '导出中…';
  btn.setAttribute('disabled', 'disabled');
  const opt = {
    margin: [10, 10, 10, 10],
    filename: getExportPdfFilename(scene),
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  const run = () => {
    if (typeof html2pdf === 'undefined') {
      window.print();
      btn.innerHTML = orig;
      btn.removeAttribute('disabled');
      return;
    }
    html2pdf().set(opt).from(root).save().then(() => {
      btn.innerHTML = orig;
      btn.removeAttribute('disabled');
    }).catch(() => {
      window.print();
      btn.innerHTML = orig;
      btn.removeAttribute('disabled');
    });
  };
  Object.values(charts).forEach(c => c && c.resize());
  setTimeout(run, 300);
}

function showDashboard(sceneId) {
  const placeholder = document.getElementById('ai-dashboard-placeholder');
  const widgets = document.getElementById('ai-dashboard-widgets');
  if (placeholder) placeholder.hidden = true;
  if (widgets) widgets.hidden = false;
  renderAiDashboard(sceneId);
}

function restoreSceneAiCache(sceneId) {
  const key = aiCacheKey(sceneId);
  const cached = AI_ANALYST.cache[key];
  if (!cached) return;
  showDashboard(sceneId);
  const content = document.getElementById('ai-insight-content');
  const empty = document.getElementById('ai-insight-empty');
  const meta = document.getElementById('ai-insight-meta');
  const placeholder = document.getElementById('ai-dashboard-placeholder');
  if (placeholder) placeholder.hidden = true;
  if (content) { content.hidden = false; content.innerHTML = cached.html; }
  if (empty) empty.hidden = true;
  if (meta) meta.innerHTML = renderAiMetaHtml(cached, true);
  document.getElementById('btn-ai-export')?.removeAttribute('disabled');
  maybeTriggerPendingHistoryExport();
}

function aiChartCard(title, desc, chartId, size, fullWidth) {
  const sizeCls = size ? ` chart-box ${size}` : ' chart-box';
  const fullCls = fullWidth ? ' ai-chart-card--full' : '';
  return `<div class="ai-chart-card${fullCls}">
    <div class="ai-chart-card-head">
      <h4 class="ai-chart-card-title">${title}</h4>
      ${desc ? `<p class="ai-chart-card-desc">${desc}</p>` : ''}
    </div>
    <div class="${sizeCls.trim()}" id="${chartId}"></div>
  </div>`;
}

function aiDashboardTableCard(title, desc, tableHtml) {
  return `<div class="ai-chart-card ai-chart-card--full ai-chart-card--table">
    <div class="ai-chart-card-head">
      <h4 class="ai-chart-card-title">${title}</h4>
      ${desc ? `<p class="ai-chart-card-desc">${desc}</p>` : ''}
    </div>
    ${tableHtml}
  </div>`;
}

function renderAiDashboard(sceneId) {
  const box = document.getElementById('ai-dashboard-widgets');
  if (!box) return;
  const d = DEMO;
  const dailyRows = [
    ['06-04', '8,200', '2,100', '10'], ['06-05', '7,500', '1,950', '12'],
    ['06-06', '6,800', '1,800', '8'], ['06-07', '7,200', '1,900', '15'],
    ['06-08', '8,500', '2,200', '18'], ['06-09', '11,200', '2,800', '58'], ['06-10', '9,800', '2,400', '25']
  ];
  const inquiryDaily = [
    ['06-04', '10', '8,200', '2,100'], ['06-05', '12', '7,500', '1,950'],
    ['06-06', '8', '6,800', '1,800'], ['06-07', '15', '7,200', '1,900'],
    ['06-08', '18', '8,500', '2,200'], ['06-09', '58', '11,200', '2,800'], ['06-10', '25', '9,800', '2,400']
  ];
  const widgets = {
    smartdata_global_7d: () => `
      <div class="ai-metric-row ai-metric-row--glow">
        ${aiMetricCard('浏览量 PV', '50,750', '+14.8%', 'up', true)}
        ${aiMetricCard('访客数 UV', '13,642', '+5.8%', 'up', true)}
        ${aiMetricCard('销售机会', '124', '+14.8%', 'up', true)}
        ${aiMetricCard('表单询盘', '96', '+9.1%', 'up', true)}
      </div>
      ${aiChartCard('流量与转化走势', 'PV / UV 折线叠加询盘柱图，标注尖峰日', 'ai-chart-7d-hero', 'xl', true)}
      <div class="ai-chart-grid">
        ${aiChartCard('访客路径桑基图', '从渠道到着陆页再到询盘的流转', 'ai-chart-7d-sankey', 'sm')}
        ${aiChartCard('转化漏斗', 'UV → 互动 → 机会 → 询盘', 'ai-chart-7d-funnel', 'sm')}
        ${aiChartCard('活跃时段热力', '按日期 × 时段的访问热度', 'ai-chart-7d-heatmap', 'sm')}
        ${aiChartCard('环比对比', '本周期 vs 上周期核心指标', 'ai-chart-7d-compare', 'sm')}
      </div>
      ${aiDashboardTableCard('每日流量与询盘明细', '原始数据汇总，供核对与导出', aiDataTable(['日期', 'PV', 'UV', '询盘数'], dailyRows))}`,
    smartdata_channel: () => `
      <div class="ai-metric-row ai-metric-row--glow">
        ${aiMetricCard('渠道访客', '14,140', '—', 'neutral', true)}
        ${aiMetricCard('销售机会', '53', '—', 'neutral', true)}
        ${aiMetricCard('整体转化率', '0.37%', '—', 'neutral', true)}
        ${aiMetricCard('有效渠道数', '2', '/ 8', 'neutral', true)}
      </div>
      ${aiChartCard('渠道综合表现', '访客柱图 + 销售机会 + 转化率折线', 'ai-chart-channel-hero', 'xl', true)}
      <div class="ai-chart-grid">
        ${aiChartCard('渠道访客排行', '各渠道 UV 横向对比', 'ai-chart-channel-bar', 'sm')}
        ${aiChartCard('流量玫瑰图', '各渠道流量占比', 'ai-chart-channel-rose', 'sm')}
        ${aiChartCard('渠道能力雷达', '访客 / 转化 / 时长多维对比', 'ai-chart-channel-radar', 'sm')}
        ${aiChartCard('效率散点图', 'UV 规模 vs 转化率分布', 'ai-chart-channel-scatter', 'sm')}
      </div>
      ${aiDashboardTableCard('渠道质量排行榜', '全渠道原始指标一览', `
        <div class="ai-table-wrap">${renderTable(d.channelData.filter(c => c.uv > 0), [
          { label: '渠道', key: 'name' },
          { label: '访客数', key: 'uv' },
          { label: '互动率', render: r => r.opp > 0 ? ((r.opp / r.uv * 100).toFixed(1) + '%') : '0%' },
          { label: '询盘数', key: 'opp' },
          { label: '转化率', key: 'rate' }
        ], { pagination: false })}</div>`)}`,
    smartdata_inquiry: () => `
      <div class="ai-metric-row ai-metric-row--glow">
        ${aiMetricCard('表单询盘', '96', '+9.1%', 'up', true)}
        ${aiMetricCard('高峰日', '06-09', '58 条', 'up', true)}
        ${aiMetricCard('主贡献页', '/peixunyuyue.html', '60%', 'neutral', true)}
        ${aiMetricCard('日均询盘', '13.7', '—', 'neutral', true)}
      </div>
      ${aiChartCard('询盘趋势', '日询盘柱图 + 累计折线', 'ai-chart-inquiry-hero', 'xl', true)}
      <div class="ai-chart-grid">
        ${aiChartCard('日分布玫瑰图', '各日询盘占比', 'ai-chart-inquiry-pie', 'sm')}
        ${aiChartCard('柱线混合图', '询盘数与环比变化', 'ai-chart-inquiry-mix', 'sm')}
        ${aiChartCard('着陆页贡献', '各页面带来的询盘数', 'ai-chart-inquiry-landing', 'sm')}
        ${aiChartCard('渠道来源占比', '询盘按来源渠道拆分', 'ai-chart-inquiry-channel', 'sm')}
      </div>
      ${aiDashboardTableCard('每日询盘明细', '按日汇总询盘与当日流量', aiDataTable(['日期', '询盘数', '当日 PV', '当日 UV'], inquiryDaily))}
      <div class="ai-chart-grid ai-chart-grid--tables">
        ${aiDashboardTableCard('按着陆页分布', '', aiDataTable(['页面', '询盘数', '占比'], [
          ['/peixunyuyue.html', '58', '60.4%'], ['/shouquanma.html', '15', '15.6%'],
          ['/website.html', '12', '12.5%'], ['/', '11', '11.5%']
        ]))}
        ${aiDashboardTableCard('按来源渠道分布', '', aiDataTable(['渠道', '询盘数', '占比'], [
          ['直接访问', '69', '71.9%'], ['外部引荐', '18', '18.8%'], ['其他', '9', '9.3%']
        ]))}
      </div>`
  };
  box.innerHTML = (widgets[sceneId] || (() => '<p>暂无看板配置</p>'))();
  setTimeout(() => initAiSceneCharts(sceneId), 80);
}

function aiMetricCard(label, value, sub, trend, glow) {
  const trendCls = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral';
  return `<div class="ai-metric-card${glow ? ' ai-metric-card--glow' : ''}">
    <div class="ai-metric-label">${label}</div>
    <div class="ai-metric-value">${value}</div>
    <div class="ai-metric-sub ${trendCls}">${sub}</div>
  </div>`;
}

function initAiSceneCharts(sceneId) {
  const d = DEMO;
  switch (sceneId) {
    case 'smartdata_global_7d':
      aiChart7dHero('ai-chart-7d-hero', d);
      aiChart7dSankey('ai-chart-7d-sankey');
      aiChartFunnel('ai-chart-7d-funnel', [
        { name: '访客 UV', value: 13642 },
        { name: '网站互动', value: 185 },
        { name: '销售机会', value: 124 },
        { name: '表单询盘', value: 96 }
      ]);
      aiChart7dHeatmap('ai-chart-7d-heatmap', d);
      aiChartCompareBar('ai-chart-7d-compare', ['PV', 'UV', '会话', '询盘'], [50750, 13642, 19790, 96], [44200, 12890, 18450, 88]);
      break;
    case 'smartdata_channel':
      aiChartChannelHero('ai-chart-channel-hero', d);
      aiChartChannelHBar('ai-chart-channel-bar', d.channelData.filter(c => c.uv > 0));
      aiChartRose('ai-chart-channel-rose', d.channelData.filter(c => c.uv > 0));
      aiChartRadar('ai-chart-channel-radar');
      aiChartChannelScatter('ai-chart-channel-scatter', d.channelData.filter(c => c.uv > 0));
      break;
    case 'smartdata_inquiry':
      aiChartInquiryHero('ai-chart-inquiry-hero', d);
      aiChartInquiryMix('ai-chart-inquiry-mix', d);
      initChart('ai-chart-inquiry-pie', {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie', radius: ['30%', '70%'], roseType: 'area', center: ['50%', '50%'],
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          data: [
            { value: 58, name: '06-09', itemStyle: { color: '#dc2626' } },
            { value: 18, name: '06-08', itemStyle: { color: '#f59e0b' } },
            { value: 15, name: '06-07', itemStyle: { color: '#16a34a' } },
            { value: 5, name: '其他', itemStyle: { color: '#94a3b8' } }
          ],
          label: { formatter: '{b}\n{c}条 ({d}%)' }
        }]
      });
      initChart('ai-chart-inquiry-landing', {
        tooltip: { trigger: 'axis' },
        grid: { left: 110, right: 20, top: 20, bottom: 30 },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: ['/peixunyuyue.html', '/shouquanma.html', '/website.html', '/'] },
        series: [{ type: 'bar', data: [58, 15, 12, 11],
          itemStyle: { color: (p) => ['#dc2626', '#f59e0b', '#1565e8', '#7c3aed'][p.dataIndex], borderRadius: [0, 6, 6, 0] },
          barWidth: 20, label: { show: true, position: 'right' } }]
      });
      initChart('ai-chart-inquiry-channel', {
        tooltip: { trigger: 'item' },
        series: [{ type: 'pie', radius: ['42%', '68%'],
          data: [
            { value: 69, name: '直接访问', itemStyle: { color: '#1565e8' } },
            { value: 18, name: '外部引荐', itemStyle: { color: '#7c3aed' } },
            { value: 9, name: '其他', itemStyle: { color: '#94a3b8' } }
          ],
          label: { formatter: '{b}\n{d}%', fontSize: 11 },
          emphasis: { scaleSize: 12 }
        }]
      });
      break;
  }
  Object.values(charts).forEach(c => c && c.resize());
}

function aiChart7dHero(id, d) {
  initChart(id, {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { bottom: 0, textStyle: { color: '#4b5565' } },
    grid: { left: 55, right: 55, top: 40, bottom: 55 },
    xAxis: { type: 'category', data: d.dateFull, boundaryGap: false, axisLine: { lineStyle: { color: '#d8dee6' } } },
    yAxis: [
      { type: 'value', name: '流量', splitLine: { lineStyle: { type: 'dashed', color: '#eef1f6' } } },
      { type: 'value', name: '转化', splitLine: { show: false } }
    ],
    series: [
      { name: 'PV', type: 'line', smooth: 0.4, symbolSize: 8, data: [8200, 7500, 6800, 7200, 8500, 11200, 9800],
        lineStyle: { width: 3, color: '#1565e8' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(21,101,232,0.45)' }, { offset: 1, color: 'rgba(21,101,232,0.02)' }]) },
        itemStyle: { color: '#1565e8', borderWidth: 2, borderColor: '#fff' } },
      { name: 'UV', type: 'line', smooth: 0.4, symbolSize: 6, data: [2100, 1950, 1800, 1900, 2200, 2800, 2400],
        lineStyle: { width: 2.5, color: '#16a34a' }, itemStyle: { color: '#16a34a' } },
      { name: '询盘', type: 'bar', yAxisIndex: 1, barWidth: 28, data: [10, 12, 8, 15, 18, 58, 25],
        itemStyle: { color: (p) => p.dataIndex === 5 ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#f87171' }, { offset: 1, color: '#dc2626' }]) : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#fbbf24' }, { offset: 1, color: '#f59e0b' }]), borderRadius: [6, 6, 0, 0] },
        markPoint: { data: [{ name: '尖峰', coord: [5, 58], value: 58, symbolSize: 50, itemStyle: { color: '#dc2626' } }] } }
    ],
    animationDuration: 1200,
    animationEasing: 'cubicOut'
  });
}

function aiChart7dSankey(id) {
  initChart(id, {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'sankey', layout: 'none', emphasis: { focus: 'adjacency' },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.4 },
      label: { fontSize: 11, color: '#4b5565' },
      data: [
        { name: '直接访问' }, { name: '外部引荐' }, { name: '着陆页' }, { name: '产品页' }, { name: '表单询盘' }
      ],
      links: [
        { source: '直接访问', target: '着陆页', value: 9000 },
        { source: '外部引荐', target: '着陆页', value: 1500 },
        { source: '着陆页', target: '产品页', value: 4200 },
        { source: '产品页', target: '表单询盘', value: 96 }
      ],
      itemStyle: { borderWidth: 0 },
      color: ['#1565e8', '#7c3aed', '#16a34a', '#0d9488', '#f59e0b']
    }]
  });
}

function aiChart7dHeatmap(id, d) {
  const hours = ['00', '04', '08', '12', '16', '20'];
  const days = d.dates;
  const heat = [
    [10, 12, 25, 30, 28, 15], [8, 10, 22, 28, 25, 12], [6, 8, 18, 22, 20, 10],
    [12, 14, 30, 35, 32, 18], [10, 12, 28, 32, 30, 16], [15, 20, 45, 92, 88, 42], [11, 13, 26, 31, 28, 14]
  ];
  const data = [];
  days.forEach((day, i) => hours.forEach((h, j) => data.push([j, i, heat[i][j]])));
  initChart(id, {
    tooltip: { position: 'top' },
    grid: { left: 50, right: 20, top: 10, bottom: 40 },
    xAxis: { type: 'category', data: hours, splitArea: { show: true } },
    yAxis: { type: 'category', data: days, splitArea: { show: true } },
    visualMap: { min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#e8f1fd', '#1565e8', '#0f4ec2'] } },
    series: [{ type: 'heatmap', data, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10 } } }]
  });
}

function aiChartChannelHero(id, d) {
  const rows = d.channelData.filter(c => c.uv > 0);
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 55, right: 20, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: rows.map(r => r.name) },
    yAxis: [{ type: 'value', name: '访客' }, { type: 'value', name: '转化率%', max: 1 }],
    series: [
      { name: '访客数', type: 'bar', data: rows.map(r => r.uv), barWidth: 36,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#1565e8' }]), borderRadius: [8, 8, 0, 0] } },
      { name: '销售机会', type: 'bar', data: rows.map(r => r.opp), barWidth: 36,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#86efac' }, { offset: 1, color: '#16a34a' }]), borderRadius: [8, 8, 0, 0] } },
      { name: '转化率', type: 'line', yAxisIndex: 1, smooth: true, data: rows.map(r => parseFloat(r.rate) || 0),
        lineStyle: { width: 3, color: '#f59e0b' }, symbolSize: 10, itemStyle: { color: '#f59e0b' } }
    ],
    animationDuration: 1000
  });
}

function aiChartChannelScatter(id, rows) {
  initChart(id, {
    tooltip: { formatter: p => `${p.data[2]}<br/>UV: ${p.data[0]}<br/>转化率: ${p.data[1]}%` },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { name: 'UV', splitLine: { lineStyle: { type: 'dashed' } } },
    yAxis: { name: '转化率%', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [{
      type: 'scatter', symbolSize: (val) => Math.max(val[0] / 200, 12),
      data: rows.map(r => [r.uv, parseFloat(r.rate) || 0, r.name]),
      itemStyle: { color: (p) => COLORS[p.dataIndex % COLORS.length], opacity: 0.85, shadowBlur: 8, shadowColor: 'rgba(21,101,232,0.3)' },
      label: { show: true, formatter: (p) => p.data[2], position: 'top', fontSize: 10 }
    }]
  });
}

function aiChartInquiryHero(id, d) {
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 50, top: 35, bottom: 50 },
    xAxis: { type: 'category', data: d.dateFull, boundaryGap: true },
    yAxis: [{ type: 'value', name: '询盘数' }, { type: 'value', name: '累计', splitLine: { show: false } }],
    series: [
      { name: '日询盘', type: 'bar', data: [10, 12, 8, 15, 18, 58, 25], barWidth: 32,
        itemStyle: { color: (p) => p.dataIndex === 5 ? '#dc2626' : '#16a34a', borderRadius: [6, 6, 0, 0] } },
      { name: '累计', type: 'line', yAxisIndex: 1, smooth: true, areaStyle: { opacity: 0.15, color: '#1565e8' },
        data: [10, 22, 30, 45, 63, 121, 146], lineStyle: { width: 3, color: '#1565e8' }, itemStyle: { color: '#1565e8' } }
    ],
    animationDuration: 1000
  });
}

function aiChartFunnel(id, data) {
  initChart(id, {
    tooltip: { trigger: 'item' },
    series: [{ type: 'funnel', left: '8%', width: '84%', top: 16, bottom: 16, sort: 'descending', gap: 4,
      label: { show: true, position: 'inside', formatter: '{b}\n{c}', fontSize: 11 },
      data: data.map((item, i) => ({ ...item, itemStyle: { color: ['#1565e8', '#3b82f6', '#16a34a', '#f59e0b'][i] } }))
    }]
  });
}

function aiChartCompareBar(id, labels, current, prev) {
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 20, top: 20, bottom: 45 },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value' },
    series: [
      { name: '本期', type: 'bar', data: current, itemStyle: { color: '#1565e8', borderRadius: [4, 4, 0, 0] } },
      { name: '上期', type: 'bar', data: prev, itemStyle: { color: '#cbd5e1', borderRadius: [4, 4, 0, 0] } }
    ]
  });
}

function aiChartChannelHBar(id, rows) {
  const names = rows.map(r => r.name).reverse();
  const uvs = rows.map(r => r.uv).reverse();
  initChart(id, {
    tooltip: { trigger: 'axis' },
    grid: { left: 90, right: 30, top: 10, bottom: 30 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: names },
    series: [{ type: 'bar', data: uvs, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#1565e8' }, { offset: 1, color: '#60a5fa' }]) }, barWidth: 18 }]
  });
}

function aiChartRose(id, rows) {
  initChart(id, {
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', roseType: 'area', radius: ['18%', '65%'], center: ['50%', '50%'],
      data: rows.map((r, i) => ({ name: r.name, value: r.uv, itemStyle: { color: COLORS[i % COLORS.length] } })),
      label: { formatter: '{b}\n{d}%' }
    }]
  });
}

function aiChartRadar(id) {
  initChart(id, {
    tooltip: {},
    radar: {
      indicator: [
        { name: '流量规模', max: 100 }, { name: '互动率', max: 100 },
        { name: '转化率', max: 100 }, { name: '停留时长', max: 100 }, { name: 'ROI', max: 100 }
      ],
      radius: '62%'
    },
    series: [{
      type: 'radar',
      data: [
        { value: [92, 45, 33, 70, 55], name: '直接访问', areaStyle: { opacity: 0.2 }, itemStyle: { color: '#1565e8' } },
        { value: [35, 62, 65, 80, 72], name: '外部引荐', areaStyle: { opacity: 0.15 }, itemStyle: { color: '#16a34a' } }
      ]
    }]
  });
}

function aiChartInquiryMix(id, d) {
  initChart(id, {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 50, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: d.dateFull },
    yAxis: [{ type: 'value', name: '询盘数' }, { type: 'value', name: '环比%', max: 100, min: -50 }],
    series: [
      { name: '表单询盘', type: 'bar', data: [10, 12, 8, 15, 18, 58, 25],
        itemStyle: { color: (p) => p.dataIndex === 5 ? '#dc2626' : '#16a34a', borderRadius: [4, 4, 0, 0] },
        markPoint: { data: [{ name: '尖峰', coord: [5, 58], value: 58, itemStyle: { color: '#dc2626' } }] } },
      { name: '环比', type: 'line', yAxisIndex: 1, smooth: true, data: [5, 8, -12, 15, 20, 220, -55], itemStyle: { color: '#f59e0b' } }
    ]
  });
}

function aiReportPart(title, paragraphs) {
  const body = (Array.isArray(paragraphs) ? paragraphs : [paragraphs])
    .map(p => `<p>${p}</p>`).join('');
  return `<div class="ai-report-part"><h4 class="ai-report-part-title">${title}</h4>${body}</div>`;
}

function aiReportCategory(title, items) {
  return `<div class="ai-report-category"><h4 class="ai-report-category-title">${title}</h4><ul class="ai-suggestion-list">${items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
}

function aiFactItem(title, body, metric) {
  return `<div class="ai-fact-item">
    <div class="ai-fact-head"><strong>${title}</strong></div>
    <p>${body}</p>${metric ? `<div class="ai-fact-metric">${metric}</div>` : ''}
  </div>`;
}

function aiSuggestionList(items) {
  return `<ul class="ai-suggestion-list">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
}

function aiDataTable(headers, rows) {
  return `<div class="ai-data-table-wrap"><table class="ai-data-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function aiRenderRichSections(sections) {
  const icons = { summary: '📊', issue: '⚠️', tip: '💡' };
  const labels = { summary: '核心总结', issue: '异常诊断', tip: '运营建议' };
  const types = { summary: 'summary', issue: 'issue', tip: 'tip' };
  return `<div class="ai-sections ai-sections--rich">${sections.map(s => `
    <div class="ai-section ai-section--rich">
      <div class="ai-section-head">
        <span class="ai-section-icon ${types[s.type]}">${icons[s.type]}</span>
        ${s.title || labels[s.type]}
      </div>
      <div class="ai-section-body">${s.html}</div>
    </div>`).join('')}</div>`;
}

function pctTrend(cur, prev) {
  if (!prev) return cur ? '+100%' : '0%';
  const p = ((cur - prev) / prev * 100).toFixed(1);
  return (p > 0 ? '+' : '') + p + '%';
}

function aiFetchPayload(sceneId) {
  const fetchers = {
    smartdata_global_yesterday: () => ({
      scene_id: sceneId,
      product: 'smartdata',
      time_scope: '昨日(2026-06-09) 对比 前日(2026-06-08)',
      core_metrics: {
        pv: { current: 11200, prev: 8500, trend: pctTrend(11200, 8500) },
        uv: { current: 2800, prev: 2200, trend: pctTrend(2800, 2200) },
        sessions: { current: 2950, prev: 2310, trend: pctTrend(2950, 2310) },
        ip: { current: 2400, prev: 1900, trend: pctTrend(2400, 1900) }
      },
      interactions: { current: 45, prev: 30, trend: pctTrend(45, 30) },
      opportunities: { current: 35, prev: 20, trend: pctTrend(35, 20) },
      inquiries: { current: 18, prev: 12, trend: pctTrend(18, 12) },
      orders: { current: 42, prev: 35, trend: pctTrend(42, 35) },
      top_channel: { name: '直接访问', sessions: 2100, rate: '0.33%' }
    }),
    smartdata_global_7d: () => {
      const r = AI_ANALYST.sceneDateRange || { start: '2026-06-04', end: '2026-06-10' };
      return {
      scene_id: sceneId,
      product: 'smartdata',
      time_scope: `${r.start} ~ ${r.end}`,
      core_metrics: {
        pv: { current: 50750, prev: 44200, trend: pctTrend(50750, 44200) },
        uv: { current: 13642, prev: 12890, trend: pctTrend(13642, 12890) },
        sessions: { current: 19790, prev: 18450, trend: pctTrend(19790, 18450) },
        ip: { current: 11013, prev: 10200, trend: pctTrend(11013, 10200) }
      },
      interactions: { current: 185, prev: 162, trend: pctTrend(185, 162) },
      opportunities: { current: 124, prev: 108, trend: pctTrend(124, 108) },
      inquiries: { current: 96, prev: 88, trend: pctTrend(96, 88) },
      orders: { current: 238, prev: 210, trend: pctTrend(238, 210) },
      top_channel: { name: '直接访问', sessions: 12287, rate: '0.33%' },
      interaction_rate: '0.93%',
      conversion_rate: '0.49%',
      peak_day: { date: '2026-06-09', pv: 11200, uv: 2800, inquiries: 58 },
      top_pages: [
        { url: '/website.html', pv: 18313, uv: 8842, opp: 7, rate: '0.08%' },
        { url: '/', pv: 13569, uv: 8540, opp: 1, rate: '0.01%' },
        { url: '/peixunyuyue.html', pv: 277, uv: 222, opp: 73, rate: '32.88%' },
        { url: '/shouquanma.html', pv: 890, uv: 620, opp: 15, rate: '2.42%' }
      ],
      interaction_breakdown: { forms: 106, consults: 27, shares: 50, emails: 1 },
      channel_summary: { active: 2, total: 8, direct_session_pct: 62.1 }
      };
    },
    smartdata_channel: () => {
      const r = AI_ANALYST.sceneDateRange || { start: '2026-06-04', end: '2026-06-10' };
      return {
      scene_id: sceneId,
      page_context: '核心渠道质量与 ROI 诊断',
      date_range: `${r.start} ~ ${r.end}`,
      channel_data: DEMO.channelData.filter(c => c.uv > 0).map(c => ({
        channel: c.name, pv: c.pv, uv: c.uv, opportunities: c.opp,
        orders: c.orders, conversion_rate: c.rate, avg_duration: c.time
      }))
      };
    },
    smartdata_ad_anomaly: () => ({
      scene_id: sceneId,
      page_context: '付费广告异常流量排查',
      date_range: '2026-06-04 ~ 2026-06-10',
      paid_channels: [
        { channel: '付费搜索 (Google Ads)', uv: 12, interaction_rate: '8.3%', inquiries: 1, conversion_rate: '8.33%' },
        { channel: '付费社交 (Facebook)', uv: 500, interaction_rate: '5.0%', inquiries: 0, conversion_rate: '0%' }
      ]
    }),
    smartdata_geo: () => ({
      scene_id: sceneId,
      page_context: '地域分布分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      top_countries: DEMO.geoData.slice(0, 5),
      low_engagement: DEMO.geoData.filter(g => parseFloat(g.rate) < 0.2).slice(0, 3)
    }),
    smartdata_behavior: () => ({
      scene_id: sceneId,
      page_context: '行为流分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      sample_sessions: DEMO.behaviorSessions.length,
      top_landing: '/website.html',
      avg_pages: 3.3,
      avg_duration: '00:02:13'
    }),
    smartdata_pages: () => ({
      scene_id: sceneId,
      page_context: '网站页面分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      top_pages: DEMO.pages.slice(0, 5).map(p => ({
        url: p.url, pv: p.pv, uv: p.uv, opportunities: p.opp, conversion_rate: p.rate
      }))
    }),
    smartdata_landing: () => ({
      scene_id: sceneId,
      page_context: '着陆页分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      landing_pages: DEMO.landingPages.slice(0, 5)
    }),
    smartdata_conversion: () => ({
      scene_id: sceneId,
      page_context: '转化统计分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      conversions: 124,
      conversion_rate: '0.91%',
      interaction_rate: '1.36%',
      method_split: { form: '77.4%', consult: '21.8%', email: '0.8%' },
      channel_split: { direct: '87.9%', referral: '9.7%', organic: '2.4%' }
    }),
    smartdata_interaction: () => ({
      scene_id: sceneId,
      page_context: '网站互动分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      forms: 106, consults: 27, shares: 50, emails: 1,
      peak_day: '2026-06-09', peak_forms: 55
    }),
    smartdata_inquiry: () => {
      const r = AI_ANALYST.sceneDateRange || { start: '2026-06-04', end: '2026-06-10' };
      return {
      scene_id: sceneId,
      page_context: '询盘统计分析',
      date_range: `${r.start} ~ ${r.end}`,
      inquiries: 96,
      trend_peak: '2026-06-09',
      trend_peak_value: 58,
      top_landing: '/peixunyuyue.html',
      daily: [
        { date: '2026-06-04', count: 10, pv: 8200, uv: 2100 },
        { date: '2026-06-05', count: 12, pv: 7500, uv: 1950 },
        { date: '2026-06-06', count: 8, pv: 6800, uv: 1800 },
        { date: '2026-06-07', count: 15, pv: 7200, uv: 1900 },
        { date: '2026-06-08', count: 18, pv: 8500, uv: 2200 },
        { date: '2026-06-09', count: 58, pv: 11200, uv: 2800 },
        { date: '2026-06-10', count: 25, pv: 9800, uv: 2400 }
      ],
      by_page: [
        { page: '/peixunyuyue.html', count: 58, pct: '60.4%' },
        { page: '/shouquanma.html', count: 15, pct: '15.6%' },
        { page: '/website.html', count: 12, pct: '12.5%' },
        { page: '/', count: 11, pct: '11.5%' }
      ],
      by_channel: [
        { channel: '直接访问', count: 69, pct: '71.9%' },
        { channel: '外部引荐', count: 18, pct: '18.8%' },
        { channel: '其他', count: 9, pct: '9.3%' }
      ]
      };
    },
    smartdata_sales: () => ({
      scene_id: sceneId,
      page_context: '销售机会分析',
      date_range: '2026-06-04 ~ 2026-06-10',
      form_inquiries: 96,
      consults: 27,
      registrations: 0,
      emails: 1,
      peak_day: '2026-06-09'
    })
  };
  return (fetchers[sceneId] || (() => ({ scene_id: sceneId })))();
}

function aiRenderSections(sections) {
  const icons = { summary: '📊', issue: '⚠️', tip: '💡' };
  const labels = { summary: '核心总结', issue: '异常与问题诊断', tip: '运营/跟进建议' };
  const types = { summary: 'summary', issue: 'issue', tip: 'tip' };
  return `<div class="ai-sections">${sections.map(s => `
    <div class="ai-section">
      <div class="ai-section-head">
        <span class="ai-section-icon ${types[s.type]}">${icons[s.type]}</span>
        ${s.title || labels[s.type]}
      </div>
      <div class="ai-section-body">${s.html}</div>
    </div>`).join('')}</div>`;
}

function aiGenerateResponse(sceneId, payload) {
  const gens = {
    smartdata_global_7d: (d) => {
      const pvUvRatio = (d.core_metrics.pv.current / d.core_metrics.uv.current).toFixed(2);
      const prevPvUvRatio = (d.core_metrics.pv.prev / d.core_metrics.uv.prev).toFixed(2);
      const peakInqPct = (d.peak_day.inquiries / d.inquiries.current * 100).toFixed(1);
      const convPage = d.top_pages[2];
      const trafficPage = d.top_pages[0];
      return aiRenderRichSections([
        { type: 'summary', title: '数据分析', html: `
          <div class="ai-report-doc">
            <p class="ai-report-doc-lead"><strong>网站运营周度数据分析报告</strong>（${d.time_scope}）</p>
            ${aiReportPart('第一部分：网站流量及访客质量分析', [
              `所选时段网站访客 <strong>${d.core_metrics.uv.current.toLocaleString()}</strong> 人（环比 ${d.core_metrics.uv.trend}），页面浏览量 <strong>${d.core_metrics.pv.current.toLocaleString()}</strong> 次（环比 ${d.core_metrics.pv.trend}），累计会话 <strong>${d.core_metrics.sessions.current.toLocaleString()}</strong> 次，独立 IP <strong>${d.core_metrics.ip.current.toLocaleString()}</strong> 个。`,
              `人均 PV 从 ${prevPvUvRatio} 升至 <strong>${pvUvRatio}</strong>，PV 增速约为 UV 的 2.5 倍。这说明该时段增长更多来自<strong>存量访客反复浏览</strong>，新客获取增速相对温和，访客质量呈现「深浏览」特征。`
            ])}
            ${aiReportPart('第二部分：网站互动与转化数据分析', [
              `网站互动 <strong>${d.interactions.current}</strong> 次（环比 ${d.interactions.trend}），互动率约 <strong>${d.interaction_rate}</strong>；销售机会 <strong>${d.opportunities.current}</strong> 条（环比 ${d.opportunities.trend}），表单询盘 <strong>${d.inquiries.current}</strong> 条（环比 ${d.inquiries.trend}），全站转化率约 <strong>${d.conversion_rate}</strong>。`,
              `<strong>${d.peak_day.date.slice(5)}</strong> 出现周内尖峰：当日 PV ${d.peak_day.pv.toLocaleString()}、询盘 ${d.peak_day.inquiries} 条，占全周询盘 <strong>${peakInqPct}%</strong>。流量集中于 <strong>${trafficPage.url}</strong>（PV ${trafficPage.pv.toLocaleString()}，转化率 ${trafficPage.rate}），而转化集中于 <strong>${convPage.url}</strong>（PV 仅 ${convPage.pv}，转化率 <strong>${convPage.rate}</strong>，销售机会 ${convPage.opp} 条），呈现典型的「流量页 vs 转化页」分离。`,
              `互动结构：表单提交 ${d.interaction_breakdown.forms} 次、发起咨询 ${d.interaction_breakdown.consults} 次、社交分享 ${d.interaction_breakdown.shares} 次。主渠道 <strong>${d.top_channel.name}</strong> 贡献 ${d.top_channel.sessions.toLocaleString()} 会话（约占 ${d.channel_summary.direct_session_pct}%），自然搜索与付费渠道本周无有效记录。`
            ])}
            ${aiReportPart('第三部分：总结与展望', [
              `本周网站在流量规模、互动频次与销售机会上均保持<strong>温和增长</strong>，06-09 尖峰日带动了全周询盘指标。当前增长的主要驱动力是直访回访与高转化单页，而非多渠道协同或全站均衡转化。`,
              `下一阶段建议聚焦三条主线：① 复盘尖峰日有效动作并尝试固化为周常运营；② 将 ${trafficPage.url}、/ 等高流量页面向 ${convPage.url} 等转化页系统导流；③ 恢复自然搜索/付费渠道的数据可观测性，为后续投放与 SEO 评估提供依据。`
            ])}
          </div>` },
        { type: 'issue', title: '异常诊断', html: `
          ${aiFactItem('06-09 询盘尖峰', `该日询盘 <strong>${d.peak_day.inquiries}</strong> 条，占全周 ${d.inquiries.current} 条的 <strong>${peakInqPct}%</strong>；当日 PV ${d.peak_day.pv.toLocaleString()}、UV ${d.peak_day.uv.toLocaleString()}，均为周内最高。`, '非尖峰日日均询盘约 <strong>6.3</strong> 条')}
          ${aiFactItem('流量页与转化页割裂', `<strong>${trafficPage.url}</strong> 贡献主要 PV（${trafficPage.pv.toLocaleString()}）但转化率仅 ${trafficPage.rate}；<strong>${convPage.url}</strong> 贡献 ${convPage.opp} 条销售机会，占绝对主导。`, '高流量未有效导向留资路径')}
          ${aiFactItem('渠道结构单一', `有效记录渠道仅 <strong>${d.channel_summary.active}</strong> 个（共监测 ${d.channel_summary.total} 个），${d.top_channel.name} 占会话约 ${d.channel_summary.direct_session_pct}%。`, '自然搜索、付费搜索、付费社交等渠道 UV 为 0')}` },
        { type: 'tip', title: '优化建议', html: `
          <div class="ai-report-doc">
            <p class="ai-report-doc-lead">本周流量增长尚未充分转化为全站均衡的业务产出。以下建议参考运营报告模板，按优先级维度整理，旨在将高流量转化为实际询盘与销售机会。</p>
            ${aiReportCategory('一、核心转化与着陆页优化', [
              `针对核心转化路径，优化 <strong>${convPage.url}</strong> 着陆页设计，确保用户能迅速找到留资入口并简化提交流程`,
              `在 <strong>${trafficPage.url}</strong> 及首页 / 增加培训预约、方案咨询等强 CTA，向 ${convPage.url} 系统导流`,
              `对 ${convPage.url} 与 /website.html 的转化流程开展 A/B 测试，验证不同 CTA 位置与表单字段组合的效果`
            ])}
            ${aiReportCategory('二、内容策略与关键词优化', [
              `复盘 06-09 尖峰日关联的推广内容与着陆页配置，将有效做法沉淀为可复用的周常运营素材`,
              `围绕高转化页面主题（培训预约、授权码等）补充配套文章与案例内容，延长访客停留与深度浏览`,
              `检查自然搜索与付费渠道落地页的 UTM 标记与内容匹配度，确保渠道流量可被准确归因`
            ])}
            ${aiReportCategory('三、用户体验与技术基础', [
              `优化高 PV 页面（${trafficPage.url}、/）首屏信息层级，缩短用户到达留资路径的步数`,
              `检查全站移动端表单提交体验，确保高峰日流量不因页面加载或表单异常而流失`,
              `在关键页面增加在线咨询入口，与表单询盘形成互补，丰富线索获取方式`
            ])}
            ${aiReportCategory('四、数据监测与迭代优化', [
              `建立周度核心指标看板（PV/UV、互动率、询盘数、渠道分布），持续跟踪环比变化`,
              `为自然搜索、付费搜索、付费社交等渠道补齐 UTM 全链路监测，恢复渠道级可观测性`,
              `对 06-09 新增询盘建立跟进台账，记录来源、着陆页与首次联系时间，为后续转化分析提供样本`
            ])}
            <p class="ai-report-doc-outro">执行上述建议有助于将本周的流量增长更均衡地转化为询盘与销售机会。建议以两周为周期复盘指标变化，持续迭代优化策略。</p>
          </div>` }
      ]);
    },
    smartdata_channel: (d) => {
      const totalUv = d.channel_data.reduce((s, c) => s + c.uv, 0);
      const direct = d.channel_data[0];
      const referral = d.channel_data.find(c => c.channel === '外部引荐') || d.channel_data[1];
      const zeroChannels = d.channel_data.filter(c => c.uv === 0).map(c => c.channel);
      const directOppPerUv = (direct.opportunities / direct.uv * 100).toFixed(3);
      const refOppPerUv = (referral.opportunities / referral.uv * 100).toFixed(3);
      return aiRenderRichSections([
        { type: 'summary', html: `
          <div class="ai-insight-narrative">
            <p>流量规模与转化质量呈现<strong>倒挂</strong>：外部引荐仅占 ${(referral.uv / totalUv * 100).toFixed(1)}% UV，却贡献 ${(referral.opportunities / (direct.opportunities + referral.opportunities) * 100).toFixed(1)}% 的销售机会。单 UV 产出（机会/UV）外部引荐为 <strong>${refOppPerUv}‰</strong>，直接访问仅 <strong>${directOppPerUv}‰</strong>——效率更高的渠道反而流量更少。</p>
            <p>8 个监测渠道中 <strong>${zeroChannels.length}</strong> 个零 UV，并不必然等于「无投放」，更可能是 UTM/归因链路断裂导致数据不可见。在加大投放前，应先恢复可观测性，否则优化方向无法被验证。</p>
            <p>直接访问贡献了 ${(direct.uv / totalUv * 100).toFixed(1)}% 流量但转化率仅 ${direct.conversion_rate}，而全站高 PV 页面（/website.html 等）未系统性地向高转化页 /peixunyuyue.html（32.88%）导流，存在<strong>「流量池」与「转化池」割裂</strong>。</p>
          </div>` },
        { type: 'issue', html: `
          ${aiFactItem('零流量渠道', `以下渠道 UV 为 0：${zeroChannels.join('、')}。`, `零 UV 渠道：<strong>${zeroChannels.length}</strong> 个`)}
          ${aiFactItem('转化率对比', `外部引荐 ${referral.conversion_rate}，直接访问 ${direct.conversion_rate}，前者约为后者的 <strong>${(parseFloat(referral.conversion_rate) / parseFloat(direct.conversion_rate)).toFixed(1)}</strong> 倍。`, '')}
          ${aiFactItem('流量集中度', `直接访问占 <strong>${(direct.uv / totalUv * 100).toFixed(1)}%</strong>，外部引荐占 <strong>${(referral.uv / totalUv * 100).toFixed(1)}%</strong>。`, '')}` },
        { type: 'tip', html: aiSuggestionList([
          '将 /peixunyuyue.html 作为外部引荐广告的统一落地页做 A/B 对比',
          '梳理外部引荐来源域名，筛选可加大合作的外部平台',
          '为零 UV 渠道检查 UTM 标记与数据接入配置是否正确'
        ]) }
      ]);
    },
    smartdata_inquiry: (d) => {
      const nonPeakAvg = ((d.inquiries - d.trend_peak_value) / 6).toFixed(1);
      const peakMultiple = (d.trend_peak_value / parseFloat(nonPeakAvg)).toFixed(1);
      const peakDay = d.daily.find(r => r.date === d.trend_peak);
      const avgUv = d.daily.reduce((s, r) => s + r.uv, 0) / d.daily.length;
      const uvLift = peakDay ? ((peakDay.uv / avgUv - 1) * 100).toFixed(0) : 0;
      return aiRenderRichSections([
        { type: 'summary', html: `
          <div class="ai-insight-narrative">
            <p>全周询盘呈<strong>极端脉冲分布</strong>：06-09 峰值是其余日均的 <strong>${peakMultiple} 倍</strong>。但峰值日 UV 仅比周均高约 ${uvLift}%，而询盘增幅远超流量增幅——尖峰询盘更可能来自<strong>页面/活动变更</strong>，而非单纯流量涌入。</p>
            <p>转化路径高度<strong>单点依赖</strong>：/peixunyuyue.html 以极低页面 PV 贡献了 60% 询盘，全站留资能力与这一个页面的健康度强绑定。其余高流量页（/website.html、/）询盘贡献合计不足 25%。</p>
            <p>交叉渠道视角：直接访问带来 72% 询盘，但渠道分析显示外部引荐的单 UV 转化效率更高。当前结构是<strong>「量大的渠道效率低、效率高的渠道量小」</strong>，存在明显的结构性再平衡空间。</p>
          </div>` },
        { type: 'issue', html: `
          ${aiFactItem('单日尖峰突出', `${d.trend_peak} 询盘 ${d.trend_peak_value} 条，其余 6 日合计 ${d.inquiries - d.trend_peak_value} 条，非尖峰日均约 <strong>${nonPeakAvg}</strong> 条。`, '')}
          ${aiFactItem('页面集中', `<strong>${d.top_landing}</strong> 贡献 ${d.by_page[0].count} 条（${d.by_page[0].pct}），其余页面合计 ${d.inquiries - d.by_page[0].count} 条。`, '')}
          ${aiFactItem('渠道来源', `直接访问 ${d.by_channel[0].count} 条（${d.by_channel[0].pct}），外部引荐 ${d.by_channel[1].count} 条（${d.by_channel[1].pct}）。`, '')}` },
        { type: 'tip', html: aiSuggestionList([
          '导出 06-09 全部表单提交明细，按时段与来源做结构化归档',
          '将 /peixunyuyue.html 的表单字段与布局复制到 /website.html 做转化测试',
          '对高峰日新增询盘建立跟进台账，记录首次联系时间'
        ]) }
      ]);
    },
    smartdata_ad_anomaly: (d) => aiRenderSections([
      { type: 'summary', html: `<p>统计时段内付费渠道共带来 <strong>512</strong> 位访客，其中付费搜索贡献 ${d.paid_channels[0].uv} 人、付费社交贡献 <strong>${d.paid_channels[1].uv}</strong> 人。整体转化依赖自然流量，付费投放 ROI 分化明显。</p>` },
      { type: 'issue', html: `<p>发现<strong>【付费社交】</strong>带来了 ${d.paid_channels[1].uv} 个访客，但互动率仅为 ${d.paid_channels[1].interaction_rate} 且 <strong>0 询盘</strong>，存在严重的预算浪费嫌疑。付费搜索表现正常（转化率 ${d.paid_channels[0].conversion_rate}）。</p>` },
      { type: 'tip', html: `<ul><li>建议立即检查 Facebook 广告的受众定位是否过于宽泛，或着陆页内容是否与广告素材严重不符。</li><li>建议暂时削减付费社交渠道约 50% 的预算，将资源倾斜至自然搜索 SEO 与已验证有效的付费搜索词。</li></ul>` }
    ]),
    smartdata_geo: (d) => aiRenderSections([
      { type: 'summary', title: '地域总结', html: `<p>流量高度集中于<strong>中国</strong>（PV ${d.top_countries[0].pv.toLocaleString()}，占绝对主导），美国次之（PV ${d.top_countries[1].pv.toLocaleString()}）。新加坡转化率 ${d.top_countries[2].rate}，为 Top5 中最高。</p>` },
      { type: 'issue', title: '地域问题诊断', html: `<p>印度、英国等市场 PV 不低但销售机会接近 0，存在<strong>「有流量无转化」</strong>现象。美国市场互动率偏低（${d.top_countries[1].rate}），可能与落地页语言/时区不匹配有关。</p>` },
      { type: 'tip', title: '区域运营建议', html: `<ul><li>针对新加坡等高转化地区，可增加本地化案例与客户证言模块。</li><li>对美国流量建议检查页面加载速度与英文内容匹配度，必要时做地域分流落地页。</li></ul>` }
    ]),
    smartdata_behavior: (d) => aiRenderSections([
      { type: 'summary', html: `<p>行为流显示用户多从 <strong>${d.top_landing}</strong> 进入，平均访问 <strong>${d.avg_pages}</strong> 页、停留约 <strong>${d.avg_duration}</strong>。会话路径以「浏览 → 产品/方案 → 留资」为主流模式。</p>` },
      { type: 'issue', html: `<p>部分会话在首屏后快速流失，/login.html 等工具型页面跳出较高。从外链进入的会话（如 Google 引荐）深度浏览明显低于直接访问。</p>` },
      { type: 'tip', html: `<ul><li>在黄金页面增加「下一步」引导（相关案例、表单入口），延长会话深度。</li><li>对高流量低深度路径做 A/B 测试，优化首屏信息层级。</li></ul>` }
    ]),
    smartdata_pages: (d) => aiRenderSections([
      { type: 'summary', html: `<p><strong>/website.html</strong> 与 <strong>/</strong> 贡献主要 PV，但转化集中在 <strong>/peixunyuyue.html</strong>（转化率 ${d.top_pages[2]?.conversion_rate}，销售机会 ${d.top_pages[2]?.opportunities} 条），呈现典型的「流量页 vs 转化页」分离。</p>` },
      { type: 'issue', html: `<p>高 PV 页面（首页、官网介绍）转化率极低（${d.top_pages[0]?.conversion_rate}、${d.top_pages[1]?.conversion_rate}），存在大量<strong>「虚荣流量」</strong>未导向留资路径。</p>` },
      { type: 'tip', html: `<ul><li>在 /website.html 增加培训预约、方案咨询等强 CTA，向 /peixunyuyue.html 导流。</li><li>将 /shouquanma.html 等中转化页面纳入首页推荐位，提升全站转化效率。</li></ul>` }
    ]),
    smartdata_landing: (d) => aiRenderSections([
      { type: 'summary', html: `<p>会话最多的着陆页为 <strong>${d.landing_pages[0].url}</strong>（${d.landing_pages[0].sessions.toLocaleString()} 会话）。<strong>/peixunyuyue.html</strong> 销售机会 ${d.landing_pages[3].opp} 条，为转化最高着陆页。</p>` },
      { type: 'issue', html: `<p>首页会话数高但销售机会仅 ${d.landing_pages[0].opp} 条，每次会话浏览页数 ${d.landing_pages[0].pages}，说明用户「到站即走」或未进入转化漏斗。</p>` },
      { type: 'tip', html: `<ul><li>优化首页首屏价值主张，增加直达培训预约的入口。</li><li>复制 /peixunyuyue.html 的表单布局到其他高流量着陆页做测试。</li></ul>` }
    ]),
    smartdata_conversion: (d) => aiRenderSections([
      { type: 'summary', html: `<p>近 7 日共 <strong>${d.conversions}</strong> 次转化，转化率 <strong>${d.conversion_rate}</strong>。表单询盘占 ${d.method_split.form}，是直接贡献来源；直接访问渠道占转化来源 ${d.channel_split.direct}。</p>` },
      { type: 'issue', html: `<p>互动率仅 ${d.interaction_rate}，大量会话未产生任何互动行为。转化高度依赖表单，咨询与邮件占比不足，线索形式单一。</p>` },
      { type: 'tip', html: `<ul><li>在关键页面增加在线咨询入口，提升咨询占比，缩短响应链路。</li><li>对高互动未转化会话配置访客雷达跟进（未来可联动）。</li></ul>` }
    ]),
    smartdata_interaction: (d) => aiRenderSections([
      { type: 'summary', html: `<p>近 7 日共 <strong>${d.forms}</strong> 次表单提交、<strong>${d.consults}</strong> 次咨询、<strong>${d.shares}</strong> 次社交分享。${d.peak_day} 出现表单峰值（${d.peak_forms} 次），为全周互动高峰。</p>` },
      { type: 'issue', html: `<p>会员注册与邮件互动几乎为 0，用户深度绑定手段不足。互动高峰日与其他日期差距悬殊，运营动作缺乏连续性。</p>` },
      { type: 'tip', html: `<ul><li>复盘 ${d.peak_day} 的推广或内容动作，固化为周常运营节奏。</li><li>在表单提交后增加资料下载/会员注册引导，提升留存。</li></ul>` }
    ]),
    smartdata_sales: (d) => aiRenderSections([
      { type: 'summary', html: `<p>近 7 日共产生销售机会 <strong>${d.form_inquiries + d.consults + d.registrations + d.emails}</strong> 条：表单询盘 ${d.form_inquiries}、发起咨询 ${d.consults}。${d.peak_day} 为机会高峰日。</p>` },
      { type: 'issue', html: `<p>会员注册与邮件类机会几乎为 0，高价值线索形式单一。表单询盘占绝对主导，咨询跟进链路可进一步加强。</p>` },
      { type: 'tip', html: `<ul><li>对 ${d.peak_day} 的销售机会做来源与会话路径复盘，识别高意向特征。</li><li>建议销售在高峰日后 24 小时内完成首次触达，提升转化率。</li></ul>` }
    ])
  };
  const gen = gens[sceneId];
  return gen ? gen(payload) : '<p>暂无该场景的分析模板。</p>';
}

function aiRequest(sceneId, forceRefresh, cacheKeyOverride) {
  const baseScene = sceneId.includes(':') ? sceneId.split(':')[0] : sceneId;
  const key = cacheKeyOverride || aiCacheKey(baseScene);
  if (!forceRefresh && AI_ANALYST.cache[key]) {
    return Promise.resolve({ ...AI_ANALYST.cache[key], fromCache: true });
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < AI_ANALYST.failRate) {
        reject(new Error('timeout'));
        return;
      }
      const payload = aiFetchPayload(baseScene);
      const html = aiGenerateResponse(baseScene, payload);
      const result = {
        html,
        generatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        sceneId: baseScene,
        payload
      };
      AI_ANALYST.cache[key] = result;
      resolve(result);
    }, forceRefresh ? AI_ANALYST.simulateDelay * 1.5 : AI_ANALYST.simulateDelay);
  });
}

function formatMetaDate(dateStr) {
  const d = new Date(String(dateStr).replace(/-/g, '/'));
  if (isNaN(d.getTime())) return dateStr;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const AI_CACHE_TIP = '同时间段的数据首次分析后，系统会生成缓存，后面再查看时直接使用缓存数据，不再扣费。';

function renderAiMetaHtml(result, fromCache) {
  const date = formatMetaDate(result.generatedAt);
  if (!fromCache) return date;
  return `${date} · <span class="ai-cache-badge">首次生成已缓存</span><span class="ai-cache-info" tabindex="0" role="button" aria-label="缓存说明"><span class="ai-cache-info-icon">!</span><span class="ai-cache-info-tip">${AI_CACHE_TIP}</span></span>`;
}

function seedAiDemoCache() {
  const channelKey = `${AI_ANALYST.accountId}:${AI_ANALYST.source}:smartdata_channel:2026-06-04:2026-06-10`;
  const payload = aiFetchPayload('smartdata_channel');
  AI_ANALYST.cache[channelKey] = {
    html: aiGenerateResponse('smartdata_channel', payload),
    generatedAt: '2026/6/10 14:30:00',
    sceneId: 'smartdata_channel',
    payload
  };
  AI_ANALYST.reportHistory = [{
    id: 'rh_seed_channel',
    sceneId: 'smartdata_channel',
    sceneName: '来源渠道分析',
    question: '来源渠道分析（2026-06-04 ~ 2026-06-10）',
    start: '2026-06-04',
    end: '2026-06-10',
    cacheKey: channelKey,
    generatedAt: '2026/6/10 14:30:00',
    status: 'done',
    account: AI_ANALYST.accountId
  }, {
    id: 'rh_seed_failed',
    sceneId: 'smartdata_global_7d',
    sceneName: '综合流量分析',
    question: AI_DEMO_FAIL_QUESTION,
    start: '2026-06-04',
    end: '2026-06-10',
    cacheKey: `${AI_ANALYST.accountId}:${AI_ANALYST.source}:smartdata_global_7d:2026-06-04:2026-06-10`,
    generatedAt: '2026/6/10 15:10:00',
    status: 'failed',
    account: AI_ANALYST.accountId
  }];
}

function initAiSpecDrawerResize(drawer, resizer) {
  if (!drawer || !resizer) return;
  const STORAGE_KEY = 'ai-spec-drawer-width';
  const MIN_W = 420;
  const MAX_RATIO = 0.92;

  const getMaxWidth = () => Math.floor(window.innerWidth * MAX_RATIO);
  const clampWidth = w => Math.min(getMaxWidth(), Math.max(MIN_W, w));
  const getDefaultWidth = () => clampWidth(Math.min(820, window.innerWidth * 0.72));

  const applyWidth = w => {
    drawer.style.width = `${clampWidth(w)}px`;
    drawer.style.maxWidth = 'none';
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (!Number.isNaN(parsed)) applyWidth(parsed);
  }

  let dragging = false;
  let startX = 0;
  let startW = 0;

  const onPointerMove = clientX => {
    const delta = startX - clientX;
    applyWidth(startW + delta);
  };

  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    drawer.classList.remove('is-resizing');
    resizer.classList.remove('is-dragging');
    localStorage.setItem(STORAGE_KEY, String(drawer.offsetWidth));
    if (e?.pointerId != null) {
      try { resizer.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    }
  };

  resizer.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startW = drawer.offsetWidth;
    drawer.classList.add('is-resizing');
    resizer.classList.add('is-dragging');
    resizer.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  resizer.addEventListener('pointermove', e => {
    if (!dragging) return;
    onPointerMove(e.clientX);
  });

  resizer.addEventListener('pointerup', endDrag);
  resizer.addEventListener('pointercancel', endDrag);

  resizer.addEventListener('dblclick', () => {
    localStorage.removeItem(STORAGE_KEY);
    drawer.style.width = '';
    drawer.style.maxWidth = '';
  });

  resizer.addEventListener('keydown', e => {
    const step = e.shiftKey ? 48 : 16;
    const current = drawer.offsetWidth;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applyWidth(current + step);
      localStorage.setItem(STORAGE_KEY, String(drawer.offsetWidth));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      applyWidth(current - step);
      localStorage.setItem(STORAGE_KEY, String(drawer.offsetWidth));
    } else if (e.key === 'Home') {
      e.preventDefault();
      applyWidth(getDefaultWidth());
      localStorage.setItem(STORAGE_KEY, String(drawer.offsetWidth));
    }
  });

  window.addEventListener('resize', () => {
    if (drawer.style.width) applyWidth(drawer.offsetWidth);
  });
}

function initAiSpecDrawer() {
  const mask = document.getElementById('ai-spec-drawer-mask');
  const drawer = document.getElementById('ai-spec-drawer');
  const openBtn = document.getElementById('btn-ai-spec-drawer');
  const closeBtn = document.getElementById('btn-ai-spec-drawer-close');
  const doc = document.getElementById('ai-spec-doc');
  const nav = document.getElementById('ai-spec-nav');
  const resizer = document.getElementById('ai-spec-drawer-resizer');
  if (!mask || !drawer || !openBtn) return;

  initAiSpecDrawerResize(drawer, resizer);

  let mermaidReady = false;
  const renderMermaid = () => {
    if (typeof mermaid === 'undefined' || mermaidReady) return;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true, wrap: true }
    });
    mermaid.run({ nodes: drawer.querySelectorAll('.mermaid') }).then(() => { mermaidReady = true; }).catch(() => {});
  };

  const open = () => {
    mask.hidden = false;
    mask.setAttribute('aria-hidden', 'false');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      mask.classList.add('show');
      drawer.classList.add('open');
      renderMermaid();
    });
  };
  const close = () => {
    mask.classList.remove('show');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    mask.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { mask.hidden = true; }, 280);
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  mask.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  nav?.querySelectorAll('.ai-spec-nav-item').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href')?.slice(1);
      const section = id ? document.getElementById(id) : null;
      if (section && doc) {
        doc.scrollTo({ top: section.offsetTop - 8, behavior: 'smooth' });
        nav.querySelectorAll('.ai-spec-nav-item').forEach(n => n.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  if (doc && nav) {
    const sections = [...nav.querySelectorAll('.ai-spec-nav-item')].map(a => ({
      link: a,
      el: document.getElementById(a.getAttribute('href')?.slice(1) || '')
    })).filter(s => s.el);
    doc.addEventListener('scroll', () => {
      const scrollTop = doc.scrollTop;
      let current = sections[0];
      sections.forEach(s => {
        if (s.el.offsetTop - 24 <= scrollTop) current = s;
      });
      nav.querySelectorAll('.ai-spec-nav-item').forEach(n => n.classList.remove('active'));
      current?.link.classList.add('active');
    }, { passive: true });
  }
}

function initAiAnalyst() {
  seedAiDemoCache();
  renderAiSceneList();
  const goAi = () => navigate('ai-analyst', 'AI数据分析师');
  document.getElementById('btn-overview-ai')?.addEventListener('click', goAi);
  document.getElementById('btn-ai-scene-date-confirm')?.addEventListener('click', confirmAiSceneDateModal);
  document.querySelectorAll('.ai-date-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => applyAiDatePreset(btn.dataset.preset));
  });
  document.getElementById('btn-ai-free-submit')?.addEventListener('click', submitFreeQuestion);
  document.getElementById('btn-ai-new-chat')?.addEventListener('click', startNewAiConversation);
  initAiFreeAskEntry();
  initAiSpecDrawer();
  document.getElementById('ai-free-question')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitFreeQuestion();
  });
  document.getElementById('ai-free-question')?.addEventListener('input', e => {
    const len = (e.target.value || '').length;
    if (len > AI_INPUT_LIMITS.maxCharsPerMessage) {
      showComposerInputHint(`输入内容过长，单次最多 ${AI_INPUT_LIMITS.maxCharsPerMessage} 个字符，请精简后重试。`);
    } else {
      const hint = document.getElementById('ai-composer-input-hint');
      if (hint?.textContent.includes('输入内容过长')) hint.hidden = true;
    }
  });
  ['ai-scene-date-start', 'ai-scene-date-end'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('change', () => { clearAiDatePresetActive(); updateAiSceneDateModalHint(); });
    el?.addEventListener('input', () => { clearAiDatePresetActive(); updateAiSceneDateModalHint(); });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTables();
  initChannelRulesPage();
  initAiAnalyst();
  document.addEventListener('click', e => {
    const link = e.target.closest('.session-detail-link');
    if (!link) return;
    e.preventDefault();
    openSessionDetail(+link.dataset.sessionIndex, link.dataset.sessionSource);
  });
  document.querySelectorAll('.menu-parent').forEach(el => {
    el.addEventListener('click', () => toggleMenu(el));
  });
  document.querySelectorAll('.menu-item').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      navigate(el.dataset.page, el.dataset.breadcrumb);
    });
  });
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(el => {
    el.addEventListener('click', () => hideModal(el.dataset.modal));
  });
  document.querySelectorAll('.modal-mask').forEach(el => {
    el.addEventListener('click', e => { if (e.target === el) el.classList.remove('show'); });
  });
  window.addEventListener('resize', () => Object.values(charts).forEach(c => c && c.resize()));

  fetch('https://cdn.jsdelivr.net/npm/echarts@5/map/json/world.json')
    .then(r => r.json())
    .then(json => { echarts.registerMap('world', json); })
    .catch(() => {})
    .finally(() => navigate('overview', '概况总览'));
});
