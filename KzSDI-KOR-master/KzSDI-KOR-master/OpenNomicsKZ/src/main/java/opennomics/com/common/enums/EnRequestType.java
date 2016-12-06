package opennomics.com.common.enums;

public enum EnRequestType {
	WAITING_REQUEST("W", "waiting", 0),
	INSPECTION_WAITING("I", "inspector", 1),
	PENDING_APPROVAL("P", "pending", 2),
	APPROVAL_REQUEST("A", "approval", 3),
	REFUSE_REQUEST("R", "refuse", 4);
	String type;
	String typeName;
	int stts;
	

	EnRequestType(String type, String typeName, int stts) {
		this.type = type;
		this.typeName = typeName;
		this.stts = stts;
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
	public int getstts() {
		return stts;
	}
	public void setstts(int stts) {
		this.stts = stts;
	}
}
