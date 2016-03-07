package com.siemens.streamDetails;


public class MessageBus {
	
	private String routingKey;

	public MessageBus() {
		super();
	}
	
	public MessageBus(String routingKey) {
		super();
		this.routingKey = routingKey;
	}

	public String getRoutingKey() {
		return routingKey;
	}

	public void setRoutingKey(String routingKey) {
		this.routingKey = routingKey;
	}
	
	
}
