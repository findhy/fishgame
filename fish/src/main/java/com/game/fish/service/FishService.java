package com.game.fish.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.game.fish.base.DataBean;
import com.game.fish.base.ParamBean;
import com.game.fish.entity.PointInfo;
import com.game.fish.dao.FishDao;
import com.game.fish.entity.CoinLog;
import com.game.fish.entity.DeviceInfo;
import com.game.fish.entity.ItemLog;
import com.game.fish.util.Page;

/**
 * service层
 * @author sunwill
 *
 */
@Service
@Transactional
public class FishService {

	@Autowired
	private FishDao fishDao;
	
	/**-------------------------------------------------------------**/
	/**角色留存指标统计[retentionIndex]-BEGIN
	 * @throws ParseException **/
	public Page<DataBean> retentionIndex(Page<DataBean> page) throws ParseException{
		//开始时间和结束时间
		String beginDate;
		String endDate;
		if(page.getParam()!=null&&page.getParam().getBeginDate()!=null&&!page.getParam().getBeginDate().equals("")){
			beginDate = page.getParam().getBeginDate();
			if(page.getParam()!=null&&page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
				endDate = page.getParam().getEndDate();
			}else{
				endDate  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			}
		}else{
			beginDate  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			if(page.getParam()!=null&&page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
				endDate = page.getParam().getEndDate();
			}else{
				endDate  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			}
		}
		
		//首日激活数
		Long firstDayActications = this.fishDao.getFirstDayActications(new SimpleDateFormat("yyyy-MM-dd").parse(beginDate));
		if(firstDayActications==0) firstDayActications=1L;//如果首日激活数为，则设置为1？这个待确认
		
		
		//拼接SQL
		StringBuilder sql = new StringBuilder();
		sql.append("select '").append(beginDate).append(" 到 ").append(endDate).append("' time,");
		//新增设备数
		sql.append("(select count(distinct uuid) count from device_info t where t.firstLogin=1 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(") count1 , ");
		
		//累计登录设备
		sql.append("(select count(distinct uuid) count from device_info t where 1=1");
		sql = sqlCondition(sql,page.getParam());
		sql.append(") count2 , ");
		//次日留存
		sql.append("(/*次日留存*/select count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 1 day))");
		sql = sqlCondition(sql,page.getParam());
		sql.append(")/? retention1 , (");
		//三日留存
		sql.append("/*三日留存*/select count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 3 day)) ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(")/? retention2 , (");
		//七日留存
		sql.append("/*七日留存*/select count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 7 day)) ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(")/? retention3 , (");
		//1月留存
		sql.append("/*一个月留存*/select count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 1 MONTH)) ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(")/? retention4 , (");
		//流失用户
		sql.append("/*流失用户*/select count(distinct o.uuid) from (");
		sql.append(" select t.uuid,max(t.updateTime) time from device_info t where 1=1 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.uuid) o where TIMESTAMPDIFF(DAY,time,curdate())>7 ");
		sql.append(") count3");
		
		return this.fishDao.queryPage(page, sql, new Object[]{beginDate,firstDayActications,beginDate,firstDayActications,beginDate,firstDayActications,beginDate,firstDayActications}, DataBean.class);
	}
	/**角色留存指标统计[retentionIndex]-END**/
	/**-------------------------------------------------------------**/
	
	/**日活、周活、月活查询[dayWeekMonQuery]-BEGIN**/
	public Page<DataBean> dayWeekMonQuery(Page<DataBean> page){
		StringBuilder sql = new StringBuilder();
		
		String conType = "'%Y年-%m月-%d日'";//统计类型，默认按天
		
		if(page.getParam()!=null&&page.getParam().getCycle()!=null){
			if(page.getParam().getCycle().equals("Week")){
				conType = "'%X年-第%V周'";
			}else if(page.getParam().getCycle().equals("Month")){
				conType = "'%Y年-%m月'";
			}else if(page.getParam().getCycle().equals("Hour")){
				conType = "'%Y年-%m月-%d日 %H时'";
			}else if(page.getParam().getCycle().equals("Time")){
				//按时间段查询不分组，直接查询给定时间段的数量
				if(page.getParam().getBeginDate()!=null&&!page.getParam().getBeginDate().equals("")){
					StringBuilder timeSql = new StringBuilder();
					timeSql.append("SELECT '").append(page.getParam().getBeginDate()).append(" 到 ");
					if(page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
						timeSql.append(page.getParam().getEndDate()).append("' time, ");
					}else{
						timeSql.append(new SimpleDateFormat("yyyy-MM-dd").format(new Date())).append("' time, ");
					}
					timeSql.append("COUNT(DISTINCT t.uuid) count from device_info t WHERE t.firstLogin =0 ");
					
					if(page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
						timeSql.append(" and t.updateTime between date_format('").append(page.getParam().getBeginDate())
						.append("','%Y-%m-%d') and date_format('").append(page.getParam().getEndDate()).append("','%Y-%m-%d')");
					}else{
						timeSql.append(" and t.updateTime between date_format('").append(page.getParam().getBeginDate())
						.append("','%Y-%m-%d') and date_format('").append(new SimpleDateFormat("yyyy-MM-dd").format(new Date())).append("','%Y-%m-%d')");
					}
					
					return this.fishDao.queryPage(page, timeSql, new Object[]{}, DataBean.class);
				}else{
					return this.fishDao.queryPage(page, new StringBuilder("SELECT '所有时间' time, COUNT(DISTINCT t.uuid) count from device_info t WHERE t.firstLogin =0 "), new Object[]{}, DataBean.class);
				}
			}
		}
		
		
		sql.append("SELECT date_format(t.updateTime,").append(conType).append(") time,COUNT(DISTINCT t.uuid) count FROM device_info t ")
		.append("WHERE t.firstLogin =0 ");
		
		//查询条件
		sql = sqlCondition(sql,page.getParam());
		
		sql.append(" group by date_format(t.updateTime,").append(conType).append(")");
		sql.append(" order by t.updateTime");
		return this.fishDao.queryPage(page, sql, new Object[]{}, DataBean.class);
	}
	/**日活、周活、月活查询[dayWeekMonQuery]-END**/
	
	/**-------------------------------------------------------------**/
	
	/**24小时用户分布[hoursDistributed]-BEGIN**/
	public Page<DataBean> hoursDistributed(Page<DataBean> page){
		StringBuilder sql = new StringBuilder();
		sql.append("select n.time,n.count,n.count/m.cnt*100 percent from (")
		.append(" SELECT  t.updateTime,firstLogin,date_format(t.updateTime,'%Y年-%m月-%d日 %H时') time,")
		.append("COUNT(DISTINCT t.uuid) count from device_info t WHERE t.firstLogin =0  ");
		
		//查询条件
		sql = sqlCondition(sql,page.getParam());
		
		sql.append(" group by date_format(t.updateTime,'%Y年-%m月-%d日 %H时') order by t.updateTime) n left join (")
		.append("select date_format(o.updateTime,'%Y-%m-%d') datetime,count(DISTINCT o.uuid) cnt from device_info o where o.firstLogin =0 ")
		.append("group by date_format(o.updateTime,'%Y-%m-%d')) m on m.datetime=date_format(n.updateTime,'%Y-%m-%d')");
		
		return this.fishDao.queryPage(page, sql, new Object[]{},DataBean.class);
	}
	/**24小时用户分布[hoursDistributed]-END**/
	
	/**-------------------------------------------------------------**/
	
	/**货币数据查询[currencyDataQuery]-BEGIN**/
	public Page<DataBean> currencyDataQuery(Page<DataBean> page){
		/**
		 * 核心SQL
		 */
		/*select t1.time,t1.count,t1.count/t2.count*100 percent,t3.count,t3.logEnum,t4.count from (
		select date_format(t.updateTime,'%Y-%m-%d') time,sum(t.coinnum) count from coin_log t where t.logtype=1 and logEnum!='ActivityDay'
		group by date_format(t.updateTime,'%Y-%m-%d')系统产出金币
		) t1 join (
		select date_format(t.updateTime,'%Y-%m-%d') time,sum(t.coinnum) count from coin_log t where t.logtype=1
		and logEnum='ActivityDay'
		group by date_format(t.updateTime,'%Y-%m-%d')系统赠送金币
		) t2 on t1.time=t2.time join (
		select date_format(t.updateTime,'%Y-%m-%d') time,sum(t.coinnum) count,t.logEnum logEnum from coin_log t where t.logtype=0 and t.coinnum<0
		group by date_format(t.updateTime,'%Y-%m-%d'),t.logEnum系统消耗金币和消耗用途
		) t3 on t3.time=t1.time join(
		select date_format(t.updateTime,'%Y-%m-%d') time,sum(t.coinnum) count from coin_log t
		group by date_format(t.updateTime,'%Y-%m-%d')系统剩余金币
		) t4 on t1.time=t4.time*/
		
		StringBuilder sql = new StringBuilder();
		
		String conType = "'%Y年-%m月-%d日'";//统计类型，默认按天
		
		if(page.getParam()!=null&&page.getParam().getCycle()!=null){
			if(page.getParam().getCycle().equals("Week")){
				conType = "'%X年-第%V周'";
			}else if(page.getParam().getCycle().equals("Month")){
				conType = "'%Y年-%m月'";
			}else if(page.getParam().getCycle().equals("Hour")){
				conType = "'%Y年-%m月-%d日 %H时'";
			}else if(page.getParam().getCycle().equals("Time")){
				StringBuilder timeSql = new StringBuilder();
				//按时间段查询不分组，直接查询给定时间段的数量
				if(page.getParam().getBeginDate()!=null&&!page.getParam().getBeginDate().equals("")){
					timeSql.append("SELECT '").append(page.getParam().getBeginDate()).append(" 到 ");
					if(page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
						timeSql.append(page.getParam().getEndDate()).append("' time, ");
					}else{
						timeSql.append(new SimpleDateFormat("yyyy-MM-dd").format(new Date())).append("' time, ");
					}
				}else{
					timeSql.append("SELECT '所有时间' time, ");
				}
				timeSql.append("t1.count,t1.count/t2.count*100 percent,t3.count coinCount1,t3.logEnum,t4.count coinCount2 from ( ");
				
				/*系统产出金币*/
				timeSql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count from coin_log t where t.logtype=1 and logEnum!='ActivityDay' ");
				timeSql = sqlCondition(timeSql,page.getParam());
				timeSql.append(") t1 join (");
				/*系统赠送金币*/
				timeSql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count from coin_log t where t.logtype=1 and logEnum='ActivityDay' ");
				timeSql = sqlCondition(timeSql,page.getParam());
				timeSql.append(") t2 on t1.time=t2.time join (");
				/*系统消耗金币和消耗用途*/
				timeSql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count,t.logEnum logEnum from coin_log t where t.logtype=0 and t.coinnum<0 ");
				timeSql = sqlCondition(timeSql,page.getParam());
				timeSql.append(") t3 on t3.time=t1.time join(");
				/*系统剩余金币*/
				timeSql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count from coin_log t where 1=1 ");
				timeSql = sqlCondition(timeSql,page.getParam());
				timeSql.append(") t4 on t1.time=t4.time");
				
				return this.fishDao.queryPage(page, timeSql, new Object[]{}, DataBean.class);
			}
		}
		
		sql.append("select t1.time,t1.count,t1.count/t2.count*100 percent,t3.count coinCount1,t3.logEnum,t4.count coinCount2 from (");
		/*系统产出金币*/
		sql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count from coin_log t where t.logtype=1 and logEnum!='ActivityDay' ");
		sql = sqlCondition(sql,page.getParam());
		sql.append("group by date_format(t.updateTime,").append(conType).append(")/*系统产出金币*/");
		sql.append(") t1 join (");
		/*系统赠送金币*/
		sql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count from coin_log t where t.logtype=1 and logEnum='ActivityDay' ");
		sql = sqlCondition(sql,page.getParam());
		sql.append("group by date_format(t.updateTime,").append(conType).append(")/*系统赠送金币*/");
		sql.append(") t2 on t1.time=t2.time join (");
		/*系统消耗金币和消耗用途*/
		sql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count,t.logEnum logEnum from coin_log t where t.logtype=0 and t.coinnum<0 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append("group by date_format(t.updateTime,").append(conType).append("),t.logEnum/*系统消耗金币和消耗用途*/");
		sql.append(") t3 on t3.time=t1.time join(");
		/*系统剩余金币*/
		sql.append("select date_format(t.updateTime,").append(conType).append(") time,sum(t.coinnum) count from coin_log t where 1=1 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append("group by date_format(t.updateTime,").append(conType).append(")/*系统剩余金币*/");
		sql.append(") t4 on t1.time=t4.time");
		
		return this.fishDao.queryPage(page, sql, new Object[]{}, DataBean.class);
	}
	/**货币数据查询[currencyDataQuery]-END**/
	
	/**-------------------------------------------------------------**/
	
	/**关卡滞留数据查询[checkpointRetentionDataQuery]-BEGIN**/
	public Page<DataBean> checkpointRetentionDataQuery(Page<DataBean> page){
		//获取查询条件下（时间和平台）所有模式的所有用户数量
		StringBuilder sql = new StringBuilder("select count(distinct t.deviceuuid) from point_info t where 1=1 ");
		sql = sqlCondition(sql,page.getParam());
		Long countUuid = this.fishDao.getJdbcTemplate().queryForObject(sql.toString(), Long.class);
		
		//获取列表数据
		sql = new StringBuilder("select t.point_id pointId,count(distinct t.deviceuuid) count1,count(t.deviceuuid) count2,count(distinct t.deviceuuid)/?*100 percent from point_info t where 1=1 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.point_id");
		
		return this.fishDao.queryPage(page, sql, new Object[]{countUuid},DataBean.class);
	}
	/**关卡滞留数据查询[checkpointRetentionDataQuery]-END**/
	
	/**--------------------------------------------------------------**/
	
	/**道具消耗查询[propsConsumingQuery]-BEGIN**/
	public Page<DataBean> propsConsumingQuery(Page<DataBean> page){
		StringBuilder sql = new StringBuilder();
		sql.append("select date_format(t.updateTime,'%Y年-%m月-%d日 %H时') time,t.itemId item,count(itemId) count from item_log t where t.logType=0 ");
		
		//查询条件
		sql = sqlCondition(sql,page.getParam());
		
		sql.append(" group by date_format(t.updateTime,'%Y年-%m月-%d日 %H时'),t.itemId order by date_format(t.updateTime,'%Y年-%m月-%d日 %H时')");
		
		return this.fishDao.queryPage(page, sql, new Object[]{},DataBean.class);
	}
	/**道具消耗查询[propsConsumingQuery]-END**/
	
	/**--------------------------------------------------------------**/
	
	/**手机型号统计[phoneModelStatistics]-BEGIN**/
	public Page<DataBean> phoneModelStatistics(Page<DataBean> page){
		StringBuilder sql = new StringBuilder();
		sql.append("select t.type time,count(distinct t.uuid) count,count(distinct t.uuid)/(select count(distinct o.uuid) "
				+ "from device_info o)*100 percent from device_info t where 1=1 ");
		
		//查询条件
		sql = sqlCondition(sql,page.getParam());
		
		sql.append(" group by t.type");
		
		return this.fishDao.queryPage(page, sql, new Object[]{},DataBean.class);
	}
	/**手机型号统计[phoneModelStatistics]-END**/
	
	/**--------------------------------------------------------------**/
	
	/**渠道统计[channelStatistics]-BEGIN
	 * @throws ParseException **/
	public Page<DataBean> channelStatistics(Page<DataBean> page) throws ParseException{
		//开始时间和结束时间
		String beginDate;
		String endDate;
		if(page.getParam()!=null&&page.getParam().getBeginDate()!=null&&!page.getParam().getBeginDate().equals("")){
			beginDate = page.getParam().getBeginDate();
			if(page.getParam()!=null&&page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
				endDate = page.getParam().getEndDate();
			}else{
				endDate  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			}
		}else{
			beginDate  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			if(page.getParam()!=null&&page.getParam().getEndDate()!=null&&!page.getParam().getEndDate().equals("")){
				endDate = page.getParam().getEndDate();
			}else{
				endDate  = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			}
		}
		
		//首日激活数
		Long firstDayActications = this.fishDao.getFirstDayActications(new SimpleDateFormat("yyyy-MM-dd").parse(beginDate));
		if(firstDayActications==0) firstDayActications=1L;//如果首日激活数为，则设置为1？这个待确认
		
		//拼接SQL
		StringBuilder sql = new StringBuilder();
		sql.append("select t1.platform channelId,p.channel_name channelName,t1.count count1,t2.count count2,t3.count/? retention1,");
		sql.append("t4.count/? retention2,t5.count/? retention3,t6.count/? retention4,t7.count count3 from (");
		//新增设备数
		sql.append("select t.platform,count(distinct uuid) count from device_info t where 1=1 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform ) t1 left join (");
		
		//累计登录设备
		sql.append("select t.platform,count(distinct uuid) count from device_info t where t.firstLogin=1 ");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform ) t2 on t1.platform=t2.platform left join (");
		//次日留存
		sql.append("select t.platform,count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 1 day))");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform");
		sql.append(" ) t3 on t3.platform=t1.platform left join (");
		//三日留存
		sql.append("select t.platform,count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 3 day))");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform");
		sql.append(" ) t4 on t4.platform=t1.platform left join (");
		//七日留存
		sql.append("select t.platform,count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 7 day))");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform");
		sql.append(" ) t5 on t5.platform=t1.platform left join (");
		//1月留存
		sql.append("select t.platform,count(distinct t.uuid) count from device_info t where date_format(t.updatetime,'%Y-%m-%d')=date_format(?,'%Y-%m-%d')");
		sql.append(" and exists(select 1 from device_info o where o.uuid = t.uuid and date_format(o.updatetime,'%Y-%m-%d')=date_add(date_format(t.updatetime,'%Y-%m-%d'),INTERVAL 1 MONTH))");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform");
		sql.append(" ) t6 on t6.platform=t1.platform left join (");
		//活跃用户
		sql.append("select t.platform,count(distinct t.uuid) count from device_info t where not exists(");
		sql.append(" select o.uuid from (");
		sql.append(" select t.uuid,max(t.updateTime) time from device_info t group by t.uuid) o where TIMESTAMPDIFF(DAY,time,curdate())>7 and t.uuid=o.uuid)");
		sql = sqlCondition(sql,page.getParam());
		sql.append(" group by t.platform ) t7 on t7.platform=t1.platform left join channel_map p on p.channel_id=t1.platform");
		
		return this.fishDao.queryPage(page, sql, new Object[]{firstDayActications,firstDayActications,firstDayActications,firstDayActications,beginDate,beginDate,beginDate,beginDate}, DataBean.class);
	}
	/**渠道统计[channelStatistics]-END**/
	
	/**--------------------------------------------------------------**/
	
	/**渠道映射[channelMapping]-BEGIN**/
	public Page<DataBean> channelMapping(Page<DataBean> page){
		StringBuilder sql = new StringBuilder();
		sql.append("select t.channel_id channelId,t.channel_name channelName from channel_map t ");
		
		return this.fishDao.queryPage(page, sql, new Object[]{},DataBean.class);
	}
	
	public void channelMappingAdd(Page<DataBean> page){
		this.fishDao.update("insert into channel_map(channel_id,channel_name) values(?,?)", page.getParam().getChannelId(),page.getParam().getChannelName());
	}
	
	public void channelMappingEdit(Page<DataBean> page){
		this.fishDao.update("update channel_map p set p.channel_name=? where p.channel_id=?", page.getParam().getChannelName(),page.getParam().getChannelId());
	}
	
	public void channelMappingDelete(Page<DataBean> page){
		this.fishDao.update("delete from channel_map  where channel_id=?", page.getParam().getChannelId());
	}
	/**渠道映射[channelMapping]-END**/
	
	/**--------------------------------------------------------------**/
	
	/**收集信息[收集设备登录信息、金币信息、道具信息、关卡信息]-BEGIN**/
	public void collectDeviceInfo(DeviceInfo device){
		this.fishDao.updateObject("insert into device_info(uuid,type,version,platform,firstLogin,updateTime) values(:uuid,:type,:version,:platform,:firstLogin,now()); ", device);
	}
	
	public void collectCoinInfo(CoinLog coinLog){
		this.fishDao.updateObject("insert into coin_log(deviceUUID,logType,logEnum,coinNum,updateTime) values(:deviceUUID,:logType,:logEnum,:coinNum,now()); ", coinLog);
	}
	
	public void collectItemInfo(ItemLog itemLog){
		this.fishDao.updateObject("insert into item_log(deviceUUID,logType,logEnum,itemId,itemNum,updateTime) values(:deviceUUID,:logType,:logEnum,:itemId,:itemNum,now());", itemLog);
	}
	
	public void collectPointInfo(PointInfo point){
		this.fishDao.updateObject("insert into point_info(deviceuuid,point_id,updateTime) values(:uuid,:pointId,now()); ", point);
	}
	/**--------------------------------------------------------------**/
	
	/**UTIl-BEGIN**/
	public StringBuilder sqlCondition(StringBuilder sql,ParamBean param){
		if(param!=null){
			//平台条件
			if(param.getPlatform()!=null&&!param.getPlatform().equals("")){
				if(param.getPlatform().equals("IOS")){
					sql.append(" and t.type like 'iP%'");
				}else if(param.getPlatform().equals("Android")){
					sql.append(" and t.type like 'Android%'");
				}else if(param.getPlatform().equals("Unknown")){
					sql.append(" and t.type = 'Unknown'");
				}
			}
			
			//平台条件-需要关联device_info表的
			if(param.getDevicePlatform()!=null&&!param.getDevicePlatform().equals("")){
				if(param.getDevicePlatform().equals("IOS")){
					sql.append(" and exists(select 1 from device_info o where o.uuid=t.deviceuuid and o.type like 'iP%')");
				}else if(param.getDevicePlatform().equals("Android")){
					sql.append(" and exists(select 1 from device_info o where o.uuid=t.deviceuuid and o.type like 'Android%')");
				}else if(param.getDevicePlatform().equals("Unknown")){
					sql.append(" and exists(select 1 from device_info o where o.uuid=t.deviceuuid and o.type = 'Unknown')");
				}
			}
			
			//时间条件
			if(param.getBeginDate()!=null&&!param.getBeginDate().equals("")){
				if(param.getEndDate()!=null&&!param.getEndDate().equals("")){
					sql.append(" and t.updateTime between date_format('").append(param.getBeginDate())
					.append("','%Y-%m-%d') and date_format('").append(param.getEndDate()).append("','%Y-%m-%d')");
				}else{
					sql.append(" and t.updateTime between date_format('").append(param.getBeginDate())
					.append("','%Y-%m-%d') and date_format('").append(new SimpleDateFormat("yyyy-MM-dd").format(new Date())).append("','%Y-%m-%d')");
				}
			}
		}
		return sql;
	}
	/**UTIl-END**/
	
	/**--------------------------------------------------------------**/
}
