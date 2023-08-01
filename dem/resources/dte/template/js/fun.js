/**
 *
 */
const OBJECT=1;
const SQL=2;
const CODE=3;

function createPieChart(chartNode, title, subtitle, xaxisName, yaxisNames,showLegend, seriesData) {
	Highcharts.setOptions({colors:['#5CB85C','#F0AD4E','#D9534F','#cacaaa']});
    chartNode.highcharts(
        {
		//	colors:['#5CB85C','#F0AD4E','#D9534F','#cacaaa'],
            chart: {
                type: 'pie',
                height:255,
				
				plotShadow:false,
				showAxes:false
            },
            title: {
                text: title==null?'':('<b>'+title+'</b>')
            },
            subtitle: {
                text: subtitle
            },
            xAxis: {
                title: {
                    align:'high',
                    text: '<b>'+xaxisName+'</b>'
                },
                type: 'datetime'
            },
            yAxis: {
                title: {
                    align:'high',
                    text: '<b>'+yaxisNames+'</b>'
                },
                min:0
            },
            tooltip: {
				formatter:  function()
				{
					return '<span style="color:'+this.point.series.color+'">'+this.point.name+':'+this.point.y.toFixed(1)+'%</span>';
				}

            },
            plotOptions: {
                pie: {
                    allowPointSelect:true,
					cursor:'pointer',
					showInLegend:true,
					dataLabels:
					{
						enabled:false
					}
                }
            },
            legend: {
                enabled: showLegend
            }
            ,
            credits: {
                enabled: false,
                text: 'dameng.com',
                href: 'http://www.dameng.com'
            }
            ,
            exporting: {
                enabled: false
            }
            ,
            series: seriesData
        }
    )
    ;
}

function setTableElements(tableNode,tableData,page,pagesize)
{

	if(page)
	{
	   addTablePage(tableNode,tableData,pagesize);		
	}
	else
	{
		var theadTr=$(tableNode.children('thead')[0]).children('tr')[0];
		var ths=$(theadTr).children();
		var tbody=tableNode.children('tbody')[0];
        tbody.innerHTML='';
		for(var  index in tableData)
		{
			var recordData = tableData[index];
			var pNode = $('<tr class="'+('success')+'"></tr>');
			for (i = 0; i < recordData.length; i++) {
				
				if(ths!=null && i<ths.length&&$(ths[i]).text()=='操作')
				{//简单实现
					var actions=recordData[i];
					if(actions.length == 0)
					{
						$('<td></td>').appendTo(pNode);
					}
					else
					{
						var tdNode=$('<td style="width:120px;text-align:center"></td>');
						for(var actionIndex in actions)
						{
							var action=actions[actionIndex];
							
							$('<a href="#" onClick="'+action.onclick+'"></a>').text(action.actionName).appendTo(tdNode);
						}
						tdNode.appendTo(pNode);
					}
					
				}
				else if(ths!=null && i==0 &&($(ths[i]).text()==null||$(ths[i]).text()==''))
				{
					$('<td></td>').text(parseInt(index)+1).appendTo(pNode);
				}
				else
				{
					var $td=$('<td></td>');
					$td.text(recordData[i]).appendTo(pNode);
					$td.click(function(){
						var text=$(this).text();
						var modalParent=$('#dialog-td-detail');
						modalParent.html('');
						
						var modalDialog=$('<div class="modal-dialog" style="height:500px;width:750px;overflow:hidden;" role="document"></div>');
						modalDialog.appendTo(modalParent);
						var modalContent=$('<div class="modal-content"></div>');
						modalContent.appendTo(modalDialog);
						
						var modalHeader=$('<div class="modal-header"></div>');
						modalHeader.appendTo(modalContent);
						var closeButton=$('<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>');
						closeButton.appendTo(modalHeader);
						var closeSpan=$('<span aria-hidden="true">&times;</span>');
						closeSpan.appendTo(closeButton);
						var modalTitle=$('<h4 class="modal-title" id="dialog-td-detail-title">查看数据</h4>');
						modalTitle.appendTo(modalHeader);
						
						var modalBody=$('<div class="modal-body"></div>');
						modalBody.appendTo(modalContent);

						
						var textAreaSource=$('<textarea  style="width:100%;height:400px;border:0px">').text(text);
						textAreaSource.appendTo(modalBody);
						
					
				    $('#dialog-td-detail').on('show.bs.modal',function()
					{
						var $this=$(this);
						var $modalDialog=$this.find('.modal-dialog');
						var $modalBody=$this.find('.modal-body');
						dialogHeight=$modalDialog.height();
						dialogWidth=$modalDialog.width();
						windowHeight=$(window).height();
						windowWidth=$(window).width();
						if(windowHeight<dialogHeight)
						{
							return;
						}
					
						$modalDialog.css({
							"postion":"absolute",
							"margin-left":(windowWidth-dialogWidth)/2,
							"margin-top":(windowHeight-dialogHeight)/2
						});
					});
					$('#dialog-td-detail').modal({backdrop:"static"}); 
					})
				}
				
			}
			pNode.appendTo(tbody);
		}
	}
}
function viewData(recordData ,i)
{
	

}

