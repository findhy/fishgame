/**
 * 给表单赋值，表单元素那么属性与ognl表达式一致
 * 
 * @param formID
 *            表单ID
 * @param jsonObj
 *            json对象
 * @author heweijie
 */
var dictListObj = {};
function setFormValues(formID, jsonObj) {
	// 数据字典对象
	// 是否需要对radio和checkbox的处理？有需求时再改动
	$("#" + formID)
			.find("[name][name!='']:not([name*=' '])")
			.each(function() {
				var type = $(this).attr("tagName");
				var tagType = $(this).attr("type");
				var name = $(this).attr("name").split(".");
				var tmp = jsonObj;
				for ( var i = 0; i < name.length; i++) {
					if (tmp) {
						tmp = tmp[name[i]];
					} else {
						break;
					}
				}
				// 有这个属性说明控件需要翻译字典
					if ($(this).attr("dictCode")&&type!="SELECT") {
						var dictCode = $(this).attr("dictCode");
						var dictInfoList = dictListObj[dictCode];
						var formObj = $(this);
						if (dictInfoList == undefined) {
							$.expost(getBasePath()+ "/base/findByDictCode.action",{'dict.code' : dictCode},function(result) {
												// 判断是否有异常
											if (result.exception == undefined) {
												dictInfoList = result;
												dictListObj[dictCode] = dictInfoList;
												// tmp =
												// findDictValueByKey(dictInfoList,tmp);
												if (type == "INPUT") {
													var ret;
													for ( var i = 0; i < dictInfoList.length; i++) {
														if (dictInfoList[i]['key'] == tmp) {
															ret = dictInfoList[i]['value'];
															formObj.attr("value",
															(ret == undefined || ret == null) ? "": ret);
															break;
														}
													}
												}else if(type="SPAN"){
													var ret;
													for ( var i = 0; i < dictInfoList.length; i++) {
														if (dictInfoList[i]['key'] == tmp) {
															ret = dictInfoList[i]['value'];
															formObj.html((ret == undefined || ret == null) ? "": ret);
															break;
														}
													}
												}else {
													formObj.attr("value",
													(tmp == undefined || tmp == null) ? "": tmp);
												}

											} else {
												alertError(result);
											}
										},{async:false});
						} else {
							tmp = findDictValueByKey(dictInfoList, tmp);
							$(this).attr("value",tmp);
						}
						/*
						 * if(type=="input"||type=="INPUT"){
						 * $(this).attr("value", ( tmp==undefined || tmp==null
						 * )?"":tmp); }else if(type=="select"||type=="SELECT"){
						 * $(this).find("option[key='"+tmp+"']").attr("checked","checked")
						 * }else if(type=="checkbox"||type=="CHECKBOX"){ }else
						 * if(type=="radio"||type=="RADIO"){ }else{
						 * $(this).attr("value", ( tmp==undefined || tmp==null
						 * )?"":tmp); }
						 */
					} else if ($(this).attr("flexValue")) {
						$("#" + $(this).attr("id") + "_input").attr("value",(tmp == undefined || tmp == null) ? "" : tmp);
					}else if( type == "SPAN"){
						$(this).text((tmp == undefined || tmp == null) ? "" : tmp);
					} else {
						if(!(tagType=="checkbox"||tagType=="CHECKBOX")){
							$(this).attr("value",(tmp == undefined || tmp == null) ? "" : tmp);
						}
					}
				});
}

//字典翻译方法，开发人员不会调用，方法内调用
function findDictValueByKey(dictInfoList, key) {
	var ret = "";
	for ( var i = 0; i < dictInfoList.length; i++) {
		if (dictInfoList[i]['key'] == key) {
			ret = dictInfoList[i]['value'];
			break;
		}
	}
	return ret;
}

/**
 * 通过数据字典code获取字典列表中 对应Key的值
 * 
 * @param dictCode  
 * @param key
 * @return
 */

