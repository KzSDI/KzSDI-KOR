package opennomics.com.main;

import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.AbstractController;
import opennomics.com.common.enums.EnUserType;
import opennomics.com.main.user.domain.UserVO;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;


/**
 * 메인페이지 요청을 수행한다.
 * 
 * @author SG.Lee
 * @Date 2016.03
 * */
@Controller("mainController")
public class MainController extends AbstractController {
	
	/**
	 * 메일을 보내는 함수이다.
	 * 
	 * @author SG.LEE
	 * @data 2016.06
	 * @param request - 
	 * 				클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @return ModelAndView
	 */
	@SuppressWarnings("unused")
	@RequestMapping(value="/main.do")
	public ModelAndView loginView(HttpServletRequest request
			){
		ModelAndView mav = new ModelAndView();
		UserVO chairman = (UserVO) getSession(request,EnUserType.CHAIRMAN.getTypeName());
		UserVO inspector  = (UserVO) getSession(request,EnUserType.INSPECTOR.getTypeName());
		
		String flag =  "false";
		//세션이 없을경우 login 페이지호출
		if(chairman==null && inspector==null)
			flag = "false";
		else{
			if(chairman!=null){
				flag="ctrue";
			}
			else if(inspector!=null){
				flag="itrue";
			}
		}
		
		if(flag=="ctrue"){
			mav.setViewName("/chairman/chairman");
			mav.addObject("user", chairman);
		}
		else if(flag=="itrue"){
			mav.setViewName("/inspector/inspector");
			mav.addObject("user", inspector);
		}
		else{
			mav.setViewName("/login/login");
			mav.addObject("user", null);
		}
			
//			mav.setViewName("redirect:/main.do");
			
		return mav;
	}
	
}