function viewObjDetail(type,index)
{
	var data=findObjOrSqlById(type,index);
	createObjDetailDialog(type,data);
	addTabClick();
    $('#dialog-obj-detail').on('show.bs.modal',function()
	{
		var $this=$(this);
		var $modalDialog=$this.find('.modal-dialog');
		var $modalBody=$this.find('.modal-body');
		dialogHeight=$modalDialog.height();
		dialogWidth=$modalDialog.width();
		windowHeight=$(window).height();
		windowWidth=$(window).width();
		if(windowHeight<dialogHeight)
		{
			return;
		}
	
		$modalDialog.css({
			"postion":"absolute",
			"margin-left":(windowWidth-dialogWidth)/2,
			"margin-top":(windowHeight-dialogHeight)/2
		});
	});
	$('#dialog-obj-detail').modal({backdrop:"static"}); 

}

function findObjOrSqlById(type,id)
{
	
	if(type==SQL)
	{
		for(var  index in sqlDatas)
		{
			var sqlData = sqlDatas[index];
			if(sqlData.index==id)
			{
				return sqlData;
			}
			
		}
	}
	else if(type==CODE)
	{
		for(var  index in codeDatas)
		{
			var codeData = codeDatas[index];
			if(codeData.index==id)
			{
				return codeData;
			}
			
		}
	}
	else
	{
		for(var  index in objDatas)
		{
			var objData = objDatas[index];
			if(objData.index==id)
			{
				return objData;
			}
			
		}
	}

	return null;
}

function createCodeDetailDialogBody(modalBody,data)
{
  var div=$('<div style="height:430px;"></div>')
  div.appendTo(modalBody);
  var codeDetailTable=$('<table id="table_code_file_detail" class="table table-bordered" style="margin-bottom:5px;" ></table>');
  codeDetailTable.appendTo(div);
  var thead=$('<thead></thead>');
  thead.appendTo(codeDetailTable);
  
  var tr=$('<tr class="info"></tr>');
  tr.appendTo(thead);
  
  var th=$('<th width="20"></th>');
  th.appendTo(tr);
 
  th=$('<th width="180">位置</th>');
  th.appendTo(tr);
  
  th=$('<th width="150">原始代码</th>');
  th.appendTo(tr);
  
  th=$('<th width="calc(100%-180px-150px-20px)">修改建议</th>');
  th.appendTo(tr);
  
  var tbody =$('<tbody></tbody>');
  tbody.appendTo(codeDetailTable);
  
  refreshCodeFileDetailTableElement(data);
 
}

