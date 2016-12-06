package opennomics.com.main.file;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import opennomics.com.main.receipt.domain.ReceiptVO;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.hssf.util.HSSFColor;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.servlet.view.document.AbstractExcelView;

public class ExcelView extends AbstractExcelView{
	
		@SuppressWarnings({ "unchecked", "resource", "deprecation", "static-access" })
		@Override
		protected void buildExcelDocument(Map<String, Object> ModelMap,
				HSSFWorkbook workbook, HttpServletRequest request,
				HttpServletResponse response) throws Exception {

			String fileName = (String) ModelMap.get("fileName");
			List<org.json.JSONObject> errReportInfo = (List<org.json.JSONObject>) ModelMap.get("errReportInfo");
			ReceiptVO receipt = new ReceiptVO();
			
			receipt = (ReceiptVO) ModelMap.get("receipt");
			
			HSSFSheet sheet = null;
			HSSFRow row = null;
			
			response.setContentType("application/msexcel");
			response.setHeader("Content-Disposition", "attachment; filename="+ fileName + ".xls");
			
			if(receipt != null && errReportInfo != null) {
				
				
				
				try {
					fileName = URLEncoder.encode(fileName, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				
				sheet = workbook.createSheet("검수리포트");
				
				sheet.setColumnWidth(0, 5000);
				sheet.setColumnWidth(1, 7000);
				sheet.setColumnWidth(2, 8000);
				sheet.setColumnWidth(3, 7000);
				sheet.setColumnWidth(4, 8000);
				sheet.setColumnWidth(5, 4000);
				sheet.setColumnWidth(6, 10000);
				
				HSSFCellStyle cellStyle0 = workbook.createCellStyle();
				HSSFFont font = workbook.createFont();
				font.setFontHeightInPoints((short)20);
				font.setFontName("맑은 고딕");
				font.setBoldweight((short)font.BOLDWEIGHT_BOLD);
				cellStyle0.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
				cellStyle0.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				cellStyle0.setFont(font);
				row = sheet.createRow(0);
				sheet.addMergedRegion(new CellRangeAddress(0,0,0,6));
				sheet.addMergedRegion(new CellRangeAddress(2,2,3,5));
				sheet.addMergedRegion(new CellRangeAddress(3,3,3,5));
				sheet.addMergedRegion(new CellRangeAddress(4,4,3,5));
				row.createCell(0).setCellValue("검수결과 통보서");
				row.getCell(0).setCellStyle(cellStyle0);
				row.setHeight((short)800);
				
				
				HSSFCellStyle cellStyleSS = workbook.createCellStyle();		
				HSSFFont fontSS = workbook.createFont();
				fontSS.setFontHeightInPoints((short)13);
				fontSS.setFontName("맑은 고딕");
				cellStyleSS.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
				cellStyleSS.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				cellStyleSS.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				cellStyleSS.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				cellStyleSS.setBorderRight(HSSFCellStyle.BORDER_THIN);
				cellStyleSS.setBorderTop(HSSFCellStyle.BORDER_THIN);
				cellStyleSS.setBottomBorderColor(HSSFColor.BLACK.index);
				cellStyleSS.setFillForegroundColor((HSSFColor.GREY_25_PERCENT.index));
				cellStyleSS.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				cellStyleSS.setFont(fontSS);
				
				HSSFCellStyle cellStyleSC = workbook.createCellStyle();
				cellStyleSC.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
				cellStyleSC.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				cellStyleSC.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				cellStyleSC.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				cellStyleSC.setBorderRight(HSSFCellStyle.BORDER_THIN);
				cellStyleSC.setBorderTop(HSSFCellStyle.BORDER_THIN);
				cellStyleSC.setBottomBorderColor(HSSFColor.BLACK.index);
				cellStyleSC.setFont(fontSS);
				
				row = sheet.createRow(2);
				row.setHeight((short)400);
				row.createCell(0).setCellValue("접수번호");
				row.getCell(0).setCellStyle(cellStyleSS);
				row.createCell(1).setCellValue(receipt.getRid());
				row.getCell(1).setCellStyle(cellStyleSC);
				row.createCell(2).setCellValue("작업명");
				row.getCell(2).setCellStyle(cellStyleSS);
				row.createCell(3).setCellValue(receipt.getJname());
				row.getCell(3).setCellStyle(cellStyleSC);
				row.createCell(4);
				row.getCell(4).setCellStyle(cellStyleSC);
				row.createCell(5);
				row.getCell(5).setCellStyle(cellStyleSC);
				
				row = sheet.createRow(3);
				row.setHeight((short)400);
				row.createCell(0).setCellValue("구분");
				row.getCell(0).setCellStyle(cellStyleSS);
				row.createCell(1).setCellValue(receipt.getUtype());
				row.getCell(1).setCellStyle(cellStyleSC);
				row.createCell(2).setCellValue("작업내용");
				row.getCell(2).setCellStyle(cellStyleSS);
				row.createCell(3).setCellValue(receipt.getJcontent());
				row.getCell(3).setCellStyle(cellStyleSC);
				row.createCell(4);
				row.getCell(4).setCellStyle(cellStyleSC);
				row.createCell(5);
				row.getCell(5).setCellStyle(cellStyleSC);
				
				row = sheet.createRow(4);
				row.setHeight((short)400);
				row.createCell(0).setCellValue("사용자 아이디");
				row.getCell(0).setCellStyle(cellStyleSS);
				row.createCell(1).setCellValue(receipt.getUid());
				row.getCell(1).setCellStyle(cellStyleSC);
				row.createCell(2).setCellValue("신청일자");
				row.getCell(2).setCellStyle(cellStyleSS);
				row.createCell(3).setCellValue(receipt.getCdate());
				row.getCell(3).setCellStyle(cellStyleSC);
				row.createCell(4);
				row.getCell(4).setCellStyle(cellStyleSC);
				row.createCell(5);
				row.getCell(5).setCellStyle(cellStyleSC);
				
				HSSFCellStyle contentCellStyle = workbook.createCellStyle();
				HSSFFont fontES = workbook.createFont();
				fontES.setFontHeightInPoints((short)13);
				fontES.setFontName("맑은 고딕");
				contentCellStyle.setFont(fontES);
				contentCellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
				contentCellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				contentCellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				contentCellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				contentCellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				contentCellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				contentCellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				contentCellStyle.setFillForegroundColor((HSSFColor.GREY_25_PERCENT.index));
				contentCellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
				contentCellStyle.setWrapText(true);
				row = sheet.createRow(7);
				row.createCell(0).setCellValue("Type");
				row.getCell(0).setCellStyle(contentCellStyle);
				row.createCell(1).setCellValue("Number of items\nin lot");
				row.getCell(1).setCellStyle(contentCellStyle);
				row.createCell(2).setCellValue("Number of\nnon-conforming items");
				row.getCell(2).setCellStyle(contentCellStyle);
				row.createCell(3).setCellValue("Ratio of\nnon- conforming");
				row.getCell(3).setCellStyle(contentCellStyle);
				row.createCell(4).setCellValue("Accuracy Proportion\n(defined as 1-ratio)");
				row.getCell(4).setCellStyle(contentCellStyle);
				row.createCell(5).setCellValue("Weights");
				row.getCell(5).setCellStyle(contentCellStyle);
				row.createCell(6).setCellValue("Weighted value\n(accuracy proportion * weight)");
				row.getCell(6).setCellStyle(contentCellStyle);
				row.setHeight((short)1100);
				
				
				
				HSSFCellStyle econtentCellStyle = workbook.createCellStyle();
				HSSFFont fontEC = workbook.createFont();
				fontEC.setFontHeightInPoints((short)10);
				fontEC.setFontName("맑은 고딕");
				econtentCellStyle.setFont(fontEC);
				econtentCellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER_SELECTION);
				econtentCellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
				econtentCellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				econtentCellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				econtentCellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				econtentCellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				econtentCellStyle.setBottomBorderColor(HSSFColor.BLACK.index);
				
				int totalRow = 0;
				double totalAccuracy = 0;
					for(int j=0; j<errReportInfo.size(); j++){
						org.json.JSONObject errReport = new org.json.JSONObject();
						errReport = errReportInfo.get(j);
						row = sheet.createRow(j+8);
						row.setHeight((short)400);
						row.createCell(0).setCellValue((String)errReport.get("type"));
						row.createCell(1).setCellValue(Double.parseDouble(errReport.get("numOfItems").toString()));
						row.createCell(2).setCellValue(Double.parseDouble(errReport.get("numOfErr").toString()));
						row.createCell(3).setCellValue((String)errReport.get("ratioOfErr"));
						row.createCell(4).setCellValue(Double.parseDouble(errReport.get("accuracy").toString()));
						row.createCell(5).setCellValue(Double.parseDouble(errReport.get("weights").toString()));
						row.createCell(6).setCellValue(Double.parseDouble(errReport.get("weightedValue").toString()));
						row.getCell(0).setCellStyle(econtentCellStyle);
						row.getCell(1).setCellStyle(econtentCellStyle);
						row.getCell(2).setCellStyle(econtentCellStyle);
						row.getCell(3).setCellStyle(econtentCellStyle);
						row.getCell(4).setCellStyle(econtentCellStyle);
						row.getCell(5).setCellStyle(econtentCellStyle);
						row.getCell(6).setCellStyle(econtentCellStyle);
						totalAccuracy = totalAccuracy + Double.parseDouble(errReport.get("weightedValue").toString());
						totalRow = j+8;
					}
				row = sheet.createRow(totalRow+1);
				row.setHeight((short)400);
				sheet.addMergedRegion(new CellRangeAddress(totalRow+1,totalRow+1,0,6));
				row.createCell(0).setCellValue("(defined as the sum of weighted accuracy proportion * 100) "+totalAccuracy+"%");
				row.createCell(1);
				row.createCell(2);
				row.createCell(3);
				row.createCell(4);
				row.createCell(5);
				row.createCell(6);
				row.getCell(0).setCellStyle(econtentCellStyle);
				row.getCell(1).setCellStyle(econtentCellStyle);
				row.getCell(2).setCellStyle(econtentCellStyle);
				row.getCell(3).setCellStyle(econtentCellStyle);
				row.getCell(4).setCellStyle(econtentCellStyle);
				row.getCell(5).setCellStyle(econtentCellStyle);
				row.getCell(6).setCellStyle(econtentCellStyle);
			}
		}
}
