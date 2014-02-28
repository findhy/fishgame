package com.game.fish.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author sunwill
 *
 */
public class PointInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6538930945344987389L;
	
	/**
	 * 设备uuid，设备的唯一标识
	 */
	private String uuid;
	/**
	 * 关卡
	 */
	private String pointId;
	/**
	 * 更新时间
	 */
	private Date updateTime;
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getPointId() {
		return pointId;
	}
	public void setPointId(String pointId) {
		this.pointId = pointId;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
}