function createObjDetailDialog(type,data)
{
	var modalParent=$('#dialog-obj-detail');
	modalParent.html('');
	
	var modalDialog=$('<div class="modal-dialog" style="height:600px;width:800px;overflow:hidden;" role="document"></div>');
	modalDialog.appendTo(modalParent);
	var modalContent=$('<div class="modal-content"></div>');
	modalContent.appendTo(modalDialog);
	
	var modalHeader=$('<div class="modal-header"></div>');
	modalHeader.appendTo(modalContent);
	var closeButton=$('<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>');
	closeButton.appendTo(modalHeader);
	var closeSpan=$('<span aria-hidden="true">&times;</span>');
	closeSpan.appendTo(closeButton);
	var modalTitle=$('<h4 class="modal-title" id="dialog-obj-detail-title">详情</h4>');
	modalTitle.appendTo(modalHeader);
	
	var modalBody=$('<div class="modal-body"></div>');
	modalBody.appendTo(modalContent);

	var bodyUpper;
	if(type==SQL)
	{
		bodyUpper=$('<h5 class="modal-title">'+'<font color=\"#003168\">对象类型:</font>SQL<font color=\"#003168\">  兼容情况:</font>'+data.status+'</h5>');
	}
	else if(type==CODE)
	{
		bodyUpper=$('<h5 class="modal-title">'+'<font color=\"#003168\">  程序文件:</font>'+data.file+'<font color=\"#003168\">  兼容情况:</font>'+data.status+'</h5>');
	}
	else
	{
		bodyUpper=$('<h5 class="modal-title">'+'<font color=\"#003168\">对象类型:</font>'+data.type+'<font color=\"#003168\">  对象名:</font>'+data.name+'<font color=\"#003168\">  所属模式:</font>'+data.schema+'<font color=\"#003168\">  兼容情况:</font>'+data.status+'</h5>');
	}
	bodyUpper.appendTo(modalBody);
	
	if(type==CODE)
	{
	  createCodeDetailDialogBody(modalBody,data);
	  return;
	}
	// var bodyUpper=$('<form class="form-inline" role="form"></form>');
	// bodyUpper.appendTo(modalBody);
	// var objDesc=$('<font color=\"#003168\">对象名:</font>'+data.name);
	// objDesc.appendTo(bodyUpper);
	
	var objTab=$('<div class="tab"></div>');
	objTab.appendTo(modalBody);
	
	var objTabMenu=$('<div class="tab_menu"></div>');
	objTabMenu.appendTo(objTab);
	var objTabMenuUl=$('<ul></ul>');
	objTabMenuUl.appendTo(objTabMenu);
	var title="DDL";
	var source="";
	var dest="";
	if(type=SQL)
	{
		title="SQL";
		source=data.sql;
		dest=data.dest;
	}
	else
	{
		source=data.source;
		dest=data.dest;
	}
	var objTabMenuSourceLi=$('<li class="selected">原'+title+'</li>');
	objTabMenuSourceLi.appendTo(objTabMenuUl);
	if(data.status!='完全兼容')
	{
		var objTabMenuDestLi=$('<li>目的'+title+'</li>');
		objTabMenuDestLi.appendTo(objTabMenuUl);
	}
	
	var tabBox=$('<div class="tab_box" style="height:430px;overflow:hidden;"></div>');
	tabBox.appendTo(objTab);
	
	var tabSource=$('<div class="tab_box_con"></div>');
	tabSource.appendTo(tabBox);
	var textAreaSource=$('<textarea  style="width:100%;height:430px;border:0px">').text(source);
	textAreaSource.appendTo(tabSource);
	
	if(data.status!='完全兼容')
	{
		var tabDest=$('<div class="tab_box_con hide"></div>');
		tabDest.appendTo(tabBox);
		var textAreaDest=$('<textarea  style="width:100%;height:430px;border:0px"></textarea>').text(dest);
		textAreaDest.appendTo(tabDest);
	}
	
}
function addTablePage(tableNode,tableData,pageSize)
{
	var currentPage=1;
	var sumRow=tableData.length;
	var $pager=$('<div class="container" style="padding-left: 5px;margin-top:5px;margin-right:auto;margin-left:0px;width:100%;">');
	$('<span style="color:#8b9dc1;width:100%;">').text('总共'+sumRow+'条记录,每页显示'+pageSize+'条记录').appendTo($pager);
	
	var $changepager=$('<span style="float:right;">');
	$changepager.appendTo($pager);
	
	var $ul=$('<ul class="pagination" style="margin-top:0px;margin-bottom:5px;">');
	$ul.appendTo($changepager);

  

	var sumPages=Math.ceil(sumRow/pageSize);
	var $firstPage=$('<li><a href="#">首页</a></li>').bind('click',function(){
		currentPage=1;
		changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData);
		
	});
	$firstPage.appendTo($ul);
	
	var $prePage=$('<li><a href="#">上一页</a></li>').bind('click',function(){
		currentPage--;
		changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData);
		
	});
	$prePage.appendTo($ul);
	
	var $npageSpan=$('<span style="margin-top:5px;margin-bottom:5px;display:inline-block; vertical-align:top"></span>');
	$npageSpan.appendTo($changepager);
	var $npage=$('<input type="text" style="width:68px;text-align:right;" value="'+currentPage+'; onpropertychange=npageChange()"></input>');
	$npage.bind('input propertychange',function()
	{
	    currentPage=$(this).val();
		changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData);
	});
	 $npage.appendTo($npageSpan);
	 $('<span>/'+sumPages+'</span>').appendTo($npageSpan);


	var $ul1=$('<ul class="pagination" style="margin-top:0px;margin-bottom:5px;">');
	$ul1.appendTo($changepager);

	var $nextPage=$('<li><a href="#">下一页</a></li>').bind('click',function(){
		currentPage++;
		changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData);
		
	});
	
	$nextPage.appendTo($ul1);
	
	var $lastPage=$('<li><a href="#">最后一页</a></li>').bind('click',function(){
		currentPage=sumPages;
		changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData);
		
	});
	$lastPage.appendTo($ul1);
    changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData);
	$pager.insertAfter(tableNode);
}



