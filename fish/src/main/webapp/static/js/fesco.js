function reFrom(){
	$resetBtn.parents("form").find('input:not(:button,:reset,:submit,:checkbox,:radio,:hidden,[readonly])')
	.each(function(){
		$(this).val('').removeAttr('checked').removeAttr('selected').removeAttr('value').html("");  
	});
	$resetBtn.parents("form").find('textarea')
	.each(function(){
		$(this).html("");
	});
	$resetBtn.parents("form").find('option') 
	.each(function(){
		$(this).removeAttr('selected');
	});
	$resetBtn.parents("form").find("input[type='hidden']")
	.each(function(){
		$(this).attr("value","");
	});
}
var $resetBtn;
$(function(){
//	$(".aialog").draggable(); 
	//删除#号
	$(".toolbar a[href=#]").removeAttr("href").css("cursor","pointer");
	
	/*$("input,textarea").live("keydown",function(e){
		var read = $(this).attr("readonly");
		if(e.keyCode==8&&(read==true||read=="readonly"))
			return false;
	});*/
	
	$("form").each(function(i,n){
		//给form的第一个input（不是hidden）设置焦点
		if(i==0)
			$(this).find("input:not(:hidden)").first().focus();
		
		$(this).submit(function(){
			return setReLoadVal($(this),1);
		});
		
	});
	//给reset重置按钮加事件
	$(":reset").bind("click",function(){
		$resetBtn = $(this);
		 setTimeout(reFrom,1);
	}); 
	//submit
	$("form").bind("submit",function(){
		var form=$(this);
		$.each(form.find(":submit"),function(){
			var sub=$(this);
			sub.attr("disabled","disabled");
			setTimeout(function(){
				sub.removeAttr("disabled");
			},3000);
		});
	});

	
	//动态增加空白行的方法
	var rowsize=$("table~div>form>input[name*='.rowsize']"); 
	if(rowsize.length==0)
		rowsize=$("div>form>input[name*='.rowsize']");
	$.each(rowsize,function(i,n){
		var editTable=$("table:not([pageBody=pageBody]):eq("+i+")");
		if(editTable.attr("notFull")!="notFull"){
			if((editTable.find("tr:not(:first)").length)<$(rowsize[i]).val()){
				var len=$(rowsize[i]).val()-editTable.find("tr:not(:first)").length;
				
				var tdlen;
				tdlen=editTable.find("thead tr:last").find("th").length;
				if(tdlen==0)
					tdlen = editTable.find("tr:first").find("th").length;
				if(tdlen==0)
					tdlen=editTable.find("tr:first").find("td").length;
				if(tdlen==0)
					tdlen = editTable.find("tr:last").find("th").length;
				for(var w=0;w<len;w++){
					var tdBody=$("<tr name='emptyTr'/>");
					for(var a=0;a<tdlen;a++){
							tdBody.append("<td>&nbsp;</td>"); 
					}
					if(editTable.find("tbody").length!=1){
						editTable.find("tr:last").after(tdBody);
					}else{
						editTable.find("tbody").append(tdBody);
					}
				}
			}
		}
		
	}); 
	
	$("table").each(function(){
			var table=$(this); 
		//如果有noTr属性，table没有效果
		if(table.attr("noTr"))return;
		//隔行换色,如果tr不需要这个样式就加上<tr noClass="noClass">
	    $(this).find("tr:not(:first,[noClass]):odd").addClass("odd");
	    //不需要行选中效果
		if(table.attr("selectDisable")) return;
		//若不需要绑定checkbox的click方法填写notBind="notBind"
		var ckBind = table.attr("notBind");
		//如果table没有checkbox
		if(table.find("tr input:checkbox").length==0){
			table.find("tr:not(:first)").mouseover(function(){
				$(this).addClass("selsetedTr");
			}).mouseout(function(){
				$(this).removeClass("selsetedTr");
			});
			//3.12刘青   该地方return的话后面的排序等等都会加不上
			//return false;
		}
		//table 若不想要静态排序则在table中增加notSort="true" 自定义属性
		/*if(!table.attr("notSort"))
			table.sorttable();*/
		
		//table 若想要拖拽则在table中增加drag="true" 自定义属性
		//若单列不想加拖拽 则在th里面加drag="false"
		//by  fhx  2012-6-30
		if(table.attr("drag")){
			var tabParent=$(table.parent());
			if(tabParent.attr("tagName")=="DIV")
				$(table.parent()).css("position","relative");
			table.movedTh();
		}
		
		//如果为单选table
		if(table.attr('singleSelected')){
			//标题行复选框不能选中
			$(this).find(":checkbox:first").click(function(){return false;});
			//数据行复选框事件
			table.find(":checkbox:not(:first)").bind("click",function(event){
				event.stopPropagation();//阻止行事件冒泡
				var checked = $(this).attr("checked");
				//如果为选中
				if(checked){
					table.find(":checkbox:not(:first)[checked]").attr("checked",false);
					table.find("tr:not(:first)").removeClass("selsetedTr");
					$(this).attr("checked",checked);
					$(this).parent().parent().addClass("selsetedTr");
				}else{
					$(this).parent().parent().removeClass("selsetedTr");
				}
			});
		}else{
			//标题行复选框选中实现全选/全不选
			$(this).find(":checkbox:first").click(function(){
				var firstckb=$(this).attr("checked");
				table.find(":checkbox:enabled").attr("checked",firstckb);
				if(firstckb){
					table.find(":checkbox:not(:first)").not(":disabled").parent().parent().addClass("selsetedTr");
				}else{
					table.find(":checkbox:not(:first)").not(":disabled").parent().parent().removeClass("selsetedTr");
				}
			});
			//数据行复选框点击事件
			table.find(":checkbox:not(:first)").bind("click",function(event){
				event.stopPropagation();//阻止行事件冒泡
				var checked = $(this).attr("checked");
				//如果为选中
				if(checked){
					$(this).parent().parent().addClass("selsetedTr");
				}else{
					$(this).parent().parent().removeClass("selsetedTr");
				}
			});
		}
		
		table.find("tr:not(:first)").bind("click",function(){
			if(!ckBind){
				var checkbox=$(this).find(":checkbox");//获取复选框
				//checkbox.trigger("click");//触发复选框事件
				var domCheckbox=checkbox.get(0);
				if(domCheckbox){
					domCheckbox.click();
				}
			}
		}).mouseover(function(){
			$(this).addClass("selsetedTr");
		}).mouseout(function(){
			if($(this).find(":checkbox").attr("checked")==false){$(this).removeClass("selsetedTr");}
			//针对空白行没有checkbox做调整
			if($(this).find(":checkbox").length==0){$(this).removeClass("selsetedTr");}
		});
		
		//给table固定高度 为table设置属性 overHead=true 
		if(table.attr("overHead")=="true"){
			overHeadFun(table);
		}
		 //拼表头结束 
	});
	
	
	
	
	
	
	
	
});	



