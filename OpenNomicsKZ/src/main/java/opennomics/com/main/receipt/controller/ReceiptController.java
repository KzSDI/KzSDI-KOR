package opennomics.com.main.receipt.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.AbstractController;
import opennomics.com.common.ConvertService;
import opennomics.com.common.enums.EnRequestType;
import opennomics.com.common.enums.EnUserType;
import opennomics.com.main.qa.domain.QAErrReportVO;
import opennomics.com.main.qa.service.QAService;
import opennomics.com.main.receipt.domain.ReceiptVO;
import opennomics.com.main.receipt.service.ReceiptService;
import opennomics.com.main.user.domain.UserVO;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * 접수현황과 관련된 요청을 수행한다.
 * 
 * @author SG.Lee
 * @Date 2016.05.
 * */
@Controller("receiptController")
@RequestMapping("/receipt")
public class ReceiptController extends AbstractController{
	
	@Autowired
	private ReceiptService receiptService;
	
	/**
	 * 검수요청 리스트 조회를 요청한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param pageNum - 페이지번호
	 * @return JSONObject 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/selectInspectorList.ajax")
	@ResponseBody
	public JSONObject selectInspectorList(HttpServletRequest request,
			@RequestParam(value="pageNum", defaultValue="1")int pageNum
			) {
	JSONObject object = new JSONObject();
	List<ReceiptVO> list = new ArrayList<ReceiptVO>();
	int listCount = 0;
	try {
		//호출하고싶은 pageNum의 시작 Index
		pageNum = (pageNum*10)-10;
		list = receiptService.selectAllReceiptList(pageNum);
		listCount = receiptService.selectAllReceiptListCount();
		
		double b = listCount/10.0;
		listCount = (int)Math.ceil(b);
		
		object.put("list", list);
		object.put("count", listCount);
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
		
		return object;
	}
	
	/**
	 * 부의장이 승인해야할 리스트 조회를 요청한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param pageNum - 페이지번호
	 * @return JSONObject 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/selectChairmanList.ajax")
	@ResponseBody
	public JSONObject selectChairmanList(HttpServletRequest request,
			@RequestParam(value="pageNum", defaultValue="1")int pageNum
			) {
	JSONObject object = new JSONObject();
	List<ReceiptVO> list = new ArrayList<ReceiptVO>();
	int listCount = 0;
	try {
		//호출하고싶은 pageNum의 시작 Index
		pageNum = (pageNum*10)-10;
		list = receiptService.selectChairReceiptList(pageNum);
		listCount = receiptService.selectChairReceiptListCount();
		
		double b = listCount/10.0;
		listCount = (int)Math.ceil(b);
		
		object.put("list", list);
		object.put("count", listCount);
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
		return object;
	}
	
	/**
	 * 검수 후 부의장에게 승인 요청한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param json - 승인정보
	 * @return boolean 
	 */
	@SuppressWarnings({ "unused", "unchecked" })
	@RequestMapping(value="/approvalRequest.ajax")
	@ResponseBody
	public boolean approvalRequest(HttpServletRequest request,@RequestBody JSONObject json){
		JSONObject object = new JSONObject();
		JSONObject layer = new JSONObject();
		Map<String, String> attInfo = new HashMap<String, String>();
		List<Map<String, Object>> errList = new ArrayList<Map<String, Object>>();
		UserVO inspector  = (UserVO) getSession(request,EnUserType.INSPECTOR.getTypeName());
		
		ConvertService convertService = new ConvertService();
		boolean flag = false;
		
		int rid =  Integer.parseInt((String)json.get("rid"));
		String tname = (String) json.get("tname");
		attInfo = (Map<String, String>) json.get("attInfo");
		layer = convertService.stringToJSON((String)json.get("layer"));
		errList = (List<Map<String, Object>>)json.get("errReport");
		
		
		
		if(layer!=null && errList!=null){
			try {
				receiptService.approvalRequest(inspector,rid, tname, attInfo,layer, errList);
				flag=true;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				flag = false;
			}
		}
		return flag;
	}
}
