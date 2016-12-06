package opennomics.com.main.layer.persistent;

import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;

import opennomics.com.main.layer.domain.LayerVO;
import opennomics.com.main.receipt.domain.ReceiptVO;
import egovframework.rte.psl.dataaccess.mapper.Mapper;



/**
 * 레이어와 관련된 DB처리를 수행한다.
 *
 * @author SG.Lee
 * @Date 2016.05
 * */
@Mapper(value="layerMapper")
public interface LayerMapper {

	/**
	 * 새로 요청한 레이어 정보조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 저장요청정보
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> selectDBReqestLayers(Map<String, Object> infoMap) throws Exception;
	
	/**
	 * 새로 요청한 레이어 저장을 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 저장 레이어 정보
	 * @return 
	 */
	public void insertLayers(Map<String,Object> layerMap) throws Exception;
	
	/**
	 * 검수 후 레이어 저장을 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 저장요청정보
	 * @return 
	 */
	public void insertQaAfter(Map<String, Integer> infoMap) throws Exception;
	
	/**
	 * 최종승인정보를 저장하기 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 승인정보
	 * @return 
	 */
	public void insertLastApproval(Map<String, Integer> infoMap) throws Exception;
	
	/**
	 * 최종거절정보를 저장하기 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 거절정보
	 * @return 
	 */
	public void insertLastDisApproval(Map<String, Integer> infoMap)throws Exception;
	
	/**
	 * 검수 전 레이어 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 조회정보
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> selectQApreLayer(Map<String, Object> infoMap)throws Exception;
	
	/**
	 * 검수 후 레이어 조회를 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 조회정보
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> selectQAafLayer(Map<String, Object> infoMap)throws Exception;
	
	/**
	 * 검수 후 레이어의 oid를 조회하기 위한 DB처리를 한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param rid - 접수번호
	 * @return List<Integer>
	 */
	public List<Integer> selectQaAfterOids(int rid)throws Exception;
}
