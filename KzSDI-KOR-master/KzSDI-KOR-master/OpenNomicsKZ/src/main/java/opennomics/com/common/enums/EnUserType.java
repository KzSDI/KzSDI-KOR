package opennomics.com.common.enums;



/**
 * User Type
 * @author SG.Lee
 * @Date 2016.05.22
 * */
public enum EnUserType {
	
	INSPECTOR("I", "inspector", 1),
	CHAIRMAN("C", "chairman", 2);
	String type;
	String typeName;
	int auth;
	

	EnUserType(String type, String typeName, int auth) {
		this.type = type;
		this.typeName = typeName;
		this.auth = auth;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public int getAuth() {
		return auth;
	}
	public void setAuth(int auth) {
		this.auth = auth;
	}
}
