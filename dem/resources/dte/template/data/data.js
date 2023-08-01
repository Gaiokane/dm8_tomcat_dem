var estimateName="aaa";
var sourceOverviewData=[
{name:"数据库类型",value:"Oracle"},
{name:"版本",value:"Oracle Database 12c Enterprise Edition Release 12.1.0.1.0 - 64bit Production"},
{name:"编码",value:"US7ASCII"},
{name:"页大小(K)",value:"8"},
{name:"大小写敏感",value:"是"}


]

var destOverviewData=[
{name:"数据库类型",value:"DM"},
{name:"版本",value:"V8.0"},
{name:"编码",value:"GBK"},
{name:"页大小(K)",value:"8"},
{name:"大小写敏感",value:"是"}
]

var objStatisticsPieTitle="兼容率99.4%";
var objStatisticsPieData=[
{
	type:'pie',
	name:"compatiable",
	data:[
			 { 
			    name:"完全兼容(31)",
			    y:10,
			    color:'#5CB85C'

			 },
			 {  
			    name:"转换后兼容(37199)",
			    y:20, 
			    color:'#F0AD4E'
			 },
			 { 
			    name:"不兼容(205)",
			    y:30,
			    color:'#D9534F'
			},
			 {
				name:"兼容状态未知(14)",
			    y:40,
			    color:'#cacaaa'
			  }
		  ]	 
}
];

var sqlStatisticsPieTitle="兼容率99.4%";
var sqlStatisticsPieData=[
{
	type:'pie',
	name:"compatiable",
	data:[
			 { 
			    name:"完全兼容(2025)",
			    y:93.4,
			    color:'#5CB85C'

			 },
			 {  
			    name:"转换后兼容(0)",
			    y:0, 
			    color:'#F0AD4E'
			 },
			 { 
			    name:"不兼容(136)",
			    y:5.6,
			    color:'#D9534F'
			},
			 {
				name:"兼容状态未知(6)",
			    y:1,
			    color:'#cacaaa'
			  }
		  ]	 
}
];




var objStatisticsTableData=[
[1,'模式','100%','1','1','0','0','0'],
[2,'上下文','100%','1','1','0','0','0'],
[3,'目录','100%','1','1','0','0','0'],
[4,'函数','100%','1','1','0','0','0'],
[5,'包','100','1','1','0','0','0'],
[6,'存储过程','100%','1','1','0','0','0'],
[7,'公共同义词','100%','1','1','0','0','0'],
[8,'序列','100%','1','1','0','0','0'],
[9,'模式同义词','100%','1','1','0','0','0'],
[10,'表','100%','1','1','0','0','0'],
[11,'库触发器','100%','1','1','0','0','0'],
[12,'自定义类型','100%','1','1','0','0','0'],
[13,'视图','100%','1','1','0','0','0'],

]

var sqlStatisticsTableData=[
[1,'100%','2167','2025','0','136','6']
]

var objDatas=[
{index:1,name:'aa',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:'aaa'},
{index:2,name:'aa1',schema:'test',type:'表',status:'完全兼容',source:'create table aa1(c1 int)',dest:'sss'},
{index:3,name:'aa2',schema:'test',type:'表',status:'完全兼容',source:'create table aa2(c1 int)',dest:''},
{index:4,name:'aa3',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:5,name:'aa4',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:6,name:'aa5',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:7,name:'aa6',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:8,name:'aa7',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:9,name:'aa8',schema:'test',type:'表',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:10,name:'aab1',schema:'test',type:'视图',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:11,name:'aab2',schema:'test',type:'视图',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:12,name:'aab3',schema:'test',type:'视图',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:13,name:'aab4',schema:'test',type:'视图',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:14,name:'aab5',schema:'test',type:'视图',status:'完全兼容',source:'create table aa(c1 int)',dest:''},
{index:15,name:'aab6',schema:'test',type:'视图',status:'完全兼容',source:'create table aa(c1 int)',dest:''}
]




 var sqlDatas=[
{index:1,sql:'select 1',status:'完全兼容',dest:'bbbbb'},
{index:2,sql:'select 2',status:'完全兼容',dest:'cc'},
{index:3,sql:'select * from table',status:'不兼容',dest:'dd'},

]


var codeStatisticsPieTitle="兼容率99.4%";
var codeStatisticsPieData=[
{
	type:'pie',
	name:"compatiable",
	data:[
			 { 
			    name:"完全兼容(2025)",
			    y:93.4,
			    color:'#5CB85C'

			 },
			 {  
			    name:"转换后兼容(0)",
			    y:0, 
			    color:'#F0AD4E'
			 },
			 { 
			    name:"不兼容(136)",
			    y:5.6,
			    color:'#D9534F'
			},
			 {
				name:"兼容状态未知(6)",
			    y:1,
			    color:'#cacaaa'
			  }
		  ]	 
}
];

var codeStatisticsTableData=[
[1,'100%','2167','2025','0','136','6']
]

/*detail:index,line,source,advise*/
 var codeDatas=[
{index:1,file:'a.c',status:'完全兼容',detail:[[1,4,'aa','sefwe'],[2,4,'aa','sefwe']]},
{index:2,file:'b.java',status:'完全兼容',detail:[[1,4,'aa','sefwe'],[2,4,'aa','sefwe']]},
{index:3,file:'c.pc',status:'完全兼容',detail:[[1,4,'aa','sefwe'],[2,4,'aa','sefwe']]},

]