/**
 * 表头固定方法
 * 使用要求：
 * 1.table外部嵌套一层空DIV
 * 2.table的width属性为100%，或者设置所有th的固定宽度
 * 3.table的表头用thead标签包裹
 * 4.table的内容用tbody标签包裹
 * 5.固定外部DIV高度或者固定显示overflow-y:scroll，发生改变的话需要重新计算。

 * 注意事项：
 * 1.ie7下如果窗口不为最大化，拖拽窗口滚动条时会出现问题。暂未解决。
 * 2.表头固定和表头拖拽已经兼容，在确保你的页面样式不混乱且尽量少数table存在的时候使用。
 * 3.table外部div的高度请固定，不要自动计算！不支持！
	
 * 
 * 
 */
function overHeadFun(tables){
	//$("div[name=overHeadDiv]").empty();//.remove();
	if(tables==null){
		if(top.mainFrame==null||top.mainFrame.$("table[overHead=true]").length==0)
			tables = $("table[overHead=true]");
		else
			tables = top.mainFrame.$("table[overHead=true]");
	}
	$.each(tables,function(i,n){
		var table = $(n);
		table.parent().find("div[name=overHeadDiv]").remove();
		if(!table.attr("overHead"))
			return ;
		var parentDiv =table.parent();
		//外部div高度
		var parHeight =parentDiv==null||parentDiv.attr("tagName")=="BODY"||parentDiv.attr("style")==null||(parentDiv.attr("style").indexOf("HEIGHT")<0&&parentDiv.attr("style").indexOf("height")<0) ? 0 : parseInt(parentDiv.css("height")||parentDiv.attr("height"));

		//tr总高度
		var trHeight=0;
		$.each(table.find("tr"),function(i,n){
			trHeight+=$(n).height();
		});
		if(parHeight<trHeight){
			var ie7 = navigator.appName == "Microsoft Internet Explorer"&&document.documentMode==7;
			var newTab = $("<table></table>")
			//4.17日注释，在table出现滚动条后再计算高度，避免th的线和td线对不齐
			//.css("width",table.width())
			.css("position","relative");

			//如果父节点为body，则套一层div
			if(parentDiv==null||parentDiv.attr("tagName")=="BODY")
				parentDiv =$("<div/>");
			parentDiv.css("height",parHeight==0 ?trHeight-23:parHeight).css("overflow-y","auto");
			//绑定左移滚动条方法
			parentDiv.scroll(function(){
				var div =$(this);
				newTab.css("margin-left",(div.scrollLeft()-div.scrollLeft()*2));
			});
			//如果table的父节点是body，则外套一层div
			if(table.parent().attr("tagName")=="BODY")
				table.wrap(parentDiv);
			
			
			//开始动态构建head
			var newBody =table.find("tr:eq(0)").clone(true);
			//如果需要overHead和drag兼容的话，这里要删掉原来table上的div，以固定表头的来做
			if(table.attr("drag"))
				table.find("div[dragDiv=true]").remove(); 
			var trs = table.find("tr:eq(0) th");
			$.each(trs,function(i,n){
				newBody.find("th:eq("+i+")").width($(n).css("width")).removeAttr("id").removeAttr("name");
			});
			
			var bodyScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			var top =parseInt(parentDiv.offset().top);
			var tops = (top-bodyScrollTop<0 ? 0 : top-bodyScrollTop);
			//临时处理  FESCO-16305
			var ftop =parseInt(parentDiv.offset().top)<0 ?trHeight-parHeight-23:parseInt(parentDiv.offset().top);//div的上偏移
			
			newTab.append($("<thead/>"));
			newTab.find("thead").append(newBody);
			
			
			var outDivWidth=parentDiv.attr("offsetWidth")-16;
			if(parentDiv.attr("style")!=null&&parentDiv.attr("style").indexOf("scroll")>0)//如果滚动条是强制显示的，就不需要减16
				outDivWidth=parentDiv.attr("offsetWidth");
			
			var outDiv = $("<div/>").append(newTab)
			.attr("name","overHeadDiv")
			.css("overflow","hidden")
			.css("position","fixed")
			//.css("z-index","100")
			.css("width",outDivWidth)
			.css("top",tops)
			//4.17 删除ie7判断，默认都用left边距 :ie7 ? "left" : "margin-left"
			.css("left",parentDiv.offset().left)
			.attr("ftop",ftop);//上边距
			if(table.attr("drag")){
				outDiv.css("z-index","1");
			}
			//将div放在父级div中
			parentDiv.prepend(outDiv);
			//设置放固定表头的table的宽度为原来table的最大宽度 (包含滚动条的)
			newTab.css("width",table.attr("offsetWidth"));
			
			$(window).scroll(function(){
				var bodyScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				var top =parseInt(outDiv.attr("ftop"));
				var topsa = (top-bodyScrollTop<0 ? 0 : top-bodyScrollTop);
				outDiv.css("top",topsa+"px");//暂时这样搜索全部的div进行修改
				
				var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
				if(scrollLeft)
					outDiv.css("left","-"+scrollLeft+"px");//暂时这样搜索全部的div进行修改
			}).scroll();
		}
	});
}






//是否选择数据,name接收参数为checkbox的name
function checks(name) {
	var id = $("input[name="+name+"]:checked");
	if(id.length==0){
		return false;
	}else{
		return true;
	}
}
/**/

/***
 * 关闭弹出框
 * shadowId 阴影层div的id
 * dialogId 弹出层div的id
 * */
function closeDialog(shadowId,dialogId){
	$('#'+shadowId).hide();
	$('#'+dialogId).hide();
}

/***
 * 关闭所有弹出框
 * */
function closeAllDialog(){
	$(".aialog").hide();
	$(".shadow").hide();
}

/**
 * 重新定位Div
 * @param shadowId
 * @param dialogId
 * @return
 */
function resizeDialog(shadowId,dialogId){
	var theHeight =  $(document).height();
	var theWidth =  $(document).width();
	//var screenHeightScrollbar = $(document).scrollTop();
	var obj = $('#'+dialogId);
	
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();  //当前浏览器窗口的 宽高
    var scrolltop = $(document).scrollTop();//获取当前窗口距离页面顶部高度
    var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
    

    var objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
    var objTop = (screenHeight - obj.height()) / 2 + scrolltop;
    
	   //浏览器窗口大小改变时
    $(window).resize(function() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        scrolltop = $(document).scrollTop();

        objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
        objTop = (screenHeight - obj.height()) / 2 + scrolltop;

        $('#'+shadowId).css('height',theHeight+scrolltop);
    	$('#'+dialogId).css({'top':objTop,'left':objLeft});

    });
    //浏览器有滚动条时的操作
    $(window).scroll(function() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        scrolltop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
        objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
        objTop = (screenHeight - obj.height()) / 2 + scrolltop;
        
        //$('#'+shadowId).css('height',theHeight+scrolltop);
    	$('#'+dialogId).css({'top':objTop,'left':objLeft});
    });
}


/***
 * 打开弹出框
 * shadowId 阴影层div的id
 * dialogId 弹出层div的id
 * */
