<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="conBox">
   <%@ include file="/common/okmessage.jsp" %>
   <div class="top-title">
   		<c:if test="${empty command.videoGroupId}">
   		<p><smartTag:message code="backend.video.add_cate" text="添加视频分类"/></p>
   		</c:if>
   		<c:if test="${not empty command.videoGroupId}">
   		<p><smartTag:message code="backend.video.edit_cate" text="编辑视频分类"/></p>
   		</c:if>
   </div>
   <div class="right_body" style="padding:0;">
      <div class="infoBox">
        <h4 class="faqTit">
        	<span class="title_basicIcon" style="background-image:none;padding-left:0;"><div class="position_inline_block"></div><smartTag:message code="backend.agent.base_info" text="基本信息"/></span>
        </h4>
      </div>
      <table border="0" cellpadding="0" cellspacing="0" class="tabCom">
        <tr>
          <th><span class="red">*</span><smartTag:message code="backend.video.cate_name" text="视频分类名称"/></th>
          <td>
          	<input type="text" name="groupName" id="groupName" value="<c:out value="${command.groupName}"/>" maxlength="80"/>
          	<div id="notice_groupName" class="wrong" style="display:none"></div>
          </td>
        </tr>
		  <smartTag:planJsonAssert key="noCustomUrl" value="1" print="0">
		<tr>
          <th><smartTag:message code="backend.article.cateurl" text="分类URL"/></th>
          <td>
			<div class="cateUrlSwitch-wrap fix">
				<label class="cateUrlSwitch <c:if test="${null == cateUrl || '' == cateUrl}">on</c:if>" id="defaultUrl">
					<em>&nbsp;&nbsp;</em> <span><smartTag:message code="backend.article.defaulturl" text="系统URL"/></span>
				</label>
				<label class="cateUrlSwitch <c:if test="${null != cateUrl && '' != cateUrl}">on</c:if>" id="customUrl">
					<em>&nbsp;&nbsp;</em> <span><smartTag:message code="backend.article.customurl" text="自定义URL"/></span>
				</label>
				<div class="customContent <c:if test="${null == cateUrl || '' == cateUrl}">hide</c:if>" id="customContent">
					<input type="text" name="cateUrl" id="cateUrl" maxlength="150" placeholder="<smartTag:message code="backend.article.urltip" text="请输入URL"/>" value="<c:out value="${cateUrl}"/>"  />
					<div id="notice_cateUrl" class="wrong" style="display:none"></div>
			    </div>
			</div>
			<div class="customContent tip <c:if test="${null == cateUrl || '' == cateUrl}">hide</c:if>">
				- <smartTag:message code="backend.page.set.url.tip" text="URL必须以/开头，以.html结尾，例如：/about-us.html"/><br />
				- <smartTag:message code="backend.article.conflict_url_lan.tip" text="请勿使用以/+语种开头结构的URL，跟系统分目录小语种形式URL冲突，例如：/en/xxxx.html"/><br />
				- <smartTag:message code="backend.article.illegal_character.tip" text="URL中不支持%字符，%作为转义字符，会导致页面URL解析错误"/> <br />
		 	</div>
          </td>
        </tr>
		  </smartTag:planJsonAssert>
        <tr>
             <th>
               <div id="selectSite" class="pop2tit"><span class="red">*</span><smartTag:message code="backend.video.select_cate_position" text="选择视频分类位置"/></div>
             </th>
			 <td>
				<div class="cen" style="margin-top:0; ">
				    <span id="groupLevelErrorInfo"></span>
				 	<div id="treeboxbox_tree_pop" class="treeboxbox_tree" style="padding-top:5px;float:left">
				 	</div>
			 	</div>
			 	<div class="clr"></div>
			 	<div id = "notice_selectParentGroup" class="wrong" style="display:none"></div>
			 	<input type="hidden" name="strParentCategory" id="strParentCategory"/>
			 </td>
        </tr>
		  <tr>
			  <th><smartTag:message code="backend.video.cate.desc" text="视频分类描述"/></th>
			  <td class="prodCateWebEditor">
				  <textarea name="groupDescription" id="web_editor" style="width: 860px; height: 500px;"><c:out value="${command.groupDescription}"/></textarea>
				  <div id = "notice_text.groupDescription" class="wrong" style="display:none"></div>
			  </td>
		  </tr>
      </table>
	</div>



	<div class="right_body createNewPage" style='margin-top:0;padding:0;'>
      <div class="infoBox">
        <h4 class="faqTit">
        	<span class="title_basicIcon" style="margin-top:0;background-image:none;padding-left:0;"><div class="position_inline_block"></div><smartTag:message code="backend.article.relatePage_title" text="指向页面"/></span>
        </h4>
      </div>
      <div  class="pageSettingField">
		<span class="create_title"><smartTag:message code="backend.article.catePage_colon" text="设置分类指向页面："/></span>
		<div class="settings-link-select settings-choosearticleselect-outer tcan-selected mt5 pageSelect" value="${catePage}">
			<input type="hidden" class="pageNew" name="catePageNew" value="">
			<input type="hidden" class="pageId" name="catePageId" value="${catePage}">
			<div class="clickBind w340 fix">
				<span class="color333 fll" role="this-selected" id="selectSomeArticleCategory"><smartTag:message code="backend.article.nochange" text="保持原设置"/></span>
				<i class="fa fa-caret-down font16 flr" style="margin-top:4px;"></i>
			</div>
			<div class="settings-link-all settings-choosepage-all settings-choosepage-all-create hide" style="display: none;">
				<ul>
					<li><a value="-1" href="javascript:;" class=""><smartTag:message code="backend.article.usedefault" text="使用系统默认"/></a></li>
					<c:forEach items="${pageList}" var="page">
						<c:if test="${page.pageUrl != ''}">
							<li><a name="${page.pageTitle}" value="${page.encodePkId}" href="javascript:;" class="">${page.pageTitle}</a></li>
						</c:if>
					</c:forEach>
				</ul>
			</div>
		</div>
		<span><a href="javascript:;" class="addPage"><i class="-icon fa fa-plus"></i><smartTag:message code="backend.article.newpage" text="新建页面"/></a></span>
		<span><a href="javascript:;" class="cancelPage hide"><i class="-icon fa fa-times"></i><smartTag:message code="backend.common.cancel" text="取消"/></a></span>

		<div class="addNewPage hide" style="width:500px;">
			<div class="block">
				<span class="warning"><smartTag:message code="backend.article.pagetip" text="新建的页面需要在网站发布后才可访问"/></span>
				<a href="javaScript:;" class="btn" onClick="$(this).parent().hide();"><smartTag:message code="backend.article.confirm" text="我知道了"/></a>
			</div>
			<input type="hidden" name="catePage.seoTitle" class="seoTitle">
			<input type="hidden" name="catePage.seoKeyword" class="seoKeyword">
			<input type="hidden" name="catePage.seoDesc" class="seoDesc">
			<input type="hidden" name="catePage.encodeTemplateId" class="templateId">
			<label class="create_box">
				<span><smartTag:message code="backend.article.pagename" text="页面名称"/></span>
				<input type="text" name="catePage.pageTitle" class="pageTitle">
				<div class="error" id="notice_title_0"></div>
			</label>
			<label class="create_box">
				<span><smartTag:message code="backend.article.pageurl" text="页面URL"/></span>
				<input type="text" name="catePage.pageUrl" class="pageUrl marginMore">
				<div class="error" id="notice_url_0"></div>
			</label>
			<div class="pagePreview">
				<img class="pagePreview_img" src="/assets/images/blank_page.png"/>
			</div>
			<a href="javascript:;" class="selectPageTemplate" action="phoenix_page_template" pageType="cate"><smartTag:message code="backend.article.pagetemplate" text="选择页面模板"/><i class="-icon fa fa-chevron-right"></i></a>
		</div>
	</div>
	<div  class="pageSettingField">
		<span class="create_title" style="margin-top:20px;"><smartTag:message code="backend.article.detailPage_colon" text="设置文章详情指向页面："/></span>
		<div class="settings-link-select settings-choosearticleselect-outer tcan-selected mt5 pageSelect" value="${detailPage}">
			<input type="hidden" class="pageNew" name="detailPageNew" value="">
			<input type="hidden" class="pageId" name="detailPageId" value="${detailPage}">
			<div class="clickBind w340 fix">
				<span class="color333 fll" role="this-selected" id="selectSomeArticleCategory"><smartTag:message code="backend.article.nochange" text="保持原设置"/></span>
				<i class="fa fa-caret-down font16 flr" style="margin-top:4px;"></i>
			</div>
			<div class="settings-link-all settings-choosepage-all settings-choosepage-all-create hide" style="display: none;">
				<ul>
					<li><a value="-1" href="javascript:;" class=""><smartTag:message code="backend.article.usedefault" text="使用系统默认"/></a></li>
					<c:forEach items="${pageList}" var="page">
						<c:if test="${page.pageUrl != ''}">
							<li><a value="${page.encodePkId}" href="javascript:;" class="">${page.pageTitle}</a></li>
						</c:if>
					</c:forEach>
				</ul>
			</div>
		</div>
		<span><a href="javascript:;" class="addPage"><i class="-icon fa fa-plus"></i><smartTag:message code="backend.article.newpage" text="新建页面"/></a></span>
		<span><a href="javascript:;" class="cancelPage hide"><i class="-icon fa fa-times"></i><smartTag:message code="backend.common.cancel" text="取消"/></a></span>

		<div class="addNewPage hide" style="width:500px;">
			<div class="block">
				<span class="warning"><smartTag:message code="backend.article.pagetip" text="新建的页面需要在网站发布后才可访问"/></span>
				<a href="javaScript:;" class="btn" onClick="$(this).parent().hide();"><smartTag:message code="backend.article.confirm" text="我知道了"/></a>
			</div>
			<input type="hidden" name="detailPage.seoTitle" class="seoTitle">
			<input type="hidden" name="detailPage.seoKeyword" class="seoKeyword">
			<input type="hidden" name="detailPage.seoDesc" class="seoDesc">
			<input type="hidden" name="detailPage.encodeTemplateId" class="templateId">
			<label class="create_box">
				<span><smartTag:message code="backend.article.pagename" text="页面名称"/></span>
				<input type="text" name="detailPage.pageTitle" class="pageTitle">
				<div class="error" id="notice_title_1"></div>
			</label>
			<label class="create_box">
				<span><smartTag:message code="backend.article.pageurl" text="页面URL"/></span>
				<input type="text" name="detailPage.pageUrl" class="pageUrl marginMore">
				<div class="error" id="notice_url_1"></div>
			</label>
			<div class="pagePreview">
				<img class="pagePreview_img" src="/assets/images/blank_page.png"/>
			</div>
			<a href="javascript:;" class="selectPageTemplate" action="phoenix_page_template" pageType="detail"><smartTag:message code="backend.article.pagetemplate" text="选择页面模板"/><i class="-icon fa fa-chevron-right"></i></a>
		</div>
	</div>
	<div class="error" id="errorMsg"></div>
