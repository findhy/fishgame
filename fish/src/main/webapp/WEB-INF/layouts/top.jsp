<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>top page</title>
<script type="text/javascript">

//设置tab标签
function setTheTab(url,name,breadText){
	$("#tabsList1").removeClass("tabListHidden");
	$("#tabsList1").addClass("selected");
	$("#myMainFrameTabId").attr("title",breadText);
	$("#myMainFrameTabId").attr("href",url);
	$("#myMainFrameTabId").html(name);
	$("#myDeskTop").attr("class","");
}
</script>
</head>
<body>
<div class="header">
		<h1 class="system_title">天天爱钓鱼数据查询后台</h1>
		<input name="" type="button" value="退 出" class="quit" onclick="javascript:parent.parent.location.href='${path}/logout'"/>
		<p class="info_bar">欢迎登录系统! </p>
</div>
<div class="head_bottom">
		<div class="left_switch"> 
				系统功能导航
		<div class="hide_left"></div>
		</div>
		<p class="bread_crumbs"> <b>个人工作台</b></p>
</div>
</body>
</html>
