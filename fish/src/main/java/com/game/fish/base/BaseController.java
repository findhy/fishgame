package com.game.fish.base;

import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

/**
 * Controller基类，所有的Controller继承这个类
 * 
 * Multiaction Controller的基类. 对Spring的MultiActionController作了少量扩展，主要是对数据绑定校验的扩展,
 * 同时增加了{@link #saveMessage(HttpServletRequest, String) }，一个{@link #rendText(HttpServletResponse,String)}
 * @author sunwill
 */
public abstract class BaseController extends MultiActionController{

}
