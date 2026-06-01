// ==UserScript==
// @name         Quick Template
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Quick template for customizing web pages with HTML, CSS, and JS
// @author       Template Creator
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // 可自定义的配置项
  const DEFAULT_CONFIG = {
      // 是否启用自定义 HTML
      enableHTML: true,
      // 是否启用自定义 CSS
      enableCSS: true,
      // 是否启用自定义 JS
      enableJS: true,
      // 是否显示控制面板
      showPanel: false,  // 默认不显示
      // 注入延迟（毫秒）
      injectionDelay: 0,
      // 域名配置
      domains: {},
  };

  // 从存储中获取配置，如果没有则使用默认配置
  const CONFIG = {
      ...DEFAULT_CONFIG,
      ...{
          enableHTML: GM_getValue('enableHTML', DEFAULT_CONFIG.enableHTML),
          enableCSS: GM_getValue('enableCSS', DEFAULT_CONFIG.enableCSS),
          enableJS: GM_getValue('enableJS', DEFAULT_CONFIG.enableJS),
          showPanel: GM_getValue('showPanel', DEFAULT_CONFIG.showPanel),
          injectionDelay: GM_getValue('injectionDelay', DEFAULT_CONFIG.injectionDelay),
          domains: GM_getValue('domains', DEFAULT_CONFIG.domains)
      }
  };

  // 获取当前域名
  const currentDomain = window.location.hostname;

  // 获取当前域名的配置
  function getCurrentDomainConfig() {
      return CONFIG.domains[currentDomain] || {
          html: '',
          css: '',
          js: ''
      };
  }

  // 创建控制面板
  function createControlPanel() {
      const currentConfig = getCurrentDomainConfig();
      const panel = document.createElement('div');
      panel.id = 'template-control-panel';
      panel.innerHTML = `
          <div style="
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 15px;
              border-radius: 5px;
              font-family: Arial, sans-serif;
              font-size: 14px;
              z-index: 2147483647;
              width: 600px;
              max-height: 80vh;
              overflow-y: auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
          ">
              <h3 style="margin: 0 0 10px 0; color: #00ff00;">模板控制面板</h3>
              <div style="margin-bottom: 15px;">
                  <label>当前域名：</label>
                  <input type="text" id="current-domain" value="${currentDomain}" style="
                      width: 300px;
                      padding: 5px;
                      margin: 5px 0;
                      background: #2d2d2d;
                      color: white;
                      border: 1px solid #404040;
                      border-radius: 3px;
                  ">
              </div>
              <div style="margin-bottom: 10px;">
                  <label>
                      <input type="checkbox" id="toggle-html" ${CONFIG.enableHTML ? 'checked' : ''}>
                      启用 HTML
                  </label>
                  <label style="margin-left: 10px;">
                      <input type="checkbox" id="toggle-css" ${CONFIG.enableCSS ? 'checked' : ''}>
                      启用 CSS
                  </label>
                  <label style="margin-left: 10px;">
                      <input type="checkbox" id="toggle-js" ${CONFIG.enableJS ? 'checked' : ''}>
                      启用 JS
                  </label>
              </div>
              <div style="margin-bottom: 15px;">
                  <label>HTML 代码：</label><br>
                  <textarea id="html-code" style="
                      width: 100%;
                      height: 100px;
                      margin: 5px 0;
                      background: #2d2d2d;
                      color: white;
                      border: 1px solid #404040;
                      border-radius: 3px;
                      resize: vertical;
                  ">${currentConfig.html}</textarea>
              </div>
              <div style="margin-bottom: 15px;">
                  <label>CSS 代码：</label><br>
                  <textarea id="css-code" style="
                      width: 100%;
                      height: 100px;
                      margin: 5px 0;
                      background: #2d2d2d;
                      color: white;
                      border: 1px solid #404040;
                      border-radius: 3px;
                      resize: vertical;
                  ">${currentConfig.css}</textarea>
              </div>
              <div style="margin-bottom: 15px;">
                  <label>JavaScript 代码：</label><br>
                  <textarea id="js-code" style="
                      width: 100%;
                      height: 100px;
                      margin: 5px 0;
                      background: #2d2d2d;
                      color: white;
                      border: 1px solid #404040;
                      border-radius: 3px;
                      resize: vertical;
                  ">${currentConfig.js}</textarea>
              </div>
              <div style="display: flex; gap: 10px;">
                  <button id="apply-changes" style="
                      padding: 5px 10px;
                      background: #00ff00;
                      border: none;
                      border-radius: 3px;
                      color: black;
                      cursor: pointer;
                  ">应用更改</button>
                  <button id="reset-defaults" style="
                      padding: 5px 10px;
                      background: #ff4444;
                      border: none;
                      border-radius: 3px;
                      color: white;
                      cursor: pointer;
                  ">重置默认值</button>
                  <button id="delete-domain" style="
                      padding: 5px 10px;
                      background: #ff8c00;
                      border: none;
                      border-radius: 3px;
                      color: white;
                      cursor: pointer;
                  ">删除当前域名配置</button>
              </div>
              <button id="close-panel" style="
                  position: absolute;
                  top: 5px;
                  right: 5px;
                  background: none;
                  border: none;
                  color: white;
                  cursor: pointer;
                  font-weight: bold;
              ">X</button>
          </div>
      `;

      document.body.appendChild(panel);

      // 验证域名格式
      function isValidDomain(domain) {
          const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
          return pattern.test(domain);
      }

      // 添加事件监听器
      document.getElementById('close-panel').onclick = () => {
          panel.remove();
          CONFIG.showPanel = false;
          GM_setValue('showPanel', false);
      };

      document.getElementById('apply-changes').onclick = () => {
          const domainInput = document.getElementById('current-domain').value.trim();

          // 验证域名
          if (!isValidDomain(domainInput)) {
              alert('请输入有效的域名！');
              return;
          }

          // 保存域名特定的配置
          CONFIG.domains[domainInput] = {
              html: document.getElementById('html-code').value,
              css: document.getElementById('css-code').value,
              js: document.getElementById('js-code').value
          };

          // 保存全局配置
          CONFIG.enableHTML = document.getElementById('toggle-html').checked;
          CONFIG.enableCSS = document.getElementById('toggle-css').checked;
          CONFIG.enableJS = document.getElementById('toggle-js').checked;

          // 保存所有配置到存储
          GM_setValue('domains', CONFIG.domains);
          GM_setValue('enableHTML', CONFIG.enableHTML);
          GM_setValue('enableCSS', CONFIG.enableCSS);
          GM_setValue('enableJS', CONFIG.enableJS);

          // 显示保存成功提示
          const saveMsg = document.createElement('div');
          saveMsg.textContent = '设置已保存';
          saveMsg.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 255, 0, 0.8);
              color: white;
              padding: 10px 20px;
              border-radius: 5px;
              z-index: 2147483647;
          `;
          document.body.appendChild(saveMsg);

          // 2秒后移除提示并刷新页面
          setTimeout(() => {
              saveMsg.remove();
              location.reload();
          }, 2000);
      };

      document.getElementById('delete-domain').onclick = () => {
          const domainInput = document.getElementById('current-domain').value.trim();
          if (CONFIG.domains[domainInput]) {
              delete CONFIG.domains[domainInput];
              GM_setValue('domains', CONFIG.domains);

              const deleteMsg = document.createElement('div');
              deleteMsg.textContent = '域名配置已删除';
              deleteMsg.style.cssText = `
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: rgba(255, 140, 0, 0.8);
                  color: white;
                  padding: 10px 20px;
                  border-radius: 5px;
                  z-index: 2147483647;
              `;
              document.body.appendChild(deleteMsg);

              setTimeout(() => {
                  deleteMsg.remove();
                  location.reload();
              }, 2000);
          }
      };

      document.getElementById('reset-defaults').onclick = () => {
          if (confirm('确定要重置所有设置吗？这将删除所有域名配置。')) {
              // 重置为默认配置
              Object.keys(DEFAULT_CONFIG).forEach(key => {
                  GM_setValue(key, DEFAULT_CONFIG[key]);
              });

              // 显示重置成功提示
              const resetMsg = document.createElement('div');
              resetMsg.textContent = '已重置为默认设置';
              resetMsg.style.cssText = `
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: rgba(255, 68, 68, 0.8);
                  color: white;
                  padding: 10px 20px;
                  border-radius: 5px;
                  z-index: 2147483647;
              `;
              document.body.appendChild(resetMsg);

              setTimeout(() => {
                  resetMsg.remove();
                  location.reload();
              }, 2000);
          }
      };
  }

  // 注入自定义 HTML
  function injectHTML() {
      if (!CONFIG.enableHTML) return;
      const domainConfig = getCurrentDomainConfig();
      if (domainConfig.html) {
          const div = document.createElement('div');
          div.innerHTML = domainConfig.html;
          document.body.appendChild(div);
      }
  }

  // 注入自定义 CSS
  function injectCSS() {
      if (!CONFIG.enableCSS) return;
      const domainConfig = getCurrentDomainConfig();
      if (domainConfig.css) {
          if (typeof GM_addStyle !== 'undefined') {
              GM_addStyle(domainConfig.css);
          } else {
              const style = document.createElement('style');
              style.textContent = domainConfig.css;
              document.head.appendChild(style);
          }
      }
  }

  // 注入自定义 JavaScript
  function injectJS() {
      if (!CONFIG.enableJS) return;
      const domainConfig = getCurrentDomainConfig();
      if (domainConfig.js) {
          try {
              const scriptFunc = new Function(domainConfig.js);
              scriptFunc();
          } catch (error) {
              console.error('Custom JS execution error:', error);
          }
      }
  }

  // 创建或切换控制面板
  function toggleControlPanel() {
      const existingPanel = document.getElementById('template-control-panel');
      if (existingPanel) {
          existingPanel.remove();
          CONFIG.showPanel = false;
          GM_setValue('showPanel', false);
      } else {
          createControlPanel();
          CONFIG.showPanel = true;
          GM_setValue('showPanel', true);
      }
  }

  // 添加快捷键监听
  function setupKeyboardShortcut() {
      document.addEventListener('keydown', function(event) {
          // 检测 Alt + 1
          if (event.altKey && event.key === '1') {
              event.preventDefault(); // 阻止默认行为
              toggleControlPanel();
          }
      });
  }

  // 初始化函数
  function initialize() {
      // 注入 CSS（最先注入）
      injectCSS();

      // 等待 DOM 加载完成
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                  injectHTML();
                  injectJS();
                  setupKeyboardShortcut(); // 添加快捷键监听
              }, CONFIG.injectionDelay);
          });
      } else {
          setTimeout(() => {
              injectHTML();
              injectJS();
              setupKeyboardShortcut(); // 添加快捷键监听
          }, CONFIG.injectionDelay);
      }
  }

  // 启动脚本
  initialize();

  // 导出到全局作用域（用于调试）
  if (typeof unsafeWindow !== 'undefined') {
      unsafeWindow.templateConfig = CONFIG;
      unsafeWindow.reloadTemplate = initialize;
  }
})();