function openDialog(shadowId,dialogId){
	var theHeight =  $(document).height();
	var theWidth =  $(document).width();
	//var screenHeightScrollbar = $(document).scrollTop();
	var obj = $('#'+dialogId);
	
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();  //当前浏览器窗口的 宽高
    var scrolltop = $(document).scrollTop();//获取当前窗口距离页面顶部高度
    var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
    var objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
    var objTop = (screenHeight - obj.height()) / 2 + scrolltop;
	//解决弹出框高度太高溢出顶部
	if(objTop<10)objTop=10;
	if(objTop>150)objTop=150;
    $('#'+shadowId)
    .css('height',theHeight+scrolltop)
    .css("width",theWidth)
    //.css('width',theWidth+scrollLeft)  固定宽度的话  点击隐藏左侧的时候  右边会有空白    去掉宽度不会影响原有的 
    .show()
    ;
		$('#'+dialogId).css({'top':objTop,'left':objLeft}).show();
	   //浏览器窗口大小改变时
    $(window).resize(function() {
    	$('#'+shadowId).css("width","","height","");
    	
        screenWidth = $(window).width();
        screenHeight = $(window).height();
//		screenHeight = document.body.clientHeight;
        scrolltop = $(document).scrollTop();
        objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
        objTop = (screenHeight - obj.height()) / 2 + scrolltop;
		//解决弹出框高度太高溢出顶部
		if(objTop<10)objTop=10;
		if(objTop>150)objTop=150;
		
        theHeight =  $(document).height();
        theWidth =  $(document).width();
        $('#'+shadowId).css('height',theHeight).css("width",theWidth);
    	$('#'+dialogId).css({'top':objTop,'left':objLeft});
    });
    
   
    
    
    //浏览器有滚动条时的操作
    //原版(scroll)当滚动条变动时，弹出div会随着滚动条滑动而变化，此版保持弹出div固定
    
    $(window).scroll(function() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
       
        scrolltop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
        objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
        objTop = (screenHeight - obj.height()) / 2 + scrolltop;
        //保持弹出框div固定
//        objTop = expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)));
//        objTop=expression_r(documentElement.scrollTop + documentElement.clientHeight-this.offsetHeight);
//        objTop=expression(eval(scrolltop +$(document).height() -obj.height()));
//      $('#'+shadowId).css('height',theHeight+scrolltop);
//    	$('#'+dialogId).css({'top':objTop,'left':objLeft});
//        $('#'+dialogId).css({'_top':objTop,'left':objLeft,'position':'fixed','z-index':9999,'_position':'absolute'});
//        $('#'+dialogId).css({'left':objLeft,'position':'fixed','z-index':9999,'_position':'absolute'});
    });

    
   /* 原始版(scroll)
    $(window).scroll(function() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
       
        scrolltop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
        objLeft = (screenWidth - obj.width()) / 2 + scrollLeft;
        objTop = (screenHeight - obj.height()) / 2 + scrolltop;
//      $('#'+shadowId).css('height',theHeight+scrolltop);
    	$('#'+dialogId).css({'top':objTop,'left':objLeft});
    });

	*/
    
    /*原始二版
    var thHeight = $(document).height();
    var thWidth = $(document).width();
    var dialogHeight = $('#'+dialogId).height();
	var dialogWidth = $('#'+dialogId).width();
	$('#'+shadowId).css('height',thHeight).show();
	$('#'+dialogId).css({'top':(thHeight-dialogHeight)/2,'left':(thWidth-dialogWidth)/2}).show();*/
	/*最原始版
	var theHeight = $(document).height();
	var theWidth = $(document).width()/2;
	var dialogHeight = $('#'+dialogId).height()/2;
	var dialogWidth = $('#'+dialogId).width()/2;
	$('#'+shadowId).css('height',theHeight).show();
	$('#'+dialogId).css({'top':theHeight/2-dialogHeight,'left':theWidth-dialogWidth}).show();
	*/
	$("#"+dialogId).find("input:not(:hidden):first").focus();
}

/**
 * 打开frame弹出框
 * @param src 
 * @param title frame标题栏
 */
function openFrameDialog(src,title){
	var obj = $('#iframeDialogId');
	var documentWidth= $(document).width();
	var documentHeight = $(document).height();
	var screenHeight = $(window).height();

	//清空dialogId中内容
	var childElem = obj.children();
	if(childElem.length!=0)
	{
		childElem.remove();
	}
	
	//关闭按钮
	var closeBtn = $('<div class="aialog_box" id="iframeCloseBtn">'+
	'<div class="aialog_title">'+
	'<div class="close_dialog" onclick="closeDialog(\'iframeDialogId\',\'iframeDialogId\')">'+
	'</div>'+title+'</div></div>');
		
	obj.css({'z-index':9999,'position':'absolute','width':'100%','height':documentHeight});
	
	//产生iframe
    var ifr = $('<iframe/>').css({'width':'100%','height':documentHeight}).attr('src',src);
	
	obj.append(closeBtn).append(ifr).show();
	   //浏览器窗口大小改变时
    $(window).resize(function() {
        documentWidth =  $(document).width();
        documentHeight =  $(document).height();
    	$('#iframeDialogId').css({'width':'100%','height':documentHeight});
		$('#iframeDialogId'+' iframe').css({'width':'100%','height':documentHeight});

    });
    
	$("#iframeDialogId").find("input:not(:hidden):first").focus();
}






/***
 * 打开弹出框
 * shadowId 阴影层div的id
 * dialogId 弹出层div的id
 * */
function openDialog_m(shadowId,dialogId){
	var thHeight = $(document).height();
    var thWidth = $(document).width();
    var dialogHeight = $('#'+dialogId).height();
	var dialogWidth = $('#'+dialogId).width();
	//距离左边距超过窗口本身大小时靠左处理,否则原样式不变
	if((dialogWidth+250)>thWidth){
		$('#'+shadowId).css({'height':thHeight,'width':thWidth}).show();
		$('#'+dialogId).css({'top':(thHeight-dialogHeight)/3,'left':20}).show();
	}else{
		$('#'+shadowId).css({'height':thHeight,'width':thWidth}).show();
		$('#'+dialogId).css({'top':(thHeight-dialogHeight)/3,'left':230}).show();
	}
	//$('#'+shadowId).css('height',thHeight).show();
	//$('#'+dialogId).css({'top':(thHeight-dialogHeight)/2,'left':(thWidth-dialogWidth)/2}).show();

	/*
	var theHeight = $(document).height();
	var theWidth = $(document).width()/2;
	var dialogHeight = $('#'+dialogId).height()/2;
	var dialogWidth = $('#'+dialogId).width()/2;
	$('#'+shadowId).css('height',theHeight).show();
	$('#'+dialogId).css({'top':theHeight/2-dialogHeight,'left':theWidth-dialogWidth}).show();
	*/

}
/**
 * 获取项目根目录
 * @return 返回项目根目录
 */
function getBasePath(){
//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
var curWwwPath=window.document.location.href;
//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
var pathName=window.document.location.pathname;
var pos=curWwwPath.indexOf(pathName);
//获取主机地址，如： http://localhost:8083
var localhostPaht=curWwwPath.substring(0,pos);
//获取带"/"的项目名，如：/uimcardprj
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
return (localhostPaht+projectName);
}

