package opennomics.com.main.qa.controller;

import javax.servlet.http.HttpServletRequest;

import opennomics.com.main.qa.service.QAService;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 클라이언트 공간데이터 검수 요청을 수행한다.
 * 
 * @author dayeon.oh
 * @data 2016.02
 */
@Controller("qaController")
@RequestMapping("/qualityAssurance")
public class QAController {

	@Autowired
	QAService qaService;

	/**
	 * 문자열로 된 JSONObject를 JSONObject 객체로 변환하여 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param request
	 *            클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param geo
	 *            검수를 수행할 JSONObject
	 * @return JSONObject
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/qa.ajax")
	public JSONObject qualityAssurance(HttpServletRequest request, @RequestBody JSONObject geo) throws Exception {

		System.out.println("머야");
		System.out.println(geo.toString());

		JSONObject reJsonObject = qaService.qaNewLayer(geo);

		System.out.println(reJsonObject.toString());
		System.out.println("리턴한당");
		return reJsonObject;
	}
}