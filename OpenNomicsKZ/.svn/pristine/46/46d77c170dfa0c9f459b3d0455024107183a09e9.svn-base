<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="/WEB-INF/jsp/common/common.jsp"%>
<div id="mask">dimmed</div>
<!-- masking -->
<title>Login</title>
<script type="text/javascript" src="${ctx}/js/login/login.js"></script>
<style type="text/css">
#radioset1 {
	text-align: center;
}
</style>
</head>
<body>
	<div id="header"><jsp:include page="/WEB-INF/jsp/common/header.jsp" /></div>
		<!-- container// -->
			<div class="cntNaviWarp">
				<div class="sectionWarp login">
					<div class="cntWarp">
						<h3>로그인</h3>
					</div>
					<div class="sTit">
						<p>
							<strong id="memberType"></strong> 로그인
						</p>
					</div>

					<div id="radioset1" class="text radio selectAuth top20_pd">
						<input name="radio" type="radio" class="radio" id="rdiInspector"
							style="display: none;" value="inspector"> <label for="rdiInspector"
							style="margin-right: 40px;">검수수행자</label> <input name="radio"
							type="radio" class="radio" id="rdiChairman" style="display: none;"
							value="chairman"> <label for="rdiChairman"
							style="margin-right: 40px;">부의장</label>
					</div>
					<br />

					<div class="loginBox loginAlert mgt0">
<!-- 						<p class="alert" style="display:;">Error message</p> -->
						<label for="id" class="hidden">아이디</label> 
						<input type="text" class="text good" style="width: 375px; line-height: 2px;" title="ID" id="id" value="" placeholder=""
							onfocus="javascript:this.value=''" /> 
						<input name="login" onclick="login('L')" type="button" class="button" id="btnLogin" value="로그인" title="Login"
							style="width: 80px; height: 80px; position: absolute; font-size: initial; margin-left: 10px;">
						<label for="pw" class="hidden">비밀번호</label> 
						<input type="password" class="text" style="width: 375px; line-height: 2px;" title="PW" id="pw" value="" placeholder=""
							onfocus="javascript:this.value=''" />
					</div>

					<div class="loginInfo">
						<div class="findGuide">
							<p class="textArea">
								<span class="tit">아직 가입하지 않았습니까?</span> <span
									class="desc fc_666">간단한 과정으로 아이디를 쉽게 만들수 있습니다.</span>
							</p>
							<p class="btnArea">
								<a href="javascript:showJoinTypePopup()"> <img src="${ctx }/img/btn_join.png" alt="아이디 만들기" /></a>
							</p>
						</div>
					</div>
				</div>
				</div>
				
</body>
</html>