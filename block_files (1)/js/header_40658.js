(function (window, $, undefined) {
  var _block_namespaces_ =
    window._block_namespaces_ || (window._block_namespaces_ = {});
  var name = "header_40658";
  var header_40658 =
    _block_namespaces_[name] || (_block_namespaces_[name] = {});

  $.extend(header_40658, {
    Init: Init,
    shareInit: shareInit,
    shareFun: shareFun,
    "searchInit": searchInit,
    "searchFun": searchFun,
    navIphoneSwitchFun: navIphoneSwitchFun,
    /** 将 .header_content 内组件克隆到 .phone_show（供调试或手动刷新） */
    syncPhoneShowPlaceholders: syncPhoneShowPlaceholdersFromHeaderContent,
  });

  /**
   * 移动端页头占位与桌面区组件类名映射。
   * 须与 packages/blockeditor/src/global/header/index.ts 中 MOBILE_HEAD_BLOCK_CLASS_NAME 保持同步。
   * 可按产品需要扩展为 tablet：在 applyPhoneShowByDevice 中增加对 'tablet' 的判断即可。
   */
  var MOBILE_HEAD_BLOCK_CLASS_MAP = [
    { sourceModelClass: 'lead_nav_component', targetModelClass: 'phone_left_nav' },
    { sourceModelClass: 'lead_logo_component', targetModelClass: 'phone_center_logo' },
    { sourceModelClass: 'lead_langbar_component', targetModelClass: 'phone_right_language' },
    { sourceModelClass: 'lead_headerSearch_component', targetModelClass: 'phone_right_search' },
  ];

  /**
   * 须与 packages/blockeditor/src/global/header/index.ts 中
   * HEAD_ELEMENT_MARKER_ATTR 保持同步。
   */
  var HEAD_ELEMENT_MARKER = 'data-lea-header-element';
  var SYNCED_MOBILE_ATTR = 'data-lea-synced-mobile';

  /**
   * 区块默认内容的容器选择器。
   * 这些容器由页头模板自带，已通过 MOBILE_HEAD_BLOCK_CLASS_MAP 独立处理移动端克隆，
   * syncPcElementsToMobileNav 应跳过它们及其子元素，只克隆用户主动拖入的元素。
   * 须与 MOBILE_HEAD_BLOCK_CLASS_MAP 保持同步。
   */
  var DEFAULT_CONTAINER_SELECTORS = MOBILE_HEAD_BLOCK_CLASS_MAP.map(function (item) {
    return '.' + item.sourceModelClass;
  }).concat('.lead_share_component').join(',');

  /**
   * 从 PC 端 header_content 中找到所有编辑器打过标（data-lea-header-element）的元素，
   * deep clone 后插入移动端 .phone_show 里的 .phone-clone-element 容器。
   *
   * 前置条件：编辑器侧在 componentViews.ts 的 render 钩子中，已为位于页头且类型匹配
   *           ALLOW_SHOW_ELEMENT_IDS 的元素打上 data-lea-header-element 属性。
   *
   * 过滤规则：排除默认容器（nav/logo/search/langbar）内的元素，只克隆用户主动添加的。
   * 幂等：每次调用先清除 [data-lea-synced-mobile] 旧克隆再重新同步。
   */
  function syncPcElementsToMobileNav(nodeObj) {
    var els = getBlockEls(nodeObj);
    var $block = els.$block;
    if (!$block.length) return;

    var $pcScope = $block.find('.header_content').not('.phone_show');
    var $mobileScope = $block.find('.header_content.phone_show');
    if (!$pcScope.length || !$mobileScope.length) return;

    var $targetNavMainPc = $mobileScope.find('.phone-clone-element');
    if (!$targetNavMainPc.length) return;

    var markerSelector = '[' + HEAD_ELEMENT_MARKER + ']';
    var $pcElements = $pcScope.find(markerSelector);

    var $topLevel = $pcElements.filter(function () {
      if ($(this).parentsUntil($pcScope).filter(markerSelector).length) return false;
      if ($(this).is(DEFAULT_CONTAINER_SELECTORS) || $(this).closest(DEFAULT_CONTAINER_SELECTORS).length) return false;
      return true;
    });

    $targetNavMainPc.find('[' + SYNCED_MOBILE_ATTR + ']').remove();

    $topLevel.each(function () {
      var cloned = this.cloneNode(true);
      cloned.setAttribute(SYNCED_MOBILE_ATTR, '1');
      $targetNavMainPc[0].appendChild(cloned);
    });
  }

  /**
   * 实时查询 block_40658 内部关键元素。
   * 背景：页头位于 GrapesJS 的灵活可编辑区域（lea-flexible-area），内部元素
   *       在编辑态可被拖动，move = remove old + render new，旧 jQuery 引用会
   *       指向“孤儿节点”，表现为事件失效、动画作用在被销毁的 DOM 上。
   * 解决：不再把 jQuery 集合固化到闭包，所有消费方都通过本函数按 nodeObj 现取。
   */
  function getBlockEls(nodeObj) {
    nodeObj = nodeObj || {};
    var $selector = nodeObj.nodeId
      ? $('[data-new-auto-uuid="' + nodeObj.nodeId + '"]')
      : $();
    // 优先使用 $selector 向上查找，确保多实例时命中当前实例；兜底全局选取。
    var $block = $selector.parents('.block_40658');
    if (!$block.length) $block = $('.block_40658');

    var $pcScope = $block.find('.header_content').not('.phone_show');
    var $mobileScope = $block.find('.header_content.phone_show');

    // 当前视口对应的 scope（向后兼容，供大多数调用点使用）
    var $scope = window.innerWidth > 768 ? $pcScope : $mobileScope;
    if (!$scope.length) $scope = $block;

    return {
      $selector: $selector,
      $block: $block,
      $scope: $scope,
      $pcScope: $pcScope.length ? $pcScope : $block,
      $mobileScope: $mobileScope.length ? $mobileScope : $block,
      // 跨区域移动的元素，从 $block 全局查
      $boxShare: $block.find('.box_share'),
      $shareContainer: $block.find('.share_container.share_container_40658'),
      $shareCloseBtn: $block.find('.share_container_40658 .close-icon'),
      $overlay: $block.find('.overlay_40658'),
      // 受 scope 限制的（按当前视口查）
      $shareOpenBtn: $scope.find('.share_button'),
      $searchForm: $scope.find('.header-search-form'),
      $searchIconBtn: $scope.find('.search-icon-btn'),
      $searchClose: $scope.find('.header-search-form .close-icon'),
      $searchRecommended: $scope.find('.recommended-words > li'),
      $searchInput: $scope.find('.search-input .input-text'),
      $openMenuBtn: $scope.find('.nav-iphone-Openmenu'),
      $closeMenuBtn: $scope.find('.nav-iphone-closeMenu'),
      $navItem: $scope.find('.lea-menu-item'),
    };
  }

  /**
   * 把 .block_40658 的实时尺寸写入自身节点的 CSS 变量，供后续样式按需读取。
   *   --lea-header-bottom: 页头底边距视口顶的 px（= getBoundingClientRect().bottom）
   *   --lea-header-height: 页头当前高度 px（= rect.height）
   * 纯埋点，不介入任何定位逻辑。
   */
  var _headerVarsRafId = 0;
  function updateHeaderVars(nodeObj) {
    if (_headerVarsRafId) return;
    _headerVarsRafId = requestAnimationFrame(function () {
      _headerVarsRafId = 0;
      var els = getBlockEls(nodeObj);
      var block = els.$block[0];
      if (!block) return;
      var rect = block.getBoundingClientRect();
      block.style.setProperty('--lea-header-bottom', rect.bottom + 'px');
      block.style.setProperty('--lea-header-height', rect.height + 'px');
    });
  }

  /**
   * 为 .block_40658 装载尺寸观察器，自动维护 --lea-header-bottom / --lea-header-height。
   * 幂等：同一节点上已装载则仅触发一次立即更新，避免 Init 被多次调用时叠加监听。
   * 主线路：ResizeObserver 监听元素自身尺寸变化（公告栏展开/收起、内部节点增减都能触发）。
   * 兜底：window scroll/resize 覆盖"尺寸不变但相对视口位置变化"的情况（如页头 sticky 时滚动）。
   */
  function installHeaderVarWatcher(nodeObj) {
    if (!document.querySelector('div[data-gjs-type="wrapper"]')) return;

    var els = getBlockEls(nodeObj);
    var block = els.$block[0];
    if (!block) return;

    if (block.__leaHeaderRO) { updateHeaderVars(nodeObj); return; }

    updateHeaderVars(nodeObj);

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () { updateHeaderVars(nodeObj); });
      ro.observe(block);
      block.__leaHeaderRO = ro;
    }

    var onScroll = function () { updateHeaderVars(nodeObj); };
    var onResize = function () { updateHeaderVars(nodeObj); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    block.__leaHeaderScrollHandler = onScroll;
    block.__leaHeaderResizeHandler = onResize;
  }

  /**
   * 须与 packages/blockeditor/src/global/header/index.ts 中
   * EDITOR_HEADER_PHONE_SHOW_DEVICE_EVENT 保持同步。
   */
  var EDITOR_HEADER_PHONE_SHOW_DEVICE_EVENT = 'lea_editor_header_phone_show_device';

  function clearPhoneShowPlaceholders($block) {
    if (!$block || !$block.length) return;
    var i;
    for (i = 0; i < MOBILE_HEAD_BLOCK_CLASS_MAP.length; i++) {
      $block.find('.phone_show .' + MOBILE_HEAD_BLOCK_CLASS_MAP[i].targetModelClass).empty();
    }
  }

  /**
   * 从 .header_content 内取源节点（每类第一个），deep clone 到 .phone_show 对应占位。
   */
  function syncPhoneShowPlaceholdersFromHeaderContent(nodeObj) {
    var els = getBlockEls(nodeObj);
    var $block = els.$block;
    if (!$block.length) return;
    var $scope = $block.find('.header_content');
    if (!$scope.length) return;
    var i;
    var item;
    var $src;
    var $target;
    var el;
    for (i = 0; i < MOBILE_HEAD_BLOCK_CLASS_MAP.length; i++) {
      item = MOBILE_HEAD_BLOCK_CLASS_MAP[i];
      $target = $block.find('.phone_show .' + item.targetModelClass);
      if (!$target.length) continue;
      $target.empty();
      $src = $scope.find('.' + item.sourceModelClass).first();
      if ($src.length && $src[0]) {
        el = $src[0].cloneNode(true);
        $target[0].appendChild(el);
      }
    }
  }

  function applyPhoneShowByDeviceId(deviceId, nodeObj) {
    var id = deviceId || 'desktop';
    if (id === 'mobilePortrait') {
      syncPhoneShowPlaceholdersFromHeaderContent(nodeObj);
    } else {
      clearPhoneShowPlaceholders(getBlockEls(nodeObj).$block);
    }
  }

  /**
   * 监听画布内 leadComponentSite.globalMinimumUnitEvent（由父编辑器 listenEditor device:select emit）。
   * 防抖仅在编辑器侧；此处直接按 deviceId 同步或清空。
   */
  function installPhoneShowEditorDeviceSync(nodeObj) {
    if (typeof leadComponentSite === 'undefined' || !leadComponentSite.globalMinimumUnitEvent) {
      return;
    }

    var els = getBlockEls(nodeObj);
    var block = els.$block[0];
    if (!block) return;

    var bus = leadComponentSite.globalMinimumUnitEvent;
    var prev = block.__leaPhoneShowDeviceHandler;
    if (prev) {
      try {
        bus.off(EDITOR_HEADER_PHONE_SHOW_DEVICE_EVENT, prev);
      } catch (e) {}
    }

    function handler(deviceId) {
      applyPhoneShowByDeviceId(deviceId, nodeObj);
    }
    block.__leaPhoneShowDeviceHandler = handler;
    try {
      bus.off(EDITOR_HEADER_PHONE_SHOW_DEVICE_EVENT, handler);
    } catch (e2) {}
    bus.on(EDITOR_HEADER_PHONE_SHOW_DEVICE_EVENT, handler);
    block.__leaPhoneShowDeviceBound = true;
  }

  //init
  function Init(nodeObj) {
    installHeaderVarWatcher(nodeObj);
    this.navIphoneSwitchFun(nodeObj);
    // installPhoneShowEditorDeviceSync(nodeObj);
    syncPcElementsToMobileNav(nodeObj);
    // this.searchInit(nodeObj);
  }


  // nav按钮
  function navIphoneSwitchFun(nodeObj) {
    // 兼容历史调用方式：旧代码传入的是 $selector（jQuery 对象），这里做一次降级适配。
    if (nodeObj && typeof nodeObj.nodeId === 'undefined' && nodeObj.jquery) {
      var legacyId = nodeObj.attr && (nodeObj.attr('data-new-auto-uuid') || nodeObj.attr('data-block-nodeid'));
      nodeObj = { nodeId: legacyId };
    }
    var ns = '.h40658Nav';

    // 防重复绑定：每次 init 都先 off 再 on。
    $(document).off('click' + ns);

    $(document).on('click' + ns, '.block_40658 .nav-iphone-Openmenu', function () {
      var els = getBlockEls(nodeObj);
      if (!els.$shareContainer.is(':visible')) {
        els.$shareContainer.stop().slideToggle(500);
      }
    });

    $(document).on('click' + ns, '.block_40658 .nav-iphone-closeMenu', function () {
      var els = getBlockEls(nodeObj);
      if (els.$shareContainer.is(':visible')) {
        els.$shareContainer.stop().slideToggle(500);
      }
    });

    $(document).on('click' + ns, '.block_40658 .lea-menu-item', function () {
      if (window.innerWidth <= 768) {
        var els = getBlockEls(nodeObj);
        if (els.$shareContainer.is(':visible')) {
          els.$shareContainer.stop().slideToggle(500);
        }
      }
    });

    // resize 事件仅绑一次（命名空间隔离），内部懒查询最新 DOM。
    $(window).off('resize' + ns).on('resize' + ns, function () {
      var els = getBlockEls(nodeObj);
      if (window.innerWidth > 768) {
        if (els.$boxShare.length) {
          var targetPC = els.$pcScope.find('.share_container_flex')[0]
            || els.$block.find('.share_container_40658 .share_container_flex')[0];
          if (targetPC && els.$boxShare[0].parentNode !== targetPC) {
            targetPC.appendChild(els.$boxShare[0]);
          }
        }
      } else {
        if (els.$block.find('.nav-iphone-menucontainer').hasClass('isCloseMenu')) {
          if (!els.$shareContainer.is(':visible')) {
            els.$shareContainer.stop().show();
          }
        }
        if (els.$boxShare.length) {
          var targetMobile = els.$mobileScope.find('.nav-main-feature')[0];
          if (targetMobile && els.$boxShare[0].parentNode !== targetMobile) {
            targetMobile.appendChild(els.$boxShare[0]);
          }
        }
      }
    });
  }

  function langbarInit() {}
  // 社交关注
  function shareInit(nodeObj) {
    this.shareConfig = {
      relationId: nodeObj.relationId,
      relationType: nodeObj.relationType,
      pageId: nodeObj.pageId,
      appId: nodeObj.appId,
      appIsDev: nodeObj.appIsDev,
      appVersion: nodeObj.appVersion,
    };

    this.shareFun(nodeObj);
  }

  function shareFun(nodeObj) {
    // 历史兼容：shareFun 旧签名为 ($selector)。
    if (nodeObj && typeof nodeObj.nodeId === 'undefined' && nodeObj.jquery) {
      var legacyId = nodeObj.attr && (nodeObj.attr('data-new-auto-uuid') || nodeObj.attr('data-block-nodeid'));
      nodeObj = { nodeId: legacyId };
    }

    var SHARE_DURATION = 240;
    var OVERLAY_DURATION = 200;
    var ns = '.h40658Share';

    function openShareContainer(duration) {
      /**
       * 用途：打开分享容器（幂等）。
       * 边界处理：
       * - 该容器动画使用 slideToggle/slideToggleFromTop（切换型），若重复调用会“反复开关”。
       * - 因此这里基于可见性与动画状态做保护：已可见/动画中直接返回。
       */
      if (typeof duration === 'undefined') duration = SHARE_DURATION;
      var els = getBlockEls(nodeObj);
      var $shareContainer = els.$shareContainer;
      if (!$shareContainer.length) return;
      if ($shareContainer.is(':visible') || $shareContainer.is(':animated')) return;
      var helpers = window.MotionHelpers || {};
      var motionSlideUpToBottom = helpers.motionSlideUpToBottom;
      $shareContainer.addClass('share-active');
      var innerEl = $shareContainer.find('.share-container-inner')[0];
      if (innerEl && motionSlideUpToBottom) motionSlideUpToBottom(innerEl, duration);
    }

    function closeShareContainer(duration) {
      /**
       * 用途：关闭分享容器（幂等）。
       * 边界处理：
       * - 该容器动画使用切换型实现，重复 close 会导致反向打开。
       * - 因此这里基于可见性与动画状态做保护：已不可见/动画中直接返回。
       */
      if (typeof duration === 'undefined') duration = SHARE_DURATION;
      var els = getBlockEls(nodeObj);
      var $shareContainer = els.$shareContainer;
      if (!$shareContainer.length) return;
      if (!$shareContainer.is(':visible') || $shareContainer.is(':animated')) return;
      var helpers = window.MotionHelpers || {};
      var motionSlideUpToTop = helpers.motionSlideUpToTop;
      var innerEl = $shareContainer.find('.share-container-inner')[0];
      if (innerEl && motionSlideUpToTop) {
        motionSlideUpToTop(innerEl, duration, { callback: function () {
          getBlockEls(nodeObj).$shareContainer.removeClass('share-active');
        }});
      } else {
        $shareContainer.removeClass('share-active');
      }
    }

    function openOverlay() {
      var els = getBlockEls(nodeObj);
      var $overlay = els.$overlay;
      if (!$overlay.length) return;
      var helpers = window.MotionHelpers || {};
      var slideToggle = helpers.slideToggle;
      // overlay 内容为空，内容自然高度是 0；若不做干预，slideToggle 结束后
      // 会把 height 还原为 auto（即 0），再被别处逻辑写回 84px，肉眼会"抖一下"。
      // 解法：把 84px 提升为 min-height。动画期间 motion 写 height=0→auto，
      // 在 min-height:84px 约束下 auto 实际就是 84px，起点 0 起跳依然有滑动效果，
      // 终点与期望完全一致，不再出现"塌缩再弹回"的一帧抖动。
      $overlay.css('min-height', '84px');
      if ($overlay.is(':visible')) return;
      var overlayEl = $overlay[0];
      if (overlayEl) overlayEl.dataset.motionDisplay = 'block';
      if (overlayEl && slideToggle) {
        slideToggle(overlayEl, OVERLAY_DURATION);
      } else {
        $overlay.hide().slideDown(100);
      }
    }

    function closeOverlay() {
      var els = getBlockEls(nodeObj);
      var $overlay = els.$overlay;
      if (!$overlay.length) return;
      var helpers = window.MotionHelpers || {};
      var slideToggle = helpers.slideToggle;
      if (!$overlay.is(':visible')) return;
      var overlayEl = $overlay[0];
      if (overlayEl && slideToggle) {
        slideToggle(overlayEl, OVERLAY_DURATION);
      } else {
        $overlay.slideUp(100);
      }
      // 关闭动画本身由 motion 把 height 从 84px 收到 0 再置 display:none；
      // 此时 min-height 不会影响视觉（元素已隐藏），但要清掉以免下次打开
      // 的"起点"被拉到 84px 而看不到动画。留一个安全的延迟清理即可。
      setTimeout(function () {
        var laterOverlay = getBlockEls(nodeObj).$overlay;
        if (laterOverlay.length) laterOverlay.css('min-height', '');
      }, OVERLAY_DURATION + 20);
    }

    // 先清理本文件曾经绑定过的委托事件，保证重初始化时幂等。
    $(document).off('click' + ns);

    var isInEditor = $('div[data-gjs-type="wrapper"]').length > 0;

    if (isInEditor) {
      function closeShowSearch() {
        closeShareContainer(0);
        closeOverlay();
      }

      function openShowSearch() {
        /**
         * 用途：确保"更多/分享"面板处于打开态（幂等）。
         * 说明：这里不能做 toggle（已打开时去 close），否则遇到事件多次触发会出现反复开关与异常。
         * 边界处理：从全局事件总线触发时不存在点击 event，因此禁止引用 event.preventDefault。
         */
        var els = getBlockEls(nodeObj);
        var $shareContainer = els.$shareContainer;
        if (!$shareContainer.length) return;
        if ($shareContainer.is(':visible') || $shareContainer.is(':animated')) {
          openOverlay();
          return;
        }
        $shareContainer.css('position', 'absolute');
        $shareContainer.css('top', '100%');
        openShareContainer(0);
        openOverlay();
      }

      // $selector id 也要实时取（拖动重建后 id 不变，但节点对象已换）。
      var $initialSelector = getBlockEls(nodeObj).$selector;
      var _moreStatus = ($initialSelector.attr('id') || '') + '_moreStatusSetting';
      var _lastHandledType = null;
      var _lastHandledAt = 0;
      function openEditorTool(notifyOriginType) {
        var type = String(notifyOriginType);
        if (type !== '0' && type !== '1') return;

        // 幂等保护：与当前 DOM 状态一致时直接忽略，避免重复动画/重复关闭引发异常。
        var $shareContainerNow = getBlockEls(nodeObj).$shareContainer;
        var isShareVisible = $shareContainerNow.is(':visible');
        if (type === '1' && isShareVisible) return;
        if (type === '0' && !isShareVisible) return;

        var now = Date.now();
        if (_lastHandledType === type && now - _lastHandledAt < 400) return;
        _lastHandledType = type;
        _lastHandledAt = now;

        try {
          if (type === '1') {
            openShowSearch();
          } else if (type === '0') {
            closeShowSearch();
          }
        } catch (err) {
          console.error('[moreStatusSetting] handle failed:', err, { notifyOriginType: notifyOriginType });
        }
      }

      // 防重复绑定：对齐项目内既有用法（先 off 再 on）。
      try {
        leadComponentSite.globalMinimumUnitEvent.off(_moreStatus);
      } catch (err) {
        // 有些运行环境可能没有 off 或 off 会抛错，这里忽略即可（不影响后续 on）。
      }
      leadComponentSite.globalMinimumUnitEvent.on(_moreStatus, function (notifyOriginType) {
        openEditorTool(notifyOriginType);
      });
    } else {
      // 预览态：打开社交关注功能栏（事件委托，兼容 DOM 重建）
      $(document).on('click' + ns, '.block_40658 .share_button', function (event) {
        leadComponentSite.globalMinimumUnitEvent.emit('header_share_open');
        var els = getBlockEls(nodeObj);
        if (els.$shareContainer.is(':visible')) {
          closeShareContainer();
          event.preventDefault();
          event.stopPropagation();
        } else {
          els.$shareContainer.css('position', 'absolute');
          els.$shareContainer.css('top', '100%');
          openShareContainer();
        }
      });
    }

    // 事件总线：互斥关闭。先 off 再 on，保障重初始化幂等。
    try { leadComponentSite.globalMinimumUnitEvent.off('header_search_open'); } catch (e) {}
    try { leadComponentSite.globalMinimumUnitEvent.off('header_menu_open'); } catch (e) {}
    try { leadComponentSite.globalMinimumUnitEvent.off('header_langbar_open'); } catch (e) {}
    // 注意：header_search_open / header_menu_open / header_langbar_open 还被
    // searchFun 订阅用于关闭搜索框，因此这里的 off 会把 search 侧的订阅一起清掉。
    // searchFun 内部也会重新 on 自己的订阅；整份 JS 的调用链是
    // Init → shareInit → shareFun，然后 searchInit → searchFun，顺序上 searchFun
    // 在最后执行，所以它的订阅会被保留。
    leadComponentSite.globalMinimumUnitEvent.on('header_search_open', function () {
      closeShareContainer();
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_menu_open', function () {
      closeShareContainer();
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_langbar_open', function () {
      closeShareContainer();
    });

    // 关闭分享（委托）
    $(document).on('click' + ns, '.block_40658 .share_container_40658 .close-icon', function (event) {
      closeShareContainer();
      event.preventDefault();
      event.stopPropagation();
      var els = getBlockEls(nodeObj);
      els.$overlay.css('height', '0');
      closeOverlay();
      if ($('div[data-gjs-type="wrapper"]').length) {
        var selectorId = getBlockEls(nodeObj).$selector.attr('id') || '';
        var _moreStatusClose = selectorId + '_moreStatusSettingClose';
        leadComponentSite.globalMinimumUnitEvent.emit(_moreStatusClose, '1');
      }
    });
  }

  async function searchInit(nodeObj) {
    this.searchFun(nodeObj);
  }


  function closeSearchFun(nodeObj) {
    var helpers = window.MotionHelpers || {};
    var motionSlideUpToTop = helpers.motionSlideUpToTop;
    var els = getBlockEls(nodeObj);
    var $searchForm = els.$searchForm;
    if (!$searchForm.length) return;

    // 关闭搜索表单（向上滑出）
    if (!$searchForm.is(':visible') || ($searchForm.is(':visible') && $searchForm.css('opacity') == '0')) {
      return;
    }

    var innerEl = $searchForm.find('.header-search-form-container')[0];
    if (innerEl && motionSlideUpToTop) {
      motionSlideUpToTop(innerEl, 200, { callback: function () {
        els.$block.find('.header-search').removeClass('search-icon-active');
      }});
    }

    els.$block.find('.header-search-mask').toggle();
  }

  function searchFun(nodeObj) {
    // 历史兼容：searchFun 旧签名为 ($selector)。
    if (nodeObj && typeof nodeObj.nodeId === 'undefined' && nodeObj.jquery) {
      var legacyId = nodeObj.attr && (nodeObj.attr('data-new-auto-uuid') || nodeObj.attr('data-block-nodeid'));
      nodeObj = { nodeId: legacyId };
    }
    // 在编辑器内部 不进行 click
    if ($('div[data-gjs-type="wrapper"]').length) {
      return;
    }

    var ns = '.h40658Search';

    // 事件总线订阅：先 off 再 on，保证幂等。
    // 注：shareFun 内也会对这三个事件 off/on，整份文件按 shareFun → searchFun
    // 的顺序执行，这里的 on 会叠加在 shareFun 的订阅之后，互相不覆盖。
    leadComponentSite.globalMinimumUnitEvent.on('header_share_open', function () {
      closeSearchFun(nodeObj);
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_menu_open', function () {
      closeSearchFun(nodeObj);
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_langbar_open', function () {
      closeSearchFun(nodeObj);
    });

    // 委托事件：先 off 再 on，幂等且兼容 DOM 重建。
    $(document).off('click' + ns)
               .off('focus' + ns)
               .off('blur' + ns);

    // 使用公共动画辅助库
    $(document).on('click' + ns, '.block_40658 .search-icon-btn', function () {
      var els = getBlockEls(nodeObj);
      var helpers = window.MotionHelpers || {};
      var motionSlideUpToBottom = helpers.motionSlideUpToBottom;

      if (els.$searchForm.is(':visible')) {
        closeSearchFun(nodeObj);
      } else {
        leadComponentSite.globalMinimumUnitEvent.emit('header_search_open');
        els.$block.find('.header-search').addClass('search-icon-active');
        var innerEl = els.$searchForm.find('.header-search-form-container')[0];
        if (innerEl && motionSlideUpToBottom) motionSlideUpToBottom(innerEl, 200);
      }
    });

    $(document).on('click' + ns, '.block_40658 .header-search-form .close-icon', function () {
      closeSearchFun(nodeObj);
    });

    // 推荐词
    $(document).on('click' + ns, '.block_40658 .recommended-words > li', function () {
      var els = getBlockEls(nodeObj);
      els.$searchInput.val($(this).text());
    });

    // 输入框焦点样式
    $(document).on('focus' + ns, '.block_40658 .search-input .input-text', function () {
      $(this).parent().parent().addClass('focus');
    });

    $(document).on('blur' + ns, '.block_40658 .search-input .input-text', function () {
      $(this).parent().parent().removeClass('focus');
    });
  }

})(window, jQuery);