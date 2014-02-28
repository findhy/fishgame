<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script language="javascript" src="${ctx }/static/js/jquery-1.10.2.js"></script>
<link href="${ctx }/static/css/all.css" rel="stylesheet" type="text/css" />
<title>按钮</title>
</head>
<script type="text/javascript">
		$(document).ready(function(){
			$("#prod").hide("flot");
			$("#prod").hover(function(){
				$(this).show();
			},function(){
				$(this).hide();
			});
		});
    function hh(){            alert()
    window.open('fesco_toolbar.html','newwindow','height=500,width=600,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no')
 
    }
 
		function menu_listShow(){
			$("ul.menu_list").show();
		}
</script>
<body class="autoWidth">
<div class="toolbar">
	<a href="#" title="查询"><img onclick="hh()"  src="${ctx }/static/images/search.gif" />查询</a>
	<a href="#" title="添加信息"><img src="${ctx }/static/images/add.gif" />添加</a>
    <a href="#" title="删除信息"><img src="${ctx }/static/images/delete.gif" />删除</a>
    <a href="#" title="修改信息"><img src="${ctx }/static/images/edit.gif" />修改</a>
    <a href="#" title="查看信息"><img src="${ctx }/static/images/info.gif" />查看</a>
    <a href="#" title="上传文件"><img src="${ctx }/static/images/arrow_up.gif"/>上传</a>
    <a href="#" title="下载文件"><img src="${ctx }/static/images/arrow_down.gif" />下载</a>
    <a href="#" title="导入文件"><img src="${ctx }/static/images/application.gif" />导入</a>
    <a href="#" title="导出文件"><img src="${ctx }/static/images/application_side_expand.png" />导出</a>
    <a href="#" title="审批通过"><img src="${ctx }/static/images/accept.png" />审批通过</a>
    <a href="#" title="审批不通过"><img src="${ctx }/static/images/cancel.png" />审批不通过</a>

    
    <br/><br/><br/>
     <div class=" toolbar" style="padding-left:0">
     	<div title="导入文件" class="menu_toolbar" onclick="menu_listShow()">
    	<img src="${ctx }/static/images/user.png" />管理<b class="open" style="float:none;"></b>
    	<ul id="prod" class="menu_list" style="width:100px;display:none;">
        	<li><a href="#"><img src="${ctx }/static/images/application.gif" />导入excel</a></li>
            <li><a href="#"><img src="${ctx }/static/images/application.gif" />导入josn</a></li>
            <li><a href="#"><img src="${ctx }/static/images/application.gif" />导入xml</a></li>
            <li class="li_hover has_sub"><a href="#"><img src="${ctx }/static/images/application.gif" />其它</a>
            	<ul style="width:100px">
                	<li><a href="#"><img src="${ctx }/static/images/application.gif" />txt文件</a></li>
                    <li class="li_hover"><a href="#"><img src="${ctx }/static/images/application.gif"/>word文件</a></li>
                </ul>
            </li>
        </ul>
    </div>
	    <a href="#" title="返回"><img src="${ctx }/static/images/arrow_undo.png" />返回</a>
	    <a href="#" title="配置"><img src="${ctx }/static/images/plugin_go.png" />配置</a>
	    <a href="#" title="打印"><img src="${ctx }/static/images/print.gif" />打印</a>
	    <a href="#" title="刷新"><img src="${ctx }/static/images/refresh.gif" />刷新</a>
	    <a href="#" title="保存"><img src="${ctx }/static/images/table_save.png" />保存</a>
	    <a href="#" title="批量"><img src="${ctx }/static/images/application_cascade.png" />批量</a>
	    <a href="#" title="取消"><img src="${ctx }/static/images/cross.png" />取消</a>
        <a href="#" title="撤销"><img src="${ctx }/static/images/arrow_rotate_clockwise.png" />撤销</a>
        <a href="#" title="申请"><img src="${ctx }/static/images/application_go.png" />申请</a>
        <a href="#" title="提交"><img src="${ctx }/static/images/application_get.png" />提交</a>
        <a href="#" title="创建"><img src="${ctx }/static/images/application_add.png" />创建</a>
        <a href="#" title="处理"><img src="${ctx }/static/images/wrench.png" />处理</a>
        <a href="#" title="打开"><img src="${ctx }/static/images/folder_Open.png" />打开</a>
        <a href="#" title="更换"><img src="${ctx }/static/images/arrow_switch.png" />更换</a>
        <a href="#" title="回复"><img src="${ctx }/static/images/comment_edit.png" />回复</a>
    
      </div>
</div>
</body>
</html>
