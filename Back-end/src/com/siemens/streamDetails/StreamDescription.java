package com.siemens.streamDetails;


public class StreamDescription {
	
	private String status;
	private StreamDescriptionData data;
	public StreamDescription() {
		super();
	}
	public StreamDescription(String status, StreamDescriptionData data) {
		super();
		this.status = status;
		this.data = data;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public StreamDescriptionData getData() {
		return data;
	}
	public void setData(StreamDescriptionData data) {
		this.data = data;
	}

}
