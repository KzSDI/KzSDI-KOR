package opennomics.com.main.file.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;



/**
 * 클라이언트에게 요청받은 데이터를 가공한다.
 * @author SG.Lee
 * @Date 2015.12.22
 * */
public interface UploadService {

	/**
	 * SHP파일 읽는 것을 처리한다.
	 * 
	 * @author SG.LEE
	 * @data 2015.12
	 * @param request
 						- 클라이언트의 요청과 관련된 정보와 동작을 가지고 있는 객체
	 * @param folderName
 						- 저장폴더이름
	 * @return 
	 */
	public Map<String, Object> getFileLayer(HttpServletRequest request, String folderName);
}
