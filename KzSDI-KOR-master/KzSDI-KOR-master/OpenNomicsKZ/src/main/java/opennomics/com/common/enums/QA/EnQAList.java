package opennomics.com.common.enums.QA;

public enum EnQAList {
	
	SMALLLENGTH("SL","SmallLength", 0),
	SMALLAREA("SA", "SmallArea", 1),
	SELFENTITY("SE", "SelfEntity", 2),
	ENTITYDUPLICATED("ED", "EntityDuplicated", 3),
	ATTRIBUTEFIX("AF", "AttributeFix", 4),
	CONBREAK("CB","ConBreak", 5),
	CONOVERDEGREE("COV","ConOverDegree", 6),
	CONINTERSECTED("CI", "ConIntersected", 7),
	DUPLICATEDPOINT("DP", "DuplicatedPoint", 8),
	USELESSENTITY("UE", "UselessEntity", 9);
	
	String type;
	String typeName;
	int num;

	EnQAList(String type, String typeName, int num) {
		this.type = type;
		this.typeName = typeName;
		this.num = num;
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
	public int getNum() {
		return num;
	}
	public void setAuth(int num) {
		this.num = num;
	}
}
