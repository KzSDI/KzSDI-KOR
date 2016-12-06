package opennomics.com.main.qa.persistent;

import java.util.List;
import java.util.Map;

import opennomics.com.main.qa.domain.QAErrReportVO;
import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * 오류리포트와 관련된 DB처리를 한다.
 * 
 * @author SG.Lee
 * @Date 2016.06
 * */
@Mapper(value = "errReportMapper")
public interface ErrReportMapper {
	/**
	 * 오류리포트 저장을 위한 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param infoMap
	 *            - 오류리포트 정보
	 */
	public void insertQAreport(Map<String, Object> infoMap) throws Exception;

	/**
	 * 접수번호에 해당하는 오류리포트를 조회하는 DB처리를 한다.
	 * 
	 * @author SG.Lee
	 * @data 2016.04
	 * @param rid
	 *            - 접수번호
	 * @return List<QAErrReportVO>
	 */
	public List<QAErrReportVO> selectErrReports(int rid) throws Exception;
}
