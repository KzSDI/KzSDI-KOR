<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<!-- 미니레이어팝업 :: 가입유형 -->
	<div class="layerPop" id="joinTypePopup">
		<h4>가입 유형 선택</h4>
		<div class="layerCnt">
			<span><strong>가입유형</strong>을 선택해주세요.</span> <br /><br /><br />
			<input onclick="" type="button" class="bigButton" value="검수수행자" style="margin-top: -20px;margin-right: 20px;"/>
			<input onclick="" type="button" class="bigButton" value="부의장" style="margin-top: -20px; "/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div>
	
		
		<!-- 검수자 로그인 완료팝업-->
	<div class="layerPop" id="cloginCompletePopup">
		<h4>로그인 완료</h4>
		<div class="layerCnt" >
			<span>부의장 로그인이 완료되었습니다.</span> <br />
			<br />
			<br /> <input onclick="loginComplete();" type="button" class="bigButton" value="확인" />
		</div>
	</div>
	
		<!-- 의장 로그인 완료팝업-->
	<div class="layerPop" id="iloginCompletePopup">
		<h4>로그인 완료</h4>
		<div class="layerCnt" >
			<span>검수수행자 로그인이 완료되었습니다.</span> <br />
			<br />
			<br /> <input onclick="loginComplete();" type="button" class="bigButton" value="확인" />
		</div>
	</div>
	
	
<%-- 		<!-- 검수 후 서버 저장 팝업-->
	<div class="layerPop" id="savePopup">
		<h4>서버 저장</h4>
		<div class="layerCnt">
			<span>검수가 완료되었습니다. <br> 오류가 존재하지 않습니다. <br> 서버에 저장하시겠습니까?</span> <br /><br /><br />
			<input onclick="qaone();" type="button" class="bigButton" value="확인" style="margin-top: -20px;margin-right: 20px;"/>
			<input onclick="closePop();" type="button" class="bigButton" value="취소" style="margin-top: -20px; "/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div> --%>
	
	<!--검수리스트 확인팝업 -->
	<div class="layerPop" id="inspectionPopup">
		<h4>검수수행자 리스트</h4>
		<div class="layerCnt">
			<span>리스트로 돌아가시겠습니까?</span> <br /><br /><br />
			<input onclick="loginComplete();" type="button" class="bigButton" value="예" style="margin-top: -20px;margin-right: 20px;width: 85px;"/>
			<input onclick="closePop();" type="button" class="bigButton" value="아니오" style="margin-top: -20px; width: 80px;"/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div>
	
	
	<!--부의장 요청 확인팝업 -->
	<div class="layerPop" id="chairmanRequestPopup">
		<h4>승인요청</h4>
		<div class="layerCnt">
			<span>부의장에게 승인요청 하시겠습니까?</span> <br /><br /><br />
			<input onclick="approvalRequest();" type="button" class="bigButton" value="예" style="margin-top: -20px;margin-right: 20px;width: 85px;"/>
			<input onclick="closePop();" type="button" class="bigButton" value="아니오" style="margin-top: -20px; width: 80px;"/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div>
	
	<!-- 	로그아웃 확인팝업 -->
	<div class="layerPop" id="logoutComfirmPopup">
		<h4>로그아웃 여부</h4>
		<div class="layerCnt">
			<span><strong>로그아웃</strong> 하시겠습니까?</span> <br /><br /><br />
			<input onclick="logoutURL();" type="button" class="bigButton" value="Yes" style="margin-top: -20px;margin-right: 20px;width: 85px;"/>
			<input onclick="closePop();" type="button" class="bigButton" value="No" style="margin-top: -20px; width: 80px;"/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div>

	<!--  -->
	<div class="layerPop" id="chairmanApprovalPopup">
		<h4>최종승인</h4>
		<div class="layerCnt">
			<span>최종<strong>승인</strong> 하시겠습니까?</span> <br /><br /><br />
			<input onclick="onApprovalClick();" type="button" class="bigButton" value="Yes" style="margin-top: -20px;margin-right: 20px;width: 85px;"/>
			<input onclick="closePop();" type="button" class="bigButton" value="No" style="margin-top: -20px; width: 80px;"/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div>
	
	<div class="layerPop" id="chairmanDisApprovalPopup">
		<h4>최종거절</h4>
		<div class="layerCnt">
			<span>최종<strong>거절</strong> 하시겠습니까?</span> <br /><br /><br />
			<input onclick="onDisApprovalClick();" type="button" class="bigButton" value="Yes" style="margin-top: -20px;margin-right: 20px;width: 85px;"/>
			<input onclick="closePop();" type="button" class="bigButton" value="No" style="margin-top: -20px; width: 80px;"/>
		</div>
		<div class="layClose">
			<button><img src="${ctx}/img/popup/btn_x.png" alt="Close" /></button>
		</div>
	</div>
	
	<!-- 부의장 승인요청 완료팝업-->
	<div class="layerPop" id="requestCompletePopup">
		<h4>승인요청 완료</h4>
		<div class="layerCnt" >
			<span>승인요청이 완료되었습니다.</span> <br />
			<br />
			<br /> <input onclick="loginComplete();" type="button" class="bigButton" value="Confirm" />
		</div>
	</div>
	
	<!-- 엑셀 다운로드 팝업-->
	<div class="layerPop" id="downLoadExcelPopup" style="width: 730px;">
		
	</div>
	
	
	
	<!-- 공동사용 alert -->
	<div class="layerPop" id="warningPopup">
		<h4 id="warningMain"></h4>
		<div class="layerCnt" >
			<span id="warningSub"></span> <br />
			<br />
			<br /> <input onclick="closePop();" type="button" class="bigButton" value="Confirm" />
		</div>
	</div>
	



