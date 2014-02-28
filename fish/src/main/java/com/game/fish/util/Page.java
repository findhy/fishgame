package com.game.fish.util;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.game.fish.base.ParamBean;

/**
 * 处理内容:
 * @version: 1.0
 * @see:net.uni.util.Page.java
 * @date:2013-1-9
 * @author:孙伟
 */
public class Page<T> implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8910582765348717692L;
	public static int DEFAULT_PAGESIZE = 10;
	private List<T> list = new ArrayList<T>();// 数据list
	private int pageno = 1;// 页码
	private int rowsize = 20;// 每页多少条
	private int total=0;// 共有多少页
	private int totalrows=0;// 共有多少条记录
	private int start = 0;// 起始位置
	private boolean emptyMsg = true;//默认如果查询出来的数据为0条，在前端就alert提示一下
	
	private String dataIds;//数据ID串

	private ParamBean param;//页面表单参数对象
	
	public static Page getEmptyPage() {
		Page localPage = new Page();
		localPage.setRowsize(1);
		localPage.setList(new ArrayList());
		localPage.setTotal(1);
		localPage.setPageno(1);
		return localPage;
	}

	public int getTotalrows() {
		return this.totalrows;
	}

	public void setTotalrows(int paramInt) {
		this.totalrows = paramInt;
	}

	public List<T> getList() {
		return this.list;
	}

	public int getPageno() {
		return this.pageno;
	}

	public int getRowsize() {
		return this.rowsize;
	}

	public int getTotal() {
		return this.total;
	}

	public void setList(List<T> paramList) {
		this.list = paramList;
	}

	public void setPageno(int paramInt) {
		this.pageno = paramInt;
	}

	public void setRowsize(int paramInt) {
		this.rowsize = paramInt;
	}

	public void setTotal(int paramInt) {
		this.total = paramInt;
	}

	public int getStart() {
		return this.start;
	}

	public void setStart(int paramInt) {
		this.start = paramInt;
	}

	/**
	 * @return the dataIds
	 */
	public String getDataIds() {
		return dataIds;
	}

	/**
	 * @param dataIds the dataIds to set
	 */
	public void setDataIds(String dataIds) {
		this.dataIds = dataIds;
	}

	public void excecute() {
		if (this.pageno <= 0)
			this.pageno = 1;
		if (this.rowsize <= 0)
			this.rowsize = DEFAULT_PAGESIZE;
		int i = 1;
		if (this.totalrows <= (this.pageno - 1) * this.rowsize)
			if (this.totalrows % this.rowsize == 0)
				this.pageno = (this.totalrows / this.rowsize);
			else
				this.pageno = (this.totalrows / this.rowsize + 1);
		if (this.pageno <= 0)
			this.pageno = 1;
		i = this.rowsize * (this.pageno - 1);
		int j = 1;
		if (this.totalrows % this.rowsize == 0)
			j = this.totalrows / this.rowsize;
		else
			j = this.totalrows / this.rowsize + 1;
		this.total = j;
		this.start = i;
	}

	public boolean isEmptyMsg() {
		return emptyMsg;
	}

	public void setEmptyMsg(boolean emptyMsg) {
		this.emptyMsg = emptyMsg;
	}

	public ParamBean getParam() {
		return param;
	}

	public void setParam(ParamBean param) {
		this.param = param;
	}
}