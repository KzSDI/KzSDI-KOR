<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="/WEB-INF/jsp/common/common.jsp"%>
<script src="${ctx}/js/inspector/excel.js"></script>
<title>엑셀다운로드</title>



</head>
<body>
<div class="userInfo" align="center" style="padding: 15px 0 30px 81px;">
				<table id="idPwTable">
					<caption>정보확인</caption>
					<colgroup>
						<col width="145px" style="width: 134px;">
						<col width="*">
					</colgroup>
					<tbody>
					
						<tr>
							<th scope="row" class="verTop"><label for="path">경로</label></th>
							<td>
								<input type="text" class="text userid" style="width: 350px;" name="path" id="path" placeholder="디폴트경로는 C드라이브 입니다." value="C:\">
								<input type="button" onclick="pathConfirm();" name="confirmbtn" id="confirmbtn" class="button" value="경로확인" /></br>
								<label id="pathcomment" style="MARGIN-LEFT: 5px; color: red; font-weight: 700;">경로확인을 해주세요.</label>
							</td>
							
						</tr>
						<tr>
							<th scope="row" class="verTop"><label for="filename">파일명</label></th>
							<td>
								<input type="text" name="filen" id="filen"class="text userid disabled" style="width: 350px; background: darkgrey;" placeholder="파일명을 입력하세요.">
								<input type="button" disabled="disabled" name="downbtn" id="downbtn" style="background: darkgrey;" onclick="downLoadExcel();" class="button" value="다운로드" />
							</td>
							
						</tr>
					</tbody>
				</table>
		</div>

</body>
</html>