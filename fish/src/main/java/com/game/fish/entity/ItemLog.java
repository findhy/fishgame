package com.game.fish.entity;

public class ItemLog extends AbstractLog{

	/**
	 * 
	 */
	private static final long serialVersionUID = -5955872705789771530L;
	
	private String itemId;
	private int itemNum;
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	public int getItemNum() {
		return itemNum;
	}
	public void setItemNum(int itemNum) {
		this.itemNum = itemNum;
	}

}
