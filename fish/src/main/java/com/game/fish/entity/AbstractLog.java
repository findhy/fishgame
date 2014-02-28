package com.game.fish.entity;

import java.io.Serializable;
import java.util.Date;

public abstract class AbstractLog implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected long id;
	protected String deviceUUID;
	/**
	 * 0,消耗；1，产出
	 */
	protected int logType;
	
	/**
	 * 具体的日志业务埋点
	 */
	protected String logEnum;

	protected Date updateTime;
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDeviceUUID() {
		return deviceUUID;
	}

	public void setDeviceUUID(String deviceUUID) {
		this.deviceUUID = deviceUUID;
	}

	public int getLogType() {
		return logType;
	}

	public void setLogType(int logType) {
		this.logType = logType;
	}

	public String getLogEnum() {
		return logEnum;
	}

	public void setLogEnum(String logEnum) {
		this.logEnum = logEnum;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	
}
