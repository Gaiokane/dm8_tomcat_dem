/** 
 * 使用时，html中需包含以下两个全局属性
 * @param appName: 应用名称，例如：dem 
 * @param themeName: 主题名称，例如：dark，light
**/

function loadCommonGwt(appName, themeName){
	var commongwtJs = document.getElementById("commongwt-js");
	if (commongwtJs == null) {
		document.write("<" + "script id=\"commongwt-js\" src=" + appName + "/commongwt/js/common_gwt.js><" + "/script>");
	}
	var commongwtCss = document.getElementById("commongwt-css");
	if (commongwtCss == null) {
		document.write("<link id=\"commongwt-css\" rel=\"stylesheet\" href=\"" + appName + "/commongwt/theme/common_gwt.css\">");
	}
}

loadCommonGwt(appName, themeName);