</div>

	<div class="right_body" style='margin-top:0;padding:0;'>
		<div class="infoBox">
	        <h4 class="faqTit">
		        <span class="title_seoIcon" style="background-image:none;padding-left:0;"><div class="position_inline_block"></div><smartTag:message code="backend.prod.edit.title.seo" text="搜索引擎优化"/></span>
		    </h4>
	    </div>
	    <table id="articleSeo" border="0" cellpadding="0" cellspacing="0" class="tabCom seo">
	          <tr>
	            <th><span class="en">Title</span><span class="tip"><smartTag:message code="backend.article.seo_title" text="页面标题"/></span></th>
	            <td>
	                <input type="text" id="seoTitle" name="seoTitle" class="en" maxlength="400" value="<c:out value="${command.seoTitle}"/>"/>
	                <div style="display:inline;" id="setDefaultSeo"><img title="<smartTag:message code="backend.article.back_default_set" text="恢复默认设置"/>" src="/images/playback_reload.png" /></div>
	                <div id="notice_seoTitle" class="wrong" style="display: none;"></div>
	            </td>
	          </tr>
	          <tr>
	            <th><span class="en">Keywords</span><span class="tip"><smartTag:message code="backend.article.seo_keywords" text="页面关键词"/></span></th>
	            <td>
	               <textarea id="seoKeywords" name="seoKeywords"><c:out value="${command.seoKeywords}"/></textarea>
	               <div id="notice_seoKeywords" class="wrong" style="display: none;"></div>
	            </td>
	          </tr>

	          <tr>
	            <th><span class="en">Description</span> <span class="tip"><smartTag:message code="backend.article.seo_desc" text="页面描述"/></span></th>
	            <td>
	            	<textarea id="seoDescription" name="seoDescription"><c:out value="${command.seoDescription}"/></textarea>
	                <div id="notice_seoDescription" class="wrong" style="display: none;"></div>
	            </td>
	          </tr>
        </table>
	</div>
	<div class="topBts topBts_menu" style="bottom:0;top:auto;">
        <a class="topBts_menu_save" href="javascript:void(0)" action="video_group_save" flag="list"><smartTag:message code="backend.common.save" text="保存"/></a>
	 	<a class="topBts_menu_default" href="javascript:void(0)" action="video_group_save" flag="new"><smartTag:message code="backend.common.save_and_new" text="保存并新建"/></a>
	 	<a style="margin-right:20px;" class="topBts_menu_default fr" href="javascript:void(0)" action="video_category_list"><smartTag:message code="backend.common.cancel" text="取消"/></a>
    </div>
