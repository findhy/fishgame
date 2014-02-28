
$.fn.extend({
    sorttable: function (setting) {
        // 配置参数
        var configer = $.fn.extend({
            // 属性
            sorttingMsg: "排序中……",
            sorttingMsgColor: "#000",
            allowMask: true,
            maskOpacity: ".30",
            maskColor: "#FFF",
            ascImgUrl: getBasePath()+"/includes/inc/sort/img/asc.gif",
            ascImgSize: "8px",
            descImgUrl: getBasePath()+"/includes/inc/sort/img/dsc.gif",
            descImgSize: "8px",

            // 事件
            onSorted: null // 排序完成回调函数
        }, setting);

        // 获取扩展对象
        var extObj = $(this);
        // 用于锁住当前操作的对象
        var lock = false;
        // 排序属性的可取值
        var sortOrder = {
            byAsc: "asc",
            byDesc: "desc"
        };
        // 自定义属性名
        var myAttrs = {
            order: "order",
            by: "by",
            sort: "sort"
        };
        // 可排序行的头列（jquery对象——集合）
        var headCells ;
        //页面已经选择的列
        var checkedTr;
        if( extObj.find("tr:first>td").length>0){
        	headCells = extObj.find("tr:first>td");
        }else{
        	headCells = extObj.find("tr:first>th");
        } 
        if(headCells.find("div").children(".asc,.desc").length==0){
        	headCells.each(function () {
        		
        		if (configer.ascImgUrl != "" && configer.descImgUrl != "") {
//        			try {
//        				$("<img class='asc' src='" + configer.ascImgUrl + "' style='width:" + configer.ascImgSize + "; height:" + configer.ascImgSize + ";display:none;width:5px;height:4px;float:right;margin:9px 2px 0 0;' title='升序' alt='升序'/>").insertBefore($(this).find(".resizeDivClass"));
//        				$("<img class='desc' src='" + configer.descImgUrl + "' style='width:" + configer.descImgSize + "; height:" + configer.descImgSize + ";display:none;width:5px;height:4px;float:right;margin:9px 2px 0 0; ' title='降序' alt='降序'/>").insertBefore($(this).find(".resizeDivClass"));
//					} catch (e) {
        			var outerDiv=$("<div style='position:relative;float:right'></div>");
					$("<img class='asc' src='" + configer.ascImgUrl + "' style='width:" + configer.ascImgSize + "; height:" + configer.ascImgSize +
							";display:none;width:5px;height:4px;float:right;margin:9px 2px 0 0;*margin-top:-12px;position:absolute;right:0' title='升序' alt='升序'/>").appendTo(outerDiv);
					$("<img class='desc' src='" + configer.descImgUrl + "' style='width:" + configer.descImgSize + "; height:" + configer.descImgSize + 
							";display:none;width:5px;height:4px;float:right;margin:9px 2px 0 0;*margin-top:-12px;position:absolute;right:0 ' title='降序' alt='降序'/>").appendTo(outerDiv);
					outerDiv.appendTo($(this));
						// TODO: handle exception
//					}
        		}
        		else {
        			$("&nbsp;<span class='asc' style='width:7px; height:4px;display:none;float:right;' title='升序'>&#118;</span>").appendTo($(this));
        			$("&nbsp;<span class='desc' style='width:7px; height:4px;display:none;float:right;' title='降序'>&#94;</span>").appendTo($(this));
        		}
        		$(this).css("cursor", "default");
        		
        	});
        }else{
        	headCells.find("div").children(".asc,.desc").hide();
        }

        // 设置头列点击事件
        headCells.dblclick(function () {
        	if(($(this).find("input:checkbox").length!=0)){
        		return false;
        	}
            var thisCell = $(this);
            $(this).addClass("th_hover");
            if (lock == false) {
                lock = true; // 锁事件

                if (configer.allowMask) {
                    var tw = extObj.outerWidth();
                    var th = extObj.outerHeight();
                    var tOffSet = extObj.offset();
                    var tTop = tOffSet.top;
                    var tLeft = tOffSet.left;
                    // 添加遮罩层
                    var mark = $("<div></div>").attr("id", "TableSort_Mark").css("background-color", configer.maskColor).css("position", "absolute").css("top", tTop + "px").css("left", tLeft + "px").css("opacity", configer.maskOpacity).css("z-index", "9999").css("width", tw + "px").css("height", th + "px");
                    mark.html("<h3 id='TableSort_Sortting' style='opacity:1;color:" + configer.sorttingMsgColor + ";padding:36px 0 0 0;text-align:center;'>" + configer.sorttingMsg + "</h3>");
                    mark.appendTo($("body"));
                     //alertShow(0);
                    // 延时执行排序方法，显示遮罩层需要时间~
                    window.setTimeout(function () {
                    	//记录被选中的
                    	extObj.find(":checked").attr("isCheckSort",true);
                        // 设置列排序
                        SetColumnOrder(thisCell);
                        // 触发排序完成回调函数
                        FireHandleAfterSortting(thisCell);
                        // 解锁，撤销遮罩层
                        lock = false;
                        //恢复被选中的
                       extObj.find("input[isCheckSort=true]").attr("checked",true).removeAttr("isCheckSort");
                        mark.remove();
                    }, 100);
                }
                else {
                    // 设置列排序
                    SetColumnOrder(thisCell);
                    // 触发排序完成回调函数
                    FireHandleAfterSortting(thisCell);

                    // 解锁，撤销遮罩层
                    lock = false;
			
                }

                // 所有头部的列的排序标记设置为false
                headCells.attr(myAttrs.order, false);
                // 被点击列的排序标志设置为true
                thisCell.attr(myAttrs.order, true);
                // 设置排序列的排序规则
                var by = thisCell.attr(myAttrs.by);
                thisCell.attr(myAttrs.by, (by == sortOrder.byAsc ? sortOrder.byDesc : sortOrder.byAsc));
            }
        });

        //====================================
        // 说明：触发排序完成回调函数
        // 参数：sortCell = 当前排序的列头
        //------------------------------------
        function FireHandleAfterSortting(sortCell) {
            if (configer.onSorted != null) {
                configer.onSorted(sortCell);
            }
        }

        //====================================
        // 说明：设置列排序
        // 参数：headCell = 列头（jquery对象）
        //------------------------------------
        function SetColumnOrder(headCell) {
            var by = headCell.attr(myAttrs.by);
            var index = headCell.index();
            var rs = extObj.find("tr:not(:first)[name!='emptyTr']").clone(true);
            var emptyTr = extObj.find("tr:not(:first)[name='emptyTr']").clone(true);
            rs.sort(function (r1, r2) {
                var a = $.trim($(r1).children("td").eq(index).text());
                var b = $.trim($(r2).children("td").eq(index).text());
                if (a == b) {
                    return 0;
                }

                var isDt = IsTime(a) && IsTime(b);

                if (isDt) {
                    var dt1 = new Date(a.replace(/-/g, "/"));
                    var dt2 = new Date(b.replace(/-/g, "/"));
                    if (dt1.getTime() > dt2.getTime()) {
                        return (by == sortOrder.byAsc) ? 1 : -1;
                    }
                    else {
                        return (by == sortOrder.byAsc) ? -1 : 1;
                    }
                }
                else if(!IsLargeNum(a)&&!IsLargeNum(b)){
                    if (formatNum(a) - formatNum(b) > 0) {
                        return (by == sortOrder.byAsc) ? 1 : -1;
                    }
                    else {
                        return (by == sortOrder.byAsc) ? -1 : 1;
                    }
                }
                else if (isNaN(a) || isNaN(b)) {
                    return (by == sortOrder.byAsc) ? a.localeCompare(b) : b.localeCompare(a);
                }
                else {

                    if (a - b > 0) {
                        return (by == sortOrder.byAsc) ? 1 : -1;
                    }
                    else {
                        return (by == sortOrder.byAsc) ? -1 : 1;
                    }
                }
            });
            extObj.find("tr:not(:first)").remove();
            extObj.append(rs);
            extObj.append(emptyTr);
            // 显示箭头排序列图标
            headCells.find("div").children(".asc,.desc").hide();
            if (by == sortOrder.byAsc) {
                headCell.find("div").children(".asc").show();
            } else {
                headCell.find("div").children(".desc").show();
            }
            extObj.find("tr:not(:first):odd").addClass("odd");
            extObj.find("tr:not(:first):even").removeClass("odd");
        }

        //================================================
        // 说明：判断字符串是否是时间
        //------------------------------------------------
        function IsTime(dateString) {
            dateString = $.trim(dateString);
            if (dateString == null && dateString.length == 0) {
                return false;
            }

            dateString = dateString.replace(/\//g, "-");
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = dateString.match(reg);
            if (r == null) {
                var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
                var r = dateString.match(reg);
            }

            return r != null;
        }
        
        //判断该数字是否是带有千位运算符的number
        function IsLargeNum(num){
        	var number = num.toString().replace(",","");
        	return isNaN(number);
        }
        
        //千位格式化的number还原的方法
        function formatNum(val){
        	return val.toString().replace(",","");
        }
        
    }
});

