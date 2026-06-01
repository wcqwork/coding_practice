// ==UserScript==
// @name         Anti Visibility Detection
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  阻止网站检测页面可见性 + 后台自动恢复视频播放
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    const TAG = '[AntiVisibility]';

    // ==================== DOM 注入（最高优先级，先于所有页面脚本） ====================
    // 所有核心逻辑通过 <script> 标签注入到页面原生上下文，确保在 video.min.js 之前执行

    try {
        const script = document.createElement('script');
        script.textContent = `(function() {
            var TAG = '[AV]';
            var loc = location.href.slice(0, 80);

            try {
                // ======= 1. Visibility API 欺骗 =======
                Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: true });
                Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                Object.defineProperty(Document.prototype, 'hidden', { get: function() { return false; }, configurable: true });
                Object.defineProperty(Document.prototype, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                document.hasFocus = function() { return true; };
                window.onblur = null;
                window.onfocus = null;
                Object.defineProperty(document, 'onvisibilitychange', { get: function() { return null; }, set: function() {}, configurable: true });

                // ======= 2. 劫持 addEventListener，丢弃 visibility 相关注册 =======
                var _rawAdd = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function(type, fn, opt) {
                    if (type === 'visibilitychange' || type === 'webkitvisibilitychange' ||
                        type === 'mozvisibilitychange' || type === 'msvisibilitychange') {
                        console.log(TAG + ' 丢弃 addEventListener(' + type + ') | ' + loc);
                        return;
                    }
                    return _rawAdd.call(this, type, fn, opt);
                };

                // ======= 3. 劫持 HTMLMediaElement.prototype.pause =======
                // 只允许用户交互触发的暂停，JS 调用一律拦截
                var _origPause = HTMLMediaElement.prototype.pause;
                var _userAction = false;
                var _videoEnded = false;

                // 检测用户点击（捕获阶段，最先触发）
                _rawAdd.call(document, 'click', function(e) {
                    _userAction = true;
                    setTimeout(function() { _userAction = false; }, 300);
                }, true);

                // 检测键盘操作（空格暂停等）
                _rawAdd.call(document, 'keydown', function(e) {
                    if (e.key === ' ' || e.code === 'Space' || e.key === 'k' || e.key === 'K') {
                        _userAction = true;
                        setTimeout(function() { _userAction = false; }, 300);
                    }
                }, true);

                HTMLMediaElement.prototype.pause = function() {
                    if (_userAction) {
                        console.log(TAG + ' 用户操作触发 pause，允许');
                        return _origPause.call(this);
                    }
                    if (this.ended) {
                        return _origPause.call(this);
                    }
                    // 允许视频初始化时的 pause（尚未播放过）
                    if (this.currentTime === 0 && this.paused) {
                        return _origPause.call(this);
                    }
                    console.log(TAG + ' 拦截 JS pause() 调用');
                    return undefined;
                };

                // ======= 4. 兜底：监听 pause 事件，自动恢复 =======
                // 处理浏览器引擎直接暂停（不经过 JS）的情况
                _rawAdd.call(document, 'pause', function(e) {
                    var video = e.target;
                    if (!video || video.tagName !== 'VIDEO') return;
                    if (video.ended || _userAction) return;

                    console.log(TAG + ' 兜底：检测到 video pause 事件，200ms后恢复');
                    setTimeout(function() {
                        if (video.paused && !video.ended && !_userAction) {
                            video.play().then(function() {
                                console.log(TAG + ' 兜底：恢复成功');
                            }).catch(function() {});
                        }
                    }, 200);
                }, true);

                // ======= 5. 拦截 blur/pagehide 事件 =======
                var _block = function(e) { e.stopImmediatePropagation(); e.preventDefault(); };
                _rawAdd.call(window, 'blur', _block, true);
                _rawAdd.call(window, 'pagehide', _block, true);

                console.log(TAG + ' 全部 patch 成功 | ' + loc);
            } catch(e) {
                console.warn(TAG + ' 失败: ' + e.message);
            }
        })();`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    } catch (e) {}

    // ==================== 扫描同源 iframe ====================

    function patchIframes() {
        document.querySelectorAll('iframe').forEach(function(iframe) {
            try {
                if (iframe.contentDocument && iframe.contentWindow && !iframe.__avp) {
                    iframe.__avp = true;
                    var iDoc = iframe.contentDocument;
                    var iWin = iframe.contentWindow;

                    Object.defineProperty(iDoc, 'hidden', { get: function() { return false; }, configurable: true });
                    Object.defineProperty(iDoc, 'visibilityState', { get: function() { return 'visible'; }, configurable: true });
                    iDoc.hasFocus = function() { return true; };
                    iWin.onblur = null;
                }
            } catch (e) {}
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { patchIframes(); setInterval(patchIframes, 3000); });
    } else {
        patchIframes();
        setInterval(patchIframes, 3000);
    }
})();