/*
function getDictValue(dictCode,key){
	//if(key==null||key=="") return "";
	//var dictInfoList=dictListObj[dictCode];
	var ret="";
	//if(dictInfoList==undefined){
		$.ajax({
			  type: 'POST',
			  async: false,
			  url:getBasePath()+ "/base/findByDictCodeCache.action",
			  data: {'dict.code':dictCode,"dictKey":key},
			  success: function(data){
				    ret = data;
					//dictInfoList=data;
					//dictListObj[dictCode]=data;
					//ret=findDictValueByKey(dictInfoList,key);
				},
			  dataType: "json"
		});
	//}else{
		//ret= findDictValueByKey(dictInfoList,key);
	//}
	return ret;
};
*/
function getDictValue(dictCode,key)
{
	//因为有些地方没有引head.jsp，这里判断需不需动态加载
	/*if(typeof(locache)==undefined){
		$.getScript(getBasePath()+"/includes/inc/locache.js",callback);
	}*/
	//if(key==null||key=="") return "";
	//var dictInfoList=dictListObj[dictCode];
	var ret="";
	if(findDictValueFromClient(dictCode,key)==undefined){
		$.ajax({
			  type: 'POST',
			  async: false,
			  url:getBasePath()+ "/base/findByDictCodeCache.action",
			  data: {'dict.code':dictCode,"dictKey":key},
			  success: function(data){
				  	
				  	ret=data[key];
				  	if(ret!=undefined)
				  	{
				  		if(!$.browser.msie&&($.browser.version == "7.0"))
				  		{
				  			setDictValue2Client(dictCode,data);
				  		}
				  	}
				  	else
				  	{
				  		ret="";
				  	}
				  	
					//dictInfoList=data;
					//dictListObj[dictCode]=data;
					//ret=findDictValueByKey(dictInfoList,key);
				},
			  dataType: "json"
		});
	}else{
		//ret= findDictValueByKey(dictInfoList,key);
		ret = findDictValueFromClient(dictCode,key);
	}
	
	
	return ret;

}



/**根据dictCode获取客户端缓存中字典值
 * @author 彭帮中
 */
function findDictValueFromClient(dictCode,key)
{
	var dictFactory = locache.get("fesco_dict");
	
	if(dictFactory!=undefined)
	{
		var tempDict = findDictValue(dictFactory,dictCode);
		if(tempDict==undefined)
			return undefined;
		return tempDict[key];
	}
	
	return undefined;
}

/**
 * 数据字典表存入客户端缓存
 * @author 彭帮中
 */
function setDictValue2Client(dictCode,dictInfoList)
{
	var dictFactory = locache.get("fesco_dict");
	alert(dictFactory);
	if(dictFactory==undefined||dictFactory==null)
	{
		locache.set("fesco_dict",{});
		dictFactory = locache.get("fesco_dict");
	}
//	eval("dictFactory."+dictCode+"="+JSON.stringify(dictInfoList));
	var dictInfoListObj=$.parseJSON(dictInfoList);
	eval("dictFactory."+dictCode+"="+dictInfoListObj);
//	var s = JSON.stringify(dictFactory);
//	var o = JSON.parse(s);
//	var o = $.parseJSON(dictFactory);
	locache.set("fesco_dict",dictFactory);
}

/*
 * 获取对应key的dict value值
 */
function findDictValue(obj,key)
{
	return obj[key];
}



/**  通过数据字典code获取字典列表 **/
function getSelectByDictCode(dictCode,name,id){
	var ActionUrl = getBasePath()+"/base/findByDictCode.action";
	param = "dict.code="+dictCode;
	var html = "";	
	$.post(ActionUrl,param,function(data){
		if(data.length==0){
			return html;
		}else{
			html+="<select class='select_text' name='"+name+"' id='"+id+"'>";
			for(var i=0;i<data.length;i++){
				html+="<option value='"+data[i].key+"'>"+data[i].value+"</option>";
			}
			html+="</select>";
			return html;
		}
	});
};

/**
 * 解决javascript的浮点数运算bug
 * 
 */
// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}
// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function(arg) {
	return accAdd(arg, this);
};

