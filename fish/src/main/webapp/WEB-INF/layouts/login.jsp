<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="../common/head.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <title>天天爱钓鱼</title>
	 <style>
        *{ padding: 0; margin: 0}
        body{ background: url(${path}/static/images/BodybgClould.gif) #f5f6f7 center top repeat-x }
        .contentCenterWrap{font-family:"微软雅黑"; position: relative;background: url(${path }/static/images/loginMainCbg.png) center 30px no-repeat;margin: 0 auto;width:992px;height:543px}
        .signIn{ height:277px;margin: 0 auto;overflow: hidden;padding: 255px 0 0 500px}
    	.signIn_content { width:460px; margin:0 auto; color: #4D4F4C; font: 14px Arial,Verdana,Helvetica,sans-serif;font-size:18px; font-weight:bold}
    	.signInText input{ float:left;border:1px solid #D7D9D6;font-size: 24px;height:30px; line-height:30px;width:240px;padding:0 5px;overflow:hidden;}
    	.signInText label{ float:left; text-align:right;line-height:30px;font-family:Microsoft Yahei,Arial,Verdana,"微软雅黑","宋体",;}
		.signInText{height:40px;overflow:hidden;}
		.signInText input{width:240px;height:30px;padding:0 5px;overflow:hidden;border:1px solid #D7D9D6;line-height:30px;font-size:16px;}
		.signIn button{border:none;background:url(${path }/static/images/btn_green.png) no-repeat 0 0;width:120px;height:42px;overflow:hidden;cursor:pointer;margin:2px 10px 0 65px;color:#fff;font-family:Microsoft Yahei,Arial,Verdana,"微软雅黑","宋体",;font-size: 20px;font-weight:bold}
    	.signIn a{font-size:12px;}
    	.colorR{color:red}
    	.colorG{color:#4c5557}
    </style>

  </head>
  
  <body>
  <form action="${path}/login" method="post">
<div class="contentCenterWrap">
	<div class="login_logo"></div>
	<div class="signIn">
		<div class="signInText">
		 	<label>用户名：</label>
			<input type="text" name="userName"/>
		</div>
		<div class="signInText">
			<label>密　码：</label>
			<input type="password" name="password"/>
		</div>
		<button onmouseover="className='buttona'" onmouseout="className=''">登录</button>
	</div>
</div>
</form>
  </body>
</html>
