(function (window, $, undefined) {
  var _block_namespaces_ = window._block_namespaces_ || (window._block_namespaces_ = {});
  var name = "langbar_40658";
  var langbar_40658 = _block_namespaces_[name] || (_block_namespaces_[name] = {});
  
  $.extend(langbar_40658, {
      "langbarInit": langbarInit,
      "langbarFun": langbarFun,
      "lanbarSwitch": lanbarSwitch,
      "lanbarSwitchMore": lanbarSwitchMore
  });

  /**
   * 根据屏幕宽度动态选择正确区域（桌面 / .phone_show）的语言栏 DOM 元素。
   * 每次调用实时查询，不缓存引用，resize 后自动切换到正确区域。
   */
  function getLangbarEls(pageNodeId) {
      var $allMatch = $('[data-new-auto-uuid="' + pageNodeId + '"]');
      var $block = $allMatch.parents('.block_40658').first();
      if (!$block.length) $block = $('.block_40658');
      var $scope = window.innerWidth > 768
        ? $block.find('.header_content').not('.phone_show')
        : $block.find('.header_content.phone_show');
      if (!$scope.length) $scope = $block;
      var $selector = $scope.find('[data-new-auto-uuid="' + pageNodeId + '"]');
      if (!$selector.length) $selector = $allMatch.first();
      var $headerEl = $selector.parents('.headerContainer');
      return {
        $selector: $selector,
        $block: $block,
        $headerEl: $headerEl,
        $switchContainer: $selector.find('.lang-dropdown-container'),
        $switchElBtn: $selector.find('.lanbarSwitch'),
        $switchElBackBtn: $selector.find('.lang-menu-box .lang-item-back'),
        $switchElUl: $selector.find('.lang-menu-box'),
        switchElUl: $selector.find('.lang-menu-box')[0],
        $overlay: $headerEl.find('.overlay'),
        $loadingMoreBtn: $selector.find('.lang-menu-list-more'),
      };
  }

  // langbarInit
  async function langbarInit(nodeObj) {
      // 加载 Motion.js 和动画辅助库
      if(leadComponentSite.motionSourceImport) {
          await leadComponentSite.motionSourceImport.init({});
      }

      if (leadComponentSite.motionHelperSourceImport) {
          await leadComponentSite.motionHelperSourceImport.init({});
      }
      
      this.langbarFun(nodeObj.pageNodeId);
  }

  function langbarFun(pageNodeId) {
      var _thatBlock = this;
      this.lanbarSwitch(pageNodeId);
      this.lanbarSwitchMore(pageNodeId);

      var ns = '.langbar40658';
      $(window).off('resize' + ns).on('resize' + ns, function(){
          _thatBlock.lanbarSwitch(pageNodeId);
          _thatBlock.lanbarSwitchMore(pageNodeId);
      });
  }

  /**
   * 高级防抖函数（支持立即执行）
   * @param {Function} fn 需要防抖的函数
   * @param {number} delay 延迟时间（毫秒）
   * @param {boolean} immediate 是否立即执行（第一次调用时立即执行）
   * @returns {Function} 防抖处理后的函数
   */
  function debounce(fn, delay, immediate = false) {
      let timer = null;
      let isInvoked = false; // 是否已经执行过
      
      return function(...args) {
          const context = this;
          
          // 如果有定时器，清除它
          if (timer) {
          clearTimeout(timer);
          }
          
          // 如果立即执行，且尚未执行过
          if (immediate && !isInvoked) {
          fn.apply(context, args);
          isInvoked = true;
          
          // delay 时间后重置 isInvoked
          timer = setTimeout(() => {
              isInvoked = false;
          }, delay);
          } else {
          // 延迟执行
          timer = setTimeout(() => {
              fn.apply(context, args);
              isInvoked = false;
          }, delay);
          }
      };
  }

  function lanbarSwitch(pageNodeId) {
      var els = getLangbarEls(pageNodeId);
      var _innerwidth = window.innerWidth;

      var { slideUp, slideDown } = window.MotionHelpers || {};
      
      els.$switchContainer.off('click');
      els.$switchContainer.off('mouseenter mouseleave');
      
      if(_innerwidth > 768) {
          els.$switchElBtn.unbind('click').bind('click', function () {
              if (els.$switchElUl.is(":visible")) {
                  if (slideUp) {
                      slideUp(els.switchElUl, 200);
                  }
              } else {
                  if (slideDown) {
                      slideDown(els.switchElUl, 200);
                  }
              }
          });

          $('body').on('click', function(event) {
              if(!$(event.target).parents('.langbar_contaienr_template').length) {
                  var currentEls = getLangbarEls(pageNodeId);
                  if (currentEls.$switchElUl.is(":visible") && slideUp) {
                      slideUp(currentEls.switchElUl, 240);
                  }
              }
          });
      } else {
          els.$switchElBtn.unbind('click').bind('click', function () { 
              var currentEls = getLangbarEls(pageNodeId);
              if (currentEls.$switchElUl.is(":visible")) {
                  currentEls.$headerEl.removeClass('headerFixedHover openMenuActive');
                  if (slideUp) {
                      slideUp(currentEls.switchElUl, 240);
                  }
                  $("html,body").removeClass('overflowHidden_nav');
                  currentEls.$overlay.hide();
              } else {
                  currentEls.$headerEl.addClass('headerFixedHover openMenuActive');
                  if (slideDown) {
                      slideDown(currentEls.switchElUl, 240);
                  }
                  $("html,body").addClass('overflowHidden_nav');
                  currentEls.$overlay.show();
                  leadComponentSite.globalMinimumUnitEvent.emit('header_langbar_open');
              }
          });

          if (leadComponentSite && leadComponentSite.globalMinimumUnitEvent) {
              leadComponentSite.globalMinimumUnitEvent.on('header_share_open', function () {
                  var currentEls = getLangbarEls(pageNodeId);
                  if (slideUp && currentEls.switchElUl) {
                      slideUp(currentEls.switchElUl, 0);
                  }
              });
              leadComponentSite.globalMinimumUnitEvent.on('header_search_open', function () {
                  var currentEls = getLangbarEls(pageNodeId);
                  if (slideUp && currentEls.switchElUl) {
                      slideUp(currentEls.switchElUl, 0);
                  }
              });
              leadComponentSite.globalMinimumUnitEvent.on('header_menu_open', function () {
                  var currentEls = getLangbarEls(pageNodeId);
                  if (slideUp && currentEls.switchElUl) {
                      slideUp(currentEls.switchElUl, 0);
                  }
              });
          }
          
          els.$switchElBackBtn.unbind('click').bind('click', function() {
              var currentEls = getLangbarEls(pageNodeId);
              if (currentEls.$switchElUl.is(":visible")) {
                  if (slideUp) {
                      slideUp(currentEls.switchElUl, 240);
                  }
              }
              currentEls.$headerEl.removeClass('headerFixedHover openMenuActive');
              $("html,body").removeClass('overflowHidden_nav');
              currentEls.$overlay.hide();
          });
      }
  }

  function lanbarSwitchMore(pageNodeId) {
      var els = getLangbarEls(pageNodeId);

      els.$loadingMoreBtn.off('click').on('click', function() {
          var currentEls = getLangbarEls(pageNodeId);
          currentEls.$switchElUl.toggleClass('expanded');
      });
  }

})(window, jQuery);