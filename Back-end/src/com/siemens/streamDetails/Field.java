package com.siemens.streamDetails;

public class Field {

	private String propertyURI;
	private String propertyName;
	private String dataType;
	private String name;
	private String showOnCityDashboard;
	private String equals;
	
	public Field() {
		super();
	}
	public Field(String propertyURI, String propertyName, String dataType, String name, String showOnCityDashboard, String equals) {
		super();
		this.propertyURI = propertyURI;
		this.propertyName = propertyName;
		this.dataType = dataType;
		this.showOnCityDashboard = showOnCityDashboard;
		this.equals = equals;
		this.setName(name);
	}
	
	public String getEquals() {
		return equals;
	}
	public void setEquals(String equals) {
		this.equals = equals;
	}
	public String getShowOnCityDashboard() {
		return showOnCityDashboard;
	}
	public void setShowOnCityDashboard(String showOnCityDashboard) {
		this.showOnCityDashboard = showOnCityDashboard;
	}
	public String getPropertyURI() {
		return propertyURI;
	}
	public void setPropertyURI(String propertyURI) {
		this.propertyURI = propertyURI;
	}
	public String getPropertyName() {
		return propertyName;
	}
	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
