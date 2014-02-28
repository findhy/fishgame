<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title></title>
<script type="text/javascript">
$(document).ready(function(){
	var channelMappingFormAdd = $("#channelMappingFormAdd").validate(
	{
		rules:{
			'param.channelId':{
				required : true,
				maxlength:10
			},
			'param.channelName':{
				required : true,
				maxlength:100
			}
		},
		submitHandler:function(){
			$.post(getBasePath()+"/channelMapping/add",$("#channelMappingFormAdd").serialize(),function(result){
				
					alertShow("新增渠道完成",function(){
						 location=location;
					});
				
			});
		}
		});

	var channelMappingFormEdit = $("#channelMappingFormEdit").validate(
			{
				rules:{
					'param.channelId':{
						required : true,
						maxlength:10
					},
					'param.channelName':{
						required : true,
						maxlength:100
					}
				},
				submitHandler:function(){
					$.post(getBasePath()+"/channelMapping/edit",$("#channelMappingFormEdit").serialize(),function(result){
						
							alertShow("修改渠道完成",function(){
								 location=location;
							});
						
					});
				}
				});
});

function channelMappingEdit(){
	var checkedId = $("input[name=checkName_single]:checked").val();
	if (checkedId != null && checkedId != "") {
		$("#channelIdEdit").val($("input[name=checkName_single]:checked").attr("channelId"));
		$("#channelIdEdit").attr("readonly",true);
		$("#channelNameEdit").val($("input[name=checkName_single]:checked").attr("channelName"));
		openDialog('channelMappingShadowEdit','channelMappingDialogEdit');
	} else {
		alertShow("您好，请选择要修改的渠道信息");
	}
}

function channelMappingDelete(){
	var checkedId = $("input[name=checkName_single]:checked").val();
	if (checkedId != null && checkedId != "") {
		confirmShow("确定是否要删除渠道信息",function(){
			$.post(getBasePath()+"/channelMapping/delete",{'param.channelId':checkedId},function(result){
				
				alertShow("删除渠道完成",function(){
					 location=location;
				});
		    });
		});
	} else {
		alertShow("您好，请选择要删除的渠道信息");
	}
}
</script>
</head>
<body class="autoWidth_m">
<form action="${path}/channelMapping" id="channelMappingForm" method="post">
<div class="fieledsetWrap margin_l_r10">
	<!-- 查询条件 -->	
</div>

<div class="combination margin_l_r10" style="width:auto;height:auto">
	<div class="title2"><span class="toggle_hide">渠道映射</span></div>
	<div class="toolbar">
	     <a href="#" title="新增" onclick="openDialog('channelMappingShadow','channelMappingDialog')">
	       <img src="${path}/static/images/add.gif" />新增
	     </a>
	     <a href="#" title="修改" onclick="channelMappingEdit()">
	       <img src="${path}/static/images/edit.gif" />修改
	     </a>
	     <a href="#" title="删除" onclick="channelMappingDelete()">
	       <img src="${path}/static/images/delete.gif" />删除
	     </a>
	</div>
	<!-- 数据列表singleSelected='singleSelected'  -->	
	<div id="tableDiv" style="width:100%">
	<table width="100%" border="0" cellspacing="0" cellpadding="0" singleSelected='singleSelected'>
		<thead>
			<tr>
			    <th width="2%"><input type="checkbox" /></th>
				<th width="45%">渠道号</th>
				<th width="45%">渠道名称</th>
			</tr>	
		</thead>
		 
		<tbody>
			<c:forEach items="${page.list}" var="list">
			   <tr>
			      <td><input name="checkName_single" type="checkbox" value="${list.channelId}" channelId="${list.channelId}" channelName="${list.channelName}"/></td>
			   	  <td><c:out value="${list.channelId}"/></td>
			   	  <td><c:out value="${list.channelName}"/></td>
			   </tr>
			</c:forEach>
		</tbody>
	</table>
	<div class="pages">
	   <jsp:include page="../common/paging.jsp" flush = "true">
	   		<jsp:param name="url" value="/channelMapping"/>
    		<jsp:param name="searchFormId" value="channelMappingForm" />
	   </jsp:include>
	</div>
	</div>
</div>	
</form>

<!-- 添加渠道 -->
<div class="shadow" id="channelMappingShadow"></div>
<form id="channelMappingFormAdd" action="${path}/channelMapping/add" method="post" >
<div class="aialog w_800px"  id="channelMappingDialog">
	<div class="aialog_box">
		<div class="aialog_title">
			<div class="close_dialog"
				onclick="closeDialog('channelMappingShadow','channelMappingDialog')"></div>
			<font id="text">添加渠道</font>
		</div>
		<div class="aialog_cont">
			<div class="yanzheng">
				<div class="wenzi">渠道ID：</div>
				<div class="shuru">
						<input  name="param.channelId" class="inp_text" />
				</div>
				<div class="wenzi">渠道名称：</div>
				<div class="shuru">
						<input name="param.channelName" class="inp_text" />
				</div>
			</div>
		</div>
		<div class="aialog_tool">
			<input type="submit" class="inp_btn" value="提交"/>
			<input type="button" class="inp_btn" value="取消" onclick="closeDialog('channelMappingShadow','channelMappingDialog')" />
		</div>
	</div>
</div>
</form>


<!-- 修改渠道 -->
<div class="shadow" id="channelMappingShadowEdit"></div>
<form id="channelMappingFormEdit" action="${path}/channelMapping/edit" method="post" >
<div class="aialog w_800px"  id="channelMappingDialogEdit">
	<div class="aialog_box">
		<div class="aialog_title">
			<div class="close_dialog"
				onclick="closeDialog('channelMappingShadowEdit','channelMappingDialogEdit')"></div>
			<font id="text">修改渠道</font>
		</div>
		<div class="aialog_cont">
			<div class="yanzheng">
				<div class="wenzi">渠道ID：</div>
				<div class="shuru">
						<input  name="param.channelId" id="channelIdEdit" class="inp_text" />
				</div>
				<div class="wenzi">渠道名称：</div>
				<div class="shuru">
						<input name="param.channelName" id="channelNameEdit" class="inp_text" />
				</div>
			</div>
		</div>
		<div class="aialog_tool">
			<input type="submit" class="inp_btn" value="提交"/>
			<input type="button" class="inp_btn" value="取消" onclick="closeDialog('channelMappingShadowEdit','channelMappingDialogEdit')" />
		</div>
	</div>
</div>
</form>
<script type="text/javascript">
//设置select选项
$("select[name='param.product']").val('${page.param.product}');
$("input[name='param.beginDate']").val('${page.param.beginDate}');
$("input[name='param.endDate']").val('${page.param.endDate}');
$("select[name='param.platform']").val('${page.param.platform}');
</script>


</body>
</html>
