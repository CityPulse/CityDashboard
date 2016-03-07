package com.siemens.streamDetails;

import java.util.List;

public class StreamDescriptionData {

	private String sensorName;
	private String sensorType;
	private String sensorID;
	private String location;
	private MessageBus messagebus;
	private List<String> fields;
	private List<Field> field_array;
	
	
	public StreamDescriptionData() {
		super();
	}
	public StreamDescriptionData(String sensorName, String sensorType, String sensorID, String location,
			MessageBus messageBus, List<String> fields, List<Field> field_array) {
		super();
		this.sensorName = sensorName;
		this.sensorType = sensorType;
		this.sensorID = sensorID;
		this.location = location;
		this.messagebus = messageBus;
		this.fields = fields;
		this.field_array = field_array;	
	}
	public String getSensorType() {
		return sensorType;
	}
	public void setSensorType(String sensorType) {
		this.sensorType = sensorType;
	}
	public String getSensorName() {
		return sensorName;
	}
	public void setSensorName(String sensorName) {
		this.sensorName = sensorName;
	}
	public String getSensorID() {
		return sensorID;
	}
	public void setSensorID(String sensorID) {
		this.sensorID = sensorID;
	}
	public String getLocation() {
		
		if(location.contains("POINT"))
		{
			location = location.replace("POINT(", "");
			location = location.replace(")", "");
			location = location.replace(" ", ",");
		}
		else if(location.contains("LINESTRING"))
		{
			location = location.replace("LINESTRING(", "");
			location = location.replace(")", "");
			
			location = location.substring(0, location.indexOf(","));
			location = location.replace(" ", ",");
			
			/*location = location.replace(" ", ";");
			
			double lat_1 = Double.parseDouble(location.substring(0, location.indexOf(";")));
			double lon_1 = Double.parseDouble(location.substring(location.indexOf(";")+1, location.indexOf(",")));
			
			location = location.substring(location.indexOf(",")+2, location.length());
			
			double lat_2 = Double.parseDouble(location.substring(0, location.indexOf(";")));
			double lon_2 = Double.parseDouble(location.substring(location.indexOf(";")+1, location.length()));

			double lat_f = (lat_1+lat_2)/2;
			double lon_f = (lon_1+lon_2)/2;*/
			
		}
		
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public MessageBus getMessagebus() {
		return messagebus;
	}
	public void setMessagebus(MessageBus messagebus) {
		this.messagebus = messagebus;
	}
	public List<String> getFields() {
		return fields;
	}
	public void setFields(List<String> fields) {
		this.fields = fields;
	}
	public List<Field> getField_array() {
		return field_array;
	}
	public void setField_array(List<Field> field_array) {
		this.field_array = field_array;
	}
	
}
