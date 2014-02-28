<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
</head>
<frameset rows="81,*,21" cols="*" frameborder="NO" border="0" framespacing="0">
    <frame src="${ctx}/WEB-INF/layouts/top.jsp" id="topFrame" name="topFrame" scrolling="NO" noresize>
    <frameset cols="206,*" frameborder="no" border="0" framespacing="0" id="mainLeftFrame">
      <frame src="${ctx}/base/leftTree.action" name="leftFrame" id="leftFrame" scrolling="NO" noresize>
      <frameset rows="*,1" frameborder="0">
      	<frame src="${ctx}/base/desktop.action" name="mainFrame" id="mainFrame">
      	<frame src="${ctx}/smart/frame/borderBottom.jsp" frameborder="0" name="borderbottom"></frame>
  	</frameset>
    </frameset>
    <frame src="${ctx}/smart/frame/footer.jsp" name="footerFrame" scrolling="no" noresize="noresize" id="footerFrame" title="footerFrame" />
  </frameset>
  <noframes>
    <body>
    </body>
  </noframes>
</html>
