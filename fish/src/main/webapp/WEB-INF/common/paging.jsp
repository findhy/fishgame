<%--同步请求分页--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="com.game.fish.util.Page,java.util.*"%>
<%
   //对应的分页bean的名称，就是action里定义的名称,默认不传的话是page
   String pageStr = request.getParameter("pageBeanName");
   String select =request.getParameter("select");
   String moreSelect = request.getParameter("moreSelect");
   String emptyShow =request.getParameter("emptyShow");//如果查询结果为空是否需要提示信息
   
   
   Page pager = new Page();
   if(pageStr!=null&&!pageStr.trim().equals("")){
	   pager = (Page)request.getAttribute(pageStr);
   }else{
	   pager = (Page)request.getAttribute("page");
	   pageStr = "page";
   }
   //每页显示多少条list
   List<Integer> selectList = new ArrayList<Integer>();
   if(moreSelect!=null&&moreSelect.equals("true")){
	   selectList.add(new Integer(10));
	   selectList.add(new Integer(20));
	   selectList.add(new Integer(30));
	   selectList.add(new Integer(75));
	   selectList.add(new Integer(125));
	   selectList.add(new Integer(250));
   }else if(moreSelect!=null&&!moreSelect.equals("")){
	   String[] str= moreSelect.split(",");
	   for(int i=0;i<str.length;i++)
		   selectList.add(new Integer(str[i]));
   }else{
	   selectList.add(new Integer(20));
	   selectList.add(new Integer(50));
	   selectList.add(new Integer(100));
   }
%>
<div class="pages panelBar">
    
      <input type="hidden" name="pageno" value="<%=pager.getPageno()%>" id="<%=pageStr%>no" />
      <input type="hidden" name="start" value="<%=pager.getStart()%>" id="<%=pageStr%>start" />
      <input type="hidden" name="rowsize" value="<%=pager.getRowsize()%>" id="<%=pageStr%>rowsize" />
      <% if(pager.getTotalrows()>0){
         %>
    
	<table width="100%" border="0" cellspacing="0" cellpadding="0" notSort="true" pageBody="pageBody">
      <tr>
        <td width="10">
        <%
        	if(select==null||!select.equals("false")){
        %>
        <select onchange="changePageSize(this.value,'<%=pageStr%>')" id="selectPageRowSize">
           <%
             for(Integer i : selectList){
            	 if(i.equals(pager.getRowsize())){
           %>
              <option value="<%=i %>" selected><%=i %></option>
           <%
            	 }else{
   		   %>
              <option value="<%=i %>"><%=i %></option>
           <% 		 
            	 }
             }
           %>
        </select>
        <%}else{
        	%>
        	&nbsp;
        	<% } %>
        </td>
        <%
          if(pager.getPageno()==1){
        %>
        <td width="10">
        <input name="" type="button" class="no_page_first"/>
        </td>
        <td width="10">
        	<input name="" type="button" class="no_page_prev"/>
        </td>
        <%  	  
          }else{
   	    %>
   	    <td width="10">
   	    <input name="" type="button" class="page_first" onclick="pageSw(0,1,<%=pager.getRowsize()%>,'<%=pageStr%>')"/>
        </td>
        <td width="10">
        	<input name="" type="button" class="page_prev" onclick="pageSw(<%=pager.getStart()-pager.getRowsize()%>,<%=pager.getPageno()-1%>,<%=pager.getRowsize()%>,'<%=pageStr%>')"/>
        </td>
        <%   	  
          }
        %>
        <td width="2">
       	  <div class="tab_sep"></div>
        </td>
        <td width="10" class="tab_text">
                   第<input id="page_currentPageNo" class="pag_inpt" type="text" value="<%=pager.getPageno()%>" size="4" onkeydown="pageGo(event,this.value,<%=pager.getTotal()%>,<%=pager.getRowsize()%>,'<%=pageStr%>')");">
	       页&nbsp;&nbsp;共<font style="font-weight:bold"><%=pager.getTotal()%></font>页
        </td>
        <td width="2">
       	  <div class="tab_sep"></div>
        </td>
        
         <%
         if(pager.getPageno()==pager.getTotal()||pager.getTotal()==0){
	     %>
	       <td width="10">
        	<input name="" type="button" class="no_page_next"/>
          </td>
          <td width="10">
        	<input name="" type="button"  class="no_page_last"/>
          </td width="20">
          <td>
                                 共<font style="font-weight:bold"><%=pager.getTotalrows()%></font> 条数据
          </td>
	     <%
	       }else{
		 %>
		  <td width="10">
        	<input name="" type="button" class="page_next" onclick="pageSw(<%=pager.getStart()+pager.getRowsize() %>,<%=pager.getPageno()+1%>,<%=pager.getRowsize()%>,'<%=pageStr%>')"/>
          </td>
          <td width="30" >
        	<input name="" type="button" class="page_last" onclick="pageSw(<%=(pager.getTotal()-1)*pager.getRowsize()%>,<%=pager.getTotal()%>,<%=pager.getRowsize()%>,'<%=pageStr%>')"/>
          </td>
          <td>
                                 共<font style="font-weight:bold"><%=pager.getTotalrows()%></font> 条数据
          </td>
	     <%	  
	       }
	     %>
        <td class="tab_item">
        <%
          if(pager.getPageno()==pager.getTotal()){
        %>
                       第<%=pager.getStart()+1%>到<%=pager.getTotalrows()%>条数据 &nbsp;&nbsp;
        <%
          }else{
   	    %>
   	           第<%=pager.getStart()+1%>到<%=pager.getStart()+pager.getRowsize()%>条数据 &nbsp;&nbsp;
        <%	  
          }
        %>
        </td>
      </tr>
    </table>
    	 <%
      }%>



