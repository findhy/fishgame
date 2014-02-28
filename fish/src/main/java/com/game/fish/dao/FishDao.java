package com.game.fish.dao;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.game.fish.base.AbstractDAO;
import com.game.fish.entity.ItemLog;

/**
 * 查询数据库层
 * @author sunwill
 * @date 2014-02-08
 */
public class FishDao extends AbstractDAO<ItemLog>{
	
	
	/**
	 * 获取游戏的开服时间，现在获取的方式是取表device_info中字段updateTime最小值，精度到天
	 * @return
	 */
	public Date getServiceOpenTime(){
		return this.getJdbcTemplate().queryForObject("select min(updateTime) from gamemaster.device_info;", Date.class);
	}
	
	/**
	 * 获取游戏首日激活数，用来计算留存
	 * @return
	 */
	public Long getFirstDayActications(Date date){
		//先获取游戏开服时间，也就是首日
		if(date==null) date = getServiceOpenTime();
		
		//查询首日激活数，一个设备号只算一次
		return this.getJdbcTemplate().queryForObject("select count(distinct uuid) from gamemaster.device_info o "
				+ "where date_format(o.updateTime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d');", Long.class,new SimpleDateFormat("yyyy-mm-dd").format(date));
	}
}
