(function (window, $, undefined) {
  var _block_namespaces_ =
    window._block_namespaces_ || (window._block_namespaces_ = {});
  var name = "header_40094";
  var header_40094 =
    _block_namespaces_[name] || (_block_namespaces_[name] = {});

  $.extend(header_40094, {
    Init: Init,
    shareInit: shareInit,
    shareFun: shareFun,
    "searchInit": searchInit,
    "searchFun": searchFun,
    navIphoneSwitchFun: navIphoneSwitchFun,
  });

  //init
  function Init(nodeObj) {
    const _thatBlock = this;
    var $selector = $("[data-block-nodeid=" + nodeObj.nodeId + "]");

    this.navIphoneSwitchFun($selector);
    // this.searchInit($selector);
  }


  // nav按钮
  function navIphoneSwitchFun($selector) {
    // 开启
    const $openMenuBtn = $selector.find(".nav-iphone-Openmenu");
    const $closeMenuBtn = $selector.find(".nav-iphone-closeMenu");
    const $navItem = $selector.find(".lea-menu-item");
    const $navMainFeature = $selector.find('.nav-main-feature')
    const $boxShare = $selector.find('.box_share');

    const $shareEl = $(".share_container_40094");

    $openMenuBtn.click(function () {
      if (!$(".share_container_40094").is(":visible"))
        $shareEl.stop().slideToggle(500);
    });

    $closeMenuBtn.click(function () {
      if ($(".share_container_40094").is(":visible"))
        $shareEl.stop().slideToggle(500);
    });

    $navItem.click(function () {
      if (window.innerWidth <= 768) {
        if ($(".share_container_40094").is(":visible"))
          $shareEl.stop().slideToggle(500);
      }
    });

    // 窗口大小变化时检查并执行
    $(window).resize(function () {
      if (window.innerWidth > 768) {
        if ($(".share_container_40094").is(":visible"))
          $(".share_container_40094").stop().hide();

        if ($boxShare.parent().attr('class') !== 'share_container_flex') {
            $('.share_container_40094 .share_container_flex').append($boxShare);
        }
      } else {
        if ($(".nav-iphone-menucontainer").hasClass("isCloseMenu")) {
          if (!$(".share_container_40094").is(":visible"))
            $(".share_container_40094").stop().show();
        }

        if ($boxShare.parent().attr('class') !== 'nav-main-pc') {
            $navMainFeature.append($boxShare);
        }
      }
    });
  }

  function langbarInit() {}
  // 社交关注
  function shareInit(nodeObj) {
    var $selector = $("[data-new-auto-uuid=" + nodeObj.nodeId + "]");

    // 保存传入的参数
    this.shareConfig = {
      relationId: nodeObj.relationId,
      relationType: nodeObj.relationType,
      pageId: nodeObj.pageId,
      appId: nodeObj.appId,
      appIsDev: nodeObj.appIsDev,
      appVersion: nodeObj.appVersion,
    };

    this.shareFun($selector);


  }

  function shareFun($selector) {
    const $blockEl = $selector.parents(".block_40094");
    const $shareContainer = $blockEl.find(
      ".share_container.share_container_40094"
    );
    const $shareOpenBtn = $selector.find(".share_button");
    const $sharecloseBtn = $shareContainer.find(".close-icon");
    const $overlaySuspensionBlock = $blockEl.find(".overlay_40094");

    const shareEl = $shareContainer[0];
    const overlayEl = $overlaySuspensionBlock[0];
    const SHARE_DURATION = 240;
    const OVERLAY_DURATION = 200;

    function openShareContainer(duration = SHARE_DURATION) {
      /**
       * 用途：打开分享容器（幂等）。
       * 输入/输出：无（仅操作 DOM）。
       * 边界处理：
       * - 该容器动画使用 slideToggle/slideToggleFromTop（切换型），若重复调用会“反复开关”。
       * - 因此这里基于可见性与动画状态做保护：已可见/动画中直接返回。
       */
      if ($shareContainer.is(":visible") || $shareContainer.is(":animated")) return;
      const { motionSlideUpToBottom } = window.MotionHelpers || {}
      $shareContainer.addClass("share-active");
      motionSlideUpToBottom($shareContainer.find('.share-container-inner')[0], duration);
    }

    function closeShareContainer(duration = SHARE_DURATION) {
      const { motionSlideUpToTop } = window.MotionHelpers

      /**
       * 用途：关闭分享容器（幂等）。
       * 边界处理：
       * - 该容器动画使用切换型实现，重复 close 会导致反向打开。
       * - 因此这里基于可见性与动画状态做保护：已不可见/动画中直接返回。
       */
      if (!$shareContainer.is(":visible") || $shareContainer.is(":animated")) return;
      motionSlideUpToTop($shareContainer.find('.share-container-inner')[0], duration, {callback: function() {
        $shareContainer.removeClass("share-active");
      }});
    }

    function openOverlay() {
      const slideToggle =
        window.MotionHelpers && window.MotionHelpers.slideToggle;
      // 保持原逻辑：打开前把高度设为 84px
      $overlaySuspensionBlock.css("height", "84px");
      if ($overlaySuspensionBlock.is(":visible")) return;
      if (overlayEl) overlayEl.dataset.motionDisplay = "block";

      if (overlayEl && slideToggle) {
        slideToggle(overlayEl, OVERLAY_DURATION);
      } else {
        $overlaySuspensionBlock.hide().slideDown(100);
      }
    }

    function closeOverlay() {
      const slideToggle =
        window.MotionHelpers && window.MotionHelpers.slideToggle;
      if (!$overlaySuspensionBlock.is(":visible")) return;
      if (overlayEl && slideToggle) {
        slideToggle(overlayEl, OVERLAY_DURATION);
      } else {
        $overlaySuspensionBlock.slideUp(100);
      }
    }

    // 解除之前可能绑定的事件，确保只绑定一次
    $shareOpenBtn.off("click");
    $sharecloseBtn.off("click");

    if ($('div[data-gjs-type="wrapper"]').length) {
      function closeShowSearch() {
        closeShareContainer(0);
        closeOverlay();
      }

      function openShowSearch() {
        /**
         * 用途：确保“更多/分享”面板处于打开态（幂等）。
         * 说明：这里不能做 toggle（已打开时去 close），否则遇到事件多次触发会出现反复开关与异常。
         * 边界处理：从全局事件总线触发时不存在点击 event，因此禁止引用 event.preventDefault。
         */
        if ($shareContainer.is(":visible") || $shareContainer.is(":animated")) {
          openOverlay();
          return;
        }
        $shareContainer.css("position", "absolute");
        $shareContainer.css("top", "100%");
        openShareContainer(0);
        openOverlay();
      }
   
      var _moreStatus = $selector.attr("id") + "_moreStatusSetting";
      let _lastHandledType = null;
      let _lastHandledAt = 0;
      function openEditorTool(notifyOriginType) {
        const type = String(notifyOriginType);
        if (type !== "0" && type !== "1") return;

        // 幂等保护：与当前 DOM 状态一致时直接忽略，避免重复动画/重复关闭引发异常。
        const isShareVisible = $shareContainer.is(":visible");
        if (type === "1" && isShareVisible) return;
        if (type === "0" && !isShareVisible) return;

        const now = Date.now();
        if (_lastHandledType === type && now - _lastHandledAt < 400) return;
        _lastHandledType = type;
        _lastHandledAt = now;

        try {
          if (type === "1") {
            openShowSearch();
          } else if (type === "0") {
            closeShowSearch();
          }
        } catch (err) {
          console.error("[moreStatusSetting] handle failed:", err, {
            notifyOriginType,
          });
        }
      }

      // 防重复绑定：对齐项目内既有用法（先 off 再 on）。
      try {
        leadComponentSite.globalMinimumUnitEvent.off(_moreStatus);
      } catch (err) {
        // 有些运行环境可能没有 off 或 off 会抛错，这里忽略即可（不影响后续 on）。
      }
      leadComponentSite.globalMinimumUnitEvent.on(
        _moreStatus,
        function (notifyOriginType) {
         openEditorTool(notifyOriginType);
        }
      );
    } else {
      // 打开社交关注功能栏
      $shareOpenBtn.on("click", function (event) {
        const slideToggle =
          window.MotionHelpers && window.MotionHelpers.slideToggle;
        leadComponentSite.globalMinimumUnitEvent.emit('header_share_open');          
        // if ($(".header-search-form").is(":visible"))
        //   $(".header-search-form").slideToggle();
        if ($shareContainer.is(":visible")) {
          closeShareContainer();
          event.preventDefault();
          event.stopPropagation();
        } else {
          $shareContainer.css("position", "absolute");
          $shareContainer.css("top", "100%");
          openShareContainer();
        }
      });
    }

    leadComponentSite.globalMinimumUnitEvent.on('header_search_open', function() {
      closeShareContainer();
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_menu_open', function() {
      closeShareContainer();
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_langbar_open', function() {
      closeShareContainer();
    });

    // 关闭分享
    $sharecloseBtn.on("click", function (event) {
      closeShareContainer();
      event.preventDefault();
      event.stopPropagation();
      $overlaySuspensionBlock.css("height", "0");
      closeOverlay();
      if ($('div[data-gjs-type="wrapper"]').length) {
        var _moreStatus = $selector.attr("id") + "_moreStatusSettingClose";
        leadComponentSite.globalMinimumUnitEvent.emit(`${_moreStatus}`, "1");
      }
    });
  }

  async function searchInit(nodeObj) {
      var $selector = $("[data-new-auto-uuid=" + nodeObj.nodeId + "]");
      this.searchFun($selector);
  }

  
  function closeSearchFun($selector) {
    const { motionSlideUpToTop } = window.MotionHelpers || {};

    // 关闭搜索表单（向上滑出）
    const $searchForm = $selector.find('.header-search-form');
    if(!$searchForm.is(':visible') || ($searchForm.is(':visible') && $searchForm.css('opacity') == '0')) {
      return
    }

    motionSlideUpToTop($searchForm.find('.header-search-form-container')[0], 200, {callback: function() {
      $('.header-search').removeClass("search-icon-active");
    }});

    $('.header-search-mask').toggle(); // 降级到 jQuery
  }

  function searchFun($selector) {
     // 在编辑器内部 不进行click
    if ($('div[data-gjs-type="wrapper"]').length) {
       return;
    }

    leadComponentSite.globalMinimumUnitEvent.on('header_share_open', function() {
      closeSearchFun($selector);
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_menu_open', function() {
      closeSearchFun($selector);
    });
    leadComponentSite.globalMinimumUnitEvent.on('header_langbar_open', function() {
      closeSearchFun($selector);
    });
      // 使用公共动画辅助库
      $selector.find('.search-icon-btn').unbind('click').bind('click', function () {
          const { motionSlideUpToBottom } = window.MotionHelpers || {};

          let _innerwidth = window.innerWidth;

          if($selector.find('.header-search-form').is(':visible')) {
            closeSearchFun($selector)
          } else {
            leadComponentSite.globalMinimumUnitEvent.emit('header_search_open');
            $('.header-search').addClass("search-icon-active");
            motionSlideUpToBottom($selector.find('.header-search-form-container')[0], 200);
          }

          
      });

      $selector.find('.close-icon').on('click', function () {
        closeSearchFun($selector)
      });

      // 推荐词
      $selector.find('.recommended-words > li').on('click', function () {
          $selector.find('.input-text').val($(this).text());
      });

      // 输入框焦点样式
      $(".search-input .input-text").focus(function () {
          $(this).parent().parent().addClass('focus');
      });

      $(".search-input .input-text").blur(function () {
          $(this).parent().parent().removeClass('focus');
      });
  }

})(window, jQuery);