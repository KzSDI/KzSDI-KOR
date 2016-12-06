package opennomics.com.main.layer.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.AbstractController;
import opennomics.com.common.enums.EnRequestType;
import opennomics.com.common.enums.EnUserType;
import opennomics.com.main.layer.domain.LayerVO;
import opennomics.com.main.layer.service.LayerService;
import opennomics.com.main.receipt.domain.ReceiptVO;
import opennomics.com.main.receipt.service.ReceiptService;
import opennomics.com.main.user.domain.UserVO;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


/**
 * 레이어와 관련된 요청을 수행한다.
 * @author SG.Lee
 * @Date 2016.05
 * */
@Controller("layerController")
@RequestMapping("/layer")
public class LayerController extends AbstractController  {

	
	@Autowired
	LayerService layerService;
	
	@Autowired
	ReceiptService receiptService;
	
	
	/**
	 * 승인된 지도로 이동한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @return ModelAndView
	 */
	@RequestMapping(value="/loadApprovalMap.do")
	@ResponseBody
	public ModelAndView loadApprovalMapView(HttpServletRequest request
			){
		
		ModelAndView mav = new ModelAndView();

		UserVO chairman = (UserVO) getSession(request,EnUserType.CHAIRMAN.getTypeName());
		UserVO inspector  = (UserVO) getSession(request,EnUserType.INSPECTOR.getTypeName());
		
		if(chairman!=null){
			mav.addObject("user", chairman);
		}
		
		if(inspector!=null){
			mav.addObject("user", inspector);
		}
		
		
		mav.setViewName("/map/approvalMap");
		return mav;
	}
	
	
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/approvalLayerAjax.ajax")
	@ResponseBody
	public List<JSONObject> approvalLayerAjax(HttpServletRequest request
			){

		List<JSONObject> returnObj = new ArrayList<JSONObject>();
		
		returnObj = layerService.selectAPLayerNames();
		
		return returnObj;
	}
	
	
	
	/**
	 * 검수를 수행하는 페이지로 이동한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid - 접수번호
	 * @param tname - 테이블이름
	 * @return ModelAndView
	 */
	@RequestMapping(value="/qaStart.do")
	@ResponseBody
	public ModelAndView mapLayerLoad(HttpServletRequest request,
			@RequestParam(value="rid", required=true)String rid,
			@RequestParam(value="tname", required=true)String tname
			){
		
		ModelAndView mav = new ModelAndView();
		UserVO chairman = (UserVO) getSession(request,EnUserType.CHAIRMAN.getTypeName());
		UserVO inspector  = (UserVO) getSession(request,EnUserType.INSPECTOR.getTypeName());
		
		if(chairman!=null){
			mav.addObject("user", chairman);
		}
		
		if(inspector!=null){
			mav.addObject("user", inspector);
		}
		
		ReceiptVO receiptVO = new ReceiptVO();
		
		try {
			receiptVO = receiptService.selectReceipt(Integer.parseInt(rid));
			int stts = receiptVO.getStts();
			
			if(stts==EnRequestType.INSPECTION_WAITING.getstts()){
				mav.addObject("rid", rid);
				mav.addObject("tname", tname);
				mav.setViewName("/map/qaMap");
			}
			else
				mav.setViewName("redirect:/main.do");
		} catch (NumberFormatException e) {
			mav.setViewName("redirect:/main.do");
		} catch (Exception e) {
			mav.setViewName("redirect:/main.do");
		}
		return mav;
	}
	
	
	/**
	 * tname에 대한 레이어 정보와 새로 요청한 레이어 정보를 조회를 요청한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid - 접수번호
	 * @param tname - 테이블이름
	 * @return JSONObject
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/layerLoadAjax.ajax")
	@ResponseBody
	public JSONObject mapLayerLoadAjax(HttpServletRequest request,
			@RequestParam(value="rid", required=true)String rid,
			@RequestParam(value="tname", required=true)String tname
			){
		
		Map<String, Object> infoMap = new HashMap<String, Object>();
		JSONObject returnObj = new JSONObject();
		JSONObject newLayer = new JSONObject();
		LayerVO layerVO = new LayerVO();
		infoMap.put("rid", rid);
		infoMap.put("tname", tname);
		newLayer = layerService.selectDBReqestLayers(infoMap);
		layerVO = layerService.getAppLayerInfo(tname);
		
		
		returnObj.put("layerVO", layerVO);
		returnObj.put("geoJSON", newLayer);
		return returnObj;
	}
}
