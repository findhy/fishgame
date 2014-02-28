<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>天天爱钓鱼数据查询后台</title>
<link href="css/all.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
</script>
</head>
<frameset rows="81,*,21" cols="*" frameborder="no" border="0" framespacing="0">
		<frame src="${path}/top" name="topFrame" scrolling="no" noresize="noresize" id="topFrame" title="topFrame" />
		<frameset cols="206,*" frameborder="no" border="0" framespacing="0">
				<frame src="${path}/left?userType=${userType}" name="leftFrame" scrolling="no" noresize="noresize" id="leftFrame" title="leftFrame" />
				<frame src="${path}/index" name="mainFrame" id="mainFrame" title="mainFrame" />
		</frameset>
		<frame src="${path}/footer" name="footerFrame" scrolling="no" noresize="noresize" id="footerFrame" title="footerFrame" />
</frameset>
<noframes>
<body>
</body>
</noframes>
</html>
