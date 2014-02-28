/**
 * @author zhouyu
 * @datetime 2012-2-9下午5:38:40
 */
package com.game.fish.entity;

/**
 * 定时任务对象
 * 
 * @author zhouyu
 * 
 * @datetime 2012-2-9下午5:38:40
 */
public class TimeTaskBean{
	
	public static final String conSelectTimeTask ="conSelectTimeTask";
	public static final String getTimeTask ="timeTask";

	/**
	 * 开始时间
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:39:00
	 */
	private String begintime;

	/**
	 * 结束时间
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:39:05
	 */
	private String endtime;

	/**
	 * 最大执行次数
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:39:10
	 */
	private String maxcount;

	/**
	 * 间隔时长(分钟)
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:39:29
	 */
	private String interval;

	/**
	 * 上次执行时间
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:40:03
	 */
	private String lastExcTime;

	
	/**
	 * 公告类型
	 */
	private int type ;
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	/**
	 * 已经执行次数
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:40:16
	 */
	private String excCount;

	/**
	 * 状态
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:40:24
	 */
	private String sts;

	/**
	 * id
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:40:32
	 */
	private String id;

	/**
	 * 代码
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:40:40
	 */
	private String code;

	/**
	 * 内容
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:41:07
	 */
	private String content;

	/**
	 * 请求目标url
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:41:18
	 */
	private String url;

	/**
	 * 服务器
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:41:25
	 */
	private String server;

	/**
	 * 更新时间
	 * 
	 * @author zhouyu
	 * @datetime 2012-2-9下午5:41:38
	 */
	private String updatetime;

	/**
	 * 开始时间
	 * 
	 * 
	 * @author zhouyu
	 * @return the begintime
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getBegintime() {
		return begintime;
	}

	/**
	 * 开始时间
	 * 
	 * 
	 * @author zhouyu
	 * @param begintime
	 *            the begintime to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setBegintime(String begintime) {
		this.begintime = begintime;
	}

	/**
	 * 结束时间
	 * 
	 * 
	 * @author zhouyu
	 * @return the endtime
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getEndtime() {
		return endtime;
	}

	/**
	 * 结束时间
	 * 
	 * 
	 * @author zhouyu
	 * @param endtime
	 *            the endtime to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}

	/**
	 * 最大执行次数
	 * 
	 * 
	 * @author zhouyu
	 * @return the maxcount
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getMaxcount() {
		if(null == maxcount || maxcount.length() == 0){
			return "-1";
		}
		return maxcount;
	}

	/**
	 * 最大执行次数
	 * 
	 * 
	 * @author zhouyu
	 * @param maxcount
	 *            the maxcount to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setMaxcount(String maxcount) {
		this.maxcount = maxcount;
	}

	/**
	 * 间隔时长(分钟)
	 * 
	 * 
	 * @author zhouyu
	 * @return the interval
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getInterval() {
		return interval;
	}

	/**
	 * 间隔时长(分钟)
	 * 
	 * 
	 * @author zhouyu
	 * @param interval
	 *            the interval to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setInterval(String interval) {
		this.interval = interval;
	}

	/**
	 * 上次执行时间
	 * 
	 * 
	 * @author zhouyu
	 * @return the lastExcTime
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getLastExcTime() {
		return lastExcTime;
	}

	/**
	 * 上次执行时间
	 * 
	 * 
	 * @author zhouyu
	 * @param lastExcTime
	 *            the lastExcTime to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setLastExcTime(String lastExcTime) {
		this.lastExcTime = lastExcTime;
	}

	/**
	 * 已经执行次数
	 * 
	 * 
	 * @author zhouyu
	 * @return the excCount
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getExcCount() {
		return excCount;
	}

	/**
	 * 已经执行次数
	 * 
	 * 
	 * @author zhouyu
	 * @param excCount
	 *            the excCount to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setExcCount(String excCount) {
		this.excCount = excCount;
	}

	/**
	 * 状态
	 * 
	 * 
	 * @author zhouyu
	 * @return the sts
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getSts() {
		return sts;
	}

	/**
	 * 状态
	 * 
	 * 
	 * @author zhouyu
	 * @param sts
	 *            the sts to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setSts(String sts) {
		this.sts = sts;
	}

	/**
	 * id
	 * 
	 * 
	 * @author zhouyu
	 * @return the id
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getId() {
		return id;
	}

	/**
	 * id
	 * 
	 * 
	 * @author zhouyu
	 * @param id
	 *            the id to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setId(String id) {
		this.id = id;
	}


	/**
	 * 代码
	 * 
	 * 
	 * @author zhouyu
	 * @return the code
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getCode() {
		return code;
	}

	/**
	 * 代码
	 * 
	 * 
	 * @author zhouyu
	 * @param code
	 *            the code to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setCode(String code) {
		this.code = code;
	}

	/**
	 * 内容
	 * 
	 * 
	 * @author zhouyu
	 * @return the content
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 内容
	 * 
	 * 
	 * @author zhouyu
	 * @param content
	 *            the content to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setContent(String content) {
		this.content = content;
	}

	/**
	 * 请求目标url
	 * 
	 * 
	 * @author zhouyu
	 * @return the url
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getUrl() {
		return url;
	}

	/**
	 * 请求目标url
	 * 
	 * 
	 * @author zhouyu
	 * @param url
	 *            the url to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setUrl(String url) {
		this.url = url;
	}

	/**
	 * 服务器
	 * 
	 * 
	 * @author zhouyu
	 * @return the server
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getServer() {
		return server;
	}

	/**
	 * 服务器
	 * 
	 * 
	 * @author zhouyu
	 * @param server
	 *            the server to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setServer(String server) {
		this.server = server;
	}

	/**
	 * 更新时间
	 * 
	 * 
	 * @author zhouyu
	 * @return the updatetime
	 * @datetime 2012-2-9下午5:42:27
	 */
	public String getUpdatetime() {
		return updatetime;
	}

	/**
	 * 更新时间
	 * 
	 * 
	 * @author zhouyu
	 * @param updatetime
	 *            the updatetime to set
	 * @datetime 2012-2-9下午5:42:27
	 */
	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}

	public String toString() {
		String inv = ",          ";
		return begintime + inv + endtime + inv + maxcount + inv + interval + inv + id  + inv + type
				+ inv + code + inv + content + inv + url + inv + server + inv + updatetime + inv;
	}
}
