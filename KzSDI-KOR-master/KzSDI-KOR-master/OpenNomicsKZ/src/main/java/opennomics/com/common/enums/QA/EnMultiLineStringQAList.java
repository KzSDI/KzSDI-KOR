package opennomics.com.common.enums.QA;

public enum EnMultiLineStringQAList {
	
	SMALLLENGTH("SL","SmallLength", 1),
	SELFENTITY("SE", "SelfEntity", 2),
	ENTITYDUPLICATED("ED", "EntityDuplicated", 2),
	ATTRIBUTEFIX("AF", "AttributeFix", 1),
	CONBREAK("CB","ConBreak", 1),
	CONOVERDEGREE("COV","ConOverDegree", 1),
	CONINTERSECTED("CI", "ConIntersected", 2),
	DUPLICATEDPOINT("DP", "DuplicatedPoint", 1),
	USELESSENTITY("UE", "UselessEntity", 1);
	
	String type;
	String typeName;
	int num;

	EnMultiLineStringQAList(String type, String typeName, int num) {
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
