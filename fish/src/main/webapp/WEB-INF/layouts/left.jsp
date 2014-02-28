<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>left page</title>

<style>
html,body {
	height: 100%
}

.left_bg {
	background: #cfdeef url(${path}/static/images/left_bg.gif) repeat-y
		right 0;
	position: absolute;
	top: 0;
	left: 0;
	min-height: 100%;
	height: auto;
}
</style>



<script type="text/javascript">
	//菜单树
	var oftenFun;
	var zTree;
	var demoIframe;

	var treeArray = [];

	/*
	var setting = {
		isSimpleData : true,
		treeNodeKey : "id",
		treeNodeParentKey : "parentId",
		showLine : true,
		showsName : "name",
		root : {
			isRoot : true,
			nodes : []
		},
		callback : {
			//beforeClick:beforeClick,
			click : setBread,
			nodeCreated : nodeCreated,
			beforeClick:mainWaitWin
		}
	};
	*/


	var setting = {
			
		data : {
			simpleData: {
				enable: true,
				idKey:"id",
				pIdKey:"parentId"
			},
			key : {
				name :"name"
			}
		},
		callback : {
			onClick:setBread,
			onNodeCreated :nodeCreated
			//beforeClick:mainWaitWin
		}
};
	//设置tab标签
	function setBread(event, treeId, treeNode) {

		if (treeNode.isParent) {

		} else {

			var urls = treeNode.url;

			textArray = [];
			var breadText = "首页 "
			breadText = breadText + " > ";//+left_fir_text;
			//$("#backToMainFrameForm").attr("action",urls);
			textArray.push(treeNode.name);
			//getParentText(treeNode.pId);
			for ( var i = textArray.length - 1; i >= 0; i--) {
				breadText = breadText + " > " + textArray[i]
			}
			top.mainFrame.location.href = urls;
		}

	}
	
	function mainWaitWin(treeId, treeNode, clickFlag){
		
		if(!treeNode.isParent)
			top.mainFrame.openWaitWin();
		
	}

	function nodeCreated(event, treeId, treeNode) {
		$("#" + treeNode.tId + "_a").removeAttr("href");
		$("#" + treeNode.tId).attr("showName", treeNode.name).attr(
				"functionId", treeNode.id);
	}

	$(function() {
		$("h3")
				.click(
						function() {

							if ($(this).next(".accord_content").css("display") != "none") {
								$(this).next(".accord_content").css('display',
										'none');
								$(this).children('.accord_hide').removeClass(
										'accord_hide').addClass('accord_open');
								return false;
							}

							//alert(0);
							$(this).children(".accord_open").removeClass(
									"accord_open").addClass("accord_hide");

							$.each($(".accord_content"), function(index, obj) {
								//alert(index);
								if ($(obj).css("display") != "none") {
									//alert("hide");
									$(obj).css("display", "none");
									$(obj).prev("h3").children(".accord_hide")
											.removeClass("accord_hide")
											.addClass("accord_open");
								}
							});
							$(this).next().css("display", "block");
						});

		//$("#accord").accord({accordHeight:true});
		//setting.expandSpeed = ($.browser.msie && parseInt($.browser.version) <= 6) ? ""
		//		: "fast";
		//$("ul[id]")获取所有有id的ul控件  ul[id*='tree']是获取ul的id包含tree的控件
		$("ul[class='ztree']").each(function(j) {
			//alertShow($(this).attr("value"));//获取当前对象属性为“value”的值
			var functionId = $(this).attr("value");
			var fun = $(this);
			var jsonArray = [];
			$.ajax({
				//${pageContext.request.contextPath}是获取项目根路径
				url : "${path}/static/data/ztree"+${user.userType}+".json",
				type : "POST",
				dataType : "json",
				data : 'functionId=' + functionId,
				success : function(data) {

//					treeArray.push(fun.zTree(setting, data));
					treeArray.push($.fn.zTree.init(fun, setting, data));
					
					//设置accord
					//configAccord();
				},
				error : function() {
				}
			});
		});

	});
</script>
</head>

<body>

	<body class="left_bg">
		<div class="accord">
			<div class="global_module ">
				<h3>
					<div class="padding_left5">数据查询</div>
					<div class="accord_hide"></div>
				</h3>
				<div class="accord_content" style="display:block">
					<ul class="ztree" value="1">

					</ul>
				</div>
			</div>
	</body>
</html>
