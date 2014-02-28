package com.game.fish.controller;


import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.game.fish.base.BaseController;
import com.game.fish.base.DataBean;
import com.game.fish.entity.CoinLog;
import com.game.fish.entity.DeviceInfo;
import com.game.fish.entity.ItemLog;
import com.game.fish.entity.PointInfo;
import com.game.fish.entity.UserInfo;
import com.game.fish.service.FishService;
import com.game.fish.util.Page;

/**
 * Fish Controller
 * @author sunwill
 * @date 2014-02-07
 */
@Controller
public class FishController extends BaseController{

	@Autowired
	private FishService fishService;
	
	/**-------------------------------------------------------------**/
	/**角色留存指标统计[retentionIndex]-BEGIN
	 * @throws ParseException **/
	@RequestMapping("/retentionIndex")
	public String retentionIndex(@ModelAttribute("page") Page<DataBean> page) throws ParseException{
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.retentionIndex(page);
		
		return "fish/retentionIndex";
	}
	
	/**角色留存指标统计[retentionIndex]-END**/
	
	
	/**-------------------------------------------------------------**/
	
	/**日活、周活、月活查询[dayWeekMonQuery]-BEGIN**/
	@RequestMapping(value="/dayWeekMonQuery")
	public String dayWeekMonQuery(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.dayWeekMonQuery(page);
		
		return "fish/dayWeekMonQuery";
	}
	/**日活、周活、月活查询[dayWeekMonQuery]-END**/
	
	
	
	/**-------------------------------------------------------------**/
	
	/**24小时用户分布[hoursDistributed]-BEGIN**/
	@RequestMapping("/hoursDistributed")
	public String hoursDistributed(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.hoursDistributed(page);
		
		return "fish/hoursDistributed";
	}
	/**24小时用户分布[hoursDistributed]-END**/
	
	
	/**-------------------------------------------------------------**/
	
	/**货币数据查询[currencyDataQuery]-BEGIN**/
	@RequestMapping("/currencyDataQuery")
	public String currencyDataQuery(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.currencyDataQuery(page);
		
		
		return "fish/currencyDataQuery";
	}
	/**货币数据查询[currencyDataQuery]-END**/
	
	
	/**-------------------------------------------------------------**/
	
	/**关卡滞留数据查询[checkpointRetentionDataQuery]-BEGIN**/
	@RequestMapping("/checkpointRetentionDataQuery")
	public String checkpointRetentionDataQuery(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.checkpointRetentionDataQuery(page);
		
		return "fish/checkpointRetentionDataQuery";
	}
	/**关卡滞留数据查询[checkpointRetentionDataQuery]-END**/
	
	
	
	/**--------------------------------------------------------------**/
	/**道具消耗查询[propsConsumingQuery]-BEGIN**/
	@RequestMapping("/propsConsumingQuery")
	public String propsConsumingQuery(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.propsConsumingQuery(page);
		
		return "fish/propsConsumingQuery";
	}
	/**道具消耗查询[propsConsumingQuery]-END**/
	/**--------------------------------------------------------------**/
	
	
	
	/**手机型号统计[phoneModelStatistics]-BEGIN**/
	@RequestMapping("/phoneModelStatistics")
	public String phoneModelStatistics(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.phoneModelStatistics(page);
		
		return "fish/phoneModelStatistics";
	}
	/**手机型号统计[phoneModelStatistics]-END**/
	
	
	/**--------------------------------------------------------------**/
	
	/**渠道统计[channelStatistics]-BEGIN
	 * @throws ParseException **/
	@RequestMapping("/channelStatistics")
	public String channelStatistics(@ModelAttribute("page") Page<DataBean> page) throws ParseException{
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.channelStatistics(page);
		
		return "fish/channelStatistics";
	}
	/**渠道统计[channelStatistics]-END**/
	
	
	
	/**--------------------------------------------------------------**/
	
	/**渠道映射[channelMapping]-BEGIN**/
	@RequestMapping("/channelMapping")
	public String channelMapping(@ModelAttribute("page") Page<DataBean> page){
		if(page==null){
			page = new Page<DataBean>();
		}
		page = this.fishService.channelMapping(page);
		
		return "fish/channelMapping";
	}
	
	@RequestMapping("/channelMapping/add")
	public String channelMappingAdd(@ModelAttribute("page") Page<DataBean> page){
	    this.fishService.channelMappingAdd(page);
		
		return "forward:/channelMapping";
	}
	
	@RequestMapping("/channelMapping/edit")
	public String channelMappingEdit(@ModelAttribute("page") Page<DataBean> page){
	    this.fishService.channelMappingEdit(page);
		
		return "forward:/channelMapping";
	}
	
	@RequestMapping("/channelMapping/delete")
	public String channelMappingDelete(@ModelAttribute("page") Page<DataBean> page){
	    this.fishService.channelMappingDelete(page);
		
		return "forward:/channelMapping";
	}
	/**渠道映射[channelMapping]-END**/
	
	/**--------------------------------------------------------------**/
	
	/**--------------------------------------------------------------**/
	
	/**收集信息[收集设备登录信息、金币信息、道具信息、关卡信息]-BEGIN**/
	/**http://localhost:8080/fish/deviceInfoAction_collectInfo?uuid=555555&type=5&version=345**/
	@RequestMapping("/deviceInfoAction_collectInfo")
	@ResponseBody
	public String collectDeviceInfo(@ModelAttribute("device") DeviceInfo device){
		int index = device.getVersion().lastIndexOf(".") + 1;
		String platform = device.getVersion().substring(index);
		device.setPlatform(platform);
		this.fishService.collectDeviceInfo(device);
		return "OK";
	}
	
	/**http://localhost:8080/fish/logAction_insertCoinLog?deviceUUID=555555&logType=5**/
	@RequestMapping("/logAction_insertCoinLog")
	@ResponseBody
	public String collectCoinInfo(@ModelAttribute("coinLog") CoinLog coinLog){
		this.fishService.collectCoinInfo(coinLog);
		return "OK";
	}
	
	/**http://localhost:8080/fish/logAction_insertItemLog?deviceUUID=555555&logType=5**/
	@RequestMapping("/logAction_insertItemLog")
	@ResponseBody
	public String collectItemInfo(@ModelAttribute("itemLog") ItemLog itemLog){
		this.fishService.collectItemInfo(itemLog);
		return "OK";
	}
	
	/**http://localhost:8080/fish/point?uuid=555555&pointId=5**/
	@RequestMapping("/point")
	@ResponseBody
	public String collectPointInfo(@ModelAttribute("point") PointInfo point){
		this.fishService.collectPointInfo(point);
		return "OK";
	}
	/**--------------------------------------------------------------**/
	
    /**LAYOUT-BEGIN**/
	@RequestMapping("/index")
	public String indexPage(){
		return "/layouts/index";
	}
	
	@RequestMapping("/main")
	public String mainPage(){
		return "/layouts/main";
	}
	
	@RequestMapping("/left")
	public String leftPage(@ModelAttribute("user") UserInfo user){
		return "/layouts/left";
	}
	
	@RequestMapping("/top")
	public String topPage(){
		return "/layouts/top";
	}
	
	@RequestMapping("/footer")
	public String footerPage(){
		return "/layouts/footer";
	}
	/**LAYOUT-END**/ 
	/**--------------------------------------------------------------**/

}
