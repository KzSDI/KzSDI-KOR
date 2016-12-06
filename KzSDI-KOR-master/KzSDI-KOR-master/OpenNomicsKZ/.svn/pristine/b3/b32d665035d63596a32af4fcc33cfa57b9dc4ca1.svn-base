package opennomics.com.common.qa;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import opennomics.com.main.qa.domain.QAErrReportVO;

import org.json.simple.JSONObject;

/**
 * 오류 리포트를 생성한다.
 * 
 * @author dayeon.oh
 * @data 2016.02
 */
public class QAErrReport {

	/**
	 * 검수 후 결과를 오류 레포트로 생성하여 배열형태로 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaReportJSON
	 *            검수 결과 정보를 담고 있는 JSONObject
	 * @return List<QAErrReportVO
	 */
	public List<QAErrReportVO> createQAErrReport(JSONObject qaReportJSON) {

		List<QAErrReportVO> errList = new ArrayList<QAErrReportVO>();

		Iterator iterator = qaReportJSON.keySet().iterator();
		while (iterator.hasNext()) {
			String qaOptionKey = (String) iterator.next();
			QAErrReportVO qaErrReportVO = (QAErrReportVO) qaReportJSON.get(qaOptionKey);

			double numOfItems = qaErrReportVO.getNumOfItems();
			double numOfErr = qaErrReportVO.getNumOfErr();
			double weight = qaErrReportVO.getWeights();

			qaErrReportVO.setRatioOfErr(getRatioOfErr(numOfErr, numOfItems));
			qaErrReportVO.setAccuracy(getAccuracy(numOfErr, numOfItems));
			qaErrReportVO.setWeightedValue(getWeightedValue(qaErrReportVO.getAccuracy(), weight));

			errList.add(qaErrReportVO);
		}
		return errList;
	}

	private String getRatioOfErr(double numOfErr, double numOfItems) {

		return (int) numOfErr + "/" + (int) numOfItems;
	}

	private double getAccuracy(double numOfErr, double numOfItems) {

		double accuracy = 1.0 - (numOfErr / numOfItems);

		return Double.parseDouble(String.format("%.2f", accuracy));
	}

	private double getWeightedValue(double accuracy, double weight) {

		double weightedValue = accuracy * weight;

		return Double.parseDouble(String.format("%.2f", weightedValue));
	}

}