// 减法函数，用来得到精确的减法结果
// 说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
// 调用：accSubtr(arg1,arg2)
// 返回值：arg1减去arg2的精确结果
function accSubtr(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	// 动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
// 给Number类型增加一个subtr 方法，调用起来更加方便。
Number.prototype.subtr = function(arg) {
	return accSubtr(arg, this);
};
// 乘法函数，用来得到精确的乘法结果
// 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
// 调用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
			/ Math.pow(10, m);
}
// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function(arg) {
	return accMul(arg, this);
};

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {
	}
	with (Math) {
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return (r1 / r2) * pow(10, t2 - t1);
	}
}
// 给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function(arg) {
	return accDiv(this, arg);
};
function formatCSTDate(dateString) {
	var d = new Date(dateString);
	var mm = ((d.getMonth() + 1) > 9) ? (d.getMonth() + 1) : '0' + (d
			.getMonth() + 1);
	var t = dateString.replace(/\w+ \w+ (\d+) (\d+):(\d+):(\d+) \w+ (\d+)/,
			'$5-' + mm + '-$1 $2:$3:$4');
	return t;
}
// 格式时间
function getDateTime(object) {
	var d = (new Date(object)).toLocaleString();
	var reg = new RegExp("年|月|日", "g");
	return d.replace(reg, "-");
}

//格式化时间
Date.prototype.format = function(format) //author: meizz 
{ 
  var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(),    //day 
    "h+" : this.getHours(),   //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
    "S" : this.getMilliseconds() //millisecond 
  } 
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, 
    (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o)if(new RegExp("("+ k +")").test(format)) 
    format = format.replace(RegExp.$1, 
      RegExp.$1.length==1 ? o[k] : 
        ("00"+ o[k]).substr((""+ o[k]).length)); 
  return format; 
} ;

/**
 * @param eValue
 * @return 格式化金额字段，用千位分隔符显示
 */
function formatNumber(eValue){
	var   intPart   =   '';
    var   decPart   =   '';
    if(eValue==undefined||eValue.toString()=="") 
    	return "";
    eValue = eValue + "";
    if(eValue.indexOf(",")   >=   0) {  
          eValue=eValue.replace(/,/g,'');  
    }  
    //判断是否包含'.'  
    if(eValue.indexOf('.')>=0){  
          intPart   =   eValue.split('.')[0];  
          decPart   =   eValue.split('.')[1];
          if(decPart.length==1)
        	  decPart = decPart+"0";
    }else{  
          intPart   =   eValue;  
    }  
    var   num     =     intPart   +   '';      
    var   re   =   /(-?\d+)(\d{3})/ ;     
    while(re.test(num)){      
          num   =   num.replace(re,   '$1,$2')      
    }      
    if(eValue.indexOf(".")   >=   0){  
          eValue   =   num   +   "."   +   decPart;  
    }
    else{  
          eValue   =   num + '.00';  
    }  
    return   eValue;  
}

/**
 **判断是否为当年当月的最后一天
 */
function isLastDay(yearV,monthV,dayV){
	 var new_year = yearV;    //取当前的年份   
   var new_month = monthV+1;//取下一个月的第一天，方便计算（最后一天不固定）   
   if(new_month>12)            //如果当前大于12月，则年份转到下一年   
   {   
      new_month -=12;        //月份减   
      new_year++;            //年份增   
   }   
   var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天   
   var lastDay = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期   
	 if(lastDay==dayV){
	 	  return true;
	 }else{
	    return false;
	 }
}

/**
 **计算距离月底还有几天
 */
function getLastDayAway(yearV,monthV,dayV){
   var new_year = yearV;    //取当前的年份   
   var new_month = monthV+1;//取下一个月的第一天，方便计算（最后一天不固定）
   if(new_month>12)            //如果当前大于12月，则年份转到下一年   
   {   
      new_month -=12;        //月份减   
      new_year++;            //年份增   
   }
   var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天   
   var lastDay = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
   var away_day = lastDay-dayV;  
   return away_day;
}

/**
 * @param startDate
 *            开始日期
 * @param endDate
 *            结束日期
 * @return 计算相差月份，必须满足正好一个月才进一
 */
