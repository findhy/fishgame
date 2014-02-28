package com.game.fish.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Jay
 *
 */
public class DeviceInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4369750317434585668L;
	/**
	 * id
	 */
	private long id;
	/**
	 * 设备uuid，设备的唯一标识
	 */
	private String uuid;
	/**
	 * 设备类型
	 */
	private String type;
	
	/**
	 * 首次登录1，以后登录用0；
	 */
	private int firstLogin;
	
	/**
	 * 版本号，区分不通的渠道
	 */
	private String version;
	/**
	 * 渠道id
	 */
	private String platform;
	/**
	 * 更新时间
	 */
	private Date updateTime;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public int getFirstLogin() {
		return firstLogin;
	}
	public void setFirstLogin(int firstLogin) {
		this.firstLogin = firstLogin;
	}
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
}
