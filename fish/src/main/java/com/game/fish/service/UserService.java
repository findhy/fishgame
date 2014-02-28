package com.game.fish.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.game.fish.dao.UserDao;
import com.game.fish.entity.UserInfo;
import com.game.fish.util.Page;

@Service
@Transactional
public class UserService {

	@Autowired
	private UserDao userDao;
	
	public String checkPassword(UserInfo user){
		List<String> res = this.userDao.getJdbcTemplate().queryForList("select userid from user_info o where o.userName=? and o.password=?", String.class, user.getUserName(),user.getPassword());
	    if(res!=null&&res.size()>0) return "OK";
		return "FAIL";
	}
	
	public Page<UserInfo> user(Page<UserInfo> page){
		return this.userDao.queryPage(page, new StringBuilder("select * from user_info o "), new Object[]{}, UserInfo.class);
	}
	
	public void userAdd(UserInfo user){
		this.userDao.updateObject("insert into user_info(password,userName,userType) values(:password,:userName,:userType);",user);
	}
	
	public void userEdit(UserInfo user){
		this.userDao.updateObject("update user_info o set o.password=:password,o.userName=:userName,o.usertype=:userType where o.userId=:userId;",user);
	}
	
	public void userDelete(UserInfo user){
		this.userDao.updateObject("delete from user_info where userId=:userId;",user);
	}
	
	public UserInfo getUser(UserInfo user){
		return this.userDao.queryObject("select * from user_info o where o.userName=?", UserInfo.class, user.getUserName());
	}
}
