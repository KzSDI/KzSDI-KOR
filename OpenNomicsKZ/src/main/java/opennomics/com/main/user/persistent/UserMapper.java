package opennomics.com.main.user.persistent;

import java.util.HashMap;

import opennomics.com.main.user.domain.UserVO;
import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * 사용자와 관련된 DB처리를 수행한다.
 * 
 * @author SG.Lee
 * @Date 2016.05
 * */
@Mapper(value = "userMapper")
public interface UserMapper {

	/**
	 * 사용자 로그인을 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param infoMap
	 *            - 로그인정보
	 * @return UserVO
	 */
	UserVO loginUserByInfo(HashMap<String, Object> infoMap) throws Exception;

}
