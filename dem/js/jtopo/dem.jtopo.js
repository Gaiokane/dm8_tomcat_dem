function initJTopo(id) {
	var canvas = document.getElementById(id);
	var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
	var scene = new JTopo.Scene(stage); // 创建一个场景对象
	// 禁止拖拽
	scene.mode = "select";
	scene.areaSelect = false;
	return scene
}

function getCanvasSize(id) {
	var canvas = document.getElementById(id);
	return [ canvas.width, canvas.height ];
}

function createJTopoNode(nodeName) {
	var node = new JTopo.Node(nodeName);
	node.dragable = 0;
	return node;
}

function createJTopoContainer(name) {
	var container = new JTopo.Container(name);

	// 覆盖选中的阴影绘制方法
	container.paintSelected = function(a) {
		a.shadowBlur = 5, a.shadowColor = "rgb(10,10,10,0.5)",
				a.shadowOffsetX = 0, a.shadowOffsetY = 0
	}
	// 禁止拖拽
	container.dragable = 0;
	return container;
}

/**
 * 创建Link节点
 */
function createJTopoLink(nodeA, nodeZ, linkName, type) {
	if (type == 2) {
		return new JTopo.FlexionalLink(nodeA, nodeZ, linkName);
	} else if (type == 1) {
		return new JTopo.FoldLink(nodeA, nodeZ, linkName);
	}
	return new JTopo.Link(nodeA, nodeZ, linkName);
};

/**
 * 创建布局
 */
function createJTopoLayout(rowNum, columnNum, type) {
	if (type == 1) {
		return JTopo.layout.FlowLayout(rowNum, columnNum);
	}
	return JTopo.layout.GridLayout(rowNum, columnNum);
};

function testTopo() {
	// var canvas = document.getElementById('1555376726980');
	// var canvas = document.getElementsByTagName('canvas')[0];
	// var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
	var scene = initJTopo('1555376726980'); // 创建一个场景对象

	var nodeFrom = new JTopo.Node("from");
	var flowLayout = JTopo.layout.GridLayout(1, 1)

	var container = createJTopoContainer("asd");
	container.layout = flowLayout;
	container.setBound(10, 10, 200, 300);
	container.textPosition = 'Top_Left';
	container.fillColor = '255,0,0';
	container.fontColor = '255,100,100';
	container.font = '20px 微软雅黑';
	container.textOffsetY = 20;
	// container.alpha=1;
	// container.dragable = 0;
	container.paintSelected = function(a) {
		a.shadowBlur = 5, a.shadowColor = "rgb(10,10,10,0.5)",
				a.shadowOffsetX = 0, a.shadowOffsetY = 0
	}
	scene.add(container);

	// scene.add(nodeFrom);
	// container.add(nodeFrom);

	var container1 = createJTopoContainer("asd");
	container1.layout = flowLayout;
	container1.setBound(400, 400, 50, 50);
	container1.textPosition = 'Top_Left';
	container1.fillColor = '255,0,0';
	container1.fontColor = '255,100,100';
	container1.font = '20px 微软雅黑';
	container1.textOffsetY = 20;
	// container.alpha=1;
	// container.dragable = 0;
	container1.paintSelected = function(a) {
		a.shadowBlur = 5, a.shadowColor = "rgb(10,10,10,0.5)",
				a.shadowOffsetX = 0, a.shadowOffsetY = 0
	}
	scene.add(container1);

	var line = createJTopoLink(container, container1, 2);
	line.arrowsRadius = 15;
	scene.add(line);

	var node = createJTopoNode("asd");
	node.setBound(200, 300, 20, 20);
	node.dragable = 0;
	scene.add(node);
}
