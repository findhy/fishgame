<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title></title>
<script type="text/javascript">
$(document).ready(function(){
	var userFormAdd = $("#userFormAdd").validate(
	{
		rules:{
			'userName':{
				required : true,
				maxlength:20
			},
			'password':{
				required : true,
				maxlength:100
			}
		},
		submitHandler:function(){
			$.post(getBasePath()+"/user/add",$("#userFormAdd").serialize(),function(result){
					alertShow("新增用户完成",function(){
						 location=location;
					});
			});
		}
		});

	var userFormEdit = $("#userFormEdit").validate(
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
					$.post(getBasePath()+"/user/edit",$("#userFormEdit").serialize(),function(result){
						
							alertShow("修改用户完成",function(){
								 location=location;
							});
						
					});
				}
				});
});

function userEdit(){
	var checkedId = $("input[name=checkName_single]:checked").val();
	if (checkedId != null && checkedId != "") {
		$("#userId").val(checkedId);
		$("#userName").val($("input[name=checkName_single]:checked").attr("userName"));
		$("#password").val($("input[name=checkName_single]:checked").attr("password"));
		$("#userType").val($("input[name=checkName_single]:checked").attr("userType"));
		openDialog('userShadowEdit','userDialogEdit');
	} else {
		alertShow("您好，请选择要修改的用户信息");
	}
}

function userDelete(){
	var checkedId = $("input[name=checkName_single]:checked").val();
	if (checkedId != null && checkedId != "") {
		confirmShow("确定是否要删除用户信息",function(){
			$.post(getBasePath()+"/user/delete",{'userId':checkedId},function(result){
				
				alertShow("删除用户完成",function(){
					 location=location;
				});
		    });
		});
	} else {
		alertShow("您好，请选择要删除的用户信息");
	}
}
</script>
</head>
<body class="autoWidth_m">
<form action="${path}/user" id="userForm" method="post">
<div class="fieledsetWrap margin_l_r10">
	<!-- 查询条件 -->	
</div>

<div class="combination margin_l_r10" style="width:auto;height:auto">
	<div class="title2"><span class="toggle_hide">用户映射</span></div>
	<div class="toolbar">
	     <a href="#" title="新增" onclick="openDialog('userShadow','userDialog')">
	       <img src="${path}/static/images/add.gif" />新增
	     </a>
	     <a href="#" title="修改" onclick="userEdit()">
	       <img src="${path}/static/images/edit.gif" />修改
	     </a>
	     <a href="#" title="删除" onclick="userDelete()">
	       <img src="${path}/static/images/delete.gif" />删除
	     </a>
	</div>
	<!-- 数据列表singleSelected='singleSelected'  -->	
	<div id="tableDiv" style="width:100%">
	<table width="100%" border="0" cellspacing="0" cellpadding="0" singleSelected='singleSelected'>
		<thead>
			<tr>
			    <th width="2%"><input type="checkbox" /></th>
				<th width="32%">登录名</th>
				<th width="32%">密码</th>
				<th width="32%">用户类型</th>
			</tr>	
		</thead>
		
		<tbody>
			<c:forEach items="${page.list}" var="list">
			   <tr>
			      <td><input name="checkName_single" type="checkbox" value="${list.userId}" userName="${list.userName}" userType="${list.userType}" password="${list.password}"/></td>
			   	  <td><c:out value="${list.userName}"/></td>
			   	  <td><c:out value="${list.password}"/></td>
			   	  <td><c:out value="${list.userTypeStr}"/></td>
			   </tr>
			</c:forEach>
		</tbody>
	</table>
	<div class="pages">
	   <jsp:include page="../common/paging.jsp" flush = "true">
	   		<jsp:param name="url" value="/user"/>
    		<jsp:param name="searchFormId" value="userForm" />
	   </jsp:include>
	</div>
	</div>
</div>	
</form>

<!-- 添加用户 -->
<div class="shadow" id="userShadow"></div>
<form id="userFormAdd" action="${path}/user/add" method="post" >
<div class="aialog w_800px"  id="userDialog">
	<div class="aialog_box">
		<div class="aialog_title">
			<div class="close_dialog"
				onclick="closeDialog('userShadow','userDialog')"></div>
			<font id="text">添加用户</font>
		</div>
		<div class="aialog_cont">
			<div class="yanzheng">
				<div class="wenzi">登录名：</div>
				<div class="shuru">
						<input  name="userName" class="inp_text" />
				</div>
				<div class="wenzi">密码：</div>
				<div class="shuru">
						<input name="password" class="inp_text" />
				</div>
			</div>
			<div class="yanzheng">
				<div class="wenzi">用户类型：</div>
				<div class="shuru">
						<select class='select_text' name="userType">
				        	<option value='2'>普通用户</option>
				        	<option value='1'>管理员</option>
			        </select>
				</div>
			</div>
		</div>
		<div class="aialog_tool">
			<input type="submit" class="inp_btn" value="提交"/>
			<input type="button" class="inp_btn" value="取消" onclick="closeDialog('userShadow','userDialog')" />
		</div>
	</div>
</div>
</form>


<!-- 修改用户 -->
<div class="shadow" id="userShadowEdit"></div>
<form id="userFormEdit" action="${path}/user/edit" method="post" >
<div class="aialog w_800px"  id="userDialogEdit">
	<div class="aialog_box">
		<div class="aialog_title">
			<div class="close_dialog"
				onclick="closeDialog('userShadowEdit','userDialogEdit')"></div>
			<font id="text">修改用户</font>
		</div>
		<div class="aialog_cont">
			<div class="yanzheng">
				<div class="wenzi">登录名：</div>
				<div class="shuru">
				        <input type="hidden" name="userId" id="userId"/>
						<input  name="userName" class="inp_text" id="userName"/>
				</div>
				<div class="wenzi">密码：</div>
				<div class="shuru">
						<input name="password" class="inp_text" id="password"/>
				</div>
			</div>
			<div class="yanzheng">
				<div class="wenzi">用户类型：</div>
				<div class="shuru">
						<select class='select_text' name="userType" id="userType">
				        	<option value='2'>普通用户</option>
				        	<option value='1'>管理员</option>
			        </select>
				</div>
			</div>
		</div>
		<div class="aialog_tool">
			<input type="submit" class="inp_btn" value="提交"/>
			<input type="button" class="inp_btn" value="取消" onclick="closeDialog('userShadowEdit','userDialogEdit')" />
		</div>
	</div>
</div>
</form>
<script type="text/javascript">
</script>


</body>
</html>
