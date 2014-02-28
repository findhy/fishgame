<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title></title>
<script type="text/javascript">
</script>
</head>
<body class="autoWidth_m">
<form action="${path}/phoneModelStatistics" id="phoneModelStatisticsForm" method="post">
<div class="fieledsetWrap margin_l_r10">
	<!-- 查询条件 -->
	
		<fieldset>
			<legend class="f_bold color_legend">查询条件</legend>
			<div class="yanzheng">
				<div class="wenzi100">平台：</div>
				<div class="shuru3col">
			        <select class='select_text' name="param.platform">
			        	<option value="">--请选择--</option>
			        	<option value='IOS'>IOS</option>
			        	<option value='Android'>安卓</option>
			        	<option value='Unknown'>Unknown</option>
			        </select>
			    </div>
			    
			    <div class="wenzi100">语言：</div>
				<div class="shuru3col">
			        <select class='select_text' name="param.language">
			        	<option value="">--请选择--</option>
			        	<option value='Chinese'>中文</option>
			        	<option value='English'>英文</option>
			        	<option value='Japanese'>日文</option>
			        	<option value='Korean'>韩文</option>
			        </select>
			    </div>
			    
			    <div class="wenzi100">产品：</div>
				<div class="shuru3col">
			        <select class='select_text' name="param.product">
			        	<option value='Fish' selected="selected">天天爱钓鱼</option>
			        </select>
			    </div>
			    
			  </div>
		  
			  <div class="yanzheng">
				<div class="wenzi100">开始时间：</div>
				<div class="shuru3col">
			        <input name="param.beginDate" type="text" class="input_in Wdate"  onclick="WdatePicker();" style="width: 128px;"/>
			    </div>
			    
			    <div class="wenzi100">结束时间：</div>
				<div class="shuru3col">
			        <input name="param.endDate" type="text" class="input_in Wdate"  onclick="WdatePicker();"/>
			    </div>
			    
			    <div class="wenzi100">&nbsp;</div>
				<div class="shuru3col">
			      <input type="submit" class="inp_btn" value="查询"/>
			    </div>
			  </div>
		  
		</fieldset>
	
</div>

<div class="combination margin_l_r10" style="width:auto;height:auto">
	<div class="title2"><span class="toggle_hide">手机型号统计</span></div>
	
	<!-- 数据列表singleSelected='singleSelected'  -->	
	<div id="tableDiv" style="width:100%">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<thead>
			<tr>
				<th width="30%">手机型号</th>
				<th width="30%">数量</th>
				<th width="40%">占比</th>
			</tr>	
		</thead>
		 
		<tbody>
			<c:forEach items="${page.list}" var="list">
			   <tr>
			   	  <td><c:out value="${list.time}"/></td>
			   	  <td><c:out value="${list.count}"/></td>
			   	  <td><c:out value="${list.percent}"/>%</td>
			   </tr>
			</c:forEach>
		</tbody>
	</table>
	<div class="pages">
	   <jsp:include page="../common/paging.jsp" flush = "true">
	   		<jsp:param name="url" value="/phoneModelStatistics"/>
    		<jsp:param name="searchFormId" value="phoneModelStatisticsForm" />
	   </jsp:include>
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