/**
 * 报表服务器对应的url
 */
function getReportPath(){
	return getBasePath();
	//return "http://localhost:9090/report";
}

/**
 *
 * @param  checkType
 *  checkbox选择方式(1.多选 2.单选 3.反选.4.反选的基础上，可以选择不同层级的子节点)
 *  
 * @param resType 
 * 返回值类型 1.name+id 
 * 2.id 
 * 3.id+name+pid+parent  
 * 其中第3的parent为父节点NODE对象 包含所有信息 如果只需要父节点ID就pid属性
 * 
 * @param selLast 
 * 是否必须选择子节点   true 或  false
 * 
 * @param selSub
 * 是否控制 必须选择大区以下的地区节点
 * 
 * @param areaSetting
 * 地区属性条件
 * 传参数方式
 * var areaset={
 * 		areaType:1,  地区类型
 * 		areaNature:2 地区性质
 * };
 * showAreaTree(1,1,true,false,areaset);
 * 
 * 
 * @return 
 * 调用例子
 * var areas=showAreaTree(checkType,resType,selLast,selSub);
 * areas[0].id  areas[0].pid              areas[0].parent.name(取父节点的name属性)
 */
function showAreaTree(checkType,resType,selLast,selSub,areaSetting)
{
	if(selLast==null){selLast=false;}
	if(selSub==null){selSub=false;}
	var url=getBasePath()+"/base/showAreaTree.action?checkType="+checkType+
	"&resType="+resType+"&selLast="+selLast+"&selSub="+selSub;
	//地区类型
	if(areaSetting!=null){
		if(areaSetting.areaType!=null)
			url=url+"&area.areaType="+areaSetting.areaType;
	//地区性质
		if(areaSetting.areaNature!=null)
			url=url+"&area.areaNatures="+areaSetting.areaNature;
	}
		
	return window.showModalDialog(url,null,"center:yes;dialogHeight=480px;dialogWidth=640px;status:no");
}


/**
 * 
 * @param divId 
 * 
 * @param areaSetting 查询属性设置
 * 例:
 * var areaset={
 * 		areaType:1,  地区类型
 * 		areaNature:2 地区性质
 * 		parentID:0   父节点ID
 * 		querySql :  要筛选查询的sql语句
 * 		sqlParams :筛选sql的绑定变量  暂未启用，先传没有绑定变量的完整sql
 *         excludeArea：不想显示的地区ids
 * };
 */
function showAreaFlex(divId,areaSetting,flexSetting){
	var url=getBasePath()+"/base/findAreaFlexByEntity.action";
	if(areaSetting){
		url=url+"?a=1";
		if(areaSetting.areaType!=null)
			url=url+"&area.areaType="+areaSetting.areaType;
		if(areaSetting.areaNature!=null)
			url=url+"&area.areaNatures="+areaSetting.areaNature;
		if(areaSetting.parentID!=null)
			url=url+"&area.parentID="+areaSetting.parentID;
		if(areaSetting.querySql!=null)
			url+="&area.querySql="+areaSetting.querySql;
		if(areaSetting.sqlParams!=null)
			url+="&area.sqlParams="+areaSetting.sqlParams;
		if(areaSetting.excludeArea!=null)
			url+="&area.excludeArea="+areaSetting.excludeArea;
	}
	return $("#"+divId).flexbox(url,flexSetting);
}

/**
 * 多选地区组件
 * @param divId
 * @param areaSetting 查询属性设置
 * 例:
 * var areaset={
 * 		areaType:1,  地区类型
 * 		areaNature:2 地区性质	(可以多个 2,3,4)
 * 		parentID:0   父节点ID
 * 		areaId: 1		直接指定地区
 * };
 * multiSetting为multi的参数配置，其中requiredUrl initParams querySelectedUrl 这三个参数不允许配置
 * 
 * 用法：
 * var areaMulti = showAreaMulti("areaDiv",{
		areaType:"1"
	},{
		on_select:true
	});
	查询已经选择的
	areaMulti.querySelectedData({"query":"1,3,4,5,6,7"});
	或
	areaMulti.querySelectedData({"query":"select area_id from base_prod_info where prod_id =1"});
 */
function showAreaMulti(divId,areaSetting,multiSetting){
	var areaset = {
			"area.areaType":areaSetting.areaType,
			"area.areaNature":areaSetting.areaNature,
			"area.parentID":areaSetting.parentID,
			"area.areaId":areaSetting.areaId
	};
	
	var set = {
			requiredUrl:getBasePath()+"/base/showAreaMulti.action",
			initParams:areaset,
			querySelectedUrl:getBasePath()+"/base/showSeledAreaMulti.action"
	};
	var setting = $.extend(multiSetting,set);
	return $("#"+divId).multiSelect(setting);
}



/**
 * 
 * @param div 
 * @param orgSet
 * 
 * var orgSet = {
 * 	type:1,2  	//机构类型
 * 	
 * 	parentId:	//父机构id
 * 	corpId:		//所属公司id
 * 	currUserOrg : true //为true则表示查询结果包含当前登录人的所有机构
 * };
 * 
 * @returns
 */
function showOrganFlex(divId,orgSet,flexSetting){
	var url=getBasePath()+"/base/getOrgFlexByEntity.action";
	if(orgSet){
		url=url+"?a=1";
		if(orgSet.type!=null)
			url +="&org.type="+orgSet.type;
		if(orgSet.depType!=null)
			url +="&org.depType="+orgSet.depType;
		if(orgSet.parentId!=null)
			url +="&org.parentId="+orgSet.parentId;
		if(orgSet.corpId!=null)
			url += "&org.corpId="+orgSet.corpId;
		if(orgSet.currUserOrg!=null)
			url +="&org.currUserOrg="+orgSet.currUserOrg;
		if(orgSet.orgIds!=null)
			url +="&org.orgIds ="+orgSet.orgIds;
	}
	var flex = $("#"+divId).flexbox(url,flexSetting);
	if(orgSet!=null&&orgSet.currUserOrg!=null&&orgSet.currUserOrg){
		$.expost(getBasePath()+"/base/getCurrUserOrg.action",{},function(result){
			flex.setHiddenValue(result.org.id);
			flex.setValue(result.org.name);
		},{async:false});
	}
	return flex;
}

/**
 * 
 * @param div		要生成flexbox的divId
 * @param dictInfoSetting	查询字典flexbox的条件
 * 可配置的条件 
 *   var sets = {
 *   	dictId:42090,	//增加字典分类查询条件，该条件默认应该是必须的
 *   	corpId:1,			//增加字典详情所属公司的查询条件，该条件可选，默认应该不需要配置
 *   	showType:1		
 *   //设置flexbo返回的内容类型  
 	//可以不传，默认为1  key,value
 	2 dict_info_id,value
 	3 key,value-remark
 	4 dict_info_id,value-remark
 	根据需要选择
 *   };
 * 
 * @param flexSetting	flexbox的配置参数
 */
