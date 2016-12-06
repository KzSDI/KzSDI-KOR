package opennomics.com.main.qa.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import opennomics.com.common.ConvertService;
import opennomics.com.main.file.ExcelView;
import opennomics.com.main.receipt.domain.ReceiptVO;
import opennomics.com.main.receipt.service.ReceiptService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.View;

/**
 * 엑셀 다운로드 요청을 수행한다.
 * 
 * @author SG.Lee
 * @Date 2016.06
 * */
@Controller("excelController")
@RequestMapping("/qa")
public class ExcelController {


	@Autowired
	ReceiptService receiptService;
	
	/**
	 * 엑셀다운로드 요청을 한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param response - 클라이언트의 반응과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid - 접수번호
	 * @param fileName - 파일이름
	 * @param errReportInfo - 오류리포트 정보
	 * @param ModelMap - 엑셀 내용에 포함될 정보
	 * @return View 
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ResponseBody
	@RequestMapping(value="/downloadExcel.do")
	public View downloadExcel(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value="rid", required=true)int rid,
			@RequestParam(value="fileName", required=true)String fileName,
			@RequestParam(value="errReportInfo", required=true)String errReportInfo,
			Map<String,Object> ModelMap
			){
		ReceiptVO receipt = new ReceiptVO();
		ConvertService convertService = new ConvertService();
		try {
			receipt = receiptService.selectReceipt(rid);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		ModelMap.put("fileName", fileName);
		ModelMap.put("receipt", receipt);
		ModelMap.put("errReportInfo", convertService.errStringToList(errReportInfo));
		
		
		return new ExcelView();
	}
}