<script type="text/javascript">
var formId;
$(document).ready(function(){
	formId = '${param.searchFormId}';
	<%-- if(formId!=""){
	var isParent='${param.isParentForm}';
    //复制查询表单的内容
    var searchForm=isParent=='yes'?$('#'+formId,window.parent.document):$('#'+formId);
	//var searchForm = $("form[name='searchRoleForms']");
	if(searchForm.length==1){
		var inputs=searchForm.find('input');
		var selects=searchForm.find('select');
		var textareas = searchForm.find('textarea');
		//为了兼容ie7的bug,form放在ie7外面会有空白区域
		if(inputs.length==0){
			inputs = $("#"+formId).parent("table").find("input");
		}
		var pagerForm=document.getElementById('util<%=pageStr %>form');
		if(searchForm.attr("action")!=""){
			pagerForm.action = searchForm.attr("action");
		}
		if(searchForm.attr("namespace")!=""){
			pagerForm.namespace = searchForm.attr("namespace");
		}
		if(searchForm.attr("target")!=""){
			pagerForm.target=searchForm.attr("target");
		}
		for(var i=0;i<textareas.length;i++){
			var textareasFid = textareas[i].cloneNode(true);
			textareasFid.removeAttribute('id');
			textareasFid.style.display = 'none';//元素隐藏
			pagerForm.appendChild(textareasFid);
		}
		for(var i=0;i<inputs.length;i++){
			if(inputs[i].type!='submit'&&inputs[i].type!='reset'){
				var inputField = inputs[i].cloneNode(true);
				inputField.removeAttribute('id');
				inputField.style.display = 'none';//元素隐藏
				pagerForm.appendChild(inputField);
			}
		}
		for(var i=0;i<selects.length;i++){
			var selectedValue = selects[i].value;
			var selectField = selects[i].cloneNode(true);
			selectField.value = selectedValue;
			selectField.removeAttribute('id');
			selectField.style.display = 'none';//元素隐藏
			pagerForm.appendChild(selectField);
		}
		
	}
	} --%>
	
	if(<%=emptyShow %>){
		if(<%=request.getParameter("emptyMsg")%>==null&&<%=pager.isEmptyMsg() %>&&<%=pager.getList().size()%>==0){
			top.mainFrame.alertShow("没有查询到符合条件的内容！");
		}
	}

	
});

function pageSw(start,pageNo,rowSize,pageStr){
	$("#"+pageStr+"rowsize").attr("value",rowSize);
	$("#"+pageStr+"no").attr("value",pageNo);
	$("#"+pageStr+"start").attr("value",start);
	openWaitWin();
	$("#"+formId).submit();
}

//到第几页
function pageGo(e,pageN,total,rowSize,pageStr){
	//IE、谷歌和火狐浏览器监听回车事件
	var charCode = "";
	try{
		charCode = (navigator.appName=="Netscape")?e.which:e.keyCode;
	}catch(e){
	}
	//如果操作是回车的话
	if(charCode == 13){
		//页面比总页码大
		if(pageN>total){
			
		}else{
			pageSw((pageN-1)*rowSize,pageN,rowSize,pageStr);
		}
	}
}
//修改每页显示个数
function changePageSize(value,pageStr){
	pageSw(0,1,value,pageStr);
}

//?
function onSubmit(){
	return true;
}

/**
 * 
 * @param pageName page名称
 * 
 * 操作完成需要刷新页面，而且需要记住当前是第几页，查询条件的时候。调用该方法，传入pageName  不传默认是"page"
 */
function reloadPage(pageName){
	if(!pageName)
		pageName = "page";
	openWaitWin();
	$("#util"+pageName+"form").submit();
}

//快速调用
var reloadByPage=function(){
	reloadPage();
};

function getCurrPageFormUrl(pageName){
	if(!pageName)
		pageName = "page";
	return $("#util"+pageName+"form").attr("action")+"?"+$("#util"+pageName+"form").serialize();
}
</script>
</div>