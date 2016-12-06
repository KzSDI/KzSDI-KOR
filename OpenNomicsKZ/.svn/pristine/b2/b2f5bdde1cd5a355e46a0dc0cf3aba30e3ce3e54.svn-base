package opennomics.com.main.qa.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import opennomics.com.main.qa.domain.QAErrReportVO;

import org.geotools.feature.SchemaException;
import org.json.simple.JSONObject;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;

/**
 * 클라이언트에게 요청받은 데이터를 가공한다.
 * 
 * @author dayeon.oh
 * @data 2016.02
 */
public interface QAService {

	/**
	 * 레이어 정보를 담고 있는 JSONObject를 검수한 결과를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param geojson
	 *            검수를 수행할 JSONObjects
	 * @return JSONObject
	 * @throws SchemaException
	 *             , IOException, NoSuchAuthorityCodeException, FactoryException
	 */
	public JSONObject qaNewLayer(JSONObject geojson) throws SchemaException, IOException, NoSuchAuthorityCodeException, FactoryException;

	/**
	 * Map형식의 오류리포트를 객체로 변환한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.02
	 * @param errList
	 *            오류리포트
	 * @return List<QAErrReportVO>
	 * @throws Exception
	 */
	public List<QAErrReportVO> listToErrReport(List<Map<String, Object>> errList) throws Exception;

	/**
	 * Map형식의 오류리포트를 객체로 변환한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.02
	 * @param rid
	 *            접수번호
	 * @param errReport
	 *            오류리포트
	 * @throws Exception
	 */
	public void insertQAreport(int rid, List<QAErrReportVO> errReport) throws Exception;

	/**
	 * Map형식의 오류리포트를 객체로 변환한다.
	 * 
	 * @author SG.LEE
	 * @data 2016.02
	 * @param rid
	 *            접수번호
	 * @return List<QAErrReportVO>
	 * @throws Exception
	 */
	public List<QAErrReportVO> selectErrReports(int rid) throws Exception;
}