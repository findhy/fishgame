package com.game.fish.controller;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.game.fish.base.BaseController;
import com.game.fish.base.DataBean;
import com.game.fish.entity.PointInfo;
import com.game.fish.entity.UserInfo;
import com.game.fish.service.UserService;
import com.game.fish.util.Page;

@Controller
public class LoginController extends BaseController{
	
	@Autowired
	private UserService userService;
	/**--------------------------------------------------------------**/
	
	/**登录管理[login]-BEGIN**/
	
	/**
	 * 验证密码
	 * @param user
	 * @return
	 */
	@RequestMapping("/checkPassword")
	@ResponseBody
	public String checkPassword(@ModelAttribute("user") UserInfo user){
		return this.userService.checkPassword(user);
	}
	
	/**
	 * 登录到首页
	 * @param user
	 * @return
	 */
	@RequestMapping("/login")
	public String login(@ModelAttribute("user") UserInfo user,HttpServletRequest request){
		if("OK".equals(this.userService.checkPassword(user))){
			user = this.userService.getUser(user);
			request.setAttribute("userType", user.getUserType());
			return "layouts/main";
		}
		return "layouts/login";
	}
	
	/**
	 * 登出系统
	 * @param user
	 * @return
	 */
	@RequestMapping("/logout")
	public String logout(HttpServletRequest request,HttpServletResponse response){
		//session退出
		//清除session
        Enumeration<String> em = request.getSession().getAttributeNames();
        while(em.hasMoreElements()){
            request.getSession().removeAttribute(em.nextElement().toString());
        }
        request.getSession().invalidate();
		return "layouts/login";
	}
	/**登录管理[login]-END**/
	
	/**--------------------------------------------------------------**/

	/**--------------------------------------------------------------**/
	
	/**用户管理[user]-BEGIN**/
	@RequestMapping("/user")
	public String user(@ModelAttribute("page") Page<UserInfo> page){
		if(page==null){
			page = new Page<UserInfo>();
		}
		page = this.userService.user(page);
		
		return "user/user";
	}
	
	@RequestMapping("/user/add")
	public String userAdd(@ModelAttribute("user") UserInfo user){
	    this.userService.userAdd(user);
		
		return "forward:/user";
	}
	
	@RequestMapping("/user/edit")
	public String userEdit(@ModelAttribute("user") UserInfo user){
	    this.userService.userEdit(user);
		
		return "forward:/user";
	}
	
	@RequestMapping("/user/delete")
	public String userDelete(@ModelAttribute("user") UserInfo user){
	    this.userService.userDelete(user);
		
		return "forward:/user";
	}
	/**用户管理[user]-END**/
	
	/**--------------------------------------------------------------**/
}