function changePage($firstPage,$prePage,$npage,$nextPage,$lastPage,currentPage,pageSize,tableNode,tableData)
{
	
	var sumRow=tableData.length;
	var sumPages=Math.ceil(sumRow/pageSize);
	if(currentPage<1 || currentPage>sumPages)
	{
		$npage.val(0);
	    setTableElements(tableNode,tableData,false,pageSize);
		return;
	}
	$npage.val(currentPage);
    //修改首页按钮状态
	if(currentPage==1)
	{
		$firstPage.addClass('disabled');
	}
	else
	{
		$firstPage.removeClass('disabled');
	}
	
	//修改上一页按钮状态
	if(currentPage==1)
	{
		$prePage.addClass('disabled');
	}
	else
	{
		$prePage.removeClass('disabled');
	}
	
	//修改第n页按钮状态
	// for(var pageIndex=1;pageIndex<=sumPages;pageIndex++)
	// {
		
		// if(pageIndex==currentPage)
		// {
			// $pagelis[pageIndex-1].addClass('active');
		// }
		// else
		// {
			// $pagelis[pageIndex-1].removeClass('active');
		// }	   
	// }
	
	//修改下一页按钮状态
	if(currentPage>=sumPages)
	{
		$nextPage.addClass('disabled');
	}
	else
	{
		$nextPage.removeClass('disabled');
	}
	
	//修改最后一页按钮状态
	if(currentPage==sumPages)
	{
		$lastPage.addClass('disabled');
	}
	else
	{
		$lastPage.removeClass('disabled');
	}
	
	//刷新数据
    var pageTableDatas=[];
	var index=0;
	for (var i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i++)
	{
		if (i < tableData.length)
		{
		   pageTableDatas[index++]=tableData[i];
		}
		else
		{
			continue;
		}
	}
	
	setTableElements(tableNode,pageTableDatas,false,pageSize);
	
	
}


function setOverviewElements(overviewNode,overviewData)
{
	for(var  index in overviewData)
    {
        var recordData = overviewData[index];
        $('<p></p>').text(recordData.name+':'+recordData.value).appendTo(overviewNode);
    }
}

function addTabClick()
{
	var $div_li =$("div.tab_menu ul li");
        $div_li.click(function(){
		
			$(this).addClass("selected")             //当前<li>元素高亮
                   .siblings().removeClass("selected");   //去掉其它同辈<li>元素的高亮

			var key =  $div_li.index(this);   // 获取当前点击的<li>元素 在 全部li元素中的索引。
			$("div.tab_box > .tab_box_con")        //选取子节点。不选取子节点的话，会引起错误。如果里面还有div
					.eq(key).removeClass("hide").show()    //显示 <li>元素对应的<div>元素
					.siblings().hide();  //隐藏其它几个同辈的<div>元素
			}
		)
}

//对象类型导航树点击
function addObjTypeNavClick()
{
	var $div_li =$("#obj-type-nav ul li");
	$div_li.click(function(){
		$(this).addClass("active")             //当前<li>元素高亮
			   .siblings().removeClass("active");   //去掉其它同辈<li>元素的高亮

		//刷新表格数据
		refreshObjTableElement();
	}
	)
}


//对象/兼容详情搜索框keypress
function onSearchKeyPress(event,type)
{
	if(event.keyCode=="13")
	{
		if(type==SQL)
		{
			refreshSqlTableElement();
		}
		else if(type == OBJECT)
		{
			refreshObjTableElement();
		}
	    else if(type == CODE)
		{
			refreshCodeTableElement();
		}
        event.preventDefault();
	}
	
}

function createObjDetailTableDatas()
{
	var datas =[];
	var i=0;
	for(var  index in objDatas)
	{
		var objData = objDatas[index];
		datas[i++]=[objData.index,objData.name,objData.schema,objData.type,objData.status,[{actionName:"查看详情",onclick:"viewObjDetail(OBJECT,"+objData.index+")"}]];
	}
	return datas;
}

function createSqlDetailTableDatas()
{
	var datas =[];
	var i=0;
	for(var  index in sqlDatas)
	{
		var sqlData = sqlDatas[index];
		datas[i++]=[sqlData.index,sqlData.sql,sqlData.status,[{actionName:"查看详情",onclick:"viewObjDetail(SQL,"+sqlData.index+")"}]];
	}
	return datas;
}

