package opennomics.com.main.file.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.AbstractController;
import opennomics.com.main.file.service.UploadService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;



/**
 * 클라이언트 파일 로드 지원
 * @author SG.Lee
 * @Date 2015.10.20
 * */
@Controller("uploadController")
@RequestMapping("/file")
public class UploadController extends AbstractController{
	
	private static final Logger logger = LoggerFactory.getLogger(UploadController.class);
		
	@Autowired
	UploadService uploadService;
	/**
	 * 로드 Ajax
	 * @author SG.Lee
	 * @Date 2015.10.20
	 * @input 파일경로
	 * @return Map - fileName파일경로, GeoJSON(Geometry)
	 * */
	@SuppressWarnings("unused")
	@ResponseBody
	@RequestMapping(value="/upShpFile.ajax")
	public Map<String,Object> upShpFileAjax(HttpServletRequest request){
		Map<String,Object> returnMap = new HashMap<String,Object>();
		
		returnMap = uploadService.getFileLayer(request,"file");
		
		return returnMap;
	}
}
