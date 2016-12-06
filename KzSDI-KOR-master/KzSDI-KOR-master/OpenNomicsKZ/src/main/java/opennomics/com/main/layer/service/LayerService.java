package opennomics.com.main.layer.service;

import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;

import opennomics.com.main.layer.domain.LayerVO;
import opennomics.geosolutions.geoserver.rest.GeoServerRESTManager;
import opennomics.geosolutions.geoserver.rest.decoder.RESTDataStore;
import opennomics.geosolutions.geoserver.rest.decoder.RESTFeatureType;



/**
 * 레이어와 관련된 데이터를 처리한다.
 * 
 * @author SG.Lee
 * @Date 2016.05
 * */
public interface LayerService {
 
	/**
	 * GeoServer에서 승인된 레이어의 이름을 조회한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @return List<JSONObject>
	 */
	public List<JSONObject> selectAPLayerNames();
	
	
	/**
	 * 새로 요청한 레이어 정보조회를 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 저장 요청정보 
	 * @return JSONObject
	 */
	public JSONObject selectDBReqestLayers(Map<String, Object> infoMap);
	
	/**
	 * Geoserver에서 레이어정보를 조회한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param tname - 테이블이름 
	 * @return LayerVO
	 */
	public LayerVO getAppLayerInfo(String tname);
	

	/**
	 * 새로 요청한 레이어 저장을 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param rid - 접수번호
	 * @param layerMap - 레이어정보
	 * @param attInfo - 속성정보
	 * @param tname - 테이블이름 
	 * @return JSONObject
	 */
	public JSONObject insertLayers(int rid, List<Map<String,Object>> layerMap,Map<String, String> attInfo, String tname);
	
	/**
	 * 검수 후 레이어 저장을 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param rid - 접수번호
	 * @param oidList - oid 리스트
	 * @return 
	 */
	public void insertQaAfter(int rid, List<Integer> oidList);
	
	/**
	 * 최종승인정보 저장을 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param rid - 접수번호
	 * @param oidList - oid 리스트
	 * @return 
	 */
	public void insertLastApproval(int rid, List<Integer> oidList);
	
	
	/**
	 * 최종거절정보 저장을 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param rid - 접수번호
	 * @param oidList - oid 리스트
	 * @return 
	 */
	public void insertLastDisApproval(int rid, List<Integer> oidList);
	
	/**
	 * 검수 전 레이어 조회를 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 조회정보
	 * @return JSONObject
	 */
	public JSONObject selectQApreLayer(Map<String, Object> infoMap);
	
	/**
	 * 검수 후 레이어 조회를 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param infoMap - 조회정보
	 * @return JSONObject
	 */
	public JSONObject selectQAafLayer(Map<String, Object> infoMap);
	

	/**
	 * 검수 후 레이어의 oid 조회를 요청한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.05
	 * @param rid - 접수번호
	 * @return List<Integer>
	 */
	public List<Integer> selectQaAfterOids(int rid); 
}
 