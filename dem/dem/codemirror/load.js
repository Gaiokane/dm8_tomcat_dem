/** 
 * 使用时，html中需包含以下两个全局属性
 * @param appName: 应用名称，例如：dem 
 * @param themeName: 主题名称，例如：dark，light
**/
function loadCodemirror(appName, themeName) {
    // theme
    var dir = appName + "/codemirror/theme/" + themeName + "/";
    var skinCss = document.getElementById("codemirror-skin-css");
    if (skinCss != null) {
        skinCss.href = dir + "skin_styles.css";
    }
    else {
        document.write("<" + "script src=" + appName + "/codemirror/lib/codemirror.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/mode/sql/sql.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/mode/xml/xml.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/mode/shell/shell.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/mode/properties/properties.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/hint/show-hint.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/selection/active-line.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/scroll/simplescrollbars.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/lib/dm-extend.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/search/match-highlighter.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/search/matchesonscrollbar.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/search/searchcursor.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/scroll/annotatescrollbar.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/codemirror/addon/merge/merge.js><" + "/script>");
        document.write("<" + "script src=" + appName + "/diffmatchpatch/index.js><" + "/script>");
        document.write("<link rel=\"stylesheet\" href=\"" + appName + "/codemirror/lib/codemirror.css\">");
        document.write("<link rel=\"stylesheet\" href=\"" + appName + "/codemirror/lib/dm-extend.css\">");
        document.write("<link rel=\"stylesheet\" href=\"" + appName + "/codemirror/addon/merge/merge.css\">");
        
        document.write("<link id=\"codemirror-skin-css\" rel=\"stylesheet\" href=\"" + dir + "skin_styles.css\">");
    }
    var hintCss = document.getElementById("codemirror-hint-css");
    if (hintCss != null) {
        hintCss.href = dir + "show-hint.css";
    }
    else {
        document.write("<link id=\"codemirror-hint-css\" rel=\"stylesheet\" href=\"" + dir + "show-hint.css\">");
    }
    var scrollCss = document.getElementById("codemirror-scroll-css");
    if (scrollCss != null) {
        scrollCss.href = dir + "simplescrollbars.css";
    }
    else {
        document.write("<link id=\"codemirror-scroll-css\" rel=\"stylesheet\" href=\"" + dir + "simplescrollbars.css\">");
    }
}

loadCodemirror(appName, themeName);