function showDictInfoFlex(div,dictInfoSetting,flexSetting){
	var url = getBasePath()+"/base/dictInfoFlexByEntity.action";
	if(dictInfoSetting!=null){
		url+="?a=1";
		if(dictInfoSetting.dictId!=null)
			url+="&dictInfo.dictId="+dictInfoSetting.dictId;
		if(dictInfoSetting.corpId!=null)
			url+="&dictInfo.corpId="+dictInfoSetting.corpId;
		if(dictInfoSetting.showType!=null)
			url+="&showType="+dictInfoSetting.showType;
		if(dictInfoSetting.areaId!=null)
			url+="&dictInfo.areaId="+dictInfoSetting.areaId;

	}
	return $("#"+div).flexbox(url,flexSetting);
}

/**
 * 
 * @param divId
 * @param roleSett
 * var roleSett ={
 * 		"role.corpId":1,  //如果传入公司ID，就查询该公司和所属子公司的所有角色
 * 		"role.roleTypeName":"1,2,3,4,5,6"	//查询的角色类型范围
 * };
 * @param multiSett
 * multiSett为multi的参数配置，其中requiredUrl initParams querySelectedUrl 这三个参数不允许配置
 * 
 */
function showRoleMulti(divId,roleSett,multiSett){
	var opt = {
			requiredUrl:getBasePath()+"/base/roleMultiPage.action",
			initParams:roleSett,
			querySelectedUrl:getBasePath()+"/base/roleSelectedMultiPage.action"
	};
	var setting = $.extend(multiSett,opt);
	return $("#"+divId).multiSelect(setting);
}




/**
 * @param  showSet   显示模式 : 1.机构+角色   2.机构+角色+用户  
 * @param  roleSet  '角色'选择方式: 1.单选  2.多选
 * @param  userSet  '用户'选择方式: 1.单选  2.多选
 * @return           数据返回json类型  id,name  默认result[0]为机构数据  任何显示模式均返回机构数据
 * 机构为 result[0].id result[0].name
 * 角色、用户 取值为: result[1].id  result[0].name
 */
function selRoleOrUser(showSet,roleSet,userSet){
	return window.showModalDialog(getBasePath()+"/base/orgTreeAndRole.action?st="+showSet+"&ut="+userSet+"&rt="+roleSet,"选择角色和用户","dialogWidth=800px;dialogHeight=600px");
}

/**
 * 两个表单之间的元素复制
 * 将aFromId的元素复制到bFromId表单里
 * @param aFromId  form表单ID
 * @param bFromId select的name
 */
function addFrom(aFromId,bFromId){
	var aFromElements=document.getElementById(aFromId).elements;
	var bFrom=document.getElementById(bFromId);
	for(var i=0;i<aFromElements.length;i++){
		var newHidden= document.createElement("input");
		newHidden.type="hidden";
		newHidden.name=aFromElements[i].name;
		newHidden.value=aFromElements[i].value;
		bFrom.appendChild(newHidden);
	}

}

/**
 * 给table赋值
 * @param tableId tableID
 * @param jsonObj 传过来的json数据
 * @return
 * table的样式代码例如：
 *
 */
function setTableValues(tableId,jsonObj){
	var trs = $("#"+tableId).find("tr th");
	var list = jsonObj;
	//增加新数据
    var columnIndex=[];
    $("#"+tableId).find("tr th").each(function(){
		columnIndex.push($(this).attr("clo"));
	});
	if(trs.length>0){
		for(var i=0;i<list.length;i++){
             var tr = $("<tr/>");
             if(i%2==0){tr.attr("class","odd");}else{}
             for(var j=0;j<columnIndex.length;j++){
 				var temp=list[i];
 				var name=columnIndex[j];
 				var tempVal = temp[name];
 				var tdVal=(tempVal=="undefined"||tempVal==null)?"":tempVal;
 				var tdStr="<td width=\"\">"+tdVal+"</td>";
 				tr.append($(tdStr));
 			}
            $("#"+tableId+" tbody").append(tr);
		}
	}
}
$(document).ready(function() {
	$(document.body).append('<div class="shadow" style="z-index:999" id="alertshadowIdxx"></div>'+
			'<div class="aialog misage_box" style="z-index:1000" id="alertShowIdxx">'+
			'<div class="aialog_box">'+
				'<div class="aialog_title" ><div class="close_dialog" id="alertTitleClose" onclick="hideDialog()"></div><span id="alertTitleBody">提示信息</span></div>'+
		       ' <div class="alert_cont" id="alertShowMsgId">'+
		        '</div>'+
		        '<div class="aialog_tool">'+
		       	  '<input type="button" class="inp_btn" value="确定" onclick="hideDialog()" id="alertShowMessageCloseId"/>'+
		        '</div>'+
		    '</div>'+
		'</div>').append('<div class="aialog w_800px" style="width:1024px"  id="ajaxExceptionDialog">'+
				'<div class="aialog_box">'+
				'<div class="aialog_title"><div class="close_dialog" id="closeStack"></div>堆栈信息</div>'+
		        '<div class="alert_cont" id="exceptionStack">'+
		        '</div>'+
		    '</div>'+
		'</div>').append('<div class="shadow" style="z-index:999" id="confirmshadowIdxx"></div>'+
			'<div class="aialog misage_box" style="z-index:1000" id="confirmShowIdxx">'+
				'<div class="aialog_box">'+
					'<div class="aialog_title"><div class="close_dialog" id="confrimTitleClose" onclick="confirmHideDialog()"></div>提示</div>'+
			        '<div class="question_cont" id="confirmMsgId">'+
			        '</div>'+
			        '<div class="aialog_tool">'+
			           '<input type="button" class="inp_btn" value="确定" onclick="confirmHideDialog()" id="confirmOK"/>'+
			       	   '<input type="button" class="inp_btn" value="取消" id="confrimBtnClose" onclick="confirmHideDialog()"/>'+
			        '</div>'+
			    '</div>'+
			'</div>').append('<form action="" method="post" id="newReLoadId"></form>');
	
});

/**
 * 显示异常信息用
 * @param msg  返回的异常信息，
 */
function alertError(msg,functionName){
	$("#alertShowMessageCloseId").unbind("click");
	$("#alertTitleBody").toggle(function(){
		$("#ajaxExceptionDialog").show();
		if (window.clipboardData) {
					window.clipboardData.clearData();
				    window.clipboardData.setData("Text", msg.exceptionStack);
		    }
	},function(){
		$("#ajaxExceptionDialog").hide();
	});
	$("#closeStack").click(function(){
		$("#ajaxExceptionDialog").hide();
	});
	 
	$("#alertShowMessageCloseId").bind("click",functionName);
	$("#alertShowMsgId").html(msg.exception.message);
	$("#exceptionStack").html(msg.exceptionStack);
	openDialog("alertshadowIdxx","alertShowIdxx");
	$("#alertShowMessageCloseId").focus();
	closeWaitWin();
}


function alertShow(msg){
	$("#alertShowMessageCloseId").unbind("click");
	$("#alertShowMsgId").html(msg);
	openDialog("alertshadowIdxx","alertShowIdxx");
	$("#alertShowMessageCloseId").focus();
}

