package opennomics.com.main.user.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import opennomics.com.main.user.domain.UserVO;
import opennomics.com.main.user.persistent.UserMapper;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service
public class UserServiceImpl implements UserService {
	
	@Resource(name="userMapper")
	private UserMapper userMapper;
	
	@Override
	public UserVO loginUserByInfo(HashMap<String, Object> infoMap) throws Exception{
		return userMapper.loginUserByInfo(infoMap);
	}
}
