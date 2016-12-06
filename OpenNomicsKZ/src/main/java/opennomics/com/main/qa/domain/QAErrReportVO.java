package opennomics.com.main.qa.domain;

/**
 * 오류 레이어 객체를 생성한다.
 * 
 * @author dayeon.oh
 * @data 2016.02
 */
public class QAErrReportVO {

	String type;
	double numOfItems = 0;
	double numOfErr = 0;
	String ratioOfErr = "";
	double accuracy = 0;
	double weights = 0;
	double weightedValue;
	boolean checked;

	/**
	 * 오류 종류를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return String
	 */
	public String getType() {
		return type;
	}

	/**
	 * 오류 종류를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param type
	 *            오류 종류
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * 검수를 수행한 객체의 수를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return double
	 */
	public double getNumOfItems() {
		return numOfItems;
	}

	/**
	 * 검수를 수행한 객체의 수를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param numOfItems
	 *            검수를 수행한 객체의 수
	 */
	public void setNumOfItems(double numOfItems) {
		this.numOfItems = numOfItems;
	}

	/**
	 * 검수를 수행 후 오류가 있는 객체의 수를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return double
	 */
	public double getNumOfErr() {
		return numOfErr;
	}

	/**
	 * 검수를 수행 후 오류가 있는 객체의 수를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param numOfErr
	 *            오류가 있는 객체의 수
	 */
	public void setNumOfErr(double numOfErr) {
		this.numOfErr = numOfErr;
	}

	/**
	 * 오류가 있는 객체의 수의 비율을 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return String
	 */
	public String getRatioOfErr() {
		return ratioOfErr;
	}

	/**
	 * 검수를 수행 후 오류가 있는 객체의 수를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param ratioOfErr
	 *            오류가 있는 객체의 수의 비율
	 */
	public void setRatioOfErr(String ratioOfErr) {
		this.ratioOfErr = ratioOfErr;
	}

	/**
	 * 오류 종류의 정확도를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return double
	 */
	public double getAccuracy() {
		return accuracy;
	}

	/**
	 * 오류 종류의 정확도를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param accuracy
	 *            오류 종류의 정확도
	 */
	public void setAccuracy(double accuracy) {
		this.accuracy = accuracy;
	}

	/**
	 * 오류 종류의 가중치를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return double
	 */
	public double getWeights() {
		return weights;
	}

	/**
	 * 오류 종류의 가중치를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param weights
	 *            오류 종류의 가중치
	 */
	public void setWeights(double weights) {
		this.weights = weights;
	}

	/**
	 * 오류 종류의 정확도의 백분율을 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return double
	 */
	public double getWeightedValue() {
		return weightedValue;
	}

	/**
	 * 오류 종류의 정확도의 백분율을 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param weightedValue
	 * 오류 종류의 정확도의 백분율
	 */
	public void setWeightedValue(double weightedValue) {
		this.weightedValue = weightedValue;
	}

	/**
	 * 오류 종류의 검수 수행 여부를 반환한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @return boolean
	 */
	public boolean isChecked() {
		return checked;
	}

	/**
	 * 오류 종류의 검수 수행 여부를 설정한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param checked
	 *            오류 종류의 검수 수행 여부
	 */
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
}