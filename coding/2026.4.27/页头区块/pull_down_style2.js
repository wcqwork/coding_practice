/**
 * 下拉风格2 (Pull Down Style 2)
 * 来源：页头2 (header2)
 * 特点：支持复杂多级导航、二级导航图片/图标展示、三级导航图片处理
 * @version 3.1 - 优化重构版
 */
(function (window, $, undefined) {
  var _block_namespaces_ = window._block_namespaces_ || (window._block_namespaces_ = {});
  var name = "nav_style2";
  var nav_style2 = _block_namespaces_[name] || (_block_namespaces_[name] = {});
  
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
          menuItem: '.menu-item',
          menuItemBreak: '.menu-item-break',
          navMainFeature: '.nav-main-feature',
          nav: 'nav',
          navList: 'nav>.lea-nav-menu',
          buttonPrev: '.button-prev',
          buttonNext: '.button-next',
          cloneNav: '.clone_nav',
          navTitle: '.navTitle'
      },
      // 类名配置
      CLASSES: {
          overflowHidden: 'overflowHidden_nav',
          isCloseMenu: 'isCloseMenu',
          isOpen: 'isOpen',
          hasDepth5: 'hasDepth5',
          hoverActive: 'hover_active',
          activeItem: 'activeItem',
          itemActiveIphone: 'itemActive_iphone',
          phoneNav4Img: 'phone_nav4_img',
          pcNav2IsPhotoSvg: 'pc_nav2_isPhotoSvg',
          pcNav2IsPhoto: 'pc_nav2_isPhoto',
          pcNav2IsSvg: 'pc_nav2_isSvg',
          pcNav3: 'pc_nav3',
          pcNav3IsPhoto: 'pc_nav3_isphoto',
          pcNav4: 'pc_nav4'
      },
      // CSS变量名
      CSS_VARS: {
          mobileHeight: 'mobile-height',
          mobileHeader: 'mobile-header',
          navMenuDepth2Height: 'navMenu-depth2-height',
          headerModelWidth: 'header-model-width',
          clonePositionLeft: 'clone-position-left'
      },
      // 数值常量
      VALUES: {
          depth2HeightOffset: 40,      // 深度2高度偏移
          navWidthOffset: 8,           // 导航宽度偏移
          scrollOffset: 2,             // 滚动偏移
          iconSize: 30,                // 图标尺寸
          iconMargin: 8,               // 图标边距
          iconBottomBase: 16,          // 图标底部基准
          depth3Padding: 380,          // 深度3内边距
          depth3Offset: 60,            // 深度3偏移
          containerPadding: 80         // 容器内边距
      }
  };
  
  $.extend(nav_style2, {
      "navInit": navInit,
      "navPosition": navPosition,
      "navIphoneSwitchFun": navIphoneSwitchFun,
      "navIphoneBearkFun": navIphoneBearkFun,
      "navdepthFun": navdepthFun,
      "navdepth5Fun": navdepth5Fun,
      "navCheckScreenWidth": navCheckScreenWidth
  });

  // ==================== 初始化 ====================
  
  /**
   * 导航初始化入口
   * @param {Object} nodeObj - 节点对象
   */
  async function navInit(nodeObj) {
      console.log('intinitininitn222222')

      if (leadComponentSite.motionSourceImport) {
          await leadComponentSite.motionSourceImport.init({});
      }
      const _thatBlock = this;
      var $selector = navCommon.getSelector(nodeObj.pageNodeId);
      CONSTANTS = navCommon.CONSTANTS;

      // 初始化各功能模块
      navCommon.isPhone.call(this);
      this.navIphoneSwitchFun($selector);
      this.navIphoneBearkFun($selector);
      this.navPosition($selector);        
      this.navdepth5Fun($selector);
      this.navdepthFun($selector);
      this.navCheckScreenWidth($selector);

      // 使用防抖优化resize事件
      var resizeHandler = navCommon.debounce(function(){
          navCommon.isPhone.call(_thatBlock);
          _thatBlock.navPosition($selector);
          _thatBlock.navdepthFun($selector);
          _thatBlock.navIphoneSwitchFun($selector);
          _thatBlock.navCheckScreenWidth($selector);
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

      // 隐藏没有子项的箭头
      hideEmptyArrows($subArrow);

      // 绑定菜单开关事件
      bindMenuEvents($selector, $openMenuBtn, $closeMenuBtn, $navItem, $navMenu);
      
      // 绑定子箭头点击事件
      bindSubArrowEvents($selector);
  }

  /**
   * 隐藏没有子项的箭头
   */
  function hideEmptyArrows($subArrow) {
      $subArrow.each(function() {
          const $this = $(this);
          const dataHashChildren = $this.data('hash-children');
          if (dataHashChildren !== true) {
              $this.hide();
          }
      });
  }

  /**
   * 绑定菜单开关事件
   */
  function bindMenuEvents($selector, $openMenuBtn, $closeMenuBtn, $navItem, $navMenu) {
      const $blockContainer = $(CONFIG.SELECTORS.blockContainer);
      
      // 打开菜单
      navCommon.bindEventOnce($openMenuBtn, 'click', function() {
          navCommon.setCSSVar($blockContainer, CONFIG.CSS_VARS.mobileHeight, window.innerHeight + 'px');
          navCommon.setCSSVar($blockContainer, CONFIG.CSS_VARS.mobileHeader, $blockContainer.height() + 'px');
          
          $("html,body").toggleClass(CONFIG.CLASSES.overflowHidden);
          $(this).parent('.nav-iphone-menucontainer').addClass(CONFIG.CLASSES.isCloseMenu);
          $openMenuBtn.hide();
          $closeMenuBtn.show();
          $navMenu.stop(true, true).css('display', 'grid').hide().animate({ height: 'toggle' }, 500);
      });
      
      // 关闭菜单
      navCommon.bindEventOnce($closeMenuBtn, 'click', function() {
          closeMenu($openMenuBtn, $closeMenuBtn, $navMenu, $(this));
      });

      // 点击菜单项关闭（移动端）
      navCommon.bindEventOnce($navItem, 'click', function(event) {
          if(navCommon.isMobile() && ['A','SPAN'].includes(event.target.tagName)){
              closeMenu($openMenuBtn, $closeMenuBtn, $navMenu, $closeMenuBtn);
          }
      });
  }

  /**
   * 关闭菜单
   */
  function closeMenu($openMenuBtn, $closeMenuBtn, $navMenu, $triggerBtn) {
      $("html,body").toggleClass(CONFIG.CLASSES.overflowHidden);
      $triggerBtn.parent('.nav-iphone-menucontainer').removeClass(CONFIG.CLASSES.isCloseMenu);
      $openMenuBtn.show();
      $closeMenuBtn.hide();
      $navMenu.stop(true, true).slideToggle(500);
  }

  /**
   * 绑定子箭头点击事件
   */
  function bindSubArrowEvents($selector) {
      // 解绑旧事件
      $selector.off('click', CONFIG.SELECTORS.subArrow);
      
      if(!navCommon.isMobile()) return;
      
      // 深度0-2: 复杂切换
      $selector.on('click', '.lea-navMenu-depth0 > .menu-item > a .sub-arrow, .lea-navMenu-depth1 > .menu-item > a .sub-arrow, .lea-navMenu-depth2 > .menu-item > a .sub-arrow', function(event) {
          handleSubArrowClick.call(this, event, $selector, false);
      });

      // 深度3-4: 简单切换
      $selector.on('click', '.lea-navMenu-depth3 > .menu-item > a .sub-arrow, .lea-navMenu-depth4 > .menu-item > a .sub-arrow', function(event) {
          handleSubArrowClick.call(this, event, $selector, true);
      });
  }

  /**
   * 处理子箭头点击
   * @param {Event} event - 事件对象
   * @param {jQuery} $selector - 选择器
   * @param {boolean} isSimpleToggle - 是否简单切换
   */
  function handleSubArrowClick(event, $selector, isSimpleToggle) {
      event.preventDefault();
      event.stopPropagation();

      const $subArrow = $(this);
      const $currentMenuItem = $subArrow.closest(CONFIG.SELECTORS.menuItem);
      const $navMainFeature = $selector.find(CONFIG.SELECTORS.navMainFeature);
      const $menulist = $currentMenuItem.children('.lea-nav-menu');

      if (isSimpleToggle) {
          // 简单切换模式
          simpleToggleMenu($subArrow, $currentMenuItem, $menulist);
      } else {
          // 复杂切换模式（隐藏同级）
          complexToggleMenu($subArrow, $currentMenuItem, $menulist, $navMainFeature);
      }

      return false;
  }

  /**
   * 简单切换菜单
   */
  function simpleToggleMenu($subArrow, $currentMenuItem, $menulist) {
      $subArrow.toggleClass(CONFIG.CLASSES.isOpen);
      // if($currentMenuItem.parent().hasClass('lea-navMenu-depth0')) {
          $currentMenuItem.addClass('open')
          adjustMenuDisplay($menulist);
      // } else {
      //     $menulist.stop().slideToggle(CONSTANTS.ANIMATION_DURATION, function() {
      //         adjustMenuDisplay($menulist);
      //     });
      // }
      

      adjustMenuDisplay($menulist);
      $currentMenuItem.toggleClass(CONFIG.CLASSES.itemActiveIphone);
  }

  /**
   * 复杂切换菜单
   */
  function complexToggleMenu($subArrow, $currentMenuItem, $menulist, $navMainFeature) {
      // 隐藏同级元素
      $currentMenuItem.siblings(CONFIG.SELECTORS.menuItem).hide();
      $currentMenuItem.siblings(CONFIG.SELECTORS.menuItemBreak).hide();
      $navMainFeature.hide();
      $currentMenuItem.children('a').eq(0).hide();

      // 显示返回按钮
      $currentMenuItem.children('.lea-nav-menu').find('>' + CONFIG.SELECTORS.menuItemBreak).css('display', 'flex');
      // $subArrow.toggleClass(CONFIG.CLASSES.isOpen);
      

      // if($currentMenuItem.parent().hasClass('lea-navMenu-depth0')) {
          $currentMenuItem.addClass('open')
          adjustMenuDisplay($menulist);
      // } else {
      //     $menulist.stop().slideToggle(0, function() {
      //         adjustMenuDisplay($menulist);
      //     });
      // }

      // 绑定返回按钮事件
      bindBackButtonEvent($currentMenuItem, $navMainFeature);
  }

  /**
   * 调整菜单显示样式
   */
  function adjustMenuDisplay($menulist) {
      $menulist.siblings(CONFIG.SELECTORS.navItem).css('border', '');
      
      if ($menulist.is(':visible') && $menulist.hasClass('lea-navMenu-depth4')) {
          if($menulist.find('img').length > 0) {
              $menulist.css('display', 'flex').addClass(CONFIG.CLASSES.phoneNav4Img);
              $menulist.siblings(CONFIG.SELECTORS.navItem).css('border', 'none');
          } else {
              $menulist.css('display', 'block');
          }
      }
  }

  /**
   * 绑定返回按钮事件
   */
  function bindBackButtonEvent($currentMenuItem, $navMainFeature) {
      $currentMenuItem.children('.lea-nav-menu').find('>' + CONFIG.SELECTORS.menuItemBreak).off('click').on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          if($currentMenuItem.hasClass('open')) {
              $currentMenuItem.removeClass('open')
          }

          setTimeout(function() {
              // 隐藏当前子菜单
              $currentMenuItem.children('.lea-nav-menu').hide();

              // 显示同级元素
              $currentMenuItem.siblings(CONFIG.SELECTORS.menuItem).show();
              $currentMenuItem.siblings(CONFIG.SELECTORS.menuItemBreak).show();
              
              if ($currentMenuItem.closest('.lea-nav-menu').hasClass('lea-navMenu-depth0')) {
                  $navMainFeature.show();
              }
              $currentMenuItem.children('a').eq(0).show();
          }, 200)


          return false;
      });
  }

  /**
   * 移动端返回按钮初始化
   * @param {jQuery} $selector - 选择器对象
   */
  function navIphoneBearkFun($selector) {
      $selector.find(CONFIG.SELECTORS.menuItemBreak).each(function() {
          const $menuItemBreak = $(this);
          const $parentLi = $menuItemBreak.closest('ul').closest('li');
          const $navTitle = $parentLi.find('> a ' + CONFIG.SELECTORS.navTitle);
          
          $menuItemBreak.append($navTitle.clone());
      });
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

      // 初始化
      navCommon.setCSSProperty($navUlEl, 'margin-left', '0px');

      const defaultOffsetLeft = $navUlEl.prop("offsetLeft");
      const navigationWidth = Math.ceil($navEl.width());
      const ulWidth = $navEl.prop("scrollWidth");

      // 创建按钮控制器
      var buttonController = createButtonController($navUlEl, $prevEl, $nextEl, defaultOffsetLeft, navigationWidth, ulWidth);
      
      // 初始检查
      buttonController.updateVisibility();

      // 绑定点击事件
      navCommon.bindEventOnce($prevEl, 'click', function() {
          buttonController.scrollLeft();
      });

      navCommon.bindEventOnce($nextEl, 'click', function() {
          buttonController.scrollRight();
      });
  }

  /**
   * 创建按钮控制器
   */
  function createButtonController($navUlEl, $prevEl, $nextEl, defaultOffsetLeft, navigationWidth, ulWidth) {
      return {
          updateVisibility: function() {
              const currentOffsetLeft = Math.abs($navUlEl.prop("offsetLeft") - defaultOffsetLeft);
              const isRightScroll = ulWidth > (currentOffsetLeft + navigationWidth);
              const isLeftScroll = currentOffsetLeft > 0;

              $nextEl.toggle(isRightScroll);
              $prevEl.toggle(isLeftScroll);
          },
          
          scrollLeft: function() {
              const self = this;
              const currentOffsetLeft = Math.abs($navUlEl.prop("offsetLeft") - defaultOffsetLeft);
              let accumulatedWidth = 0;
              let $firstVisibleLi = null;

              // 找到第一个可见的li
              $navUlEl.find('>li').each(function() {
                  accumulatedWidth += $(this).outerWidth();
                  if (accumulatedWidth > currentOffsetLeft) {
                      $firstVisibleLi = $(this);
                      return false;
                  }
              });

              const $prevLi = $firstVisibleLi ? $firstVisibleLi.prev('li') : null;
              if ($prevLi && $prevLi.length > 0) {
                  let newScroll = Math.max(accumulatedWidth - $firstVisibleLi.outerWidth() - $prevLi.outerWidth(), 0);
                  navCommon.setCSSProperty($navUlEl, 'margin-left', -(newScroll + (newScroll > 0 ? 1 : 0)) + 'px');
              } else {
                  navCommon.setCSSProperty($navUlEl, 'margin-left', '0px');
              }

              setTimeout(function() { self.updateVisibility(); }, CONSTANTS.RESIZE_DELAY);
          },
          
          scrollRight: function() {
              const self = this;
              const currentOffsetLeft = Math.abs($navUlEl.prop("offsetLeft") - defaultOffsetLeft);
              let accumulatedWidth = 0;
              let $lastVisibleLi = null;

              // 找到最后一个可见的li
              $navUlEl.find('>li').each(function() {
                  accumulatedWidth += $(this).outerWidth();
                  if (accumulatedWidth <= currentOffsetLeft + navigationWidth) {
                      $lastVisibleLi = $(this);
                  } else {
                      return false;
                  }
              });

              const $nextLi = $lastVisibleLi ? $lastVisibleLi.next('li') : null;
              if ($nextLi && $nextLi.length > 0) {
                  let newScroll = Math.min(
                      accumulatedWidth - navigationWidth + $nextLi.outerWidth() - CONFIG.VALUES.scrollOffset,
                      ulWidth - navigationWidth
                  );
                  
                  let marginValue = -newScroll;
                  const $nextLi2 = $lastVisibleLi.next('li').next('li');
                  if(!($nextLi2 && $nextLi2.length > 0)) {
                      marginValue -= CONFIG.VALUES.navWidthOffset;
                  }
                  
                  navCommon.setCSSProperty($navUlEl, 'margin-left', marginValue + 'px');
              }

              setTimeout(function() { self.updateVisibility(); }, CONSTANTS.RESIZE_DELAY);
          }
      };
  }

  // ==================== 一级导航 ====================
  
  /**
   * 一级导航展开逻辑
   * @param {jQuery} $selector - 选择器对象
   */
  function navdepthFun($selector) {
      const $depth2IsNotPhotoSvg = $selector.find(".lea-navMenu-depth0 > .menu-item:not(." + CONFIG.CLASSES.hasDepth5 + ")");

      if(navCommon.isMobile()) {
          // 移动端清除事件
          clearDepthEvents($depth2IsNotPhotoSvg);
      } else {
          // PC端绑定悬停事件
          bindDepthHoverEvents($depth2IsNotPhotoSvg);
      }
  }

  /**
   * 绑定深度悬停事件
   */
  function bindDepthHoverEvents($items) {
      $items.each(function(index, item) {
          const $menu = $(item).find('.lea-nav-menu');
          
          // 没有菜单或有子ul则跳过
          if ($menu.length == 0 || $menu.find('ul').length > 0) {
              return;
          }

          let hideTimeout;

          $(item).on('mouseenter', function() {
              clearTimeout(hideTimeout);
              $menu.stop(true, true).show();
          });

          $(item).on('mouseleave', function() {
              hideTimeout = setTimeout(function() {
                  if (!$(item).is(':hover') && !$menu.is(':hover')) {
                      $menu.stop(true, true).hide();
                  }
              }, CONSTANTS.HOVER_DELAY);
          });

          $menu.on('mouseenter', function() {
              clearTimeout(hideTimeout);
          });

          $menu.on('mouseleave', function() {
              hideTimeout = setTimeout(function() {
                  if (!$(item).is(':hover') && !$menu.is(':hover')) {
                      $menu.stop(true, true).hide();
                  }
              }, CONSTANTS.HOVER_DELAY);
          });
      });
  }

  /**
   * 清除深度事件
   */
  function clearDepthEvents($items) {
      $items.each(function(index, item) {
          const $menu = $(item).find('.lea-nav-menu');
          $(item).off('mouseenter mouseleave');
          $menu.off('mouseenter mouseleave');
      });
  }

  // ==================== 多级导航处理 ====================
  
  /**
   * 二三四五级导航处理（核心函数）
   * @param {jQuery} $selector - 选择器对象
   */
  function navdepth5Fun($selector) {
      const $blockEl = $selector.parents(CONFIG.SELECTORS.blockContainer);
      const $clone_nav = $blockEl.find(CONFIG.SELECTORS.cloneNav);
      $clone_nav.addClass('nav_style2')
      $clone_nav.attr('id', $('.nav_40658').attr('id'))


      // 处理各级导航
      processDepth2Navigation($selector, $clone_nav);
      processDepth3Navigation($selector, $clone_nav);
      processDepth5Navigation($selector, $clone_nav);

      // 绑定悬停事件
      bindDepth5HoverEvents($selector, $clone_nav);
      bindDepth3HoverEvents($clone_nav);

      // 样式处理
      applyImageIconStyles($clone_nav);

      // 宽度调整
      adjustNavigationWidth($blockEl);
  }

  /**
   * 处理二级导航（带图片/图标）
   */
  function processDepth2Navigation($selector, $clone_nav) {
      const processedItems = new Set();
      const $depth2 = $selector.find(".lea-navMenu-depth1");

      $depth2.each(function() {
          const $currentDepth2 = $(this);
          
          // 检查是否有更深层级
          if ($currentDepth2.find('.lea-navMenu-depth2').length > 0) {
              return;
          }

          // 统计图片和图标
          const stats = countImageAndIcon($currentDepth2);
          
          if (stats.hasImage || stats.hasIcon) {
              const $parentMenuItem = $currentDepth2.parent(CONFIG.SELECTORS.menuItem);
              
              if (!processedItems.has($parentMenuItem[0])) {
                  createDepth2NavItem($parentMenuItem, $clone_nav, stats);
                  processedItems.add($parentMenuItem[0]);
              }
          }
      });
  }

  /**
   * 统计图片和图标数量
   */
  function countImageAndIcon($element) {
      let imageCount = 0;
      let iconCount = 0;
      
      $element.find('li').each(function() {
          if ($(this).find(CONFIG.SELECTORS.navItem + ' img').length > 0) {
              imageCount++;
          }
          if ($(this).find(CONFIG.SELECTORS.navItem + ' > i.icon').length > 0) {
              iconCount++;
          }
      });
      
      return {
          hasImage: imageCount > 0,
          hasIcon: iconCount > 0,
          imageCount: imageCount,
          iconCount: iconCount
      };
  }

  /**
   * 创建二级导航项
   */
  function createDepth2NavItem($parentMenuItem, $clone_nav, stats) {
      $parentMenuItem.addClass(CONFIG.CLASSES.hasDepth5);
      
      const _index = $parentMenuItem.index();
      const cloneItem = navCommon.cloneElement($parentMenuItem.find(".lea-navMenu-depth1"));
      
      cloneItem.find('.lea-navMenu-depth2>' + CONFIG.SELECTORS.menuItem).eq(0).addClass(CONFIG.CLASSES.activeItem);
      const newNavItem = $(`<div class="nav_box_item nav_box_item_${_index}"></div>`);

      // 添加样式类
      if (stats.hasImage && stats.hasIcon) {
          newNavItem.addClass(CONFIG.CLASSES.pcNav2IsPhotoSvg);
      } else {
          newNavItem.addClass(CONFIG.CLASSES.pcNav2IsPhotoSvg);
          if (stats.hasImage) newNavItem.addClass(CONFIG.CLASSES.pcNav2IsPhoto);
          if (stats.hasIcon) newNavItem.addClass(CONFIG.CLASSES.pcNav2IsSvg);
      }

      newNavItem.append(cloneItem);
      $clone_nav.append(newNavItem);
  }

  /**
   * 处理三级导航（带图片）
   */
  function processDepth3Navigation($selector, $clone_nav) {
      const processedItems = new Set();
      const $depth3 = $selector.find(".lea-navMenu-depth2");
      const $depth3List = $depth3.parents('.lea-navMenu-depth1').parent(CONFIG.SELECTORS.menuItem);

      $depth3List.each(function() {
          const $currentDepth3 = $(this);
          
          // 检查是否有更深层级
          if ($currentDepth3.find('.lea-navMenu-depth3').length > 0) {
              return;
          }

          const hasImage = $currentDepth3.find('.lea-navMenu-depth2').find('img').length > 0;
          
          if (!processedItems.has($currentDepth3[0])) {
              createDepth3NavItem($currentDepth3, $clone_nav, hasImage);
              bindDepth3ImageHover($clone_nav);
              processedItems.add($currentDepth3[0]);
          }
      });
  }

  /**
   * 创建三级导航项
   */
  function createDepth3NavItem($currentDepth3, $clone_nav, hasImage) {
      $currentDepth3.addClass(CONFIG.CLASSES.hasDepth5);
      
      const _index = $currentDepth3.index();
      const cloneItem = navCommon.cloneElement($currentDepth3.find(".lea-navMenu-depth1"));
      cloneItem.find('>' + CONFIG.SELECTORS.menuItem + '>' + CONFIG.SELECTORS.navItem).eq(0).addClass(CONFIG.CLASSES.hoverActive);
      
      const newNavItem = $(`<div class="nav_box_item nav_box_item_${_index}"></div>`);
      newNavItem.addClass(CONFIG.CLASSES.pcNav3);
      
      if (hasImage) {
          newNavItem.addClass(CONFIG.CLASSES.pcNav3IsPhoto);
      } else {
          newNavItem.find('.lea-navMenu-depth1>' + CONFIG.SELECTORS.menuItem + '>' + CONFIG.SELECTORS.navItem + '.' + CONFIG.CLASSES.hoverActive).removeClass(CONFIG.CLASSES.hoverActive);
      }

      newNavItem.append(cloneItem);
      $clone_nav.append(newNavItem);
  }

  /**
   * 绑定三级导航图片悬停事件
   */
  function bindDepth3ImageHover($clone_nav) {
      const $depth2CloneNav = $clone_nav.find('.' + CONFIG.CLASSES.pcNav3IsPhoto).find('.lea-nav-menu.lea-navMenu-depth1 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem);
      
      $depth2CloneNav.each(function() {
          const $item = $(this);
          navCommon.bindEventOnce($item, 'mouseenter', function(event) {
              event.stopPropagation();
              
              // 移除所有激活状态
              $item.parents('.lea-navMenu-depth1').find(' > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem).removeClass(CONFIG.CLASSES.hoverActive);
              
              // 添加当前激活状态
              $item.addClass(CONFIG.CLASSES.hoverActive);

              // 调整高度
              setTimeout(function() {
                  adjustDepth2Height($clone_nav, $item);
              }, 200);
          });
      });
  }

  /**
   * 调整深度2高度
   */
  function adjustDepth2Height($clone_nav, $item) {
      $clone_nav.find('.' + CONFIG.CLASSES.pcNav3IsPhoto).css('transition', 'height .2s');
      
      const $currentNav2 = $item.parent().find('.lea-navMenu-depth2');
      const currentHeight = $currentNav2.height() + CONFIG.VALUES.depth2HeightOffset;
      const leftHeight = $item.closest('.lea-navMenu-depth1').height() + CONFIG.VALUES.depth2HeightOffset;

      const finalHeight = (currentHeight && currentHeight > leftHeight) ? currentHeight : leftHeight;
      navCommon.setCSSVar($(CONFIG.SELECTORS.blockContainer + ' .Box'), CONFIG.CSS_VARS.navMenuDepth2Height, finalHeight + 'px');
  }

  /**
   * 处理四五级导航
   */
  function processDepth5Navigation($selector, $clone_nav) {
      const $depth5 = $selector.find(".lea-navMenu-depth3");
      const $depth5List = $depth5.parents('.lea-navMenu-depth1').parent(CONFIG.SELECTORS.menuItem);
      
      $depth5List.each(function() {
          const $item = $(this);
          $item.addClass(CONFIG.CLASSES.hasDepth5);
          
          const _index = $item.index();
          const cloneItem = navCommon.cloneElement($item.find(".lea-navMenu-depth1"));
          cloneItem.find('.lea-navMenu-depth2>' + CONFIG.SELECTORS.menuItem).eq(0).addClass(CONFIG.CLASSES.activeItem);
          
          const newNavItem = $(`<div class="nav_box_item nav_box_item_${_index}"></div>`);
          newNavItem.addClass(CONFIG.CLASSES.pcNav4);
          newNavItem.append(cloneItem);
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
          const targetElement = _$target[0];
          
          // 清除所有隐藏计时器
          if(hideTimer) {
              clearTimeout(hideTimer);
              hideTimer = null;
          }
          
          // 隐藏其他项（不包括当前项）
          $clone_nav.find('.nav_box_item').not(_$target).each(function() {
              if($(this).is(':visible')) {
                  const otherElement = this;
                  if (window.MotionHelpers && window.MotionHelpers.slideUp) {
                      window.MotionHelpers.slideUp(otherElement, 240);
                  } else {
                      $(this).stop(true, true).slideUp();
                  }
              }
          });
          
          // 移除其他项的激活状态
          $depthNavList.not($that).find('>' + CONFIG.SELECTORS.navItem).removeClass(CONFIG.CLASSES.hoverActive);
          
          // 显示当前项
          $that.find('>' + CONFIG.SELECTORS.navItem).addClass(CONFIG.CLASSES.hoverActive);
          if(!_$target.is(':visible')) {
              // 使用 Motion.js（会自动停止之前的动画，防止闪动）✨
              if (window.MotionHelpers && window.MotionHelpers.slideDown && targetElement) {
                  window.MotionHelpers.slideDown(targetElement, 240);
              } else {
                  _$target.stop().slideDown();
              }
          }
          
          // 调整高度
          setTimeout(function() {
              adjustDepth5Height(_$target);
          }, CONSTANTS.HOVER_DELAY);

          // 处理隐藏逻辑（带延迟）
          function scheduleHide() {
              hideTimer = setTimeout(function() {
                  // 检查鼠标是否仍在导航项或下拉菜单上
                  if(!$that.is(':hover') && !_$target.is(':hover')) {
                      if (window.MotionHelpers && window.MotionHelpers.slideUp && targetElement) {
                          window.MotionHelpers.slideUp(targetElement, 240);
                      } else {
                          _$target.stop(true, true).slideUp();
                      }
                      $that.find('>' + CONFIG.SELECTORS.navItem).removeClass(CONFIG.CLASSES.hoverActive);
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
   * 调整深度5高度
   */
  function adjustDepth5Height(_$target) {
      if(!_$target.find('.lea-navMenu-depth2').length) return;
      
      _$target.css('transition', 'none');
      
      let currentHeight = _$target.find('.lea-navMenu-depth1').find('.menu-item-level0>.lea-navMenu-depth2').height() + CONFIG.VALUES.depth2HeightOffset;
      if(!currentHeight) {
          currentHeight = _$target.find('.lea-navMenu-depth1 .' + CONFIG.SELECTORS.navItem + '.' + CONFIG.CLASSES.hoverActive).parents(CONFIG.SELECTORS.menuItem).find('>.lea-navMenu-depth2').height() + CONFIG.VALUES.depth2HeightOffset;
      }
      
      const leftHeight = _$target.find('.lea-navMenu-depth1').height() + CONFIG.VALUES.depth2HeightOffset;
      const finalHeight = (currentHeight && currentHeight > leftHeight) ? currentHeight : leftHeight;
      
      navCommon.setCSSVar($(CONFIG.SELECTORS.blockContainer + ' .Box'), CONFIG.CSS_VARS.navMenuDepth2Height, finalHeight + 'px');
  }


  /**
   * 绑定深度3悬停事件
   */
  function bindDepth3HoverEvents($clone_nav) {
      const $depth3El = $clone_nav.find('.' + CONFIG.CLASSES.pcNav4).find('.lea-navMenu-depth2>' + CONFIG.SELECTORS.menuItem);
      
      navCommon.bindEventOnce($depth3El, 'mouseenter', function() {
          $(this).parents('.nav_box_item').find('.' + CONFIG.CLASSES.activeItem).removeClass(CONFIG.CLASSES.activeItem);
          $(this).addClass(CONFIG.CLASSES.activeItem);
      });
  }

  /**
   * 应用图片图标样式
   */
  function applyImageIconStyles($clone_nav) {
      // 处理四五级导航缺失图片
      fillMissingImages($clone_nav);
      
      // 处理三级导航图片样式
      adjustDepth3PhotoStyles($clone_nav);
      
      // 处理三级导航图标
      adjustDepth3IconMargin($clone_nav);
      
      // 处理二级导航图标
      adjustDepth2IconMargin($clone_nav);
  }

  /**
   * 填充缺失的图片占位符
   */
  function fillMissingImages($clone_nav) {
      $clone_nav.find('.' + CONFIG.CLASSES.pcNav4 + ' .lea-navMenu-depth2').each(function() {
          var $menuDepth2 = $(this);
          var hasImgOrI = $menuDepth2.find('>li>a>img, >li>a>i').length > 0;

          if (hasImgOrI) {
              $menuDepth2.find('>li>a').each(function() {
                  var $a = $(this);
                  if ($a.children('img, i').length === 0) {
                      $a.prepend(`<div style="width: ${CONFIG.VALUES.iconSize}px; height: ${CONFIG.VALUES.iconSize}px; margin-right: ${CONFIG.VALUES.iconMargin}px;"></div>`);
                  }
              });
          }
      });
  }

  /**
   * 调整深度3图片样式
   */
  function adjustDepth3PhotoStyles($clone_nav) {
      $clone_nav.find('.nav_box_item.' + CONFIG.CLASSES.pcNav3IsPhoto).each(function() {
          let nav2IsNoPhoto = true;
          let nav2IsAllPhotoSvg = false;
          
          $(this).find('.lea-nav-menu.lea-navMenu-depth1 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem).each(function() {
              var $menuDepth1 = $(this);

              if($menuDepth1.find('img').length > 0 && $menuDepth1.find('>i').length > 0) {
                  nav2IsAllPhotoSvg = true;
                  nav2IsNoPhoto = false;
                  return false;
              }

              if($menuDepth1.find('img').length > 0 || $menuDepth1.find('>i').length > 0) {
                  nav2IsNoPhoto = false;
                  return false;
              }
          });
          
          if(nav2IsNoPhoto) {
              $(this).find('.lea-nav-menu.lea-navMenu-depth1 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem + ' ' + CONFIG.SELECTORS.navTitle).css('position', 'static');
          }
          if(nav2IsAllPhotoSvg) {
              $(this).find('.lea-nav-menu.lea-navMenu-depth1 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem + ' ' + CONFIG.SELECTORS.navTitle).css('left', '85px');
              $(this).find('.lea-nav-menu.lea-navMenu-depth1 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem + ' > i').css('margin', '0');
          }
      });
  }

  /**
   * 调整深度3图标边距
   */
  function adjustDepth3IconMargin($clone_nav) {
      $clone_nav.find('.nav_box_item.' + CONFIG.CLASSES.pcNav3IsPhoto).each(function() {
          const lineHeight = $(this).find('.lea-navMenu-depth2>' + CONFIG.SELECTORS.menuItem + '>' + CONFIG.SELECTORS.navItem).css('line-height');
          if(lineHeight == 'normal') return;
          
          $(this).find('.lea-navMenu-depth2 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem).each(function() {
              const marginBottom = (parseFloat(lineHeight) - CONFIG.VALUES.iconBottomBase) / 2;
              $(this).find('>.icon').css('margin-bottom', marginBottom + 'px');
          });
      });
  }

  /**
   * 调整深度2图标边距
   */
  function adjustDepth2IconMargin($clone_nav) {
      $clone_nav.find('.nav_box_item.' + CONFIG.CLASSES.pcNav2IsPhotoSvg).each(function() {
          const lineHeight = $(this).find('.lea-navMenu-depth1>' + CONFIG.SELECTORS.menuItem + '>' + CONFIG.SELECTORS.navItem).css('line-height');
          const fontSize = $(this).find('.lea-navMenu-depth1>' + CONFIG.SELECTORS.menuItem + '>' + CONFIG.SELECTORS.navItem).css('font-size');

          if(lineHeight == 'normal') return;
          
          $(this).find('.lea-navMenu-depth1 > ' + CONFIG.SELECTORS.menuItem + ' > ' + CONFIG.SELECTORS.navItem).each(function() {
              const marginBottom = (parseFloat(lineHeight) - parseFloat(fontSize)) / 2 + 15 - 
                                  (CONFIG.VALUES.iconBottomBase * parseFloat(lineHeight) / parseFloat(fontSize) - CONFIG.VALUES.iconBottomBase) / 2 + 
                                  (parseFloat(fontSize) / 2 - 8);
              $(this).find('>.icon').css('margin-bottom', marginBottom + 'px');
          });
      });
  }

  /**
   * 调整导航宽度
   */
  function adjustNavigationWidth($blockEl) {
      function changeWidth() {
          const blockEl = document.querySelector(CONFIG.SELECTORS.blockContainer);
          if(!blockEl) return;
          
          const $navBoxItemWidth = $blockEl.outerWidth();
          let $headerContentWeight = parseFloat(navCommon.getCSSVar(blockEl, CONFIG.CSS_VARS.headerModelWidth));
          
          // 解析CSS变量值
          const cssVarValue = $blockEl.css('--' + CONFIG.CSS_VARS.headerModelWidth) || '';
          const valueWithUnit = cssVarValue.match(/^(\d+(\.\d+)?)([a-z%]*)$/);
          
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
          const $cloneLeaNavMenuDepth2 = $blockEl.find(CONFIG.SELECTORS.cloneNav + ' .' + CONFIG.CLASSES.pcNav3IsPhoto + ' .lea-navMenu-depth2');

          if($navBoxItemWidth - CONFIG.VALUES.containerPadding / 2 > $headerContentWeight) {
              const paddingWidth = ($navBoxItemWidth - CONFIG.VALUES.containerPadding - $headerContentWeight) / 2;
              
              applyWidthPadding($navBoxItem, paddingWidth);
              applyDepth3Width($cloneLeaNavMenuDepth3, $navBoxItemWidth, paddingWidth);
              applyDepth2Width($cloneLeaNavMenuDepth2, $navBoxItemWidth, paddingWidth);
          } else {
              resetWidthStyles($navBoxItem, $cloneLeaNavMenuDepth3, $cloneLeaNavMenuDepth2);
          }
      }
      
      changeWidth();
      $(window).resize(navCommon.debounce(changeWidth, 200));
  }

  /**
   * 应用宽度内边距
   */
  function applyWidthPadding($navBoxItem, paddingWidth) {
      navCommon.setCSSProperty($navBoxItem, {
          'padding-left': paddingWidth + 'px',
          'padding-right': paddingWidth + 'px'
      });
  }

  /**
   * 应用深度3宽度
   */
  function applyDepth3Width($elements, totalWidth, paddingWidth) {
      $elements.each(function() {
          const $that = $(this);
          navCommon.setCSSVar($that, CONFIG.CSS_VARS.clonePositionLeft, (paddingWidth + CONFIG.VALUES.depth3Padding - CONFIG.VALUES.depth3Offset) + 'px');
          navCommon.setCSSProperty($that, 'width', (totalWidth - paddingWidth - CONFIG.VALUES.depth3Padding - paddingWidth) + 'px');
      });
  }

  /**
   * 应用深度2宽度
   */
  function applyDepth2Width($elements, totalWidth, paddingWidth) {
      $elements.each(function() {
          const $that = $(this);
          if($that.find('.lea-navMenu-depth3').length === 0) {
              navCommon.setCSSVar($that, CONFIG.CSS_VARS.clonePositionLeft, (paddingWidth + CONFIG.VALUES.depth3Padding - CONFIG.VALUES.depth3Offset) + 'px');
              navCommon.setCSSProperty($that, 'width', (totalWidth - paddingWidth - CONFIG.VALUES.depth3Padding - paddingWidth) + 'px');
          }
      });
  }

  /**
   * 重置宽度样式
   */
  function resetWidthStyles($navBoxItem, $cloneLeaNavMenuDepth3, $cloneLeaNavMenuDepth2) {
      navCommon.setCSSProperty($navBoxItem, {'padding-left': '', 'padding-right': ''});
      
      $cloneLeaNavMenuDepth3.each(function() {
          navCommon.setCSSVar($(this), CONFIG.CSS_VARS.clonePositionLeft, '');
          navCommon.setCSSProperty($(this), 'width', '');
      });
      
      $cloneLeaNavMenuDepth2.each(function() {
          const $that = $(this);
          if($that.find('.lea-navMenu-depth3').length === 0) {
              navCommon.setCSSVar($that, CONFIG.CSS_VARS.clonePositionLeft, '');
              navCommon.setCSSProperty($that, 'width', '');
          }
      });
  }

  /**
   * 设备切换时处理导航显示
   * @param {jQuery} $selector - 选择器对象
   */
  function navCheckScreenWidth($selector) {
      if (navCommon.isMobile()) {
          $selector.find('.nav-main-feature').show();
      } else {
          // PC端重置状态
          $selector.find('.lea-navMenu-depth0 > ' + CONFIG.SELECTORS.menuItem).show();
          $selector.find('.lea-navMenu-depth0 > ' + CONFIG.SELECTORS.menuItem + ' > a').show();
          $selector.find('.lea-navMenu-depth0 > ' + CONFIG.SELECTORS.menuItem + ' ul').hide();
          $selector.find('.lea-navMenu-depth1 ' + CONFIG.SELECTORS.menuItem).show();
          $selector.find('.lea-navMenu-depth1 ' + CONFIG.SELECTORS.menuItem + ' ' + CONFIG.SELECTORS.navItem).show();
          $selector.find('.' + CONFIG.CLASSES.itemActiveIphone).removeClass(CONFIG.CLASSES.itemActiveIphone);
          $selector.find('.' + CONFIG.CLASSES.isOpen).removeClass(CONFIG.CLASSES.isOpen);
          $selector.find('.' + CONFIG.CLASSES.phoneNav4Img).prev(CONFIG.SELECTORS.navItem).css('border', '');
      }
  }

})(window, jQuery);