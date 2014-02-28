(function($){
    me=null;
    var ps=-4;
    var movedThBool = false;
    var len=0;
    $.fn.movedTh=function(){
        me=this;
        var target = null;
        var i=0;
        //如果th的左偏移计算的和table的左偏移一样，就做另一套处理，暂时修改，未找到原因。
        //注：如果你的页面的一个table实际是由两个table拼成，一个放th的table和一个放td的table
        //那么，请一定不要把drag属性给到这两个table上，不适用，就算给也没效果，会报错。详情请@王松
        movedThBool = me.offset().left == $(me).find("tr:first").find("th").first().offset().left;
        me.css("position","relative");
        me.find("tr:first").find("th").attr("style","white-space: nowrap;overflow:hidden");
        len = $(me).find("tr:first").find("th").length;


        $(me).find("tr:first").find("th").each(function(idx,val){
        	var th = $(val);
        	if("false"!=th.attr("drag")){

               /*var scrollLeft = $(me).parent().scrollLeft();//有滚动条的情况xdq
                if(me.attr("overHead")){
                	scrollLeft=$(obj).parents("table").parent().scrollLeft();
                }*/
        		//计算每个TH的左偏移
                var pos=th.offset().left +th.width()+ me.offset().left-ps-10;
                if(movedThBool)
              	  pos = th[0].offsetLeft+th.width()-ps-10;
        		
                //生成div 放到th里
        		var dragThDiv =$("<div id='dragDiv_"+idx+"' onmousedown='$().mousedone.movedown(event,this)'     />")
        			.addClass("resizeDivClass")
        			.attr("dragDiv",true)
        			.css("top",0)
        			.css("left",pos).appendTo(th);
        		
        		//如果是最后一个th，为了保证页面不出现滚动条，将宽度缩小
                  if((len-1)==idx)
                	  dragThDiv.css("width","10px");
        	}
        }); //end each
    };   //end moveTh
    $.fn.mousedone={
        movedown:function(e,obj){
            var d=document;
            //一个页面中有两个table使用拖拽的话，me对象会被覆盖，找不到对应的table，这里重新指定me对象所代表的table， 
            if($(obj).parents("div[name=overHeadDiv]").length>0)
            	me = $(obj).parents("div[name=overHeadDiv]").next("table");
            else
            	me = $(obj).parents("table");
            var e = window.event||e ;
            var myX = e.clientX||e.pageX;
                obj.mouseDownX=myX ;
                obj.pareneTdW=$(obj).parent().width();  //obj.parentElement.offsetWidth;
                obj.pareneTableW=me.width();
                if(obj.setCapture){
                    obj.setCapture();
                }else if(window.captureEvents){
                    window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
                }
            d.onmousemove=function(e){
                var dragData=obj;
                var event = window.event||e ;
                if(!dragData.mouseDownX) return false;
                var newWidth=dragData.pareneTdW*1+(event.clientX||event.pageX)*1-dragData.mouseDownX;
                    if(newWidth>0){
                    	//如果有overHead，就另作处理
                        $(obj).parent().width(newWidth);
                        if(me.attr("overHead")){
                            //拿下标
                            var index =$(obj).attr("id").substring($(obj).attr("id").indexOf("_")+1);
                            me.find("tr:first th:eq("+index+")").width(newWidth);
                            //重新给table设置宽度，否则当TABLE的宽度低于原来宽度的时候会出现不对齐的情况
                            $(obj).parents("table").width(dragData.pareneTableW*1+(event.clientX||event.pageX)*1-dragData.mouseDownX);
                        }else{
                        	
                        } 
                        me.width(dragData.pareneTableW*1+(event.clientX||event.pageX)*1-dragData.mouseDownX);
                        //me.parent().css("width",me.width());
                    //    console.log(me.parent().attr("id")+me.parent().width());
                        var k=0;
                        
                        
                        /*scrollLeft = $(me).parent().scrollLeft();//有滚动条的情况xdq
                        if(me.attr("overHead"))
                        	scrollLeft=$(obj).parents("table").parent().scrollLeft();*/
                        

                        var eachBody = me.find("tr:first").find("th");
                        if(me.attr("overHead"))
                        	eachBody=$(obj).parents("table").find("tr:first").find("th");
                        
                        //每次拖拽需要给隐藏的拖拽div重新定位
                        eachBody.each(function(idx,val){
                        var pos=$(this).offset().left +$(this).width()+ me.offset().left-ps-10;
                        if(movedThBool)
                      	  pos = $(this)[0].offsetLeft+$(this).width()-ps-10;
                        $(this).parents("tr").find("div[id=dragDiv_"+idx+"]").css("left",pos);
                        }); 
                    }//end if
            };
            d.onmouseup=function(e){
                var dragData=obj;
                    if(dragData.setCapture)
                    {
                        dragData.releaseCapture();
                    }else if(window.captureEvents){ window.releaseEvents(e.MOUSEMOVE|e.MOUSEUP);
                    }
                    dragData.mouseDownX=0;
            };
        }
    };   //end mousedone
    $(window).resize(function(){
        setTimeout(function() {
        $(me).find("tr:first").find("th").each(function(idx,val){
        	var th = $(val);
        	var len = $(me).find("tr:first").find("th").length;
        	if("false"!=th.attr("drag")){
        		//计算每个TH的左偏移
                var pos=th.offset().left +th.width()+ me.offset().left-ps-10;
                if(movedThBool)
              	  pos = th[0].offsetLeft+th.width()-ps-10;
        		
                //生成div 放到th里
        		var dragThDiv =$("<div id='dragDiv_"+idx+"' onmousedown='$().mousedone.movedown(event,this)'     />")
        			.addClass("resizeDivClass")
        			.attr("dragDiv",true)
        			.css("top",0)
        			.css("left",pos).appendTo(th);
        		
        		//如果是最后一个th，为了保证页面不出现滚动条，将宽度缩小
                if((len-1)==idx)
                	  dragThDiv.css("width","10px");
        	}
        }); //end each
        //每次改变窗口的时候，重新将table的固定表头再设置一次！
        overHeadFun(me);
        
        }, 10);
    });
})(jQuery);
/*$().ready(function(){
    $("#tab").movedTh();
}) */