function getDateMonthSub(startDate, endDate) {
	if (startDate == null || startDate == undefined || startDate == ""
			|| endDate == null || endDate == undefined || endDate == "")
		return 0;
	var endDate = new Date(endDate);
	var startDate = new Date(startDate);
	var renNumber = 0;
	var yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12;
	// 计算年份相差月份
	renNumber += yearToMonth;

	var startYear = startDate.getFullYear();// 开始日期-年份
	var endYear = endDate.getFullYear();// 结束日期-年份
	var startMon = startDate.getMonth();// 开始日期-月份
	var endMon = endDate.getMonth();// 结束日期-月份
	var startDay = startDate.getDate();// 开始日期-日
	var endDay = endDate.getDate();// 开始日期-日

	var monthToMonth = endDate.getMonth() - startDate.getMonth();
	// 计算月份相差
	renNumber += monthToMonth;

	// 如果开始日期是最后一天并且结束日期不是最后一天，那么返回值-1
	if (isLastDay(startYear, startMon, startDay)
			&& !isLastDay(endYear, endMon, endDay)) {
		renNumber -= 1;
		return renNumber;
	} else {
		// 如果开始日期和结束日期都不是最后一天
		if (!isLastDay(startYear, startMon, startDay)
				&& !isLastDay(endYear, endMon, endDay)) {
			// 如果都不是最后一天，就需要计算开始日期和结束日期的天数距离结束还有几天,分别为start_last,end_last
			var start_last = getLastDayAway(startYear, startMon, startDay);
			var end_last = getLastDayAway(endYear, endMon, endDay);
			// 如果结束日期距离月底的天数比开始日期距离月底的天数大，则返回值-1
			if (end_last > start_last) {
				renNumber -= 1;
				return renNumber;
			} else {
				return renNumber;
			}

		} else {
			// 如果开始日期和结束日期的天都是当月的最后一天，那么相差月份就是实际月份相减的值
			// 其他情况都直接返回renNumber
			return renNumber;
		}

	}
}

/**
 * @param checkBoxName
 * @return 返回被选中的checkbox的dataId属性值
 */
function getCheckedDataIds(checkBoxName){
	var returnValue = "";
	$("input[name='"+checkBoxName+"']:checked").each(function(){
		returnValue = returnValue + $(this).attr("dataId") + ";";
	});
	returnValue = returnValue.substr(0,returnValue.length-1);
	return returnValue;
}

/**
 * @param sign 拼接的符号
 * @param cboxName checkbox的name
 * @param contentId 父级容器的ID
 * @returns 返回选中的checkbox的value的拼接字符串
 */
function cboxValJoin(sign,cboxName,contentId){
	var checked=contentId?$("#"+contentId+" input:checkbox[checked]"):$("input:checkbox[name='"+cboxName+"'][checked]");
	var result='';
	if(checked&&checked.length!=0){
		checked.each(function(i,n){
			result+=$(n).val()+sign;
		});
	}
	return result?result.substring(0,result.length-1):result;
}



//存储查询出来的实体名称，避免重复查询
var entityNameList=new Array();

/**
 * 
 * 传入id和id类型，翻译名称出来
 * @param t  类型
 * user
 * role
 * org
 * corp
 * area
 * userRole.user
 * userRole.role
 * userRole.org
 * supp
 * prod
 * 
 * @param val   id串内容
 * @returns
 */
function transName(t,val){
	var trans=function(type,value){
		var body;
		//查询缓存是否包含
	if(entityNameList[type]){
		$.each(entityNameList[type],function(i,n){
			if(n.name==value){
				body = n.value ;
				return ;
			}
		});
	}
		if(body==null||body==""){
		var url= getBasePath()+"/base/findEntityName.action",param="message="+value+"&type="+type;
		if(type=="userRole.user")
			param+="&key=user";
		else if(type=="userRole.role")
			param+="&key=role";
		else if(type=="userRole.org")
			param+="&key=org";
		$.ajax({
			  type: 'POST',
			  async: false,
			  url: url,
			  data: param,
			  dataType: "json",
			  success: function(data){
				if(entityNameList[type]==undefined){
					entityNameList[type]=new Array();
				}
				entityNameList[type].push(eval({name:value,value:data.message}));
				 body = data.message;
				}
		});
	}
		return body;
	};
	if(val==null||val=="")
		return "";
	if(typeof val =="number")
		return trans(t,val);
	else{
		var strArr = val.split(",");
		if(strArr){
			var bd = [];
			$.each(strArr,function(i,n){
				bd.push(trans(t,n));
			});
			return bd.join(",");
		}else
			return trans(t,val);
	}
	
}