function alertShow(msg,functionName){
	//确定按钮
	$("#alertShowMessageCloseId").unbind("click")
	.click(functionName)
	.focus();
	//关闭按钮
	$("#alertTitleClose").unbind("click")
	.click(functionName);
	//消息
	$("#alertShowMsgId").html(msg);
	//打开
	openDialog("alertshadowIdxx","alertShowIdxx");
}
function alertShowT(msg,functionOK,functionNO){
	$("#alertShowMessageCloseId").unbind("click");
	$("#alertTitleClose").unbind("click");
	$("#alertShowMsgId").html(msg);
	$("#alertShowMessageCloseId").bind("click",functionOK);
	$("#alertTitleClose").bind("click",functionNO);
	openDialog("alertshadowIdxx","alertShowIdxx");
	$("#alertShowMessageCloseId").focus();
}

//可以自定义按钮显示名称，和按钮事件、关闭窗口事件、是否显示关闭窗口
function alertShowNext(msg,butName,functionOK,functionNO,isShowClose){
	$("#alertShowMessageCloseId").unbind("click");
	$("#alertTitleClose").unbind("click");
	$("#alertShowMessageCloseId").removeAttr("value");
	$("#alertShowMessageCloseId").attr("value",butName);
	$("#alertShowMsgId").html(msg);
	$("#alertShowMessageCloseId").bind("click",functionOK);
	if(isShowClose){
		$("#alertTitleClose").bind("click",functionNO);
	}else{
		$("#alertTitleClose").removeAttr("class");
	}
	openDialog("alertshadowIdxx","alertShowIdxx");
	$("#alertShowMessageCloseId").focus();
}

function hideDialog(){
	 $('#alertShowIdxx').hide();
	 $('#alertshadowIdxx').hide();
	 $("#ajaxExceptionDialog").hide();
	 $("#ajaxExceptionDialog").hide();
	//closeDialog("alertshadowIdxx","alertShowIdxx");
}

function alertShow(msg,fun,type){
	$("#alertShowMsgId").html(msg);
	$("#alertShowMsgId").removeClass("alert_cont");
	$("#alertShowMsgId").removeClass("error_cont");
	$("#alertShowMsgId").removeClass("info_cont");
	$("#alertShowMsgId").removeClass("question_cont");
	
	$("#alertShowMessageCloseId")
	.unbind("click")
	.bind("click",fun);
	//关闭按钮
	$("#alertTitleClose").unbind("click")
	.click(fun);
	
	if(type==1){
		$("#alertShowMsgId").addClass("alert_cont");
	}else
	if(type==2){
		$("#alertShowMsgId").addClass("error_cont");
	}else
	if(type==3){
		
		$("#alertShowMsgId").addClass("info_cont");
	}else
	if(type==4){
		
		$("#alertShowMsgId").addClass("question_cont");
	}else{$("#alertShowMsgId").addClass("alert_cont");}
	openDialog("alertshadowIdxx","alertShowIdxx");
	$("#alertShowMessageCloseId").focus();
}


function confirmShow(msg,functionOK){
	$("#confirmOK").unbind("click").bind("click",functionOK).focus();
	$("#confirmMsgId").html(msg);
	openDialog("confirmshadowIdxx","confirmShowIdxx");
}
function confirmShow(msg,functionOK,functionNO){
	$("#confirmOK").unbind("click").bind("click",functionOK).focus();
	$("#confrimTitleClose").unbind("click").bind("click",functionNO);
	$("#confrimBtnClose").unbind("click").bind("click",functionNO);
	$("#confirmMsgId").html(msg);
	openDialog("confirmshadowIdxx","confirmShowIdxx");
}

function confirmShowT(msg,functionOK,functionNO){
	$("#confirmOK").unbind("click").bind("click",functionOK).focus();
	$("#confrimBtnClose").unbind("click").bind("click",functionNO);
	$("#confirmMsgId").html(msg);
	openDialog("confirmshadowIdxx","confirmShowIdxx");
}
function confirmYesNoShow(msg,oktext,closetext,functionOK,functionNO){
	$("#confirmOK").val(oktext).unbind("click").bind("click",functionOK).focus();
	$("#confrimTitleClose").unbind("click").bind("click",functionNO);
	$("#confrimBtnClose").val(closetext).unbind("click").bind("click",functionNO);
	$("#confirmMsgId").html(msg);
	openDialog("confirmshadowIdxx","confirmShowIdxx");
}

function confirmHideDialog(){
	$('#confirmShowIdxx').hide();
	$('#confirmshadowIdxx').hide();
}
/**
 * 下载文件调用这个方法,页面上需要有一个div，id为divId
 * <div class="shadow" id="myFileDownDiv"></div>
 * @param entityType 实体类别
 * @param entityId 实体ID
 * @param divId
 * @param delBtn   是否需要删除附件按钮，为true表示有，
 * 如果这里传一个function的话  则有按钮，且删除完成后 会执行这个function  相当于删除回调函数
 * @param downCallBack
 * 点击下载按钮的回调函数
 * $(this).attr("fileId")	文件id
 * $(this).attr("entityId")实体id
 */ 
function downInfo(entityType,entityId,divId,delBtn,downCallBack) {
	if(delBtn==null)
		delBtn=false;
	var path = getBasePath() +"/base/downInfo.action";
	var downPath = getBasePath() + "/base/fileDownLoadAction.action";
	var delPath=getBasePath()+"/base/logicDelFile.action"; 
	$.post(path,
			{"entityId":entityId,"entityType":entityType},
			function(json){
				$("#"+divId+"_down_Dialog").remove();
				var list = json.baseFileInfolist;
				$("#"+divId).after("<div class='aialog' id='"+divId+"_down_Dialog' style='width: 520px;z-index:1000;'><div class='aialog_box' ><div class='aialog_title'><div class='close_dialog' onclick='javascript:$(\"#"+divId+"\").hide();$(\"#"+divId+"_down_Dialog\").empty();$(\"#"+divId+"_down_Dialog\").hide();'></div>相关附件下载</div><div class='' id='"+divId+"_divTable'></div><div class='aialog_tool'><input name='' type='button' class='inp_btn' value='取消' onclick='javascript:$(\"#"+divId+"\").hide();$(\"#"+divId+"_down_Dialog\").empty();$(\"#"+divId+"_down_Dialog\").hide();' /></div></div></div>");
				$("#"+divId+"_divTable").append("<table id='"+divId+"_ajaxTabele' width='100%'></table>");
				$("#"+divId+"_ajaxTabele").append("<tr id='tr' width='80'><td>文件名称</td><td>文件大小</td><td>操作</td></tr>");
				for(var i=0;i<list.length;i++){
					if(delBtn){
						$("#"+divId+"_ajaxTabele").append("<tr id='tr' width='80'><td>"+list[i].originalName+"</td><td>"+list[i].fileLength+"</td><td><a href='"+downPath+"?baseFileId="+list[i].id+"' class='inp_btn' btnType='down' fileId='"+list[i].id+"'  entityId='"+entityId+"'>下载</a>"+
								"&nbsp;<a href='#' name=\"delFileInfoBtn\" val='"+list[i].id+"' class='inp_btn'>删除</a></td></tr>");
					}else{
							$("#"+divId+"_ajaxTabele").append("<tr id='tr' width='80'><td>"+list[i].originalName+"</td><td>"+list[i].fileLength+"</td><td><a href='"+downPath+"?baseFileId="+list[i].id+"' class='inp_btn' btnType='down' fileId='"+list[i].id+"'  entityId='"+entityId+"'>下载</a></td></tr>");
					} 
				}
				$("#"+divId+"_ajaxTabele a[btnType=down]").click(function(){
						downCallBack.apply($(this));
				});
				
				$.each($("#"+divId+"_ajaxTabele a[name=delFileInfoBtn]"),function(i,n){
					$(n).bind("click",function(){
						confirmShow("确定要删除这个附件吗？",function(){
							$.expost(delPath,{"baseFileInfo.id":$(n).attr("val")},function(result){
									$("#"+divId).hide();
									$("#"+divId+"_down_Dialog").empty();
									$("#"+divId+"_down_Dialog").hide();
									downInfo(entityType,entityId,divId,delBtn);
									if(typeof delBtn =="function")
										delBtn();
							});
						});
					});
				}); 
				var theHeight = $(document).height();
				var theWidth = $(document).width() / 2;
				var dialogHeight = $("#"+divId+"_down_Dialog").height() / 2;
				var dialogWidth = $("#"+divId+"_down_Dialog").width() / 2;
				$("#"+divId).css('height', theHeight).show();
				$("#"+divId+"_down_Dialog").css({
					'top' : theHeight / 2 - dialogHeight,
					'left' : theWidth - dialogWidth
				}).show();
			});
}


