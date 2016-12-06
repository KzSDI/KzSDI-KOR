
/**
* 엑셀다운로드 확인 팝업창을 띄운다.
* @author seulgi.lee
* @date 2016. 02.
*/
function showDownLoadExcelPopup(){
	
	var div = '<h4>엑셀다운로드</h4><div class="userInfo" align="center" style="padding: 15px 0 30px 81px;"><table id="idPwTable"><caption>정보확인</caption><colgroup><col width="145px" style="width: 134px;"><col width="*"></colgroup><tbody><tr><th scope="row" class="verTop"><label for="filename">파일명</label></th><td><input type="text" class="text userid" style="width: 350px;" name="filen" id="filen" placeholder="파일명을 입력하세요."><input type="button" name="btndown" id="btndown"  onclick="downLoadExcel();" class="button" value="다운로드" /></br><label id="downcomment" style="MARGIN-LEFT: 5px; color: red;"></label></td></tr></tbody></table></div><div class="layClose"><button onclick="closeExcelPopup()"><img src="'+CONTEXT+'/img/popup/btn_x.png" alt="Close" /></button></div>';
	$('#downLoadExcelPopup').append(div);
	
	$('#downLoadExcelPopup').xShowPopup();
}



/**
* 서버에 엑셀 다운로드 요청을한다.
* @author seulgi.lee
* @date 2016. 02.
*/
function downLoadExcel(){
	var rid = document.getElementById("rid").value;
	var fileName = document.getElementById("filen").value;
	var errReportInfo = getErrReport();
	
	if(fileName==null||fileName==""){
		$('#downcomment').text("파일명을 입력해주세요.");
		return false;
	}
	
	var url=CONTEXT+"/qa/downloadExcel.do";
	var params ={
		rid : rid,
		fileName : fileName,
		errReportInfo : JSON.stringify(errReportInfo)
	};
	var target = "_self";
	
	postToUrl(url, params, target);
	$('.layerPop').xHidePopup();
	$('#downLoadExcelPopup').empty();
}


/**
* 엑셀다운로드 창을 닫는다.
* @author seulgi.lee
* @date 2016. 02.
*/
function closeExcelPopup(){
	$('.layerPop').xHidePopup();
	$('#downLoadExcelPopup').empty();
}