(async function () {
  const API_BASE = '/app/faced/get/file';
  const DELAY_MS = 500;
  const ZIP_FILENAME = 'block_files.zip';
  const SOURCETYPE_DIR = { '0': 'html', '1': 'js', '2': 'css' };

  // --- 内置 ZIP 生成（无外部依赖） ---
  function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function buildZip(files) {
    const enc = new TextEncoder();
    const entries = files.map(f => ({ name: enc.encode(f.name), data: enc.encode(f.content) }));

    let localSize = 0, centralSize = 0;
    for (const e of entries) {
      localSize += 30 + e.name.length + e.data.length;
      centralSize += 46 + e.name.length;
    }

    const buf = new ArrayBuffer(localSize + centralSize + 22);
    const dv = new DataView(buf);
    const u8 = new Uint8Array(buf);
    let off = 0;
    const offsets = [];

    for (const e of entries) {
      offsets.push(off);
      const crc = crc32(e.data);
      dv.setUint32(off, 0x04034b50, true); off += 4;
      dv.setUint16(off, 20, true); off += 2;
      dv.setUint16(off, 0x0800, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint32(off, crc, true); off += 4;
      dv.setUint32(off, e.data.length, true); off += 4;
      dv.setUint32(off, e.data.length, true); off += 4;
      dv.setUint16(off, e.name.length, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      u8.set(e.name, off); off += e.name.length;
      u8.set(e.data, off); off += e.data.length;
    }

    const cdOff = off;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const crc = crc32(e.data);
      dv.setUint32(off, 0x02014b50, true); off += 4;
      dv.setUint16(off, 20, true); off += 2;
      dv.setUint16(off, 20, true); off += 2;
      dv.setUint16(off, 0x0800, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint32(off, crc, true); off += 4;
      dv.setUint32(off, e.data.length, true); off += 4;
      dv.setUint32(off, e.data.length, true); off += 4;
      dv.setUint16(off, e.name.length, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint16(off, 0, true); off += 2;
      dv.setUint32(off, 0, true); off += 4;
      dv.setUint32(off, offsets[i], true); off += 4;
      u8.set(e.name, off); off += e.name.length;
    }

    const cdEnd = off;
    dv.setUint32(off, 0x06054b50, true); off += 4;
    dv.setUint16(off, 0, true); off += 2;
    dv.setUint16(off, 0, true); off += 2;
    dv.setUint16(off, entries.length, true); off += 2;
    dv.setUint16(off, entries.length, true); off += 2;
    dv.setUint32(off, cdEnd - cdOff, true); off += 4;
    dv.setUint32(off, cdOff, true); off += 4;
    dv.setUint16(off, 0, true);

    return new Blob([buf], { type: 'application/zip' });
  }

  // --- 提取文件列表（清洗 fileid 并去重） ---
  const fileMap = new Map();
  document.querySelectorAll('a[data-fileid][data-filename]').forEach(el => {
    const rawId = el.getAttribute('data-fileid');
    const fileid = rawId.replace(/-\d+$/, '');
    const filename = el.getAttribute('data-filename');
    const sourcetype = el.getAttribute('data-sourcetype');
    if (fileid && filename && !fileMap.has(fileid)) {
      fileMap.set(fileid, { filename, sourcetype });
    }
  });

  const files = Array.from(fileMap, ([fileid, info]) => ({
    fileid,
    filename: info.filename,
    sourcetype: info.sourcetype,
    dir: SOURCETYPE_DIR[info.sourcetype] || 'other'
  }));

  console.log(`%c[下载脚本] 共发现 ${files.length} 个文件`, 'color:#2196F3;font-weight:bold');
  console.table(files.map(f => ({ 目录: f.dir, 文件名: f.filename, fileId: f.fileid })));

  if (files.length === 0) {
    console.warn('[下载脚本] 页面上未找到任何文件');
    return;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const zipFiles = [];
  let success = 0;
  let fail = 0;

  for (let i = 0; i < files.length; i++) {
    const { fileid, filename, dir, sourcetype } = files[i];
    console.log(`%c[${i + 1}/${files.length}] 正在获取: ${dir}/${filename}`, 'color:#4CAF50');

    try {
      const fileType = sourcetype || '0';
      const url = `${API_BASE}?fileId=${fileid}&fileType=${fileType}&versionNo=&terminalType=0&styleId=-1`;
      const resp = await fetch(url);
      const data = await resp.json();
      const content = data.status === '200' && data.result
        ? (data.result.randerContent ?? data.result.resourceContent)
        : null;

      if (content != null) {
        zipFiles.push({ name: dir + '/' + filename, content });
        console.log(`  ✓ ${filename}`);
        success++;
      } else {
        console.error(`  ✗ ${filename} 接口返回异常:`, data);
        fail++;
      }
    } catch (err) {
      console.error(`  ✗ ${filename} 请求失败:`, err);
      fail++;
    }

    if (i < files.length - 1) await sleep(DELAY_MS);
  }

  if (success === 0) {
    console.error('[下载脚本] 没有成功获取任何文件，跳过打包');
    return;
  }

  console.log('%c[下载脚本] 正在生成 ZIP 文件...', 'color:#FF9800');
  const blob = buildZip(zipFiles);
  const dlUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = dlUrl;
  a.download = ZIP_FILENAME;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(dlUrl); a.remove(); }, 100);

  console.log(
    `%c[下载脚本] 完成! 成功: ${success}, 失败: ${fail}, 总计: ${files.length} → ${ZIP_FILENAME}`,
    'color:#FF9800;font-weight:bold'
  );
})();
