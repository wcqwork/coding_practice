/**
 * 下拉风格1 (Pull Down Style 1)
 * 来源：页头3 (header3)
 * 特点：简单的三级导航、四五级导航处理
 * @version 3.1 - 优化重构版
 */
(function (window, $, undefined) {
    var _block_namespaces_ = window._block_namespaces_ || (window._block_namespaces_ = {});
    var name = "nav_style1";
    var nav_style1 = _block_namespaces_[name] || (_block_namespaces_[name] = {});
    
    // 获取公共组件
    var navCommon = window._block_namespaces_['nav_40658'];
    var CONSTANTS
    
    // ==================== 配置常量 ====================
    var CONFIG = {
        // 选择器配置
        SELECTORS: {
            blockContainer: '.block-container',
            openMenuBtn: '.nav-iphone-Openmenu',
            closeMenuBtn: '.nav-iphone-closeMenu',
            navItem: '.lea-menu-item',
            navMenu: '.nav-main-pc',
            subArrow: '.sub-arrow',
            shareEl: '.share_container_30124',
            nav: 'nav',
            navList: 'nav>.lea-nav-menu',
            buttonPrev: '.button-prev',
            buttonNext: '.button-next',
            menuItem: '.menu-item',
            cloneNav: '.clone_nav',
            menuContainer: '.nav-iphone-menucontainer'
        },
        // 类名配置
        CLASSES: {
            overflowHidden: 'overflowHidden_nav',
            isCloseMenu: 'isCloseMenu',
            isOpen: 'isOpen',
            hasDepth5: 'hasDepth5',
            hoverActive: 'hoverActive',
            activeItem: 'activeItem',
            leftAfter: 'leftAfter'
        },
        // CSS变量名
        CSS_VARS: {
            headerModelWidth: 'header-model-width',
            clonePositionLeft: 'clone-position-left'
        },
        // 数值常量
        VALUES: {
            depthPositionOffset: 10,    // 深度位置偏移
            navWidthOffset: 17,         // 导航宽度偏移
            depth3Padding: 270,         // 深度3内边距
            depth3Offset: 40,           // 深度3偏移
            containerPadding: 80        // 容器内边距
        }
    };
    
    $.extend(nav_style1, {
        "navInit": navInit,
        "navPosition": navPosition,
        "navIphoneSwitchFun": navIphoneSwitchFun,
        "navdepth2Fun": navdepth2Fun,
        "navdepth5Fun": navdepth5Fun
    });

    // ==================== 初始化 ====================
    
    /**
     * 导航初始化入口
     * @param {Object} nodeObj - 节点对象
     */
    async function navInit(nodeObj) {
        console.log('intinitininitn1111111')
        if (leadComponentSite.motionSourceImport) {
            await leadComponentSite.motionSourceImport.init({});
        }
        if (leadComponentSite.motionHelperSourceImport) {
            await leadComponentSite.motionHelperSourceImport.init({});
        }
        CONSTANTS = navCommon.CONSTANTS;
        const _thatBlock = this;
        var $selector = navCommon.getSelector(nodeObj.pageNodeId);

        // 初始化各功能模块
        navCommon.isPhone.call(this);
        this.navIphoneSwitchFun($selector);
        this.navPosition($selector);
        this.navdepth2Fun($selector);
        this.navdepth5Fun($selector);

        // 使用防抖优化resize事件
        var resizeHandler = navCommon.debounce(function() {
            _thatBlock.navPosition($selector);
        }, 200);
        
        $(window).resize(resizeHandler);
    }

    // ==================== 移动端菜单 ====================
    
    /**
     * 移动端导航按钮切换
     * @param {jQuery} $selector - 选择器对象
     */
    function navIphoneSwitchFun($selector) {
        const $openMenuBtn = $selector.find(CONFIG.SELECTORS.openMenuBtn);
        const $closeMenuBtn = $selector.find(CONFIG.SELECTORS.closeMenuBtn);
        const $navItem = $selector.find(CONFIG.SELECTORS.navItem);
        const $navMenu = $selector.find(CONFIG.SELECTORS.navMenu);
        const $subArrow = $selector.find(CONFIG.SELECTORS.subArrow);
        const $shareEl = $(CONFIG.SELECTORS.shareEl);

        // 绑定菜单开关事件
        bindMenuToggleEvents($selector, $openMenuBtn, $closeMenuBtn, $navItem, $navMenu, $shareEl);
        
        // 绑定子箭头事件
        bindSubArrowToggle($subArrow);
        
        // 绑定语言切换事件
        bindLanguageEvent($closeMenuBtn, $navMenu, $shareEl, $selector);
    }

    /**
     * 绑定菜单切换事件
     */
    function bindMenuToggleEvents($selector, $openMenuBtn, $closeMenuBtn, $navItem, $navMenu, $shareEl) {
        // 打开菜单
        navCommon.bindEventOnce($openMenuBtn, 'click', function() {
            toggleMenu(true, $navMenu, $shareEl, $(this), $selector);
        });
        
        // 关闭菜单
        navCommon.bindEventOnce($closeMenuBtn, 'click', function() {
            toggleMenu(false, $navMenu, $shareEl, $(this), $selector);
        });

        // 点击菜单项关闭
        navCommon.bindEventOnce($navItem, 'click', function() {
            if(navCommon.isMobile()){
                closeMenuOnMobile($closeMenuBtn, $navMenu, $shareEl);
            }
        });
    }

    /**
     * 切换菜单显示/隐藏
     * @param {boolean} isOpen - 是否打开
     * @param {jQuery} $navMenu - 导航菜单
     * @param {jQuery} $shareEl - 分享元素
     * @param {jQuery} $button - 触发按钮
     */
    function toggleMenu(isOpen, $navMenu, $shareEl, $button, $selector) {
        $("html,body").toggleClass(CONFIG.CLASSES.overflowHidden);
        const hasFixed = $selector.parents('.headerFixedHover');
        const $headerEl = $selector.parents('.headerContainer');
        const $container = $button.parent(CONFIG.SELECTORS.menuContainer);
        navCommon.toggleClass($container, CONFIG.CLASSES.isCloseMenu, isOpen);
 

        if (isOpen) {
            $button.hide();
            $button.siblings(CONFIG.SELECTORS.closeMenuBtn).show();
            // $navMenu.stop().slideToggle(500).toggleClass('show');
            $navMenu.addClass('show')
            
            // if (!navCommon.isElementVisible($shareEl)) {
            //     $shareEl.stop().slideToggle(500);
            // }
            
            // 触发全局事件
            emitGlobalEvent('header_menu_open', 300);
            if(!$headerEl.hasClass('openMenuActive')) {
                $headerEl.addClass('headerFixedHover openMenuActive')
            }
        } else {
            $button.hide();
            $button.siblings(CONFIG.SELECTORS.openMenuBtn).show();
            // $navMenu.stop().slideToggle(500).toggleClass('show');
            $navMenu.removeClass('show')
            
            // if (navCommon.isElementVisible($shareEl)) {
            //     $shareEl.stop().slideToggle(500);
            // }
            // $blockEl.removeClass('hoverHeaderContent_active')
            // $blockHeaderContent.removeClass('openMenuActiver')
            // if($headerEl.hasClass('openMenuActive')) {
            //     $headerEl.removeClass('headerFixedHover openMenuActive')
            // }
            $headerEl.removeClass('headerFixedHover openMenuActive')

        }
    }

    /**
     * 移动端关闭菜单
     */
    function closeMenuOnMobile($closeMenuBtn, $navMenu, $shareEl, $selector, isNotMenu = false) {
        const hasFixed = $selector.parents('.headerFixedHover');
        const $headerEl = $selector.parents('headerContainer');
        const $openMenuBtn = $selector.find(CONFIG.SELECTORS.openMenuBtn);
        if(!isNotMenu) {
            $("html,body").toggleClass(CONFIG.CLASSES.overflowHidden);
            if($headerEl.hasClass('openMenuActive')) {
                $headerEl.removeClass('headerFixedHover openMenuActive')
            }
        }
        $closeMenuBtn.parent(CONFIG.SELECTORS.menuContainer).removeClass(CONFIG.CLASSES.isCloseMenu);
        // $navMenu.stop().slideUp(0);
        // $navMenu.stop(true, true).css('display', 'flex').hide().animate({ height: 'toggle' }, 500);
        
        $openMenuBtn.show();
        $navMenu.removeClass('show')
        // if (navCommon.isElementVisible($shareEl)) {
        //     $shareEl.stop().slideUp(0);
        // }

        
    }

    /**
     * 绑定子箭头切换
     */
    function bindSubArrowToggle($subArrow) {
        navCommon.bindEventOnce($subArrow, 'click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            
            navCommon.toggleClass($(this), CONFIG.CLASSES.isOpen);
            const $menulist = $(this).parents(CONFIG.SELECTORS.menuItem).eq(0).children('.lea-nav-menu');
            $menulist.stop().slideToggle(CONSTANTS.ANIMATION_DURATION);
            
            return false;
        });
    }

    /**
     * 绑定语言切换事件
     */
    function bindLanguageEvent($closeMenuBtn, $navMenu, $shareEl, $selector) {
        leadComponentSite.globalMinimumUnitEvent.on('header_langbar_open', function() {
            closeMenuOnMobile($closeMenuBtn, $navMenu, $shareEl, $selector, true);
        });
        leadComponentSite.globalMinimumUnitEvent.on('header_share_open', function() {
            closeMenuOnMobile($closeMenuBtn, $navMenu, $shareEl, $selector, true);
        });
        leadComponentSite.globalMinimumUnitEvent.on('header_search_open', function() {
            closeMenuOnMobile($closeMenuBtn, $navMenu, $shareEl, $selector, true);
        });
    }

    /**
     * 触发全局事件
     */
    function emitGlobalEvent(eventName, delay) {
        if (window.leadComponentSite && window.leadComponentSite.globalMinimumUnitEvent) {
            setTimeout(function(){
                leadComponentSite.globalMinimumUnitEvent.emit(eventName);
            }, delay || 0);
        }
    }

    // ==================== 导航按钮控制 ====================
    
    /**
     * 导航按钮的出现和隐藏
     * @param {jQuery} $selector - 选择器对象
     */
    function navPosition($selector) {
        const $navEl = $selector.find(CONFIG.SELECTORS.nav);
        const $navUlEl = $selector.find(CONFIG.SELECTORS.navList);
        const $prevEl = $selector.find(CONFIG.SELECTORS.buttonPrev);
        const $nextEl = $selector.find(CONFIG.SELECTORS.buttonNext);
        
        // 初始化位置
        navCommon.setCSSProperty($navUlEl, 'margin-left', '0px');
        
        const defaultOffsetLeft = Math.abs($navUlEl.prop("offsetLeft"));
        const navigationWidth = Math.ceil($navEl.width());
        const ulWidth = $navEl.prop("scrollWidth");
        
        // 初始按钮状态
        if (ulWidth <= navigationWidth) {
            $prevEl.hide();
            $nextEl.hide();
        } else {
            $prevEl.hide();
            $nextEl.show();
        }

        // 创建按钮控制器
        var buttonController = createButtonController($navUlEl, $prevEl, $nextEl, defaultOffsetLeft, navigationWidth, ulWidth);

        // 绑定点击事件
        navCommon.bindEventOnce($prevEl, 'click', function() {
            hideShareIfVisible();
            buttonController.scrollLeft();
        });

        navCommon.bindEventOnce($nextEl, 'click', function() {
            hideShareIfVisible();
            buttonController.scrollRight();
        });
    }

    /**
     * 创建按钮控制器
     */
    function createButtonController($navUlEl, $prevEl, $nextEl, defaultOffsetLeft, navigationWidth, ulWidth) {
        return {
            updateVisibility: function() {
                const currentOffsetLeft = Math.abs($navUlEl.prop("offsetLeft")) - defaultOffsetLeft;
                const isRightScroll = ulWidth >= (currentOffsetLeft + navigationWidth);
                const isLeftScroll = currentOffsetLeft > 0;
                
                $nextEl.toggle(isRightScroll);
                $prevEl.toggle(isLeftScroll);
            },
            
            scrollLeft: function() {
                const self = this;
                const currentOffsetLeft = Math.abs($navUlEl.prop("offsetLeft")) - defaultOffsetLeft;
                const newScroll = -(currentOffsetLeft - navigationWidth) > 0 ? 0 : -(currentOffsetLeft - navigationWidth);
                
                if (currentOffsetLeft > 0 && newScroll <= 0) {
                    navCommon.setCSSProperty($navUlEl, 'margin-left', newScroll + 'px');
                }
                
                setTimeout(function() { self.updateVisibility(); }, CONSTANTS.RESIZE_DELAY);
            },
            
            scrollRight: function() {
                const self = this;
                const currentOffsetLeft = Math.abs($navUlEl.prop("offsetLeft")) - defaultOffsetLeft;
                const isRightScroll = ulWidth >= (currentOffsetLeft + navigationWidth);
                const newScroll = -(navigationWidth + currentOffsetLeft);
                
                if (isRightScroll && newScroll <= 0) {
                    navCommon.setCSSProperty($navUlEl, 'margin-left', newScroll + 'px');
                }
                
                setTimeout(function() { self.updateVisibility(); }, CONSTANTS.RESIZE_DELAY);
            }
        };
    }

    /**
     * 隐藏分享容器（如果可见）
     */
    function hideShareIfVisible() {
        const $shareEl = $(CONFIG.SELECTORS.shareEl);
        if (navCommon.isElementVisible($shareEl)) {
            $shareEl.slideToggle();
        }
    }

    // ==================== 三级导航 ====================
    
    /**
     * 判断三级路由时页面是否能显示完全
     * @param {jQuery} $selector - 选择器对象
     */
    function navdepth2Fun($selector) {
        const $menuItemsDepth0 = $selector.find('.lea-navMenu-depth0>' + CONFIG.SELECTORS.menuItem);        
        const $menuItemsDepth1 = $selector.find('.lea-navMenu-depth1>' + CONFIG.SELECTORS.menuItem);

        let hoverEventsAdded = false;
        let leaNavMenuDepth1ToRight = 0;

        // 处理深度0悬停
        function handleDepth0Hover() {
            if (navCommon.isMobile()) return;
            
            const $leaNavMenuDepth1 = $(this).find('.lea-navMenu-depth1');
            if($leaNavMenuDepth1.length) {
                const offset = navCommon.calculateOffset($leaNavMenuDepth1);
                leaNavMenuDepth1ToRight = offset.right;
            }
        }

        // 处理深度1悬停进入
        function handleDepth1HoverIn() {
            if (navCommon.isMobile()) return;
            
            const $leaNavMenuDepth2 = $(this).find('.lea-navMenu-depth2');
            if($leaNavMenuDepth2.length) {
                const depth2Width = $leaNavMenuDepth2.outerWidth();
                
                if (leaNavMenuDepth1ToRight < (depth2Width + CONFIG.VALUES.depthPositionOffset)) {
                    const leftWidth = depth2Width + CONFIG.VALUES.navWidthOffset;
                    navCommon.setCSSProperty($leaNavMenuDepth2, 'left', -leftWidth + 'px');
                    $leaNavMenuDepth2.addClass(CONFIG.CLASSES.leftAfter);
                }
            }
        }

        // 处理深度1悬停离开
        function handleDepth1HoverOut() {
            if (navCommon.isMobile()) return;
            navCommon.setCSSProperty($(this).find('.lea-navMenu-depth2'), 'left', '');
        }

        // 添加/移除悬停事件
        function addHoverEvents() {
            $menuItemsDepth0.hover(handleDepth0Hover);
            $menuItemsDepth1.hover(handleDepth1HoverIn, handleDepth1HoverOut);
            hoverEventsAdded = true;
        }

        function removeHoverEvents() {
            $menuItemsDepth0.off('mouseenter mouseleave');
            $menuItemsDepth1.off('mouseenter mouseleave');
            hoverEventsAdded = false;
        }

        // 检查并应用
        function checkAndApply() {
            if (navCommon.isMobile()) {
                // 移动端可选择性移除事件
            } else {
                if (!hoverEventsAdded) {
                    addHoverEvents();
                }
            }
        }

        checkAndApply();
        $(window).resize(checkAndApply);
    }

    // ==================== 五级导航 ====================
    
    /**
     * PC端处理大于3级导航
     * @param {jQuery} $selector - 选择器对象
     */
    function navdepth5Fun($selector) {
        const $blockEl = $selector.parents(CONFIG.SELECTORS.blockContainer);
        const $clone_nav = $blockEl.find(CONFIG.SELECTORS.cloneNav);
        $clone_nav.attr('id', $('.nav_40658').attr('id'))
        $clone_nav.addClass('nav_style1')

        // 清空避免重复
        $clone_nav.empty();
        $clone_nav.attr('id', $selector.attr('id'))
        
        // 处理深度5导航
        processDepth5Navigation($selector, $clone_nav);
        
        // 绑定悬停事件
        bindDepth5HoverEvents($selector, $clone_nav);
        
        // 三级导航悬停
        bindDepth3HoverEvents($clone_nav);
        
        // 宽度调整
        adjustCloneNavWidth($blockEl);

        // 导航高度监听
        handleFixedHover($blockEl, $clone_nav, $selector);

        // 定位 clone_nav 到导航栏正下方
        navCommon.positionCloneNav($selector, $clone_nav);
        $(window).resize(navCommon.debounce(function() {
            navCommon.positionCloneNav($selector, $clone_nav);
        }, 200));

    }

    /**
     * 处理悬浮状态下五级下拉
     */
    function handleFixedHover($blockEl, $clone_nav, $selector) {
        const $headerContent = $blockEl.find('.header_content');

        const $overlaySuspensionBlock = $blockEl.find('.overlay_suspension_block')
        const resizeObserver = new ResizeObserver(function(entries) {
            for (let entry of entries) {
                const newHeight = entry.target.getBoundingClientRect().height;
                $overlaySuspensionBlock.css('height', newHeight+'px')
                $overlaySuspensionBlock.css('line-height', newHeight+'px')
                navCommon.positionCloneNav($selector, $clone_nav);
            }
        });

        resizeObserver.observe($headerContent[0]);
    }

    /**
     * 处理深度5导航
     */
    function processDepth5Navigation($selector, $clone_nav) {
        const $depth5 = $selector.eq(0).find(".lea-navMenu-depth3");
        const $depth5List = $depth5.parents('.lea-navMenu-depth1').parent(CONFIG.SELECTORS.menuItem);
        
        $depth5List.each(function() {
            const $item = $(this);
            $item.addClass(CONFIG.CLASSES.hasDepth5);
            
            const _index = $item.index();
            const cloneItem = navCommon.cloneElement($item.find(".lea-navMenu-depth1"));
            cloneItem.find('.lea-navMenu-depth2>' + CONFIG.SELECTORS.menuItem).eq(0).addClass(CONFIG.CLASSES.activeItem);
            
            const newNavItem = $(`<div class="nav_box_item nav_box_item_${_index}"></div>`);
            newNavItem.append(cloneItem).hide();
            $clone_nav.append(newNavItem);
        });
    }

    /**
     * 绑定深度5悬停事件
     */
    function bindDepth5HoverEvents($selector, $clone_nav) {
        const $depthNavList = $selector.find("." + CONFIG.CLASSES.hasDepth5);
        let hideTimer = null;
        
        $depthNavList.off('mouseenter mouseleave');
        
        navCommon.bindEventOnce($depthNavList, 'mouseenter', function() {
            if(navCommon.isMobile()) return;
            
            const $that = $(this);
            const _index = $that.index();
            const _$target = $clone_nav.find(`.nav_box_item_${_index}`);
            
            // 清除所有隐藏计时器
            if(hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
            
            // 隐藏其他项（不包括当前项）
            $clone_nav.find('.nav_box_item').not(_$target).each(function() {
                if($(this).is(':visible')) {
                    window.MotionHelpers.slideUp(this, 240);
                }
            });
            
            // 移除其他项的激活状态
            $depthNavList.not($that).removeClass(CONFIG.CLASSES.hoverActive);
            
            // 显示当前项
            $that.addClass(CONFIG.CLASSES.hoverActive);
            // if(!_$target.is(':visible')) {
                window.MotionHelpers.slideDown(_$target[0], 240);
            // }
            
            // 处理隐藏逻辑（带延迟）
            function scheduleHide() {
                hideTimer = setTimeout(function() {
                    // 检查鼠标是否仍在导航项或下拉菜单上
                    if(!$that.is(':hover') && !_$target.is(':hover')) {
                        window.MotionHelpers.slideUp(_$target[0], 240);
                        $that.removeClass(CONFIG.CLASSES.hoverActive);
                    }
                }, CONSTANTS.HOVER_DELAY);
            }
            
            // 绑定 mouseleave 事件
            _$target.off('mouseenter mouseleave')
                   .on('mouseenter', function() { 
                       if(hideTimer) {
                           clearTimeout(hideTimer);
                           hideTimer = null;
                       }
                   })
                   .on('mouseleave', function() { 
                       scheduleHide();
                   });
            
            $that.off('mouseleave').on('mouseleave', function() { 
                scheduleHide();
            });
        });
    }

    /**
     * 绑定深度3悬停事件
     */
    function bindDepth3HoverEvents($clone_nav) {
        const $depth3El = $clone_nav.find('.lea-navMenu-depth2>' + CONFIG.SELECTORS.menuItem);
        
        navCommon.bindEventOnce($depth3El, 'mouseenter', function() {
            $(this).parents('.nav_box_item').find('.' + CONFIG.CLASSES.activeItem).removeClass(CONFIG.CLASSES.activeItem);
            $(this).addClass(CONFIG.CLASSES.activeItem);
        });
    }

    /**
     * 调整克隆导航宽度
     */
    function adjustCloneNavWidth($blockEl) {
        function changeWidth() {
            const blockEl = document.querySelector(CONFIG.SELECTORS.blockContainer);
            if(!blockEl) return;
            
            const $navBoxItemWidth = $blockEl.outerWidth();
            let $headerContentWeight = parseFloat(navCommon.getCSSVar(blockEl, CONFIG.CSS_VARS.headerModelWidth));

            // 解析CSS变量值
            const cssVarValue = $blockEl.css('--' + CONFIG.CSS_VARS.headerModelWidth);
            const valueWithUnit = cssVarValue && cssVarValue.match(/^(\d+(\.\d+)?)([a-z%]*)$/);
            
            if (valueWithUnit) {
                let value = parseFloat(valueWithUnit[1]);
                const unit = valueWithUnit[3];

                if(unit == '%') {
                    value = Math.min(value, 100);
                    $headerContentWeight = $navBoxItemWidth * value * 0.01;
                }
            }

            const $navBoxItem = $blockEl.find('.nav_box_item');
            const $cloneLeaNavMenuDepth3 = $blockEl.find(CONFIG.SELECTORS.cloneNav + ' .lea-navMenu-depth3');
            
            if($navBoxItemWidth - CONFIG.VALUES.containerPadding > $headerContentWeight) {
                const paddingWidth = ($navBoxItemWidth - CONFIG.VALUES.containerPadding - $headerContentWeight) / 2;
                
                navCommon.setCSSProperty($navBoxItem, {
                    'padding-left': (paddingWidth + CONFIG.VALUES.depth3Offset) + 'px',
                    'padding-right': (paddingWidth + CONFIG.VALUES.depth3Offset) + 'px'
                });
                
                $cloneLeaNavMenuDepth3.each(function() {
                    const $that = $(this);
                    navCommon.setCSSVar($that, CONFIG.CSS_VARS.clonePositionLeft, (paddingWidth + CONFIG.VALUES.depth3Padding + CONFIG.VALUES.depth3Offset) + 'px');
                    navCommon.setCSSProperty($that, 'width', ($navBoxItemWidth - CONFIG.VALUES.containerPadding - paddingWidth - CONFIG.VALUES.depth3Padding - paddingWidth - CONFIG.VALUES.containerPadding) + 'px');
                });
            } else {
                navCommon.setCSSProperty($navBoxItem, {'padding-left': '', 'padding-right': ''});
                
                $cloneLeaNavMenuDepth3.each(function() {
                    navCommon.setCSSVar($(this), CONFIG.CSS_VARS.clonePositionLeft, '');
                    navCommon.setCSSProperty($(this), 'width', '');
                });
            }
        }
        
        changeWidth();
        $(window).resize(navCommon.debounce(changeWidth, 200));
    }

})(window, jQuery);