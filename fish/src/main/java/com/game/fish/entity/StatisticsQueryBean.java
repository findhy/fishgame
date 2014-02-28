package com.game.fish.entity;

import java.util.Date;

public class StatisticsQueryBean {
	private Date startTime;
	private Date dayAfterStart;
	private Date endTime;
	private int timeArea;
	private int retainedDay;
	private int statisticsType;
	
	public Date getStartTime() {
		return startTime;
	}
	public int getRetainedDay() {
		return retainedDay;
	}
	public void setRetainedDay(int retainedDay) {
		this.retainedDay = retainedDay;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public int getTimeArea() {
		return timeArea;
	}
	public void setTimeArea(int timeArea) {
		this.timeArea = timeArea;
	}
	public int getStatisticsType() {
		return statisticsType;
	}
	public void setStatisticsType(int statisticsType) {
		this.statisticsType = statisticsType;
	}
	public Date getDayAfterStart() {
		return dayAfterStart;
	}
	public void setDayAfterStart(Date dayAfterStart) {
		this.dayAfterStart = dayAfterStart;
	}
	
}
