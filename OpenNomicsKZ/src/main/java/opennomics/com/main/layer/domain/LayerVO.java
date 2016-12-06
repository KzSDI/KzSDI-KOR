package opennomics.com.main.layer.domain;

import java.io.Serializable;

import org.json.simple.JSONObject;


/**
 * 레이어정보
 * 
 * @author SG.Lee
 * @Date 2016.05
 * */
@SuppressWarnings("serial")
public class LayerVO implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private String wsName; //작업공간
	private String dsName; //저장소
	private String lName; //레이어이름
	private String srs; //좌표체계
	private JSONObject nbBox; 
	private String dsType; //저장소타입
	private String geomType; //공간정보타입
	private JSONObject attInfo;
	

	public LayerVO(){
		
	}
	
	public LayerVO(String wsName, String dsName, String lName, String srs, JSONObject nbBox, String dsType, String geomType, JSONObject attInfo){
		
		this.wsName = wsName;
		this.dsName = dsName;
		this.lName = lName;
		this.srs = srs;
		this.nbBox = nbBox;
		this.dsType = dsType;
		this.geomType = geomType;
		this.attInfo = attInfo;
	}
	
	
	public String getWsName() {
		return wsName;
	}
	public void setWsName(String wsName) {
		this.wsName = wsName;
	}
	public String getDsName() {
		return dsName;
	}
	public void setDsName(String dsName) {
		this.dsName = dsName;
	}
	public String getlName() {
		return lName;
	}
	public void setlName(String lName) {
		this.lName = lName;
	}
	public String getSrs() {
		return srs;
	}
	public void setSrs(String srs) {
		this.srs = srs;
	}
	public JSONObject getNbBox() {
		return nbBox;
	}
	public void setNbBox(JSONObject nbBox) {
		this.nbBox = nbBox;
	}
	public String getDsType() {
		return dsType;
	}
	public void setDsType(String dsType) {
		this.dsType = dsType;
	}
	public String getGeomType() {
		return geomType;
	}
	public void setGeomType(String geomType) {
		this.geomType = geomType;
	}

	public JSONObject getAttInfo() {
		return attInfo;
	}

	public void setAttInfo(JSONObject attInfo) {
		this.attInfo = attInfo;
	}
}
