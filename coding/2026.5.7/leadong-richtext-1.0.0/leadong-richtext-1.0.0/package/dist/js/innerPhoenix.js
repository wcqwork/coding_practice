/**
  * 组件加载js并执行callback
  *
  * @param {Object} window
  * @param {Object} $
  * @param {Object} undefined
  * @parm {options:{componentName:[]||'',callback:function(){}}}
  *
  * 当传入组件名称为数组时候，需要是相对路径
  */
  (function (window, $, undefined) {
    var phoenixSite = window.$_phoenix || (window.$_phoenix = {});
    const allScripts = $.makeArray($('script[src]'));
    window.editor_version = 'po_1.0.0';
    const scriptPromises = new Map(); // 用于存储脚本“去重Key”和对应的加载 Promise（避免同一脚本不同参数重复加载）
    const globalLoadPromises = []; // 用于存储所有脚本的加载 Promise

    /**
     * 生成脚本去重 Key（协议无关 + 忽略查询参数 + 忽略 Hash）。
     *
     * 设计取舍：
     * - 统一删除 “? 后面的所有参数”，避免同一资源仅因参数不同而重复加载（缺陷）。
     *
     * 兼容风险提醒（需要人工确认）：
     * - 若业务存在“同一路径但 query 表达不同资源”的情况（例如 /loader.js?module=a 与 module=b），
     *   此策略会把它们视为同一个资源并可能被去重过滤；这类场景应改为不同文件名/不同路径来区分资源。
     *
     * @param {string} url 原始脚本地址（可为相对/绝对/带参数）
     * @returns {string} 去重用的唯一标识
     */
    function getScriptDedupeKey(url) {
        if (!url) return '';
        try {
            const u = new URL(url, window.location.href);
            // 统一为“协议无关”的基准路径（origin + pathname），强制忽略 search/hash
            return (u.origin + u.pathname).replace(/^(http|https):/, '');
        } catch (e) {
            // 兼容兜底：无法解析 URL 时，移除协议、?query、#hash（与主逻辑保持一致）
            return String(url)
                .replace(/^(http|https):/, '')
                .split('#')[0]
                .split('?')[0];
        }
    }

    phoenixSite.script = async function (js_depand, id = '') {
        // 去重（忽略查询参数/Hash）：同一个脚本无论带什么参数，都只保留第一次出现的 URL
        const urlKeyMap = new Map();
        (js_depand || []).forEach((u) => {
            const key = getScriptDedupeKey(u);
            if (!urlKeyMap.has(key)) urlKeyMap.set(key, u);
        });
        const jsDepand = [...urlKeyMap.values()];

        // 过滤掉已经加载的脚本
        const uniqueScriptUrls = jsDepand.filter(function (scriptUrl) {
            // 规范化 URL：协议无关 + 忽略查询参数/Hash
            const normalizedScriptKey = getScriptDedupeKey(scriptUrl);
            // 检查页面中是否已经存在该脚本
            return !allScripts.some(function (item) {
                const normalizedSrcKey = getScriptDedupeKey(item.src);
                return normalizedSrcKey === normalizedScriptKey;
            });
        });

        // 如果没有需要加载的脚本，直接返回
        // if (!uniqueScriptUrls.length) {
        //     return;
        // }

        // 将需要加载的脚本 URL 添加到 allScripts 中
        allScripts.push(...uniqueScriptUrls.map(src => ({ src })));

        // 加载每个脚本，并存储对应的 Promise
        uniqueScriptUrls.map(scriptUrl => {
            const key = getScriptDedupeKey(scriptUrl);
            if (!scriptPromises.has(key)) {
                // 如果脚本尚未加载，创建加载 Promise
                const promise = loadScript(scriptUrl);
                scriptPromises.set(key, promise);
                globalLoadPromises.push(promise); // 将 Promise 添加到全局队列
            }
            return scriptPromises.get(key);
        });

        // 等待所有脚本加载完成
        await Promise.all(globalLoadPromises);
    }

    /**
     * 移除已加载的脚本标签（仅移除 DOM 标签与内部去重缓存）。
     *
     * 注意/风险：
     * - 移除 <script> 不会回滚脚本已执行产生的副作用（例如挂载到 window 的全局变量、注册的事件等）。
     * - 本方法主要用于“避免重复加载/释放 DOM 标签/允许后续重新插入脚本标签”的场景。
     *
     * 容错策略：
     * - 支持传入 string 或 string[]
     * - 支持相对/绝对 URL、带不带协议
     * - 按 getScriptDedupeKey 规则匹配（协议无关，且对 query 是否参与去重做了保守处理）
     *
     * @param {string|string[]} urls 需要移除的脚本地址列表
     */
    phoenixSite.removeScript = function (urls) {
        try {
            const urlList = Array.isArray(urls) ? urls : (urls ? [urls] : []);
            if (!urlList.length) return;

            const targetKeys = new Set(urlList.map((u) => getScriptDedupeKey(u)).filter(Boolean));
            if (!targetKeys.size) return;

            const doc = window.document;
            const scripts = doc.querySelectorAll('script[src]');
            scripts.forEach((scriptEl) => {
                const key = getScriptDedupeKey(scriptEl.src);
                if (targetKeys.has(key)) {
                    scriptEl.parentNode && scriptEl.parentNode.removeChild(scriptEl);
                }
            });

            // 同步清理内部缓存，避免后续因为缓存命中导致无法重新加载
            targetKeys.forEach((k) => {
                scriptPromises.delete(k);
            });
            // allScripts 中的结构为：真实 DOM script 元素 + 我们 push 的 {src} 对象
            for (let i = allScripts.length - 1; i >= 0; i--) {
                const item = allScripts[i];
                const src = item && item.src;
                if (src && targetKeys.has(getScriptDedupeKey(src))) {
                    allScripts.splice(i, 1);
                }
            }
            // globalLoadPromises 为历史加载 promise 队列（不可可靠反向清理），保留即可
        } catch (e) {
            // 容错：不阻塞主流程
            console.error('[phoenixSite.removeScript] 执行失败', e);
        }
    }

    function loadScript(scriptUrl) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * 设计目标：像 loadCss 一样通过往 <head> 插入标签来加载脚本，
                 * 这样后续可以通过 DOM 直接移除 <script>（配合 phoenixSite.removeScript）。
                 *
                 * 兼容策略：
                 * - 若 scriptUrl 不包含 '//' 且不是相对路径（不以 '/' 开头），默认补全为协议无关的 '//'
                 * - 统一移除 'http:' / 'https:'，避免混用协议导致重复加载
                 */
                if (!scriptUrl) {
                    resolve();
                    return;
                }
                const doc = window.document;
                const pattern = /^(http|https):/;
                const urlSrc = (String(scriptUrl).includes('//') || String(scriptUrl).startsWith('/')) ? String(scriptUrl) : ('//' + String(scriptUrl));
                const resultUrl = urlSrc.replace(pattern, '');

                const scriptDom = doc.createElement('script');
                scriptDom.type = 'text/javascript';
                // 动态插入的 script 在部分浏览器中默认 async=true；这里显式关闭，减少时序不确定性
                scriptDom.async = false;
                scriptDom.src = resultUrl;

                scriptDom.onload = function () {
                    resolve();
                };
                scriptDom.onerror = function (error) {
                    console.error('Failed to load script:', scriptUrl, error);
                    reject(error);
                };

                const heads = doc.getElementsByTagName('head');
                if (heads.length) {
                    heads[0].appendChild(scriptDom);
                } else {
                    doc.documentElement.appendChild(scriptDom);
                }
            } catch (e) {
                console.error('Failed to load script:', scriptUrl, e);
                reject(e);
            }
        });
    }
    // 所有页面功能对象
  var pagefunc = window.$_phoenix.pagefunc || (window.$_phoenix.pagefunc = {});

  var component_management = pagefunc['component_management'] || (pagefunc['component_management'] = {});
  $.extend(component_management, {
    setup: function(module, callback, invokeAction) {
      return
  }
  });

})(this, typeof jQuery === 'undefined' ? undefined : jQuery);



 /**
  * 组件设置依赖异步加载处理
  *
  * @param {Object} window
  * @param {Object} $
  * @param {Object} undefined
  * @parm {options:{componentName:[]||'',callback:function(){}}}
  *
  * 当传入组件名称为数组时候，需要是相对路径
  */

 (function (window, $, undefined) {
    var phoenixSite = window.$_phoenix || (window.$_phoenix = {});
    var allStyle = $.makeArray($('link[href]'))
    phoenixSite.loadCss = function (url) {

        var isHaveLink = allStyle.filter(function (item) {
            return item.href && item.href.indexOf(url) > -1;
        }).length > 0 ? true : false;
        var doc = window.document;
        if (!isHaveLink) {
            var link = doc.createElement("link");

            link.setAttribute("rel", "stylesheet");

            link.setAttribute("type", "text/css");
            const pattern = /^(http|https):/;
            const urlSrc =  url.includes('//')? url: '//'+ url
            const resultUrl = urlSrc.replace(pattern, "");
            link.setAttribute("href", resultUrl);

            var heads = doc.getElementsByTagName("head");

            if (heads.length) {
                heads[0].appendChild(link);
            } else {
                doc.documentElement.appendChild(link);
            }
            allStyle.push({
                href: url
            });
        }
    }

    /**
     * 生成资源匹配 Key（用于 removeCss 的容错匹配）。
     * - 协议无关
     * - 同时生成“包含 query”与“不包含 query”的 key，避免调用方传入形式不一致导致删不掉
     *
     * @param {string} url 原始地址（相对/绝对/带参数均可）
     * @returns {string[]} key 列表（可能为空）
     */
    function getStyleMatchKeys(url) {
        if (!url) return [];
        try {
            const u = new URL(url, window.location.href);
            const base = (u.origin + u.pathname).replace(/^(http|https):/, '');
            const withSearch = (u.origin + u.pathname + u.search).replace(/^(http|https):/, '');
            const keys = new Set([
                withSearch,
                base,
                u.pathname + u.search,
                u.pathname,
            ]);
            return Array.from(keys).filter(Boolean);
        } catch (e) {
            // 兜底：无法解析 URL，至少保证协议无关 + 同时支持去掉 hash
            const raw = String(url).replace(/^(http|https):/, '').split('#')[0];
            const noQuery = raw.split('?')[0];
            const keys = new Set([raw, noQuery]);
            return Array.from(keys).filter(Boolean);
        }
    }

    /**
     * 移除已加载的 CSS（仅移除 <link rel="stylesheet"> 标签）。
     *
     * 容错策略：
     * - 支持传入 string 或 string[]
     * - 支持相对/绝对、带不带协议、带不带 query/hash
     *
     * @param {string|string[]} urls 需要移除的样式地址列表
     */
    phoenixSite.removeCss = function (urls) {
        try {
            const urlList = Array.isArray(urls) ? urls : (urls ? [urls] : []);
            if (!urlList.length) return;

            const targetKeySet = new Set();
            urlList.forEach((u) => getStyleMatchKeys(u).forEach((k) => targetKeySet.add(k)));
            if (!targetKeySet.size) return;

            const doc = window.document;
            const links = doc.querySelectorAll('link[rel="stylesheet"][href]');
            links.forEach((link) => {
                const linkKeys = getStyleMatchKeys(link.href);
                const hit = linkKeys.some((k) => targetKeySet.has(k));
                if (hit) {
                    link.parentNode && link.parentNode.removeChild(link);
                }
            });

            // 同步清理本地缓存数组（allStyle 里存的是调用方传入的 url 字符串）
            allStyle = allStyle.filter(function (item) {
                if (!item || !item.href) return false;
                const itemKeys = getStyleMatchKeys(item.href);
                return !itemKeys.some((k) => targetKeySet.has(k));
            });
        } catch (e) {
            console.error('[phoenixSite.removeCss] 执行失败', e);
        }
    }

  })(this, typeof jQuery === 'undefined' ? undefined : jQuery);
  //内部计算LCP
