 function sortTableImg(tab){
   var thCurt = $('#'+tab+ ' tr:eq(0)').children("th");
   var baph = getBasePath();
   var imgs = "<img class='asc'  src='"+baph+"/includes/inc/sort/img/asc.gif' style='width:8px;height:8px;display:none;width:5px;height:4px;float:right;margin:9px 2px 0 0;' title='升序' alt='升序'/>";
       imgs += "<img class='desc' src='"+baph+"/includes/inc/sort/img/dsc.gif' style='width:8px;height:8px;display:none;width:5px;height:4px;float:right;margin:9px 2px 0 0;' title='降序' alt='降序'/>";
   thCurt.append(imgs);
 }
// 升序排序方法
function sortfunctionAsc(x,y){
  if (isNaN(x[0]) || isNaN(y[0])) {
       return x[0].localeCompare(y[0]);
  }else{
      if(Number(x[0]) > Number(y[0])){
         return  1;
      }else if(Number(x[0]) < Number(y[0])){
         return  -1;
      }else{
         return  0;
      }
  }
}
// 降序排序方法
function sortfunctionDesc(x,y){
  if (isNaN(x[0]) || isNaN(y[0])) {
       return y[0].localeCompare(x[0]);
  }else{
      if(Number(y[0]) > Number(x[0])){
         return  1;
      }else if(Number(y[0]) < Number(x[0])){
         return  -1;
      }else{
         return  0;
      }
  }
}
 function sortTableAjax(tab,sortNum){
  var tableSort = $('#'+tab);
  var trOddClass ='';
  if(tab=='inputDatas'){
    trOddClass = 'odd1';
  }else{
    trOddClass = 'odd';
  }
  var srt = tableSort.attr("sort");         // 当前排列是升序还是降序
  var srtNO = tableSort.attr("sortCellNO"); // 当前排列的列号
  if(srt === undefined){
    tableSort.attr("sort","A");
  } 
  tableSort.attr("sortCellNO",sortNum);
  srt = tableSort.attr("sort");
  srtNO = tableSort.attr("sortCellNO");
  var sortArray = new Array();
  var sortArrayNull = new Array();
  var ix = 0; // 显示的行数
  var ixNul = 0; // 显示的行数
  $('#'+tab+" tr:not(:first)").each(function(index,item){
       var inx = $(this).children("td").eq(1).text();
       // alert(inx);
       if(inx!=''){
        var sortName = $(this).children("td").eq(sortNum).text(); // *********
        sortName =  sortName.replace(/,/g,"");
        if(!isNaN(sortName) &&  sortName !=''){
              var mul = sortName * 1000;
              mul =  parseInt(mul) ;
              if(mul==0){
                mul = 1;
              }
              sortName = mul ;
        }
        sortArray[ix]= new Array(sortName,item);
       }else{
        sortArrayNull[ixNul]= new Array(sortName,item);
        ixNul++; 
       }
       ix++;
   }); 
    var content=$("#"+tab+" tr:first-child").html(); 
    content = "<tr>"+content+"</tr>";
	var tabCont = content;
	if(srt=='A'){
        tableSort.attr("sort","D");
        sortArray.sort(sortfunctionAsc);
     }else{
         tableSort.attr("sort","A"); 
         sortArray.sort(sortfunctionDesc); 
     }
     for(var i=0;i<sortArray.length;i++){    
             var arrSecond = new Array();   
             arrSecond = sortArray[i];   
             for(var j=1;j<arrSecond.length;j++){    
                  var trCurt =  $(arrSecond[j]);  
                  if(i%2==trOdd){ //
                      tabCont += " <tr class='"+trOddClass+"' >"+trCurt.html()+"</tr>";       
                   }else{
                      tabCont += " <tr>"+trCurt.html()+"</tr>";
                   }      
             } 
      } 
      //
      var oddTr = 1;
      if(sortArrayNull.length %2 == 0){
       oddTr = 0;
      }
      for(var i=0;i<sortArrayNull.length;i++){    
             var arrSecond = new Array();   
             arrSecond = sortArrayNull[i];   
             for(var j=1;j<arrSecond.length;j++){    
                  var trCurt =  $(arrSecond[j]);  
                  if(i%2==oddTr){ //
                       tabCont += " <tr>"+trCurt.html()+"</tr>";  
                   }else{
                       tabCont += " <tr class='"+trOddClass+"' >"+trCurt.html()+"</tr>";   
                   }      
             } 
      }              
     // alert(tabCont);
     tableSort.html(tabCont);
      var thCurt = $('#'+tab+ ' tr:eq(0)').children("th").eq(sortNum);
      thCurt.children("img").hide();
      if(srt=='A'){
         thCurt.children("img.asc").show();
      }else{
         thCurt.children("img.desc").show();
      }
      thCurt.removeClass("th_hover").addClass("th_hover");
 	  thCurt.siblings().children("img").hide(); 
 	  // 列移动
 	  /*
 	   setTimeout(function(){
		         if(tableSort.attr("notDrag")){
			          return;
		           }else{
		              if(tableSort.find("div").length>0){
		                 tableSort.find("tr:first").find("th:gt(0)").each(function(){
                            var divDrag = $(this).children("div");
                            divDrag.replaceWith("");
        	                if(undefined==$(this).attr("drag")&&$(this).find(":checkbox").length==0&&$(this).find(".resizeDivClass").length==0){
        		                 var $div = $("<div class='resizeDivClass' style='display:inline;'>&nbsp;</div>");
        		                 $div.mousedown(function(event){$().mousedone.movedown(event,this);});
        		                 $div.mousemove(function(event){$().mousedone.moveresize(event,this);});
        		                 $div.mouseup(function(event){$().mousedone.upresize(event,this);});
        		                 $div.appendTo($(this));
        		             }
                         });  
		              }else{
		                // tableSort.movedTh();
		              }
		           }
		    
		    }, 500);*/
 }

 // 生成空白行
function createTr(len,rowSize,count){ 
     var retHtml = '';      
	 for( len ;len < rowSize ;len++){
		  var trn ="<tr >";
		  if(len%2==trOdd ){
			trn=" <tr class='odd'>";
		  }
		 //retHtml += trn +"<td onclick='stopBubble(event)'> <input  name='checkName_null' type='checkbox'  disabled='disabled' /> </td>";
		 retHtml += trn +"<td onclick='stopBubble(event)'> &nbsp; </td>";
		 for(var i =1;i<count;i++){
		 	retHtml += "<td></td>";
		 }
		retHtml += "</tr>";
  }
	return retHtml;
}

function fullTable(tab,row,cell){
	 var content = $("#"+tab +" tr:first-child").html(); 
	 content = "<tr>"+content+"</tr>";
	 var htm = content;
    var rthtm = createTr(0,row,cell);
	 htm += rthtm;
    $("#"+tab).html(htm);
}
 
 // ---全选/全不选---
 jQuery("input[name=checkbox_all_chose]").die().live({
   click:function(){  
     var table = $(this).parent().parent().parent().parent();
     var sig = table.attr("single"); //  single='1'  单选
     if(sig == '1'){ // 单选
       return false;
     }else{
     	var firstckb = $(this).attr("checked");
     	var chk = table.find("input[type=checkbox]:enabled");
		chk.attr("checked",firstckb);
	    var trChk = chk.parent().parent();
		if(firstckb){
			trChk.addClass("selsetedTr");
		}else{
			trChk.removeClass("selsetedTr");
		}
     }
   } 
 });