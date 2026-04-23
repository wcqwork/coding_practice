(function(window, $, undefined) {

    function checkScroll() {
      const headerFooterContainer = document.querySelector('.headerContainer');

      if(headerFooterContainer) {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = headerFooterContainer.offsetHeight;
        const headerOffsetTop = headerFooterContainer?.offsetTop || 0;
        if (scrollPosition > headerHeight) {
          headerFooterContainer.classList.add('headerFixedHover');
    
          const headerFooterPlaceholder = document.querySelector('.lead-header-placeholder');
          if(!headerFooterPlaceholder) {
            const placeholder = document.createElement('div');
    
            // 设置占位符的样式，使其高度与目标元素相同
            placeholder.classList.add('lead-header-placeholder');
            placeholder.style.height = headerHeight + 'px';
            placeholder.style.width = '100%';
            placeholder.style.display = 'block';
    
            // 将占位符插入到目标元素的下一个兄弟节点位置
            // 如果目标元素是其父元素的最后一个子节点，那么占位符将被添加为父元素的最后一个子节点
            headerFooterContainer.parentNode.insertBefore(placeholder, headerFooterContainer.nextSibling);
          }
        } else {
          const headerFooterPlaceholder = document.querySelector('.lead-header-placeholder');
          if(headerFooterPlaceholder) headerFooterPlaceholder.remove()
          if($('.openMenuActive').length) return 
          headerFooterContainer.classList.remove('headerFixedHover');

        }
      }
    }
    
    if($('div[data-gjs-type="wrapper"]').length || $('.headerHoverActive').length == 0) {
      return
    }    
    onloadHack(function(){
      checkScroll();
      window.addEventListener('scroll', checkScroll);
    })
    // 页头里面的所有 <a> 标签
    $('header a').each(function() {
        // 获取 href 属性
        var href = $(this).attr('href');

        // 检查 href 属性是否为空或不存在
        if (!href || href.trim() === '') {
            // 移除 href 属性
            $(this).removeAttr('href');

            // 添加点击事件监听器，阻止默认行为
            $(this).on('click', function(event) {
                event.preventDefault();
            });
        }
  });
})(window, jQuery);