(function (window, $, undefined) {
    window.GETLCP = () => {
        return new Promise((resolve, reject) => {
            try {
              const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (entry.url) {
                    const lcpPreload = `<link rel="preload" as="image" href="${entry.url}" fetchpriority="high">`;
                    observer.disconnect(); // 断开观察器连接
                    resolve(lcpPreload); // 返回LCP预加载链接
                    break; // 找到LCP后退出循环
                  }
                }
              });
        
              observer.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (e) {
              console.error(e);
              resolve(''); // 如果发生错误，拒绝Promise
            }
            // observer.observe 3s之后不执行 直接resolve
            setTimeout(()=>{
                resolve('')
            },3000)
          });
        }

        // 阻止Chrome自动翻译的完整脚本
    function disableChromeTranslation() {
        if (typeof document === 'undefined') return;
    // 添加meta标签
     if (!document.querySelector('meta[name="google"]')) {
         const meta = document.createElement('meta');
         meta.name = 'google';
         meta.content = 'notranslate';
         document.head.appendChild(meta);
    }
    
      // 设置html属性
      document.documentElement && document.documentElement.setAttribute('translate', 'no');
  }
  
    // 页面加载时执行
    disableChromeTranslation();
})(this, typeof jQuery === 'undefined' ? undefined : jQuery);

