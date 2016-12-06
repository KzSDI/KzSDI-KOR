package opennomics.com.main.user.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.AbstractController;
import opennomics.com.common.enums.EnUserType;
import opennomics.com.main.user.domain.UserVO;
import opennomics.com.main.user.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

/**
 * 로그인과 관련된 요청을 수행한다.
 * 
 * @author SG.Lee
 * @Date 2016.05.
 * */
@Controller("loginController")
@RequestMapping("/user")
@SessionAttributes(types = UserVO.class)
public class LoginController extends AbstractController {

	@Autowired
	private UserService userService;

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	/**
	 * 로그인 요청을 처리한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param id - 사용자 아이디
	 * @param pw - 사용자 비밀번호
	 * @param loginType - 사용자 유형
	 * @return JSONObject 
	 */
	@RequestMapping(value = "/login.ajax")
	@ResponseBody
	public Map<String, Object> userLogin(HttpServletRequest request, @RequestParam(value = "id", required = true) String id,
			@RequestParam(value = "pw", required = true) String pw, @RequestParam(value = "loginType", required = true) String loginType) {
		// returnMap - <flag, loginType>
		Map<String, Object> returnMap = new HashMap<String, Object>();
		String isFlag = "false";
		int auth = 0;
		UserVO user = new UserVO();

		if (loginType.equals(EnUserType.INSPECTOR.getTypeName())) {
			auth = 1;
		} else if (loginType.equals(EnUserType.CHAIRMAN.getTypeName())) {
			auth = 2;
		}
		HashMap<String, Object> infoMap = new HashMap<String, Object>();
		infoMap.put("id", id);
		infoMap.put("pw", pw);
		infoMap.put("auth", auth);

		try {
			user = userService.loginUserByInfo(infoMap);
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (user != null) {
			if (loginType.equals(EnUserType.CHAIRMAN.getTypeName())) {
				isFlag = "ctrue";
				setSession(request, EnUserType.CHAIRMAN.getTypeName(), user);
			} else if (loginType.equals(EnUserType.INSPECTOR.getTypeName())) {
				isFlag = "itrue";
				setSession(request, EnUserType.INSPECTOR.getTypeName(), user);
			}

		} else
			isFlag = "false";

		returnMap.put("user", user);
		returnMap.put("flag", isFlag);
		return returnMap;
	}

	/**
	 * 로그아웃 요청을 처리한다.
	 * @author SG.Lee
	 * @data 2016.04
	 * @param request - 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @return ModelAndView 
	 */
	@RequestMapping(value = "/logout.do")
	public ModelAndView logout(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();

		UserVO chairman = (UserVO) getSession(request, EnUserType.CHAIRMAN.getTypeName());
		UserVO inspector = (UserVO) getSession(request, EnUserType.INSPECTOR.getTypeName());

		if (inspector != null) {
			removeSession(request, EnUserType.INSPECTOR.getTypeName());
		}
		if (chairman != null) {
			removeSession(request, EnUserType.CHAIRMAN.getTypeName());
		}

		mav.setViewName("redirect:/main.do");
		return mav;
	}
}