/**
 * 
 * @param {Object} cksource 选中的checkbox集合
 * @param {Object} options  配置项 
 * @return {TypeName} 必选验证及验证是否可操作
 */
function valicbox(cksource,options){
	if(!cksource){return false;}
	var source=$(cksource);//checkbox 数据集	
	var bool=true;//验证结果
	var markBool=true;//标记验证结果
	var onlyList={};//唯一记录
	var lastCall={};//需要其他验证项成功,才对此验证项进行提示或者函数操作.
	var def={
		single:true,//是否单选
	    singlemsg:"请选择一条数据!", //单选提示信息
	    manymsg:"请选择至少一条数据!",//多选提示信息
	    errormsg:"请选择正确的数据!",//不符合操作条件错误提示信息
	    openvali:true,//默认开启验证
	    ismarkerror:false,//是否标记出错误数据
	    isViewMsg:true,//是否提示错误
	    vali:null   //如果不需要则可以不用给值 
	    			//参数 如{'state':{'inv':[1,2,4],'message':'请选择state为1,2,4!'},'state1':{'unv':[2,4,5]},'state1':{'only':'only','message':'状态state1必须都一致'},'state2':{'inv':3,message:'只能选择状态2为3的数据'}}
					// state 为 checkbox中对应的属性如<input type='checkbox' state='1'> 
	    			// inv checbox中对应属性属于条件中的值
	    			// unv checbox中对应属性不属于条件中的值
	    			// message 不满足条件时自定义提示信息   可以为空 为空时将取vali 上边 得那个 errormsg的值
	};
	var o=$.extend({}, def, options);//参数
	var domain=function(){
		onlyList={};
		if(o.single){
			if(source.length!=1){
				alertShow(o.singlemsg);
				return false;
			}
			if(o.vali)validate(source);
		}else{
			if(source.length==0){
				alertShow(o.manymsg);
				return false;
			}
			if(o.vali){
				source.each(function(i,n){
					if(!bool&&!o.ismarkerror){return false;}
					validate($(n));
				});
			}
		}
		if(bool&&markBool){
			$.each(lastCall,function(key,val){
				bool=false;//存在lastCall说明未验证通过.
				val.func(returnObj,val.errordata);
			});
		}
		return bool&&markBool;
	};
	var validate=function(obj){
		$.each(o.vali,function(key,val){
			var ckval=obj.attr(key);
			var msg=val.message?val.message:o.errormsg;
//			if(!valiNull(ckval)){
//				bool=false;
//				alertShow(msg);
//				return false;
//			}
			if(val){
				var inv=val.inv;
				var unv=val.unv;
				var only=val.only;
				var nul=val.nul;//空判断 ('y'为空,'n'不能为空)
				if(valiNull(inv)){
					 bool=valiinv(ckval,inv);
				}else if(valiNull(unv)){
					 bool=valiunv(ckval,unv);
				}else if(valiNull(only)){
					 bool=valionly(ckval,key);
				}else if(valiNull(nul)){
					 bool=valinul(ckval,nul);
				}
			}
			if(!bool){
				 if(o.ismarkerror){
					 obj.parents('tr').removeClass().css('backgroundColor','red').attr('error','error').attr('title',msg);
					 markBool=false;
				 }else{
					if(o.isViewMsg){
						if(val.func){//如果有指定调用方法
							if(val.lastCall){//其他项都验证通过最后调用
								bool=true;//继续进行判断
								if(lastCall[key]){
									lastCall[key].errordata.push(obj);
								}else{
									lastCall[key]=val;
									lastCall[key].errordata=[];
									lastCall[key].errordata.push(obj);
								}
							}else{
								val.func(returnObj,obj);//returnObj 验证插件返回对象, obj 当前错误的checkbox
							}
						}else{
							alertShow(msg);
						}
					}
			 	 	return false;
			 	 }
			}
		});
	};
	//验证包含
	var valiinv=function(ckval,inv){
		var boolt=false;
		if($.isArray(inv)){
			for(var i in inv){
				if(inv[i]==ckval){
					return true;
				}
			}
		}else{
			boolt=(inv==ckval);
		}
		return boolt;
	};
	//验证不包含
	var valiunv=function(ckval,unv){
		var boolt=true;
		if($.isArray(unv)){
			for(var i in unv){
				if(unv[i]==ckval){
					return false;
				}
			}
		}else{
			boolt=!(unv==ckval);
		}
		return boolt;
	};
	var valionly=function(ckval,key){
		var onlyVal=onlyList[key]
		if(!onlyVal){
			onlyList[key]=ckval;
			return true;
		}else{
			return onlyVal==ckval;
		}
	}
	var valinul=function(ckval,nul){
		if(nul=='Y'){
			return !valiNull(ckval);
		}else if(nul=='N'){
			return valiNull(ckval);
		}
	}
	var updateOptions=function(options){
		o=$.extend({}, def, options);
	};
	var getParams=function(options,data){
		var def={
			atts:"",
			oname:"",
			repeat:true,
			index:true
		}
		var data=data?data:source;
		var t=$.extend({}, def, options);//参数
		var params="";
		var oname;
		if(o.single){
			oname=valiNull(t.oname)?t.oname+".":"";
			if($.isArray(t.atts)){
				$.each(t.atts,function(i,n){
					var na=n;
					var va=n;
					if(typeof(n)!="string"){
						na=n.name;
						va=n.value;
					}
					var val=data.attr(va);
					if(val){
						params+=oname+na+"="+val+"&";
					}
				});
			}else{
				var na=t.atts;
				var va=t.atts;
				if(typeof(t.atts)!="string"){
					na=t.atts.name;
					va=t.atts.value;
				}
				var val=data.attr(va);
				if(val){
					params=oname+na+"="+val+"&";
				}
			}
		}else{
			var repeat=new Array();
			$.each(data,function(i,n){
				ck=$(n);
				inx=t.index?"["+i+"]":".";
				oname=valiNull(t.oname)?t.oname+inx:"";
				if($.isArray(t.atts)){
					$.each(t.atts,function(ii,nn){
						var na=nn;
						var va=nn;
						if(typeof(nn)!="string"){
							na=nn.name;
							va=nn.value;
						}
						var val=ck.attr(va);
						if(val){
							params+=oname+na+"="+val+"&";
						}
					});
				}else{
					var na=t.atts;
					var va=t.atts;
					if(typeof(t.atts)!="string"){
						na=t.atts.name;
						va=t.atts.value;
					}
					var val=ck.attr(va);
					if(val){
						if(t.repeat){
							params+=oname+na+"="+val+"&";
						}else{
							if(jQuery.inArray(val,repeat)==-1){
								oname=valiNull(t.oname)?t.oname+"["+repeat.length+"].":"";
								params+=oname+na+"="+val+"&";
								repeat.push(val);
							}
						}
					}
				}
			});
		}
		return params.substr(0,params.length-1);
	}
	//返回的对象
	var returnObj = {
		valiinv:valiinv,//提供函数是否包涵
		valiunv:valiunv,//提供函数是否不包涵
		updateOptions:updateOptions,//修改默认参数
		getParams:getParams,
		domain:domain//执行验证
	};
	if(o.openvali){
		return domain();
	}else{
		return returnObj;
	}
}
function autoHeight(obj){
	var tag=$(obj);
	var curH=tag.height();
	var winH=$(window).height();
	var topH=tag.offset().top;
	var subH=winH-topH<=0?curH:winH-topH;
	obj.css("height",subH);
	return subH;
}

