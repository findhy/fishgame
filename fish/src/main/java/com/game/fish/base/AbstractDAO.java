package com.game.fish.base;

import java.util.ArrayList;
import java.util.List;

import com.game.fish.util.MySql5PageHepler;
import com.game.fish.util.Page;
import com.game.fish.util.ReflectionUtils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

/**
 * 顶层DAO抽象类
 * 
 * @author sunwill
 * 
 */
public abstract class AbstractDAO<T> extends NamedParameterJdbcDaoSupport {

	protected Class<T> modelClass;
	
	@SuppressWarnings("unchecked")
	public AbstractDAO(){
		this.modelClass=ReflectionUtils.getSuperClassGenricType(getClass());
	}
	
	/**
	 * 日志对象
	 */
	protected transient Log log = LogFactory.getLog(getClass());

	/**
	 * 更新对象
	 * 
	 * @param sql
	 * @param T
	 * @return
	 */
	public int updateObject(String sql, Object obj) {
		SqlParameterSource par = new BeanPropertySqlParameterSource(obj);
		return this.getNamedParameterJdbcTemplate().update(sql, par);
	}

	/**
	 * 执行更新SQL
	 * 
	 * @param sql
	 * @param T
	 * @return
	 */
	public int update(String sql, Object... paramValue) {
		return this.getJdbcTemplate().update(sql, paramValue);
	}

	/**
	 * 批量执行SQL
	 * @param sql
	 * @return
	 */
	public int[] batchUpdate(String[] sql){
		return this.batchUpdate(sql);
	}
	
	/**
	 * 查詢對象
	 * 
	 * @param sql
	 * @param obj
	 * @param paramValue
	 * @return
	 */
	public T queryObject(String sql, Class<T> obj, Object... paramValue) {
		RowMapper<T> rowMapper = new BeanPropertyRowMapper<T>(obj);
		try {
			return this.getJdbcTemplate().queryForObject(sql, rowMapper, paramValue);
		} catch (Exception ex) {
			log.error("获取对象失败", ex);
			return null;
		}
	}

	/**
	 * 查询数据列表
	 * 
	 * @param sql
	 * @param obj
	 * @param paramValue
	 * @return
	 */
	protected <X> List<X> queryList(String sql, Class<X> obj, Object[] args) {
		RowMapper<X> rowMapper = new BeanPropertyRowMapper<X>(obj);
		return this.getJdbcTemplate().query(sql, args, rowMapper);
	}

	/**
	 * 查询分页
	 * 
	 * @param page
	 * @param querySql
	 * @param args
	 * @param obj
	 * @return
	 */
	public Page queryPage(Page page, StringBuilder querySql, Object[] args) {
		int total = count(querySql, args);
		List<T> list = new ArrayList<T>();
		if (total > 0) {
			page.setTotalrows(total);
			page.excecute();
			
			String sqlPage = MySql5PageHepler.getLimitString(querySql.toString(), page.getStart(),page.getRowsize());
			
			/*sqlPage.append("select * from (select page.*,rownum rn from (");
			sqlPage.append(querySql);
			sqlPage.append(") page where rownum<=? ) pagetable where rn>=?");*/
			
			
			if (args.length == 0) {
				//args = new Object[] { (page.getStart() + page.getRowsize()), page.getStart() + 1 };
			} else {
				Object[] objArray = new Object[args.length + 2];
				for (int i = 0; i < args.length; i++) {
					objArray[i] = args[i];
				}
				//objArray[args.length] = page.getStart() + page.getRowsize();
				//objArray[args.length + 1] = page.getStart() + 1;
				args = objArray;
			}
			list = queryList(sqlPage.toString(), modelClass, args);
			page.setList(list);
		}
		return page;
	}

	/**
	 * 查询分页 泛型
	 * @param page
	 * @param querySql
	 * @param args
	 * @param classz
	 * @return
	 */
	public <X> Page<X> queryPage(Page<X> page, StringBuilder querySql, Object[] args,Class<X> classz){
		int total = count(querySql, args);
		List<X> list = new ArrayList<X>();
		if (total > 0) {
			page.setTotalrows(total);
			page.excecute();
			
			String sqlPage = querySql.append(" limit ? ,?").toString();
			
			//MySql5PageHepler.getLimitString(querySql.toString(), page.getStart(),page.getRowsize());
			
			/*sqlPage.append("select * from (select page.*,rownum rn from (");
			sqlPage.append(querySql);
			sqlPage.append(") page where rownum<=? ) pagetable where rn>=?");*/
			
			if (args.length == 0) {
				args = new Object[] { page.getStart(), page.getRowsize() };
			} else {
				Object[] objArray = new Object[args.length + 2];
				for (int i = 0; i < args.length; i++) {
					objArray[i] = args[i];
				}
				objArray[args.length] = page.getStart();
				objArray[args.length + 1] = page.getRowsize();
				args = objArray;
			}
			list = queryList(sqlPage.toString(), classz, args);
			page.setList(list);
		}
		return page;
	
	}
	/**
	 * 查询SQL结果集数量
	 * 
	 * @param countSQL
	 * @param args
	 * @return
	 */
	protected int count(StringBuilder countSQL, Object[] args) {
		return this.getJdbcTemplate().queryForInt(new StringBuilder("select count(1) as count from(").append(countSQL).append(") counttable").toString(), args);
	}
	
	/**
	 * 获取表序列的下一个值（统一方法）
	 * @param tableName
	 * @return
	 */
	public Long getNextVal(String tableName){
		return this.getJdbcTemplate().queryForLong(new StringBuilder("select seq_").append(tableName).append(".nextval from dual").toString());
	}
}