var leadPhoenixComponentSite = window.leadPhoenixComponentSite || (window.leadPhoenixComponentSite = {});

Object.assign(leadPhoenixComponentSite, {
    loadSuccessJsList:[],
    // 加载依赖成功
    sourceDeepSuccess: async function (jsDeep, cssDeep) {
        for (let urlLink of cssDeep) {
            if (this.isLoadSuccess(urlLink)) {
                continue;
            }
            await this.loadDependFunc({ url: urlLink, type: 'style' });
        }
        for (let urlLink of jsDeep) {
            if (this.isLoadSuccess(urlLink)) {
                continue;
            }
            await this.loadDependFunc({ url: urlLink, type: 'script' });
        }
    },
    //创建资源加载的promis对象
    loadDependFunc(option) {
        var loadDependPromise = new Promise((resolve, rej) => {
            if (option.type == "script") {
                var scriptDom = document.createElement("script");
                scriptDom.type = "text/javascript";
                scriptDom.src = option.url;
                document.head.appendChild(scriptDom);
                scriptDom.onload = function () {
                   leadPhoenixComponentSite.loadSuccessJsList.push(option.url);
                    resolve("success");
                };
                scriptDom.onerror = function () {
                    resolve("error");
                };
            }
            if (option.type == "style") {
                var linkDom = document.createElement("link");
                linkDom.rel = "stylesheet";
                linkDom.href = option.url;
                document.head.appendChild(linkDom);
                resolve("success");
            }
        });

        return loadDependPromise;
    },
    // 查找页面是否存在已加载资源
    isLoadSuccess(scriptUrl) {
        if(this.loadSuccessJsList.indexOf(scriptUrl) != -1){
            return true;
        }
    }
})
