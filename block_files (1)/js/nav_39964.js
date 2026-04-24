/**
 * 导航组件核心JS - 公共逻辑
 * 包含两种下拉风格共用的基础功能
 * @version 3.1
 */
(function (window, $, undefined) {
    var _block_namespaces_ = window._block_namespaces_ || (window._block_namespaces_ = {});
    var name = "nav_40658";
    var nav_40658 = _block_namespaces_[name] || (_block_namespaces_[name] = {});
    
    // ==================== 常量定义 ====================
    var CONSTANTS = {
        MOBILE_BREAKPOINT: 768,        // 移动端断点
        ANIMATION_DURATION: 300,       // 动画持续时间
        HOVER_DELAY: 100,             // 悬停延迟
        RESIZE_DELAY: 500             // resize延迟
    };
    
    $.extend(nav_40658, {
        "CONSTANTS": CONSTANTS,
        // 设备判断
        "isPhone": isPhone,
        "isMobile": isMobile,
        // DOM操作
        "getSelector": getSelector,
        "getSelectorByClass": getSelectorByClass,
        "bindEventOnce": bindEventOnce,
        "toggleClass": toggleClass,
        // CSS操作
        "setCSSVar": setCSSVar,
        "getCSSVar": getCSSVar,
        "setCSSProperty": setCSSProperty,
        // 位置计算
        "calculateOffset": calculateOffset,
        "isElementVisible": isElementVisible,
        "getViewportWidth": getViewportWidth,
        // 工具函数
        "debounce": debounce,
        "throttle": throttle,
        "cloneElement": cloneElement,
        "navInit": navInit,
    });
  
    function navInit(nodeObj) {
        var navStyle1 = window._block_namespaces_['nav_style1'];
        var navStyle2 = window._block_namespaces_['nav_style2'];
        if($('input[name=navPullDownStyle]').val() == '1') {
            navStyle1.navInit(nodeObj)
        } else {
            navStyle2.navInit(nodeObj)
        }
    }
  
    // ==================== 设备判断 ====================
    
    /**
     * 判断当前设备是否为移动端（带窗口监听）
     * @description 初始化时判断并监听窗口变化
     */
    function isPhone() {
        const _thatBlock = this;
        _thatBlock.isPhoneFlag = isMobile();
        
        $(window).resize(debounce(function() {
            _thatBlock.isPhoneFlag = isMobile();
        }, 200));
    }
  
    /**
     * 判断当前是否为移动端（不带监听）
     * @returns {boolean} 是否为移动端
     */
    function isMobile() {
        return window.innerWidth <= CONSTANTS.MOBILE_BREAKPOINT;
    }
  
    // ==================== DOM操作 ====================
    
    /**
     * 根据节点ID获取选择器
     * @param {string} nodeId - 节点ID
     * @returns {jQuery} jQuery选择器对象
     */
    function getSelector(nodeId) {
        return $("[data-new-auto-uuid=" + nodeId + "]");
    }
  
    /**
     * 根据类名获取选择器
     * @param {string} className - 类名
     * @param {jQuery} [$context] - 上下文（可选）
     * @returns {jQuery} jQuery选择器对象
     */
    function getSelectorByClass(className, $context) {
        var selector = '.' + className;
        return $context ? $context.find(selector) : $(selector);
    }
  
    /**
     * 绑定事件（确保只绑定一次）
     * @param {jQuery} $element - jQuery元素
     * @param {string} eventName - 事件名称
     * @param {Function} handler - 事件处理函数
     */
    function bindEventOnce($element, eventName, handler) {
        $element.off(eventName).on(eventName, handler);
    }
  
    /**
     * 切换类名
     * @param {jQuery} $element - jQuery元素
     * @param {string} className - 类名
     * @param {boolean} [force] - 强制添加/删除（可选）
     */
    function toggleClass($element, className, force) {
        if (force === undefined) {
            $element.toggleClass(className);
        } else {
            $element.toggleClass(className, force);
        }
    }
  
    /**
     * 克隆元素（深度克隆）
     * @param {jQuery} $element - 要克隆的元素
     * @param {boolean} [withEvents=false] - 是否克隆事件
     * @returns {jQuery} 克隆后的元素
     */
    function cloneElement($element, withEvents) {
        return $element.clone(withEvents || false);
    }
  
    // ==================== CSS操作 ====================
    
    /**
     * 设置CSS变量
     * @param {jQuery|HTMLElement} element - 元素
     * @param {string} varName - 变量名（不含--前缀）
     * @param {string} value - 变量值
     */
    function setCSSVar(element, varName, value) {
        var $el = element instanceof jQuery ? element : $(element);
        $el.css('--' + varName, value);
    }
  
    /**
     * 获取CSS变量值
     * @param {jQuery|HTMLElement} element - 元素
     * @param {string} varName - 变量名（不含--前缀）
     * @returns {string} 变量值
     */
    function getCSSVar(element, varName) {
        var $el = element instanceof jQuery ? element : $(element);
        var cssVar = $el.css('--' + varName);
        
        // 如果jQuery无法获取，尝试使用原生方法
        if (!cssVar && element.nodeType === 1) {
            cssVar = getComputedStyle(element).getPropertyValue('--' + varName);
        }
        
        return cssVar || '';
    }
  
    /**
     * 设置CSS属性（支持多个属性）
     * @param {jQuery} $element - jQuery元素
     * @param {Object|string} property - 属性名或属性对象
     * @param {string} [value] - 属性值（当property为字符串时）
     */
    function setCSSProperty($element, property, value) {
        if (typeof property === 'object') {
            $element.css(property);
        } else {
            $element.css(property, value);
        }
    }
  
    // ==================== 位置计算 ====================
    
    /**
     * 计算元素偏移量
     * @param {jQuery} $element - jQuery元素
     * @returns {Object} {left, top, right, bottom}
     */
    function calculateOffset($element) {
        if (!$element || !$element.length) {
            return {left: 0, top: 0, right: 0, bottom: 0};
        }
        
        var offset = $element.offset();
        var width = $element.outerWidth();
        var height = $element.outerHeight();
        var viewportWidth = getViewportWidth();
        
        return {
            left: offset ? offset.left : 0,
            top: offset ? offset.top : 0,
            right: viewportWidth - (offset ? offset.left : 0) - width,
            bottom: window.innerHeight - (offset ? offset.top : 0) - height
        };
    }
  
    /**
     * 判断元素是否可见
     * @param {jQuery} $element - jQuery元素
     * @returns {boolean} 是否可见
     */
    function isElementVisible($element) {
        return $element && $element.length > 0 && $element.is(':visible');
    }
  
    /**
     * 获取视口宽度
     * @returns {number} 视口宽度
     */
    function getViewportWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
    }
  
    // ==================== 事件处理 ====================
    
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
  
    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 间隔时间（毫秒）
     * @returns {Function} 节流后的函数
     */
    function throttle(func, wait) {
        let timeout;
        let previous = 0;
        
        return function() {
            const context = this;
            const args = arguments;
            const now = Date.now();
            const remaining = wait - (now - previous);
            
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(function() {
                    previous = Date.now();
                    timeout = null;
                    func.apply(context, args);
                }, remaining);
            }
        };
    }
  
  })(window, jQuery);