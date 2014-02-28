package com.game.fish.entity;

import java.util.Date;

public class UserInfo {
	private Integer userId;
	private String password;
	private String userName;
	private String lastIp;
	private Date lastTime;
	private Integer userType;//1为管理员 2为普通用户
	private String userTypeStr;
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getLastIp() {
		return lastIp;
	}
	public void setLastIp(String lastIp) {
		this.lastIp = lastIp;
	}
	public Date getLastTime() {
		return lastTime;
	}
	public void setLastTime(Date lastTime) {
		this.lastTime = lastTime;
	}
	
	public String getUserTypeStr() {
		if(this.userType==null) return "";
		if(new Integer(1).equals(this.userType)){
			return "管理员";
		}else{
			return "普通用户";
		}
	}
	public void setUserTypeStr(String userTypeStr) {
		this.userTypeStr = userTypeStr;
	}
	public Integer getUserType() {
		return userType;
	}
	public void setUserType(Integer userType) {
		this.userType = userType;
	}
	
}
