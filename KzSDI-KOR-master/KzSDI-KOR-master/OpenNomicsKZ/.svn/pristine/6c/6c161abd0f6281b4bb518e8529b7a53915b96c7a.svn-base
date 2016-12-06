package opennomics.com.main.chairman.service;

import opennomics.com.main.user.domain.UserVO;

import org.json.simple.JSONObject;



/**
 * 부의장과 관련된 데이터를 처리한다.
 * @author SG.Lee
 * @Date 2016.05
 * */
public interface ChairmanService {
	
		/**
		 * 승인요청에 관한 상세정보를 조회한다.
		 * 
		 * @author SG.LEE
		 * @data 2016.06
		 * @param rid - 접수번호
		 * @param tname - 테이블이름
		 * @return JSONObject
		 */
		JSONObject approvalRequestInfo(int rid, String tname) throws Exception;
		
		/**
		 * 최종승인에 관한 처리를 한다.
		 * 
		 * @author SG.LEE
		 * @data 2016.06
		 * @param rid - 접수번호
		 * @param chairman - 사용자정보
		 * @return 
		 */
		void updateLastApprovalRequest(int rid, UserVO chairman) throws Exception;

		
		/**
		 * 최종거절에 관한 처리를 한다.
		 * 
		 * @author SG.LEE
		 * @data 2016.06
		 * @param rid - 접수번호
		 * @param chairman - 사용자정보
		 * @return 
		 */
		void updateLastDisApprovalRequest(int rid, UserVO chairman) throws Exception;
}
