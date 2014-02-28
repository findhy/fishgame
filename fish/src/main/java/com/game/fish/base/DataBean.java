package com.game.fish.base;

import java.util.HashMap;
import java.util.Map;

public class DataBean {

	private String time;//时段
	private String count;//数量
	private String percent;//百分比
	private String item;//道具
	
	/**
	 * 渠道ID
	 */
	private String channelId;
	/**
	 * 渠道名称
	 */
	private String channelName;
	
	/**
	 * 金币消耗用途
	 */
	private String logEnum;
	/**
	 * 金币1
	 */
	private String coinCount1;
	
	/**
	 * 金币2
	 */
	private String coinCount2;
	
	private String count1;
	private String count2;
	private String count3;
	
	private String retention1;
	private String retention2;
	private String retention3;
	private String retention4;
	
	private String pointId;
	
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		this.count = count;
	}
	public String getPercent() {
		return percent;
	}
	public void setPercent(String percent) {
		this.percent = percent;
	}
	public String getItem() {
		return item;
	}
	public void setItem(String item) {
		this.item = item;
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
	public String getLogEnum() {
		/**
		 * 设置金钱表枚举类型
		 */
		Map<String,String> coinType = new HashMap<String,String>();
		coinType.put("DoFlower", "吃到花朵");
		coinType.put("LevelUp", "升级");
		coinType.put("FinishBattle", "关卡结束");
		coinType.put("BattleCombo", "关卡连钓");
		coinType.put("SceneReward", "通关奖励");
		coinType.put("FeedFish", "喂鱼");
		coinType.put("HelpScene", "完成引导");
		coinType.put("God", "作弊");
		coinType.put("FishReward", "完成记录");
		coinType.put("ActivityDay", "每日奖励");
		coinType.put("ShopFood", "购买鱼食");
		coinType.put("ShopFloat", "购买鱼漂");
		coinType.put("ShopHook", "购买鱼钩");
		coinType.put("ShopSkill", "购买技能");
		coinType.put("OpenBox", "开宝箱");
		coinType.put("HelpMe", "复活");
		
		return coinType.get(logEnum);
	}
	public String getPointId() {
		return pointId;
	}
	public void setPointId(String pointId) {
		this.pointId = pointId;
	}
	public void setLogEnum(String logEnum) {
		this.logEnum = logEnum;
	}
	public String getCoinCount1() {
		return coinCount1;
	}
	public void setCoinCount1(String coinCount1) {
		this.coinCount1 = coinCount1;
	}
	public String getCoinCount2() {
		return coinCount2;
	}
	public void setCoinCount2(String coinCount2) {
		this.coinCount2 = coinCount2;
	}
	public String getRetention1() {
		return retention1;
	}
	public void setRetention1(String retention1) {
		this.retention1 = retention1;
	}
	public String getRetention2() {
		return retention2;
	}
	public void setRetention2(String retention2) {
		this.retention2 = retention2;
	}
	public String getRetention3() {
		return retention3;
	}
	public void setRetention3(String retention3) {
		this.retention3 = retention3;
	}
	public String getRetention4() {
		return retention4;
	}
	public void setRetention4(String retention4) {
		this.retention4 = retention4;
	}
	public String getCount1() {
		return count1;
	}
	public void setCount1(String count1) {
		this.count1 = count1;
	}
	public String getCount2() {
		return count2;
	}
	public void setCount2(String count2) {
		this.count2 = count2;
	}
	public String getCount3() {
		return count3;
	}
	public void setCount3(String count3) {
		this.count3 = count3;
	}
}
