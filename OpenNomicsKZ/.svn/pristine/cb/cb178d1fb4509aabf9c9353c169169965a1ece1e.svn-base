package opennomics.com.main.receipt.persistent;

import java.util.List;
import java.util.Map;

import opennomics.com.main.receipt.domain.ReceiptVO;
import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * 접수현황과 관련된 DB처리를 수행한다.
 * 
 * @author SG.Lee
 * @Date 2016.05
 * */
@Mapper(value = "receiptMapper")
public interface ReceiptMapper {
	
	/**
	 * 모든 접수목록 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param pageNum
	 *            - 페이지 번호
	 * @return List<ReceiptVO>
	 */
	List<ReceiptVO> selectAllReceiptList(int pageNum) throws Exception;

	/**
	 * 모든 접수목록수 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @return int
	 */
	int selectAllReceiptListCount() throws Exception;

	/**
	 * 부의장이 보는 접수목록 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param pageNum
	 *            - 페이지 번호
	 * @return List<ReceiptVO>
	 */
	List<ReceiptVO> selectChairReceiptList(int pageNum) throws Exception;

	/**
	 * 부의장이 보는 접수목록수 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @return int
	 */
	int selectChairReceiptListCount() throws Exception;

	/**
	 * 조건(접수상태)에 따르는 접수목록 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param infoMap
	 *            - 조회정보
	 * @return List<ReceiptVO>
	 */
	List<ReceiptVO> selectReceiptList(Map<String, Object> infoMap) throws Exception;

	/**
	 * 조건(접수상태)에 따르는 접수목록수 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param infoMap - 조회정보
	 * @return int
	 */
	int selectReceiptListCount(Map<String, Object> infoMap) throws Exception;

	/**
	 * 검수승인에 대한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param updateMap - 업데이트 정보
	 */
	void updateApprovalRequest(Map<String, Object> updateMap) throws Exception;

	/**
	 * 접수번호에 해당하는 접수정보를 조회하는 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param rid - 접수번호
	 * @return ReceiptVO
	 */
	ReceiptVO selectReceipt(int rid) throws Exception;

	/**
	 * 최종승인에 대한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param updateMap - 업데이트 정보
	 */
	void updateLastApprovalRequest(Map<String, Object> updateMap) throws Exception;

	/**
	 * 최종거절에 대한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param updateMap - 업데이트 정보
	 */
	void updateLastDisApprovalRequest(Map<String, Object> updateMap) throws Exception;
}