/**
 * 
 * @param key  传审批流的KEY
 * @param submitFunction 确定按钮的操作，是个function，必填
 * 
 * 用法：
 * startJbpmDeploy('csOnceCharPriceKey',function(advice){
		alert("请求信息:"+advice);
		$.expost(……);
	})
 */
function startJbpmDeploy(key,submitFunction){
	var shadow=$("<div class='shadow' id='startJbpmDeployShadow' />");
	var dialog=$("<form id='startJbpmDeployForm' method='post'  >" +
			"<div class='aialog w_600px' id='startJbpmDeployDialog'>" + 
			"<div class='aialog_box'>" + 
			"  <div class='aialog_title'>" + 
			"    <div class='close_dialog' id='closeJbpmDeployDialogBtn' ></div>发起审批</div>" + 
			"    <div class='aialog_cont'>" + 
			"      <div class='yanzheng' style='width:600px;height: 100px'>" + 
			"        <div class='wenzi'>审批意见：</div>" + 
			"        <div class='shuru' style='width:400px;height: 100px'>" + 
			"          <textarea name='task.advice'  class='textareas' style='width:300px;height: 80px;resize:none'></textarea>" + 
			"        </div>" + 
			"      </div>" + 
			"    </div>" + 
			"    <div class='aialog_tool'>" + 
			"      <input type='button'  class='inp_btn' value='查看流程图' id='openJbpmPicture' />" + 
			"      <input type='button'  class='inp_btn' value='确定' id='startJbpmSubmit' />" + 
			"      <input  type='button' class='inp_btn' id='closeJbpmDeployDialogBtn' value='取消' />" + 
			"    </div>" + 
			"</div>" + 
			"</div>" + 
			"</form>");
	var pictures =$("<div class='aialog w_800px' id='deployPicture' style='height:415px'>" +
			"<div class='aialog_box'>" + 
			"<div class='aialog_title'>" + 
			"<div class='close_dialog' onclick='closeDialog(\"notToShadow\",\"deployPicture\")'></div>" + 
			"查看流程图" + 
			"</div>" + 
			"<div class='aialog_cont'  style=' position:absolute; width:780px;height: 380px;overflow: auto'>" + 
			"<img id='deployPictureImg' style='position: absolute;left: 0;top: 0'  />" + 
			"</div>" + 
			"</div>" + 
			"</div>");
	
	
	//关闭按钮事件
	dialog.find("#closeJbpmDeployDialogBtn").click(function(){
		$("#startJbpmDeployShadow,#startJbpmDeployDialog").remove();
	});
	dialog.find("#startJbpmSubmit").click(function(){
		//把审批意见当做参数传过去
		submitFunction($("#startJbpmDeployForm textarea").val());
		$("#startJbpmDeployShadow,#startJbpmDeployDialog").remove();
	});
	dialog.find("#openJbpmPicture").click(function(){
		$.expost(getBasePath()+"/jbpm/getProcInstPictureByKey.action",{"key":key},function(){
			pictures.find("#deployPictureImg").attr("src",getBasePath()+"/jbpm/getProcInstPictureByKey.action?key="+key);
			openDialog("notToShadow","deployPicture");
		},{
			waitWin:true
		});
});
	//放入
	$("body").append(shadow).append(dialog).append(pictures);
	//打开
	openDialog("startJbpmDeployShadow","startJbpmDeployDialog");
}



//浏览器后退功能
function back(){
	parent.document.getElementById("leftFrame").contentWindow.backGo();
}  
//打开wait窗口
function openWaitWin(msg){
	if(msg=='undefined'||msg==null){
		msg="操作进行中，请稍等...";
	}
	$('<div class="shadow loadshadow" id="showWaitingShadow"></div><div  style="display:none" id="showWaiting">'+
		' <div id="showWaitingMsg"  class="progressBar">'+msg+'</div></div>').appendTo($(document.body));
	openDialog('showWaitingShadow','showWaiting');
	$("#showWaitingMsg").focus();
}
//关闭wait窗口
function closeWaitWin(){
	$("#showWaitingShadow").remove();
	$("#showWaiting").remove();
}



/***
 * 打开阴影层
 * shadowId 阴影层div的id
 * */
function openShadow(shadowId){
	var theHeight =  $(document).height();
	var theWidth =  $(document).width();
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();  //当前浏览器窗口的 宽高
    var scrolltop = $(document).scrollTop();//获取当前窗口距离页面顶部高度
    var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
    $('#'+shadowId).css('height',theHeight+scrolltop).css('width',theWidth+scrollLeft).show();
	   //浏览器窗口大小改变时
    $(window).resize(function() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        scrolltop = $(document).scrollTop();
        $('#'+shadowId).css('height',theHeight+scrolltop).show();
    });
    //浏览器有滚动条时的操作
    $(window).scroll(function() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        scrolltop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();//获取当前窗口距离页面左部高度
    });
}
function test(fun){
	if(fun){fun();}
	}
/** 解析action放入Id为newReLoadId的form中 并提交
 * @param str
 */
function antiSerialize(str){
	var index = str.indexOf("fescoSplit");
	var dataStr = str.substring(0,index);
	var action = str.substring(index+10,str.length);
	var all = dataStr.split("&");
	$(all).each(function(){
		var indexStr = this.indexOf("=");
		var name = this.substring(0,indexStr);
		var val = this.substring(indexStr+1,this.length);
		var $input = $("<input type='hidden'>").attr("name",name).val($.url.decode(val));
		$("#newReLoadId").append($input);
	});
	$("#newReLoadId").attr("action",action);
	$("#newReLoadId").submit();
}

