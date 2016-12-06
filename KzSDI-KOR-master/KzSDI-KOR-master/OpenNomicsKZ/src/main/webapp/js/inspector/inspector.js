$(document).ready(function() {
	selectInspectorList();
});

/**
* no에 해당하는 검수요청목록을 조회한다.
* @author seulgi.lee
* @date 2016. 02.
* @param no - 페이지번호
* @returns 
*/
function selectInspectorList(no){
		var pageNum = 1;
		if(no!=null){
			pageNum=no;
		}
		
		var url=CONTEXT+"/receipt/selectInspectorList.ajax";
		var params ={
			pageNum : pageNum	
		};
		sendJsonRequest(url, params, insListCallback);
}

var insList = null;

/**
* selectInspectorList의 반환 함수이다.
* @author seulgi.lee
* @date 2016. 02.
* @param result - 검수요청목록
* @returns 
*/
function insListCallback(result) {
		insList = result.list;
		var pageCounts = result.count;
		closePop();
		$('#tableBody > tr').remove();
		$('#pageCountView > a').remove();
		for ( var obj in insList) {
			if(insList[obj].stts!=0){
			if(insList[obj].stts==1){
			$('#tableBody').append(
					"<tr>" +
					"<td>" + insList[obj].rid + "</td>" +
					"<td>" + insList[obj].uid + "</td>" +
					"<td>" + insList[obj].utype + "</td>" +
					"<td>" + insList[obj].jname + "</td>" +
					"<td>" + insList[obj].jcontent + "</td>"+ 
					"<td>" + foo(insList[obj].cdate) + "</td>"+ 
					"<td>검수대기</td>"+
					"<td>" + "<input type='button' class='bigButton' name='btnQA"+obj+"' id ='btnQA"+obj+"'value='확인' onclick='qaMapLoad("+""+obj+""+")';>" + "</td>"+				
					"</tr>");
			}
			else{
			if(insList[obj].stts==2){
			$('#tableBody').append(
					"<tr>" +
					"<td>" + insList[obj].rid + "</td>" +
					"<td>" + insList[obj].uid + "</td>" +
					"<td>" + insList[obj].utype + "</td>" +
					"<td>" + insList[obj].jname + "</td>" +
					"<td>" + insList[obj].jcontent + "</td>"+ 
					"<td>" + foo(insList[obj].cdate) + "</td>"+
					"<td>검수완료</td>"+
					"<td>" + "<input type='button' class='bigButton' name='btnQA"+obj+"' id ='btnQA"+obj+"'value='확인' disabled='disabled' style='background-color: rgb(154, 160, 167)' onclick='qaMapLoad("+""+obj+""+")';>" + "</td>"+				
					"</tr>");
			}
			if(insList[obj].stts==3){
				$('#tableBody').append(
						"<tr>" +
						"<td>" + insList[obj].rid + "</td>" +
						"<td>" + insList[obj].uid + "</td>" +
						"<td>" + insList[obj].utype + "</td>" +
						"<td>" + insList[obj].jname + "</td>" +
						"<td>" + insList[obj].jcontent + "</td>"+ 
						"<td>" + foo(insList[obj].cdate) + "</td>"+
						"<td>승인완료</td>"+
						"<td>" + "<input type='button' class='bigButton' name='btnQA"+obj+"' id ='btnQA"+obj+"'value='확인' disabled='disabled' style='background-color: rgb(154, 160, 167)' onclick='qaMapLoad("+""+obj+""+")';>" + "</td>"+				
						"</tr>");
				}
			if(insList[obj].stts==4){
				$('#tableBody').append(
						"<tr>" +
						"<td>" + insList[obj].rid + "</td>" +
						"<td>" + insList[obj].uid + "</td>" +
						"<td>" + insList[obj].utype + "</td>" +
						"<td>" + insList[obj].jname + "</td>" +
						"<td>" + insList[obj].jcontent + "</td>"+ 
						"<td>" + foo(insList[obj].cdate) + "</td>"+
						"<td>승인거절</td>"+
						"<td>" + "<input type='button' class='bigButton' name='btnQA"+obj+"' id ='btnQA"+obj+"'value='확인' disabled='disabled' style='background-color: rgb(154, 160, 167)' onclick='qaMapLoad("+""+obj+""+")';>" + "</td>"+				
						"</tr>");
					}
				}
			}
		}
		for (var i = 1; i <= pageCounts; i++) {
			$('#pageCountView').append(
					"<a href='javascript:selectInspectorList(" + i + ")'>" + "<font size='3px' style='padding-right:10px'>" + i + "</font>" + "</a>");
		}
}

/**
* obj에 해당하는 검수페이지로 이동한다.
* @author seulgi.lee
* @date 2016. 02.
* @param obj - 검수요청목록 번호
* @returns 
*/
function qaMapLoad(obj){
	var params = {
			rid : insList[obj].rid,
			tname : insList[obj].tname
		};
		getToUrl(CONTEXT + "/layer/qaStart.do", params, "_self");
}