function createCodeDetailTableDatas()
{
	var datas =[];
	var i=0;
	for(var  index in codeDatas)
	{
		var codeData = codeDatas[index];
		datas[i++]=[codeData.index,codeData.file,codeData.status,[{actionName:"查看详情",onclick:"viewObjDetail(CODE,"+codeData.index+")"}]];
	}
	return datas;
}


function refreshObjTableElement()
{
	//var searchObjType=$("#obj-type-nav ul li.active").text();
	var searchObjType=$("#select_obj_type option:selected").val();
	var searchStatus=$("#select_obj_status option:selected").val();
	var searchStr=$("#search-object").val();
	filterTableElement($('#table_obj_detail'),createObjDetailTableDatas(),searchObjType,searchStatus,searchStr,3,4,10);
}

function refreshSqlTableElement()
{
	var searchStatus=$("#select_sql_status option:selected").val();
	var searchStr=$("#search-sql").val();
	filterTableElement($('#table_sql_detail'),createSqlDetailTableDatas(),null,searchStatus,searchStr,-1,2,5);
}

function refreshCodeTableElement()
{
	var searchStatus=$("#select_code_status option:selected").val();
	var searchStr=$("#search-code").val();
	filterTableElement($('#table_code_detail'),createCodeDetailTableDatas(),null,searchStatus,searchStr,-1,2,10);
}

function refreshCodeFileDetailTableElement(data)
{
	filterTableElement($('#table_code_file_detail'),data.detail,null,null,null,-1,2,5);
}

function filterTableElement(tableNode,tableData,searchObjType,searchStatus,searchStr,objTypeIndex,objStatusIndex,pageSize)
{

	var filterData=[];
	var i=0;
	var filtered=false;
	for(var  index in tableData)
    {
		var recordData = tableData[index];
	    filtered=false;
		if(!filtered)
		{
			
			if(searchObjType!=null)
			{
				if(!(searchObjType.indexOf('所有')>=0|| recordData[objTypeIndex]==searchObjType))
				{
					filtered=true;
				}
			}
		}
		if(!filtered)
		{
			if(searchStatus!=null)
			{
				if(!(searchStatus.indexOf('所有')>=0 || recordData[objStatusIndex]==searchStatus))
				{
					filtered=true;
				}
			}
		}
		if(!filtered)
		{	
			if(searchStr!=null)
			{
				if(!(recordData[1].toLowerCase().indexOf(searchStr.toLowerCase())>=0))
				{
					filtered=true;
				}
			}
		}
		if(!filtered)
		{
			filterData[i++]=recordData;
		}
		
	}
	//删除翻页按钮
	if(tableNode.siblings('div')[0]!=null)
	{
		tableNode.siblings('div')[0].remove();
	}
	addTablePage(tableNode,filterData,pageSize);
}

//TODO有点问题，没有滚动条时列头和数据列不对齐
/*
 css添加滚动条必须 
thead,tbody tr{
	display:table;
	width:100%;
	table-layout:fixed;
}
*/
function createScrollTable(parentNode,id,columns,tableHeight,tableData)
{
	var table=$('<table id='+id+' class="table table-bordered">');
	table.appendTo(parentNode);
	var head=$('<thead>');
	head.appendTo(table);
	var headTr=$('<tr class="info">');
	headTr.appendTo(head);
	for(var colNum=0;colNum<columns.length;colNum++)
	{
		$('<th width="'+columns[colNum].width+'">'+columns[colNum].name+'</th>').appendTo(headTr);
	}
	$('<th width="17"></th>').appendTo(headTr);//滚动条列
	 var tbody=$('<tbody style="max-height:'+tableHeight+'px; overflow-y:auto; display:block;">').appendTo(table);//height:440px; overflow-y:auto; display:block;滚动条必须
	
		
		for(var  index in tableData)
		{
			var recordData = tableData[index];
			var pNode = $('<tr class="'+('success')+'"></tr>');
			for(var colNum=0;colNum<columns.length;colNum++)
			{
				$('<td width="'+columns[colNum].width+'"></td>').text(recordData[colNum]).appendTo(pNode);
			}
			pNode.appendTo(tbody);
		}
}

function addSelectTypeFilter()
{
	var select=$("#select_obj_type");
	var options =[];
	var i=0;
	for(var  index in objDatas)
	{
		var objData = objDatas[index];
		if(options.indexOf(objData.type)==-1)
		{
			options[i++]=objData.type;
		}
	}
	$('<option>所有对象类型</option>').appendTo(select);
	for(var optionIndex in options)
	{
		$('<option>'+options[optionIndex]+'</option>').appendTo(select);
	}
}