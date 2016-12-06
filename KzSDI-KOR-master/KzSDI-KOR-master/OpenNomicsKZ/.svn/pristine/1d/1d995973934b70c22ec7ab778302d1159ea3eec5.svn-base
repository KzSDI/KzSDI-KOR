package opennomics.com.main.chairman.controller;


import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.AbstractController;
import opennomics.com.common.enums.EnUserType;
import opennomics.com.main.chairman.service.ChairmanService;
import opennomics.com.main.user.domain.UserVO;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;



/**
 * 부의장과 관련된 요청을 수행한다.
 * @author SG.Lee
 * @Date 2016.05
 * */
@Controller("chairController")
@RequestMapping("/chairman")
public class ChairmanController extends AbstractController{
	
	@Autowired
	ChairmanService chairmanService;
	
	/**
	 * 승인목록에 대한 상세페이지로 이동한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.06
	 * @param request
 					- 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid
 					- 접수번호
	 * @param tname
 					- 테이블이름
	 * @param stts
 					- 접수상태
	 * @return ModelAndView
	 */
	@SuppressWarnings("unused")
	@RequestMapping(value="/detailInfoView.do")
	public ModelAndView detailInfoView(HttpServletRequest request,
			@RequestParam(value="rid", required=true)String rid,
			@RequestParam(value="tname", required=true)String tname,
			@RequestParam(value="stts", required=true)int stts
			){
		ModelAndView mav = new ModelAndView();
		UserVO chairman = (UserVO) getSession(request,EnUserType.CHAIRMAN.getTypeName());
		
		String flag =  "false";
		//세션이 없을경우 login 페이지호출
		if(chairman==null)
			flag = "false";
		else
			flag = "true";
		
		
		if(flag=="true"){
			mav.setViewName("/chairman/detailInfo");
			mav.addObject("user", chairman);
			mav.addObject("rid",rid);
			mav.addObject("tname",tname);
			mav.addObject("stts", stts);
		}
		else
			mav.setViewName("redirect:/main.do");
		return mav;
	}
	
	
	/**
	 * 승인목록을 조회한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.06
	 * @param request
 				- 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid
 				- 접수번호
	 * @param tname
 				- 테이블이름
	 * @return JSONObject
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/appovalInfoLoad.ajax")
	@ResponseBody
	public JSONObject selectInspectorList(HttpServletRequest request,
			@RequestParam(value="rid", required=true)int rid,
			@RequestParam(value="tname", required=true)String tname
			) {
		JSONObject object = new JSONObject();

		try {
			object = chairmanService.approvalRequestInfo(rid, tname);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return object;
	}
	
	/**
	 * 최종승인을 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.06
	 * @param request
 					- 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid
 					- 접수번호
	 * @return boolean
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/lastApproval.ajax")
	@ResponseBody
	public boolean lastApproval(HttpServletRequest request,
			@RequestParam(value="rid", required=true)int rid
			) {
		boolean flag = false;
		UserVO chairman = (UserVO) getSession(request,EnUserType.CHAIRMAN.getTypeName());
		
		try {
			chairmanService.updateLastApprovalRequest(rid, chairman);
			
			flag = true;
		} catch (Exception e) {
			flag = false;
		}
		return flag;
	}
	
	/**
	 * 최종거절을 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.06
	 * @param request 
	 * 				- 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param rid 
	 * 				- 접수번호
	 * @return boolean
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/lastDisApproval.ajax")
	@ResponseBody
	public boolean lastDisApproval(HttpServletRequest request,
			@RequestParam(value="rid", required=true)int rid
			) {
		boolean flag = false;
		UserVO chairman = (UserVO) getSession(request,EnUserType.CHAIRMAN.getTypeName());
		
		try {
			chairmanService.updateLastDisApprovalRequest(rid, chairman);
			flag = true;
		} catch (Exception e) {
			flag = false;
		}
		return flag;
	}
	
}
