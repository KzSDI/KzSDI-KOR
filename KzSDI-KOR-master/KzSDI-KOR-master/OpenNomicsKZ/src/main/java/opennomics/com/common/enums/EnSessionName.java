package opennomics.com.common.enums;



public enum EnSessionName {
	
	SERVERMANAGER_SESSION("servermanager", String.class),
	GEOSERVERVO_SESSION("gservervo", String.class),
	LAYERLIST_SESSION("layerlist", String.class)
	;

	
	String sessionName;
	Class<?> cl;

	EnSessionName(String sessionName, Class<?> cl) {
		this.sessionName = sessionName;
		this.cl = cl;
	}

	public String getSessionName() {
		return sessionName;
	}

	public void setSessionName(String sessionName) {
		this.sessionName = sessionName;
	}
	
	public Class<?> getCl() {
		return cl;
	}

	public void setCl(Class<?> cl) {
		this.cl = cl;
	}

}
