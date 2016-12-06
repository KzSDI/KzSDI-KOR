/**
 * 팝업창 띄우기
 * 
 * @dev SG.Lee
 * @date 2016.05.29
 */
//회원가입창 띄우기
function showJoinTypePopup() {
	$('#joinTypePopup').xShowPopup();
}

//로그아웃 확인창 띄우기
function logoutComfirmPopup() {
	$('#logoutComfirmPopup').xShowPopup();
}

//Inspection request List
function ListComfirmPopup() {
	$('#inspectionPopup').xShowPopup();
}

//탈퇴창 띄우기
function secessionPopup(){
	$('#secessionPopup').xShowPopup();
}

//부의장검수요청창 띄우기
function ApprovalRequest(){
	$('#chairmanRequestPopup').xShowPopup();
}

//엑셀완료창
function downLoadExcelConfirm(){
	$('#downLoadExcelConfirmPopup').xShowPopup();
}

function showChairmanApproval(){
	$('#chairmanApprovalPopup').xShowPopup();
}

function showChairmanDisApproval(){
	$('#chairmanDisApprovalPopup').xShowPopup();
}



/**
 * 로그인 완료
 */
function loginComplete() {
	var path = CONTEXT + "/main.do";
	var params = {
	};
	var target = "_self";
	getToUrl(path, params, target);
}

/**
 * 로그아웃 이동
 */
function logoutURL() {
	var path = CONTEXT + "/user/logout.do";
	var params = {};
	var target = "_self"
	getToUrl(path, params, target);
}


function loadApprovalMap(){
	var path = CONTEXT + "/layer/loadApprovalMap.do";
	var params = {};
	var target = "_self"
	getToUrl(path, params, target);
	
}
