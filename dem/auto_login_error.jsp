<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="shortcut icon" href="favicon.ico">
<title>页面无法访问</title>
<style>
.error_form {
	border: 1px solid black;
	width: 460px;
	height: 280px;
	text-align: center;
	vertical-align: middle;
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -230px;
	margin-top: -140px;
}

.error_info {
	border: none;
	width: 80%;
	height: 160px;
	text-align: center;
	vertical-align: middle;
	position: absolute;
	left: 10%;
	top: 50%;
	margin-left: 0;
	margin-top: -80px;
}
</style>
</head>

<body>
	<div class="error_form">
		<div class="error_info">
			<h2>抱歉！页面无法访问...</h2>
			<p>
				<font color="#8E8E8E"> <%
     String errorMsgStr = (String)request.getAttribute("error_msg");
     if (errorMsgStr != null)
     {
         out.print(errorMsgStr);
     }
 %>
				</font>
			<hr color="#8E8E8E" size="1px">
			<%
			    String path = request.getContextPath();
			    String basePath = path + "/Dem.html";
			%>
			<p>
				<a href='<%=basePath%>'>返回首页</a>
			</p>
		</div>
	</div>
</body>
</html>