//无提示刷新
function reload(fun){
	if(undefined!=fun){
		fun();
	}else{
		var allUrl=window.document.location.href;
		var index=allUrl.lastIndexOf("/");
		var allAction=allUrl.substring(index+1,allUrl.length);
		var action = allAction.substring(0,allAction.indexOf("."));
		//通过跳转来的action获取原数据信息
		var dateAndUrl = getFromMsg(action,1);
		if(false!=dateAndUrl){
			antiSerialize(dateAndUrl);
		}else{
			window.location.reload(true);
		}
	}
	
}
/**指定刷新
 * @param nameSpace bd  cs  es  fm
 * @param action 跳转的url
 */
function toUrlPage(nameSpace,action){

		var dateAndUrl = getFromMsg(action,1);
		if(false!=dateAndUrl){
			antiSerialize(dateAndUrl);
		}else{
			window.location.href = getBasePath()+"/"+nameSpace+"/"+action+".action";
		}
	
}

//从最上级main中获取参数
function getFromMsg(action,index){
	try {
		if(index==7)
			return false;
		if(undefined!=parent.isMain){
			return parent.getFromVal(action);
		}else{
			index+=1;
			return parent.getFromMsg(action,index);
		}
	} catch (e) {
		alertShow("上级fesco.js未引入,请联系技术组修改!");
	}
}
//向最上级mian设置参数
function setReLoadVal($obj,index){
	try {
		if(index==7)
			return true;
		if(undefined!=parent.isMain){
			return parent.reSetFromVal($obj);
		}else{
			index+=1;
			return parent.setReLoadVal($obj,index);
		}//
	} catch (e) {
		alertShow("上级fesco.js未引入,请联系技术组修改!");
	}
}

function hiddenUp(hidName){
	if($("#openCloseUp").attr("class")=="hide_up"){
		$("#openCloseUp").removeClass("hide_up");
		$("#openCloseUp").addClass("hide_down");
		$("#"+hidName).hide();
	}else{
		$("#openCloseUp").removeClass("hide_down");
		$("#openCloseUp").addClass("hide_up");
		$("#"+hidName).show();
	}
}
function updownhid(obj,hidName){
	var targ=$('#'+hidName);
	if(obj.attr("class")=="hide_up"){
		obj.removeClass("hide_up").addClass("hide_down");
		targ.hide();
	}else{
		obj.removeClass("hide_down").addClass("hide_up");
		targ.show();
	}
}
//  验证参数是否有效
function valiNull(obj){
	if(obj==undefined||obj==null||obj.length==0){
		return false;
	}
	return true;
}


/**
 *   方法说明：将多选的checkbox的指定属性返回，以逗号分隔
 *   如果不指定属性，则默认拿value
 * @param jqueryObj
 * @param property
 * @returns
 */
function transProp(jqueryObj,property){
	var body =[];
	if(property==null)
		property = "value";
	$.each(jqueryObj,function(i,n){
			body.push($(this).attr(property));
	});
	return body.join(",");
}


/**
 * 判断选择的数据列上面的属性是否有符合条件的
 * @param jqueryObj
 * @param property
 * @param value
 * @returns {Boolean}
 */
function checkProp(jqueryObj,property,value){
	var bool = false;
	if(property==null)
		property = "value";
	$.each(jqueryObj,function(i,n){
		if($(n).attr(property)==value){
			bool = true;
			return false;
		}
	});
	return bool;
}


//修改顶部页签，name和url  url要完整路径
function setTopTab(name,url){
	if(top.topFrame)
		window.top.topFrame.setTheTab(url,name,name);
}
 

/**
 * @param rpt 报表路径: 如:'es/accu/**.brt(params=ids=1001;paytype=1)'
 * @param printSelect 是否显示选择打印机提示框,默认不显示
 * @return 输出到打印机
 *  方法说明: 打印报表,无预览
 */
function printNoPreview(rpt,printSelect)
{
	if(printSelect==null){printSelect=false;}
	//跟路径
	var appRoot=""+getBasePath();
	var pathName=window.document.location.pathname;
	//项目名带 '/'
	var appmap=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	var html = "<object classid='clsid:8AD9C840-044E-11D1-B3E9-00805F499D93'	codebase='";
	html += appRoot+"/j2re-1_4_2_18-windows-i586-p.exe#Version=1,4,1,0'	width='0' height='0' id='report1_directPrintApplet'>"	;
	html += "<param name='name' value='report1_directPrintApplet'>"	;
	html += "<param name='code' value='bios.report.web.print.DirectPrintApplet.class'>";
	html += "<param name='archive' value='"+appmap+"/ReportPrint.jar'>";	
	html += "<param name='type' value='application/x-java-applet;version=1.4'>";
	html += "<param name='rootURL' value='"+appRoot+"'>";	
	html += "<param name='fileName' value='"+rpt+"'>";
	html += "<param name='needSelectPrinter' value='yes'>";
	html += "<param name='needShowHint' value='no'>";
	html += "<param name='scriptable' value='true'>";
	html += "<COMMENT>";
	html += "<embed type='application/x-java-applet;version=1.4' ";
	html += "pluginspage='"+appRoot+"/j2re-1_4_2_18-windows-i586-p.exe#Version=1,4,1,0' "; 
	html += "width='0' height='0' ";
	html += "name='report1_directPrintApplet' "; 
	html += "id='report1_directPrintApplet' "; 
	html += "CODE = 'bios.report.web.print.DirectPrintApplet.class' "; 
	html += "ARCHIVE ='"+appmap+"/ReportPrint.jar' "; 
	html += "rootURL='"+appRoot+"' ";
	html += "fileName='"+rpt+"' "; 
	if(printSelect==true){
		html += "needSelectPrinter='yes' ";
	}else{
		html += "needSelectPrinter='no' ";
	}
	html += "needShowHint='no' ";
	html += "scriptable='true'>";
	html += "</embed>";
	html += "</COMMENT> ";
  html += "</object>";
//
  document.getElementById("ReportPrint").innerHTML = html;
  
 
} 

/**
 * 传入query条件，可以使functionId，也可以是功能菜单的name
 * 会查询到左侧功能菜单对应的标签，增加样式
 * @param query
 */
function jumpFunction(query){
	var retNode = null;
	$.each(top.leftFrame.treeArray,function(idx,tree){
		var node = tree.getNodeByParam("id",query)==null ? tree.getNodeByParam("name",query) : tree.getNodeByParam("id",query);
		if(node!=null){
			tree.selectNode(node);
			$("#"+node.tId).parents(".global_module").find("h3:first").click();
			retNode = node;
			return false;
		}
	});
	return retNode;
}

/**
 * 
 * @param tableId
 * 
 * 传入tableId，返回这个table的tbody里，第一行（checkbox行）的所有选中的checkbox对象
 * 如果没有tableId，就拿页面中的第一个table
 */
function getSelected(tableId){
	if(tableId!=null&&tableId!="")
		return $("#"+tableId+" tbody tr :first-child input:checked");
	else
		return $("table:first tbody tr :first-child input:checked");
}
