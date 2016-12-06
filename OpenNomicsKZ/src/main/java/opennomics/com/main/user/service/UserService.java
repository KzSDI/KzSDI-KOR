package opennomics.com.main.user.service;

import java.util.HashMap;

import opennomics.com.main.user.domain.UserVO;

/**
 * 사용자와 관련된 데이터를 처리한다.
 * 
 * @author SG.Lee
 * @Date 2016.05
 * */
public interface UserService {

	/**
	 * 사용자 로그인을 요청한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param infoMap
	 *            - 로그인정보
	 * @return UserVO
	 */
	UserVO loginUserByInfo(HashMap<String, Object> infoMap) throws Exception;
}
