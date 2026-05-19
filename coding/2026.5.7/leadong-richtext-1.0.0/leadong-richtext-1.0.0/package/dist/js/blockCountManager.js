/**
 * BlockType 和新版编辑器4.0区块数量管理器
 * 用于管理 Tiptap 编辑器中 BlockType 节点和区块容器的数量统计
 * 
 * 使用方式：
 * 1. 引入此文件后，通过 window.BlockCountManager 访问所有方法
 * 2. 或者直接使用挂载到 window 上的快捷方法
 */
(function(window) {
    /**
     * 配置常量
     */
    var CONFIG = {
        // 父页面中 tiptap 编辑器标签页的选择器
        TIPTAP_H3_SELECTOR: '#accordion .title-list h3.phoenix_tipTapRichText',
        // 当前活跃标签页的选择器
        ACTIVE_H3_SELECTOR: '#accordion .title-list h3.active.phoenix_tipTapRichText',
        // blockTypeCount input 的类名
        BLOCK_TYPE_INPUT_CLASS: 'blockTypeCount',
        BLOCK_CONTAINER_INPUT_CLASS: 'blockContainerCount',
        HIDDEN_HTML_SELECTOR: 'textarea.hidden',
        CONTENT_CONTAINER_SELECTOR: '.contentEditRichText_editorContainer',
        BLOCK_TYPE_SELECTOR: '.block-type-wrapper',
        BLOCK_CONTAINER_SELECTOR: '.block-container'
    };
    
    /**
     * 获取父页面的 document 对象
     * @returns {Document|null}
     */
    function getParentDocument() {
        try {
            if (window.parent && window.parent.document) {
                return window.parent.document;
            }
        } catch (e) {
            console.warn('BlockCountManager: Cannot access parent document', e);
        }
        return null;
    }

    function parseBlockTypeAndBlockCountFromHtml(html) {
        if (!html) {
            return {
                blockTypeCount: 0,
                blockContainerCount: 0
            };
        }

        try {
            var temp = document.createElement('div');
            temp.innerHTML = html;

            var contentRoot = temp.querySelector(CONFIG.CONTENT_CONTAINER_SELECTOR) || temp;

            return {
                blockTypeCount: contentRoot.querySelectorAll(CONFIG.BLOCK_TYPE_SELECTOR).length,
                blockContainerCount: contentRoot.querySelectorAll(CONFIG.BLOCK_CONTAINER_SELECTOR).length
            };
        } catch (e) {
            console.warn('BlockCountManager: Failed to parse counts from html', e);
        }

        return {
            blockTypeCount: 0,
            blockContainerCount: 0
        };
    }

    function setBlockTypeAndBlockCountForElement(targetEl, blockTypeCount, blockContainerCount) {
        if (!targetEl) {
            return;
        }

        // 创建或更新 blockTypeCount span（避免被 prod_config.js 的 find("input") 误匹配）
        var blockTypeInput = targetEl.querySelector('span.' + CONFIG.BLOCK_TYPE_INPUT_CLASS);
        if (!blockTypeInput) {
            blockTypeInput = targetEl.ownerDocument.createElement('span');
            blockTypeInput.style.display = 'none';
            blockTypeInput.className = CONFIG.BLOCK_TYPE_INPUT_CLASS;
            targetEl.appendChild(blockTypeInput);
        }
        blockTypeInput.value = blockTypeCount || 0;

        // 创建或更新 blockContainerCount span
        var blockContainerInput = targetEl.querySelector('span.' + CONFIG.BLOCK_CONTAINER_INPUT_CLASS);
        if (!blockContainerInput) {
            blockContainerInput = targetEl.ownerDocument.createElement('span');
            blockContainerInput.style.display = 'none';
            blockContainerInput.className = CONFIG.BLOCK_CONTAINER_INPUT_CLASS;
            targetEl.appendChild(blockContainerInput);
        }
        blockContainerInput.value = blockContainerCount || 0;
    }
    
    /**
     * 获取当前编辑器的 BlockType 和区块容器数量
     * 通过调用挂载在 window 上的方法获取（由 Tiptap 编辑器提供）
     * @returns {Object} { blockTypeCount: number, blockContainerCount: number }
     */
    function getBlockTypeAndBlockCount() {
        try {
            var result = {
                blockTypeCount: 0,
                blockContainerCount: 0
            };
            
            // 调用挂载在 window 上的方法获取数量（由 Tiptap 编辑器的 main.js 提供）
            if (typeof window.getBlockTypeCount === 'function') {
                result.blockTypeCount = window.getBlockTypeCount() || 0;
            }
            
            if (typeof window.getBlockContainerCount === 'function') {
                result.blockContainerCount = window.getBlockContainerCount() || 0;
            }
            
            return result;
        } catch (e) {
            console.warn('BlockCountManager: Failed to get blockType and blockCount', e);
        }
        return {
            blockTypeCount: 0,
            blockContainerCount: 0
        };
    }
    
    /**
     * 设置当前标签页的 BlockType 和区块容器数量
     * 通过在父页面 h3 元素内添加隐藏的 input 来实现
     * @param {number} blockTypeCount - blockType 节点数量
     * @param {number} blockContainerCount - 区块容器数量
     */
    function setBlockTypeAndBlockCount(blockTypeCount, blockContainerCount) {
        try {
            var pDoc = getParentDocument();
            if (!pDoc) return;
            
            // 获取当前活跃的 tiptap 编辑器对应的 h3 元素
            var activeH3 = pDoc.querySelector(CONFIG.ACTIVE_H3_SELECTOR);
            if (!activeH3) {
                console.warn('BlockCountManager: Active h3 element not found');
                return;
            }

            setBlockTypeAndBlockCountForElement(activeH3, blockTypeCount, blockContainerCount);
        } catch (e) {
            console.warn('BlockCountManager: Failed to set blockType and blockCount', e);
        }
    }
    
    /**
     * 同步当前编辑器的区块数量到父页面的 hidden input
     */
    function syncBlockCount() {
        try {
            var counts = getBlockTypeAndBlockCount();
            setBlockTypeAndBlockCount(counts.blockTypeCount, counts.blockContainerCount);
        } catch (e) {
            // 忽略同步失败
        }
    }

    /**
     * 首次打开页面时，批量为所有 tiptap 页签初始化区块数量
     */
    function initAllBlockCount() {
        try {
            var pDoc = getParentDocument();
            if (!pDoc) return;

            var allTipTapH3 = pDoc.querySelectorAll(CONFIG.TIPTAP_H3_SELECTOR);
            for (var i = 0; i < allTipTapH3.length; i++) {
                var h3 = allTipTapH3[i];
                var hiddenEl = h3.querySelector(CONFIG.HIDDEN_HTML_SELECTOR);
                var html = hiddenEl ? (hiddenEl.value || hiddenEl.textContent || '') : '';
                var counts = parseBlockTypeAndBlockCountFromHtml(html);
                setBlockTypeAndBlockCountForElement(h3, counts.blockTypeCount, counts.blockContainerCount);
            }
        } catch (e) {
            console.warn('BlockCountManager: Failed to init all block counts', e);
        }
    }
    
    /**
     * 获取所有标签页的 BlockType 和区块容器数量汇总
     * 先同步当前标签页数量到 input，然后统一从 input 获取
     * @returns {Object} { blockTypeCount: number, blockContainerCount: number }
     */
    function getAllBlockTypeAndBlockCount() {
        try {
            // 先同步当前活跃标签页的数量到 input，确保数据最新
            syncBlockCount();
            
            var result = {
                blockTypeCount: 0,
                blockContainerCount: 0
            };
            
            var pDoc = getParentDocument();
            if (!pDoc) {
                return getBlockTypeAndBlockCount();
            }
            
            // 获取所有 tiptap 编辑器类型的标签页
            var allTipTapH3 = pDoc.querySelectorAll(CONFIG.TIPTAP_H3_SELECTOR);
            
            if (!allTipTapH3 || allTipTapH3.length === 0) {
                // 没有 tiptap 标签页，返回当前编辑器的数量
                return getBlockTypeAndBlockCount();
            }
            
            // 统一从 hidden input 获取所有标签页的数量
            for (var i = 0; i < allTipTapH3.length; i++) {
                var h3 = allTipTapH3[i];
                var blockTypeInput = h3.querySelector('span.' + CONFIG.BLOCK_TYPE_INPUT_CLASS);
                var blockContainerInput = h3.querySelector('span.' + CONFIG.BLOCK_CONTAINER_INPUT_CLASS);
                
                if (blockTypeInput) {
                    result.blockTypeCount += parseInt(blockTypeInput.value, 10) || 0;
                }
                if (blockContainerInput) {
                    result.blockContainerCount += parseInt(blockContainerInput.value, 10) || 0;
                }
            }
            
            return result;
        } catch (e) {
            console.warn('BlockCountManager: Failed to get all blockType and blockCount', e);
        }
        return {
            blockTypeCount: 0,
            blockContainerCount: 0
        };
    }
    
    /**
     * BlockCountManager 对象
     * 提供统一的接口访问所有区块数量管理方法
     */
    var BlockCountManager = {
        // 配置
        CONFIG: CONFIG,
        
        // 获取当前编辑器的区块数量
        getBlockTypeAndBlockCount: getBlockTypeAndBlockCount,

        // 从 HTML 离线解析区块数量
        parseBlockTypeAndBlockCountFromHtml: parseBlockTypeAndBlockCountFromHtml,

        // 首次初始化所有页签的区块数量
        initAllBlockCount: initAllBlockCount,
        
        // 设置当前标签页的区块数量
        setBlockTypeAndBlockCount: setBlockTypeAndBlockCount,

        // 设置指定标签页的区块数量
        setBlockTypeAndBlockCountForElement: setBlockTypeAndBlockCountForElement,
        
        // 同步区块数量到父页面
        syncBlockCount: syncBlockCount,
        
        // 获取所有标签页的区块数量汇总
        getAllBlockTypeAndBlockCount: getAllBlockTypeAndBlockCount
    };
    
    // 挂载到 window
    window.BlockCountManager = BlockCountManager;
    
    // 同时挂载快捷方法到 window（保持向后兼容）
    window.getBlockTypeAndBlockCount = getBlockTypeAndBlockCount;
    window.getAllBlockTypeAndBlockCount = getAllBlockTypeAndBlockCount;
    window.setBlockTypeAndBlockCount = setBlockTypeAndBlockCount;
    window.initAllBlockCount = initAllBlockCount;
    window.setBlockTypeAndBlockCountForElement = setBlockTypeAndBlockCountForElement;
    window.parseBlockTypeAndBlockCountFromHtml = parseBlockTypeAndBlockCountFromHtml;
    window.syncBlockCount = syncBlockCount;

    // 页面加载后自动初始化所有页签的区块数量
    // blockCountManager.js 运行在 iframe 内部，可以直接通过 window.parent.document 访问父页面
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAllBlockCount();
        });
    } else {
        initAllBlockCount();
    }

})(window);
