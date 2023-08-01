/** 
 * 使用时，html中需包含以下两个全局属性
 * @param appName: 应用名称，例如：dem 
 * @param themeName: 主题名称，例如：dark，light
**/

function loadCommonTheme(appName, themeName) {
	var id = "commontheme-load-js";
	var element = document.getElementById(id);
	if (element == null) {
		document.write("<link rel=\"stylesheet\" href=\"" + appName+ "/sc/skins/skin_styles.css\">");
		document.write("<" + "script id=\"" + id + "\" src=" + appName + "/sc/skins/"
			+ themeName + "/load_skin.js><" + "/script>");
		
	}
	else {
		element.parentNode.removeChild(element);
		var script = document.createElement("script");
		script.id = id;
		script.src = appName + "/sc/skins/" + themeName + "/load_skin.js";
		document.body.appendChild(script);
	}
}

loadCommonTheme(appName, themeName);