</div>

<input type="hidden" id="seoTemplateTitle" value="<c:out value="${seoTemplateTitle}"/>" />
<input type="hidden" id="seoTemplateKeywords" value="<c:out value="${seoTemplateKeywords}"/>" />
<input type="hidden" id="seoTemplateDescription" value="<c:out value="${seoTemplateDescription}"/>" />
<input type="hidden" id="siteTitle" value="<c:out value="${siteTitle}"/>" />
<input type="hidden" id="sourceVideoGroupTitle" value="${sourceVideoGroupTitle}" />
<input type="hidden" id="sourceSeoTitle" value="${sourceSeoTitle}" />
<input type="hidden" id="sourceSeoKeywords" value="${sourceSeoKeywords}" />
<input type="hidden" id="sourceSeoDescription" value="${sourceSeoDescription}" />
<input type="hidden" id="isAddSameProd" value="${isAddSameProd}" />
<script type="text/javascript">
	jQuery(function() {
		$('#groupName').unbind("blur").bind("blur", function(){
			if($.trim($('#seoTitle').val()) == ''){
				setVideoGroupSeoFromTemplate();
			}
		});
		$('#setDefaultSeo').unbind('click').bind('click', function(){
			setVideoGroupSeoFromTemplate();
		});
		loadEditor();
	});
</script>
<script type="text/javascript">
	//百度编辑器全屏在Firefox下的兼容处理
	if (navigator.userAgent.indexOf("Firefox") != -1) {
		UE.getEditor('service_editor').on('fullscreenchanged',function(event,isFullScreen){
			var editor = $("#web_editor");
			if (editor.hasClass("fullscreen")) {
				editor.removeClass("fullscreen");
				editor.children().css({
					"position": "static"
				});
			} else {
				editor.addClass("fullscreen");
				editor.children().css({
					"position": "fixed",
					"top": 0,
					"left": 0
				});
			}
		});
	}
</script>
<script>	
	var olang = p_i18n.getOpeLang();
	if (olang == "EN_US") {
		$(".pagePreview_img").attr("src", "/assets/images/blank_page_en.png");
	} else if (olang == "ZH_TW") {
		$(".pagePreview_img").attr("src", "/assets/images/blank_page_tw.png");
	}
</script>