function setPageTagHeight(tags,heig){
	if($.isArray(tags)){
		$.each(tags,function(i,n){
			$(n).css("height",heig);
		});
	}else{
		$(tags).css("height",heig);
	}
}

/**
 * 计算两个时间相差天数，maxDate - minDate
 * 参数传入的格式为yyyy-MM-dd格式 如 2012-03-02
 * 返回天数数字
 * 
 * 
 * @param minDate  小的日期
 * @param maxDate 大的日期
 */
function diffDate(minDate,maxDate){
	return (new Date(maxDate).getTime()-new Date(minDate).getTime())/(1000 * 60 * 60 * 24);
}

//给数组加indexOf方法 
if(navigator.appName == "Microsoft Internet Explorer"){
		   //if(navigator.appVersion.match(/7./i)=='7.'){
				Array.prototype.indexOf = function(item) {  
					for (var i = 0; i < this.length; i++) {  
					if (this[i] == item)  
					return i;  
					}  
					return -1;  
				};
		   //}
}
/**
 * @author FHX
 * 为数组扩展删除方法
 */
Array.prototype.remove = function(val) {
    var index =  jQuery.inArray(val, this);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**获取身份证上的生日信息**/
function getBirthByCard(CardNumber){
	return CardNumber.substring(6,10)+"-"+CardNumber.substring(10,12)+"-"+CardNumber.substring(12,14);
};
/**获取身份证上的性别信息 1代表男，2代表女**/
function getSexByCard(CardNumber){
	if(CardNumber.substring(16,17)%2==1){
		return 1;
	}else{
		return 2;
	}
};

/** 止做原则 **/
function getItemEndDate(date ,yz){
	if(date){
		if(date.length!=10)
			return date;
		var year = date.substring(0,4)*1;
		var month = date.substring(5,7)*1;
		var day = date.substring(8,10)*1;
		if(yz==1){//15日原则
			if(day>=15){
				return getPriDateStr(year,month+1,0);
			}else{
				return  getPriDateStr(year,month,0);
			}
		}else if(yz==2){//当日原则
			return date;
		}else if(yz==3){//当月
			return  getPriDateStr(year,month+1,0);
		}else{
			return date;
		}
	}
}
/** 起做原则 **/
function getItemBegDate(date ,yz){
	if(date){
		if(date.length!=10)
			return date;
		var year = date.substring(0,4)*1;
		var month = date.substring(5,7)*1;
		var day = date.substring(8,10)*1;
		if(yz==1){//15日原则
			if(day>=15){
				return getPriDateStr(year,month+1,1);
			}else{
				return  getPriDateStr(year,month,1);
			}
		}else if(yz==2){//当月原则
			return getPriDateStr(year,month,1);
		}else if(yz==3){//当日
			return  date;
		}else{
			return date;
		}
	}
}

/**
 * @param year 年
 * @param mon 比正常小1   范围0-11
 * @param date 0为上月 范围 1-31 当大于月份最大日时,月份+1,日期重新计算
 * @returns fhx
 */
function getPriDateStr(year,mon,date){
	var new_date = new Date(year, (mon*1)-1, (date*1));                //取当年当月中的第一天
	var year = new_date.getFullYear();
	var month = new_date.getMonth()+1;
	if(month<10)
		month = "0"+month;
	var day = new_date.getDate();
	if(day<10)
		day = "0"+day;
	var str = year+"-"+month+"-"+day;
	return $.trim(str);
}

/**
 * 根据类型获取跨页选择的checkbox属性
 * @param checktype 类型： value  unitno  等自定义属性名称
 * @return
 */
function getflipSeledTrCheckValue(checktype,ajaxObject) {
    var res=new Array();
    $.each(ajaxObject.flipSeledTr(),function(){
        res.push($(this).attr(""+checktype));
    });
    return res;
}

/**
* 获取系统年月
* @param  
* @return 6位系统年月(财务年月)
*/
function findSysMonth() {
   var res;
   $.ajax({
		 async:false,
		 type:'post',
		 url:getBasePath()+'/base/findSysMonth.action',
		 success:function(result){
			 if(result.exception==undefined){
				 if(result!=null && ""!=result ){
					 res=result;
				 }else{
					 alertError(result);
				 }
			 }else{
				 alertError(result);
			 }
		 }
	 });
    
   return res;
}

/**
* 获取服务器时间返回时间Date
* @param  
* @return
*/
function ServerDate()
{
	var serverDate;
	$.ajax({
		  type: 'POST',
		  async: false,
		  url:getBasePath()+ "/base/getserverTimeMillis.action",
		  data: {},
		  success: function(data){
		  	serverDate=new Date(Number(data));
		  },
		  dataType: "json"
	});

	return serverDate;

}





