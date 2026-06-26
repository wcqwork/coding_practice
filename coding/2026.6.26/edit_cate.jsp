<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/import.jsp"%>
<form id="editForm" name="editForm" action="/download/cate/edit" method="post" target="coreIframe">
<smartTag:formToken formType="downloadcate"/>
<input type="hidden" name="cateId" value="${param.cateId}"/>
<input type="hidden" name="xcase" id="xcase" value="cateEdit"/>
<%-- <div class="topBts">
	 <a href="javascript:void(0)" action="download_cate_save" flag="list"><smartTag:message code="backend.common.save" text="保存"/></a>
	 <a href="javascript:void(0)" action="download_cate_save" flag="new"><smartTag:message code="backend.common.save_and_new" text="保存并新建"/></a>
	 <a href="javascript:void(0)" action="download_cate_list"><smartTag:message code="backend.common.cancel" text="取消"/></a>
</div>--%>
<div class="top-title">
   <p><smartTag:message code="backend.download.add_cate" text="添加下载分类"/></p>
</div>
<div id="conBox">
   <%@ include file="/common/okmessage.jsp" %>
   <div class="right_body">
      <div class="infoBox">
        <h4 class="faqTit"><div class="close">&nbsp;</div>
        	<span class="title_basicIcon"><smartTag:message code="backend.download.base_info" text="基本信息"/></span>
        </h4>
      </div>
      <table border="0" cellpadding="0" cellspacing="0" class="tabCom">
        <tr>
          <th><span class="red">*</span><smartTag:message code="backend.download.cate_name" text="分类名称"/></th>
          <td>
          	<input type="text" id="cateName" name="cate.cateName" value="<c:out value="${cate.cateName}"/>" maxlength="80"/>
          	<div id="notice_cate.cateName" class="wrong" style="display:none"></div>
          </td>
        </tr>
        <tr>
             <th>
               <div id="selectSite" class="pop2tit"><span class="red">*</span><smartTag:message code="backend.download.select_file_cate_position" text="选择文件分类位置"/></div>
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
         	<th><smartTag:message code="backend.download.cate_desc" text="分类描述"/></th>
         	<td>
				<textarea name="cate.groupDescription" id="groupDescription"><c:out value="${cate.groupDescription}"/></textarea>
				<div class="tip">
		       	- <smartTag:message code="backend.download.cate_desc_tip" text="最多输入 20000 字符"/>
		       	</div><br />
				<div id = "notice_cate.groupDescription" class="wrong" style="display:none"></div>
         	</td>
         </tr>
         <c:if test="${'yes' eq usermodFlag}">
		     <tr>
	          	<th><smartTag:message code="backend.download.cate_access_controller" text="分类下文件的访问控制"/></th>
	          	<td>
	          		<select name="cate.accessAuth" id="cate_accessAuth">
	          			<option value="0" <c:if test="${cate.accessAuth == '0'}">selected="selected"</c:if>><smartTag:message code="backend.download.public" text="公开"/></option>
	          			<option value="-3" <c:if test="${cate.accessAuth == '-3'}">selected="selected"</c:if>><smartTag:message code="backend.download.form_fill" text="填写表单"/></option>
	          			<option accessPassword="true" value="-2" <c:if test="${cate.accessAuth == '-2'}">selected="selected"</c:if>><smartTag:message code="backend.download.set_cate_access_password" text="设置密码访问"/></option>
	          			<option value="-1" <c:if test="${cate.accessAuth == '-1'}">selected="selected"</c:if>><smartTag:message code="backend.download.member_can_download" text="仅会员可下载"/></option>
	          			<c:if test="${not empty levels}">
	          				<c:forEach items="${levels}" var="level">
	          					<option value="${level.encodePkId}" <c:if test="${cate.accessAuth == level.encodePkId}">selected="selected"</c:if>><c:out value="${level.userLevelName}"/></option>	
	          				</c:forEach>
	          			</c:if>
	          		</select>
	          		<div id="notice_cate.accessAuth" class="wrong" style="display:none"></div>
	          	</td>
		     </tr>
	        <tr id="accessPasswordTipTr" <c:if test="${cate.accessAuth != '-2'}">class="hide"</c:if>>
	         	<th><smartTag:message code="backend.download.get_password_tip" text="获取密码提示文字"/></th>
	         	<td>
					<textarea name="cate.passwordTip" id="passwordTip" maxlength="200"><c:out value="${cate.passwordTip}"/></textarea>
					<div class="tip">
			       	- <smartTag:message code="backend.download.get_password_tip_tip" text="最多输入 200 字符"/>
			       	</div><br />
					<div id = "notice_cate.passwordTip" class="wrong" style="display:none"></div>
	         	</td>
	         </tr>		     
		     <tr id="accessPasswordTr" <c:if test="${cate.accessAuth != '-2'}">class="hide"</c:if>>
	          	<th><smartTag:message code="backend.download.cate_access_password" text="访问密码"/></th>
				<td>
					<input type="text" id="accessPassword" name="accessPassword" value="<c:out value="${accessPassword}"/>" maxlength="20" autocomplete="off"/>
					<div class="tip"><smartTag:message code="backend.download.cate_access_password_tip" text="6～20位英文字母或数字"/></div>			
					<div id="notice_accessPassword" class="wrong" style="display:none"></div>
				</td>
		     </tr>	     
		     <tr id="selectedForm" <c:if test="${cate.accessAuth != '-3'}">class="hide"</c:if>>
	          	<th><smartTag:message code="backend.download.select_form" text="选择表单"/></th>
				<td>
					<select name="formId" id="cate_selectedForm">
						<c:forEach items="${allForms}" var="form">
						<option value="${form.encodePkId}" <c:if test="${cate.formId == form.formId}">selected="selected"</c:if>><c:out value="${form.formName}"/></option>	
						</c:forEach>
	          		</select>
	          		<div id="notice_selectedForm" class="wrong" style="display:none"></div>
				</td>
		     </tr>			     
	     </c:if>
      </table>
	</div>
      <div class="right_body">
        <div class="infoBox">
          <h4 class="faqTit"><div class="close" onclick="toolgeDiv(this)">&nbsp;</div>
          	<span class="title_seoIcon"><smartTag:message code="backend.prod.edit.title.seo" text="搜索引擎优化"/></span>
          </h4>
        </div>
        <table border="0" cellpadding="0" cellspacing="0" class="tabCom seo" id = "tabCom seo">
          <tr>
            <th>Title<span class="tip"><smartTag:message code="backend.prod.cate.page.title" text="页面标题"/></span></th>
            <td>
            	<input type="text" name="seo.seoTitle" id="title" value="<c:out value='${seo.seoTitle}'/>"/>
            	<div style="display:inline;" id="setDefaultSeo"><img title='<smartTag:message code="backend.prod.edit.seo.restore" text="恢复默认设置"/>' src="/images/playback_reload.png" /></div>
            	<div id="notice_seo.seoTitle" class="wrong" style="display:none"></div>
            </td>
          </tr>
          <tr>
            <th>Keywords<span class="tip"><smartTag:message code="backend.prod.edit.seo.keyword" text="页面关键词"/></span></th>
            <td>
            	<input type="text" name="seo.seoKeyword" id="keywords" value="<c:out value='${seo.seoKeyword}'/>"/>
            	<div id="notice_seo.seoKeyword" class="wrong" style="display:none"></div>
            </td>
          </tr>
           <tr>
            <th>Description <span class="tip"><smartTag:message code="backend.prod.edit.seo.desc" text="页面描述"/></span></th>
            <td>
            	<textarea name="seo.seoDesc" id="description"><c:out value="${seo.seoDesc}"/></textarea>
            	<div id="notice_seo.seoDesc" class="wrong" style="display:none"></div>
            </td>
          </tr>
        </table>
      </div>
	<%--  设置分类指向页面  --%>
	<div class="right_body createNewPage" style='margin-top:0;padding:0;min-height:360px;'>
		<div class="infoBox">
			<h4 class="faqTit">
				<span class="title_basicIcon" style="margin-top:0;background-image:none;padding-left:0;"><div class="position_inline_block"></div><smartTag:message code="backend.article.relatePage_title" text="指向页面"/></span>
			</h4>
		</div>
		<div  class="pageSettingField">
			<span class="create_title"><smartTag:message code="backend.article.catePage_colon" text="设置分类指向页面："/></span>
			<div class="settings-link-select settings-choosearticleselect-outer tcan-selected mt5 pageSelect" value="<c:out value='${catePage}'/>">
				<input type="hidden" class="pageNew" name="catePageNew" value="">
				<input type="hidden" class="pageId" name="catePageId" value="<c:out value='${catePage}'/>">
				<div class="clickBind w340 fix">
					<span class="color333 fll" role="this-selected" id="selectSomeArticleCategory"><smartTag:message code="backend.article.nochange" text="保持原设置"/></span>
					<i class="fa fa-caret-down font16 flr" style="margin-top:4px;"></i>
				</div>
				<div class="settings-link-all settings-choosepage-all settings-choosepage-all-create manageProd hide" style="display: none;">
					<ul>
						<li><a value="-1" href="javascript:;" class=""><smartTag:message code="backend.article.usedefault" text="使用系统默认"/></a></li>
						<c:forEach items="${pageList}" var="page">
							<c:if test="${page.pageUrl != ''}">
								<li><a name="<c:out value='${page.pageTitle}'/>" value="${page.encodePkId}" href="javascript:;" class=""><c:out value="${page.pageTitle}"/></a></li>
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
	</div>
