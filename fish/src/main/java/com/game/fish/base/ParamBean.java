package com.game.fish.base;

/**
 * 页面参数传递对象
 * @author sunwill
 *
 */
public class ParamBean {

	/**
	 * 平台 [Android、IOS、Unknown]
	 */
	private String platform;
	/**
	 * 平台 [Android、IOS、Unknown] 需要关联device_info表
	 */
	private String devicePlatform;
	/**
	 * 语言[Chinese、English、Japanese、Korean]
	 */
	private String language;
	/**
	 * 产品[Fish]
	 */
	private String product = "Fish";
	/**
	 * 统计周期[Day、Week、Month、Hour、Time]
	 */
	private String cycle;
	/**
	 * 统计开始时间
	 */
	private String beginDate;
	/**
	 * 统计结束时间
	 */
	private String endDate;
	/**
	 * 渠道ID
	 */
	private String channelId;
	/**
	 * 渠道名称
	 */
	private String channelName;
	
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public String getProduct() {
		return product;
	}
	public void setProduct(String product) {
		this.product = product;
	}
	public String getCycle() {
		return cycle;
	}
	public void setCycle(String cycle) {
		this.cycle = cycle;
	}
	public String getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getDevicePlatform() {
		return devicePlatform;
	}
	public void setDevicePlatform(String devicePlatform) {
		this.devicePlatform = devicePlatform;
	}
	public String getChannelId() {
		return channelId;
	}
	public void setChannelId(String channelId) {
		this.channelId = channelId;
	}
	public String getChannelName() {
		return channelName;
	}
	public void setChannelName(String channelName) {
		this.channelName = channelName;
	}
	
}
