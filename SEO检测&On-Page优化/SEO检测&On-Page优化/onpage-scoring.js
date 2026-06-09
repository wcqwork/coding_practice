/**
 * 单页 On-Page 评分（与 SEO测评维度.html / SEO评分维度.md 对齐）
 * 规范数据见 onpage-scoring-spec.js（由 SEO评分维度.md 生成）
 */
(function (global) {
  const SPEC_DIMS = global.ONPAGE_SPEC_DIMENSIONS || [];
  const SPEC_ROWS = global.ONPAGE_SPEC_ROWS || [];

  const ONPAGE_SCORE_DIMENSIONS = SPEC_DIMS.map(d => ({
    id: d.id,
    label: d.label,
    shortLabel: (d.label.split(' ')[0] || d.id),
    max: d.max,
    guide: d.intro,
    productGuide: d.intro,
  }));

  const DIM_MAX = {};
  ONPAGE_SCORE_DIMENSIONS.forEach(d => { DIM_MAX[d.id] = d.max; });

  const DIM_ID_BY_MODULE = {
    'Title 页面标题': 'title', 'Meta 摘要': 'meta', 'Headings 标题结构': 'headings',
    'Body 正文内容': 'body', 'Media 多媒体': 'media', 'URL 链接设置': 'url',
    'Code 底层代码与技术': 'code', 'Code 底层技术': 'code',
    '站点基建': 'infrastructure', '核心页加权': 'corePages',
  };

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

  function dimForMetric(metric) {
    const m = String(metric || '');
    if (m.startsWith('Title 长度') || m.startsWith('Title 目标词')) return 'title';
    if (m.startsWith('Meta') || m === '文意一致性') return 'meta';
    if (m.startsWith('H1') || m.includes('Title/H1') || m.includes('子标题') || m.includes('层级')) return 'headings';
    if (['正文字数', '含词次数', '堆砌告警', '首段点题', '文题一致'].includes(m)) return 'body';
    if (m.includes('Alt') || m.includes('图片')) return 'media';
    if (m.includes('Slug') || m.includes('HTTPS')) return 'url';
    return 'code';
  }

  function metricsForDim(dimId) {
    const seen = new Set();
    const out = [];
    SPEC_ROWS.forEach(r => {
      if (dimForMetric(r.metric) !== dimId || seen.has(r.metric)) return;
      seen.add(r.metric);
      out.push(r.metric);
    });
    return out;
  }

  function specRowsForMetric(metric) {
    return SPEC_ROWS.filter(r => r.metric === metric);
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
    const jaccard = /⚠|偏弱|偏低|风险|模板|堆砌/i.test(String(row.listSummary || '')) ? '0.06' : '0.12';
    const overlapPct = /⚠|偏弱|偏低|风险/i.test(String(row.listSummary || '')) ? '22' : '48';
    const textRatio = '38';
    const skipCount = /跳级|层级/i.test(rawB) ? '1' : '0';
    const subHeadingCount = '4';
    const matchCount = /子标题|H2/i.test(rawB) ? '2' : '0';
    const sliceHitRate = '35';
    return {
      titleText,
      titleLen,
      length: titleLen,
      metaText: metaLen ? metaText : '—',
      metaLength: metaLen,
      targetKeyword: noKw ? '' : targetKeyword,
      noKw,
      positionPct,
      sliceHitRate,
      h1Count,
      h1Length: '42',
      imgTotal,
      altMissing,
      deadCount,
      linkTotal,
      density,
      kwCount,
      wordCount,
      jaccard,
      overlapPct,
      textRatio,
      skipCount,
      subHeadingCount,
      matchCount,
    };
  }

  function fillDocTemplate(tpl, ctx) {
    return String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => (ctx[k] != null ? String(ctx[k]) : ''));
  }

  /** 规范表共用 {length}，按指标映射到对应 Display Length */
  function ctxForMetric(metric, baseCtx, row) {
    const c = { ...baseCtx };
    if (String(metric || '').startsWith('Meta')) c.length = baseCtx.metaLength;
    else if (String(metric || '').startsWith('H1')) c.length = baseCtx.h1Length;
    else c.length = baseCtx.titleLen != null ? baseCtx.titleLen : baseCtx.length;
    if (String(metric || '').includes('Slug')) {
      const pathSeg = String(row.path || '/').replace(/\/$/, '').split('/').pop() || '';
      c.slug = pathSeg || '—';
    }
    if (String(metric || '').includes('HTTPS')) c.pageProtocol = 'https';
    return c;
  }

  function stripDiagPrefix(s) {
    return String(s || '').replace(/^(当前|建议|结论)[：:]\s*/u, '').trim();
  }

  function formatDocProblem(cell) {
    let s = String(cell || '').replace(/<br\s*\/?>/gi, ' ').replace(/【变量】[^。\n]*/g, '').trim();
    const curM = s.match(/当前[：:]\s*([\s\S]*?)(?=结论[：:]|$)/);
    const conM = s.match(/结论[：:]\s*([\s\S]*?)(?=建议[：:]|$)/);
    const bits = [];
    if (curM) bits.push(curM[1].trim().replace(/\s+/g, ' '));
    if (conM) bits.push(conM[1].trim().replace(/\s+/g, ' '));
    if (bits.length) return bits.join(' ');
    return stripDiagPrefix(s);
  }

  function formatDocSuggestion(cell) {
    return stripDiagPrefix(String(cell || '').replace(/<br\s*\/?>/gi, ' ').replace(/【变量】[^。\n]*/g, '').trim());
  }

  function formatSubLine(problem, suggestion, sev) {
    const prob = formatDocProblem(problem);
    const sug = formatDocSuggestion(suggestion);
    if (sev === 'pass' || !sug) return prob;
    return `${prob} ${sug}`.trim();
  }

  function pickSpecRow(metric, preferSev, row) {
    const rows = specRowsForMetric(metric);
    if (!rows.length) return null;
    const ctx = buildCheckContext(row);
    const title = String(row.title || '').trim();
    const rawA = String(row.dimA || '');
    const rawB = String(row.dimB || '');
    const rawC = String(row.dimC || '');
    const rawD = String(row.dimD || '');
    const noKw = !parseMultiKw(row.keyword).length;
    const md = String(row.metaDesc || '').trim();
    const hasMeta = md && !md.includes('待同步');

    const pick = (sev) => rows.find(r => r.sev === sev) || null;

    if (metric === 'Title 长度') {
      if (!title) return pick('issue') || rows[0];
      if (title.length > 100 || title.length < 10) return pick('issue') || rows[rows.length - 1];
      if (title.length > 60) return rows.find(r => r.sev === 'issue' && r.score === 0 && /严重不合规/.test(r.problem)) || pick('issue');
      if (title.length < 30 || title.length > 60) return rows.find(r => r.sev === 'advice' && r.score === 4) || pick('advice');
      return pick('pass');
    }
    if (metric === 'Title 目标词') {
      if (!title) return pick('issue');
      if (noKw) return pick('pass');
      if (/位置偏后|偏后/i.test(rawA)) return rows.find(r => r.sev === 'advice' && r.score === 5) || pick('advice');
      return pick('pass');
    }
    if (metric === 'Meta 长度') {
      if (!hasMeta) return rows.find(r => /未检测到/.test(r.problem)) || pick('issue') || rows[0];
      const len = md.length;
      if (len < 80 || len > 220) {
        return rows.find(r => r.sev === 'issue' && /严重不合规/.test(r.problem)) || pick('issue') || rows[0];
      }
      if (len < 120 || len > 160) return rows.find(r => r.sev === 'advice') || pick('advice') || rows[0];
      return pick('pass') || rows[0];
    }
    if (metric === 'Meta 目标词') {
      if (!hasMeta) return pick('issue');
      if (noKw) return pick('pass');
      if (/模板|雷同/i.test(rawA)) return pick('advice');
      return pick('pass');
    }
    if (metric === '文意一致性') {
      if (!hasMeta) return pick('issue');
      if (/摘要.*⚠|模板/.test(String(row.listSummary || ''))) return pick('advice');
      return pick('pass');
    }
    if (metric === 'H1 唯一性') {
      if (/双 H1|多个/i.test(rawB)) return rows.find(r => r.sev === 'advice' && r.score === 2) || pick('advice');
      if (/缺|无 H1/i.test(rawB)) return pick('issue');
      return pick('pass');
    }
    if (metric === 'H1 长度规范') {
      if (/双 H1|无 H1/i.test(rawB)) return pick('issue');
      return pick('pass');
    }
    if (metric === 'H1 目标词') {
      if (/未|缺/i.test(rawB)) return pick('issue');
      if (noKw) return pick('pass');
      return pick('pass');
    }
    if (metric === 'Title/H1差异化') {
      if (/重复|双 H1/i.test(rawB)) return pick('advice');
      return pick('pass');
    }
    if (metric === '子标题含目标词') {
      if (/未含|子标题/i.test(rawB)) return pick('advice');
      return pick('pass');
    }
    if (metric === '层级无跳级') {
      return pick('pass');
    }
    if (metric === '正文字数') {
      if (/偏短|空壳/i.test(rawC)) return pick('advice');
      return pick('pass');
    }
    if (metric === '含词次数' || metric === '堆砌告警') {
      if (/堆砌|密度/i.test(rawC)) return pick('issue');
      return pick('pass');
    }
    if (metric === '文题一致') {
      if (/风险|堆砌|⚠/i.test(rawC)) return pick('advice');
      return pick('pass');
    }
    if (metric.includes('Alt')) {
      if (/缺 alt|gallery/i.test(rawD)) return pick('advice');
      return pick('pass');
    }
    if (metric.includes('图片含词')) {
      if (/缺 alt|gallery/i.test(rawD)) return pick('advice');
      return pick('pass');
    }
    if (metric.includes('Slug')) {
      if (/N\/A|根路径|豁免/i.test(rawA)) return pick('pass') || rows[0];
      if (!/含词/i.test(rawA)) return pick('advice') || rows[0];
      return pick('pass') || rows[0];
    }
    if (metric.includes('HTTPS')) {
      if (!/HTTPS|https/i.test(rawA)) return pick('issue') || rows[0];
      return pick('pass') || rows[0];
    }
    if (/死链|404|JSON|收录|Hreflang|社媒|结构化|文本代码|内链|Canonical/i.test(metric)) {
      if (/404|死链/i.test(rawD) && /死链|404/.test(metric)) return pick('issue');
      if (/BlogPosting|datePublished|schema|JSON/i.test(rawD) && /JSON|结构化/.test(metric)) return pick('issue');
      if (/hreflang|canonical|分页/i.test(rawD)) return pick('advice');
      return pick('pass');
    }
    return pick(preferSev) || rows[0];
  }

  function mkFromSpec(metric, row) {
    const spec = pickSpecRow(metric, null, row);
    if (!spec) {
      return { sev: 'pass', title: metric, problem: '', suggestion: '', got: 0, max: 0, detail: '' };
    }
    const baseCtx = buildCheckContext(row);
    const ctx = ctxForMetric(metric, baseCtx, row);
    if (ctx.noKw && /目标词/.test(spec.problem) && spec.sev === 'pass') {
      return {
        sev: 'pass',
        title: metric,
        problem: '未配置目标词，本项不适用。',
        suggestion: '在页面设置中补充 1-10 个目标词后可获取更精准检测。',
        got: spec.score,
        max: spec.metricMax,
        detail: '未配置目标词，本项不适用。',
        sug: '',
      };
    }
    const problem = fillDocTemplate(spec.problem, ctx);
    const suggestion = fillDocTemplate(spec.suggestion, ctx);
    const line = formatSubLine(problem, suggestion, spec.sev);
    return {
      sev: spec.sev,
      title: metric,
      problem,
      suggestion,
      result: problem,
      sug: suggestion,
      got: spec.score,
      max: spec.metricMax,
      detail: line,
    };
  }

  function dimAggregateStatus(got, max, checks) {
    const hasIssue = checks.some(c => c.sev === 'issue');
    if (hasIssue) return { dot: 'issue', comment: '存在需优先处理的严重项' };
    if (got >= max) return { dot: 'pass', comment: '本维度表现良好' };
    const hasAdvice = checks.some(c => c.sev === 'advice');
    if (hasAdvice) return { dot: 'advice', comment: '有优化空间，建议按子项建议逐项完善' };
    if (max > 0 && got / max >= 0.85) return { dot: 'pass', comment: '整体达标，仍有少量可优化点' };
    return { dot: 'pass', comment: '整体达标，仍有少量可优化点' };
  }

  function evaluateDimChecks(dimId, row) {
    return metricsForDim(dimId).map(metric => mkFromSpec(metric, row));
  }

  function onPageWincherCollectModel(row) {
    const groups = ONPAGE_SCORE_DIMENSIONS.map(d => {
      const checks = evaluateDimChecks(d.id, row);
      const got = checks.reduce((s, c) => s + (Number(c.got) || 0), 0);
      const max = checks.reduce((s, c) => s + (Number(c.max) || 0), 0) || d.max;
      const st = dimAggregateStatus(got, max, checks);
      return {
        id: d.id,
        dot: st.dot,
        name: d.label,
        guide: d.intro || d.guide,
        productGuide: d.intro || d.productGuide,
        got,
        max,
        comment: st.comment,
        checks,
      };
    });
    const extra = (row.issuesDetail || []).filter(it => it.lv !== 'suggestion').map(it => ({
      sev: it.lv === 'critical' ? 'issue' : 'advice',
      title: String(it.t || '').trim(),
      result: String(it.t || '').trim(),
      sug: String(it.sug || '').trim(),
      dimId: null,
    }));
    return { groups, extra, dimScores: Object.fromEntries(groups.map(g => [g.id, g.got])) };
  }

  function onPageGetDimScores(row) {
    const model = onPageWincherCollectModel(row);
    const o = {};
    model.groups.forEach(g => { o[g.id] = g.got; });
    return o;
  }

  function onPageDimTotal(row) {
    return onPageWincherCollectModel(row).groups.reduce((n, g) => n + g.got, 0);
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

  function productGuideText(guide) {
    let t = String(guide || '');
    t = t.replace(/^维度说明[：:]\s*/u, '');
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
      const subRows = checks.map(c => `
        <div class="onpage-diag-sub ${subBorderClass(c.sev)}">
          <div class="onpage-diag-sub-hd">
            <span class="onpage-diag-sub-name">${e(c.title)}</span>
            <span class="onpage-diag-sub-score"><strong>${c.got != null ? c.got : '—'}</strong><span class="onpage-diag-sub-score-cap">/${c.max || '—'}</span></span>
            ${sevBadgeHTML(c.sev, e)}
          </div>
          <div class="onpage-diag-sub-line">${e(c.detail || formatSubLine(c.problem, c.suggestion, c.sev))}</div>
        </div>`).join('');
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

  function onPageDimScoresCompactHTML(row, esc) {
    const e = esc || (s => String(s));
    const model = onPageWincherCollectModel(row);
    const chips = model.groups.map(g => {
      const pct = g.max ? Math.round((g.got / g.max) * 100) : 0;
      const cls = pct >= 85 ? 'onpage-dim-chip--ok' : pct >= 65 ? 'onpage-dim-chip--mid' : 'onpage-dim-chip--low';
      const lab = ONPAGE_SCORE_DIMENSIONS.find(d => d.id === g.id);
      return `<span class="onpage-dim-chip ${cls}" title="${e(lab ? lab.label : g.id)}">${e(lab ? lab.shortLabel : g.id)} <strong>${g.got}</strong>/${g.max}</span>`;
    }).join('');
    return `<div class="onpage-dim-compact" aria-label="七维得分">${chips}</div>`;
  }

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
        if (c.sev !== 'pass' && c.suggestion) out.push(c.suggestion);
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
})(typeof window !== 'undefined' ? window : globalThis);