</div>
</form>
<%-- <div class="bts c">
	 <a href="javascript:void(0)" action="download_cate_save" flag="list"><smartTag:message code="backend.common.save" text="保存"/></a>
	 <a href="javascript:void(0)" action="download_cate_save" flag="new"><smartTag:message code="backend.common.save_and_new" text="保存并新建"/></a>
	 <a href="javascript:void(0)" action="download_cate_list"><smartTag:message code="backend.common.cancel" text="取消"/></a>
</div>--%>
<div class="topBts topBts_menu" style="bottom:0;top:auto;">
    <a class="topBts_menu_save" href="javascript:void(0)" action="download_cate_save" flag="list">
       	<smartTag:message code="backend.common.save" text="保存"/>
    </a>
    <a href="javascript:void(0)" action="download_cate_save" flag="new" style="background: rgb(244,246,249);border: 1px solid #ddd;"><smartTag:message code="backend.common.save_and_new" text="保存并新建"/></a>
    <a style="margin-right:20px;" class="topBts_menu_default fr" href="javascript:void(0)" action="download_cate_list">
        <smartTag:message code="backend.common.cancel" text="取消"/>
    </a>
</div>
<div class="clr"></div>
<input type="hidden" id="phoenixSeoTitle" value="${seoTitle}" />
<input type="hidden" id="phoenixSeoKeywords" value="${seoKeyword}" />
<input type="hidden" id="phoenixSeoDescription" value="${seoDescription}" />
<input type="hidden" id="siteTitle" value="${siteTitle}" />
<script type="text/javascript">
	$('#setDefaultSeo').hover(function(){
		$(this).children().attr('src', '/images/playback_reload1.png');
	},function(){
		$(this).children().attr('src', '/images/playback_reload.png');
	}
	);
	$('#cateName').unbind('blur').bind('blur', function(){
		if($('#title').val() == ''){
			setDownloadCateSeoFromTemplate();
		}
	});
	$('#setDefaultSeo').unbind('click').bind('click', function(){
		setDownloadCateSeoFromTemplate();
	});
	function bindAccessAuthSelect4CateEdit(){
	    $('#cate_accessAuth').unbind('change').bind('change', function(){
        	$('#accessPasswordTipTr').hide();
        	//$('#passwordTip').val('');
            $('#accessPasswordTr').hide();
            $('#selectedForm').hide();
	        if ($.trim($(this).val()) === '-2') {
	        	$('#accessPasswordTipTr').show();
	            $('#accessPasswordTr').show();
	        }
			if($.trim($(this).val()) === '-3'){
	        	$('#selectedForm').show();
	        }
	    })
	}
	var olang = p_i18n.getOpeLang();
	if (olang == "EN_US") {
		$(".pagePreview_img").attr("src", "/assets/images/blank_page_en.png");
	} else if (olang == "ZH_TW") {
		$(".pagePreview_img").attr("src", "/assets/images/blank_page_tw.png");
	}
</script>
